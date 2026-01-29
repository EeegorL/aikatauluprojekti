import { Link } from "react-router-dom";
import "./frontpage.css";
import { dateToStr } from "../../utils";
import { useContext } from "react";
import { GlobalContext } from "../../dbHandler/GlobalContext";

export default function FrontPage() {
    const loginData = useContext(GlobalContext);
    const today = dateToStr(new Date(Date.now()));

    return <div className="frontPage">
        <p>Tervetuloa nimettömään aikataulusovellukseen, {loginData?.user?.username}!</p>
        <ul className="linkList">
            <li><Link to={`/pv/${today}`}>Siirry tähän päivään</Link></li>
            <li><Link to={`/vk/${today}`}>Siirry tähän viikkoon</Link></li>
            <li><Link to={"/info"}>Mikä ihme tää on?</Link></li>
        </ul>
    </div>
}