import React, { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

const NFTHeader = () => {
    const location = useLocation();
    const [showWalletModal, setShowWalletModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { address, isConnected } = useAccount();
    const { disconnect } = useDisconnect();

    const navLinks = [
        { path: '/marketplace', label: 'Explore' },
        { path: '/marketplace/collections', label: 'Collections' },
        { path: '/marketplace/auctions', label: 'Live Auctions' },
        { path: '/marketplace/create', label: 'Create' },
    ];

    const formatAddress = (addr) => {
        if (!addr) return '';
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    };

    return (
        <>
            <header className="nft-header">
                <div className="nft-header-content">
                    <Link to="/marketplace" className="nft-logo">
                        <div className="nft-logo-icon">✦</div>
                        <span>Nexus<span className="gradient-text">NFT</span></span>
                    </Link>

                    <nav className="nft-nav">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`nft-nav-link ${location.pathname === link.path ? 'active' : ''}`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="nft-header-actions">
                        <div className="nft-search">
                            <svg className="nft-search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8"/>
                                <path d="M21 21l-4.35-4.35"/>
                            </svg>
                            <input
                                type="text"
                                placeholder="Search NFTs, collections..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {isConnected ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Link to="/marketplace/profile" className="nft-btn-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                        <circle cx="12" cy="7" r="4"/>
                                    </svg>
                                </Link>
                                <button 
                                    className="nft-btn nft-btn-secondary"
                                    onClick={() => disconnect()}
                                >
                                    {formatAddress(address)}
                                </button>
                            </div>
                        ) : (
                            <button 
                                className="nft-btn nft-btn-primary"
                                onClick={() => setShowWalletModal(true)}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/>
                                    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/>
                                    <path d="M18 12a2 2 0 0 0 0 4h4v-4h-4z"/>
                                </svg>
                                Connect Wallet
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* Wallet Connect Modal */}
            <div className={`nft-modal-overlay ${showWalletModal ? 'active' : ''}`} onClick={() => setShowWalletModal(false)}>
                <div className="nft-modal" onClick={(e) => e.stopPropagation()}>
                    <div className="nft-modal-header">
                        <h3 className="nft-modal-title">Connect Wallet</h3>
                        <button className="nft-modal-close" onClick={() => setShowWalletModal(false)}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 6L6 18M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>
                    <div className="nft-wallet-options">
                        <WalletOption 
                            name="MetaMask" 
                            icon="🦊" 
                            tag="Popular"
                            onConnect={() => setShowWalletModal(false)}
                        />
                        <WalletOption 
                            name="WalletConnect" 
                            icon="🔗"
                            onConnect={() => setShowWalletModal(false)}
                        />
                        <WalletOption 
                            name="Coinbase Wallet" 
                            icon="💰"
                            onConnect={() => setShowWalletModal(false)}
                        />
                        <WalletOption 
                            name="Trust Wallet" 
                            icon="🛡️"
                            onConnect={() => setShowWalletModal(false)}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

const WalletOption = ({ name, icon, tag, onConnect }) => {
    const { connect, connectors } = useConnect();
    
    const handleConnect = () => {
        const connector = connectors.find(c => {
            if (name === 'MetaMask') return c.name === 'MetaMask' || c.name === 'Injected';
            if (name === 'WalletConnect') return c.name === 'WalletConnect';
            if (name === 'Coinbase Wallet') return c.name === 'Coinbase Wallet';
            return false;
        });
        
        if (connector) {
            connect({ connector });
        }
        onConnect();
    };
    
    return (
        <div className="nft-wallet-option" onClick={handleConnect}>
            <span style={{ fontSize: '32px' }}>{icon}</span>
            <span className="nft-wallet-option-name">{name}</span>
            {tag && <span className="nft-wallet-option-tag">{tag}</span>}
        </div>
    );
};

export default NFTHeader;
