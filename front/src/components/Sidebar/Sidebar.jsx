import { useEffect, useState, useRef } from "react";
import { deleteVuoro, getIhmiset } from "../../dbHandler/dbHandler";
import "./sidebar.css";
import PersonPick from "./PersonPick/PersonPick";

export default function Sidebar({updateVuorot, vuorotyypit, chosen, setChosen, showPopup}) {
    const [people, setPeople] = useState([]);
    const [filter, setFilter] = useState("");

    const filteredPeople = filter.startsWith("/")
        ? [people[0]]
        : people.filter(x => x.nimi.toLowerCase().includes(filter.toLowerCase()));

    useEffect(() => {
        (async () => {
            setPeople(await getIhmiset());
        })();
    }, []);

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

    const isOnMobile = (window.screen.height / window.screen.width) > 1;

    const toggleSidebar = () => {
        console.log("dghfdghfghfgh")
    }


    return isOnMobile 
        // ?   <div className="sidebar" onDrop={onDrop} onDragOver={onDragOver}>
        //         <div className="sidebarFilter">
        //             <label htmlFor="filter">Suodata:</label>
        //             <input name="filter" onChange={(e)=>setFilter(e.target.value)}/>
        //         </div> 
        //         <ul className="peopleList">
        //             {filteredPeople.map(p => {
        //                 return <PersonPick key={`personPick_${p.henkilo}`} henkilo={p} chosen={chosen} setChosen={setChosen}/>
        //             })}
        //         </ul>
        //     </div>
        ? <div className="testi">
            <div className="scroll">
                {filteredPeople.map(p => {
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