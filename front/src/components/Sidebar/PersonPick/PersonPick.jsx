export default function PersonPick({henkilo, chosen, setChosen}) {
    return <li 
        className={`peopleListItem ${chosen.henkilo === henkilo.henkilo ? "chosen_sidebar" : ""}`}
        person={henkilo.henkilo}
        onClick={() => setChosen(henkilo)}
        draggable>
            <b>{henkilo.lyhenne}</b> {henkilo.nimi}
        </li>
}