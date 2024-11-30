import logo from "./logo.svg";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "./App.css";

import NavBar from "./Components/NavBar";
import { Route, Routes } from "react-router-dom";
import Jobs from "./Pages/Jobs";
import Jobs from "./Pages/Jobs";
import Profile from "./Pages/Profile";
import Resume from "./Pages/Resume";
import Interview from "./Pages/Interview";
import Login from "./Pages/Login";


function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Profile />} />
        <Route path="/Login" element={<Login/>}/>
        <Route path="/Profile" element={<Profile/>}/>
        <Route path="/Jobs" element={<Jobs />} />
        <Route path="/Interview" element={<Interview />} />
        <Route path="/Resume" element={<Resume />} />
      </Routes>
    </>
  );
}

export default App;
