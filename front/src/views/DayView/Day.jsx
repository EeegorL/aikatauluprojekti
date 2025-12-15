import { Navigate, useParams } from "react-router-dom";
import { isValidDate, dateToStr } from "../../utils";
import Sidebar from "../../components/Sidebar/Sidebar";
import Schedule from "../../components/Schedule/Schedule";

import "./day.css";
import { useEffect, useState } from "react";
import Menu from "../../components/Menu/Menu";
import { getVuorot } from "../../dbHandler/dbHandler";

export default function Day() {
    const {day} = useParams();
    const [chosen, _setChosen] = useState({id: null, nimi: null, lyhenne: null, vuoro: null});
    const [vuorot, setVuorot] = useState(null);
    const [menuTarget, _setMenuTarget] = useState(null);

    const updateVuorot = async () => {
        setVuorot(await getVuorot(day));
    } 

    useEffect(() => {
        (async () => {
            updateVuorot();
        })();
    }, []);

    const setMenuTarget = (p) => {
        if(!menuTarget) _setMenuTarget(p);
        else if(!p) _setMenuTarget(null);
        else {
            if(menuTarget.vuoro.id !== p.vuoro.id){
                _setMenuTarget(p);
            }
            else {
                _setMenuTarget(null);
            }
        }
    }

    const setChosen = (p) => {
        if(p.id === chosen.id) _setChosen({id: null, nimi: null, lyhenne: null, vuoro: null});
        else _setChosen({id: p.id, nimi: p.nimi, lyhenne: p.lyhenne, vuoro: p.vuoro});

        if(p.vuoro && (p.id !== chosen.id)) {
            const sidebarSelectionElem = document.querySelector(`[person='${p.id}']`);
            sidebarSelectionElem.scrollIntoView({container: "nearest"});
        }
    }

    if(!isValidDate(day)) {
        const today = new Date(Date.now());
        const todayStr = dateToStr(today);

        return <Navigate to={`/pv/${todayStr}`} replace/>
    }
    
    return <div className="dayView">
        <div className="day_sidebarWrapper">
            <Sidebar chosen={chosen} setChosen={setChosen}/>
        </div>
        <div className="day_menuWrapper">
            <Menu updateVuorot={updateVuorot} menuTarget={menuTarget} setMenuTarget={setMenuTarget}/>
        </div>
        <div className="day_scheduleWrapper">
            {
                vuorot 
                ? <Schedule vuorot={vuorot} updateVuorot={updateVuorot} day={day} chosen={chosen} setChosen={setChosen} menuTarget={menuTarget} setMenuTarget={setMenuTarget}/>
                : "Odotapas..."
            }
        </div>
    </div>
}