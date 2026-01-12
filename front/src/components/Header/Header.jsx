import "./header.css";
import { dateToStr } from "../../utils";
import {Link} from "react-router-dom";
import { useContext } from "react";
import { LoginContext } from "../../dbHandler/LoginContext";


export default function Header() {
    const today = dateToStr(new Date(Date.now()));
    const {loginCredentials, updateLogin} = useContext(LoginContext);

    return <header>
        <h1><Link to="/">Moro</Link></h1>
        <button onClick={()=>updateLogin(null)}>Logout-testi</button>
    </header>;
}