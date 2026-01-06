import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import { useEffect, useState } from "react";

import { checkSession } from "./dbHandler/dbHandler";

import "./App.css";

import Day from "./views/DayView/Day";
import Week from "./views/WeekView/Week";
import Header from "./components/Header/Header";
import { connTest } from "./dbHandler/dbHandler";
import FrontPage from "./views/FrontPage/FrontPage";
import Info from "./views/Info/Info";
import Login from "./views/Login/Login";

const isLoggedIn = true;

function App() {
  const [done, setDone] = useState(false);
  const [backendDown, setBackendDown] = useState(false);

  useEffect(() => {
    (async () => {
      if(!await connTest()) setBackendDown(true);
      setDone(true);
    })();
  }, []);

  if(done) {
    
    if(!checkSession()) return <Login/>; // todo
    if(backendDown) return <div>Shit on alhaal sori bro</div>;

    return (
      <BrowserRouter>
      <div className="main">
        <Header/>
        <Routes>
          <Route path="/" element={<FrontPage/>}/>
          <Route path="info" element={<Info/>}/>
          <Route path="/pv/:day" element={<Day/>}/>
          <Route path="/vk/:day" element={<Week/>}/>
          <Route path="*" element={<Navigate to={`/`} replace/>}/>
        </Routes>
      </div>
      </BrowserRouter>
    );
  }
  else return <div>...</div>;
}


export default App;