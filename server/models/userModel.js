const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Your Name"],
        trim: true,
        maxLength: [50, "Name cannot exceed 50 characters"]
    },
    email: {
        type: String,
        unique: true,
        sparse: true, // Allow multiple null values
        validate: {
            validator: function(v) {
                return !v || validator.isEmail(v);
            },
            message: "Please enter a valid email"
        }
    },
    username: {
        type: String,
        unique: true,
        sparse: true,
        trim: true,
        minLength: [3, "Username should have at least 3 characters"],
        maxLength: [30, "Username cannot exceed 30 characters"]
    },
    walletAddress: {
        type: String,
        unique: true,
        sparse: true,
        lowercase: true
    },
    nonce: {
        type: String,
        default: () => crypto.randomBytes(32).toString('hex')
    },
    gender: {
        type: String,
    },
    password: {
        type: String,
        minLength: [8, "Password should have at least 8 chars"],
        select: false,
    },
    avatar: {
        public_id: String,
        url: {
            type: String,
            default: function() {
                return `https://api.dicebear.com/7.x/avataaars/svg?seed=${this._id || 'default'}`;
            }
        }
    },
    banner: {
        public_id: String,
        url: String
    },
    bio: {
        type: String,
        maxLength: [500, "Bio cannot exceed 500 characters"]
    },
    role: {
        type: String,
        enum: ['user', 'creator', 'admin'],
        default: "user",
    },
    verified: {
        type: Boolean,
        default: false
    },
    socialLinks: {
        website: String,
        twitter: String,
        discord: String,
        instagram: String
    },
    followers: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }],
    following: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }],
    stats: {
        totalSales: {
            type: Number,
            default: 0
        },
        totalPurchases: {
            type: Number,
            default: 0
        },
        itemsCreated: {
            type: Number,
            default: 0
        },
        itemsOwned: {
            type: Number,
            default: 0
        }
    },
    notifications: {
        sales: { type: Boolean, default: true },
        bids: { type: Boolean, default: true },
        followers: { type: Boolean, default: true },
        newsletter: { type: Boolean, default: false }
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    lastActive: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
});

// Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password") || !this.password) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Generate JWT Token
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
}

// Compare Password
userSchema.methods.comparePassword = async function (enteredPassword) {
    if (!this.password) return false;
    return await bcrypt.compare(enteredPassword, this.password);
}

// Generate new nonce for wallet authentication
userSchema.methods.generateNonce = function () {
    this.nonce = crypto.randomBytes(32).toString('hex');
    return this.nonce;
}

// Get Reset Password Token
userSchema.methods.getResetPasswordToken = async function () {
    const resetToken = crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    return resetToken;
}

// Virtual for follower count
userSchema.virtual('followerCount').get(function() {
    return this.followers?.length || 0;
});

userSchema.virtual('followingCount').get(function() {
    return this.following?.length || 0;
});

// Indexes
userSchema.index({ walletAddress: 1 });
userSchema.index({ username: 1 });
userSchema.index({ name: 'text', username: 'text' });

module.exports = mongoose.model('User', userSchema);