import EducationSection from "../ProfileSections/EducationSection";
import SkillsSection from "../ProfileSections/SkillsSection";
import ExperienceSection from "../ProfileSections/ExperienceSection";
import ProjectSection from "../ProfileSections/ProjectSection";
import defaultProfilePicture from "../Components/defaultProfilePicture.png"
import { useAuth } from "../provider/authProvider";
import React, { useEffect, useState } from 'react';
import styles from "../Components/JobPreppers.module.css"
import profileStyles from "../Components/Profile/Profile.module.css"


function Profile({edit = false}) {

  const { user, setAuthData } = useAuth(); // custom hook for authprovider
  const {initialUser, setIntialUser} = useState(null); // !mt-[175px]
  const [skillsTest, setSkillsTest] = useState({});

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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/GetUser/${user.userID}`, {
          credentials: "include", // include cookies
        });

               
        if (res.ok) {
          const data = await res.json();
          console.log("GetUser: ", data);
          setIntialUser(data);
        } else {
          console.error("Failed to fetch User");
        }
      } catch (error) {
        console.error("Error fetching User:", error);
      }
    };

    fetchUser();
  }, [user]);

  if (user == null) {
    return <div>Loading...</div>;
  }

  const userPic = (user.profile_pic == null) ? defaultProfilePicture : "data:image/png;base64," + user.profile_pic.toString().toString('base64');

  return (
    <>
      <div className={`${styles.content} !mt-[175px]`}>
        <div className={`${styles.panel} !flex-row gap-[50px]`}>

          <div className={profileStyles.personalInfo}>
            <img className={styles.profilePicture} alt="Profile Picture" src={userPic}/>

            <p className={profileStyles.name}>
              {user.first_name} {user.last_name}
            </p>
            <p>Computer Science Student at the University of Utah</p>
            <p className={styles.subtitle}>
              Salt Lake City, UT
              <br /> United States
            </p>
          </div>

          <div className="main-professional">
            <EducationSection edit={edit}/>
            <SkillsSection skillsDict={skillsTest} edit={edit}/>
          </div>
        </div>

        <div className="main-panel">
          <ExperienceSection edit={edit}/>
        </div>

        <div className="main-panel">
          <ProjectSection edit={edit}/>
        </div>

        <a>
          <button className="main-panel !shadow-none border-dashed border-2 border-[#4ba173] text-center text-[#4ba173] font-bold text-2xl">
          Add new section
          </button>
        </a>

      </div>
    </>
  );
}

export default Profile;
