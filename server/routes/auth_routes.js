const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const jwtMiddleware = require('../middleware/jwt_token_middleware');

router.route('/login').post(authController.loginUser);
router.get("/profile", jwtMiddleware, authController.getAdminProfile);

module.exports = router;