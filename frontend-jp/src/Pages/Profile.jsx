import EducationSection from "../ProfileSections/EducationSection";
import SkillsSection from "../ProfileSections/SkillsSection";
import ExperienceSection from "../ProfileSections/ExperienceSection";
import ProjectSection from "../ProfileSections/ProjectSection";
import defaultProfilePicture from "../Components/defaultProfilePicture.png"
import { useAuth } from "../provider/authProvider";
import React, { useEffect, useState, useRef } from 'react';
import * as signalR from '@microsoft/signalr';

function Profile() {

  const { user, setAuthData } = useAuth(); // custom hook for authprovider
  const {initialUser, setIntialUser} = useState(null);
  const [message, setMessage] = useState("");
  const [receiverID, setReceiverID] = useState("");
  const [signalRConnection, setSignalRConnection] = useState(null);

  // const skillsTest = {}

  const [skillsTest, setSkillsTest] = useState({});
  // test message box handler


  useEffect(() => {
    const requestSkills = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/UserSkills/${user.userID}`, {
          credentials: "include", // include cookies
        });

        if (response.ok) {
          const data = await response.json();
          console.log("API Response: ", data);  // Log the response to verify the structure

          if (data) {
            let newSkillsTest = {}
            for (var userSkillID in data) {

              var skills = data[userSkillID]


              if (!newSkillsTest[skills.category]) {
                newSkillsTest[skills.category] = [skills.name]
              }
              else {
                newSkillsTest[skills.category].push(skills.name)
              }
            }
            setSkillsTest(prevState => {
              if (JSON.stringify(prevState) !== JSON.stringify(newSkillsTest)) {
                return newSkillsTest;
              }
              return prevState;
            });
          }
        };

      }
      catch (error) {
        console.log(error)
      }
    };

    if (user) {
      requestSkills(); // populate skills
      console.log("User: ", user)
    }
  }, [user]);  // only populate when user exists


  if (user == null) {
    return <div>Loading...</div>;
  }


  const userPic = (user.profile_pic == null) ? defaultProfilePicture : "data:image/png;base64," + user.profile_pic.toString().toString('base64');

  return (
    <>
      <div className="content !mt-[175px]">
        <div className="main-panel !flex-row gap-[50px]">
          <div className="main-personal">
            <img className="circle !bg-transparent" alt="Profile Picture" src={userPic}/>
            <p className="name">
              {user.first_name} {user.last_name}
            </p>
            <p>Computer Science Student at the University of Utah</p>
            <p className="section-element-subtitle">
              Salt Lake City, UT
              <br /> United States
            </p>
          </div>

          <div className="main-professional">
            <EducationSection />
            <SkillsSection skillsDict={skillsTest} />
          </div>
        </div>

        <div className="main-panel">
          <ExperienceSection />
        </div>

        <div className="main-panel">
          <ProjectSection />
        </div>

      </div>
    </>
  );
}

export default Profile;
