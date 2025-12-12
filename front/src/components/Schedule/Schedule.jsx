import { useEffect, useState } from "react";
import "./schedule.css";
import { getVuorotyypit, getVuorot, addVuoro, canAddVuoro } from "../../dbHandler/dbHandler";
import { dateToStr, range, weekNum } from "../../utils";
import Vuoro from "./Vuoro/Vuoro";

export default function Schedule({day, chosen, setChosen, setMenuTarget}) {
    const [vuorot, setVuorot] = useState([]);
    const [vuorotyypit, setVuorotyypit] = useState([]);
    const [timeRange, setTimeRange] = useState({start: 8, end: 22});

    useEffect(() => {
        (async () => {
            let tyypit = [];
            for(let x of await getVuorotyypit()) {
                tyypit.push({id: x.id, nimi: x.nimi, shown: true});
            }
            setVuorotyypit(tyypit);
            
            setVuorot(await getVuorot(day));
        })();
    }, []);


    const correctVuorot = (vuoro, aika) => {
        return vuorot.filter(x => x.vuoro === vuoro && x.aika === aika);
    }

    const onDoubleClick = async (e) => {  
        if(!chosen.id) return;

        const targ = e.currentTarget;
        const hour = targ.getAttribute("hour");
        const shift = targ.getAttribute("shift");

        await addVuoro(day, hour, shift, chosen.id);
        setVuorot(await getVuorot(day));
    }

    const onMouseOver = (e) => {
        const tableParent = e.target.closest("table");

        const shift = e.currentTarget.getAttribute("shift");
        const hour = e.currentTarget.getAttribute("hour");

        const shiftHeader = tableParent.querySelector(`[shiftheader="${shift}"]`);
        const hourHeader = tableParent.querySelector(`[hourheader="${hour}"]`);
        
        shiftHeader.classList.add("helperLines");
        hourHeader.classList.add("helperLines");
    }

    const onMouseLeave = () => {
        for(let elem of document.querySelectorAll(".helperLines, .focusHighlight")) {
            elem.classList.remove("helperLines");
            elem.classList.remove("focusHighlight");
        }
    }

    const onDragOver = (e) => {
        e.preventDefault();
        e.currentTarget.classList.add("focusHighlight");
        onMouseOver(e);
    }

    const onDragLeave = (e) => {
        e.currentTarget.classList.remove("focusHighlight");
        onMouseLeave(e);
    }

    const onDrop = async (e) => {
        const shift = e.currentTarget.getAttribute("shift");
        const hour = e.currentTarget.getAttribute("hour");
        let data = null;

        try {
            data = JSON.parse(e.dataTransfer.getData("application/json"));
        }
        catch(err) { // if the data comes from somewhere else than table cell, and thus does not contain suitable data. Could also add the login token to the body as verification... TODO?
            return;
        }

        if(await canAddVuoro(data, day, hour, shift)) {
            await addVuoro(day, parseInt(hour), parseInt(shift), parseInt(data.id));
        }
        setVuorot(await getVuorot(day));
    }

    if(vuorotyypit.length === 0) return;
    return <table className="schedule">
        <thead>
            <tr>
                <th colSpan={vuorotyypit.length + 1} className="scheduleTopPart">
                    Viikko {weekNum(day)}, {dateToStr(day, true)}
                </th>
            </tr>
            <tr>
                <th className="scheduleHeader emptyCell"></th>
                {vuorotyypit.filter(x => x.shown).map(v => {
                    return <th className="scheduleHeader" shiftheader={v.id}>{v.nimi}</th>
                })}
            </tr>
        </thead>
        <tbody>
            {range(timeRange.start, timeRange.end).map(h => {
                return <tr>
                    <th className="scheduleHeader sideHeader" hourheader={h}>{h}-{h+1}</th>
                    {vuorotyypit.map(v => {
                        return <td
                            hour={h}
                            shift={v.id}
                            className="scheduleCell"
                            onDoubleClick={onDoubleClick}
                            onMouseOver={onMouseOver}
                            onMouseLeave={onMouseLeave}
                            onDragOver={onDragOver}
                            onDragLeave={onDragLeave}
                            onDrop={onDrop}
                        >
                            <div className="shiftContainer">
                            {correctVuorot(v.id, h).map(v => {
                                return <Vuoro 
                                            data={v} 
                                            chosen={chosen} 
                                            setChosen={setChosen}
                                            setMenuTarget={setMenuTarget}
                                        />
                            })}
                            </div>

                        </td>
                    })}
                </tr>
            })}
        </tbody>
    </table>;
}