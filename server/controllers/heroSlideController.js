const HeroSlideModel = require("../models/HeroSlideModel");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

function streamUpload(buffer) {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "hero-slides",
                timeout: 60000
            },
            (error, result) => {
                if (result) {
                    resolve(result);
                } else {
                    console.error("Cloudinary upload error:", error);
                    reject(error);
                }
            }
        );
        streamifier.createReadStream(buffer).pipe(stream);
    });
}

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
        const body = req.body || {};
        const { title, subtitle, buttonLabel, buttonLink, isActive, sortOrder } = body;
        let imageUrl = body.imageUrl;

        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }

        // Handle File Upload if provided
        if (req.file) {
            const result = await streamUpload(req.file.buffer);
            imageUrl = result.secure_url;
        }

        if (!imageUrl) {
            return res.status(400).json({ message: "Image is required (either URL or File)" });
        }

        // Handle isActive more robustly
        const activeValue = isActive === undefined ? true : (String(isActive).toLowerCase() === 'true');

        const slide = await HeroSlideModel.create({
            title,
            subtitle,
            imageUrl,
            buttonLabel,
            buttonLink,
            isActive: activeValue,
            sortOrder: sortOrder ? Number(sortOrder) : 0,
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
        const body = req.body || {};
        const { title, subtitle, buttonLabel, buttonLink, isActive, sortOrder } = body;
        let imageUrl = body.imageUrl;

        console.log(`[HeroSlider] Updating slide ${id} with data:`, { title, isActive, sortOrder });

        const slide = await HeroSlideModel.findById(id);
        if (!slide) {
            return res.status(404).json({
                message: "Hero slide not found",
            });
        }

        // Handle File Upload if provided
        if (req.file) {
            const result = await streamUpload(req.file.buffer);
            imageUrl = result.secure_url;
            console.log("[HeroSlider] New image uploaded to Cloudinary:", imageUrl);
        }

        if (title !== undefined) slide.title = title;
        if (subtitle !== undefined) slide.subtitle = subtitle;
        if (imageUrl !== undefined) slide.imageUrl = imageUrl;
        if (buttonLabel !== undefined) slide.buttonLabel = buttonLabel;
        if (buttonLink !== undefined) slide.buttonLink = buttonLink;
        
        if (isActive !== undefined) {
            slide.isActive = (String(isActive).toLowerCase() === 'true');
        }
        
        if (sortOrder !== undefined) {
            const numericSort = Number(sortOrder);
            if (!Number.isNaN(numericSort)) {
                slide.sortOrder = numericSort;
            }
        }

        await slide.save();
        console.log("[HeroSlider] Slide updated successfully:", slide._id);

        return res.status(200).json({
            success: true,
            slide,
        });
    } catch (error) {
        console.error("[HeroSlider] CRITICAL Error in updateSlide:", error);
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

