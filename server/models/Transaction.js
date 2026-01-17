const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    nft: {
        type: mongoose.Schema.ObjectId,
        ref: 'NFT',
        required: true
    },
    type: {
        type: String,
        enum: ['Sale', 'Auction', 'Bid', 'Transfer', 'Mint', 'List', 'Delist', 'Offer'],
        required: true
    },
    from: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    to: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    price: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        enum: ['ETH', 'MATIC', 'BNB', 'SOL'],
        default: 'ETH'
    },
    transactionHash: {
        type: String,
        required: true,
        unique: true
    },
    blockNumber: {
        type: Number
    },
    gasUsed: {
        type: Number
    },
    gasFee: {
        type: Number
    },
    platformFee: {
        type: Number,
        default: 0
    },
    royaltyFee: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Failed'],
        default: 'Pending'
    },
    blockchain: {
        type: String,
        enum: ['Ethereum', 'Polygon', 'Binance', 'Solana'],
        default: 'Ethereum'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Indexes
transactionSchema.index({ nft: 1, createdAt: -1 });
transactionSchema.index({ from: 1 });
transactionSchema.index({ to: 1 });
transactionSchema.index({ type: 1 });
transactionSchema.index({ transactionHash: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);
