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
