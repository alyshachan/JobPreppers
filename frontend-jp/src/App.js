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
  console.log("NavBar:", NavBar);
  console.log("Messaging:", Messaging);
  console.log("Feed:", Feed);
  console.log("Jobs:", Jobs);
  console.log("Profile:", Profile);
  console.log("Resume:", Resume);
  console.log("Interview:", Interview);
  console.log("Login:", Login);
  console.log("Signup:", Signup);
  console.log("Education:", Education);
  console.log("Experience:", Experience);
  console.log("Project:", Project);
  console.log("Skills:", Skills);
  console.log("VideoCall:", VideoCall);
  console.log("AuthProvider:", AuthProvider);
  // console.log("ConnectionProvider:", ConnectionProvider);

  //End Point: 107.23.196.38

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

            <Route path="/Education" element={<Education />} />
            <Route path="/Experience" element={<Experience />} />
            <Route path="/Project" element={<Project />} />
            <Route path="/Skills" element={<Skills />} />
            <Route path="/VideoCall" element={<VideoCall />} />
          <Route path="/Friends" element={<Friends />} />
          <Route path="/ParseResume" element={<ParseResume/>}/>
        </Routes>
        {!useLocation().pathname.includes("/VideoCall") && <Messaging />}
      </AuthProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;