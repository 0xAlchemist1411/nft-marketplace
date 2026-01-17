# NFT Marketplace

A comprehensive NFT Marketplace application built with the MERN stack (MongoDB, Express, React, Node.js) and Web3 integration.

## Features

- **Buy & Sell NFTs**: Seamlessly trade digital assets.
- **Create NFTs**: Mint your own NFTs directly on the platform.
- **Auctions**: Participate in live auctions for exclusive items.
- **Wallet Integration**: Connect with MetaMask and other Web3 wallets.
- **User Profiles**: Manage your collected and created NFTs.
- **Responsive Design**: distinct dark-themed UI optimized for all devices.

## Tech Stack

- **Frontend**: React.js, Bootstrap 5, Web3.js / Wagmi
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Image Hosting**: Cloudinary
- **Blockchain**: Ethereum / Testnets (Sepolia)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (Local or Atlas)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/0xAlchemist1411/nft-marketplace.git
   cd nft-marketplace
   ```

2. **Install Dependencies**
   
   Install dependencies for both the root (frontend) and server:
   ```bash
   # Install root/frontend dependencies
   npm install

   # Install server dependencies
   cd server
   npm install
   cd ..
   ```

3. **Environment Configuration**

   You need to set up environment variables for the backend.
   
   Create a `.env` file in the `server/` directory:
   ```bash
   cp server/.env.example server/.env
   ```
   
   Open `server/.env` and update the values:
   - `MONGO_URI`: Your MongoDB connection string.
   - `CLOUDINARY_*`: Your Cloudinary credentials for image uploads.

### Running the Application

To run both the backend server and frontend client concurrently:

```bash
npm run dev
```

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3099 (or your configured PORT)

## Project Structure

- `/src`: React frontend application.
- `/server`: Node.js/Express backend API.
- `/public`: Static assets.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
