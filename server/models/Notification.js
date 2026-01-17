const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['Sale', 'Purchase', 'Bid', 'Outbid', 'Auction Won', 'Auction Ended', 'New Follower', 'Price Drop', 'Offer Received', 'Offer Accepted', 'Transfer'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    nft: {
        type: mongoose.Schema.ObjectId,
        ref: 'NFT'
    },
    relatedUser: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    link: {
        type: String
    },
    isRead: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Index
notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);