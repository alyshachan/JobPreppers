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

function calculateDate(startDate, endDate) {
  if (endDate == null) endDate = new Date();

  const startYear = startDate.getFullYear();
  const endYear = endDate.getFullYear();
  const startMonth = startDate.getMonth();
  const endMonth = endDate.getMonth();

  let yearsDiff = endYear - startYear;
  let monthsDiff = endMonth - startMonth;

  if (monthsDiff < 0) {
    yearsDiff--;
    monthsDiff += 12;
  }

  let message = "";
  if (yearsDiff > 1) message += yearsDiff + " years ";
  else if (yearsDiff == 1) message += yearsDiff + " year ";

  if (monthsDiff > 1) message += monthsDiff + " months";
  else if (monthsDiff == 1) message += monthsDiff + " month";

  return message;
}

function Experience() {
  const { user, setAuthData } = useAuth(); // custom hook for authprovider
  const [experienceDict, setExperienceDict] = useState([]);

  useEffect(() => {
    const requestExperience = async () => {
      try {
        const response = await fetch(
          `https://jobpreppers.co/api/UserExperience/${user.userID}`,
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

    requestExperience();
  }, [user]);

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
        <h1>Experience</h1>

        <div className="panel !w-full">
          {experienceDict.map((experience, index) => (
            <div key={index}>
              <div className={styles.sectionPictureContent}>
                <div className={styles.experience}>
                  <img
                    className="companyPicture"
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Utah_Utes_-_U_logo.svg/1121px-Utah_Utes_-_U_logo.svg.png"
                  />

                  <div className={styles.experienceContentLeft}>
                    <p className="title">{experience.job_title}</p>
                    <p className="subtitle">{experience.work_name}</p>
                  </div>

                  <div className={styles.experienceContentRight}>
                    <p className="title">
                      {experience.start_date || experience.end_date
                        ? `${
                            experience.start_date
                              ? `${
                                  monthsOfYear[experience.start_date.getMonth()]
                                } ${experience.start_date.getFullYear()} - `
                              : ""
                          }${
                            experience.end_date
                              ? `${
                                  monthsOfYear[experience.end_date.getMonth()]
                                } ${experience.end_date.getFullYear()}`
                              : "Present"
                          }`
                        : ""}
                    </p>
                    <p className="subtitle">
                      {experience.start_date
                        ? `${calculateDate(
                            experience.start_date,
                            experience.end_date
                          )}`
                        : ""}
                    </p>
                  </div>
                </div>
                <div className={styles.experienceContent}>
                  {experience.description}
                </div>
              </div>

              {index < experienceDict.length - 1 && (
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
