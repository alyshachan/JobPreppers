import React, { useEffect, useState } from "react";
import { useAuth } from "../provider/authProvider";
import { Button } from "@mui/material";

import EducationSection from "../ProfileSections/EducationSection";
import SkillsSection from "../ProfileSections/SkillsSection";
import ExperienceSection from "../ProfileSections/ExperienceSection";
import ProjectSection from "../ProfileSections/ProjectSection";
import defaultProfilePicture from "../Components/defaultProfilePicture.png";
import AddEducationDialog from "../Components/Profile/AddEducationDialog";
import AddSkillDialog from "../Components/Profile/AddSkillDialog";
import AddExperienceDialog from "../Components/Profile/AddExperienceDialog";
import AddProjectDialog from "../Components/Profile/AddProjectDialog";

import EditIcon from "@mui/icons-material/Edit";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";
import styles from "../Components/Profile/Profile.module.css";
import "../Components/JobPreppers.css";

function Profile() {
  const { user, setAuthData } = useAuth(); // custom hook for authprovider
  const { initialUser, setIntialUser } = useState(null);
  const [edit, setEdit] = useState(() => {
    return localStorage.getItem("editMode") === "true";
  });
  const [friendCount, setFriendCount] = useState(0);
  const [educationDict, setEducationDict] = useState([]);
  const [skillsDict, setSkillsDict] = useState({});
  const [experienceDict, setExperienceDict] = useState([]);
  const [projectDict, setProjectDict] = useState([]);
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

  useEffect(() => {
    if (!user) return;

    const fetchData = async (endpoint, setter, transform) => {
      try {
        const response = await fetch(
          apiURL + `/api/${endpoint}/${user.userID}`,
          { credentials: "include" }
        );
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

    fetchData("UserEducation", setEducationDict, (data) =>
      data.map(
        ({
          schoolName,
          degreeName,
          studyName,
          startDate,
          endDate,
          description,
        }) => ({
          school_name: schoolName,
          degree_name: degreeName,
          study_name: studyName,
          start_date: startDate ? new Date(startDate) : null,
          end_date: endDate ? new Date(endDate) : null,
          description,
        })
      )
    );

    fetchData("UserSkills", setSkillsDict, (data) => {
      const skills = {};
      data.forEach(({ category, name }) => {
        skills[category] = skills[category]
          ? [...skills[category], name]
          : [name];
      });
      return skills;
    });

    fetchData("UserExperience", setExperienceDict, (data) =>
      data.map(
        ({
          workName,
          workLocation,
          jobTitle,
          startDate,
          endDate,
          description,
        }) => ({
          work_name: workName,
          location: workLocation,
          job_title: jobTitle,
          start_date: startDate ? new Date(startDate) : null,
          end_date: endDate ? new Date(endDate) : null,
          description,
        })
      )
    );

    fetchData("UserProject", setProjectDict, (data) =>
      data.map(({ projectTitle, description }) => ({
        project_title: projectTitle,
        description,
      }))
    );

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
  }, [user]);

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
            <p>{user.title}</p>
            <p className="subtitle">{user.location}</p>
            <a
              href="/Friends"
              className="font-bold text-xl text-[#4ba173] hover:underline"
            >
              {friendCount} connections
            </a>

            <div className={styles.actionButtons}>
              <Button variant="contained" startIcon={<AddCircleOutlineIcon />}>
                Connect
              </Button>
              <Button
                className={styles.editProfileButton}
                variant="contained"
                startIcon={edit ? <VisibilityIcon /> : <EditIcon />}
                onClick={() => setEdit(!edit)}
              >
                {edit ? "View Profile" : "Edit Profile"}
              </Button>
            </div>
          </div>

          {!edit &&
          educationDict.length === 0 &&
          skillsDict &&
          Object.keys(skillsDict).length === 0 &&
          experienceDict.length === 0 &&
          projectDict.length === 0 ? (
            <div className={styles.noProfileText}>
              {user.first_name} {user.last_name} hasn't added to their profile
              yet
            </div>
          ) : (
            <div className={styles.highlightedInfo}>
              {educationDict.length > 0 ? (
                <EducationSection educationDict={educationDict} edit={edit} />
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
                <SkillsSection skillsDict={skillsDict} edit={edit} />
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
          <ExperienceSection experienceDict={experienceDict} edit={edit} />
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
          <ProjectSection projectDict={projectDict} edit={edit} />
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
      </div>

      <AddEducationDialog
        open={openDialog.education}
        onClose={() => toggleDialog("education", false)}
      />
      <AddSkillDialog
        open={openDialog.skill}
        onClose={() => toggleDialog("skill", false)}
      />
      <AddExperienceDialog
        open={openDialog.experience}
        onClose={() => toggleDialog("experience", false)}
      />
      <AddProjectDialog
        open={openDialog.project}
        onClose={() => toggleDialog("project", false)}
      />
    </>
  );
}

export default Profile;
