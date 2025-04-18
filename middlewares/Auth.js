const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Admin = require("../models/Admin");
require('dotenv').config();

const protect = async (req, res, next) => {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== "user") {
            return res.status(403).json({ message: "Access denied: Not a user" });
        }

        req.user = await User.findById(decoded.id).select("-password");

        if (!req.user) {
            return res.status(401).json({ message: "User not found" });
        }

        next();
    } catch (error) {
        console.error("User token error:", error);
        return res.status(401).json({ message: "Invalid token" });
    }
};

const adminProtect = async (req, res, next) => {
    let adminToken;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        adminToken = req.headers.authorization.split(" ")[1];
    }

    if (!adminToken) {
        return res.status(401).json({ message: "Not authorized, token missing" });
    }

    try {
        const decoded = jwt.verify(adminToken, process.env.JWT_ADMIN_SECRET);

        if (decoded.role !== "admin") {
            return res.status(403).json({ message: "Access denied: Not an admin" });
        }

        req.admin = await Admin.findById(decoded.id).select("-password");

        if (!req.admin) {
            return res.status(401).json({ message: "Admin not found" });
        }

        next();
    } catch (error) {
        console.error("Admin token error:", error);
        res.status(401).json({ message: "Invalid token" });
    }
};

module.exports = {
    protect,
    adminProtect,
};
