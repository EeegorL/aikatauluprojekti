import { useState } from "react";

export default function PersonPick({henkilo, chosen, setChosen}) {
    const fData = {
        id: henkilo.henkilo,
        nimi: henkilo.nimi,
        lyhenne: henkilo.lyhenne,
        vuoro: null
    }

    const [clone, setClone] = useState(null);

    const onDragStart = (e) => {
        e.dataTransfer.setData("application/json", JSON.stringify(fData));
        e.dataTransfer.setDragImage(new Image(0, 0), 0, 0);

        const _clone = document.createElement("span");
        _clone.innerHTML = fData.lyhenne;

        _clone.classList.add("vuoro");
        if(chosen.id === fData.id) _clone.classList.add("chosen_drag", "ghost");
        _clone.style.position = "absolute";
        document.body.appendChild(_clone);

        setClone(_clone);
    }

    const onDrag = (e) => {
        clone.style.top = `${e.pageY - 30}px`;
        clone.style.left = `${e.pageX - 10}px`;
    } 

    const onDragEnd = (e) => {
        clone.remove();
        setClone(null);
    }

    return <li 
        className={`peopleListItem ${chosen.id === fData.id ? "chosen_sidebar" : ""}`}
        person={fData.id}
        onClick={() => setChosen(fData)}
        onDragStart={onDragStart}
        onDrag={onDrag}
        onDragEnd={onDragEnd}
        draggable>
            <b>{fData.lyhenne}</b> {fData.nimi}
        </li>
}