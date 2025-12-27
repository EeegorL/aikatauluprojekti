import { Navigate, useNavigate, useParams } from "react-router-dom";
import { isValidDate, dateToStr } from "../../utils";
import Sidebar from "../../components/Sidebar/Sidebar";
import Schedule from "../../components/Schedule/Schedule";

import { useEffect, useState } from "react";
import Menu from "../../components/Menu/Menu";

import "./week.css";
import { getVuorot, getVuorotyypit } from "../../dbHandler/dbHandler";
import Popup from "../../components/Popup/Popup";

export default function Week() {
    const {day} = useParams();
    const [chosen, _setChosen] = useState({id: null, nimi: null, lyhenne: null, vuoro: null});
    const [menuTarget, _setMenuTarget] = useState(null);
    const [vuorotyypit, setVuorotyypit] = useState([]);
    const [vuorot, setVuorot] = useState({
        0: [],
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: []
    });

    const dayDate = new Date(Date.parse(day));
    const weekStart = new Date(dayDate.getTime() - (((dayDate.getDay() === 0 ? 7 : dayDate.getDay()) - 1) * 24 * 60 * 60 * 1000));

    const days = [];
    for(let i = 0; i < 7; i++) days.push(new Date(weekStart.getTime() + (i * 24 * 60 * 60* 1000)));

    const updateVuorot = async (...daysToUpdate) => {
        if(daysToUpdate.length === 0) { // updates the whole week
            console.log("hdifug")
            const vuorotTemp = {
                0: [],
                1: [],
                2: [],
                3: [],
                4: [],
                5: [],
                6: []
            }

            for(let key in days) {
                const d = days[key];
                const data = await getVuorot(dateToStr(d));
                vuorotTemp[key] = data;
             }
            setVuorot(vuorotTemp);
        }
        else if(daysToUpdate.every(d => days.some(x => dateToStr(x) === d))) { // updates only data for a certain day(s). Checks if the daysToUpdate only contains valid days
            const getNewData = await Promise.all( // returns {day's index: data}, e.g. {3: [{...}, {...}, ...]}
                daysToUpdate.map(async d => {
                    const correctDayIndex = days.findIndex(x => dateToStr(x) === d); // index of the appropriate day in the days-array
                    const correctDay = days[correctDayIndex];
                    const dayData = await getVuorot(dateToStr(correctDay)); // data appropriate for the correct day

                    return [correctDayIndex, dayData];
                })
            );

            const newData = Object.fromEntries(getNewData); // [x, y] => {x: y}

            setVuorot(current => ({
                ...current,
                ...newData
            }));
        }
        else {
            return false;
        }
    }

    useEffect(() => {
        (async()=> {
            await updateVuorot();

            const tyypit = [];
            for(let x of await getVuorotyypit()) {
                tyypit.push({id: x.id, nimi: x.nimi, shown: true});
            }
            setVuorotyypit(tyypit);
        })();
    }, [day]);

    const setMenuTarget = (p) => {
        if(!menuTarget) {
            _setMenuTarget(p);
        }
        else {
            if(!p) {
                _setMenuTarget(null);
            }
            else {
                if(menuTarget.vuoro.id === p.vuoro.id) _setMenuTarget(null);
                else _setMenuTarget(p);
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

    return <div className="weekView">
        <Popup />
        <Menu updateVuorot={updateVuorot} menuTarget={menuTarget} setMenuTarget={setMenuTarget}/>
        <div className="week_sidebarWrapper">
            <Sidebar chosen={chosen} setChosen={setChosen}/>
        </div>
        <div className="week_scheduleWrapper">
            {days.map(day => {
                const _day = dateToStr(day);
                const idx = days.indexOf(day);
                const data = vuorot[idx];              
                
                return <div key={`scheduleContainer_${day.getDay()}`}>
                    {
                        data 
                        ? <Schedule 
                            vuorot={data} 
                            updateVuorot={updateVuorot}
                            vuorotyypit={vuorotyypit}
                            day={_day} 
                            chosen={chosen} 
                            setChosen={setChosen} 
                            menuTarget={menuTarget} 
                            setMenuTarget={setMenuTarget}
                            skipAmount={7}
                            />
                        : "Odotapas..."
                    }
                    </div>
            })}
        </div>
    </div>
}
