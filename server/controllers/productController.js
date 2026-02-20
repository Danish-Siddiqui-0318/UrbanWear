const ProductModel = require("../models/Product_Model");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");


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

// add Product

function streamUpload(buffer) {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "products",
                timeout: 60000 // Increase timeout to 60 seconds
            },
            (error, result) => {
                if (result) {
                    resolve(result);
                } else {
                    console.error("Cloudinary upload error:", error);
                    reject(error);
                }
            }
        );
        streamifier.createReadStream(buffer).pipe(stream);
    });
}

async function addProduct(req, res) {
    try {
        const { name, description, price, stock, category, discount, isFeatured } = req.body;


        // Handle sizes - could be string, array, or multiple fields
        let sizes = req.body.sizes;
        let parsedSizes = [];

        if (Array.isArray(sizes)) {
            // If sizes is already an array (from multiple form fields)
            parsedSizes = sizes;
        } else if (typeof sizes === 'string') {
            try {
                // Try to parse as JSON
                parsedSizes = JSON.parse(sizes);
            } catch (e) {
                // If it's a comma-separated string
                parsedSizes = sizes.split(',').map(s => s.trim());
            }
        }


        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                message: "Please upload at least one image"
            });
        }

        // Upload images to Cloudinary
        const uploadedImages = [];

        for (const file of req.files) {
            try {

                // Convert buffer to base64 and upload
                const b64 = Buffer.from(file.buffer).toString('base64');
                const dataURI = `data:${file.mimetype};base64,${b64}`;

                const result = await cloudinary.uploader.upload(dataURI, {
                    folder: "products",
                    timeout: 120000 // Increase timeout to 2 minutes
                });

                uploadedImages.push({
                    url: result.secure_url,
                    altText: name || "Product image"
                });

            } catch (uploadError) {
                console.error("Error uploading image:", uploadError);
                return res.status(500).json({
                    message: "Error uploading images to Cloudinary",
                    error: uploadError.message
                });
            }
        }

        // Create product
        const product = await ProductModel.create({
            name,
            description,
            price: Number(price),
            stock: Number(stock),
            category,
            sizes: parsedSizes,
            discount: discount ? Number(discount) : 0,
            isFeatured: isFeatured === 'true' || isFeatured === true,
            images: uploadedImages
        });


        res.status(201).json({
            success: true,
            product
        });

    } catch (error) {
        console.error("Error in addProduct:", error);
        res.status(500).json({
            message: error.message || "Internal server error",
            error: error.toString()
        });
    }
}

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
    addProduct,
    getAllProducts,
    updateProduct,
    getSingleProduct
}

