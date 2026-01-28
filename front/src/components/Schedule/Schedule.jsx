import "./schedule.css";
import { addVuoro, canAddVuoro, deleteVuoro, getLoginData } from "../../dbHandler/dbHandler";
import { dateToStr, range, weekNum } from "../../utils";
import Vuoro from "./Vuoro/Vuoro";
import { useContext, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { GlobalContext } from "../../dbHandler/GlobalContext";

export default function Schedule({vuorot, updateVuorot, day, chosen, setChosen, menuTarget, setMenuTarget, showPopup, skipAmount, waitingForLoad}) {
    const context = useContext(GlobalContext);
    const vuorotyypit = context.vuorotyypit;

    const timeout = useRef(null);

    const timeRange = context.timeRange;
    const touchStart = useRef({x: 0, y: 0});
    const queue = useRef(false);

    useEffect(() => {
        const f = async () => {
            await updateVuorot();
            if(await getLoginData()) timeout.current = setTimeout(f, 1000 * 60 * 15);
        }
        timeout.current = setTimeout(f, 1000 * 60 * 15); // the first periodic update launches after 10 minutes, starting the loop
        return () => {
            clearTimeout(timeout.current);
        }
    }, []);

    const correctVuorot = (vuoro, aika) => {
        const _correctVuorot = vuorot.length > 0 
        ? vuorot.filter(x => x.vuoro === vuoro && x.aika === aika).sort((a, b) => {
            return a.lyhenne < b.lyhenne ? -1 : 1;
        }) 
        : [];

        return _correctVuorot;
    }

    const tryAdd = async (data, day, hour, shift) => {
        if(queue.current) return; // additions in queue
        if(data.vuoro?.pv === day && data.vuoro?.aika === parseInt(hour) && data.vuoro?.tyyppi === parseInt(shift)) return; // the shift has not moved an inch

        queue.current = true;
        try {
            if(await canAddVuoro(data, day, hour, shift)) {
                if(data.vuoro) {
                    await deleteVuoro(data.vuoro.id);
                    await addVuoro(day, parseInt(hour), parseInt(shift), parseInt(data.id), data.vuoro.note);
                    showPopup("Vuoro siirretty", false);
                    setChosen(null);
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
            queue.current = false;
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
        
        shiftHeader?.classList.add("helperLines");
        hourHeader?.classList.add("helperLines");
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

    const onTouchStart = (e) => { // mobile
        touchStart.current = {x: e.changedTouches[0].pageX, y: e.changedTouches[0].pageY};
    }

    const onTouchEnd = async (e) => { // mobile
        if(!chosen.id) return;

        const aX = touchStart.current.x;
        const aY = touchStart.current.y;
        const bX = e.changedTouches[0].pageX;
        const bY = e.changedTouches[0].pageY;

        const triangleDiff = Math.sqrt(Math.abs(bX - aX)**2 + Math.abs(bY - aY)**2);
        if(triangleDiff > 30) return;
        if(e.target.nodeName != "DIV") return;

        const hour = e.currentTarget.getAttribute("hour");
        const shift = e.currentTarget.getAttribute("shift");

        await tryAdd(chosen, day, hour, shift);
    }

    const navToNext = (dir) => {
        const next = Date.parse(day) + dir * skipAmount * 1000*60*60*24;
        const newDate = new Date(next);

        return skipAmount === 1
            ? `/pv/${dateToStr(newDate)}`
            : `/vk/${dateToStr(newDate)}`;
    }

    const onMobile = screen.width <= 1000;
    const viewChange = window.location.pathname.startsWith("/pv") ? "vk" : "pv";

    if(vuorotyypit.length === 0) return;
    if(!vuorot || waitingForLoad) return;
    else return <div className="scheduleContainer">
        <table className="schedule">
        <thead>
            <tr> 

                     <th className="dateCell">
                        {location.pathname.startsWith("/vk")
                        ? <Link to={`/pv/${day}`}>{dateToStr(day, true)}</Link>
                        : <span>{dateToStr(day, true)}</span>
                        }
                    </th>

                {vuorotyypit.filter(x => x.shown).map(v => {
                    return <th key={`shiftHeader_${v.id}`} className="scheduleHeader" shiftheader={v.id}>{v.nimi}</th>
                })}
            </tr>
        </thead>
        <tbody>
            {range(timeRange.start, timeRange.end).map(h => {
                return <tr key={`scheduleRow_${day}_${h}`}>
                    <th className="scheduleHeader hourHeader" hourheader={h}>{h}-{h+1}</th>
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
                            onTouchStart={onTouchStart}
                            onTouchEnd={onTouchEnd}
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