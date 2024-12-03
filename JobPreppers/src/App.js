import logo from "./logo.svg";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "./App.css";

import NavBar from "./Components/NavBar";
import { Route, Routes } from "react-router-dom";
import Jobs from "./Pages/Jobs";
import Profile from "./Pages/Profile";
import Resume from "./Pages/Resume";
import Interview from "./Pages/Interview";
import Login from "./Pages/Login";
import { AuthProvider } from "./provider/authProvider";


function App() {
  const firstName = "Goku"
  const lastName = "Son"
  const pfp = "https://pbs.twimg.com/profile_images/1366466342354751491/JyhZpbtu_400x400.jpg"
  return (
    <>
      <AuthProvider>
        <NavBar firstName={firstName} lastName={lastName} profilePicture={pfp}/>
        <Routes>
          <Route path="/" element={<Profile firstName={firstName} lastName={lastName} profilePicture={pfp}/>} />
          <Route path="/Login" element={<Login/>}/>
          <Route path="/Profile" element={<Profile firstName={firstName} lastName={lastName} profilePicture={pfp}/>}/>
          <Route path="/Jobs" element={<Jobs />} />
          <Route path="/Interview" element={<Interview />} />
          <Route path="/Resume" element={<Resume />} />
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
