import "./header.css";
import { dateToStr } from "../../utils";
import {Link} from "react-router-dom";

const today = dateToStr(new Date(Date.now()));

export default function Header() {
    return <header>
        <h1><Link to={`/vk/${today}`}>Moro</Link></h1>
    </header>;
}