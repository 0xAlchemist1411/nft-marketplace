import logo from "../images/logo.png";
import { Link } from "react-router-dom";
export const HeaderLeft = () => {
    return (
        <div className="leftHeader">
            <Link to="#">
                <img src={logo} alt="logo" className="leftHeadImg" />
            </Link>
            <span id="leftHeaderSpan">HORSEVERSE</span>
        </div>
    );
};
