import { Navigate, useParams } from "react-router-dom";
import { isValidDate, dateToStr } from "../../utils";
import Sidebar from "../../components/Sidebar/Sidebar";
import Schedule from "../../components/Schedule/Schedule";

import { useState } from "react";
import Menu from "../../components/Menu/Menu";

import "./week.css";

export default function Week() {
    const {day} = useParams();
    const [chosen, _setChosen] = useState({id: null, nimi: null, lyhenne: null, vuoro: null});
    const [menuTarget, _setMenuTarget] = useState(null);

    const dayDate = new Date(Date.parse(day));
    const weekStart = new Date(dayDate.getTime() - (((dayDate.getDay() === 0 ? 7 : dayDate.getDay()) - 1) * 24 * 60 * 60 * 1000));

    const days = [];
    for(let i = 0; i < 7; i++) days.push(new Date(weekStart.getTime() + (i * 24 * 60 * 60* 1000)));

    const setMenuTarget = (p) => {
        if(!menuTarget || !menuTarget.vuoro) _setMenuTarget(p);
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
    return<div className="weekView">
            <div className="week_sidebarWrapper">
                <Sidebar chosen={chosen} setChosen={setChosen}/>
            </div>
            <div className="week_menuWrapper">
                <Menu menuTarget={menuTarget}/>
            </div>
            <div className="week_scheduleWrapper">
                {days.map(day => {
                    const dayStr = dateToStr(day);
                    return <div key={`scheduleContainer_${day.getDay()}`}>
                            <Schedule day={dayStr} chosen={chosen} setChosen={setChosen} menuTarget={menuTarget} setMenuTarget={setMenuTarget}/>
                        </div>
                })}
            </div>

        </div>
}
