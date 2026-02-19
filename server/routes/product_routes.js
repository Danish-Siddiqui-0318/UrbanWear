const express=require('express');
const router=express.Router();
const ProductController=require('../controllers/productController');
// const authController = require("../controllers/authController");

router.route('/products/').get(ProductController.getAllProducts);
router.route('/products/:id').get(ProductController.getSingleProduct);
router.route('/products/:id').put(ProductController.updateProduct);

module.exports = router;