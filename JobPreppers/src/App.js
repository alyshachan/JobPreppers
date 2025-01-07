import logo from "./logo.svg";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "./App.css";

import NavBar from "./Components/NavBar";
import { Route, Routes } from "react-router-dom";
import Feed from "./Pages/Feed";
import Jobs from "./Pages/Jobs";
import Profile from "./Pages/Profile";
import Resume from "./Pages/Resume";
import Interview from "./Pages/Interview";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Skills from "./ProfileSections/Skills";
import { AuthProvider } from "./provider/authProvider";

function App() {
  return (
    <>
      <AuthProvider>
        <NavBar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/Feed" element={<Feed />} />
          <Route path="/Jobs" element={<Jobs />} />
          <Route path="/Interview" element={<Interview />} />
          <Route path="/Resume" element={<Resume />} />

          <Route path="/EditProfile" element={<Profile edit={true}/>} />
          <Route path="/Skills" element={<Skills />} />
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
