import "./vuoro.css";

export default function Vuoro({data, chosen, setChosen}) {
    const fData = {
        id: data.henkilo,
        nimi: data.nimi,
        lyhenne: data.lyhenne,
        vuoro: {
            id: data.id,
            pv: data.pv,
            aika: data.aika,
            tyyppi: data.tyyppi,
            note: data.note
        }
    }

    const onDoubleClick = (e) => {
        e.stopPropagation();
    }

    return <span 
        className={`vuoro ${chosen.id === fData.id ? "chosen_vuoro" : ""}`}
        onClick={() => setChosen(fData)}
        onDoubleClick={onDoubleClick}
        draggable
    >
        {data.lyhenne}
    </span>
}