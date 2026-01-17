import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const NFTCard = ({ nft, showCountdown = false }) => {
    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(nft?.likes?.length || 0);

    const handleLike = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setLiked(!liked);
        setLikesCount(prev => liked ? prev - 1 : prev + 1);
    };

    const formatPrice = (price) => {
        if (!price) return '0';
        return parseFloat(price).toFixed(3);
    };

    const formatTime = (endTime) => {
        if (!endTime) return '--:--:--';
        const now = new Date();
        const end = new Date(endTime);
        const diff = end - now;
        
        if (diff <= 0) return 'Ended';
        
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    // Default placeholder data for demo
    const defaultNFT = {
        _id: '1',
        name: 'Cosmic Voyager #042',
        image: { url: 'https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?w=400' },
        price: 2.45,
        currency: 'ETH',
        creator: { 
            name: 'CryptoArtist',
            avatar: { url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=crypto' }
        },
        collection: { name: 'Cosmic Collection' },
        likes: [],
        isAuction: false,
        auctionEndTime: null
    };

    const data = nft || defaultNFT;

    return (
        <Link to={`/marketplace/nft/${data._id}`} className="nft-card">
            <div className="nft-card-image-wrapper">
                <img 
                    src={data.image?.url || 'https://via.placeholder.com/400'} 
                    alt={data.name}
                    className="nft-card-image"
                />
                <div 
                    className={`nft-card-like ${liked ? 'liked' : ''}`}
                    onClick={handleLike}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                </div>
                {data.isAuction && showCountdown && (
                    <div className="nft-card-countdown">
                        <svg className="nft-card-countdown-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                            <polyline points="12 6 12 12 16 14"/>
                        </svg>
                        <span>{formatTime(data.auctionEndTime)}</span>
                    </div>
                )}
            </div>
            <div className="nft-card-content">
                {data.collection && (
                    <div className="nft-card-collection">{data.collection.name}</div>
                )}
                <h3 className="nft-card-title">{data.name}</h3>
                <div className="nft-card-creator">
                    <img 
                        src={data.creator?.avatar?.url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.creator?.name}`}
                        alt={data.creator?.name}
                        className="nft-card-avatar"
                    />
                    <span className="nft-card-creator-name">
                        By <span>{data.creator?.name || 'Unknown'}</span>
                    </span>
                </div>
                <div className="nft-card-footer">
                    <div>
                        <div className="nft-card-price-label">
                            {data.isAuction ? 'Current Bid' : 'Price'}
                        </div>
                        <div className="nft-card-price-value">
                            <span style={{ color: '#22d3ee' }}>Ξ</span>
                            {formatPrice(data.price)} {data.currency || 'ETH'}
                        </div>
                    </div>
                    <button className="nft-card-bid-btn" onClick={(e) => e.preventDefault()}>
                        {data.isAuction ? 'Place Bid' : 'Buy Now'}
                    </button>
                </div>
            </div>
        </Link>
    );
};

export default NFTCard;
