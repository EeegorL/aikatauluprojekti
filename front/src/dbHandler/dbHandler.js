const url = "http://localhost:3001/api";

export const connTest = async () => {
    try {
        const f = await fetch(url+"/test", {
            method: "GET",
            headers: {
                "Access-Control-Allow-Origin": "*"
            }
        });
        return true;
    }
    catch(err) {
        return false;
    }
}

export const login = async (username, password) => {
    try {
        const f = await fetch(url+"/login", {
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
            return {success: true}
        }
        else {
            return {success: false, err: (await f.json()).err};
        }
    }
    catch(err) {
        return false;
    }
}

export const checkSession = async () => {
    try {
        return false; // TODO
        // const cookie = window.cookieStore.get("sessionId");
        // if(!cookie) return false;


    }
    catch(err) {

    }
} 

export const getIhmiset = async () => {
    const f = await fetch(url+"/ihmiset", {
        method: "GET",
        headers: {
            "Access-Control-Allow-Origin": "*"
        }
    });
    const data = await f.json();

    return data;
}

export const getVuorotyypit = async () => {
    const f = await fetch(url+"/vuorotyypit", {
        method: "GET",
        headers: {
            "Access-Control-Allow-Origin": "*"
        }
    });
    const data = await f.json();

    return data;
}

export const getVuorot = async (pv) => {
    const f = await fetch(url+"/vuorot/"+pv, {
        method: "GET",
        headers: {
            "Access-Control-Allow-Origin": "*"
        }
    });
    const data = await f.json();

    return data;
}

export const addVuoro = async (day, hour, shift, henkilo, note=null) => {
    const f = await fetch(url+"/vuorot", {
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
    const f = await fetch(url+"/vuorot", {
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
    const f = await fetch(url+"/canAdd", {
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
    const f = await fetch(url+"/note", {
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