const NFT = require('../models/NFT');
const Collection = require('../models/Collection');
const Transaction = require('../models/Transaction');
const Notification = require('../models/Notification');
const cloudinary = require('cloudinary');

// Create/Mint NFT
exports.createNFT = async (req, res) => {
    try {
        const { name, description, price, category, royalty, blockchain, attributes, collectionId } = req.body;
        
        if (!req.files || !req.files.image) {
            return res.status(400).json({ success: false, message: 'Please upload an image' });
        }

        const result = await cloudinary.v2.uploader.upload(req.files.image.tempFilePath, {
            folder: 'nft-marketplace',
            quality: 'auto:best'
        });

        // Generate unique token ID
        const tokenId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        const nft = await NFT.create({
            tokenId,
            name,
            description,
            image: {
                public_id: result.public_id,
                url: result.secure_url
            },
            creator: req.user._id,
            owner: req.user._id,
            price: parseFloat(price) || 0,
            category,
            royalty: parseFloat(royalty) || 10,
            blockchain: blockchain || 'Ethereum',
            attributes: attributes ? JSON.parse(attributes) : [],
            collection: collectionId || null,
            history: [{
                event: 'Minted',
                from: req.user._id,
                to: req.user._id,
                price: 0,
                timestamp: Date.now()
            }]
        });

        // Update collection items count
        if (collectionId) {
            await Collection.findByIdAndUpdate(collectionId, { $inc: { items: 1 } });
        }

        res.status(201).json({
            success: true,
            message: 'NFT created successfully',
            nft
        });
    } catch (error) {
        console.error('Create NFT Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all NFTs with filters
exports.getAllNFTs = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 12, 
            category, 
            blockchain, 
            minPrice, 
            maxPrice, 
            sort = 'newest',
            search,
            isListed
        } = req.query;

        let query = {};

        if (category) query.category = category;
        if (blockchain) query.blockchain = blockchain;
        if (isListed === 'true') query.isListed = true;
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = parseFloat(minPrice);
            if (maxPrice) query.price.$lte = parseFloat(maxPrice);
        }
        if (search) {
            query.$text = { $search: search };
        }

        let sortOption = {};
        switch (sort) {
            case 'newest':
                sortOption = { createdAt: -1 };
                break;
            case 'oldest':
                sortOption = { createdAt: 1 };
                break;
            case 'price_high':
                sortOption = { price: -1 };
                break;
            case 'price_low':
                sortOption = { price: 1 };
                break;
            case 'popular':
                sortOption = { views: -1 };
                break;
            case 'ending_soon':
                sortOption = { auctionEndTime: 1 };
                query.isAuction = true;
                query.auctionEndTime = { $gt: new Date() };
                break;
            default:
                sortOption = { createdAt: -1 };
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const nfts = await NFT.find(query)
            .populate('creator', 'name avatar walletAddress')
            .populate('owner', 'name avatar walletAddress')
            .sort(sortOption)
            .skip(skip)
            .limit(parseInt(limit));

        const total = await NFT.countDocuments(query);

        res.status(200).json({
            success: true,
            nfts,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit)),
                totalItems: total,
                hasMore: skip + nfts.length < total
            }
        });
    } catch (error) {
        console.error('Get NFTs Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get single NFT
exports.getNFT = async (req, res) => {
    try {
        const nft = await NFT.findById(req.params.id)
            .populate('creator', 'name avatar walletAddress verified')
            .populate('owner', 'name avatar walletAddress verified')
            .populate('collection', 'name logo verified')
            .populate('bids.bidder', 'name avatar walletAddress')
            .populate('history.from', 'name avatar walletAddress')
            .populate('history.to', 'name avatar walletAddress');

        if (!nft) {
            return res.status(404).json({ success: false, message: 'NFT not found' });
        }

        // Increment views
        await NFT.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

        res.status(200).json({ success: true, nft });
    } catch (error) {
        console.error('Get NFT Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// List NFT for sale
exports.listNFT = async (req, res) => {
    try {
        const { price } = req.body;
        const nft = await NFT.findById(req.params.id);

        if (!nft) {
            return res.status(404).json({ success: false, message: 'NFT not found' });
        }

        if (nft.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'You are not the owner' });
        }

        nft.isListed = true;
        nft.price = parseFloat(price);
        nft.isAuction = false;
        nft.history.push({
            event: 'Listed',
            from: req.user._id,
            price: parseFloat(price),
            timestamp: Date.now()
        });

        await nft.save();

        res.status(200).json({ success: true, message: 'NFT listed successfully', nft });
    } catch (error) {
        console.error('List NFT Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Start auction
exports.startAuction = async (req, res) => {
    try {
        const { startingPrice, endTime } = req.body;
        const nft = await NFT.findById(req.params.id);

        if (!nft) {
            return res.status(404).json({ success: false, message: 'NFT not found' });
        }

        if (nft.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'You are not the owner' });
        }

        nft.isListed = true;
        nft.isAuction = true;
        nft.price = parseFloat(startingPrice);
        nft.auctionEndTime = new Date(endTime);
        nft.highestBid = { amount: 0, bidder: null };
        nft.bids = [];
        nft.history.push({
            event: 'Auction Started',
            from: req.user._id,
            price: parseFloat(startingPrice),
            timestamp: Date.now()
        });

        await nft.save();

        res.status(200).json({ success: true, message: 'Auction started', nft });
    } catch (error) {
        console.error('Start Auction Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Place bid
exports.placeBid = async (req, res) => {
    try {
        const { amount, transactionHash } = req.body;
        const nft = await NFT.findById(req.params.id);

        if (!nft) {
            return res.status(404).json({ success: false, message: 'NFT not found' });
        }

        if (!nft.isAuction) {
            return res.status(400).json({ success: false, message: 'This NFT is not on auction' });
        }

        if (new Date() > nft.auctionEndTime) {
            return res.status(400).json({ success: false, message: 'Auction has ended' });
        }

        if (parseFloat(amount) <= nft.highestBid.amount) {
            return res.status(400).json({ success: false, message: 'Bid must be higher than current highest bid' });
        }

        // Notify previous highest bidder
        if (nft.highestBid.bidder) {
            await Notification.create({
                user: nft.highestBid.bidder,
                type: 'Outbid',
                title: 'You have been outbid',
                message: `Someone placed a higher bid on ${nft.name}`,
                nft: nft._id,
                link: `/nft/${nft._id}`
            });
        }

        nft.highestBid = {
            amount: parseFloat(amount),
            bidder: req.user._id
        };

        nft.bids.push({
            bidder: req.user._id,
            amount: parseFloat(amount),
            timestamp: Date.now()
        });

        nft.history.push({
            event: 'Bid',
            from: req.user._id,
            price: parseFloat(amount),
            timestamp: Date.now(),
            transactionHash
        });

        await nft.save();

        // Create transaction record
        await Transaction.create({
            nft: nft._id,
            type: 'Bid',
            from: req.user._id,
            price: parseFloat(amount),
            transactionHash,
            status: 'Confirmed',
            blockchain: nft.blockchain
        });

        // Notify NFT owner
        await Notification.create({
            user: nft.owner,
            type: 'Bid',
            title: 'New bid on your NFT',
            message: `Someone placed a bid of ${amount} ${nft.currency} on ${nft.name}`,
            nft: nft._id,
            relatedUser: req.user._id,
            link: `/nft/${nft._id}`
        });

        res.status(200).json({ success: true, message: 'Bid placed successfully', nft });
    } catch (error) {
        console.error('Place Bid Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Buy NFT
exports.buyNFT = async (req, res) => {
    try {
        const { transactionHash } = req.body;
        const nft = await NFT.findById(req.params.id);

        if (!nft) {
            return res.status(404).json({ success: false, message: 'NFT not found' });
        }

        if (!nft.isListed || nft.isAuction) {
            return res.status(400).json({ success: false, message: 'This NFT is not for sale' });
        }

        const previousOwner = nft.owner;

        nft.owner = req.user._id;
        nft.isListed = false;
        nft.history.push({
            event: 'Sold',
            from: previousOwner,
            to: req.user._id,
            price: nft.price,
            timestamp: Date.now(),
            transactionHash
        });

        await nft.save();

        // Calculate fees
        const platformFee = nft.price * 0.025; // 2.5% platform fee
        const royaltyFee = nft.price * (nft.royalty / 100);

        // Create transaction record
        await Transaction.create({
            nft: nft._id,
            type: 'Sale',
            from: previousOwner,
            to: req.user._id,
            price: nft.price,
            currency: nft.currency,
            transactionHash,
            platformFee,
            royaltyFee,
            status: 'Confirmed',
            blockchain: nft.blockchain
        });

        // Update collection stats
        if (nft.collection) {
            await Collection.findByIdAndUpdate(nft.collection, {
                $inc: { totalVolume: nft.price }
            });
        }

        // Notify seller
        await Notification.create({
            user: previousOwner,
            type: 'Sale',
            title: 'Your NFT has been sold',
            message: `${nft.name} was sold for ${nft.price} ${nft.currency}`,
            nft: nft._id,
            relatedUser: req.user._id,
            link: `/nft/${nft._id}`
        });

        // Notify buyer
        await Notification.create({
            user: req.user._id,
            type: 'Purchase',
            title: 'NFT Purchase Successful',
            message: `You have purchased ${nft.name} for ${nft.price} ${nft.currency}`,
            nft: nft._id,
            link: `/nft/${nft._id}`
        });

        res.status(200).json({ success: true, message: 'NFT purchased successfully', nft });
    } catch (error) {
        console.error('Buy NFT Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Like/Unlike NFT
exports.toggleLike = async (req, res) => {
    try {
        const nft = await NFT.findById(req.params.id);

        if (!nft) {
            return res.status(404).json({ success: false, message: 'NFT not found' });
        }

        const index = nft.likes.indexOf(req.user._id);
        
        if (index > -1) {
            nft.likes.splice(index, 1);
        } else {
            nft.likes.push(req.user._id);
        }

        await nft.save();

        res.status(200).json({ 
            success: true, 
            liked: index === -1,
            likesCount: nft.likes.length 
        });
    } catch (error) {
        console.error('Toggle Like Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get trending NFTs
exports.getTrendingNFTs = async (req, res) => {
    try {
        const nfts = await NFT.find({ isListed: true })
            .populate('creator', 'name avatar walletAddress')
            .populate('owner', 'name avatar walletAddress')
            .sort({ views: -1, 'likes.length': -1 })
            .limit(12);

        res.status(200).json({ success: true, nfts });
    } catch (error) {
        console.error('Get Trending Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get featured NFTs
exports.getFeaturedNFTs = async (req, res) => {
    try {
        const nfts = await NFT.find({ featured: true, isListed: true })
            .populate('creator', 'name avatar walletAddress verified')
            .populate('owner', 'name avatar walletAddress verified')
            .limit(8);

        res.status(200).json({ success: true, nfts });
    } catch (error) {
        console.error('Get Featured Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get user's NFTs
exports.getUserNFTs = async (req, res) => {
    try {
        const { userId } = req.params;
        const { type = 'owned' } = req.query;

        let query = {};
        if (type === 'owned') {
            query.owner = userId;
        } else if (type === 'created') {
            query.creator = userId;
        } else if (type === 'listed') {
            query.owner = userId;
            query.isListed = true;
        }

        const nfts = await NFT.find(query)
            .populate('creator', 'name avatar walletAddress')
            .populate('collection', 'name logo')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, nfts });
    } catch (error) {
        console.error('Get User NFTs Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete/Burn NFT
exports.deleteNFT = async (req, res) => {
    try {
        const nft = await NFT.findById(req.params.id);

        if (!nft) {
            return res.status(404).json({ success: false, message: 'NFT not found' });
        }

        if (nft.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'You are not the owner' });
        }

        // Delete image from cloudinary
        await cloudinary.v2.uploader.destroy(nft.image.public_id);

        // Update collection count
        if (nft.collection) {
            await Collection.findByIdAndUpdate(nft.collection, { $inc: { items: -1 } });
        }

        await nft.deleteOne();

        res.status(200).json({ success: true, message: 'NFT deleted successfully' });
    } catch (error) {
        console.error('Delete NFT Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get live auctions
exports.getLiveAuctions = async (req, res) => {
    try {
        const nfts = await NFT.find({
            isAuction: true,
            isListed: true,
            auctionEndTime: { $gt: new Date() }
        })
            .populate('creator', 'name avatar walletAddress')
            .populate('owner', 'name avatar walletAddress')
            .sort({ auctionEndTime: 1 })
            .limit(12);

        res.status(200).json({ success: true, nfts });
    } catch (error) {
        console.error('Get Live Auctions Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get marketplace stats
exports.getMarketplaceStats = async (req, res) => {
    try {
        const totalNFTs = await NFT.countDocuments();
        const listedNFTs = await NFT.countDocuments({ isListed: true });
        const totalCollections = await Collection.countDocuments();
        
        const totalVolumeResult = await Transaction.aggregate([
            { $match: { type: 'Sale', status: 'Confirmed' } },
            { $group: { _id: null, total: { $sum: '$price' } } }
        ]);
        
        const totalVolume = totalVolumeResult[0]?.total || 0;

        res.status(200).json({
            success: true,
            stats: {
                totalNFTs,
                listedNFTs,
                totalCollections,
                totalVolume
            }
        });
    } catch (error) {
        console.error('Get Stats Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
