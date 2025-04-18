const Admin = require("../models/Admin");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const registerAdmin = async (req, res) => {
    const { name, email, phone, password } = req.body;

    try {
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: 'An admin already exists. You cannot create another one.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newAdmin = Admin.create({
            name,
            email,
            phone,
            role: 'admin',
            password: hashedPassword,
        });

        await newAdmin.save();

        res.status(201).json({
            message: 'Admin registered successfully. You can now log in.',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required...!' });
    }

    try {
        const adminFound = await Admin.findOne({ email });
        if (!adminFound) {
            return res.status(400).json({ message: 'Admin not registered' });
        }

        const isPasswordValid = await bcrypt.compare(password, adminFound.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid login credentials...!" });
        }

        const adminSecret = process.env.JWT_ADMIN_SECRET;
        if (!adminSecret) {
            throw new Error("JWT_ADMIN_SECRET not defined in .env");
        }

        const adminToken = jwt.sign(
            {
                id: adminFound._id,
                email: adminFound.email,
                role: adminFound.role,
            },
            adminSecret,
            { expiresIn: "1h" }
        );

        return res.status(200).json({
            status: "success",
            message: 'Login successful',
            adminToken,
            admin: {
                id: adminFound._id,
                name: adminFound.name,
                email: adminFound.email,
                phone: adminFound.phone,
                role: adminFound.role,
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

const verifyAdmin = async (req, res) => {
    const adminToken = req.headers.authorization?.split(' ')[1];

    if (!adminToken) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(adminToken, process.env.JWT_ADMIN_SECRET);
        const admin = await Admin.findById(decoded.id);

        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        res.status(200).json({
            message: 'Admin verified successfully',
            admin: {
                name: admin.name,
                email: admin.email,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateAdmin = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const admin = await Admin.findOne();
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        if (name) admin.name = name;
        if (email) admin.email = email;
        if (password) admin.password = await bcrypt.hash(password, 10);

        await admin.save();

        res.status(200).json({
            message: 'Admin updated successfully',
            admin: {
                name: admin.name,
                email: admin.email,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    registerAdmin,
    loginAdmin,
    verifyAdmin,
    updateAdmin,
};