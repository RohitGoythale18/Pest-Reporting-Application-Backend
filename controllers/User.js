const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const registerUser = async (req, res) => {
    try {
        const { username, email, phone, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            email,
            phone,
            password: hashedPassword
        });

        await user.save();

        res.status(201).json({
            message: 'User registered',
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(appErr('All fields are required...!'));
    }

    try {
        const userFound = await User.findOne({ email });

        if (!userFound) {
            return next(appErr('User not registered...!'));
        }

        const isPasswordValid = await bcrypt.compare(password, userFound.password);

        if (!isPasswordValid) {
            return next(appErr("Invalid login credentials...!"));
        }

        const token = jwt.sign(
            { id: userFound._id, email: userFound.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" },
        );

        res.status(200).json({
            status: "success",
            message: `Hello ${userFound.username}, welcome to your profile!`,
            token,
            user: {
                id: userFound._id,
                username: userFound.username,
                email: userFound.email,
            },
        });
    } catch (error) {
        res.json(error.message);
    }
};

const verifyUser = async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.json({ valid: true, userId: decoded.id });
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};

const userProfile = async (req, res) => {
    try {
        let user;

        if (req.params.id) {
            user = await User.findById(req.params.id);
        } else if (req.query.email) {
            user = await User.findOne({ email: req.query.email });
        } else {
            return res.status(400).json({ message: "User ID or Email is required" });
        }

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            status: 'success',
            data: {
                "User Id": user._id,
                "Username": user.username,
                "Email": user.email,
                "Mobile": user.mobile,
                "Password": user.password,
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    verifyUser,
    userProfile,
};