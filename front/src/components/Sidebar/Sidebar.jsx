import { useContext, useState, useEffect } from "react";
import { deleteVuoro, getIhmiset } from "../../dbHandler/dbHandler";
import "./sidebar.css";
import PersonPick from "./PersonPick/PersonPick";
import { GlobalContext } from "../../dbHandler/GlobalContext";

export default function Sidebar({updateVuorot, chosen, setChosen, showPopup}) {
    const context = useContext(GlobalContext);
    const [people, setPeople] = useState([]);
    const [filter, setFilter] = useState("");

    const mobileFilteredPeople = people.length > 0 ? people.filter(x => x.nimi.startsWith(filter)) : [];

    useEffect(() => {
        (async () => {
            setPeople(await getIhmiset() ?? []);
        })();
    }, []);

    const filteredPeople = people.length > 0 ? filter.startsWith("/")
            ? [people[0]]
            : people.filter(x => x.nimi.toLowerCase().includes(filter.toLowerCase()))
        : [];

    const onDragOver = (e) => {
        e.preventDefault();
    }

    const onDrop = async (e) => {
        const data = e.dataTransfer.getData("application/json");
        if(data === "") return;

        let jsonData;
        try {
            jsonData = JSON.parse(data);
        }
        catch(e) { // Invalid JSON, skip
            return;
        }

        if(jsonData.vuoro) {
            await deleteVuoro(jsonData.vuoro.id);
            showPopup("Vuoro poistettu", false);
            await updateVuorot(jsonData.vuoro.pv);
        }
    }

    const isOnMobile = window.screen.width <= 1000;

    return isOnMobile 
        ? <div className="mobileSidebar">
            <div className="mobileFilter">
                {
                    ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "Å", "Ä", "Ö"]
                    .map(x => <p className={`filterLetter ${filter === x ? "chosenFilterLetter" : ""}`} onClick={()=>filter === x ? setFilter("") : setFilter(x)} key={`filterLetter${x}`}>{x}</p>)
                }
            </div>
            <div className="peopleScroll">
                {mobileFilteredPeople.map(p => {
                    return <PersonPick key={`personPick_${p.henkilo}`} henkilo={p} chosen={chosen} setChosen={setChosen} />
                })}
            </div>
        </div>
        :   <div className="sidebar" onDrop={onDrop} onDragOver={onDragOver}>
                <div className="sidebarFilter">
                    <label htmlFor="filter">Suodata:</label>
                    <input name="filter" onChange={(e)=>setFilter(e.target.value)}/>
                </div>  
                <ul className="peopleList">
                    {filteredPeople.map(p => {
                        return <PersonPick key={`personPick_${p.henkilo}`} henkilo={p} chosen={chosen} setChosen={setChosen}/>
                    })}
                </ul>
            </div>
}