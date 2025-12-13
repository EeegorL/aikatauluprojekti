const url = "http://localhost:3001/api";

export const connTest = async () => {
    try {
        const f = await fetch(url+"/test", {
            method: "GET",
            headers: {
                "Access-Control-Allow-Origin": "*"
            }
        });

        return f.status === 200;
    }
    catch(err) {
        return false;
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
        if(movedData.vuoro) await deleteVuoro(movedData.vuoro.id);
        return true;
    }
    if(f.status === 409) {
        const canBeResolved = (await f.json()).canBeResolvedByDeletingOrigin;
        if(canBeResolved) {
            await deleteVuoro(movedData.vuoro.id); // poistaa vuoron, sallien "siirtämisen"
            return true;
        }
        return false;
        
    }
    return false;
}