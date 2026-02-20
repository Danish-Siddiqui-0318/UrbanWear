const cloudinary = require('cloudinary').v2;

// Log to verify environment variables are loaded
console.log("Cloudinary Config:", {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? "✓ Set" : "✗ Missing",
    api_key: process.env.CLOUDINARY_API_KEY ? "✓ Set" : "✗ Missing",
    api_secret: process.env.CLOUDINARY_API_SECRET ? "✓ Set" : "✗ Missing"
});

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Test the connection
cloudinary.api.ping()
    .then(result => console.log("Cloudinary connection successful:", result))
    .catch(error => console.error("Cloudinary connection failed:", error));

module.exports = cloudinary;