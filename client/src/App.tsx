import React, { useState, createContext } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import {User,PersonalDetails,GlobalData} from './Types';
import InfoPage from './pages/InfoPage';


export const AppGlobalData = createContext({} as GlobalData);

function App() {
  const [appGlobalData, setAppGlobalData] = useState({} as GlobalData);
  const [userData,setUserData] = useState<User | {}>();
  const [apiToken,setApiToken] = useState<string | ''>('');
  const [personalDetails, setPersonalDetails] = useState<PersonalDetails>({
    Team: "",
    avatar: "",
    name: "",
    joinedAt: "",
  });  

  const contextValue: GlobalData = {
    userData,
    apiToken,
    personalDetails,
    setApiToken,
    setUserData,
    setPersonalDetails,
    
    setAppGlobalData,
  };

  return (
    <Router>
      <AppGlobalData.Provider value={contextValue}>
        <nav >
          <Link to="/">Home</Link>
          <Link to="/login">Login</Link>
          <Link to="/about">About</Link>
        </nav>
        <Routes>
          <Route
            path="/login"
            element={<LoginPage />}
          />
          <Route path='/info' element={<InfoPage />} />
        </Routes>
      </AppGlobalData.Provider>
    </Router>
  );
}

export default App;
