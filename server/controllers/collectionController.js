const Collection = require('../models/Collection');
const NFT = require('../models/NFT');
const cloudinary = require('cloudinary');

// Create collection
exports.createCollection = async (req, res) => {
    try {
        const { name, description, category, blockchain, royalty, socialLinks } = req.body;

        let logoResult = null;
        let bannerResult = null;

        if (req.files?.logo) {
            logoResult = await cloudinary.v2.uploader.upload(req.files.logo.tempFilePath, {
                folder: 'nft-collections',
                quality: 'auto:best'
            });
        }

        if (req.files?.banner) {
            bannerResult = await cloudinary.v2.uploader.upload(req.files.banner.tempFilePath, {
                folder: 'nft-collections',
                quality: 'auto:best'
            });
        }

        const collection = await Collection.create({
            name,
            description,
            category,
            blockchain: blockchain || 'Ethereum',
            royalty: parseFloat(royalty) || 10,
            creator: req.user._id,
            logo: logoResult ? {
                public_id: logoResult.public_id,
                url: logoResult.secure_url
            } : undefined,
            banner: bannerResult ? {
                public_id: bannerResult.public_id,
                url: bannerResult.secure_url
            } : undefined,
            socialLinks: socialLinks ? JSON.parse(socialLinks) : {}
        });

        res.status(201).json({
            success: true,
            message: 'Collection created successfully',
            collection
        });
    } catch (error) {
        console.error('Create Collection Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all collections
exports.getAllCollections = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 12, 
            category, 
            sort = 'newest',
            search 
        } = req.query;

        let query = {};

        if (category) query.category = category;
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
            case 'volume_high':
                sortOption = { totalVolume: -1 };
                break;
            case 'volume_low':
                sortOption = { totalVolume: 1 };
                break;
            case 'floor_high':
                sortOption = { floorPrice: -1 };
                break;
            case 'floor_low':
                sortOption = { floorPrice: 1 };
                break;
            default:
                sortOption = { createdAt: -1 };
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const collections = await Collection.find(query)
            .populate('creator', 'name avatar walletAddress verified')
            .sort(sortOption)
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Collection.countDocuments(query);

        res.status(200).json({
            success: true,
            collections,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit)),
                totalItems: total,
                hasMore: skip + collections.length < total
            }
        });
    } catch (error) {
        console.error('Get Collections Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get single collection
exports.getCollection = async (req, res) => {
    try {
        const collection = await Collection.findById(req.params.id)
            .populate('creator', 'name avatar walletAddress verified');

        if (!collection) {
            return res.status(404).json({ success: false, message: 'Collection not found' });
        }

        // Get collection NFTs
        const nfts = await NFT.find({ collection: collection._id })
            .populate('owner', 'name avatar walletAddress')
            .sort({ createdAt: -1 });

        // Calculate floor price
        const listedNFTs = nfts.filter(nft => nft.isListed);
        const floorPrice = listedNFTs.length > 0 
            ? Math.min(...listedNFTs.map(nft => nft.price))
            : 0;

        // Update floor price
        await Collection.findByIdAndUpdate(collection._id, { floorPrice });

        res.status(200).json({ 
            success: true, 
            collection: { ...collection.toObject(), floorPrice },
            nfts 
        });
    } catch (error) {
        console.error('Get Collection Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get collection by slug
exports.getCollectionBySlug = async (req, res) => {
    try {
        const collection = await Collection.findOne({ slug: req.params.slug })
            .populate('creator', 'name avatar walletAddress verified');

        if (!collection) {
            return res.status(404).json({ success: false, message: 'Collection not found' });
        }

        const nfts = await NFT.find({ collection: collection._id })
            .populate('owner', 'name avatar walletAddress')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, collection, nfts });
    } catch (error) {
        console.error('Get Collection by Slug Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update collection
exports.updateCollection = async (req, res) => {
    try {
        const collection = await Collection.findById(req.params.id);

        if (!collection) {
            return res.status(404).json({ success: false, message: 'Collection not found' });
        }

        if (collection.creator.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        const updates = {};
        const { description, socialLinks } = req.body;

        if (description) updates.description = description;
        if (socialLinks) updates.socialLinks = JSON.parse(socialLinks);

        if (req.files?.logo) {
            if (collection.logo?.public_id) {
                await cloudinary.v2.uploader.destroy(collection.logo.public_id);
            }
            const result = await cloudinary.v2.uploader.upload(req.files.logo.tempFilePath, {
                folder: 'nft-collections'
            });
            updates.logo = { public_id: result.public_id, url: result.secure_url };
        }

        if (req.files?.banner) {
            if (collection.banner?.public_id) {
                await cloudinary.v2.uploader.destroy(collection.banner.public_id);
            }
            const result = await cloudinary.v2.uploader.upload(req.files.banner.tempFilePath, {
                folder: 'nft-collections'
            });
            updates.banner = { public_id: result.public_id, url: result.secure_url };
        }

        const updatedCollection = await Collection.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true }
        ).populate('creator', 'name avatar walletAddress');

        res.status(200).json({
            success: true,
            message: 'Collection updated successfully',
            collection: updatedCollection
        });
    } catch (error) {
        console.error('Update Collection Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete collection
exports.deleteCollection = async (req, res) => {
    try {
        const collection = await Collection.findById(req.params.id);

        if (!collection) {
            return res.status(404).json({ success: false, message: 'Collection not found' });
        }

        if (collection.creator.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        // Remove collection reference from NFTs
        await NFT.updateMany({ collection: collection._id }, { $unset: { collection: 1 } });

        // Delete images
        if (collection.logo?.public_id) {
            await cloudinary.v2.uploader.destroy(collection.logo.public_id);
        }
        if (collection.banner?.public_id) {
            await cloudinary.v2.uploader.destroy(collection.banner.public_id);
        }

        await collection.deleteOne();

        res.status(200).json({ success: true, message: 'Collection deleted successfully' });
    } catch (error) {
        console.error('Delete Collection Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get top collections
exports.getTopCollections = async (req, res) => {
    try {
        const { period = '7d' } = req.query;

        const collections = await Collection.find()
            .populate('creator', 'name avatar walletAddress verified')
            .sort({ totalVolume: -1 })
            .limit(10);

        res.status(200).json({ success: true, collections });
    } catch (error) {
        console.error('Get Top Collections Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get user's collections
exports.getUserCollections = async (req, res) => {
    try {
        const collections = await Collection.find({ creator: req.params.userId })
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, collections });
    } catch (error) {
        console.error('Get User Collections Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get featured collections
exports.getFeaturedCollections = async (req, res) => {
    try {
        const collections = await Collection.find({ isFeatured: true })
            .populate('creator', 'name avatar walletAddress verified')
            .limit(6);

        res.status(200).json({ success: true, collections });
    } catch (error) {
        console.error('Get Featured Collections Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
