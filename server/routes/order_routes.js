const express = require("express");
const router = express.Router();

const orderController = require("../controllers/orderController");
const jwtMiddleware = require("../middleware/jwt_token_middleware");
const adminMiddleware = require("../middleware/admin_middleware");

router.post("/", orderController.createOrder);

router.get("/", jwtMiddleware, adminMiddleware, orderController.getOrders);
router.get("/stats/overview", jwtMiddleware, adminMiddleware, orderController.getOrderStats);
router.get("/stats/products", jwtMiddleware, adminMiddleware, orderController.getProductPerformance);
router.get("/customer/:email", orderController.getOrdersByCustomerEmail);
router.get("/:id", jwtMiddleware, orderController.getOrderById);
router.put("/:id", jwtMiddleware, adminMiddleware, orderController.updateOrderStatus);

module.exports = router;
