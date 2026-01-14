import { createContext, useState } from "react";

export const LoginContext = createContext();

export function LoginProvider({children}) {
    const [user, setUser] = useState("skibidi");
    const updateLogin = login => setUser(login);

    return <LoginContext value={{user, updateLogin}}>
        {children}
    </LoginContext>
}