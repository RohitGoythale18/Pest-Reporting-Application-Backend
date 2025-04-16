const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    phone: {
        type: Number,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8, 
    },
    role: {
        type: String,
        enum: ['admin'],
        default: 'admin',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Admin', adminSchema);
