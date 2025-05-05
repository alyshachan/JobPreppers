import SectionHeader from "../Components/Profile/SectionHeader";
import EditIcon from "@mui/icons-material/Edit";
import styles from "../Components/Profile/ProfileSections.module.css";
import "../Components/JobPreppers.css";
import DefaultCompany from "../Components/Profile/JobPreppers_DefaultCompany.png";
import { IconButton } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useState } from "react";
import AddExperienceDialog from "../Components/Profile/AddExperienceDialog";

function ExperienceSection({ experienceDict, edit, onAdd }) {
  const [openExperienceDialog, setOpenExperienceDialog] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState(null);

  const handleOpenExperienceDialog = (experience = null) => {
    setOpenExperienceDialog(true);
    setSelectedExperience(experience ? { ...experience } : null);
  };

  const handleCloseExperienceDialog = () => {
    setOpenExperienceDialog(false);
    setSelectedExperience(null);
  };

  const displayedItems =
    edit == true ? experienceDict : experienceDict.slice(0, 3);
  const hasMoreItems = Object.keys(experienceDict).length > 3;
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
    const startMonth = startDate.getMonth() + 1;
    const endMonth = endDate.getMonth() + 1;

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

  return (
    <>
      <div className="panel">
        <SectionHeader
          header={"Experience"}
          edit={edit}
          onAdd={() => handleOpenExperienceDialog(null)}
        />
        <AddExperienceDialog
          open={openExperienceDialog}
          onClose={handleCloseExperienceDialog}
          onAdd={onAdd}
          experience={selectedExperience ? { ...selectedExperience } : null}
        />

        <div className={styles.sectionContent}>
          {displayedItems.map((experience, index) => (
            <div key={index}>
              <div className={styles.sectionPictureContent}>
                <div
                  className={`${styles.experience} ${edit ? "!w-full" : ""}`}
                >
                {experience.work_name == "University of Utah" ? (
                  <img
                    className="companyPicture"
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Utah_Utes_-_U_logo.svg/1121px-Utah_Utes_-_U_logo.svg.png"
                  />
                ) : (
                  <img className="companyPicture" src={DefaultCompany} />
                )}

                  <div className={styles.experienceContentLeft}>
                    <p className="title">{experience.job_title}</p>
                    {experience.location ? (
                      <p className="subtitle">
                        {experience.work_name}, {experience.location}
                      </p>
                    ) : (
                      <p className="subtitle">{experience.work_name}</p>
                    )}
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
                  {edit && (
                    <div className="ml-5">
                      <IconButton
                        onClick={() => handleOpenExperienceDialog(experience)}
                      >
                        <EditIcon />
                      </IconButton>
                    </div>
                  )}
                </div>
                <div className={styles.experienceContent}>
                  {experience.description}
                </div>
              </div>

              {index < displayedItems.length - 1 && (
                <hr className={styles.divider} />
              )}
            </div>
          ))}

          {hasMoreItems && !edit && (
            <div className={styles.seeAllDiv}>
              <a href="/Experience">
                <button className={styles.seeAll}>
                  See all Experience <ArrowForwardIcon className="mt-1 ml-1" />
                </button>
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ExperienceSection;
