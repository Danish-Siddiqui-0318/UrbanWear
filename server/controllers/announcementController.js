const AnnouncementModel = require("../models/AnnouncementModel");

async function getAnnouncement(req, res) {
    try {
        const announcement = await AnnouncementModel.findOne().sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            announcement: announcement || null,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Failed to load announcement",
        });
    }
}

async function upsertAnnouncement(req, res) {
    try {
        const { message = "", isActive = false } = req.body;

        let announcement = await AnnouncementModel.findOne().sort({ createdAt: -1 });

        if (!announcement) {
            announcement = await AnnouncementModel.create({
                message,
                isActive,
            });
        } else {
            announcement.message = message;
            announcement.isActive = Boolean(isActive);
            await announcement.save();
        }

        return res.status(200).json({
            success: true,
            announcement,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Failed to update announcement",
        });
    }
}

module.exports = {
    getAnnouncement,
    upsertAnnouncement,
};

