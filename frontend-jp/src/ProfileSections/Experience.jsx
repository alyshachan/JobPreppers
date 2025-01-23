import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import React, { useState, useEffect, useRef } from "react";
import "../Components/JobPreppers.css";
import styles from "../Components/Profile/ProfileSections.module.css";
import { useAuth } from "../provider/authProvider";

const testExpDict = [
  {
    work_name: "test work place",
    location: "Antarctica",
    job_title: "CEO",
    start_date: new Date(2020, 2, 14),
    end_date: new Date(),
    description: "i love working. Feb 2020",
  },
  {
    work_name: "another work place",
    location: "usa",
    job_title: "software developer",
    start_date: new Date(2002, 1, 22),
    end_date: new Date(2025, 1, 19),
    description: "coder 4 lyfe <3 January 2002 to Jan 2025",
  },
  {
    work_name: "another work place",
    location: "usa",
    job_title: "software developer",
    start_date: new Date(2023, 1, 19),
    end_date: new Date(),
    description: "coder 4 lyfe <3 Nov 2023 jan 2025",
  },
  {
    work_name: "another work place",
    location: "usa",
    job_title: "software developer",
    start_date: new Date(2002, 0, 22),
    end_date: new Date(),
    description: "coder 4 lyfe <3",
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

function Experience() {
  return (
    <div className="content">
      <div className="panelTransparent">
        <a href="/Profile" className="text-[#0D7944] hover:underline mb-8">
          <ArrowBackIcon /> Go back to Profile Page
        </a>
        <h1>Education</h1>

          <div className="panel !w-full">
            {testExpDict.map((education, index) => (
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
                {index < testExpDict.length - 1 && (
                  <hr className={styles.divider} />
                )}
                </div>
            ))}
          </div>

      </div>
    </div>
  );
}

export default Experience;
