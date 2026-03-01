const express = require("express");
const router = express.Router();

const orderController = require("../controllers/orderController");
const jwtMiddleware = require("../middleware/jwt_token_middleware");

router.post("/", orderController.createOrder);

router.get("/", jwtMiddleware, orderController.getOrders);
router.get("/stats/overview", jwtMiddleware, orderController.getOrderStats);
router.get("/stats/products", jwtMiddleware, orderController.getProductPerformance);
router.get("/customer/:email", orderController.getOrdersByCustomerEmail);
router.get("/:id", jwtMiddleware, orderController.getOrderById);
router.put("/:id", jwtMiddleware, orderController.updateOrderStatus);

module.exports = router;
