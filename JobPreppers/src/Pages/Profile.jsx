import EducationSection from "../ProfileSections/EducationSection";
import SkillsSection from "../ProfileSections/SkillsSection";
import ExperienceSection from "../ProfileSections/ExperienceSection";
import { useAuth } from "../provider/authProvider";
import React, {useEffect } from 'react';

function Profile() {

  const {user, setAuthData } = useAuth(); // custom hook for authprovider

  const skills = {
    "Programming Languages": ["Python", "Java", "C", "C++", "C#"],
    "Machine Learning & Data Analysis": [
      "Data Analysis",
      "PyTorch",
      "Scikit-learn (SkLearn)",
    ],
    "Software Tools": ["Git", "Docker", "MySQL", "Linux", "Figma"],
    "Robotics & Engineering": [
      "Robotics",
      "Electrical Engineering",
      "Network Systems",
      "Computer Systems",
    ],
    "Additional Skills": ["React", "Node.js", "TypeScript", "HTML/CSS"],
  };
  
  useEffect(() => {
    const requestSkills = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/UserSkills/${user.userID}`, {
          credentials: "include", // include cookies
        });

        if (response.ok) {
          const data = await response.json();
          if (data) {
            console.log("User skill response received!!")
            console.log(data)
            };
          }
        }
       catch (error) {
        console.log("In")
        console.log(error)
      }
    };

    requestSkills(); // Invoke the function
  }); // Add dependencies

  if (user == null) {
    return <div>Loading...</div>;
  }
  
  return (
    <>
      <div className="content !mt-[175px]">
        <div className="main-panel !flex-row gap-[50px]">
          <div className="main-personal">
            <div className="circle">
              <img className="rounded-full"/>
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
            <SkillsSection skillsDict={skills} />
            <ExperienceSection />
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
