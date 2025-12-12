import "./vuoro.css";

import { dateToStr } from "../../../utils";

export default function Vuoro({data, chosen, setChosen, setMenuTarget}) {
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
        e.dataTransfer.setData("application/json", JSON.stringify(fData));
    }

    return <span 
        className={`vuoro ${chosen.id === fData.id ? "chosen_vuoro" : ""}`}
        onClick={() => setChosen(fData)}
        onDoubleClick={onDoubleClick}
        onContextMenu={onRightClick}
        onDragStart={onDragStart}
        draggable
    >
        {data.lyhenne}
    </span>
}