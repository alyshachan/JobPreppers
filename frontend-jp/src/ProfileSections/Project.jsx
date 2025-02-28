import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import React, { useState, useEffect, useRef } from "react";
import "../Components/JobPreppers.css";
import styles from "../Components/Profile/ProfileSections.module.css";
import { useAuth } from "../provider/authProvider";

const testProjDict = [
  {
    project_title: "raspberry pi ring doorbell",
    description: "blah blah blah",
  },
  {
    project_title: "raspberry pi ring doorbell",
    description: "blah blah blah",
  },
  {
    project_title: "raspberry pi ring doorbell",
    description: "blah blah blah",
  },
  {
    project_title: "raspberry pi ring doorbell",
    description: "blah blah blah",
  },
];

function Project() {
    const { user, setAuthData } = useAuth(); // custom hook for authprovider
    const [projectDict, setProjectDict] = useState([]);

    useEffect(() => {
  const requestProjects = async () => {
    try {
      const response = await fetch(
        `http://52.90.94.171:5000/api/UserProject/${user.userID}`,
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

  requestProjects();
}, [user]);
  return (
    <div className="content">
      <div className="panelTransparent">
        <a href="/Profile" className="text-[#0D7944] hover:underline mb-8">
          <ArrowBackIcon /> Go back to Profile Page
        </a>
        <h1>Projects</h1>

          <div className="panel !w-full">
          {projectDict.map((project, index) => (
            <div key={index}>
              <div className={styles.project}>
                <div className={styles.projectHeader}>
                  <div className={styles.project}>
                    <p className="title">{project.project_title}</p>
                  </div>
                </div>
                <div className={styles.projectContent}>
                  {project.description}
                </div>
              </div>

              {index < projectDict.length - 1 && (
                <hr className={styles.divider} />
              )}
            </div>
          ))}
          </div>

      </div>
    </div>
  );
}

export default Project;
