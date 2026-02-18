const UserModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// register account

async function registerUser(req, res) {
    const {name, email, password,} = req.body;

    if (!name || !email || !password) {
        res.status(400).json({
            success: false,
            message: "Please provide name, email and password"
        });
        // throw new Error('Please provide all fields');
    }

    const userExist = await UserModel.findOne({email});
    if (userExist) {
        res.status(400).json({
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
        isActive: userData.isActive,
    }

    return res.status(201).json({
        success: true,
        message: `Account created successfully.`,
        data: userResponse
    });
}

async function loginUser(req, res) {
    try {
        var {email, password} = req.body;
        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: "Please provide email and password"
            })
        }

        var user = UserModel.findOne({email});
        if (!user) {
            res.status(400).json({
                success: false,
                message: "User Not Found"
            })
        }
        var isMatched = await bcrypt.compare(password, user.password);
        if (!isMatched) {
            res.status(400).json({
                success: false,
                message: "Password Incorrect"
            })
        }

        var token = jwt.sign(
            {
                _id: user._id,
                name: user.name,
                email: user.email,
            },
            process.env.JWT_SECRET,
            {expiresIn: '7d'}
        )

        res.status(200).json({
            success: true,
            message: "Login successfully.",
            token: token
        })
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

async function getUser(req, res) {
    if (!req.user) {
        res.status(401).json({
            success: false,
            message: "User Not Authorized"
        })

        res.status(200).json(req.user);
    }
}

module.exports = {
    registerUser,
    loginUser,
    getUser
}