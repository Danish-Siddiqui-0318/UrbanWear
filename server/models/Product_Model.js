const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Product name is required"],
            trim: true,
        },

        description: {
            type: String,
            required: [true, "Product description is required"],
        },

        price: {
            type: Number,
            required: [true, "Product price is required"],
            min: 0,
        },

        stock: {
            type: Number,
            required: [true, "Stock quantity is required"],
            min: 0,
            default: 0,
        },
        category: {
            type: String,
            required: [true, "Category is required"],
            trim: true,
        },

        sizes: [
            {
                type: String,
                enum: ["sm", "md", "lg", "xl"],
                required: true,
            }
        ],

        images: [
            {
                url: {
                    type: String,
                    required: true,
                },
                altText: {
                    type: String,
                    default: "",
                }
            }
        ],

        discount: {
            type: Number,
            default: 0, // optional
            min: 0,
            max: 100
        },

        isFeatured: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

const ProductModel = mongoose.model("Products", productSchema);

module.exports = ProductModel;