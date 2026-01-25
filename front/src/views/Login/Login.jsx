import { useState, useRef, useContext } from "react"
import "./login.css";
import { getVuorotyypit, getIhmiset, login } from "../../dbHandler/dbHandler";
import Popup from "../../components/Popup/Popup";
import { GlobalContext } from "../../dbHandler/GlobalContext";

export default function Login() {
    const {setPeople, setVuorotyypit} = useContext(GlobalContext);
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);

    const [popup, setPopup] = useState(null);
    const timeout = useRef(null);
    const {updateLogin} = useContext(GlobalContext);

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
        if(tryLogin.success) {
            updateLogin(tryLogin.data);
            setVuorotyypit(await getVuorotyypit());
            setPeople(await getIhmiset());
        }
        else {
            showPopup(tryLogin.err, true);
        }
    }

return <div>
        <div>
            <Popup popup={popup}/>
        </div>
        <div className="loginContainer">
            <form onSubmit={onSubmit}>
                <fieldset>
                    <legend>Login</legend>
                    <label htmlFor="usernameInput">Käyttäjätunnus</label>
                    <input name="usernameInput" type="text" autoComplete="current-password" onChange={(e) => setUsername(e.target.value)}/>
                    <label htmlFor="passwordInput">Salasana</label>
                    <input name="passwordInput" type="password" autoComplete="password" onChange={(e) => setPassword(e.target.value)}/>
                    <button type="submit">Submittaa</button>
                </fieldset>
            </form>
        </div>

    </div>
}