const UserModel = require('../models/UserModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function loginUser(req, res) {
    try {
        const { email, password, role } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide email and password"
            });
        }

        // 1. Check if it's the environment-configured admin
        if (role === "admin") {
            if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
                return res.status(500).json({
                    success: false,
                    message: "Admin configuration error"
                });
            }

            if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
                const token = jwt.sign(
                    {
                        email: process.env.ADMIN_EMAIL,
                        role: "admin"
                    },
                    process.env.JWT_SECRET,
                    { expiresIn: "7d" }
                );

                return res.status(200).json({
                    success: true,
                    message: "Admin login successful",
                    token,
                    role: "admin"
                });
            }
        }

        // 2. Fallback to database admins (if any)
        const admin = await UserModel.findOne({ email, role: 'admin' });
        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const isMatched = await bcrypt.compare(password, admin.password);
        if (!isMatched) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const token = jwt.sign(
            {
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                role: "admin"
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            role: "admin",
            name: admin.name
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
}

async function getAdminProfile(req, res) {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(401).json({
            success: false,
            message: "Not authorized"
        });
    }

    return res.status(200).json({
        success: true,
        data: req.user
    });
}

module.exports = {
    loginUser,
    getAdminProfile,
}
