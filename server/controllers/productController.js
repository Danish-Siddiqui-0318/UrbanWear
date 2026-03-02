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
            onSale: String(onSale).toLowerCase() === "true",
            saleEndDate: saleEndDate ? new Date(saleEndDate) : null,
            isFeatured: String(isFeatured).toLowerCase() === "true",
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
        const isFeatured = req.query.isFeatured;
        const category = req.query.category;
        const status = req.query.status;

        const skip = (page - 1) * limit;

        // Build filter object
        const filter = {};
        
        // Handle isFeatured filter
        if (req.query.isFeatured !== undefined) {
            const isFeaturedBool = String(req.query.isFeatured).toLowerCase() === 'true';
            filter.isFeatured = isFeaturedBool;
        }
        
        // Handle category filter - Case-insensitive and flexible
        if (category && category !== 'all') {
            filter.category = { $regex: new RegExp(`^${category}$`, 'i') };
        }
        
        // Handle status filter
        if (status === 'all') {
            // Admin wants to see everything
            // Note: In a real app, you'd check for admin privileges here
        } else if (status) {
            filter.status = status;
        } else {
            // Default for storefront: only show active products
            // This is safer than showing hidden/out-of-stock items by default
            filter.status = 'active';
        }

        const totalProducts = await ProductModel.countDocuments(filter);
        
        let products = await ProductModel.find(filter)
            .skip(skip)
            .limit(limit)
            .sort({createdAt: -1});

        // CRITICAL FALLBACK: Manual array filtering
        // If the database query somehow returned products that don't match the boolean filter, 
        // we remove them here manually before sending to client.
        if (req.query.isFeatured !== undefined) {
            const isFeaturedBool = String(req.query.isFeatured).toLowerCase() === 'true';
            products = products.filter(p => p.isFeatured === isFeaturedBool);
        }

        return res.status(200).json({
            totalProducts: products.length, // Update count to match filtered list
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
        const body = req.body;

        const product = await ProductModel.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Update basic fields if provided
        if (body.name !== undefined) product.name = body.name;
        if (body.description !== undefined) product.description = body.description;
        if (body.price !== undefined) product.price = Number(body.price);
        if (body.stock !== undefined) product.stock = Number(body.stock);
        if (body.category !== undefined) product.category = body.category;
        if (body.discount !== undefined) product.discount = Number(body.discount);
        if (body.discountType !== undefined) product.discountType = body.discountType;
        if (body.status !== undefined) product.status = body.status;

        // Strict Boolean Conversions
        if (body.onSale !== undefined) {
            product.onSale = String(body.onSale).toLowerCase() === 'true';
        }
        if (body.isFeatured !== undefined) {
            product.isFeatured = String(body.isFeatured).toLowerCase() === 'true';
        }
        
        // Removed unused saleEndDate handling

        // Handle sizes
        if (body.sizes) {
            let parsedSizes;
            if (Array.isArray(body.sizes)) {
                parsedSizes = body.sizes;
            } else {
                try {
                    parsedSizes = JSON.parse(body.sizes);
                } catch (e) {
                    parsedSizes = body.sizes.split(',').map(s => s.trim());
                }
            }
            product.sizes = parsedSizes;
        }

        // Handle Images
        let existingImages = [];
        if (body.existingImages) {
            try {
                existingImages = typeof body.existingImages === 'string' 
                    ? JSON.parse(body.existingImages) 
                    : body.existingImages;
                
                // If it's an array of strings (JSON strings), parse each one
                if (Array.isArray(existingImages)) {
                    existingImages = existingImages.map(img => typeof img === 'string' ? JSON.parse(img) : img);
                }
            } catch (e) {
                console.error("Error parsing existing images:", e);
            }
        }

        // Process new images
        const newImages = [];
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                try {
                    const result = await streamUpload(file.buffer);
                    if (result && result.secure_url) {
                        newImages.push({
                            url: result.secure_url,
                            altText: product.name || "Product image"
                        });
                    }
                } catch (uploadError) {
                    console.error("Error uploading new image:", uploadError);
                }
            }
        }

        // Only update images if either existingImages or new files were provided
        // This prevents accidentally clearing images if the field is missing in a partial update
        if (body.existingImages !== undefined || (req.files && req.files.length > 0)) {
            product.images = [...existingImages, ...newImages];
        }

        await product.save();
        res.status(200).json({ message: "Product updated successfully", product });

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

