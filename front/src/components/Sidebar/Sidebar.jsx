import { useEffect, useState } from "react";
import { getIhmiset } from "../../dbHandler/dbHandler";
import "./sidebar.css";
import PersonPick from "./PersonPick/PersonPick";

export default function Sidebar({chosen, setChosen}) {
    const [people, setPeople] = useState([]);
    const [filter, setFilter] = useState("");

    const filteredPeople = people.filter(x => x.nimi.toLowerCase().includes(filter.toLowerCase()));

    useEffect(() => {
        (async () => {
            setPeople(await getIhmiset());
        })();
    }, []);

    return <div className="sidebar">
        <div className="sidebarFilter">
            <label htmlFor="filter">Suodata:</label>
            <input name="filter" onChange={(e)=>setFilter(e.target.value)}/>
        </div>  
        <ul className="peopleList">
            {filteredPeople.map(p => {
                return <PersonPick key={`personPick_${p.henkilo}`} henkilo={p} chosen={chosen} setChosen={setChosen}/>
            })}
        </ul>
    </div>;
}