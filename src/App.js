import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Funding } from "./fundingcomponents/Funding";
import "./landingcomponents/styleTop.css";
import "./landingcomponents/styleHorseverse.css";
import "./landingcomponents/styleGame.css";
import "./landingcomponents/styleMetahorse.css";
import "./landingcomponents/styleDao.css";
import "./landingcomponents/styleLegendary.css";
import "./landingcomponents/styleMunityprog.css";
import "./landingcomponents/styleArt.css";
import "./landingcomponents/stylePartners.css";
import "./landingcomponents/styleMunitynew.css";
import "./landingcomponents/styleMunityadd.css";
import "./landingcomponents/styleFooter.css";
import "./landingcomponents/styleSlides.css";
import "./landingcomponents/styleDataFeed.css";
import "./landingcomponents/styleLandingPage.css";
import { ContextProvider } from "./Web3Provider";
import { MyContext } from "./landingcomponents/MyContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LandingPage } from "./landingcomponents/LandingPage";

// NFT Marketplace Components
import NFTMarketplace from "./nftcomponents/NFTMarketplace";
import NFTExplore from "./nftcomponents/NFTExplore";
import NFTDetail from "./nftcomponents/NFTDetail";
import NFTCreate from "./nftcomponents/NFTCreate";
import NFTProfile from "./nftcomponents/NFTProfile";
import NFTCollections from "./nftcomponents/NFTCollections";
import NFTAuctions from "./nftcomponents/NFTAuctions";

const App = () => {
    const setAlert = (obj) => {
        if (obj.status === "success")
            toast.success(obj.msg, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
        else
            toast.error(obj.msg, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
    };

    return (
        <div className="App">
            <ContextProvider>
                <MyContext.Provider value={{ setAlert }}>
                    <ToastContainer
                        toastStyle={{ backgroundColor: "#7936d9" }}
                    />
                    <Router>
                        <Routes>
                            {/* Original Routes */}
                            <Route path="/" element={<NFTMarketplace />} />
                            <Route path="/landing" element={<LandingPage />} />
                            <Route path="token" element={<Funding />} />
                            
                            {/* NFT Marketplace Routes */}
                            <Route path="/marketplace" element={<NFTMarketplace />} />
                            <Route path="/marketplace/explore" element={<NFTExplore />} />
                            <Route path="/marketplace/collections" element={<NFTCollections />} />
                            <Route path="/marketplace/collection/:id" element={<NFTExplore />} />
                            <Route path="/marketplace/auctions" element={<NFTAuctions />} />
                            <Route path="/marketplace/create" element={<NFTCreate />} />
                            <Route path="/marketplace/nft/:id" element={<NFTDetail />} />
                            <Route path="/marketplace/profile" element={<NFTProfile />} />
                            <Route path="/marketplace/profile/:address" element={<NFTProfile />} />
                        </Routes>
                    </Router>
                </MyContext.Provider>
            </ContextProvider>
        </div>
    );
};

export default App;
