import { Navigate, useParams } from "react-router-dom";
import { isValidDate, dateToStr } from "../../utils";
import Sidebar from "../../components/Sidebar/Sidebar";
import Schedule from "../../components/Schedule/Schedule";

import "./day.css";
import { useState } from "react";
import Menu from "../../components/Menu/Menu";

export default function Day() {
    const {day} = useParams();
    const [chosen, _setChosen] = useState({id: null, nimi: null, lyhenne: null, vuoro: null});
    const [menuTarget, _setMenuTarget] = useState(null);

    const setMenuTarget = (p) => {
        if(!menuTarget) _setMenuTarget(p);
        else {
            if(menuTarget.vuoro.id !== p.vuoro.id) _setMenuTarget(p);
            else _setMenuTarget(null);
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
            <Menu menuTarget={menuTarget} setMenuTarget={setMenuTarget}/>
        </div>
        <div className="day_scheduleWrapper">
            <Schedule day={day} chosen={chosen} setChosen={setChosen} setMenuTarget={setMenuTarget}/>
        </div>
    </div>
}