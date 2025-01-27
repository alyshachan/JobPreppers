import dayjs from "dayjs";
import SectionHeader from "../Components/Profile/SectionHeader";
import EditIcon from "@mui/icons-material/Edit";
import styles from "../Components/Profile/ProfileSections.module.css";
import "../Components/JobPreppers.css";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { IconButton } from "@mui/material";
function EducationSection({ educationDict, edit }) {
  const displayedItems =
    edit == true ? educationDict : educationDict.slice(0, 2);
  const hasMoreItems = Object.keys(educationDict).length > 2;
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

  return (
    <>
      <SectionHeader header={"Education"} edit={edit} />

      <div className={styles.sectionContent}>
        {displayedItems.map((education, index) => (
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

              {edit && (
                <div className="ml-auto mb-auto">
                  <IconButton>
                    <EditIcon />
                  </IconButton>
                </div>
              )}
            </div>
            {index < displayedItems.length - 1 && (
              <hr className={styles.divider} />
            )}
          </div>
        ))}
        {hasMoreItems && !edit && (
          <div className={styles.seeAllDiv}>
            <a href="./Education">
              <button className={styles.seeAll}>
                See all Education <ArrowForwardIcon className="mt-1 ml-1" />
              </button>
            </a>
          </div>
        )}
      </div>
    </>
  );
}

export default EducationSection;
