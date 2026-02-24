const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Products",
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
        size: {
            type: String,
            default: "",
        },
    },
    { _id: false }
);

const orderSchema = new mongoose.Schema(
    {
        items: {
            type: [orderItemSchema],
            required: true,
            validate: [(val) => val.length > 0, "Order must have at least one item"],
        },
        total: {
            type: Number,
            required: true,
            min: 0,
        },
        customerName: {
            type: String,
            required: true,
            trim: true,
        },
        customerEmail: {
            type: String,
            required: true,
            trim: true,
        },
        customerPhone: {
            type: String,
            default: "",
        },
        shippingAddress: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "paid", "processing", "shipped", "completed", "cancelled"],
            default: "pending",
        },
        paymentMethod: {
            type: String,
            default: "cod",
        },
        paymentStatus: {
            type: String,
            enum: ["unpaid", "paid", "refunded"],
            default: "unpaid",
        },
        notes: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

const OrderModel = mongoose.model("Orders", orderSchema);

module.exports = OrderModel;

