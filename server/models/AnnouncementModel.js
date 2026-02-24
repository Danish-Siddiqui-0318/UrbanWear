const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
    {
        message: {
            type: String,
            default: "",
            trim: true,
        },
        isActive: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const AnnouncementModel = mongoose.model("Announcements", announcementSchema);

module.exports = AnnouncementModel;

