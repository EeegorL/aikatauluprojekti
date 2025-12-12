export default function PersonPick({henkilo, chosen, setChosen}) {
    const fData = {
        id: henkilo.henkilo,
        nimi: henkilo.nimi,
        lyhenne: henkilo.lyhenne,
        vuoro: null
    }

    const onDragStart = (e) => {
        e.dataTransfer.setData("application/json", JSON.stringify(fData));
    }

    return <li 
        className={`peopleListItem ${chosen.id === fData.id ? "chosen_sidebar" : ""}`}
        person={fData.id}
        onClick={() => setChosen(fData)}
        onDragStart={onDragStart}
        draggable>
            <b>{fData.lyhenne}</b> {fData.nimi}
        </li>
}