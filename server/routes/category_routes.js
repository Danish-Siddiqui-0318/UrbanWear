const express = require("express");
const router = express.Router();

const categoryController = require("../controllers/categoryController");
const jwtMiddleware = require("../middleware/jwt_token_middleware");

router.get("/", categoryController.getCategories);
router.post("/", jwtMiddleware, categoryController.createCategory);
router.put("/:id", jwtMiddleware, categoryController.updateCategory);
router.delete("/:id", jwtMiddleware, categoryController.deleteCategory);

module.exports = router;

