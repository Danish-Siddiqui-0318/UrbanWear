const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel");

async function jwtMiddleWear(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ 
                success: false,
                message: "Not authorized, no token provided" 
            });
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ 
                success: false,
                message: "Not authorized, token missing" 
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // All tokens must have admin role in this simplified system
        if (decoded.role !== "admin") {
            return res.status(403).json({ 
                success: false,
                message: "Access denied: Admin privileges required" 
            });
        }

        // Set req.user for further use in controllers
        req.user = {
            email: decoded.email,
            role: "admin",
            isAdmin: true,
            _id: decoded._id || null
        };
        
        next();
    } catch (e) {
        let message = "Token invalid or expired";
        if (e.name === 'TokenExpiredError') message = "Token has expired, please login again";
        if (e.name === 'JsonWebTokenError') message = "Invalid token structure";

        return res.status(401).json({ 
            success: false,
            message 
        });
    }
}

module.exports = jwtMiddleWear;
