import "./menu.css";

export default function Menu({menuTarget, setMenuTarget}) {
    if(!menuTarget) {
        return <div className="menu">...</div>
    }
    console.log(menuTarget)
    return <div className="menu">
        <div>
            <span>{menuTarget.nimi}, {menuTarget.vuoro.nimi}</span>
        </div>
    </div>
}