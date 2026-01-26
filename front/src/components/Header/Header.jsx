import "./header.css";
import {Link} from "react-router-dom";
import { logout } from "../../dbHandler/dbHandler";
import { useContext } from "react";
import { GlobalContext } from "../../dbHandler/GlobalContext";

export default function Header() {
    const globalContext = useContext(GlobalContext);
    const user = globalContext.user;
    
    const doLogout = async () => {
        await logout();
        globalContext.updateLogin(null);
    }
    
    return <header>
        {user
            ? <>
                <div className="left">
                    <h1><Link to="/">Trokee</Link></h1>
                </div>
                <div className="right">
                    <button onClick={doLogout} className="logoutButton">Kirjaudu ulos</button>
                </div>
            </>
            : <>
                <div className="left">
                    <h1><span>Moro</span></h1>
                </div>
                <div className="right">
                </div>
            </>
        }

    </header>;
}