const express = require("express");
const router = express.Router();

const categoryController = require("../controllers/categoryController");
const jwtMiddleware = require("../middleware/jwt_token_middleware");
const adminMiddleware = require("../middleware/admin_middleware");

router.get("/", categoryController.getCategories);
router.post("/", jwtMiddleware, adminMiddleware, categoryController.createCategory);
router.put("/:id", jwtMiddleware, adminMiddleware, categoryController.updateCategory);
router.delete("/:id", jwtMiddleware, adminMiddleware, categoryController.deleteCategory);

module.exports = router;

