import "./menu.css";
import {dateToStr} from "../../utils";
import {deleteVuoro} from "../../dbHandler/dbHandler";
import { useState } from "react";

export default function Menu({menuTarget, setMenuTarget}) {
    if(!menuTarget) {
        return <div className="menu">...</div>
    }

    const [note, setNote] = useState(menuTarget.vuoro.note ?? "");

    const onClickDelete = async() => {
        await deleteVuoro(menuTarget.vuoro.id);
        // TODO UI:sta elementin poisto
        setMenuTarget(null);
    }

    const onChange = (e) => {
        setNote(e.target.value);
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
                onChange={onChange}
                value={note}/>
        </div>
        <div>
            <button onClick={onClickDelete}>Poista vuoro</button>
        </div>
    </div>
}