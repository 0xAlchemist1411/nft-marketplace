import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import NFTHeader from './NFTHeader';
import NFTFooter from './NFTFooter';
import './nftStyles.css';

const NFTCreate = () => {
    const navigate = useNavigate();
    const { address, isConnected } = useAccount();
    const fileInputRef = useRef(null);
    
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'Art',
        blockchain: 'Ethereum',
        royalty: '10',
        collection: '',
        isAuction: false,
        auctionDuration: '24'
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);

    const categories = ['Art', 'Music', 'Photography', 'Gaming', 'Sports', 'Collectibles', 'Virtual Worlds', 'Utility'];
    const blockchains = [
        { name: 'Ethereum', icon: 'Ξ', fee: '~$10-50' },
        { name: 'Polygon', icon: '⬡', fee: '~$0.01' },
        { name: 'Binance', icon: '◇', fee: '~$1-5' },
        { name: 'Solana', icon: '◎', fee: '~$0.001' }
    ];

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!isConnected) {
            alert('Please connect your wallet first');
            return;
        }

        if (!imageFile) {
            alert('Please upload an image');
            return;
        }

        setLoading(true);

        try {
            // Create FormData for API
            const data = new FormData();
            data.append('image', imageFile);
            data.append('name', formData.name);
            data.append('description', formData.description);
            data.append('price', formData.price);
            data.append('category', formData.category);
            data.append('blockchain', formData.blockchain);
            data.append('royalty', formData.royalty);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            alert('NFT created successfully!');
            navigate('/marketplace');
        } catch (error) {
            console.error('Error creating NFT:', error);
            alert('Error creating NFT. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="nft-marketplace">
            <NFTHeader />
            
            <div className="nft-create">
                <div className="nft-create-header">
                    <h1>Create New <span className="gradient-text">NFT</span></h1>
                    <p>Mint your digital artwork and start selling on the marketplace</p>
                </div>

                {/* Progress Steps */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', marginBottom: '48px' }}>
                    {['Upload', 'Details', 'Pricing'].map((label, index) => (
                        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: step > index ? 'var(--primary-gradient)' : step === index + 1 ? 'var(--accent-purple)' : 'var(--bg-glass)',
                                border: '2px solid',
                                borderColor: step >= index + 1 ? 'transparent' : 'var(--border-color)',
                                fontWeight: '600',
                                fontSize: '14px'
                            }}>
                                {step > index + 1 ? '✓' : index + 1}
                            </div>
                            <span style={{ color: step >= index + 1 ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                                {label}
                            </span>
                            {index < 2 && (
                                <div style={{
                                    width: '60px',
                                    height: '2px',
                                    background: step > index + 1 ? 'var(--accent-purple)' : 'var(--border-color)'
                                }} />
                            )}
                        </div>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="nft-create-form">
                    {/* Step 1: Upload */}
                    {step === 1 && (
                        <>
                            <div className="nft-form-group">
                                <label className="nft-form-label">
                                    Upload File <span>(Required)</span>
                                </label>
                                <div 
                                    className="nft-upload-area"
                                    onClick={() => fileInputRef.current?.click()}
                                    style={imagePreview ? { padding: '20px' } : {}}
                                >
                                    {imagePreview ? (
                                        <div style={{ position: 'relative' }}>
                                            <img 
                                                src={imagePreview} 
                                                alt="Preview" 
                                                style={{ maxHeight: '400px', borderRadius: 'var(--radius-lg)', objectFit: 'contain' }}
                                            />
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setImagePreview(null);
                                                    setImageFile(null);
                                                }}
                                                style={{
                                                    position: 'absolute',
                                                    top: '12px',
                                                    right: '12px',
                                                    width: '36px',
                                                    height: '36px',
                                                    borderRadius: '50%',
                                                    background: 'rgba(0,0,0,0.7)',
                                                    border: 'none',
                                                    color: 'white',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="nft-upload-icon">🖼️</div>
                                            <div className="nft-upload-text">
                                                Drag and drop or <span style={{ color: 'var(--accent-purple)' }}>browse</span>
                                            </div>
                                            <div className="nft-upload-hint">
                                                Supported: JPG, PNG, GIF, SVG, WEBP, MP4 (Max 100MB)
                                            </div>
                                        </>
                                    )}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*,video/mp4"
                                        onChange={handleImageChange}
                                        style={{ display: 'none' }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '32px' }}>
                                <button 
                                    type="button" 
                                    className="nft-btn nft-btn-primary"
                                    onClick={() => setStep(2)}
                                    disabled={!imagePreview}
                                    style={{ opacity: imagePreview ? 1 : 0.5 }}
                                >
                                    Continue
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M5 12h14M12 5l7 7-7 7"/>
                                    </svg>
                                </button>
                            </div>
                        </>
                    )}

                    {/* Step 2: Details */}
                    {step === 2 && (
                        <>
                            <div className="nft-form-group">
                                <label className="nft-form-label">
                                    Name <span>(Required)</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Enter NFT name"
                                    className="nft-form-input"
                                    required
                                />
                            </div>

                            <div className="nft-form-group">
                                <label className="nft-form-label">
                                    Description <span>(Optional)</span>
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Describe your NFT, its story, and what makes it special..."
                                    className="nft-form-input nft-form-textarea"
                                    rows={5}
                                />
                            </div>

                            <div className="nft-form-row">
                                <div className="nft-form-group">
                                    <label className="nft-form-label">Category</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="nft-form-select"
                                    >
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="nft-form-group">
                                    <label className="nft-form-label">Collection</label>
                                    <select
                                        name="collection"
                                        value={formData.collection}
                                        onChange={handleInputChange}
                                        className="nft-form-select"
                                    >
                                        <option value="">Select collection (Optional)</option>
                                        <option value="new">+ Create New Collection</option>
                                    </select>
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px' }}>
                                <button 
                                    type="button" 
                                    className="nft-btn nft-btn-secondary"
                                    onClick={() => setStep(1)}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                                    </svg>
                                    Back
                                </button>
                                <button 
                                    type="button" 
                                    className="nft-btn nft-btn-primary"
                                    onClick={() => setStep(3)}
                                    disabled={!formData.name}
                                    style={{ opacity: formData.name ? 1 : 0.5 }}
                                >
                                    Continue
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M5 12h14M12 5l7 7-7 7"/>
                                    </svg>
                                </button>
                            </div>
                        </>
                    )}

                    {/* Step 3: Pricing */}
                    {step === 3 && (
                        <>
                            <div className="nft-form-group">
                                <label className="nft-form-label">Blockchain</label>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                                    {blockchains.map(chain => (
                                        <div
                                            key={chain.name}
                                            onClick={() => handleInputChange({ target: { name: 'blockchain', value: chain.name } })}
                                            style={{
                                                padding: '20px',
                                                background: formData.blockchain === chain.name ? 'rgba(124, 58, 237, 0.2)' : 'var(--bg-glass)',
                                                border: `2px solid ${formData.blockchain === chain.name ? 'var(--accent-purple)' : 'var(--border-color)'}`,
                                                borderRadius: 'var(--radius-md)',
                                                textAlign: 'center',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s ease'
                                            }}
                                        >
                                            <div style={{ fontSize: '28px', marginBottom: '8px' }}>{chain.icon}</div>
                                            <div style={{ fontWeight: '600', marginBottom: '4px' }}>{chain.name}</div>
                                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Gas: {chain.fee}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="nft-form-group">
                                <label className="nft-form-label" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <input
                                        type="checkbox"
                                        name="isAuction"
                                        checked={formData.isAuction}
                                        onChange={handleInputChange}
                                        style={{ width: '20px', height: '20px' }}
                                    />
                                    List as Auction
                                </label>
                            </div>

                            <div className="nft-form-row">
                                <div className="nft-form-group">
                                    <label className="nft-form-label">
                                        {formData.isAuction ? 'Starting Price' : 'Price'} <span>(Required)</span>
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            placeholder="0.00"
                                            className="nft-form-input"
                                            style={{ paddingRight: '70px' }}
                                            step="0.001"
                                            min="0"
                                            required
                                        />
                                        <span style={{
                                            position: 'absolute',
                                            right: '16px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            color: 'var(--text-muted)'
                                        }}>
                                            ETH
                                        </span>
                                    </div>
                                </div>

                                {formData.isAuction ? (
                                    <div className="nft-form-group">
                                        <label className="nft-form-label">Auction Duration</label>
                                        <select
                                            name="auctionDuration"
                                            value={formData.auctionDuration}
                                            onChange={handleInputChange}
                                            className="nft-form-select"
                                        >
                                            <option value="12">12 Hours</option>
                                            <option value="24">24 Hours</option>
                                            <option value="48">2 Days</option>
                                            <option value="72">3 Days</option>
                                            <option value="168">1 Week</option>
                                        </select>
                                    </div>
                                ) : (
                                    <div className="nft-form-group">
                                        <label className="nft-form-label">
                                            Royalty <span>(Creator earnings on resale)</span>
                                        </label>
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                type="number"
                                                name="royalty"
                                                value={formData.royalty}
                                                onChange={handleInputChange}
                                                className="nft-form-input"
                                                style={{ paddingRight: '40px' }}
                                                min="0"
                                                max="50"
                                            />
                                            <span style={{
                                                position: 'absolute',
                                                right: '16px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                color: 'var(--text-muted)'
                                            }}>
                                                %
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Summary */}
                            <div style={{
                                background: 'var(--bg-glass)',
                                border: '1px solid var(--border-color)',
                                borderRadius: 'var(--radius-lg)',
                                padding: '24px',
                                marginTop: '16px'
                            }}>
                                <h4 style={{ marginBottom: '16px' }}>Summary</h4>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Platform Fee (2.5%)</span>
                                    <span>{formData.price ? (parseFloat(formData.price) * 0.025).toFixed(4) : '0'} ETH</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Creator Royalty ({formData.royalty}%)</span>
                                    <span>{formData.price ? (parseFloat(formData.price) * parseFloat(formData.royalty) / 100).toFixed(4) : '0'} ETH</span>
                                </div>
                                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', fontWeight: '600' }}>
                                    <span>You Will Receive</span>
                                    <span style={{ color: 'var(--accent-green)' }}>
                                        {formData.price ? (parseFloat(formData.price) * (1 - 0.025)).toFixed(4) : '0'} ETH
                                    </span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px' }}>
                                <button 
                                    type="button" 
                                    className="nft-btn nft-btn-secondary"
                                    onClick={() => setStep(2)}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                                    </svg>
                                    Back
                                </button>
                                <button 
                                    type="submit" 
                                    className="nft-btn nft-btn-primary"
                                    disabled={loading || !formData.price}
                                    style={{ opacity: (loading || !formData.price) ? 0.5 : 1 }}
                                >
                                    {loading ? (
                                        <>
                                            <span className="nft-skeleton" style={{ width: '16px', height: '16px', borderRadius: '50%' }}></span>
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M12 5v14M5 12h14"/>
                                            </svg>
                                            Create NFT
                                        </>
                                    )}
                                </button>
                            </div>
                        </>
                    )}
                </form>
            </div>

            <NFTFooter />
        </div>
    );
};

export default NFTCreate;
