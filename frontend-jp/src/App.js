import logo from "./logo.svg";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import NavBar from "./Components/NavBar";
import Messaging from "./Components/Messaging"
import { Route, Routes, useLocation } from "react-router-dom";
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
import VideoCall from "./Components/Interview/VideoCall";
import Friends from "./ProfileSections/Friends"
import { AuthProvider } from "./provider/authProvider";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import ManageJobs from "./Pages/ManageJobs";
import BookmarkedJobs from "./Pages/BookmarkedJobs"; 
import ParseResume from "./Pages/ParseResume";
import WebPresence from "./Pages/WebPresence"
const queryClient = new QueryClient();


function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
      <AuthProvider>
      {!useLocation().pathname.includes("/VideoCall") && <NavBar />}
          <Routes>
            <Route path="/" element={<WebPresence />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Signup" element={<Signup />} />

            <Route path="/Profile/:username" element={<Profile />} />
            
            <Route path="/Feed" element={
              <div>
                <Feed />
                {/* <Messaging /> */}
              </div>} />
            <Route path="/Jobs" element={<Jobs />} />
            <Route path="/Jobs/ManageJobs" element={<ManageJobs/>}/>
            <Route path="/Jobs/BookmarkedJobs" element={<BookmarkedJobs/>}/>
            <Route path="/Interview" element={<Interview />} />
            <Route path="/Resume" element={<Resume />} />

            <Route path="/Education/:username/" element={<Education />} />
            <Route path="/Experience/:username" element={<Experience />} />
            <Route path="/Project/:username" element={<Project />} />
            <Route path="/Skills/:username" element={<Skills />} />
            <Route path="/VideoCall" element={<VideoCall />} />
          <Route path="/Friends/:username" element={<Friends />} />
          <Route path="/ParseResume" element={<ParseResume/>}/>
        </Routes>
        {!useLocation().pathname.includes("/VideoCall") && <Messaging />}
      </AuthProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;