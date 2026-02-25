const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const ProductController = require('../controllers/productController');
const jwtMiddleware = require('../middleware/jwt_token_middleware');

router.route('/products/').get(ProductController.getAllProducts);
router.route('/products/:id').get(ProductController.getSingleProduct);
router.route('/products/:id').put(jwtMiddleware, upload.array("images", 5), ProductController.updateProduct);
router.route('/products/:id').delete(jwtMiddleware, ProductController.deleteProduct);
router.route('/products/:id/stock').patch(jwtMiddleware, ProductController.updateProductStock);
router.post("/add_product", jwtMiddleware, upload.array("images", 5), ProductController.addProduct);

module.exports = router;
