import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
// import InfoPage from './pages/InfoPage';
import { useState, createContext, useContext } from "react";

interface User {
  id: string | "";
  name: string | "";
  score: number | 0;
  durationInDays: number | 0;
  bugsCount: number | 0;
  madeDadeline: boolean | false;
}
interface Token {
  token?: string | "";
}

interface GlobalData {
  userData?: User | {};
  apiToken?: Token | {};
  inputValue?: string; 

  setAppGlobalData: React.Dispatch<React.SetStateAction<GlobalData>>;
}
const AppGlobalData = createContext({} as GlobalData);

function Home() {
  const { inputValue, setAppGlobalData } = useContext(AppGlobalData);
  const [input, setInput] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const updateInputValue = () => {
    setAppGlobalData((prevState) => ({
      ...prevState,
      inputValue: input,
    }));
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Home View</h2>
      
      <button onClick={updateInputValue}>Update Input Value</button>
    </div>
  );
}

function About() {
  const { inputValue } = useContext(AppGlobalData);

  return (
    <div style={{ padding: 20 }}>
      <h2>About View</h2>
      <p>Input Value from Home: {inputValue}</p>

      <p>Lorem ipsum dolor sit amet, consectetur adip.</p>
    </div>
  );
}
function App() {
  const [appGlobalData, setAppGlobalData] = useState({} as GlobalData);
  
  const updateContextValue = (newValue: GlobalData) => {
    setAppGlobalData(newValue);
  };

  const contextValue: GlobalData = {
    userData: appGlobalData.userData,
    apiToken: appGlobalData.apiToken,
    inputValue: appGlobalData.inputValue,

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
            path="/"
            element={<Home />}
          />
          <Route
            path="/login"
            element={<LoginPage />}
          />
          <Route
            path="/about"
            element={<About />}
          />
          {/* <Route path='/info' element={<Info />} /> */}
        </Routes>
      </AppGlobalData.Provider>
    </Router>
  );
}

export default App;
