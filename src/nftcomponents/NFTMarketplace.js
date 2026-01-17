import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NFTHeader from './NFTHeader';
import NFTCard from './NFTCard';
import NFTFooter from './NFTFooter';
import './nftStyles.css';

const NFTMarketplace = () => {
    const [trendingNFTs, setTrendingNFTs] = useState([]);
    const [liveAuctions, setLiveAuctions] = useState([]);
    const [topCollections, setTopCollections] = useState([]);
    const [loading, setLoading] = useState(true);

    // Demo data
    const demoNFTs = [
        {
            _id: '1',
            name: 'Cosmic Voyager #042',
            image: { url: 'https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?w=400&q=80' },
            price: 2.45,
            currency: 'ETH',
            creator: { name: 'CosmicArt', avatar: { url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cosmic' } },
            collection: { name: 'Cosmic Collection' },
            likes: new Array(124),
            isAuction: false
        },
        {
            _id: '2',
            name: 'Neon Dreams #118',
            image: { url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80' },
            price: 1.88,
            currency: 'ETH',
            creator: { name: 'NeonMaster', avatar: { url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=neon' } },
            collection: { name: 'Neon Series' },
            likes: new Array(89),
            isAuction: true,
            auctionEndTime: new Date(Date.now() + 3600000 * 5)
        },
        {
            _id: '3',
            name: 'Digital Genesis #001',
            image: { url: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=400&q=80' },
            price: 5.20,
            currency: 'ETH',
            creator: { name: 'Genesis', avatar: { url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=genesis' } },
            collection: { name: 'Genesis Drop' },
            likes: new Array(256),
            isAuction: false
        },
        {
            _id: '4',
            name: 'Abstract Mind #067',
            image: { url: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=400&q=80' },
            price: 0.95,
            currency: 'ETH',
            creator: { name: 'AbstractAI', avatar: { url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=abstract' } },
            collection: { name: 'Mind Collection' },
            likes: new Array(67),
            isAuction: true,
            auctionEndTime: new Date(Date.now() + 3600000 * 12)
        },
        {
            _id: '5',
            name: 'Crypto Punk Remix #322',
            image: { url: 'https://images.unsplash.com/photo-1637858868799-7f26a0640eb6?w=400&q=80' },
            price: 8.50,
            currency: 'ETH',
            creator: { name: 'PunkArtist', avatar: { url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=punk' } },
            collection: { name: 'Punk Remixes' },
            likes: new Array(445),
            isAuction: false
        },
        {
            _id: '6',
            name: 'Ethereal Sunset #089',
            image: { url: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400&q=80' },
            price: 3.15,
            currency: 'ETH',
            creator: { name: 'SunsetLab', avatar: { url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sunset' } },
            collection: { name: 'Ethereal Series' },
            likes: new Array(178),
            isAuction: false
        },
        {
            _id: '7',
            name: 'Metaverse Land #456',
            image: { url: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=400&q=80' },
            price: 12.00,
            currency: 'ETH',
            creator: { name: 'MetaBuilder', avatar: { url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=meta' } },
            collection: { name: 'Virtual Lands' },
            likes: new Array(567),
            isAuction: true,
            auctionEndTime: new Date(Date.now() + 3600000 * 24)
        },
        {
            _id: '8',
            name: 'Glitch Art #012',
            image: { url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&q=80' },
            price: 0.75,
            currency: 'ETH',
            creator: { name: 'GlitchMaker', avatar: { url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=glitch' } },
            collection: { name: 'Glitch Collection' },
            likes: new Array(34),
            isAuction: false
        }
    ];

    const demoCollections = [
        { _id: '1', name: 'Bored Ape Yacht Club', image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=100', floorPrice: 68.5, volume: 890234, change: 12.5, verified: true },
        { _id: '2', name: 'CryptoPunks', image: 'https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?w=100', floorPrice: 52.3, volume: 756123, change: -5.2, verified: true },
        { _id: '3', name: 'Mutant Ape Yacht Club', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100', floorPrice: 15.8, volume: 432567, change: 8.7, verified: true },
        { _id: '4', name: 'Azuki', image: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=100', floorPrice: 11.2, volume: 321456, change: 15.3, verified: true },
        { _id: '5', name: 'Doodles', image: 'https://images.unsplash.com/photo-1637858868799-7f26a0640eb6?w=100', floorPrice: 8.4, volume: 234567, change: -2.1, verified: true },
        { _id: '6', name: 'CloneX', image: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=100', floorPrice: 6.9, volume: 198765, change: 22.4, verified: true },
    ];

    const categories = [
        { name: 'Art', icon: '🎨', count: 12453 },
        { name: 'Music', icon: '🎵', count: 8234 },
        { name: 'Photography', icon: '📸', count: 5678 },
        { name: 'Gaming', icon: '🎮', count: 9876 },
        { name: 'Sports', icon: '⚽', count: 4321 },
        { name: 'Collectibles', icon: '💎', count: 7654 },
        { name: 'Virtual Worlds', icon: '🌍', count: 3456 },
        { name: 'Utility', icon: '⚡', count: 2345 }
    ];

    const topCreators = [
        { name: 'CryptoKing', sales: '245.8 ETH', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=king' },
        { name: 'ArtistPro', sales: '198.4 ETH', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=artist' },
        { name: 'DigitalDream', sales: '156.2 ETH', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dream' },
        { name: 'NFTMaster', sales: '134.7 ETH', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=master' },
        { name: 'PixelPioneer', sales: '112.3 ETH', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=pixel' },
        { name: 'CyberCreator', sales: '98.5 ETH', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cyber' }
    ];

    useEffect(() => {
        // Simulate loading
        setTimeout(() => {
            setTrendingNFTs(demoNFTs);
            setLiveAuctions(demoNFTs.filter(nft => nft.isAuction));
            setTopCollections(demoCollections);
            setLoading(false);
        }, 500);
    }, []);

    return (
        <div className="nft-marketplace">
            <NFTHeader />

            {/* Hero Section */}
            <section className="nft-hero">
                <div className="nft-hero-content">
                    <div className="nft-hero-text">
                        <h1>
                            Discover, Collect & Sell<br />
                            <span className="gradient-text">Extraordinary NFTs</span>
                        </h1>
                        <p>
                            The world's premier NFT marketplace. Explore exclusive digital art, 
                            collectibles, and virtual assets from renowned creators worldwide.
                        </p>
                        <div className="nft-hero-buttons">
                            <Link to="/marketplace/explore" className="nft-btn nft-btn-primary">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="11" cy="11" r="8"/>
                                    <path d="M21 21l-4.35-4.35"/>
                                </svg>
                                Explore Now
                            </Link>
                            <Link to="/marketplace/create" className="nft-btn nft-btn-secondary">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 5v14M5 12h14"/>
                                </svg>
                                Create NFT
                            </Link>
                        </div>
                        <div className="nft-hero-stats">
                            <div className="nft-hero-stat">
                                <div className="nft-hero-stat-value">240K+</div>
                                <div className="nft-hero-stat-label">Total Sales</div>
                            </div>
                            <div className="nft-hero-stat">
                                <div className="nft-hero-stat-value">100K+</div>
                                <div className="nft-hero-stat-label">Auctions</div>
                            </div>
                            <div className="nft-hero-stat">
                                <div className="nft-hero-stat-value">180K+</div>
                                <div className="nft-hero-stat-label">Artists</div>
                            </div>
                        </div>
                    </div>
                    <div className="nft-hero-featured">
                        <div className="nft-hero-card">
                            <img 
                                src="https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?w=600&q=80" 
                                alt="Featured NFT"
                                className="nft-hero-card-image"
                            />
                            <div className="nft-hero-card-info">
                                <h3 className="nft-hero-card-title">Cosmic Voyager #042</h3>
                                <div className="nft-hero-card-creator">
                                    <img 
                                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=cosmic"
                                        alt="Creator"
                                        className="nft-hero-card-avatar"
                                    />
                                    <span>Created by <strong>CosmicArt</strong></span>
                                </div>
                                <div className="nft-hero-card-price">
                                    <div>
                                        <div className="nft-hero-card-price-label">Current Bid</div>
                                        <div className="nft-hero-card-price-value">
                                            <span style={{ color: '#22d3ee' }}>Ξ</span> 4.89 ETH
                                        </div>
                                    </div>
                                    <div className="nft-hero-card-ending">
                                        <div className="nft-hero-card-price-label">Ends in</div>
                                        <span>12h 43m 22s</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Live Auctions */}
            <section className="nft-section" style={{ background: 'linear-gradient(180deg, transparent, rgba(124, 58, 237, 0.05))' }}>
                <div className="nft-section-header">
                    <div>
                        <h2 className="nft-section-title">
                            🔥 Live <span className="gradient-text">Auctions</span>
                        </h2>
                        <p className="nft-section-subtitle">Bid on exclusive NFTs before time runs out</p>
                    </div>
                    <Link to="/marketplace/auctions" className="nft-section-link">
                        View All
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                    </Link>
                </div>
                <div className="nft-auctions-slider">
                    {liveAuctions.map((nft, index) => (
                        <div key={nft._id} className="nft-auction-card animate-fadeIn" style={{ animationDelay: `${index * 0.1}s` }}>
                            <div className="nft-auction-live">LIVE</div>
                            <NFTCard nft={nft} showCountdown />
                        </div>
                    ))}
                </div>
            </section>

            {/* Trending NFTs */}
            <section className="nft-section">
                <div className="nft-section-header">
                    <div>
                        <h2 className="nft-section-title">
                            ⚡ Trending <span className="gradient-text">NFTs</span>
                        </h2>
                        <p className="nft-section-subtitle">Discover the most popular items right now</p>
                    </div>
                    <Link to="/marketplace/explore" className="nft-section-link">
                        View All
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                    </Link>
                </div>
                <div className="nft-grid">
                    {trendingNFTs.slice(0, 8).map((nft, index) => (
                        <div key={nft._id} className="animate-fadeIn" style={{ animationDelay: `${index * 0.1}s` }}>
                            <NFTCard nft={nft} />
                        </div>
                    ))}
                </div>
            </section>

            {/* Top Collections */}
            <section className="nft-section" style={{ background: 'linear-gradient(180deg, transparent, rgba(236, 72, 153, 0.05))' }}>
                <div className="nft-section-header">
                    <div>
                        <h2 className="nft-section-title">
                            🏆 Top <span className="gradient-text-gold">Collections</span>
                        </h2>
                        <p className="nft-section-subtitle">The most traded collections in the last 24 hours</p>
                    </div>
                    <Link to="/marketplace/collections" className="nft-section-link">
                        View All
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                    </Link>
                </div>
                <div className="nft-collections-list">
                    {topCollections.map((collection, index) => (
                        <Link to={`/marketplace/collection/${collection._id}`} key={collection._id} className="nft-collection-item animate-fadeIn" style={{ animationDelay: `${index * 0.1}s` }}>
                            <span className="nft-collection-rank">{index + 1}</span>
                            <img src={collection.image} alt={collection.name} className="nft-collection-image" />
                            <div className="nft-collection-info">
                                <div className="nft-collection-name">
                                    {collection.name}
                                    {collection.verified && (
                                        <svg className="nft-verified-badge" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                                        </svg>
                                    )}
                                </div>
                                <div className="nft-collection-stats">
                                    <span>Floor: {collection.floorPrice} ETH</span>
                                    <span className={`nft-collection-change ${collection.change < 0 ? 'negative' : ''}`}>
                                        {collection.change > 0 ? '+' : ''}{collection.change}%
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Browse by Category */}
            <section className="nft-section">
                <div className="nft-section-header">
                    <div>
                        <h2 className="nft-section-title">
                            📂 Browse by <span className="gradient-text">Category</span>
                        </h2>
                        <p className="nft-section-subtitle">Explore NFTs across different categories</p>
                    </div>
                </div>
                <div className="nft-categories">
                    {categories.slice(0, 4).map((category, index) => (
                        <Link to={`/marketplace/explore?category=${category.name}`} key={category.name} className="nft-category animate-fadeIn" style={{ animationDelay: `${index * 0.1}s` }}>
                            <div className="nft-category-icon">{category.icon}</div>
                            <h3 className="nft-category-name">{category.name}</h3>
                            <p className="nft-category-count">{category.count.toLocaleString()} items</p>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Top Creators */}
            <section className="nft-section" style={{ background: 'linear-gradient(180deg, transparent, rgba(59, 130, 246, 0.05))' }}>
                <div className="nft-section-header">
                    <div>
                        <h2 className="nft-section-title">
                            ⭐ Top <span className="gradient-text">Creators</span>
                        </h2>
                        <p className="nft-section-subtitle">Discover talented artists and creators</p>
                    </div>
                    <Link to="/marketplace/creators" className="nft-section-link">
                        View All
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                    </Link>
                </div>
                <div className="nft-creators">
                    {topCreators.map((creator, index) => (
                        <div key={creator.name} className="nft-creator animate-fadeIn" style={{ animationDelay: `${index * 0.1}s` }}>
                            <img src={creator.avatar} alt={creator.name} className="nft-creator-avatar" />
                            <h4 className="nft-creator-name">{creator.name}</h4>
                            <p className="nft-creator-sales">Total Sales: <span>{creator.sales}</span></p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="nft-section" style={{ textAlign: 'center', padding: '100px 40px' }}>
                <h2 style={{ fontSize: '48px', marginBottom: '24px' }}>
                    Ready to <span className="gradient-text">Start Creating?</span>
                </h2>
                <p style={{ fontSize: '18px', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 40px' }}>
                    Join thousands of creators and collectors in the NFT revolution. 
                    Mint your first NFT and start earning today.
                </p>
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                    <Link to="/marketplace/create" className="nft-btn nft-btn-primary" style={{ padding: '16px 40px', fontSize: '16px' }}>
                        Create Your First NFT
                    </Link>
                    <Link to="/marketplace/explore" className="nft-btn nft-btn-secondary" style={{ padding: '16px 40px', fontSize: '16px' }}>
                        Explore Marketplace
                    </Link>
                </div>
            </section>

            <NFTFooter />
        </div>
    );
};

export default NFTMarketplace;
