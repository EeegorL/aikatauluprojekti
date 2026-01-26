import { createContext, useEffect, useState } from "react";
import { setUnauthHandler } from "./AuthenticationBridge";
import { getIhmiset, getLoginData, getVuorotyypit } from "./dbHandler";

export const GlobalContext = createContext();

export function ContextProvider({children}) {
    const [user, setUser] = useState(null);
    const [vuorotyypit, setVuorotyypit] = useState([]);
    const [people, setPeople] = useState([]);
    const timeRange = {start: 8, end: 20};

    const updateLogin = login => {
        setUser(login);
    };

    useEffect(() => {
        setUnauthHandler(() => updateLogin(null));
    });

    useEffect(() => {
        (async () => {
            if(user?.id !== (await getLoginData())?.id) {
                const vuorotyypitFetch = await getVuorotyypit();
                const tyypit = [];
                for(let x of vuorotyypitFetch) {
                    tyypit.push({id: x.id, nimi: x.nimi, shown: true});
                }
                setVuorotyypit(tyypit);
                setPeople(await getIhmiset() ?? []);
            }
        })();
    }, [user]);

    return <GlobalContext.Provider value={{user, updateLogin, vuorotyypit, setVuorotyypit, people, setPeople, timeRange}}>
        {children}
    </GlobalContext.Provider>
}