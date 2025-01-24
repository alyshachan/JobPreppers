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
  return (
    <div className="content">
      <div className="panelTransparent">
        <a href="/Profile" className="text-[#0D7944] hover:underline mb-8">
          <ArrowBackIcon /> Go back to Profile Page
        </a>
        <h1>Projects</h1>

          <div className="panel !w-full">
          {testProjDict.map((project, index) => (
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

              {index < testProjDict.length - 1 && (
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
