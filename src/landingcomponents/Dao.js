import DaoImg from "../images/Dao.png";
import "bootstrap-icons/font/bootstrap-icons.css";
import { AnimatedSection } from "./AnimatedSection";
export const Dao = () => {
    const getFadeTopStyles = (isFadeLeftInViewPort) => ({
        transition: "all 1s ease-in",
        opacity: isFadeLeftInViewPort ? "1" : "0",
        transform: isFadeLeftInViewPort ? "" : "translateY(40px)",
    });
    const getFadeRightStyles = (isFadeLeftInViewPort) => ({
        transition: "all 1.5s ease-in",
        opacity: isFadeLeftInViewPort ? "1" : "0",
        transform: isFadeLeftInViewPort ? "" : "translateX(100%)",
    });
    return (
        <div className="Dao">
            <AnimatedSection getStyles={getFadeTopStyles}>
                <div className="topTitle">
                    <div id="line"></div>
                    <div>
                        <div className="text">
                            <span className="title title2">DeFiHorse </span>{" "}
                            <span className="title title1">Governance</span>
                        </div>
                    </div>

                    <div id="line"></div>
                </div>
            </AnimatedSection>

            <div className="bottomImg">
                <AnimatedSection getStyles={getFadeTopStyles}>
                    <div
                        className="daoImg"
                        style={{
                            backgroundImage: `url(${DaoImg})`,
                        }}
                    ></div>
                </AnimatedSection>
                <div className="rightText">
                    <AnimatedSection getStyles={getFadeTopStyles}>
                        <div>
                            <span className="type1 lgText">
                                DeFiHorse{" "}
                                <span className="type2 lgText">
                                    is a horse racing Metaverse
                                    e-sports game built on Blockchain technology
                                    and NFTs.
                                </span>
                                <span className="type1 lgText">DeFiHorse </span>
                                <span className="type2 lgText">
                                    Ecosystem, Including Current And Future
                                    Games.
                                </span>
                            </span>
                        </div>
                    </AnimatedSection>
                    <AnimatedSection getStyles={getFadeTopStyles}>
                        <div>
                            <span className="type3">
                                The TAP TO EARN system of DeFiHorse allows users
                                to directly interact with the game, improving
                                the character's experience. During the race, in
                                addition to equipping items and breeding horses,
                                players can interact with reality to help their
                                steed outperform other competitors. There are
                                also additional aspects in the game, such as the
                                Horseverse, which lets users acquire land, buy
                                stables, or choose and arrange their own horse
                                races. Because this is a unique system that only
                                DeFiHorse has, this game is projected to become
                                the next big thing in the world of NFT horse
                                racing games.
                                <span className="type4">Read More.</span>
                            </span>
                        </div>
                    </AnimatedSection>
                    <AnimatedSection getStyles={getFadeTopStyles}>
                        <div>
                            <div className="bottomBtn">
                                View Governance{" "}
                                <span>
                                    <i className="bi bi-chevron-right"></i>
                                </span>
                            </div>
                        </div>
                    </AnimatedSection>
                </div>
            </div>
        </div>
    );
};
