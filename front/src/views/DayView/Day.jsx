import { Navigate, useParams } from "react-router-dom";
import { isValidDate, dateToStr } from "../../utils";
import Sidebar from "../../components/Sidebar/Sidebar";
import Schedule from "../../components/Schedule/Schedule";

import "./day.css";
import { useState } from "react";
import Menu from "../../components/Menu/Menu";

export default function Day() {
    const {day} = useParams();
    const [chosen, _setChosen] = useState({henkilo: null, nimi: null, lyhenne: null});

    const setChosen = (p) => {
        if(p.henkilo === chosen.henkilo) _setChosen({henkilo: null, nimi: null, lyhenne: null});
        else _setChosen({henkilo: p.henkilo, nimi: p.nimi, lyhenne: p.lyhenne});

        if(p.pv && (p.henkilo !== chosen.henkilo)) {
            const sidebarSelectionElem = document.querySelector(`[person='${p.henkilo}']`);
            sidebarSelectionElem.scrollIntoView();
        }
    }

    if(!isValidDate(day)) {
        const today = new Date(Date.now());
        const todayStr = dateToStr(today);

        return <Navigate to={`/day/${todayStr}`} replace/>
    }
    
    return <div className="dayView">
        <div className="day_sidebarWrapper">
            <Sidebar chosen={chosen} setChosen={setChosen}/>
        </div>
        <div className="day_menuWrapper">
            <Menu />
        </div>
        <div className="day_scheduleWrapper">
            <Schedule day={day} chosen={chosen} setChosen={setChosen}/>
        </div>
    </div>
}