const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        credentials: 'include', // Include cookies for authentication
    };

    try {
        const response = await fetch(url, config);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong');
        }
        
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

// NFT API
export const nftAPI = {
    // Get all NFTs with filters
    getAll: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return apiCall(`/nft/all?${queryString}`);
    },

    // Get single NFT
    getById: (id) => apiCall(`/nft/${id}`),

    // Get trending NFTs
    getTrending: () => apiCall('/nft/trending'),

    // Get featured NFTs
    getFeatured: () => apiCall('/nft/featured'),

    // Get live auctions
    getAuctions: () => apiCall('/nft/auctions'),

    // Get user's NFTs
    getUserNFTs: (userId, type = 'owned') => 
        apiCall(`/nft/user/${userId}?type=${type}`),

    // Get marketplace stats
    getStats: () => apiCall('/nft/stats'),

    // Create NFT (requires FormData for file upload)
    create: async (formData) => {
        const url = `${API_BASE_URL}/nft/create`;
        const response = await fetch(url, {
            method: 'POST',
            body: formData,
            credentials: 'include',
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        return data;
    },

    // List NFT for sale
    list: (id, price) => 
        apiCall(`/nft/list/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ price }),
        }),

    // Start auction
    startAuction: (id, startingPrice, endTime) => 
        apiCall(`/nft/auction/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ startingPrice, endTime }),
        }),

    // Place bid
    placeBid: (id, amount, transactionHash) => 
        apiCall(`/nft/bid/${id}`, {
            method: 'POST',
            body: JSON.stringify({ amount, transactionHash }),
        }),

    // Buy NFT
    buy: (id, transactionHash) => 
        apiCall(`/nft/buy/${id}`, {
            method: 'POST',
            body: JSON.stringify({ transactionHash }),
        }),

    // Like/Unlike NFT
    toggleLike: (id) => 
        apiCall(`/nft/like/${id}`, { method: 'PUT' }),

    // Delete NFT
    delete: (id) => 
        apiCall(`/nft/${id}`, { method: 'DELETE' }),
};

// Collection API
export const collectionAPI = {
    // Get all collections
    getAll: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return apiCall(`/collection/all?${queryString}`);
    },

    // Get single collection
    getById: (id) => apiCall(`/collection/${id}`),

    // Get collection by slug
    getBySlug: (slug) => apiCall(`/collection/slug/${slug}`),

    // Get top collections
    getTop: () => apiCall('/collection/top'),

    // Get featured collections
    getFeatured: () => apiCall('/collection/featured'),

    // Get user's collections
    getUserCollections: (userId) => apiCall(`/collection/user/${userId}`),

    // Create collection
    create: async (formData) => {
        const url = `${API_BASE_URL}/collection/create`;
        const response = await fetch(url, {
            method: 'POST',
            body: formData,
            credentials: 'include',
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        return data;
    },

    // Update collection
    update: async (id, formData) => {
        const url = `${API_BASE_URL}/collection/${id}`;
        const response = await fetch(url, {
            method: 'PUT',
            body: formData,
            credentials: 'include',
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        return data;
    },

    // Delete collection
    delete: (id) => 
        apiCall(`/collection/${id}`, { method: 'DELETE' }),
};

// User API
export const userAPI = {
    // Login with wallet
    loginWithWallet: (walletAddress, signature) => 
        apiCall('/user/wallet-login', {
            method: 'POST',
            body: JSON.stringify({ walletAddress, signature }),
        }),

    // Get user profile
    getProfile: (userId) => apiCall(`/user/${userId}`),

    // Get current user
    getMe: () => apiCall('/user/me'),

    // Update profile
    updateProfile: (data) => 
        apiCall('/user/update', {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    // Follow user
    follow: (userId) => 
        apiCall(`/user/follow/${userId}`, { method: 'POST' }),

    // Unfollow user
    unfollow: (userId) => 
        apiCall(`/user/unfollow/${userId}`, { method: 'POST' }),

    // Get notifications
    getNotifications: () => apiCall('/user/notifications'),

    // Mark notification as read
    markNotificationRead: (notificationId) => 
        apiCall(`/user/notifications/${notificationId}/read`, { method: 'PUT' }),
};

export default { nftAPI, collectionAPI, userAPI };
