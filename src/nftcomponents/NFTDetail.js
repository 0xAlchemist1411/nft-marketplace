import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAccount } from 'wagmi';
import NFTHeader from './NFTHeader';
import NFTFooter from './NFTFooter';
import NFTCard from './NFTCard';
import './nftStyles.css';

const NFTDetail = () => {
    const { id } = useParams();
    const { address, isConnected } = useAccount();
    const [nft, setNft] = useState(null);
    const [activeTab, setActiveTab] = useState('description');
    const [loading, setLoading] = useState(true);
    const [bidAmount, setBidAmount] = useState('');
    const [relatedNFTs, setRelatedNFTs] = useState([]);

    // Demo NFT data
    const demoNFT = {
        _id: id,
        tokenId: 'TOKEN-042',
        name: 'Cosmic Voyager #042',
        description: 'A mesmerizing digital artwork capturing the essence of space exploration. This piece represents the human spirit of adventure and discovery, rendered in stunning detail with vibrant cosmic colors and ethereal lighting effects. Part of the exclusive Cosmic Collection, this NFT grants the holder access to special community events and future airdrops.',
        image: { url: 'https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?w=800&q=80' },
        price: 2.45,
        currency: 'ETH',
        creator: { 
            _id: 'creator1',
            name: 'CosmicArt', 
            avatar: { url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cosmic' },
            verified: true
        },
        owner: {
            _id: 'owner1',
            name: 'CryptoCollector',
            avatar: { url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=collector' },
            verified: true
        },
        collection: { 
            _id: 'col1',
            name: 'Cosmic Collection',
            verified: true
        },
        category: 'Art',
        blockchain: 'Ethereum',
        royalty: 10,
        likes: new Array(124),
        views: 1256,
        isAuction: true,
        auctionEndTime: new Date(Date.now() + 3600000 * 12),
        highestBid: {
            amount: 2.45,
            bidder: { name: 'HighBidder' }
        },
        bids: [
            { bidder: { name: 'Bidder1', avatar: { url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=b1' } }, amount: 2.45, timestamp: new Date(Date.now() - 3600000) },
            { bidder: { name: 'Bidder2', avatar: { url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=b2' } }, amount: 2.20, timestamp: new Date(Date.now() - 7200000) },
            { bidder: { name: 'Bidder3', avatar: { url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=b3' } }, amount: 1.95, timestamp: new Date(Date.now() - 10800000) }
        ],
        attributes: [
            { trait_type: 'Background', value: 'Cosmic Purple', rarity: 5 },
            { trait_type: 'Style', value: 'Abstract', rarity: 12 },
            { trait_type: 'Mood', value: 'Ethereal', rarity: 8 },
            { trait_type: 'Color Scheme', value: 'Vibrant', rarity: 15 },
            { trait_type: 'Edition', value: 'Genesis', rarity: 2 },
            { trait_type: 'Animation', value: 'Static', rarity: 45 }
        ],
        history: [
            { event: 'Auction Started', from: { name: 'CosmicArt' }, price: 1.50, timestamp: new Date(Date.now() - 86400000) },
            { event: 'Bid', from: { name: 'Bidder3' }, price: 1.95, timestamp: new Date(Date.now() - 10800000) },
            { event: 'Bid', from: { name: 'Bidder2' }, price: 2.20, timestamp: new Date(Date.now() - 7200000) },
            { event: 'Bid', from: { name: 'Bidder1' }, price: 2.45, timestamp: new Date(Date.now() - 3600000) }
        ]
    };

    const demoRelated = [
        { _id: '2', name: 'Neon Dreams #118', image: { url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80' }, price: 1.88, currency: 'ETH', creator: { name: 'NeonMaster' }, collection: { name: 'Neon Series' }, likes: new Array(89) },
        { _id: '3', name: 'Digital Genesis #001', image: { url: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=400&q=80' }, price: 5.20, currency: 'ETH', creator: { name: 'Genesis' }, collection: { name: 'Genesis Drop' }, likes: new Array(256) },
        { _id: '4', name: 'Abstract Mind #067', image: { url: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=400&q=80' }, price: 0.95, currency: 'ETH', creator: { name: 'AbstractAI' }, collection: { name: 'Mind Collection' }, likes: new Array(67) },
        { _id: '5', name: 'Ethereal Sunset #089', image: { url: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400&q=80' }, price: 3.15, currency: 'ETH', creator: { name: 'SunsetLab' }, collection: { name: 'Ethereal Series' }, likes: new Array(178) }
    ];

    useEffect(() => {
        setTimeout(() => {
            setNft(demoNFT);
            setRelatedNFTs(demoRelated);
            setLoading(false);
        }, 500);
    }, [id]);

    const formatTimeRemaining = () => {
        if (!nft?.auctionEndTime) return '--:--:--';
        const diff = new Date(nft.auctionEndTime) - new Date();
        if (diff <= 0) return 'Ended';
        
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        return `${hours}h ${minutes}m ${seconds}s`;
    };

    const handlePlaceBid = () => {
        if (!isConnected) {
            alert('Please connect your wallet first');
            return;
        }
        if (!bidAmount || parseFloat(bidAmount) <= nft.highestBid.amount) {
            alert(`Bid must be higher than ${nft.highestBid.amount} ETH`);
            return;
        }
        // Handle bid placement
        console.log('Placing bid:', bidAmount);
    };

    const handleBuyNow = () => {
        if (!isConnected) {
            alert('Please connect your wallet first');
            return;
        }
        // Handle purchase
        console.log('Buying NFT');
    };

    if (loading) {
        return (
            <div className="nft-marketplace">
                <NFTHeader />
                <div className="nft-detail">
                    <div className="nft-skeleton" style={{ aspectRatio: '1', borderRadius: 'var(--radius-xl)' }}></div>
                    <div>
                        <div className="nft-skeleton" style={{ height: '40px', marginBottom: '24px', width: '60%' }}></div>
                        <div className="nft-skeleton" style={{ height: '24px', marginBottom: '16px' }}></div>
                        <div className="nft-skeleton" style={{ height: '200px', marginBottom: '32px' }}></div>
                    </div>
                </div>
                <NFTFooter />
            </div>
        );
    }

    return (
        <div className="nft-marketplace">
            <NFTHeader />
            
            <div className="nft-detail">
                {/* Image */}
                <div className="nft-detail-image-container">
                    <img 
                        src={nft.image.url} 
                        alt={nft.name}
                        className="nft-detail-image"
                    />
                </div>

                {/* Info */}
                <div className="nft-detail-info">
                    <Link to={`/marketplace/collection/${nft.collection._id}`} className="nft-detail-collection">
                        {nft.collection.verified && (
                            <svg className="nft-verified-badge" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                            </svg>
                        )}
                        {nft.collection.name}
                    </Link>

                    <h1 className="nft-detail-title">{nft.name}</h1>

                    <div className="nft-detail-creator">
                        <div className="nft-detail-creator-item">
                            <img src={nft.creator.avatar.url} alt={nft.creator.name} className="nft-detail-creator-avatar" />
                            <div>
                                <div className="nft-detail-creator-label">Creator</div>
                                <div className="nft-detail-creator-name">{nft.creator.name}</div>
                            </div>
                        </div>
                        <div className="nft-detail-creator-item">
                            <img src={nft.owner.avatar.url} alt={nft.owner.name} className="nft-detail-creator-avatar" />
                            <div>
                                <div className="nft-detail-creator-label">Current Owner</div>
                                <div className="nft-detail-creator-name">{nft.owner.name}</div>
                            </div>
                        </div>
                    </div>

                    {/* Price Card */}
                    <div className="nft-detail-price-card">
                        {nft.isAuction ? (
                            <>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                    <div>
                                        <div className="nft-detail-price-label">Current Bid</div>
                                        <div className="nft-detail-price-value">
                                            <span style={{ color: '#22d3ee' }}>Ξ</span> {nft.highestBid.amount} ETH
                                            <span className="nft-detail-price-usd">(≈ $4,532)</span>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div className="nft-detail-price-label">Auction Ends In</div>
                                        <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--accent-cyan)' }}>
                                            {formatTimeRemaining()}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                                    <input
                                        type="number"
                                        placeholder={`Min bid: ${nft.highestBid.amount + 0.01} ETH`}
                                        value={bidAmount}
                                        onChange={(e) => setBidAmount(e.target.value)}
                                        className="nft-form-input"
                                        style={{ flex: 1 }}
                                    />
                                </div>
                                <div className="nft-detail-actions">
                                    <button className="nft-btn nft-btn-primary" onClick={handlePlaceBid}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M12 5v14M5 12h14"/>
                                        </svg>
                                        Place Bid
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="nft-detail-price-label">Price</div>
                                <div className="nft-detail-price-value">
                                    <span style={{ color: '#22d3ee' }}>Ξ</span> {nft.price} ETH
                                    <span className="nft-detail-price-usd">(≈ $4,532)</span>
                                </div>
                                <div className="nft-detail-actions">
                                    <button className="nft-btn nft-btn-primary" onClick={handleBuyNow}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/>
                                            <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/>
                                        </svg>
                                        Buy Now
                                    </button>
                                    <button className="nft-btn nft-btn-secondary">
                                        Make Offer
                                    </button>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Tabs */}
                    <div className="nft-detail-tabs">
                        <button 
                            className={`nft-detail-tab ${activeTab === 'description' ? 'active' : ''}`}
                            onClick={() => setActiveTab('description')}
                        >
                            Description
                        </button>
                        <button 
                            className={`nft-detail-tab ${activeTab === 'attributes' ? 'active' : ''}`}
                            onClick={() => setActiveTab('attributes')}
                        >
                            Attributes
                        </button>
                        <button 
                            className={`nft-detail-tab ${activeTab === 'bids' ? 'active' : ''}`}
                            onClick={() => setActiveTab('bids')}
                        >
                            Bids ({nft.bids.length})
                        </button>
                        <button 
                            className={`nft-detail-tab ${activeTab === 'history' ? 'active' : ''}`}
                            onClick={() => setActiveTab('history')}
                        >
                            History
                        </button>
                    </div>

                    {/* Tab Content */}
                    {activeTab === 'description' && (
                        <div className="nft-detail-description">
                            <p>{nft.description}</p>
                            <div style={{ marginTop: '24px', display: 'flex', gap: '32px', color: 'var(--text-muted)', fontSize: '14px' }}>
                                <span>👁 {nft.views.toLocaleString()} views</span>
                                <span>❤️ {nft.likes.length} likes</span>
                                <span>🔗 {nft.blockchain}</span>
                                <span>💰 {nft.royalty}% royalty</span>
                            </div>
                        </div>
                    )}

                    {activeTab === 'attributes' && (
                        <div className="nft-detail-attributes">
                            {nft.attributes.map((attr, index) => (
                                <div key={index} className="nft-attribute">
                                    <div className="nft-attribute-type">{attr.trait_type}</div>
                                    <div className="nft-attribute-value">{attr.value}</div>
                                    <div className="nft-attribute-rarity">{attr.rarity}% have this trait</div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'bids' && (
                        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            {nft.bids.map((bid, index) => (
                                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 0', borderBottom: '1px solid var(--border-color)' }}>
                                    <img src={bid.bidder.avatar.url} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: '600' }}>{bid.bidder.name}</div>
                                        <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                                            {new Date(bid.timestamp).toLocaleString()}
                                        </div>
                                    </div>
                                    <div style={{ fontWeight: '700' }}>
                                        <span style={{ color: '#22d3ee' }}>Ξ</span> {bid.amount} ETH
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'history' && (
                        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            {nft.history.map((event, index) => (
                                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 0', borderBottom: '1px solid var(--border-color)' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-glass)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {event.event === 'Bid' ? '💰' : event.event === 'Auction Started' ? '🔨' : '📝'}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: '600' }}>{event.event}</div>
                                        <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                                            by {event.from.name} • {new Date(event.timestamp).toLocaleString()}
                                        </div>
                                    </div>
                                    <div style={{ fontWeight: '700' }}>
                                        <span style={{ color: '#22d3ee' }}>Ξ</span> {event.price} ETH
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Related NFTs */}
            <section className="nft-section">
                <div className="nft-section-header">
                    <h2 className="nft-section-title">More from this collection</h2>
                </div>
                <div className="nft-grid">
                    {relatedNFTs.map(nft => (
                        <NFTCard key={nft._id} nft={nft} />
                    ))}
                </div>
            </section>

            <NFTFooter />
        </div>
    );
};

export default NFTDetail;
