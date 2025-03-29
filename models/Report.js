const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    location: {
        type: String,
        required: true,
    },
    pestType: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        
    },
    createdAt: { type: Date, default: Date.now },
    status: { type: String, default: 'Pending' },
});

module.exports = mongoose.model('Report', reportSchema);