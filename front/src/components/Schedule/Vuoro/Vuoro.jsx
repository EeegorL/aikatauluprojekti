import "./vuoro.css";

export default function Vuoro({data, chosen, setChosen, menuTarget, setMenuTarget}) {
    const fData = {
        id: data.henkilo,
        nimi: data.nimi,
        lyhenne: data.lyhenne,
        vuoro: {
            id: data.id,
            pv: data.pv,
            aika: data.aika,
            tyyppi: data.vuoro,
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

    return <span 
        className={`vuoro ${chosen.id === fData.id ? "chosen_vuoro" : ""}`}
        onClick={() => setChosen(fData)}
        onDoubleClick={onDoubleClick}
        onContextMenu={onRightClick}
        draggable
    >
        {data.lyhenne}
    </span>
}