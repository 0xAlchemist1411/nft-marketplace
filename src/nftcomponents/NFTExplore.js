import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import NFTHeader from './NFTHeader';
import NFTCard from './NFTCard';
import NFTFooter from './NFTFooter';
import './nftStyles.css';

const NFTExplore = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [nfts, setNfts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'All');
    const [activeSort, setActiveSort] = useState('newest');
    const [priceRange, setPriceRange] = useState('all');

    const categories = ['All', 'Art', 'Music', 'Photography', 'Gaming', 'Sports', 'Collectibles', 'Virtual Worlds', 'Utility'];
    const sortOptions = [
        { value: 'newest', label: 'Recently Added' },
        { value: 'price_low', label: 'Price: Low to High' },
        { value: 'price_high', label: 'Price: High to Low' },
        { value: 'popular', label: 'Most Popular' },
        { value: 'ending_soon', label: 'Ending Soon' }
    ];

    // Demo data
    const demoNFTs = [
        { _id: '1', name: 'Cosmic Voyager #042', image: { url: 'https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?w=400&q=80' }, price: 2.45, currency: 'ETH', creator: { name: 'CosmicArt' }, collection: { name: 'Cosmic Collection' }, category: 'Art', likes: new Array(124) },
        { _id: '2', name: 'Neon Dreams #118', image: { url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80' }, price: 1.88, currency: 'ETH', creator: { name: 'NeonMaster' }, collection: { name: 'Neon Series' }, category: 'Art', likes: new Array(89), isAuction: true, auctionEndTime: new Date(Date.now() + 3600000 * 5) },
        { _id: '3', name: 'Digital Genesis #001', image: { url: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=400&q=80' }, price: 5.20, currency: 'ETH', creator: { name: 'Genesis' }, collection: { name: 'Genesis Drop' }, category: 'Collectibles', likes: new Array(256) },
        { _id: '4', name: 'Abstract Mind #067', image: { url: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=400&q=80' }, price: 0.95, currency: 'ETH', creator: { name: 'AbstractAI' }, collection: { name: 'Mind Collection' }, category: 'Art', likes: new Array(67), isAuction: true, auctionEndTime: new Date(Date.now() + 3600000 * 12) },
        { _id: '5', name: 'Crypto Punk Remix #322', image: { url: 'https://images.unsplash.com/photo-1637858868799-7f26a0640eb6?w=400&q=80' }, price: 8.50, currency: 'ETH', creator: { name: 'PunkArtist' }, collection: { name: 'Punk Remixes' }, category: 'Collectibles', likes: new Array(445) },
        { _id: '6', name: 'Ethereal Sunset #089', image: { url: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400&q=80' }, price: 3.15, currency: 'ETH', creator: { name: 'SunsetLab' }, collection: { name: 'Ethereal Series' }, category: 'Photography', likes: new Array(178) },
        { _id: '7', name: 'Metaverse Land #456', image: { url: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=400&q=80' }, price: 12.00, currency: 'ETH', creator: { name: 'MetaBuilder' }, collection: { name: 'Virtual Lands' }, category: 'Virtual Worlds', likes: new Array(567), isAuction: true, auctionEndTime: new Date(Date.now() + 3600000 * 24) },
        { _id: '8', name: 'Glitch Art #012', image: { url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&q=80' }, price: 0.75, currency: 'ETH', creator: { name: 'GlitchMaker' }, collection: { name: 'Glitch Collection' }, category: 'Art', likes: new Array(34) },
        { _id: '9', name: 'Sonic Wave #033', image: { url: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&q=80' }, price: 1.25, currency: 'ETH', creator: { name: 'SoundWave' }, collection: { name: 'Audio Visuals' }, category: 'Music', likes: new Array(89) },
        { _id: '10', name: 'Game Character #178', image: { url: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&q=80' }, price: 4.50, currency: 'ETH', creator: { name: 'GameDev' }, collection: { name: 'Game Assets' }, category: 'Gaming', likes: new Array(234) },
        { _id: '11', name: 'Sports Legend #044', image: { url: 'https://images.unsplash.com/photo-1461896836934- voices?w=400&q=80' }, price: 6.75, currency: 'ETH', creator: { name: 'SportsNFT' }, collection: { name: 'Legends' }, category: 'Sports', likes: new Array(456) },
        { _id: '12', name: 'Utility Pass #001', image: { url: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&q=80' }, price: 2.00, currency: 'ETH', creator: { name: 'UtilityDAO' }, collection: { name: 'Access Passes' }, category: 'Utility', likes: new Array(567) },
    ];

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            let filtered = [...demoNFTs];
            
            if (activeCategory !== 'All') {
                filtered = filtered.filter(nft => nft.category === activeCategory);
            }

            // Apply sort
            switch (activeSort) {
                case 'price_low':
                    filtered.sort((a, b) => a.price - b.price);
                    break;
                case 'price_high':
                    filtered.sort((a, b) => b.price - a.price);
                    break;
                case 'popular':
                    filtered.sort((a, b) => b.likes.length - a.likes.length);
                    break;
                case 'ending_soon':
                    filtered = filtered.filter(nft => nft.isAuction);
                    filtered.sort((a, b) => new Date(a.auctionEndTime) - new Date(b.auctionEndTime));
                    break;
                default:
                    break;
            }

            // Apply price filter
            switch (priceRange) {
                case 'under1':
                    filtered = filtered.filter(nft => nft.price < 1);
                    break;
                case '1to5':
                    filtered = filtered.filter(nft => nft.price >= 1 && nft.price <= 5);
                    break;
                case '5to10':
                    filtered = filtered.filter(nft => nft.price >= 5 && nft.price <= 10);
                    break;
                case 'over10':
                    filtered = filtered.filter(nft => nft.price > 10);
                    break;
                default:
                    break;
            }

            setNfts(filtered);
            setLoading(false);
        }, 300);
    }, [activeCategory, activeSort, priceRange]);

    const handleCategoryChange = (category) => {
        setActiveCategory(category);
        if (category === 'All') {
            searchParams.delete('category');
        } else {
            searchParams.set('category', category);
        }
        setSearchParams(searchParams);
    };

    return (
        <div className="nft-marketplace">
            <NFTHeader />
            
            <div className="nft-explore">
                <div className="nft-explore-header">
                    <h1>Explore <span className="gradient-text">NFTs</span></h1>
                    <p>Discover and collect extraordinary NFTs from artists around the world</p>
                </div>

                {/* Filters */}
                <div className="nft-filters">
                    {categories.map(category => (
                        <button
                            key={category}
                            className={`nft-filter ${activeCategory === category ? 'active' : ''}`}
                            onClick={() => handleCategoryChange(category)}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Sort and Price Filters */}
                <div className="nft-filters" style={{ marginTop: '-20px' }}>
                    <div className="nft-filter-dropdown">
                        <select 
                            value={activeSort} 
                            onChange={(e) => setActiveSort(e.target.value)}
                            className="nft-form-select"
                            style={{ padding: '10px 20px', borderRadius: '9999px' }}
                        >
                            {sortOptions.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="nft-filter-dropdown">
                        <select 
                            value={priceRange} 
                            onChange={(e) => setPriceRange(e.target.value)}
                            className="nft-form-select"
                            style={{ padding: '10px 20px', borderRadius: '9999px' }}
                        >
                            <option value="all">All Prices</option>
                            <option value="under1">Under 1 ETH</option>
                            <option value="1to5">1 - 5 ETH</option>
                            <option value="5to10">5 - 10 ETH</option>
                            <option value="over10">Over 10 ETH</option>
                        </select>
                    </div>
                </div>

                {/* Results */}
                <section className="nft-section" style={{ paddingTop: '20px' }}>
                    {loading ? (
                        <div className="nft-grid">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="nft-card">
                                    <div className="nft-skeleton" style={{ aspectRatio: '1', margin: '16px' }}></div>
                                    <div style={{ padding: '20px' }}>
                                        <div className="nft-skeleton" style={{ height: '20px', marginBottom: '12px' }}></div>
                                        <div className="nft-skeleton" style={{ height: '16px', width: '60%' }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : nfts.length > 0 ? (
                        <div className="nft-grid">
                            {nfts.map((nft, index) => (
                                <div key={nft._id} className="animate-fadeIn" style={{ animationDelay: `${index * 0.05}s` }}>
                                    <NFTCard nft={nft} showCountdown={nft.isAuction} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
                            <div style={{ fontSize: '64px', marginBottom: '24px' }}>🔍</div>
                            <h3 style={{ fontSize: '24px', marginBottom: '12px' }}>No NFTs Found</h3>
                            <p style={{ color: 'var(--text-secondary)' }}>Try adjusting your filters or search criteria</p>
                        </div>
                    )}
                </section>

                {/* Load More */}
                {nfts.length >= 8 && (
                    <div style={{ textAlign: 'center', paddingBottom: '60px' }}>
                        <button className="nft-btn nft-btn-secondary">
                            Load More
                        </button>
                    </div>
                )}
            </div>

            <NFTFooter />
        </div>
    );
};

export default NFTExplore;
