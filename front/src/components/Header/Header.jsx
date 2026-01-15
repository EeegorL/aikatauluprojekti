import "./header.css";
import {Link} from "react-router-dom";
import { logout } from "../../dbHandler/dbHandler";
import { useContext } from "react";
import { LoginContext } from "../../dbHandler/LoginContext";

export default function Header() {
    const loginContext = useContext(LoginContext);
    const doLogout = async () => {
        await logout();
        loginContext.updateLogin(null);
    }
    
    return <header>
        <div className="left">
            <h1><Link to="/">Moro</Link></h1>
        </div>
        <div className="right">
            <button onClick={doLogout} className="logoutButton">Kirjaudu ulos</button>
        </div>
    </header>;
}