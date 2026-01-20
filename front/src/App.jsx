import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";

import "./App.css";

import Day from "./views/DayView/Day";
import Week from "./views/WeekView/Week";
import Header from "./components/Header/Header";
import { connTest, getLoginData } from "./dbHandler/dbHandler";
import FrontPage from "./views/FrontPage/FrontPage";
import Info from "./views/Info/Info";
import Login from "./views/Login/Login";
import { LoginContext } from "./dbHandler/LoginContext";

function App() {
  const [done, setDone] = useState(false);
  const [backendDown, setBackendDown] = useState(false);
  const {user, updateLogin} = useContext(LoginContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      if(!await connTest()) setBackendDown(true);
      updateLogin(await getLoginData());
      setDone(true);
    })();
  }, []);

  useEffect(() => { // on navigation, check if login still valid
    (async () => {
      updateLogin(await getLoginData());
    })();
  }, [location]);

  useEffect(() => { // if user is not valid on user change, redirect to /login if not there yet

  }, [user]);

  if(done) {
    if(backendDown) return <div>Shit on alhaal sori bro</div>;
    return user 
      ? <div className="main">
          <Header/>
          <Routes>
            <Route path="/" element={<FrontPage/>}/>
            <Route path="/info" element={<Info/>}/>
            <Route path="/pv/:day" element={<Day/>}/>
            <Route path="/vk/:day" element={<Week/>}/>
            <Route path="*" element={<Navigate to={`/`} replace/>}/>
          </Routes>
        </div>
      : <Login/>
  }
  else return <div>...</div>;
}

export default App;