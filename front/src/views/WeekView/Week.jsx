import { Navigate, useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

import "./week.css";

import { isValidDate, dateToStr } from "../../utils";
import { getVuorot, getVuorotyypit } from "../../dbHandler/dbHandler";

import Menu from "../../components/Menu/Menu";
import Sidebar from "../../components/Sidebar/Sidebar";
import Schedule from "../../components/Schedule/Schedule";
import Popup from "../../components/Popup/Popup";

export default function Week() {
    const {day} = useParams();
    const [chosen, _setChosen] = useState({id: null, nimi: null, lyhenne: null, vuoro: null});
    const [menuTarget, _setMenuTarget] = useState(null);
    const [vuorotyypit, setVuorotyypit] = useState([]);
    const [vuorot, setVuorot] = useState(null);

    const [popup, setPopup] = useState();
    const timeout = useRef(null);
    
    const showPopup = (text, isError) => {
        if(timeout.current) clearTimeout(timeout.current);

        setPopup({text: text, isError: isError});
        timeout.current = setTimeout(() => {
            setPopup(null);
        }, 2000);
    }

    const dayDate = new Date(Date.parse(day));
    const weekStart = new Date(dayDate.getTime() - (((dayDate.getDay() === 0 ? 7 : dayDate.getDay()) - 1) * 24 * 60 * 60 * 1000));

    const days = [];
    for(let i = 0; i < 7; i++) days.push(new Date(weekStart.getTime() + (i * 24 * 60 * 60* 1000)));

    const updateVuorot = async (...daysToUpdate) => {
        if(daysToUpdate.length === 0) { // updates the whole week
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
            const vuorotyypitFetch = await getVuorotyypit();
            try {
                await updateVuorot();

                const tyypit = [];
                for(let x of await vuorotyypitFetch) {
                    tyypit.push({id: x.id, nimi: x.nimi, shown: true});
                }
                setVuorotyypit(tyypit);
            }
            catch(err) {
            }
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
        if(!p || p?.id === chosen.id) {
            _setChosen({id: null, nimi: null, lyhenne: null, vuoro: null});
            return;
        }
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
        <Popup popup={popup}/>
        <Menu updateVuorot={updateVuorot} menuTarget={menuTarget} setMenuTarget={setMenuTarget} showPopup={showPopup}/>
        <div className="week_sidebarWrapper">
            <Sidebar vuorotyypit={vuorotyypit} updateVuorot={updateVuorot} chosen={chosen} setChosen={setChosen} showPopup={showPopup}/>
        </div>
        {vuorot // displays the schedules once loaded
        ? <div className="week_scheduleWrapper">
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
                            showPopup={showPopup}
                            skipAmount={7}
                            />
                        : "..."
                    }
                    </div>
            })}
        </div>
        : "Ladataan..."}
    </div>
}
