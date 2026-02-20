const UserModel = require('../models/UserModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// register account

async function registerUser(req, res) {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "Please provide name, email and password"
        });
    }

    const userExist = await UserModel.findOne({ email });
    if (userExist) {
        return res.status(400).json({
            success: false,
            message: "User already exists"
        });
    }

    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);

    const userData = await UserModel.create({
        name,
        email,
        password: encryptedPassword
    });

    const userResponse = {
        _id: userData._id,
        name: userData.name,
        email: userData.email,
        isActive: userData.isActive
    };

    return res.status(201).json({
        success: true,
        message: "Account created successfully.",
        data: userResponse
    });
}

async function loginUser(req, res) {
    try {
        const { email, password, role } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide email and password"
            });
        }

        if (role === "admin") {
            console.log("ADMIN_EMAIL:", JSON.stringify(process.env.ADMIN_EMAIL));
            console.log("ADMIN_PASSWORD:", JSON.stringify(process.env.ADMIN_PASSWORD));
            if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
                return res.status(500).json({
                    success: false,
                    message: "Admin credentials are not configured"
                });
            }

            if (
                email !== process.env.ADMIN_EMAIL ||
                password !== process.env.ADMIN_PASSWORD
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid admin credentials"
                });
            }

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
                message: "Admin login successfully.",
                token,
                role: "admin"
            });
        }

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }

        const isMatched = await bcrypt.compare(password, user.password);
        if (!isMatched) {
            return res.status(400).json({
                success: false,
                message: "Password incorrect"
            });
        }

        const token = jwt.sign(
            {
                _id: user._id,
                name: user.name,
                email: user.email
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.status(200).json({
            success: true,
            message: "Login successfully.",
            token,
            role: "user",
            name: user.name
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

async function getUser(req, res) {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "User Not Authorized"
        });
    }

    return res.status(200).json({
        success: true,
        data: req.user
    });
}

async function updateUser(req, res) {
    var id = req.params.id;
    var updatedData = req.body;

    await UserModel.findByIdAndUpdate(id, updatedData)
    res.status(200).json({message: "Data Updated"})
}

module.exports = {
    registerUser,
    loginUser,
    updateUser,
    getUser,
}
