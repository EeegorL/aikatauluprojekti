import { useEffect, useState } from "react";
import "./schedule.css";
import { getVuorotyypit, getVuorot, addVuoro, canAddVuoro } from "../../dbHandler/dbHandler";
import { dateToStr, range, weekNum } from "../../utils";
import Vuoro from "./Vuoro/Vuoro";

export default function Schedule({vuorot, updateVuorot, day, chosen, setChosen, menuTarget, setMenuTarget}) {
    const [vuorotyypit, setVuorotyypit] = useState([]);
    const [timeRange, setTimeRange] = useState({start: 8, end: 22});

    useEffect(() => {
        (async () => {
            let tyypit = [];
            for(let x of await getVuorotyypit()) {
                tyypit.push({id: x.id, nimi: x.nimi, shown: true});
            }
            setVuorotyypit(tyypit);
            
            await updateVuorot();
        })();
    }, []);

    setInterval(async () => {
        await updateVuorot();
    }, 1000 * 60 * 5);

    const correctVuorot = (vuoro, aika) => {
        return vuorot.filter(x => x.vuoro === vuoro && x.aika === aika);
    }

    const tryAdd = async (data, day, hour, shift) => {
        try {
            if(await canAddVuoro(data, day, hour, shift)) {
                await addVuoro(day, parseInt(hour), parseInt(shift), parseInt(data.id));
                return true;
            }
            else {
                alert("Hell naw bro");
                return false;
            }
        }
        finally {
            await updateVuorot();
        }
    }

    const onDoubleClick = async (e) => {  
        if(!chosen.id) return;

        const targ = e.currentTarget;
        const hour = targ.getAttribute("hour");
        const shift = targ.getAttribute("shift");

        let noShift = {id: chosen.id};
        await tryAdd(noShift, day, hour, shift);
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
        await tryAdd(data, day, hour, shift);
    }

    if(vuorotyypit.length === 0) return;
    if(!vuorot) return <div>Odota...</div>
    else return <table className="schedule">
        <thead>
            <tr>
                <th colSpan={vuorotyypit.length + 1} className="scheduleTopPart">
                    Viikko {weekNum(day)}, {dateToStr(day, true)}
                </th>
            </tr>
            <tr>
                <th className="scheduleHeader emptyCell"></th>
                {vuorotyypit.filter(x => x.shown).map(v => {
                    return <th key={`shiftHeader_${v.id}`} className="scheduleHeader" shiftheader={v.id}>{v.nimi}</th>
                })}
            </tr>
        </thead>
        <tbody>
            {range(timeRange.start, timeRange.end).map(h => {
                return <tr key={`scheduleRow_${day}_${h}`}>
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
                            key={`shiftCell_${day}-${h}_${v.id}`}
                        >
                            <div className="shiftContainer">
                            {correctVuorot(v.id, h).map(p => {
                                return <Vuoro 
                                            key={`shift_${p.id}_${day}_${h}_${v.id}`}
                                            data={p} 
                                            chosen={chosen} 
                                            setChosen={setChosen}
                                            menuTarget={menuTarget}
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