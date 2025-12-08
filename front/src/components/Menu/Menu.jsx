import "./menu.css";

export default function Menu({menuTarget, setMenuTarget}) {
    if(!menuTarget) return;
    console.log(menuTarget)
    return <div className="menu">
        <p>{menuTarget.nimi}</p>
        <p>{menuTarget.vuoro.tyyppi}</p>
    </div>
}