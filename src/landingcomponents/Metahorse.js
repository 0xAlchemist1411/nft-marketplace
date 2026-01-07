import metahorseImg from "../images/Metahorse.png";
import { AnimatedSection } from "./AnimatedSection";
import Timeline0 from "../images/Timeline0.svg";
const handleEnter = (e) => {};
const handleLeave = () => {
    //setGameIconIndex(0);
};
export const Metahorse = () => {
    const getFadeTopStyles = (isFadeLeftInViewPort) => ({
        transition: "all 0.7s ease-in",
        opacity: isFadeLeftInViewPort ? "1" : "0",
        transform: isFadeLeftInViewPort ? "" : "translateY(50px)",
    });
    const getFadeLeftStyles = (isFadeLeftInViewPort) => ({
        transition: "all 1.5s ease-in",
        opacity: isFadeLeftInViewPort ? "1" : "0",
        transform: isFadeLeftInViewPort ? "" : "translateX(100%)",
    });
    return (
        <div className="Metahorse">
            <div class="gradient gradient--4"></div>
            <div class="gradient gradient--5"></div>
            <AnimatedSection getStyles={getFadeLeftStyles}>
                <div className="topTitle">
                    <div id="line1"></div>

                    <div className="textWrap">
                        <div className="text">
                            <span className="title title1">
                                Race With A Wide Variety Of
                            </span>
                            <span className="title title2">DeFiHorse</span>
                            <span className="title title1">Classes</span>
                        </div>
                        <div className="title3">
                            <span>
                                Defi Horse is a Horse-racing Metaverse based on
                                blockchain technology, where players can buy,
                                sell, breed, take NFT horses to the races to win
                                prizes, and host races to make a real-life
                                profit.
                            </span>
                        </div>
                    </div>

                    <div id="line2"></div>
                </div>
            </AnimatedSection>
            <div className="bottomImg">
                <div
                    className="metahorseImg"
                    style={{
                        backgroundImage: `url(${metahorseImg})`,
                    }}
                ></div>
                <AnimatedSection getStyles={getFadeTopStyles}>
                    <div className="progressBar">
                        <ul className="events">
                            <li
                                onMouseEnter={() => {
                                    handleEnter(1);
                                }}
                                onMouseLeave={handleLeave}
                            >
                                <div className="timeLine">
                                    <div
                                        className="timePointSVG"
                                        style={{
                                            background: `URL(${Timeline0})`,
                                            width: "30px",
                                            height: "30px",
                                            backgroundSize: "100% 100%",
                                        }}
                                    ></div>
                                    <div className="timePointLine PointLine1"></div>
                                </div>
                                <div className="textDiv">
                                    <span>
                                        <strong
                                            style={{ color: "white" }}
                                            className="PointText1"
                                        >
                                            Race With A Wide Variety Of
                                            DeFiHorse Classes
                                        </strong>
                                    </span>
                                </div>
                            </li>
                            <li>
                                <div className="timeLine">
                                    <div className="timePointSVG"></div>
                                    <div className="timePointLine PointLine2"></div>
                                </div>
                                <div className="PointText2">
                                    <span>
                                        <strong>
                                            Create Your Own Stable Of DeFi
                                            Horses
                                        </strong>
                                    </span>
                                </div>
                            </li>

                            <li>
                                <div className="timeLine">
                                    <div className="timePointSVG"></div>
                                    <div className="timePointLine PointLine3"></div>
                                </div>
                                <div className="PointText3">
                                    <span>
                                        <strong>Earn In-Game Resources</strong>
                                    </span>
                                </div>
                            </li>
                            <li
                                style={{ position: "relative", right: "160px" }}
                            >
                                <div className="timeLine">
                                    <div className="timePointSVG"></div>
                                    <div className="timePointLine PointLine4"></div>
                                </div>
                                <div className="PointText4">
                                    <span>
                                        <strong>
                                            Lead Your Horse To Victory
                                        </strong>
                                    </span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </AnimatedSection>
            </div>
        </div>
    );
};
