const mongoose = require("mongoose");

const heroSlideSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        subtitle: {
            type: String,
            default: "",
            trim: true,
        },
        imageUrl: {
            type: String,
            required: true,
            trim: true,
        },
        buttonLabel: {
            type: String,
            default: "",
            trim: true,
        },
        buttonLink: {
            type: String,
            default: "",
            trim: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        sortOrder: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

const HeroSlideModel = mongoose.model("HeroSlides", heroSlideSchema);

module.exports = HeroSlideModel;

