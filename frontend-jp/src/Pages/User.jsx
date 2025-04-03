import React, { useEffect, useState } from "react";
import { useAuth } from "../provider/authProvider";
import { Button } from "@mui/material";

import EducationSection from "../ProfileSections/EducationSection";
import SkillsSection from "../ProfileSections/SkillsSection";
import ExperienceSection from "../ProfileSections/ExperienceSection";
import ProjectSection from "../ProfileSections/ProjectSection";
import defaultProfilePicture from "../Components/defaultProfilePicture.png";
import ProfileDescription from "../ProfileSections/ProfileDescription";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";
import styles from "../Components/Profile/Profile.module.css";
import "../Components/JobPreppers.css";

function User() {
  const { user, setAuthData } = useAuth(); // custom hook for authprovider
  const { initialUser, setIntialUser } = useState(null);
  const [edit, setEdit] = useState(() => {
    return localStorage.getItem("editMode") === "true";
  });
  const [educationDict, setEducationDict] = useState([]);
  const [skillsDict, setSkillsDict] = useState({});
  const [experienceDict, setExperienceDict] = useState([]);
  const [projectDict, setProjectDict] = useState([]);
  const [friendCount, setFriendCount] = useState(0);
  const [openDialog, setOpenDialog] = useState({
    education: false,
    skill: false,
    experience: false,
    project: false,
  });
  const [message, setMessage] = useState("");
  const [receiverID, setReceiverID] = useState("");
  const apiURL = process.env.REACT_APP_JP_API_URL;

  const toggleDialog = (type, state) => {
    setOpenDialog((prev) => ({ ...prev, [type]: state }));
  };

  // test message box handler

  useEffect(() => {
    localStorage.setItem("editMode", edit);
  }, [edit]);

  const fetchData = async (endpoint, setter, transform) => {
    try {
      const response = await fetch(apiURL + `/api/${endpoint}/${user.userID}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error(`Failed to fetch ${endpoint}`);
      const data = await response.json();
      setter((prevState) =>
        JSON.stringify(prevState) !== JSON.stringify(data)
          ? transform(data)
          : prevState
      );
    } catch (error) {
      console.error(error);
    }
  };

  const fetchEducation = async () => {
    fetchData("UserEducation", setEducationDict, (data) =>
      data.map(
        ({
          userEducationID,
          schoolName,
          degreeName,
          studyName,
          startDate,
          endDate,
          description,
        }) => ({
          userEducationID: userEducationID,
          school_name: schoolName,
          degree_name: degreeName,
          study_name: studyName,
          start_date: startDate ? new Date(startDate) : null,
          end_date: endDate ? new Date(endDate) : null,
          description,
        })
      )
    );
  };

  const fetchSkills = async () => {
    fetchData("UserSkills", setSkillsDict, (data) => {
      const skills = {};
      data.forEach(({ category, name, userSkillID }) => {
        if (!skills[category]) {
          skills[category] = [];
        }

        skills[category].push({ name, userSkillID });
      });
      return skills;
    });
  };

  const fetchExperience = async () => {
    fetchData("UserExperience", setExperienceDict, (data) =>
      data.map(
        ({
          userExperienceID,
          workName,
          workLocation,
          jobTitle,
          startDate,
          endDate,
          description,
        }) => ({
          userExperienceID: userExperienceID,
          work_name: workName,
          location: workLocation,
          job_title: jobTitle,
          start_date: startDate ? new Date(startDate) : null,
          end_date: endDate ? new Date(endDate) : null,
          description,
        })
      )
    );
  };

  const fetchProject = async () => {
    fetchData("UserProject", setProjectDict, (data) =>
      data.map(({ userProjectID, projectTitle, description }) => ({
        userProjectID: userProjectID,
        project_title: projectTitle,
        description,
      }))
    );
  };

  useEffect(() => {
    if (!user) return;

    fetchEducation();
    fetchSkills();
    fetchExperience();
    fetchProject();
  }, [user]);

  const fetchFriendCount = async () => {
    try {
      const response = await fetch(
        apiURL + `/api/Friend/GetFriends/${user.userID}`,
        {
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();

        if (Array.isArray(data)) {
          setFriendCount(data.length); // Count the number of friends
        } else {
          setFriendCount(0); // No friends found
        }
      } else {
        throw new Error("Failed to fetch friends list");
      }
    } catch (error) {
      console.error("Error fetching friend count:", error);
    }
  };
  fetchFriendCount();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(apiURL + `/api/GetUser/${user.userID}`, {
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

  return (
    <>
      <div className="panel !flex-row gap-[50px]">
        <ProfileDescription
          user={user}
          edit={edit}
          setEdit={setEdit}
          friendCount={friendCount}
        />
        {!edit &&
        educationDict.length === 0 &&
        skillsDict &&
        Object.keys(skillsDict).length === 0 &&
        experienceDict.length === 0 &&
        projectDict.length === 0 ? (
          <div className={styles.noProfileText}>
            {user.first_name} {user.last_name} hasn't added to their profile yet
          </div>
        ) : (
          <div className={styles.highlightedInfo}>
            {educationDict.length > 0 ? (
              <EducationSection
                educationDict={educationDict}
                edit={edit}
                onAdd={fetchEducation}
              />
            ) : (
              edit && (
                <button
                  className={styles.addNewSection}
                  onClick={() => toggleDialog("education", true)}
                >
                  Add Education section
                </button>
              )
            )}

            {Object.keys(skillsDict).length > 0 ? (
              <SkillsSection
                skillsDict={skillsDict}
                edit={edit}
                onAdd={fetchSkills}
              />
            ) : (
              edit && (
                <button
                  className={styles.addNewSection}
                  onClick={() => toggleDialog("skill", true)}
                >
                  Add Skills section
                </button>
              )
            )}
          </div>
        )}
      </div>

        {experienceDict.length > 0 ? (
          <ExperienceSection
            experienceDict={experienceDict}
            edit={edit}
            onAdd={fetchExperience}
          />
        ) : (
          edit && (
            <button
              className={styles.addNewSection}
              onClick={() => toggleDialog("experience", true)}
            >
              Add Experience section
            </button>
          )
        )}

        {projectDict.length > 0 ? (
          <ProjectSection
            projectDict={projectDict}
            edit={edit}
            onAdd={fetchProject}
          />
        ) : (
          edit && (
            <button
              className={styles.addNewSection}
              onClick={() => toggleDialog("project", true)}
            >
              Add Project section
            </button>
          )
        )}
    </>
  );
}

export default User;
