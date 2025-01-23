import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import React, { useState, useEffect, useRef } from "react";
import "../Components/JobPreppers.css";
import styles from "../Components/Profile/ProfileSections.module.css";
import { useAuth } from "../provider/authProvider";

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

const monthsOfYear = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function Education() {
  return (
    <div className="content">
      <div className="panelTransparent">
        <a href="/Profile" className="text-[#0D7944] hover:underline mb-8">
          <ArrowBackIcon /> Go back to Profile Page
        </a>
        <h1>Education</h1>

          <div className="panel !w-full">
            {testEduDict.map((education, index) => (
              <div key={index}>
                <div className={styles.education}>
                  <img
                    className="companyPicture"
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Utah_Utes_-_U_logo.svg/1121px-Utah_Utes_-_U_logo.svg.png"
                  />

                  <div className={styles.sectionPictureContent}>
                    <p className="title">{education.school_name}</p>
                    <p className="subtitle">
                      {education.degree_name}, {education.study_name}
                    </p>
                    <p className="subtitle">{monthsOfYear[education.start_date.getMonth()]} {education.start_date.getFullYear()} - {monthsOfYear[education.end_date.getMonth()]} {education.end_date.getFullYear()}</p>
                  </div>
                </div>
                {index < testEduDict.length - 1 && (
                  <hr className={styles.divider} />
                )}
                </div>
            ))}
          </div>

      </div>
    </div>
  );
}

export default Education;
