import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import React, { useState, useEffect, useRef } from "react";
import "../Components/JobPreppers.css";
import DefaultCompany from "../Components/Profile/JobPreppers_DefaultCompany.png";
import styles from "../Components/Profile/ProfileSections.module.css";
import { useAuth } from "../provider/authProvider";

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
const apiURL = process.env.REACT_APP_JP_API_URL;

function Education() {
  const { user, setAuthData } = useAuth(); // custom hook for authprovider
  const [educationDict, setEducationDict] = useState([]);

  useEffect(() => {
    const requestEducation = async () => {
      try {
        const response = await fetch(
          apiURL + `/api/UserEducation/${user.userID}`,
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

    requestEducation();
  }, [user]);

  // Display loading state until user is available
  if (user == null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="content">
      <div className="panelTransparent">
        <a
          href={`/Profile/${user.username}`}
          className="text-[var(--jp-border)] hover:underline mb-8"
        >
          <ArrowBackIcon /> Go back to Profile Page
        </a>
        <h1>Education</h1>

        <div className="panel !w-full">
          {educationDict.map((education, index) => (
            <div key={index}>
              <div className={styles.education}>
                {education.school_name == "University of Utah" ? (
                  <img
                    className="companyPicture"
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Utah_Utes_-_U_logo.svg/1121px-Utah_Utes_-_U_logo.svg.png"
                  />
                ) : (
                  <img className="companyPicture" src={DefaultCompany} />
                )}

                <div className={styles.sectionPictureContent}>
                  <p className="title">{education.school_name}</p>
                  <p className="subtitle">
                    {education.degree_name}
                    {!education.degree_name || !education.study_name
                      ? ""
                      : ", "}
                    {education.study_name}
                  </p>
                  <p className="subtitle">
                    {education.start_date || education.end_date
                      ? `${
                          education.start_date
                            ? `${
                                monthsOfYear[education.start_date.getMonth()]
                              } ${education.start_date.getFullYear()} - `
                            : ""
                        }${
                          education.end_date
                            ? `${
                                monthsOfYear[education.end_date.getMonth()]
                              } ${education.end_date.getFullYear()}`
                            : "Present"
                        }`
                      : ""}
                  </p>
                  <p className={styles.educationContent}>
                    {education.description}
                  </p>
                </div>
              </div>
              {index < educationDict.length - 1 && (
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
