import "./menu.css";
import {dateToStr} from "../../utils";
import {deleteVuoro, updateNote} from "../../dbHandler/dbHandler";
import { useState } from "react";

export default function Menu({updateVuorot, menuTarget, setMenuTarget }) {
    if(!menuTarget) {
        return <div className="menu hidden">...</div>
    }

    const [note, setNote] = useState(menuTarget.vuoro.note ?? "");

    const onClickDelete = async () => {
        await deleteVuoro(menuTarget.vuoro.id);
        await updateVuorot(menuTarget.vuoro.pv);
        setMenuTarget(null);
    }

    const onClickSave = async () => {
        const id = menuTarget.vuoro.id;
        await updateNote(id, note);
        await updateVuorot(menuTarget.vuoro.pv);
    }

    const onChange = (e) => {
        setNote(e.target.value);
    }

    return <div className={`menu`}>
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
        <div className="menu_buttonGrid">
            <button onClick={onClickSave} className="menu_saveNote">Tallenna</button>
            <button onClick={onClickDelete} className="menu_deleteVuoro">Poista vuoro</button>
            <button onClick={()=>setMenuTarget(null)}>Sulje</button>
        </div>
    </div>
}