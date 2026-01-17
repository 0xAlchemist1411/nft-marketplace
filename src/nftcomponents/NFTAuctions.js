import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NFTHeader from './NFTHeader';
import NFTCard from './NFTCard';
import NFTFooter from './NFTFooter';
import './nftStyles.css';

const NFTAuctions = () => {
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('all');

    // Demo auctions data
    const demoAuctions = [
        {
            _id: '1',
            name: 'Cosmic Voyager #042',
            image: { url: 'https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?w=400&q=80' },
            price: 4.89,
            currency: 'ETH',
            creator: { name: 'CosmicArt', avatar: { url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cosmic' } },
            collection: { name: 'Cosmic Collection' },
            likes: new Array(124),
            isAuction: true,
            auctionEndTime: new Date(Date.now() + 3600000 * 2), // 2 hours
            highestBid: { amount: 4.89, bidder: { name: 'HighBidder' } },
            bidsCount: 12
        },
        {
            _id: '2',
            name: 'Neon Dreams #118',
            image: { url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80' },
            price: 2.45,
            currency: 'ETH',
            creator: { name: 'NeonMaster', avatar: { url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=neon' } },
            collection: { name: 'Neon Series' },
            likes: new Array(89),
            isAuction: true,
            auctionEndTime: new Date(Date.now() + 3600000 * 5), // 5 hours
            highestBid: { amount: 2.45, bidder: { name: 'BidMaster' } },
            bidsCount: 8
        },
        {
            _id: '3',
            name: 'Digital Genesis #001',
            image: { url: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=400&q=80' },
            price: 8.50,
            currency: 'ETH',
            creator: { name: 'Genesis', avatar: { url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=genesis' } },
            collection: { name: 'Genesis Drop' },
            likes: new Array(256),
            isAuction: true,
            auctionEndTime: new Date(Date.now() + 3600000 * 12), // 12 hours
            highestBid: { amount: 8.50, bidder: { name: 'Collector99' } },
            bidsCount: 23
        },
        {
            _id: '4',
            name: 'Abstract Mind #067',
            image: { url: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=400&q=80' },
            price: 1.25,
            currency: 'ETH',
            creator: { name: 'AbstractAI', avatar: { url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=abstract' } },
            collection: { name: 'Mind Collection' },
            likes: new Array(67),
            isAuction: true,
            auctionEndTime: new Date(Date.now() + 3600000 * 24), // 24 hours
            highestBid: { amount: 1.25, bidder: { name: 'ArtLover' } },
            bidsCount: 5
        },
        {
            _id: '5',
            name: 'Metaverse Land #456',
            image: { url: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=400&q=80' },
            price: 15.00,
            currency: 'ETH',
            creator: { name: 'MetaBuilder', avatar: { url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=meta' } },
            collection: { name: 'Virtual Lands' },
            likes: new Array(567),
            isAuction: true,
            auctionEndTime: new Date(Date.now() + 3600000 * 48), // 48 hours
            highestBid: { amount: 15.00, bidder: { name: 'LandBaron' } },
            bidsCount: 34
        },
        {
            _id: '6',
            name: 'Rare Artifact #007',
            image: { url: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400&q=80' },
            price: 5.75,
            currency: 'ETH',
            creator: { name: 'ArtifactLab', avatar: { url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=artifact' } },
            collection: { name: 'Rare Artifacts' },
            likes: new Array(189),
            isAuction: true,
            auctionEndTime: new Date(Date.now() + 3600000 * 6), // 6 hours
            highestBid: { amount: 5.75, bidder: { name: 'RareHunter' } },
            bidsCount: 17
        },
    ];

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            let filtered = [...demoAuctions];
            
            if (activeFilter === 'ending_soon') {
                filtered.sort((a, b) => new Date(a.auctionEndTime) - new Date(b.auctionEndTime));
                filtered = filtered.filter(a => new Date(a.auctionEndTime) - new Date() < 86400000); // Within 24 hours
            } else if (activeFilter === 'highest_bid') {
                filtered.sort((a, b) => b.price - a.price);
            } else if (activeFilter === 'most_bids') {
                filtered.sort((a, b) => b.bidsCount - a.bidsCount);
            }

            setAuctions(filtered);
            setLoading(false);
        }, 300);
    }, [activeFilter]);

    const getTimeRemaining = (endTime) => {
        const diff = new Date(endTime) - new Date();
        if (diff <= 0) return 'Ended';
        
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        if (hours > 24) {
            const days = Math.floor(hours / 24);
            return `${days}d ${hours % 24}h`;
        }
        return `${hours}h ${minutes}m`;
    };

    return (
        <div className="nft-marketplace">
            <NFTHeader />
            
            <div className="nft-explore">
                <div className="nft-explore-header">
                    <h1>🔥 Live <span className="gradient-text">Auctions</span></h1>
                    <p>Bid on exclusive NFTs before time runs out</p>
                </div>

                {/* Stats Banner */}
                <div style={{
                    maxWidth: '1440px',
                    margin: '0 auto 40px',
                    padding: '0 40px'
                }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: '24px',
                        padding: '32px',
                        background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.2) 0%, rgba(236, 72, 153, 0.2) 100%)',
                        borderRadius: 'var(--radius-xl)',
                        border: '1px solid var(--border-color)'
                    }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '32px', fontWeight: '700', marginBottom: '4px' }}>{auctions.length}</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Live Auctions</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '32px', fontWeight: '700', marginBottom: '4px', color: 'var(--accent-cyan)' }}>
                                Ξ {auctions.reduce((sum, a) => sum + a.price, 0).toFixed(1)}
                            </div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Total Bids (ETH)</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '32px', fontWeight: '700', marginBottom: '4px' }}>
                                {auctions.reduce((sum, a) => sum + a.bidsCount, 0)}
                            </div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Total Bids</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '32px', fontWeight: '700', marginBottom: '4px', color: 'var(--accent-green)' }}>
                                {auctions.filter(a => new Date(a.auctionEndTime) - new Date() < 3600000 * 6).length}
                            </div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Ending Soon</div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="nft-filters">
                    <button
                        className={`nft-filter ${activeFilter === 'all' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('all')}
                    >
                        All Auctions
                    </button>
                    <button
                        className={`nft-filter ${activeFilter === 'ending_soon' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('ending_soon')}
                    >
                        ⏰ Ending Soon
                    </button>
                    <button
                        className={`nft-filter ${activeFilter === 'highest_bid' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('highest_bid')}
                    >
                        💰 Highest Bid
                    </button>
                    <button
                        className={`nft-filter ${activeFilter === 'most_bids' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('most_bids')}
                    >
                        🔥 Most Active
                    </button>
                </div>

                {/* Auctions Grid */}
                <section className="nft-section" style={{ paddingTop: '20px' }}>
                    {loading ? (
                        <div className="nft-grid">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="nft-card">
                                    <div className="nft-skeleton" style={{ aspectRatio: '1', margin: '16px' }}></div>
                                    <div style={{ padding: '20px' }}>
                                        <div className="nft-skeleton" style={{ height: '20px', marginBottom: '12px' }}></div>
                                        <div className="nft-skeleton" style={{ height: '16px', width: '60%' }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="nft-grid">
                            {auctions.map((auction, index) => (
                                <div key={auction._id} className="animate-fadeIn" style={{ animationDelay: `${index * 0.05}s` }}>
                                    <Link 
                                        to={`/marketplace/nft/${auction._id}`}
                                        style={{ textDecoration: 'none', color: 'inherit' }}
                                    >
                                        <div className="nft-card" style={{ position: 'relative' }}>
                                            {/* Live Badge */}
                                            <div style={{
                                                position: 'absolute',
                                                top: '28px',
                                                left: '28px',
                                                padding: '6px 12px',
                                                background: 'var(--accent-green)',
                                                borderRadius: 'var(--radius-full)',
                                                fontSize: '11px',
                                                fontWeight: '700',
                                                textTransform: 'uppercase',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                zIndex: 10
                                            }}>
                                                <span style={{
                                                    width: '6px',
                                                    height: '6px',
                                                    background: 'white',
                                                    borderRadius: '50%',
                                                    animation: 'pulse 1.5s infinite'
                                                }}></span>
                                                LIVE
                                            </div>

                                            {/* Time Badge */}
                                            <div style={{
                                                position: 'absolute',
                                                top: '28px',
                                                right: '28px',
                                                padding: '6px 12px',
                                                background: 'rgba(0,0,0,0.7)',
                                                backdropFilter: 'blur(10px)',
                                                borderRadius: 'var(--radius-full)',
                                                fontSize: '12px',
                                                fontWeight: '600',
                                                color: new Date(auction.auctionEndTime) - new Date() < 3600000 * 6 ? 'var(--accent-pink)' : 'var(--accent-cyan)',
                                                zIndex: 10
                                            }}>
                                                ⏱ {getTimeRemaining(auction.auctionEndTime)}
                                            </div>

                                            <div className="nft-card-image-wrapper">
                                                <img 
                                                    src={auction.image.url}
                                                    alt={auction.name}
                                                    className="nft-card-image"
                                                />
                                            </div>

                                            <div className="nft-card-content">
                                                <div className="nft-card-collection">{auction.collection.name}</div>
                                                <h3 className="nft-card-title">{auction.name}</h3>
                                                
                                                <div className="nft-card-creator">
                                                    <img 
                                                        src={auction.creator.avatar?.url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${auction.creator.name}`}
                                                        alt={auction.creator.name}
                                                        className="nft-card-avatar"
                                                    />
                                                    <span className="nft-card-creator-name">
                                                        By <span>{auction.creator.name}</span>
                                                    </span>
                                                </div>

                                                <div className="nft-card-footer">
                                                    <div>
                                                        <div className="nft-card-price-label">Current Bid</div>
                                                        <div className="nft-card-price-value">
                                                            <span style={{ color: '#22d3ee' }}>Ξ</span>
                                                            {auction.price} {auction.currency}
                                                        </div>
                                                    </div>
                                                    <div style={{ textAlign: 'right' }}>
                                                        <div className="nft-card-price-label">Total Bids</div>
                                                        <div style={{ fontWeight: '600', color: 'var(--accent-gold)' }}>
                                                            {auction.bidsCount} bids
                                                        </div>
                                                    </div>
                                                </div>

                                                <button 
                                                    className="nft-btn nft-btn-primary" 
                                                    style={{ width: '100%', marginTop: '16px', justifyContent: 'center' }}
                                                    onClick={(e) => e.preventDefault()}
                                                >
                                                    Place Bid
                                                </button>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* How Auctions Work */}
                <section className="nft-section" style={{ textAlign: 'center' }}>
                    <h2 style={{ fontSize: '32px', marginBottom: '48px' }}>
                        How <span className="gradient-text">Auctions</span> Work
                    </h2>
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(4, 1fr)', 
                        gap: '32px',
                        maxWidth: '1200px',
                        margin: '0 auto'
                    }}>
                        {[
                            { icon: '🔍', title: 'Find an Auction', desc: 'Browse live auctions and find NFTs you love' },
                            { icon: '💰', title: 'Place Your Bid', desc: 'Connect wallet and place a bid higher than current' },
                            { icon: '⏱️', title: 'Wait for End', desc: 'Track the auction and outbid competitors' },
                            { icon: '🎉', title: 'Win & Collect', desc: 'Highest bidder wins when auction ends' }
                        ].map((step, index) => (
                            <div key={index} style={{
                                padding: '32px',
                                background: 'var(--bg-card)',
                                borderRadius: 'var(--radius-xl)',
                                border: '1px solid var(--border-color)'
                            }}>
                                <div style={{ fontSize: '48px', marginBottom: '16px' }}>{step.icon}</div>
                                <h4 style={{ fontSize: '18px', marginBottom: '8px' }}>{step.title}</h4>
                                <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <NFTFooter />
        </div>
    );
};

export default NFTAuctions;
