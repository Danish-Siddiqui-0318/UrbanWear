const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Products",
            // Required for new orders, but handled gracefully for old ones
        },
        name: {
            type: String,
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
        image: {
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
            default: "pending",
        },
        paymentMethod: {
            type: String,
            default: "cod",
        },
        paymentStatus: {
            type: String,
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

