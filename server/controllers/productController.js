const ProductModel = require("../models/Product_Model");


// async function getAllProducts(req, res) {
//     try {
//         const products = await ProductModel.find();
//
//         if (!products || products.length === 0) {
//             return res.status(404).json({
//                 message: "No product found"
//             })
//         }
//
//         return res.status(200).json(products);
//     } catch (e) {
//         return res.status(500).json({
//             message: e.message,
//         })
//     }
// }

async function getAllProducts(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        const totalProducts = await ProductModel.countDocuments();

        const products = await ProductModel.find()
            .skip(skip)
            .limit(limit)
            .sort({createdAt: -1});

        return res.status(200).json({
            totalProducts,
            currentPage: page,
            totalPages: Math.ceil(totalProducts / limit),
            products
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

async function getSingleProduct(req, res) {
    try {
        const productId = req.params.id;
        const product = await ProductModel.findById(productId);
        if (!product) {
            return res.status(404).json({message: 'Product not found'});
        }
        return res.status(200).json(product);

    } catch (e) {
        res.status(500).json({message: e.message});
    }
}

async function updateProduct(req, res) {
    const id = req.params.id;
    const updatedData = req.body;
    await ProductModel.findByIdAndUpdate(id, updatedData);
    res.status(200).json({message: "Product updated"});
}

module.exports = {
    getAllProducts,
    updateProduct,
    getSingleProduct
}

