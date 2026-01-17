const express = require('express');
const router = express.Router();
const { isAuthenticatedUser } = require('../middlewares/user_actions/auth');
const {
    createCollection,
    getAllCollections,
    getCollection,
    getCollectionBySlug,
    updateCollection,
    deleteCollection,
    getTopCollections,
    getUserCollections,
    getFeaturedCollections
} = require('../controllers/collectionController');

// Public routes
router.get('/all', getAllCollections);
router.get('/top', getTopCollections);
router.get('/featured', getFeaturedCollections);
router.get('/user/:userId', getUserCollections);
router.get('/slug/:slug', getCollectionBySlug);
router.get('/:id', getCollection);

// Protected routes
router.post('/create', isAuthenticatedUser, createCollection);
router.put('/:id', isAuthenticatedUser, updateCollection);
router.delete('/:id', isAuthenticatedUser, deleteCollection);

module.exports = router;
