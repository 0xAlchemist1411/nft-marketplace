const mongoose = require('mongoose');

const nftSchema = new mongoose.Schema({
    tokenId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: [true, 'Please enter NFT name'],
        trim: true,
        maxLength: [100, 'NFT name cannot exceed 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please enter NFT description'],
        maxLength: [2000, 'Description cannot exceed 2000 characters']
    },
    image: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    creator: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    price: {
        type: Number,
        required: [true, 'Please enter NFT price'],
        default: 0
    },
    currency: {
        type: String,
        enum: ['ETH', 'MATIC', 'BNB', 'SOL'],
        default: 'ETH'
    },
    category: {
        type: String,
        enum: ['Art', 'Music', 'Photography', 'Gaming', 'Sports', 'Collectibles', 'Utility', 'Virtual Worlds', 'Domain Names'],
        required: [true, 'Please select a category']
    },
    collection: {
        type: mongoose.Schema.ObjectId,
        ref: 'Collection'
    },
    royalty: {
        type: Number,
        default: 10,
        min: 0,
        max: 50
    },
    isListed: {
        type: Boolean,
        default: false
    },
    isAuction: {
        type: Boolean,
        default: false
    },
    auctionEndTime: {
        type: Date
    },
    highestBid: {
        amount: {
            type: Number,
            default: 0
        },
        bidder: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
    },
    bids: [{
        bidder: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        },
        amount: Number,
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    contractAddress: {
        type: String
    },
    blockchain: {
        type: String,
        enum: ['Ethereum', 'Polygon', 'Binance', 'Solana'],
        default: 'Ethereum'
    },
    metadata: {
        type: Map,
        of: String
    },
    attributes: [{
        trait_type: String,
        value: String,
        rarity: Number
    }],
    views: {
        type: Number,
        default: 0
    },
    likes: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }],
    verified: {
        type: Boolean,
        default: false
    },
    featured: {
        type: Boolean,
        default: false
    },
    history: [{
        event: {
            type: String,
            enum: ['Minted', 'Listed', 'Sold', 'Transfer', 'Bid', 'Auction Started', 'Auction Ended', 'Price Change']
        },
        from: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        },
        to: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        },
        price: Number,
        timestamp: {
            type: Date,
            default: Date.now
        },
        transactionHash: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Index for search
nftSchema.index({ name: 'text', description: 'text' });
nftSchema.index({ category: 1, isListed: 1 });
nftSchema.index({ creator: 1 });
nftSchema.index({ owner: 1 });
nftSchema.index({ price: 1 });

module.exports = mongoose.model('NFT', nftSchema);
