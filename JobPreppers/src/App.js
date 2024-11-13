import logo from "./logo.svg";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "./App.css";

import NavBar from "./NavBar";
import { Route, Routes } from "react-router-dom";
import Jobs from "./Pages/Jobs"
import Profile from "./Pages/Profile";
import Resume from "./Pages/Resume"
import Interview from "./Pages/Interview";


function App() {
  
  return (
    <>
    
      <NavBar />
      <div className="container">
      <Routes>
        <Route path="/" element={<Profile/>}/>
        <Route path="/Jobs" element={<Jobs/>}/>
        <Route path="/Interview" element={<Interview/>}/>
        <Route path="/Resume" element={<Resume/>}/>



      </Routes>
      </div>
    </>
  );
}

export default App;
