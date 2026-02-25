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
        const {
            name,
            description,
            price,
            stock,
            category,
            discount,
            isFeatured,
            status,
            discountType,
            onSale,
            saleEndDate,
        } = req.body;


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

        if (req.files && req.files.length > 0) {
            console.log(`Processing ${req.files.length} new files for NEW product`);
            for (const file of req.files) {
                try {
                    const result = await streamUpload(file.buffer);
                    if (result && result.secure_url) {
                        uploadedImages.push({
                            url: result.secure_url,
                            altText: name || "Product image"
                        });
                    }
                } catch (uploadError) {
                    console.error("Error uploading image to Cloudinary:", uploadError);
                }
            }
        }
        
        console.log(`Total images to save for new product: ${uploadedImages.length}`);

        // Create product
        const product = await ProductModel.create({
            name,
            description,
            price: Number(price),
            stock: Number(stock),
            category,
            sizes: parsedSizes,
            discount: discount ? Number(discount) : 0,
            discountType: discountType || "percent",
            onSale: onSale === "true" || onSale === true,
            saleEndDate: saleEndDate ? new Date(saleEndDate) : null,
            isFeatured: isFeatured === "true" || isFeatured === true,
            status: status || "active",
            images: uploadedImages,
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
    try {
        const id = req.params.id;
        const {
            name,
            description,
            price,
            stock,
            category,
            discount,
            discountType,
            onSale,
            saleEndDate,
            isFeatured,
            status,
        } = req.body;

        // Handle sizes
        let sizes = req.body.sizes;
        let parsedSizes;
        if (sizes) {
            if (Array.isArray(sizes)) {
                parsedSizes = sizes;
            } else {
                try {
                    parsedSizes = JSON.parse(sizes);
                } catch (e) {
                    parsedSizes = sizes.split(',').map(s => s.trim());
                }
            }
        }

        // Handle existing images
        let existingImages = req.body.existingImages;
        let parsedExistingImages = [];
        if (existingImages) {
            if (Array.isArray(existingImages)) {
                parsedExistingImages = existingImages.map(img => typeof img === 'string' ? JSON.parse(img) : img);
            } else {
                try {
                    parsedExistingImages = JSON.parse(existingImages);
                } catch (e) {
                    parsedExistingImages = [];
                }
            }
        }

        const updatePayload = {};

        if (name !== undefined) updatePayload.name = name;
        if (description !== undefined) updatePayload.description = description;
        if (price !== undefined) updatePayload.price = Number(price);
        if (stock !== undefined) updatePayload.stock = Number(stock);
        if (category !== undefined) updatePayload.category = category;
        if (parsedSizes !== undefined) updatePayload.sizes = parsedSizes;
        if (discount !== undefined) updatePayload.discount = Number(discount);
        if (discountType !== undefined) updatePayload.discountType = discountType;
        if (onSale !== undefined) {
            updatePayload.onSale = onSale === true || onSale === "true";
        }
        if (saleEndDate !== undefined) {
            updatePayload.saleEndDate = saleEndDate ? new Date(saleEndDate) : null;
        }
        if (isFeatured !== undefined) {
            updatePayload.isFeatured = isFeatured === true || isFeatured === "true";
        }
        if (status !== undefined) updatePayload.status = status;

        // Handle new images
        const uploadedImages = [...parsedExistingImages];
        if (req.files && req.files.length > 0) {
            console.log(`Processing ${req.files.length} new files for product ${id || 'new'}`);
            for (const file of req.files) {
                try {
                    const result = await streamUpload(file.buffer);
                    if (result && result.secure_url) {
                        uploadedImages.push({
                            url: result.secure_url,
                            altText: name || "Product image"
                        });
                    }
                } catch (uploadError) {
                    console.error("Error uploading image to Cloudinary:", uploadError);
                }
            }
        }

        // Always update the images field if it was provided (even if empty)
        // We check for req.body.existingImages (sent during update) 
        // or req.files (sent during create/update)
        if (req.body.existingImages !== undefined || (req.files && req.files.length > 0)) {
            updatePayload.images = uploadedImages;
            console.log(`Total images to save: ${uploadedImages.length}`);
        }

        const product = await ProductModel.findByIdAndUpdate(id, updatePayload, { new: true });
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: "Product updated", product });
    } catch (error) {
        console.error("Error in updateProduct:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
}

async function updateProductStock(req, res) {
    try {
        const id = req.params.id;
        const { stock } = req.body;

        if (stock === undefined || Number.isNaN(Number(stock))) {
            return res.status(400).json({ message: "Valid stock value is required" });
        }

        const product = await ProductModel.findByIdAndUpdate(
            id,
            { stock: Number(stock) },
            { new: true }
        );

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        return res.status(200).json({
            success: true,
            product,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Failed to update stock",
        });
    }
}

async function deleteProduct(req, res) {
    const id = req.params.id;
    const product = await ProductModel.findByIdAndDelete(id);
    if (!product) {
        return res.status(404).json({message: "Product not found"});
    }
    res.status(200).json({message: "Product deleted"});
}

module.exports = {
    addProduct,
    getAllProducts,
    updateProduct,
    getSingleProduct,
    deleteProduct,
    updateProductStock,
}

