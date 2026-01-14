const url = "http://localhost:3001/api";

export const doFetch = async (url, props) => {
    const req = await fetch(url, {
        "credentials": "include",
        ...props
    });
    
    if(false) { // TODO login not valid, logout and such
        // handle auth
    }

    return req;
}

export const connTest = async () => {
    try {
        await doFetch(url+"/test", {
            method: "GET",
        });
        return true;
    }
    catch(err) {
        return false;
    }
}

export const login = async (username, password) => {
    try {
        const f = await doFetch(url+"/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username, 
                password
            })
        });
        
        if(f.status === 200) {
            const data = (await f.json()).data;
            return {success: true, data};
        }
        else {
            return {success: false, err: (await f.json()).err};
        }
    }
    catch(err) {
        return false;
    }
}

export const logout = async () => {
    await doFetch(url+"/logout", {
        method: "POST"
    });
}

export const getLoginData = async () => {
    const f = await doFetch(url+"/getLogin", {
        method: "GET"
    });

    if(f.status === 200) {
        const data = await f.json();
        return data;
    }

    return null;
}

export const getIhmiset = async () => {
    const f = await doFetch(url+"/ihmiset", {
        method: "GET"
    });
    const data = await f.json();

    return data;
}

export const getVuorotyypit = async () => {
    const f = await doFetch(url+"/vuorotyypit", {
        method: "GET"
    });
    const data = await f.json();

    return data;
}

export const getVuorot = async (pv) => {
    const f = await doFetch(url+"/vuorot/"+pv, {
        method: "GET"
    });
    const data = await f.json();

    return data;
}

export const addVuoro = async (day, hour, shift, henkilo, note=null) => {
    const f = await doFetch(url+"/vuorot", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            day: day,
            hour: parseInt(hour),
            shift: parseInt(shift),
            henkilo: henkilo,
            note: note

        })
    });
}

export const deleteVuoro = async (id) => {
    await doFetch(url+"/vuorot", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: id
        })
    });
}

export const canAddVuoro = async (movedData, pv, h, v) => {
    const f = await doFetch(url+"/canAdd", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            movedData: movedData,
            day: pv,
            hour: parseInt(h),
            vuoro: parseInt(v)
        })
    });
    if(f.status === 200) {
        return true;
    }
    if(f.status === 409) {
        const canBeResolved = (await f.json()).canBeResolvedByDeletingOrigin;
        return canBeResolved;    
    }
    return false;
}

export const updateNote = async (id, note) => {
    const f = await doFetch(url+"/note", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: id,
            note: note
        })
    });

    if(f.status === 200) return true;
    else return false;    
}