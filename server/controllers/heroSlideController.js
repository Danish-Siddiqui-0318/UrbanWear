const HeroSlideModel = require("../models/HeroSlideModel");

async function getPublicSlides(req, res) {
    try {
        const slides = await HeroSlideModel.find({ isActive: true })
            .sort({ sortOrder: 1, createdAt: 1 })
            .lean();

        return res.status(200).json({
            success: true,
            slides,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Failed to load hero slides",
        });
    }
}

async function getSlides(req, res) {
    try {
        const slides = await HeroSlideModel.find().sort({ sortOrder: 1, createdAt: 1 }).lean();

        return res.status(200).json({
            success: true,
            slides,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Failed to load hero slides",
        });
    }
}

async function createSlide(req, res) {
    try {
        const { title, subtitle, imageUrl, buttonLabel, buttonLink, isActive, sortOrder } = req.body;

        if (!title || !imageUrl) {
            return res.status(400).json({
                message: "Title and image URL are required",
            });
        }

        const slide = await HeroSlideModel.create({
            title,
            subtitle,
            imageUrl,
            buttonLabel,
            buttonLink,
            isActive: isActive !== undefined ? Boolean(isActive) : true,
            sortOrder: typeof sortOrder === "number" ? sortOrder : 0,
        });

        return res.status(201).json({
            success: true,
            slide,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Failed to create hero slide",
        });
    }
}

async function updateSlide(req, res) {
    try {
        const id = req.params.id;
        const { title, subtitle, imageUrl, buttonLabel, buttonLink, isActive, sortOrder } = req.body;

        const slide = await HeroSlideModel.findById(id);
        if (!slide) {
            return res.status(404).json({
                message: "Hero slide not found",
            });
        }

        if (title !== undefined) slide.title = title;
        if (subtitle !== undefined) slide.subtitle = subtitle;
        if (imageUrl !== undefined) slide.imageUrl = imageUrl;
        if (buttonLabel !== undefined) slide.buttonLabel = buttonLabel;
        if (buttonLink !== undefined) slide.buttonLink = buttonLink;
        if (isActive !== undefined) slide.isActive = Boolean(isActive);
        if (sortOrder !== undefined) {
            const numericSort = Number(sortOrder);
            if (!Number.isNaN(numericSort)) {
                slide.sortOrder = numericSort;
            }
        }

        await slide.save();

        return res.status(200).json({
            success: true,
            slide,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Failed to update hero slide",
        });
    }
}

async function deleteSlide(req, res) {
    try {
        const id = req.params.id;
        const slide = await HeroSlideModel.findById(id);

        if (!slide) {
            return res.status(404).json({
                message: "Hero slide not found",
            });
        }

        await slide.deleteOne();

        return res.status(200).json({
            success: true,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Failed to delete hero slide",
        });
    }
}

module.exports = {
    getPublicSlides,
    getSlides,
    createSlide,
    updateSlide,
    deleteSlide,
};

