import { Navigate, useParams } from "react-router-dom";
import { isValidDate, dateToStr } from "../../utils";
import Sidebar from "../../components/Sidebar/Sidebar";
import Schedule from "../../components/Schedule/Schedule";

import { useEffect, useState } from "react";
import Menu from "../../components/Menu/Menu";

import "./week.css";
import { getVuorot } from "../../dbHandler/dbHandler";

export default function Week() {
    const {day} = useParams();
    const [chosen, _setChosen] = useState({id: null, nimi: null, lyhenne: null, vuoro: null});
    const [menuTarget, _setMenuTarget] = useState(null);

    const [mon, setMon] = useState([]);
    const [tue, setTue] = useState([]);
    const [wed, setWed] = useState([]);
    const [thu, setThu] = useState([]);
    const [fri, setFri] = useState([]);
    const [sat, setSat] = useState([]);
    const [sun, setSun] = useState([]);

    const dayDate = new Date(Date.parse(day));
    const weekStart = new Date(dayDate.getTime() - (((dayDate.getDay() === 0 ? 7 : dayDate.getDay()) - 1) * 24 * 60 * 60 * 1000));

    const days = [];
    for(let i = 0; i < 7; i++) days.push(new Date(weekStart.getTime() + (i * 24 * 60 * 60* 1000)));

    const updateVuorot = async (day="all") => {
        if(day === "all") {
            for(let d of days) {
                const data = await getVuorot(dateToStr(d));
                
                switch(d.getDay()) {
                    case 1:
                        setMon(data);
                        break;
                    case 2:
                        setTue(data);
                        break;
                    case 3:
                        setWed(data);
                        break;
                    case 4:
                        setThu(data);
                        break;
                    case 5:
                        setFri(data);
                        break;
                    case 6:
                        setSat(data);
                        break;
                    case 0:
                        setSun(data);
                        break;
                }
            }
        }
        // else if(days.some(x => dateToStr(x) === day)) {
        //     switch(day.getDay()) {
        //         case 1:
        //             setMon(await getVuorot(dateToStr(day)));
        //             break;
        //         case 2:
        //             setTue(await getVuorot(dateToStr(day)));
        //             break;
        //         case 3:
        //             setWed(await getVuorot(dateToStr(day)));
        //             break;
        //         case 4:
        //             setThu(await getVuorot(dateToStr(day)));
        //             break;
        //         case 5:
        //             setFri(await getVuorot(dateToStr(day)));
        //             break;
        //         case 6:
        //             setSat(await getVuorot(dateToStr(day)));
        //             break;
        //         case 0:
        //             setSun(await getVuorot(dateToStr(day)));
        //             break;
        //     }
        // }
        // else { // incorrect day
        //     return;
        // }
    }

    useEffect(() => {
        (async()=> {
            await updateVuorot();
        })();
    }, [day]);

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

        return <Navigate to={`/vk/${todayStr}`} replace/>
    }

    return <div className="weekView">
        <div className="week_sidebarWrapper">
            <Sidebar chosen={chosen} setChosen={setChosen}/>
        </div>
        <div className="week_menuWrapper">
            <Menu menuTarget={menuTarget}/>
        </div>
        <div className="week_scheduleWrapper">
            {days.map(day => {
                let data, updater;
                        data = mon;
                        updater = setMon;
                // switch(day.getDay()) {
                //     case 1:
                //         data = mon;
                //         updater = setMon;
                //         break;
                //     case 2:
                //         data = tue;
                //         updater = setTue;
                //         break;
                //     case 3:
                //         data = wed;
                //         updater = setWed;
                //         break;
                //     case 4:
                //         data = thu;
                //         updater = setThu;
                //         break;
                //     case 5:
                //         data = fri;
                //         updater = setFri;
                //         break;
                //     case 6:
                //         data = sat;
                //         updater = setSat;
                //         break;
                //     case 0:
                //         data = sun;
                //         updater = setSun;
                //         break;
                // }
                console.log(data)
                return <div key={`scheduleContainer_${day.getDay()}`}>
                    {
                        data 
                        ? <Schedule 
                            vuorot={data} 
                            updateVuorot={updater} 
                            day={day} 
                            chosen={chosen} 
                            setChosen={setChosen} 
                            menuTarget={menuTarget} 
                            setMenuTarget={setMenuTarget}
                            />
                        : "Odotapas..."
                    }
                    </div>
            })}
        </div>
    </div>
}
