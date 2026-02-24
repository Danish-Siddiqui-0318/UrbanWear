const CategoryModel = require("../models/CategoryModel");

async function createCategory(req, res) {
    try {
        const { name, key } = req.body;

        if (!name || !key) {
            return res
                .status(400)
                .json({ message: "Category name and key are required" });
        }

        const existing = await CategoryModel.findOne({ key: key.toLowerCase() });
        if (existing) {
            return res
                .status(400)
                .json({ message: "Category with this key already exists" });
        }

        const category = await CategoryModel.create({
            name,
            key: key.toLowerCase(),
        });

        return res.status(201).json({
            success: true,
            category,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Failed to create category",
        });
    }
}

async function getCategories(req, res) {
    try {
        const categories = await CategoryModel.find().sort({ createdAt: 1 });
        return res.status(200).json({
            success: true,
            categories,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Failed to load categories",
        });
    }
}

async function updateCategory(req, res) {
    try {
        const id = req.params.id;
        const { name, isActive } = req.body;

        const updatePayload = {};
        if (name !== undefined) updatePayload.name = name;
        if (isActive !== undefined) updatePayload.isActive = isActive;

        const category = await CategoryModel.findByIdAndUpdate(id, updatePayload, {
            new: true,
        });

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        return res.status(200).json({
            success: true,
            category,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Failed to update category",
        });
    }
}

async function deleteCategory(req, res) {
    try {
        const id = req.params.id;
        const category = await CategoryModel.findByIdAndDelete(id);

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Category deleted",
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Failed to delete category",
        });
    }
}

module.exports = {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory,
};
