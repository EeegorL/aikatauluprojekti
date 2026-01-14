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
        <h1><Link to="/">Moro</Link></h1>
        <button onClick={doLogout}>Logout (tää pitäs tyylitellä...)</button>
    </header>;
}