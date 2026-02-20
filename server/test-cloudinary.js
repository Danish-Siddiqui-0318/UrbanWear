require('dotenv').config();
const cloudinary = require('./config/cloudinary');

async function testCloudinary() {
    try {
        // Test 1: Simple ping
        const pingResult = await cloudinary.api.ping();
        console.log("Ping successful:", pingResult);

        // Test 2: Get account info
        const accountInfo = await cloudinary.api.usage();
        console.log("Account info retrieved successfully");

        console.log("Cloudinary is working correctly!");
    } catch (error) {
        console.error("Cloudinary test failed:", error);
    }
}

testCloudinary();