import "./schedule.css";
import { addVuoro, canAddVuoro, deleteVuoro } from "../../dbHandler/dbHandler";
import { dateToStr, range, weekNum } from "../../utils";
import Vuoro from "./Vuoro/Vuoro";
import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function Schedule({vuorot, updateVuorot, vuorotyypit, day, chosen, setChosen, menuTarget, setMenuTarget, showPopup, skipAmount}) {
    const timeRange = {start: 8, end: 22};

    useEffect(() => {
        let timeout;

        const f = async () => {
            await updateVuorot();
            timeout = setTimeout(f, 1000 * 60 * 20);
        }
        
        setTimeout(f, 1000 * 60 * 10); // the first periodic update launches after 10 minutes, starting the loop

        return clearTimeout(timeout);
    }, []);

    const correctVuorot = (vuoro, aika) => {
        return vuorot.length > 0 ? vuorot.filter(x => x.vuoro === vuoro && x.aika === aika) : [];
    }

    const tryAdd = async (data, day, hour, shift) => {
        if(data.vuoro?.pv === day && data.vuoro?.aika === parseInt(hour) && data.vuoro?.tyyppi === parseInt(shift)) return;
        try {
            if(await canAddVuoro(data, day, hour, shift)) {
                if(data.vuoro) {
                    await deleteVuoro(data.vuoro.id);
                    await addVuoro(day, parseInt(hour), parseInt(shift), parseInt(data.id), data.vuoro.note);
                    showPopup("Vuoro siirretty", false);
                }
                else {
                    await addVuoro(day, parseInt(hour), parseInt(shift), parseInt(data.id));
                    showPopup("Vuoro lisätty", false);
                }
                return true;
            }
            else {
                showPopup("Vuorot ovat ristiriidassa keskenään", true);
                return false;
            }
        }
        finally {
            if(data.vuoro) {
                await updateVuorot(day, data.vuoro.pv);
            }
            else await updateVuorot(day);
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

    const navToText = (dir) => {
        const next = Date.parse(day) + dir * skipAmount * 1000*60*60*24;
        const newDate = new Date(next);

        return skipAmount === 1
            ? `/pv/${dateToStr(newDate)}`
            : `/vk/${dateToStr(newDate)}`;
    }
    
    if(vuorotyypit.length === 0) return;
    if(!vuorot) return <div>Odota...</div>
    else return <div>
        <table className="schedule">
        <thead>
            <tr>
                <th colSpan={vuorotyypit.length + 1} className="scheduleDateSwitcherRow">
                    <nav className="scheduleDateSwitcher">
                        <b><Link to={navToText(-1)}>&#8666;</Link></b>
                        <span>Viikko {weekNum(day)}<br/>{dateToStr(day, true)}</span>
                        <b><Link to={navToText(1)}>&#8667;</Link></b>
                    </nav>
                </th>
            </tr>
            <tr>
                <th className="emptyCell"/>
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
    </table>
    </div>
}