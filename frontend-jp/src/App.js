import logo from "./logo.svg";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import NavBar from "./Components/NavBar";
import Messaging from "./Components/Messaging"
import { Route, Routes } from "react-router-dom";
import Feed from "./Pages/Feed";
import Jobs from "./Pages/Jobs";
import Profile from "./Pages/Profile";
import Resume from "./Pages/Resume";
import Interview from "./Pages/Interview";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Education from "./ProfileSections/Education";
import Experience from "./ProfileSections/Experience";
import Project from "./ProfileSections/Project";
import Skills from "./ProfileSections/Skills";
import { AuthProvider } from "./provider/authProvider";
import { ConnectionProvider } from "./provider/connectionProvider";


function App() {
  return (
    <>
      <AuthProvider>
        <ConnectionProvider>
          <NavBar />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Signup" element={<Signup />} />

            <Route path="/Profile" element={<Profile />} />
            <Route path="/Feed" element={
              <div>
                <Feed />
                <Messaging />
                </div>} />
                <Route path="/Jobs" element={<Jobs />} />
                <Route path="/Interview" element={<Interview />} />
                <Route path="/Resume" element={<Resume />} />

                <Route path="/Education" element={<Education />} />
                <Route path="/Experience" element={<Experience />} />
                <Route path="/Project" element={<Project />} />
                <Route path="/Skills" element={<Skills />} />
              </Routes>
        </ConnectionProvider>
      </AuthProvider>
    </>
  );
}

export default App;
