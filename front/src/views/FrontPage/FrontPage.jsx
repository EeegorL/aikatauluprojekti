import { Link } from "react-router-dom";
import "./frontpage.css";
import { dateToStr } from "../../utils";

export default function FrontPage() {
    const today = dateToStr(new Date(Date.now()));

    return <div className="frontPage">
        <h1>Tervetuloa nimettömään aikataulusovellukseen!</h1>
        <ul>
            <li><Link to={`/pv/${today}`}>Siirry tähän päivään</Link></li>
            <li><Link to={`/vk/${today}`}>Siirry tähän viikkoon</Link></li>
            <li><Link to={"/info"}>Mikä ihme tää on?</Link></li>
        </ul>
    </div>
}