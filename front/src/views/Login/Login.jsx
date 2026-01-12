import { useState, useRef, useContext } from "react"
import "./login.css";
import { login } from "../../dbHandler/dbHandler";
import Popup from "../../components/Popup/Popup";
import { LoginContext } from "../../dbHandler/LoginContext";

export default function Login() {
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);

    const [popup, setPopup] = useState(null);
    const timeout = useRef(null);
    const {loginCredentials, updateLogin} = useContext(LoginContext);
    
    const showPopup = (text, isError) => {
        if(timeout.current) clearTimeout(timeout.current);

        setPopup({text: text, isError: isError});
        timeout.current = setTimeout(() => {
            setPopup(null);
        }, 2000);
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        const tryLogin = await login(username, password);
        updateLogin("highkey skibiin")
        if(tryLogin.success) {
            updateLogin("skibidikunkku");
            console.log(loginCredentials)
            showPopup("Nyt ois sit niinku kirjautuminen tähä jotenki", false);
        }
        else {
            showPopup(tryLogin.err, true);
        }
    }
    console.log(loginCredentials)
    return <div>
        <div>
            <Popup popup={popup}/>
        </div>
        <div className="loginContainer">
            <form onSubmit={onSubmit}>
                <fieldset>
                    <label htmlFor="usernameInput">Käyttäjätunnus</label>
                    <input name="usernameInput" onChange={(e) => setUsername(e.target.value)}/>
                    <br/>
                    <label htmlFor="passwordInput">Salasana</label>
                    <input name="passwordInput" onChange={(e) => setPassword(e.target.value)}/>
                    <br/>
                    <button type="submit">Submittaa</button>
                </fieldset>
            </form>
        </div>

    </div>
}