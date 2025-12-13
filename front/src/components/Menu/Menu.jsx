import "./menu.css";
import {dateToStr} from "../../utils";

export default function Menu({menuTarget}) {
    if(!menuTarget) {
        return <div className="menu">...</div>
    }

    return <div className="menu">
        <div>
            <div>{menuTarget.nimi}, {menuTarget.vuoro.nimi}</div>
            <div>{menuTarget.vuoro.aika}:00 - {menuTarget.vuoro.aika + 1}:00</div>
            <div>{dateToStr(new Date(menuTarget.vuoro.pv), true)}</div>
        </div>
        <div>
            <textarea
                contentEditable
                className="menuNoteArea"
                placeholder="voit kirjoittaa tähän lisätietoa vuorosta"
                value={menuTarget.vuoro.note}/>
        </div>
    </div>
}