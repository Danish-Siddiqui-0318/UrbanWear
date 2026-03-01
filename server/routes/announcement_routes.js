const express = require("express");
const router = express.Router();

const announcementController = require("../controllers/announcementController");
const jwtMiddleware = require("../middleware/jwt_token_middleware");
const adminMiddleware = require("../middleware/admin_middleware");

router.get("/", announcementController.getAnnouncement);
router.put("/", jwtMiddleware, adminMiddleware, announcementController.upsertAnnouncement);

module.exports = router;

