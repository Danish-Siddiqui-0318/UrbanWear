const OrderModel = require("../models/OrderModel");
const mongoose = require("mongoose");

async function createOrder(req, res) {
    try {
        const {
            items,
            total,
            customerName,
            customerEmail,
            customerPhone,
            shippingAddress,
            paymentMethod,
            notes,
        } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: "Order items are required" });
        }

        if (typeof total !== "number") {
            return res.status(400).json({ message: "Total amount is required" });
        }

        if (!customerName || !customerEmail || !shippingAddress) {
            return res.status(400).json({
                message: "Customer name, email and shipping address are required",
            });
        }

        const order = await OrderModel.create({
            items,
            total,
            customerName,
            customerEmail,
            customerPhone,
            shippingAddress,
            paymentMethod: paymentMethod || "cod",
            notes,
        });

        return res.status(201).json({
            success: true,
            order,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Failed to create order",
        });
    }
}

async function getOrders(req, res) {
    try {
        const orders = await OrderModel.find().sort({ createdAt: -1 }).limit(100);
        return res.status(200).json({
            success: true,
            orders,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Failed to load orders",
        });
    }
}

async function getOrderStats(req, res) {
    try {
        const now = new Date();
        const startOfToday = new Date(now);
        startOfToday.setHours(0, 0, 0, 0);

        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const [result] = await OrderModel.aggregate([
            {
                $match: {
                    createdAt: { $gte: sevenDaysAgo },
                    status: { $ne: "cancelled" },
                },
            },
            {
                $facet: {
                    today: [
                        {
                            $match: {
                                createdAt: { $gte: startOfToday },
                            },
                        },
                        {
                            $group: {
                                _id: null,
                                ordersCount: { $sum: 1 },
                                revenue: { $sum: "$total" },
                            },
                        },
                    ],
                    last7Days: [
                        {
                            $group: {
                                _id: null,
                                ordersCount: { $sum: 1 },
                                revenue: { $sum: "$total" },
                            },
                        },
                    ],
                    bestCategories: [
                        { $unwind: "$items" },
                        {
                            $lookup: {
                                from: "products",
                                localField: "items.product",
                                foreignField: "_id",
                                as: "productDoc",
                            },
                        },
                        { $unwind: "$productDoc" },
                        {
                            $group: {
                                _id: "$productDoc.category",
                                totalSold: { $sum: "$items.quantity" },
                                revenue: {
                                    $sum: {
                                        $multiply: ["$items.quantity", "$items.price"],
                                    },
                                },
                            },
                        },
                        { $sort: { totalSold: -1 } },
                        { $limit: 5 },
                    ],
                },
            },
        ]);

        const todayStats = (result && result.today && result.today[0]) || {
            ordersCount: 0,
            revenue: 0,
        };
        const last7DaysStats =
            (result && result.last7Days && result.last7Days[0]) || {
                ordersCount: 0,
                revenue: 0,
            };

        return res.status(200).json({
            success: true,
            today: {
                ordersCount: todayStats.ordersCount || 0,
                revenue: todayStats.revenue || 0,
            },
            last7Days: {
                ordersCount: last7DaysStats.ordersCount || 0,
                revenue: last7DaysStats.revenue || 0,
            },
            bestCategories: (result && result.bestCategories) || [],
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Failed to load order stats",
        });
    }
}

async function getProductPerformance(req, res) {
    try {
        const performance = await OrderModel.aggregate([
            {
                $match: {
                    status: { $ne: "cancelled" },
                },
            },
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.product",
                    name: { $first: "$items.name" },
                    totalSold: { $sum: "$items.quantity" },
                    revenue: {
                        $sum: {
                            $multiply: ["$items.quantity", "$items.price"],
                        },
                    },
                },
            },
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "productDoc",
                },
            },
            {
                $unwind: {
                    path: "$productDoc",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $addFields: {
                    category: "$productDoc.category",
                },
            },
            {
                $project: {
                    _id: 0,
                    productId: "$_id",
                    name: 1,
                    category: 1,
                    totalSold: 1,
                    revenue: 1,
                },
            },
            { $sort: { totalSold: -1 } },
        ]);

        return res.status(200).json({
            success: true,
            products: performance,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Failed to load product performance",
        });
    }
}

async function getOrderById(req, res) {
    try {
        const id = req.params.id;
        const order = await OrderModel.findById(id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        return res.status(200).json({
            success: true,
            order,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Failed to load order",
        });
    }
}

async function updateOrderStatus(req, res) {
    try {
        const id = req.params.id;
        const { status, paymentStatus } = req.body;

        const order = await OrderModel.findById(id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (status) {
            order.status = status;
        }
        if (paymentStatus) {
            order.paymentStatus = paymentStatus;
        }

        await order.save();

        return res.status(200).json({
            success: true,
            order,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Failed to update order",
        });
    }
}

module.exports = {
    createOrder,
    getOrders,
    getOrderById,
    updateOrderStatus,
    getOrderStats,
    getProductPerformance,
};
