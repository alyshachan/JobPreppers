import EducationSection from "../ProfileSections/EducationSection";
import SkillsSection from "../ProfileSections/SkillsSection";
import ExperienceSection from "../ProfileSections/ExperienceSection";
import { useAuth } from "../provider/authProvider";
import React, { useEffect, useState } from 'react';
import { Buffer } from 'buffer';

function Profile() {

  const { user, setAuthData } = useAuth(); // custom hook for authprovider
  const {initialUser, setIntialUser} = useState(null);

  // const skillsTest = {}

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

  return (
    <>
      <div className="content !mt-[175px]">
        <div className="main-panel !flex-row gap-[50px]">
          <div className="main-personal">
            <img className="circle !bg-transparent" alt="Profile Picture" src={"data:image/png;base64," + user.profile_pic.toString().toString('base64')}/>
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
            <ExperienceSection />
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
