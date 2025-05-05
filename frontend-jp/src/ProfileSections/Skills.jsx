import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import React, { useState, useEffect, useRef } from "react";
import ListBox from "./ListBox";
import "../Components/JobPreppers.css";
import styles from "../Components/Profile/ProfileSections.module.css";
import { useAuth } from "../provider/authProvider";
import { useParams } from "react-router-dom";

const apiURL = process.env.REACT_APP_JP_API_URL;

function Skills() {
  const { username } = useParams();
  const [visitingUser, setUser] = useState(null);
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

  
      useEffect(() => {
        const fetchUser = async () => {
          try {
            const response = await fetch(
              apiURL + `/api/Users/GetUserFromUsername/${username}`,
              { credentials: "include" }
            );
    
            if (response.ok) {
              const data = await response.json();
              setUser(data);
              setSkillsDict([]);
            } else {
              throw new Error("Failed to fetch user");
            }
          } catch (error) {
            console.error("Error fetching user:", error);
          }
        };
    
        fetchUser();
      }, [username, apiURL]);

  // Fetch skills on user change (only runs if user is not null)
  useEffect(() => {
    if (!visitingUser) return; // Return early if no user exists

    const requestSkills = async () => {
      try {
        const response = await fetch(
          apiURL + `/api/UserSkills/${visitingUser.userID}`,
          {
            credentials: "include", // include cookies
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data) {
            let newSkillsDict = {};
            for (var userSkillID in data) {
              var skill = data[userSkillID];
            
              const skillObj = {
                name: skill.name,
                userSkillID: skill.userSkillID,
              };
            
              if (!newSkillsDict[skill.category]) {
                newSkillsDict[skill.category] = [skillObj];
              } else {
                newSkillsDict[skill.category].push(skillObj);
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
  }, [visitingUser]); // Only re-run when user changes

  // Display loading state until user is available
  if (visitingUser == null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="content">
      <div className="panelTransparent">
        <a href={`/Profile/${visitingUser.username}`} className="text-[var(--jp-border)] hover:underline mb-8">
          <ArrowBackIcon /> Go back to Profile Page
        </a>
        <h1>Skills</h1>
        <div className={styles.sectionContent}>
          <div
            className={`${styles.skills} ${styles.skillsNarrow} place-items-center`}
          >
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
