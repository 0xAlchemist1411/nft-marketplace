import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NFTHeader from './NFTHeader';
import NFTFooter from './NFTFooter';
import './nftStyles.css';

const NFTCollections = () => {
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('All');
    const [activeSort, setActiveSort] = useState('volume_high');

    const categories = ['All', 'Art', 'Music', 'Photography', 'Gaming', 'Sports', 'Collectibles', 'Virtual Worlds'];

    // Demo collections data
    const demoCollections = [
        {
            _id: '1',
            name: 'Bored Ape Yacht Club',
            slug: 'bored-ape-yacht-club',
            description: 'The Bored Ape Yacht Club is a collection of 10,000 unique Bored Ape NFTs.',
            logo: { url: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=200' },
            banner: { url: 'https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?w=600' },
            creator: { name: 'YugaLabs', verified: true },
            floorPrice: 68.5,
            totalVolume: 890234,
            items: 10000,
            owners: 6423,
            change24h: 12.5,
            verified: true,
            category: 'Collectibles'
        },
        {
            _id: '2',
            name: 'CryptoPunks',
            slug: 'cryptopunks',
            description: 'CryptoPunks launched as a fixed set of 10,000 items in mid-2017.',
            logo: { url: 'https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?w=200' },
            banner: { url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600' },
            creator: { name: 'LarvaLabs', verified: true },
            floorPrice: 52.3,
            totalVolume: 756123,
            items: 10000,
            owners: 3456,
            change24h: -5.2,
            verified: true,
            category: 'Collectibles'
        },
        {
            _id: '3',
            name: 'Mutant Ape Yacht Club',
            slug: 'mutant-ape-yacht-club',
            description: 'The MAYC is a collection of up to 20,000 Mutant Apes.',
            logo: { url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200' },
            banner: { url: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=600' },
            creator: { name: 'YugaLabs', verified: true },
            floorPrice: 15.8,
            totalVolume: 432567,
            items: 20000,
            owners: 12456,
            change24h: 8.7,
            verified: true,
            category: 'Collectibles'
        },
        {
            _id: '4',
            name: 'Art Blocks Curated',
            slug: 'art-blocks-curated',
            description: 'Generative art at its finest.',
            logo: { url: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=200' },
            banner: { url: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=600' },
            creator: { name: 'ArtBlocks', verified: true },
            floorPrice: 8.2,
            totalVolume: 321456,
            items: 5000,
            owners: 2345,
            change24h: 15.3,
            verified: true,
            category: 'Art'
        },
        {
            _id: '5',
            name: 'Doodles',
            slug: 'doodles',
            description: 'A community-driven collectibles project.',
            logo: { url: 'https://images.unsplash.com/photo-1637858868799-7f26a0640eb6?w=200' },
            banner: { url: 'https://images.unsplash.com/photo-1637858868799-7f26a0640eb6?w=600' },
            creator: { name: 'BurntToast', verified: true },
            floorPrice: 8.4,
            totalVolume: 234567,
            items: 10000,
            owners: 5234,
            change24h: -2.1,
            verified: true,
            category: 'Art'
        },
        {
            _id: '6',
            name: 'CloneX',
            slug: 'clonex',
            description: 'A collection of 20,000 next-gen Avatars.',
            logo: { url: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=200' },
            banner: { url: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=600' },
            creator: { name: 'RTFKT', verified: true },
            floorPrice: 6.9,
            totalVolume: 198765,
            items: 20000,
            owners: 8765,
            change24h: 22.4,
            verified: true,
            category: 'Virtual Worlds'
        },
        {
            _id: '7',
            name: 'Chromie Squiggle',
            slug: 'chromie-squiggle',
            description: 'Simple.Beautiful. Unique.',
            logo: { url: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=200' },
            banner: { url: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=600' },
            creator: { name: 'Snowfro', verified: true },
            floorPrice: 12.5,
            totalVolume: 156789,
            items: 10000,
            owners: 4321,
            change24h: 5.8,
            verified: true,
            category: 'Art'
        },
        {
            _id: '8',
            name: 'Cool Cats',
            slug: 'cool-cats',
            description: 'Cool Cats are a collection of programmatically, randomly generated NFTs.',
            logo: { url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200' },
            banner: { url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600' },
            creator: { name: 'CoolCatsTeam', verified: true },
            floorPrice: 2.8,
            totalVolume: 134567,
            items: 9999,
            owners: 5678,
            change24h: -8.3,
            verified: true,
            category: 'Collectibles'
        },
    ];

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            let filtered = [...demoCollections];
            
            if (activeCategory !== 'All') {
                filtered = filtered.filter(c => c.category === activeCategory);
            }

            // Sort
            switch (activeSort) {
                case 'volume_high':
                    filtered.sort((a, b) => b.totalVolume - a.totalVolume);
                    break;
                case 'volume_low':
                    filtered.sort((a, b) => a.totalVolume - b.totalVolume);
                    break;
                case 'floor_high':
                    filtered.sort((a, b) => b.floorPrice - a.floorPrice);
                    break;
                case 'floor_low':
                    filtered.sort((a, b) => a.floorPrice - b.floorPrice);
                    break;
                default:
                    break;
            }

            setCollections(filtered);
            setLoading(false);
        }, 300);
    }, [activeCategory, activeSort]);

    const formatVolume = (volume) => {
        if (volume >= 1000000) {
            return (volume / 1000000).toFixed(1) + 'M';
        } else if (volume >= 1000) {
            return (volume / 1000).toFixed(1) + 'K';
        }
        return volume.toString();
    };

    return (
        <div className="nft-marketplace">
            <NFTHeader />
            
            <div className="nft-explore">
                <div className="nft-explore-header">
                    <h1>Explore <span className="gradient-text">Collections</span></h1>
                    <p>Discover the most traded NFT collections</p>
                </div>

                {/* Filters */}
                <div className="nft-filters">
                    {categories.map(category => (
                        <button
                            key={category}
                            className={`nft-filter ${activeCategory === category ? 'active' : ''}`}
                            onClick={() => setActiveCategory(category)}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                <div className="nft-filters" style={{ marginTop: '-20px' }}>
                    <select 
                        value={activeSort} 
                        onChange={(e) => setActiveSort(e.target.value)}
                        className="nft-form-select"
                        style={{ padding: '10px 20px', borderRadius: '9999px' }}
                    >
                        <option value="volume_high">Volume: High to Low</option>
                        <option value="volume_low">Volume: Low to High</option>
                        <option value="floor_high">Floor: High to Low</option>
                        <option value="floor_low">Floor: Low to High</option>
                    </select>
                </div>

                {/* Collections Grid */}
                <section className="nft-section" style={{ paddingTop: '20px' }}>
                    {loading ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px', maxWidth: '1440px', margin: '0 auto' }}>
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="nft-skeleton" style={{ height: '320px', borderRadius: 'var(--radius-xl)' }}></div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px', maxWidth: '1440px', margin: '0 auto' }}>
                            {collections.map((collection, index) => (
                                <Link 
                                    to={`/marketplace/collection/${collection._id}`} 
                                    key={collection._id}
                                    className="animate-fadeIn"
                                    style={{ 
                                        animationDelay: `${index * 0.05}s`,
                                        textDecoration: 'none',
                                        color: 'inherit'
                                    }}
                                >
                                    <div style={{
                                        background: 'var(--bg-card)',
                                        borderRadius: 'var(--radius-xl)',
                                        border: '1px solid var(--border-color)',
                                        overflow: 'hidden',
                                        transition: 'all 0.3s ease',
                                        cursor: 'pointer'
                                    }}
                                    className="nft-card"
                                    >
                                        {/* Banner */}
                                        <div style={{
                                            height: '120px',
                                            backgroundImage: `url(${collection.banner?.url})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            position: 'relative'
                                        }}>
                                            <img 
                                                src={collection.logo?.url}
                                                alt={collection.name}
                                                style={{
                                                    position: 'absolute',
                                                    bottom: '-40px',
                                                    left: '24px',
                                                    width: '80px',
                                                    height: '80px',
                                                    borderRadius: 'var(--radius-lg)',
                                                    border: '4px solid var(--bg-card)',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                        </div>

                                        {/* Content */}
                                        <div style={{ padding: '52px 24px 24px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                                <h3 style={{ fontSize: '20px', fontWeight: '600' }}>{collection.name}</h3>
                                                {collection.verified && (
                                                    <svg className="nft-verified-badge" width="18" height="18" viewBox="0 0 24 24" fill="#3b82f6">
                                                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                                                    </svg>
                                                )}
                                            </div>
                                            <p style={{ 
                                                fontSize: '14px', 
                                                color: 'var(--text-secondary)',
                                                marginBottom: '16px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}>
                                                by {collection.creator?.name}
                                            </p>

                                            {/* Stats */}
                                            <div style={{ 
                                                display: 'grid', 
                                                gridTemplateColumns: 'repeat(4, 1fr)', 
                                                gap: '12px',
                                                padding: '16px',
                                                background: 'var(--bg-glass)',
                                                borderRadius: 'var(--radius-md)'
                                            }}>
                                                <div style={{ textAlign: 'center' }}>
                                                    <div style={{ fontSize: '14px', fontWeight: '700' }}>
                                                        <span style={{ color: '#22d3ee' }}>Ξ</span> {collection.floorPrice}
                                                    </div>
                                                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Floor</div>
                                                </div>
                                                <div style={{ textAlign: 'center' }}>
                                                    <div style={{ fontSize: '14px', fontWeight: '700' }}>{formatVolume(collection.totalVolume)}</div>
                                                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Volume</div>
                                                </div>
                                                <div style={{ textAlign: 'center' }}>
                                                    <div style={{ fontSize: '14px', fontWeight: '700' }}>{collection.items.toLocaleString()}</div>
                                                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Items</div>
                                                </div>
                                                <div style={{ textAlign: 'center' }}>
                                                    <div style={{ 
                                                        fontSize: '14px', 
                                                        fontWeight: '700',
                                                        color: collection.change24h >= 0 ? 'var(--accent-green)' : 'var(--accent-pink)'
                                                    }}>
                                                        {collection.change24h >= 0 ? '+' : ''}{collection.change24h}%
                                                    </div>
                                                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>24h</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>
            </div>

            <NFTFooter />
        </div>
    );
};

export default NFTCollections;
