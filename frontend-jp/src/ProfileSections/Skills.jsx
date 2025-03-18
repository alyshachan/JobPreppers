import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import React, { useState, useEffect, useRef } from "react";
import ListBox from "./ListBox";
import "../Components/JobPreppers.css"
import styles from "../Components/Profile/ProfileSections.module.css"
import { useAuth } from "../provider/authProvider";

function Skills() {
  const { user, setAuthData } = useAuth(); // custom hook for authprovider

  // Declare hooks unconditionally at the top level
  const [initialUser, setInitialUser] = useState(null);
  const [skillsDict, setSkillsDict] = useState({});
  const [isNarrow, setIsNarrow] = useState(false);
  const containerRef = useRef(null);

  // Handle window resize (this effect is always called, even if user is null)
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setIsNarrow(containerRef.current.offsetWidth < 750);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // initial check on load

    return () => window.removeEventListener("resize", handleResize);
  }, []); // Only set up the event listener once on mount

  // Fetch skills on user change (only runs if user is not null)
  useEffect(() => {
    if (!user) return; // Return early if no user exists

    const requestSkills = async () => {
      try {
        const response = await fetch(
          `https://jobpreppers.co:5000/api/UserSkills/${user.userID}`,
          {
            credentials: "include", // include cookies
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("API Response: ", data);

          if (data) {
            let newSkillsDict = {};
            for (var userSkillID in data) {
              var skills = data[userSkillID];

              if (!newSkillsDict[skills.category]) {
                newSkillsDict[skills.category] = [skills.name];
              } else {
                newSkillsDict[skills.category].push(skills.name);
              }
            }
            setSkillsDict((prevState) => {
              if (JSON.stringify(prevState) !== JSON.stringify(newSkillsDict)) {
                return newSkillsDict;
              }
              return prevState;
            });
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    requestSkills(); // fetch skills when user changes
  }, [user]); // Only re-run when user changes

  // Display loading state until user is available
  if (user == null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="content">
      <div className="panelTransparent">
        <a href="/Profile" className="text-[#0D7944] hover:underline mb-8">
          <ArrowBackIcon /> Go back to Profile Page
        </a>
        <h1>Skills</h1>
        <div className={styles.sectionContent}>
          <div className={`${styles.skills} ${styles.skillsNarrow} place-items-center`}>
            {Object.entries(skillsDict).map(([title, list], index) => (
              <ListBox
                key={index}
                title={title}
                list={list}
                sliceItems={false}
                showAllItems={true}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Skills;
