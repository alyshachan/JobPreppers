import EducationSection from "../ProfileSections/EducationSection";
import SkillsSection from "../ProfileSections/SkillsSection";
import ExperienceSection from "../ProfileSections/ExperienceSection";
import ProjectSection from "../ProfileSections/ProjectSection";
import defaultProfilePicture from "../Components/defaultProfilePicture.png";
import { useAuth } from "../provider/authProvider";
import React, { useEffect, useState } from "react";
import "../Components/JobPreppers.css";
import styles from "../Components/Profile/Profile.module.css";

function Profile({ edit = false }) {
  const { user, setAuthData } = useAuth(); // custom hook for authprovider
  const { initialUser, setIntialUser } = useState(null); // !mt-[175px]
  const [skillsDict, setSkillsDict] = useState({});

  useEffect(() => {
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
          console.log("API Response: ", data); // Log the response to verify the structure

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

    if (user) {
      requestSkills(); // populate skills
      console.log("User: ", user);
    }
  }, [user]); // only populate when user exists

  useEffect(() => {
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

  const userPic =
    user.profile_pic == null
      ? defaultProfilePicture
      : "data:image/png;base64," +
        user.profile_pic.toString().toString("base64");

  const testEduDict = [
    {
      school_name: "University of Swag",
      degree_name: "Bachelor's of Arts",
      study_name: "Swag Science",
      start_date: new Date(2024, 10, 1),
      end_date: new Date(2024, 5, 1),
    },
    {
      school_name: "University of Utah",
      degree_name: "Bachelor's of Science",
      study_name: "Computer Science",
      start_date: new Date(2021, 8, 1),
      end_date: new Date(2025, 5, 1),
    },
    {
      school_name: "Georgia Tech",
      degree_name: "Master's of Science",
      study_name: "Computer Science",
      start_date: new Date(2023, 9, 1),
      end_date: new Date(2025, 4, 1),
    },
  ];

  const testExpDict = [
    {
      work_name: "test work place",
      location: "Antarctica",
      job_title: "CEO",
      start_date: new Date(2020, 2, 14),
      end_date: new Date(),
      description: "i love working",
    },
  ];

  return (
    <>
      <div className="content !mt-[175px]">
        <div className="panel !flex-row gap-[50px]">
          <div className={styles.personalInfo}>
            <img
              className="profilePicture"
              alt="Profile Picture"
              src={userPic}
            />
            <p className={styles.name}>
              {user.first_name} {user.last_name}
            </p>
            <p>Computer Science Student at the University of Utah</p>
            <p className="subtitle">
              Salt Lake City, UT
              <br />
              United States
            </p>
          </div>

          <div className={styles.pinnedInfo}>
            {Object.keys(testEduDict).length > 0 && (
              <EducationSection educationDict={testEduDict} edit={edit} />
            )}
            {Object.keys(skillsDict).length > 0 && (
              <SkillsSection skillsDict={skillsDict} edit={edit} />
            )}
          </div>
        </div>

        <div className="panel">
          {Object.keys(testExpDict).length > 0 && (
            <ExperienceSection experienceDict={testExpDict} edit={edit} />
          )}
        </div>

        <div className="panel">
          <ProjectSection edit={edit} />
        </div>

        {edit && <a className={styles.addNewSection}>Add new section</a>}
      </div>
    </>
  );
}

export default Profile;
