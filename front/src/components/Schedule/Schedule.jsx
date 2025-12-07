import { useEffect, useState } from "react";
import "./schedule.css";
import { getVuorotyypit, getVuorot, addVuoro } from "../../dbHandler/dbHandler";
import { range } from "../../utils";
import Vuoro from "./Vuoro/Vuoro";

export default function Schedule({day, chosen, setChosen}) {
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
        if(!chosen.henkilo) return;

        const targ = e.currentTarget;
        const hour = targ.getAttribute("hour");
        const shift = targ.getAttribute("shift");

        await addVuoro(day, hour, shift, chosen.henkilo);
        setVuorot(await getVuorot(day));
    }

    const onMouseOver = (e) => {
        const elems = [];
        const tableParent = e.target.closest("table");

        const shift = e.currentTarget.getAttribute("shift");
        const hour = e.currentTarget.getAttribute("hour");

        const shiftHeader = tableParent.querySelector(`[shiftheader="${shift}"]`);
        const hourHeader = tableParent.querySelector(`[hourheader="${hour}"]`);
        
        shiftHeader.classList.add("helperLines");
        hourHeader.classList.add("helperLines");

        // for(let elem of tableParent.querySelectorAll(`[hour="${hour}"]`)) {
        //     const elemsShift = parseInt(elem.getAttribute("shift"));
        //     if(elemsShift <= shift) elems.push(elem);
        // }

        // for(let elem of tableParent.querySelectorAll(`[shift="${shift}"]`)) {
        //     const elemsHour = parseInt(elem.getAttribute("hour"));
        //     if(elemsHour <= hour) elems.push(elem);
        // }

        // for(let elem of elems) {
        //     elem.classList.add("helperLines");
        // }
    }

    const onMouseLeave = () => {
        for(let elem of document.querySelectorAll(".helperLines")) {
            elem.classList.remove("helperLines");
        }
    }
    
    if(vuorotyypit.length === 0) return;
    return <table className="schedule" id="schedule1">
        <thead>
            <tr>
                <th colSpan={vuorotyypit.length + 1} className="scheduleTopPart">{day}</th>
            </tr>
            <tr>
                <th className="scheduleDate"></th>
                {vuorotyypit.filter(x => x.shown).map(v => {
                    return <th className="scheduleHeader" shiftheader={v.id}>{v.nimi}</th>
                })}
            </tr>
        </thead>
        <tbody>
            {range(timeRange.start, timeRange.end).map(h => {
                return <tr>
                    <th className="scheduleHeader" hourheader={h}>{h}-{h+1}</th>
                    {vuorotyypit.map(v => {
                        return <td
                            hour={h}
                            shift={v.id}
                            className="scheduleCell"
                            onDoubleClick={onDoubleClick}
                            onMouseOver={onMouseOver}
                            onMouseLeave={onMouseLeave}
                        >
                            <div className="shiftContainer">
                            {correctVuorot(v.id, h).map(v => {
                                return <Vuoro data={v} chosen={chosen} setChosen={setChosen}/>
                            })}
                            </div>

                        </td>
                    })}
                </tr>
            })}
        </tbody>
    </table>;
}