import { createContext, useEffect, useState } from "react";
import { setUnauthHandler } from "./AuthenticationBridge";

export const LoginContext = createContext();

export function LoginProvider({children}) {
    const [user, setUser] = useState(null);
    const updateLogin = login => setUser(login);

    useEffect(() => {
        setUnauthHandler(() => updateLogin(null));
    });

    return <LoginContext.Provider value={{user, updateLogin}}>
        {children}
    </LoginContext.Provider>
}