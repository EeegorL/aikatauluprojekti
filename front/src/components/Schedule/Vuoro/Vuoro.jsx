import {useRef} from "react";

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
    
    const clone = useRef(null);

    const onDoubleClick = (e) => {
        e.stopPropagation();
    }

    const onRightClick = (e) => {
        e.preventDefault();
        
        setMenuTarget(fData);
    }

    const onDragStart = (e) => {
        setMenuTarget(null);
        e.dataTransfer.setData("application/json", JSON.stringify(fData));
        e.dataTransfer.setDragImage(new Image(0, 0), 0, 0);

        const _clone = document.createElement("span");
        _clone.innerHTML = fData.lyhenne;

        _clone.classList.add("vuoro", "ghost");
        _clone.style.position = "absolute";
        document.body.appendChild(_clone);

        clone.current = _clone
    }

    const onDrag = (e) => {
        clone.current.style.top = `${e.pageY - 30}px`;
        clone.current.style.left = `${e.pageX - 10}px`;
    } 

    const onDragEnd = (e) => {
        clone.current.remove();
        clone.current = null;
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
        onDrag={onDrag}
        onDragEnd={onDragEnd}

        title={`${fData.nimi}\nklo ${fData.vuoro.aika}-${fData.vuoro.aika + 1}, ${fData.vuoro.nimi}${fData.vuoro.note ? `\n------------\n${fData.vuoro.note}` : ""}`}
        draggable
    >
        {data.lyhenne}
    </span>
}