const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter collection name'],
        trim: true,
        unique: true,
        maxLength: [100, 'Collection name cannot exceed 100 characters']
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true
    },
    description: {
        type: String,
        maxLength: [2000, 'Description cannot exceed 2000 characters']
    },
    logo: {
        public_id: String,
        url: String
    },
    banner: {
        public_id: String,
        url: String
    },
    featuredImage: {
        public_id: String,
        url: String
    },
    creator: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: String,
        enum: ['Art', 'Music', 'Photography', 'Gaming', 'Sports', 'Collectibles', 'Utility', 'Virtual Worlds', 'Domain Names'],
        required: true
    },
    blockchain: {
        type: String,
        enum: ['Ethereum', 'Polygon', 'Binance', 'Solana'],
        default: 'Ethereum'
    },
    contractAddress: {
        type: String
    },
    royalty: {
        type: Number,
        default: 10,
        min: 0,
        max: 50
    },
    floorPrice: {
        type: Number,
        default: 0
    },
    totalVolume: {
        type: Number,
        default: 0
    },
    owners: {
        type: Number,
        default: 0
    },
    items: {
        type: Number,
        default: 0
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    socialLinks: {
        website: String,
        discord: String,
        twitter: String,
        instagram: String,
        medium: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Generate slug before saving
collectionSchema.pre('save', function(next) {
    if (this.isModified('name')) {
        this.slug = this.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    }
    next();
});

// Index for search
collectionSchema.index({ name: 'text', description: 'text' });
collectionSchema.index({ category: 1 });
collectionSchema.index({ creator: 1 });
collectionSchema.index({ floorPrice: 1 });
collectionSchema.index({ totalVolume: -1 });

module.exports = mongoose.model('Collection', collectionSchema);
