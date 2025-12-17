import "./vuoro.css";

import { dateToStr } from "../../../utils";

export default function Vuoro({data, chosen, setChosen, menuTarget, setMenuTarget}) {
    const fData = {
        id: data.henkilo,
        nimi: data.nimi,
        lyhenne: data.lyhenne,
        vuoro: {
            id: data.id,
            pv: dateToStr(data.pv),
            aika: data.aika,
            tyyppi: data.vuoro,
            nimi: data.vuoronimi,
            note: data.note
        }
    }

    const onDoubleClick = (e) => {
        e.stopPropagation();
    }

    const onRightClick = (e) => {
        e.preventDefault();
        
        setMenuTarget(fData);
    }

    const onDragStart = (e) => {
        if(menuTarget) {
            if(menuTarget.vuoro.id === fData.vuoro.id) setMenuTarget(null);
        }
        e.dataTransfer.setData("application/json", JSON.stringify(fData));
    }
    return <span 
        className={`
            vuoro
            ${chosen.id === fData.id ? " chosen_vuoro" : ""}
            ${fData.vuoro.id === (menuTarget ? menuTarget.vuoro.id : null) ? " menu_vuoro" : ""}
            ${fData.vuoro.note ? "hasNote" : ""}
            `}
        onClick={() => setChosen(fData)}
        onDoubleClick={onDoubleClick}
        onContextMenu={onRightClick}
        onDragStart={onDragStart}
        title={`${fData.nimi}\nklo ${fData.vuoro.aika}-${fData.vuoro.aika + 1}, ${fData.vuoro.nimi}${fData.vuoro.note ? `\n${fData.vuoro.note}` : ""}`}
        draggable
    >
        {data.lyhenne}
    </span>
}