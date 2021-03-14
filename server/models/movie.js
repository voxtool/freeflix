const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
    imageUrl: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    externalId: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: { createdAt: 'created_at' } });

module.exports = mongoose.model('Movie', MovieSchema);