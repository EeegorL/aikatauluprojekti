import { createContext, useEffect, useState } from "react";

export const LoginContext = createContext();

export function LoginProvider({children}) {
    const [loginCredentials, setLoginCredentials] = useState("skibidi");
    const updateLogin = login => setLoginCredentials(login);
    
    useEffect(() => {
        let token = parseInt(window.sessionStorage.getItem("aikatauluToken"));
        if(!token) window.sessionStorage.setItem("aikatauluToken", 1);
        else window.sessionStorage.setItem("aikatauluToken", token + 1);
        console.log(token)
    }, []);

    return <LoginContext value={{loginCredentials, updateLogin}}>
        {children}
    </LoginContext>
}