import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAccount } from 'wagmi';
import NFTHeader from './NFTHeader';
import NFTCard from './NFTCard';
import NFTFooter from './NFTFooter';
import './nftStyles.css';

const NFTProfile = () => {
    const { address: walletAddress } = useParams();
    const { address: connectedAddress, isConnected } = useAccount();
    const [user, setUser] = useState(null);
    const [nfts, setNfts] = useState([]);
    const [activeTab, setActiveTab] = useState('owned');
    const [loading, setLoading] = useState(true);

    const isOwnProfile = !walletAddress || walletAddress === connectedAddress;

    // Demo user data
    const demoUser = {
        _id: 'user1',
        name: 'CryptoCollector',
        walletAddress: connectedAddress || '0x1234...5678',
        avatar: { url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=collector' },
        banner: 'https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?w=1200&q=80',
        bio: 'Digital art enthusiast and NFT collector. Building the future of digital ownership one pixel at a time. 🚀',
        verified: true,
        followers: 2456,
        following: 189,
        joinedDate: 'January 2024',
        socialLinks: {
            twitter: 'cryptocollector',
            instagram: 'crypto.collector'
        },
        stats: {
            totalSales: '245.8 ETH',
            totalPurchases: '189.4 ETH',
            itemsCreated: 48,
            itemsOwned: 127
        }
    };

    const demoNFTs = [
        { _id: '1', name: 'Cosmic Voyager #042', image: { url: 'https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?w=400&q=80' }, price: 2.45, currency: 'ETH', creator: { name: 'CryptoCollector' }, collection: { name: 'Cosmic Collection' }, likes: new Array(124), type: 'owned' },
        { _id: '2', name: 'Neon Dreams #118', image: { url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80' }, price: 1.88, currency: 'ETH', creator: { name: 'CryptoCollector' }, collection: { name: 'Neon Series' }, likes: new Array(89), type: 'created', isAuction: true, auctionEndTime: new Date(Date.now() + 3600000 * 5) },
        { _id: '3', name: 'Digital Genesis #001', image: { url: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=400&q=80' }, price: 5.20, currency: 'ETH', creator: { name: 'CryptoCollector' }, collection: { name: 'Genesis Drop' }, likes: new Array(256), type: 'owned' },
        { _id: '4', name: 'Abstract Mind #067', image: { url: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=400&q=80' }, price: 0.95, currency: 'ETH', creator: { name: 'CryptoCollector' }, collection: { name: 'Mind Collection' }, likes: new Array(67), type: 'created' },
        { _id: '5', name: 'Crypto Punk Remix #322', image: { url: 'https://images.unsplash.com/photo-1637858868799-7f26a0640eb6?w=400&q=80' }, price: 8.50, currency: 'ETH', creator: { name: 'CryptoCollector' }, collection: { name: 'Punk Remixes' }, likes: new Array(445), type: 'listed', isListed: true },
        { _id: '6', name: 'Ethereal Sunset #089', image: { url: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400&q=80' }, price: 3.15, currency: 'ETH', creator: { name: 'OtherArtist' }, collection: { name: 'Ethereal Series' }, likes: new Array(178), type: 'liked' },
    ];

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setUser(demoUser);
            setNfts(demoNFTs);
            setLoading(false);
        }, 500);
    }, [walletAddress]);

    const filteredNFTs = nfts.filter(nft => {
        switch (activeTab) {
            case 'owned':
                return nft.type === 'owned' || nft.type === 'created';
            case 'created':
                return nft.type === 'created';
            case 'listed':
                return nft.type === 'listed' || nft.isListed;
            case 'liked':
                return nft.type === 'liked';
            default:
                return true;
        }
    });

    const formatAddress = (addr) => {
        if (!addr) return '';
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    };

    const copyAddress = () => {
        navigator.clipboard.writeText(user?.walletAddress || '');
        // Show toast notification
    };

    if (loading) {
        return (
            <div className="nft-marketplace">
                <NFTHeader />
                <div className="nft-profile">
                    <div className="nft-skeleton" style={{ height: '280px' }}></div>
                    <div className="nft-profile-header">
                        <div className="nft-skeleton" style={{ width: '160px', height: '160px', borderRadius: '50%' }}></div>
                        <div style={{ marginTop: '24px' }}>
                            <div className="nft-skeleton" style={{ height: '32px', width: '200px', marginBottom: '16px' }}></div>
                            <div className="nft-skeleton" style={{ height: '20px', width: '300px' }}></div>
                        </div>
                    </div>
                </div>
                <NFTFooter />
            </div>
        );
    }

    return (
        <div className="nft-marketplace">
            <NFTHeader />
            
            <div className="nft-profile">
                {/* Banner */}
                <div 
                    className="nft-profile-banner"
                    style={{ 
                        backgroundImage: `url(${user?.banner})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                >
                    {isOwnProfile && (
                        <button 
                            style={{
                                position: 'absolute',
                                bottom: '20px',
                                right: '40px',
                                padding: '10px 20px',
                                background: 'rgba(0,0,0,0.5)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                borderRadius: 'var(--radius-full)',
                                color: 'white',
                                cursor: 'pointer',
                                fontSize: '14px'
                            }}
                        >
                            Edit Cover
                        </button>
                    )}
                </div>

                {/* Profile Header */}
                <div className="nft-profile-header">
                    <img 
                        src={user?.avatar?.url}
                        alt={user?.name}
                        className="nft-profile-avatar"
                    />
                    
                    <div className="nft-profile-info">
                        <div>
                            <h1 className="nft-profile-name">
                                {user?.name}
                                {user?.verified && (
                                    <svg className="nft-verified-badge" width="24" height="24" viewBox="0 0 24 24" fill="#3b82f6">
                                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                                    </svg>
                                )}
                            </h1>
                            <div className="nft-profile-wallet" onClick={copyAddress}>
                                {formatAddress(user?.walletAddress)}
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                                </svg>
                            </div>
                            <p className="nft-profile-bio">{user?.bio}</p>
                            <div className="nft-profile-stats">
                                <div className="nft-profile-stat">
                                    <div className="nft-profile-stat-value">{user?.stats?.itemsOwned}</div>
                                    <div className="nft-profile-stat-label">Items</div>
                                </div>
                                <div className="nft-profile-stat">
                                    <div className="nft-profile-stat-value">{user?.followers?.toLocaleString()}</div>
                                    <div className="nft-profile-stat-label">Followers</div>
                                </div>
                                <div className="nft-profile-stat">
                                    <div className="nft-profile-stat-value">{user?.stats?.totalSales}</div>
                                    <div className="nft-profile-stat-label">Total Sales</div>
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                            {isOwnProfile ? (
                                <button className="nft-btn nft-btn-secondary">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                    </svg>
                                    Edit Profile
                                </button>
                            ) : (
                                <>
                                    <button className="nft-btn nft-btn-primary">Follow</button>
                                    <button className="nft-btn-icon">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="1"/>
                                            <circle cx="19" cy="12" r="1"/>
                                            <circle cx="5" cy="12" r="1"/>
                                        </svg>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="nft-profile-tabs">
                    <div className="nft-detail-tabs" style={{ borderBottom: 'none', marginBottom: '24px' }}>
                        <button 
                            className={`nft-detail-tab ${activeTab === 'owned' ? 'active' : ''}`}
                            onClick={() => setActiveTab('owned')}
                        >
                            Owned ({demoNFTs.filter(n => n.type === 'owned' || n.type === 'created').length})
                        </button>
                        <button 
                            className={`nft-detail-tab ${activeTab === 'created' ? 'active' : ''}`}
                            onClick={() => setActiveTab('created')}
                        >
                            Created ({demoNFTs.filter(n => n.type === 'created').length})
                        </button>
                        <button 
                            className={`nft-detail-tab ${activeTab === 'listed' ? 'active' : ''}`}
                            onClick={() => setActiveTab('listed')}
                        >
                            Listed ({demoNFTs.filter(n => n.type === 'listed' || n.isListed).length})
                        </button>
                        <button 
                            className={`nft-detail-tab ${activeTab === 'liked' ? 'active' : ''}`}
                            onClick={() => setActiveTab('liked')}
                        >
                            Liked ({demoNFTs.filter(n => n.type === 'liked').length})
                        </button>
                    </div>

                    {/* NFTs Grid */}
                    {filteredNFTs.length > 0 ? (
                        <div className="nft-grid">
                            {filteredNFTs.map((nft, index) => (
                                <div key={nft._id} className="animate-fadeIn" style={{ animationDelay: `${index * 0.05}s` }}>
                                    <NFTCard nft={nft} showCountdown={nft.isAuction} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
                            <div style={{ fontSize: '64px', marginBottom: '24px' }}>
                                {activeTab === 'owned' && '📦'}
                                {activeTab === 'created' && '🎨'}
                                {activeTab === 'listed' && '🏷️'}
                                {activeTab === 'liked' && '❤️'}
                            </div>
                            <h3 style={{ fontSize: '24px', marginBottom: '12px' }}>No NFTs Found</h3>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                                {activeTab === 'owned' && "You don't own any NFTs yet."}
                                {activeTab === 'created' && "You haven't created any NFTs yet."}
                                {activeTab === 'listed' && "You don't have any listed NFTs."}
                                {activeTab === 'liked' && "You haven't liked any NFTs yet."}
                            </p>
                            {isOwnProfile && (
                                <Link to="/marketplace/explore" className="nft-btn nft-btn-primary">
                                    Explore NFTs
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <NFTFooter />
        </div>
    );
};

export default NFTProfile;
