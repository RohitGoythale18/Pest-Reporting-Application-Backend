const Admin = require("../models/Admin");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerAdmin = async (req, res) => {
    const { name, email, phone, password } = req.body;

    console.log(req.body);

    try {
        const existingAdmin = await Admin.findOne({email});
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

    try {
        const admin = await Admin.findOne();
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found. Please register first.' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: admin._id, email: admin.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" },
        );

        res.status(200).json({
            message: 'Login successful',
            admin: {
                name: admin.name,
                email: admin.email,
                token: token,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const verifyAdmin = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
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