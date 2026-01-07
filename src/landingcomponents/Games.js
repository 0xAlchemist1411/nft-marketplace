import GameImg from "../images/Games.png";
import Game1 from "../images/Game1.png";
import Game2 from "../images/Game2.png";
import Game3 from "../images/Game3.png";
import "bootstrap-icons/font/bootstrap-icons.css";
import { AnimatedSection } from "./AnimatedSection";
const getFadeTopStyles = (isFadeLeftInViewPort) => ({
    transition: "all 1s ease-in",
    opacity: isFadeLeftInViewPort ? "1" : "0",
    transform: isFadeLeftInViewPort ? "" : "translateY(100px)",
});
const getFadeTopStylesL = (isFadeLeftInViewPort) => ({
    transition: "all 1s ease-in",
    opacity: isFadeLeftInViewPort ? "1" : "0",
    transform: isFadeLeftInViewPort ? "" : "translateY(100px)",
});
const getFadeTopStylesC = (isFadeLeftInViewPort) => ({
    transition: "all 1.5s ease-in",
    opacity: isFadeLeftInViewPort ? "1" : "0",
    transform: isFadeLeftInViewPort ? "" : "translateY(100px)",
});
const getFadeTopStylesR = (isFadeLeftInViewPort) => ({
    transition: "all 0.5s ease-in",
    opacity: isFadeLeftInViewPort ? "1" : "0",
    transform: isFadeLeftInViewPort ? "" : "translateY(100px)",
});
export const Games = () => {
    return (
        <div className="Games">
            <div class="gradient gradient--3"></div>
            <AnimatedSection getStyles={getFadeTopStyles}>
                <div className="topTitle">
                    <div id="line"></div>

                    <div>
                        <div className="text">
                            <span className="title title1">
                                GAMES{" "}
                                <span style={{ color: "#5F3DFF" }}>&</span>{" "}
                                DAPPS
                            </span>
                        </div>
                    </div>

                    <div id="line"></div>
                </div>
            </AnimatedSection>
            <AnimatedSection getStyles={getFadeTopStyles}>
                <div className="topText">
                    <div>
                        <img src={GameImg} alt="GImg" />
                    </div>
                    <div id="letter">
                        <span>
                            The{" "}
                            <span style={{ color: "white" }}>DeFiHorse</span> is
                            a horse racing Metaverse e-sports game built on
                            Blockchain technology and NFTs. Players will be able
                            to experience and enjoy horse racing on a whole new
                            level when they enter DeFiHorse.
                        </span>
                    </div>
                </div>
            </AnimatedSection>

            <div className="imgTitle">
                <AnimatedSection getStyles={getFadeTopStylesL}>
                    <div className="leftTitle">
                        <div
                            className="GameImage"
                            style={{
                                backgroundImage: `url(${Game1})`,
                            }}
                        >
                            <div className="boldText">
                                <span>
                                    STUTEN GARDEN: <br></br>Horse Catching RPG
                                </span>
                            </div>
                            <div className="lineText">
                                <span>
                                    Catch,Tame,Awake your NFT DeFiHorse!
                                </span>
                            </div>
                            <div className="buttonWrap">
                                <div className="bottomBtn">
                                    PLAY NOW<i className="bi bi-play-fill"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </AnimatedSection>
                <AnimatedSection getStyles={getFadeTopStylesC}>
                    <div className="centerTitle">
                        <div
                            className="GameImage"
                            style={{
                                backgroundImage: `url(${Game2})`,
                            }}
                        >
                            <div className="boldText">
                                <span>HORSEVERSE</span>
                            </div>
                            <div className="lineText">
                                <span>
                                    With its innovative use of blockchain and
                                    NFTs, DeFiHorse aims to become a leading
                                    platform in the NFT horse racing space,
                                    offering players a unique and immersive
                                    experience.
                                </span>
                            </div>
                            <div className="buttonWrap">
                                <div className="bottomBtn2">COMING SOON</div>
                            </div>
                        </div>
                    </div>
                </AnimatedSection>
                <AnimatedSection getStyles={getFadeTopStylesR}>
                    <div className="rightTitle">
                        <div
                            className="GameImage"
                            style={{
                                backgroundImage: `url(${Game3})`,
                            }}
                        >
                            <div className="boldText">
                                <span>M-DEED</span>
                            </div>
                            <div className="lineText">
                                <span>
                                    DeFiHorse utilizes self-executing smart
                                    contracts to facilitate various in-game
                                    transactions and interactions.
                                </span>
                            </div>
                            <div className="buttonWrap">
                                <div className="bottomBtn2">COMING SOON</div>
                            </div>
                        </div>
                    </div>
                </AnimatedSection>
            </div>
        </div>
    );
};
