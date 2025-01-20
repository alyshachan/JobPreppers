import SectionHeader from "../Components/Profile/SectionHeader";
import EditIcon from "@mui/icons-material/Edit";
import styles from "../Components/Profile/ProfileSections.module.css";
import "../Components/JobPreppers.css";
import { IconButton } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";


function ExperienceSection({ experienceDict, edit }) {
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

  function calculateDate(startDate,endDate) {
    const startYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();
    const startMonth = startDate.getMonth();
    const endMonth = endDate.getMonth();

    let yearsDiff = endYear - startYear;
    let monthsDiff = endMonth - startMonth;

    if (monthsDiff < 0){
      yearsDiff--;
      monthsDiff += 12;
    }

    let message = "";
    if (yearsDiff > 1)
      message += yearsDiff + " years "
    else
      message += yearsDiff + " year "

    if (monthsDiff > 1)
      message += monthsDiff + " months"
    else
      message += monthsDiff + " month"
    
    return message
    }

  return (
    <>
      <SectionHeader header={"Experience"} edit={edit} />

      <div className={styles.sectionContent}>
        {displayedItems.map((experience, index) => (
          <div key={index}>
            <div className={styles.sectionPictureContent}>
              <div className={`${styles.experience} ${edit ? "!w-full" : ""}`}>
                <img
                  className="companyPicture"
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Utah_Utes_-_U_logo.svg/1121px-Utah_Utes_-_U_logo.svg.png"
                />

                <div className={styles.experienceContentLeft}>
                  <p className="title">{experience.job_title}</p>
                  <p className="subtitle">{experience.work_name}</p>
                </div>

                <div className={styles.experienceContentRight}>
                <p className="title">{monthsOfYear[experience.start_date.getMonth() - 1]} {experience.start_date.getFullYear()} - {monthsOfYear[experience.end_date.getMonth()]} {experience.end_date.getFullYear()}</p>
                  <p className="subtitle">{calculateDate(experience.start_date, experience.end_date)}</p>
                </div>
                {edit && (
                  <div className="ml-5">
                    <IconButton>
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
            <a href="./Experience">
              <button className={styles.seeAll}>
                See all Experience <ArrowForwardIcon className="mt-1 ml-1" />
              </button>
            </a>
          </div>
        )}
      </div>
    </>
  );
}

export default ExperienceSection;
