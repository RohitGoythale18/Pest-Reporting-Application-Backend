const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    phone: String,
    role: {
        type: String,
        enum: ['user'],
        default: 'user',
    },
    password: String,
});

module.exports = mongoose.model('User', userSchema);