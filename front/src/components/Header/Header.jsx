import "./header.css";

import {Link} from "react-router-dom";
const today = new Date(Date.now()).toString();

export default function Header() {
    return <header>
        <h1>Moro</h1>
    </header>;
}