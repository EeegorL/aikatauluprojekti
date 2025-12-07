import "./vuoro.css";

export default function Vuoro({data, chosen, setChosen}) {
    const onDoubleClick = (e) => {
        e.stopPropagation();
    }

    return <span 
        className={`vuoro ${chosen.henkilo === data.henkilo ? "chosen_vuoro" : ""}`}
        onClick={() => setChosen(data)}
        onDoubleClick={onDoubleClick}
        draggable
    >
        {data.lyhenne}
    </span>
}