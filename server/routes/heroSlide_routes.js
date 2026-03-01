const express = require("express");
const router = express.Router();

const heroSlideController = require("../controllers/heroSlideController");
const jwtMiddleware = require("../middleware/jwt_token_middleware");
const adminMiddleware = require("../middleware/admin_middleware");
const upload = require("../middleware/upload");

router.get("/", heroSlideController.getPublicSlides);
router.get("/admin", jwtMiddleware, adminMiddleware, heroSlideController.getSlides);
router.post("/", jwtMiddleware, adminMiddleware, upload.single("image"), heroSlideController.createSlide);
router.put("/:id", jwtMiddleware, adminMiddleware, upload.single("image"), heroSlideController.updateSlide);
router.delete("/:id", jwtMiddleware, adminMiddleware, heroSlideController.deleteSlide);

module.exports = router;

