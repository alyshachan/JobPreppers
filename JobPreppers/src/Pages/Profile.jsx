import EducationSection from "../ProfileSections/EducationSection";
import SkillsSection from "../ProfileSections/SkillsSection";
import ExperienceSection from "../ProfileSections/ExperienceSection";
import ProjectSection from "../ProfileSections/ProjectSection";
import { useAuth } from "../provider/authProvider";
import React, { useEffect, useState } from 'react';

function Profile() {

  const { user, setAuthData } = useAuth(); // custom hook for authprovider

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
      requestSkills();  // populate skills
    }
  }, [user]);  // only populate when user exists



  if (user == null) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="content !mt-[175px]">
        <div className="main-panel !flex-row gap-[50px]">
          <div className="main-personal">
            <div className="circle">
              <img className="rounded-full" />
            </div>
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
