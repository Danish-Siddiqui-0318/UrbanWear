const OrderModel = require("../models/OrderModel");
const ProductModel = require("../models/Product_Model");
const mongoose = require("mongoose");

async function createOrder(req, res) {
    try {
        const {
            items,
            total,
            customerName,
            customerEmail,
            customerPhone,
            phone, // Fallback from frontend
            shippingAddress,
            paymentMethod,
            notes,
        } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: "Order items are required" });
        }

        if (total === undefined || total === null) {
            return res.status(400).json({ message: "Total amount is required" });
        }

        if (!customerName || !customerEmail || !shippingAddress) {
            return res.status(400).json({
                message: "Customer name, email and shipping address are required",
            });
        }

        const order = await OrderModel.create({
            items,
            total: Number(total),
            customerName,
            customerEmail,
            customerPhone: customerPhone || phone || "",
            shippingAddress,
            paymentMethod: paymentMethod || "cod",
            notes: notes || "",
        });

        req.io.emit("orders-updated");

        return res.status(201).json({
            success: true,
            order,
        });
    } catch (error) {
        console.error("Error creating order:", error);
        return res.status(500).json({
            message: error.message || "Failed to create order",
            error: error.errors // Include detailed validation errors if any
        });
    }
}

async function getOrders(req, res) {
    try {
        const orders = await OrderModel.find()
            .populate("items.product", "name images")
            .sort({ createdAt: -1 })
            .limit(100)
            .lean();

        const processedOrders = await Promise.all(orders.map(async (order) => {
            const items = await Promise.all(order.items.map(async (item) => {
                const productId = item.product || item.productId;
                let recoveredName = item.name;
                let recoveredImage = item.image;

                if (!recoveredName || !recoveredImage) {
                    if (item.product && typeof item.product === 'object') {
                        recoveredName = recoveredName || item.product.name;
                        recoveredImage = recoveredImage || (item.product.images && item.product.images[0]?.url);
                    } 
                    
                    if ((!recoveredName || !recoveredImage) && productId) {
                        try {
                            const p = await ProductModel.findById(productId).select('name images');
                            if (p) {
                                recoveredName = recoveredName || p.name;
                                recoveredImage = recoveredImage || (p.images && p.images[0]?.url);
                            }
                        } catch (e) {
                            console.error("Recovery fetch failed:", e);
                        }
                    }
                }

                return {
                    ...item,
                    product: productId,
                    name: recoveredName || "Product",
                    image: recoveredImage || ""
                };
            }));

            return {
                ...order,
                items
            };
        }));

        return res.status(200).json({
            success: true,
            orders: processedOrders,
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
        const order = await OrderModel.findById(id)
            .populate("items.product", "name images")
            .lean();

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        const items = await Promise.all(order.items.map(async (item) => {
            const productId = item.product || item.productId;
            let recoveredName = item.name;
            let recoveredImage = item.image;

            if (!recoveredName || !recoveredImage) {
                if (item.product && typeof item.product === 'object') {
                    recoveredName = recoveredName || item.product.name;
                    recoveredImage = recoveredImage || (item.product.images && item.product.images[0]?.url);
                } 
                
                if ((!recoveredName || !recoveredImage) && productId) {
                    try {
                        const p = await ProductModel.findById(productId).select('name images');
                        if (p) {
                            recoveredName = recoveredName || p.name;
                            recoveredImage = recoveredImage || (p.images && p.images[0]?.url);
                        }
                    } catch (e) {
                        console.error("Recovery fetch failed:", e);
                    }
                }
            }

            return {
                ...item,
                product: productId,
                name: recoveredName || "Product",
                image: recoveredImage || ""
            };
        }));

        return res.status(200).json({
            success: true,
            order: {
                ...order,
                items
            },
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

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid order ID format" });
        }

        const updateData = {};
        if (status) updateData.status = String(status).toLowerCase();
        if (paymentStatus) updateData.paymentStatus = String(paymentStatus).toLowerCase();

        // Use direct MongoDB collection update to bypass ALL Mongoose validation
        const result = await OrderModel.collection.updateOne(
            { _id: new mongoose.Types.ObjectId(id) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Fetch the updated order to return it (using lean to avoid any validation)
        const updatedOrder = await OrderModel.findById(id).lean();

        req.io.emit("orders-updated");

        return res.status(200).json({
            success: true,
            order: updatedOrder,
        });
    } catch (error) {
        console.error("CRITICAL NATIVE UPDATE ERROR:", error);
        return res.status(500).json({
            message: "Failed to update order",
            error: error.message,
            stack: error.stack
        });
    }
}

async function getOrdersByCustomerEmail(req, res) {
    try {
        const email = req.params.email;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        const esc = email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const orders = await OrderModel.find({
            customerEmail: { $regex: new RegExp(`^${esc}$`, "i") },
        })
            .populate("items.product", "name images")
            .sort({ createdAt: -1 })
            .limit(100)
            .lean(); // Use lean() to handle legacy data keys

        // Map through orders to ensure each item has name and image (recovery for legacy orders)
        const processedOrders = await Promise.all(orders.map(async (order) => {
            const items = await Promise.all(order.items.map(async (item) => {
                // 1. Handle legacy ID field (productId vs product)
                const productId = item.product || item.productId;
                
                // 2. If name or image is missing, try to recover from populated product or direct DB fetch
                let recoveredName = item.name;
                let recoveredImage = item.image;

                if (!recoveredName || !recoveredImage) {
                    // Try populated data first
                    if (item.product && typeof item.product === 'object') {
                        recoveredName = recoveredName || item.product.name;
                        recoveredImage = recoveredImage || (item.product.images && item.product.images[0]?.url);
                    } 
                    
                    // If still missing and we have an ID, fetch from DB
                    if ((!recoveredName || !recoveredImage) && productId) {
                        try {
                            const p = await ProductModel.findById(productId).select('name images');
                            if (p) {
                                recoveredName = recoveredName || p.name;
                                recoveredImage = recoveredImage || (p.images && p.images[0]?.url);
                            }
                        } catch (e) {
                            console.error("Recovery fetch failed:", e);
                        }
                    }
                }

                return {
                    ...item,
                    product: productId, // Ensure a consistent ID field
                    name: recoveredName || "Product",
                    image: recoveredImage || ""
                };
            }));

            return {
                ...order,
                items
            };
        }));

        return res.status(200).json({
            success: true,
            orders: processedOrders,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Failed to load orders",
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
    getOrdersByCustomerEmail,
};
