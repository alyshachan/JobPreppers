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
  const { initialUser, setIntialUser } = useState(null);
  const [educationDict, setEducationDict] = useState([]);
  const [skillsDict, setSkillsDict] = useState({});
  const [experienceDict, setExperienceDict] = useState([]);
  const [projectDict, setProjectDict] = useState([]);

  useEffect(() => {
    const requestEducation = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/UserEducation/${user.userID}`,
          {
            credentials: "include", // include cookies
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("API Response: ", data); // Log the response to verify the structure

          if (data) {
            const newEducationDict = data.map((education) => ({
              school_name: education.schoolName,
              degree_name: education.degreeName,
              study_name: education.studyName,
              start_date:
                education.startDate == null
                  ? null
                  : new Date(education.startDate),
              end_date:
                education.endDate == null ? null : new Date(education.endDate),
              description: education.description,
            }));

            setEducationDict((prevState) => {
              if (
                JSON.stringify(prevState) !== JSON.stringify(newEducationDict)
              ) {
                return newEducationDict;
              }
              return prevState;
            });
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
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
    const requestExperience = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/UserExperience/${user.userID}`,
          {
            credentials: "include", // include cookies
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("API Response: ", data); // Log the response to verify the structure

          if (data) {
            const newExperienceDict = data.map((experience) => ({
              work_name: experience.workName,
              location: experience.workLocation,
              job_title: experience.jobTitle,
              start_date:
                experience.startDate == null
                  ? null
                  : new Date(experience.startDate),
              end_date:
                experience.endDate == null
                  ? null
                  : new Date(experience.endDate),
              description: experience.description,
            }));

            setExperienceDict((prevState) => {
              if (
                JSON.stringify(prevState) !== JSON.stringify(newExperienceDict)
              ) {
                return newExperienceDict;
              }
              return prevState;
            });
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    const requestProjects = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/UserProject/${user.userID}`,
          {
            credentials: "include", // include cookies
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("API Response: ", data); // Log the response to verify the structure

          if (data) {
            const newProjectDict = data.map((project) => ({
              project_title: project.projectTitle,
              description: project.description,
            }));

            setProjectDict((prevState) => {
              if (
                JSON.stringify(prevState) !== JSON.stringify(newProjectDict)
              ) {
                return newProjectDict;
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
      requestEducation(); // populate education
      requestSkills(); // populate skills
      requestExperience(); // populate experience
      requestProjects(); // populate projects
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
            {Object.keys(educationDict).length > 0 && (
              <EducationSection educationDict={educationDict} edit={edit} />
            )}
            {Object.keys(skillsDict).length > 0 && (
              <SkillsSection skillsDict={skillsDict} edit={edit} />
            )}
          </div>
        </div>

        {Object.keys(experienceDict).length > 0 && (
          <ExperienceSection experienceDict={experienceDict} edit={edit} />
        )}

        {Object.keys(projectDict).length > 0 && (
          <ProjectSection projectDict={projectDict} edit={edit} />
        )}

        {edit && (
          <button className={styles.addNewSection}>Add new section</button>
        )}
      </div>
    </>
  );
}

export default Profile;
