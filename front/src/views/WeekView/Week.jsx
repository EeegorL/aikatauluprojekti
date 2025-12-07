import { Navigate, useParams } from "react-router-dom";
import { isValidDate, dateToStr } from "../../utils";
import Sidebar from "../../components/Sidebar/Sidebar";
import Schedule from "../../components/Schedule/Schedule";

import { useState } from "react";
import Menu from "../../components/Menu/Menu";

import "./week.css";

export default function Week() {
    const {day} = useParams();
    const [chosen, _setChosen] = useState({henkilo: null, nimi: null, lyhenne: null});

    const dayDate = new Date(Date.parse(day));
    const weekStart = new Date(dayDate.getTime() - ((dayDate.getDay() - 1) * 24 * 60 * 60 * 1000));

    const days = [];
    for(let i = 0; i < 7; i++) days.push(new Date(weekStart.getTime() + (i * 24 * 60 * 60* 1000)));


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
    return <>
        <div className="week_sidebarWrapper">
            <Sidebar chosen={chosen} setChosen={setChosen}/>
        </div>
        <div className="weekView">
            <div className="week_sidebarPlaceholder"/>
            <div className="week_menuPlaceholder"/>
            <div className="week_scheduleWrapper">
            {days.map(day => {
                const dayStr = dateToStr(day);
                return <div>
                        <Schedule day={dayStr} chosen={chosen} setChosen={setChosen}/>
                    </div>
            })}
            </div>
            </div>
        </>
}

    // return <>
    //     <div className="week_sidebarWrapper">
    //         <Sidebar chosen={chosen} setChosen={setChosen}/>
    //     </div>
    //     <div>

    //     </div>
    //     <div className="weekView">
    //         <div className="week_sidebarPlaceholder"/>
    //         <div className="week_menuPlaceholder"/>
    //         <div>
    //         {days.map(day => {
    //             const dayStr = dateToStr(day);
    //             return <div>
    //                 <div className="week_scheduleWrapper">
    //                     <Schedule day={dayStr} chosen={chosen} setChosen={setChosen}/>
    //                 </div>
    //             </div>
    //         })}
    //         </div>
    //         </div>
    //     </>