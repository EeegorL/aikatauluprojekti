import "./menu.css";

export default function Menu({chosen, setChosen}) {
    if(!chosen.id) return;

    return <div className="menu">{chosen.nimi} | {chosen.vuoro}</div>
}