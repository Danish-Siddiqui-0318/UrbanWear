const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const ProductController = require('../controllers/productController');

router.route('/products/').get(ProductController.getAllProducts);
router.route('/products/:id').get(ProductController.getSingleProduct);
router.route('/products/:id').put(ProductController.updateProduct);
router.post("/add_product", upload.array("images", 5), ProductController.addProduct);

module.exports = router;