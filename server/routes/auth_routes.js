const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const jwtMiddleware = require('../middleware/jwt_token_middleware');

router.route('/register',).post(authController.registerUser);
router.route('/login').post(authController.loginUser);
router.route('/updateUser/:id').put(authController.updateUser);
router.get("/profile", jwtMiddleware, authController.getUser);

module.exports = router;