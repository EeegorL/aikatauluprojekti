import { Link } from "react-router-dom";
import "./frontpage.css";
import { dateToStr } from "../../utils";
import { useContext } from "react";
import { LoginContext } from "../../dbHandler/LoginContext";

export default function FrontPage() {
    const loginData = useContext(LoginContext);
    const today = dateToStr(new Date(Date.now()));

    return <div className="frontPage">
        <h1>Tervetuloa nimettömään aikataulusovellukseen, {loginData.user.username}!</h1>
        <ul className="linkList">
            <li><a><Link to={`/pv/${today}`}>Siirry tähän päivään</Link></a><br className="mobileListBreak"/></li>
            <li><a><Link to={`/vk/${today}`}>Siirry tähän viikkoon</Link></a><br className="mobileListBreak"/></li>
            <li><a><Link to={"/info"}>Mikä ihme tää on?</Link></a><br className="mobileListBreak"/></li>
        </ul>
    </div>
}