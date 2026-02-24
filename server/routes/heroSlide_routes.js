const express = require("express");
const router = express.Router();

const heroSlideController = require("../controllers/heroSlideController");
const jwtMiddleware = require("../middleware/jwt_token_middleware");

router.get("/", heroSlideController.getPublicSlides);
router.get("/admin", jwtMiddleware, heroSlideController.getSlides);
router.post("/", jwtMiddleware, heroSlideController.createSlide);
router.put("/:id", jwtMiddleware, heroSlideController.updateSlide);
router.delete("/:id", jwtMiddleware, heroSlideController.deleteSlide);

module.exports = router;

