import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import React, { useState, useEffect, useRef } from "react";
import "../Components/JobPreppers.css";
import styles from "../Components/Profile/ProfileSections.module.css";
import { useAuth } from "../provider/authProvider";
import { useParams } from "react-router-dom";

const apiURL = process.env.REACT_APP_JP_API_URL;

function Project() {
  const { username } = useParams();
  const [visitingUser, setUser] = useState(null);
  const [projectDict, setProjectDict] = useState([]);

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
              setProjectDict([]);
            } else {
              throw new Error("Failed to fetch user");
            }
          } catch (error) {
            console.error("Error fetching user:", error);
          }
        };
    
        fetchUser();
      }, [username, apiURL]);

  useEffect(() => {
    const requestProjects = async () => {
      try {
        const response = await fetch(
          apiURL + `/api/UserProject/${visitingUser.userID}`,
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
  }, [visitingUser]);

  if (visitingUser == null) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="content">
      <div className="panelTransparent">
        <a
          href={`/Profile/${visitingUser.username}`}
          className="text-[var(--jp-border)] hover:underline mb-8"
        >
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
