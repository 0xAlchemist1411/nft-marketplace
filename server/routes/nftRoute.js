const express = require('express');
const router = express.Router();
const { isAuthenticatedUser } = require('../middlewares/user_actions/auth');
const {
    createNFT,
    getAllNFTs,
    getNFT,
    listNFT,
    startAuction,
    placeBid,
    buyNFT,
    toggleLike,
    getTrendingNFTs,
    getFeaturedNFTs,
    getUserNFTs,
    deleteNFT,
    getLiveAuctions,
    getMarketplaceStats
} = require('../controllers/nftController');

// Public routes
router.get('/all', getAllNFTs);
router.get('/trending', getTrendingNFTs);
router.get('/featured', getFeaturedNFTs);
router.get('/auctions', getLiveAuctions);
router.get('/stats', getMarketplaceStats);
router.get('/user/:userId', getUserNFTs);
router.get('/:id', getNFT);

// Protected routes
router.post('/create', isAuthenticatedUser, createNFT);
router.put('/list/:id', isAuthenticatedUser, listNFT);
router.put('/auction/:id', isAuthenticatedUser, startAuction);
router.post('/bid/:id', isAuthenticatedUser, placeBid);
router.post('/buy/:id', isAuthenticatedUser, buyNFT);
router.put('/like/:id', isAuthenticatedUser, toggleLike);
router.delete('/:id', isAuthenticatedUser, deleteNFT);

module.exports = router;
