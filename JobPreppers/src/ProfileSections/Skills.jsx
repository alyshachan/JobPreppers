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
  const [skillsTest, setSkillsTest] = useState({});
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
          `http://localhost:5000/api/UserSkills/${user.userID}`,
          {
            credentials: "include", // include cookies
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("API Response: ", data);

          if (data) {
            let newSkillsTest = {};
            for (var userSkillID in data) {
              var skills = data[userSkillID];

              if (!newSkillsTest[skills.category]) {
                newSkillsTest[skills.category] = [skills.name];
              } else {
                newSkillsTest[skills.category].push(skills.name);
              }
            }
            setSkillsTest((prevState) => {
              if (JSON.stringify(prevState) !== JSON.stringify(newSkillsTest)) {
                return newSkillsTest;
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

  // Fetch user data on user change (only runs if user is not null)
  useEffect(() => {
    if (!user) return; // Return early if no user exists

    const fetchUser = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/GetUser/${user.userID}`,
          {
            credentials: "include", // include cookies
          }
        );

        if (res.ok) {
          const data = await res.json();
          console.log("GetUser: ", data);
          setInitialUser(data);
        } else {
          console.error("Failed to fetch User");
        }
      } catch (error) {
        console.error("Error fetching User:", error);
      }
    };

    fetchUser(); // fetch user data when user changes
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
            {Object.entries(skillsTest).map(([title, list], index) => (
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
