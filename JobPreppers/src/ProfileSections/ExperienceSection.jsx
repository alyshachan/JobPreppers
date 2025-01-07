import "./ProfileSections.css";
import SectionHeader from "../Components/Profile/SectionHeader";
import EditIcon from "@mui/icons-material/Edit";
import profileSectionStyles from "../Components/Profile/ProfileSections.module.css";
import styles from "../Components/JobPreppers.module.css";
import { IconButton } from "@mui/material";

function ExperienceSection({ edit }) {
  return (
    <>
      <SectionHeader header={"Experience"} edit={edit} />

      <div className={profileSectionStyles.sectionContent}>
        <div className={profileSectionStyles.sectionPictureContent}>
          <div
            className={`${profileSectionStyles.experience} ${
              edit ? "!w-full" : ""
            }`}
          >
            <img
              className={styles.companyPicture}
              src="https://yt3.googleusercontent.com/ytc/AIdro_lF19YDdjWace_2mr1mAjdfPpFKk_WENZimcl1MG4GUzw=s900-c-k-c0x00ffffff-no-rj"
            />

            <div className={profileSectionStyles.experienceContentLeft}>
              <p className={styles.title}>Software Engineering Intern</p>
              <p className={styles.subtitle}>T.D Williamson</p>
            </div>

            <div className={profileSectionStyles.experienceContentRight}>
              <p className={styles.title}>October 2024-Present</p>
              <p className={styles.subtitle}>3 months</p>
            </div>
            {edit && (
              <div className="ml-5">
                <IconButton>
                  <EditIcon />
                </IconButton>
              </div>
            )}
          </div>
        </div>

        <hr className={profileSectionStyles.experience} />

        <div className={profileSectionStyles.sectionPictureContent}>
          <div
            className={`${profileSectionStyles.experience} ${
              edit ? "!w-full" : ""
            }`}
          >
            <img
              className={styles.companyPicture}
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Utah_Utes_-_U_logo.svg/1121px-Utah_Utes_-_U_logo.svg.png"
            />

            <div className={profileSectionStyles.experienceContentLeft}>
              <p className={styles.title}>Web Development Intern</p>
              <p className={styles.subtitle}>University of Utah</p>
            </div>

            <div className={profileSectionStyles.experienceContentRight}>
              <p className={styles.title}>July 2024-October 2024</p>
              <p className={styles.subtitle}>4 months</p>
            </div>
            {edit && (
              <div className="ml-5">
                <IconButton>
                  <EditIcon />
                </IconButton>
              </div>
            )}
          </div>
          <div className={profileSectionStyles.experienceContent}>
            <ul className="list-disc">
              <li>
                Utilized best SEO practices to improve site traction by 25%
              </li>
              <li>Created responsive landing pages via HTML & CSS</li>
              <li>Managed backend items and listing updates via Netsuite</li>
            </ul>
          </div>
        </div>

        <hr className={profileSectionStyles.experience} />

        <div className="experience">
          <div className="experience-header">
            <img
              className="rect !bg-white"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQc7BLRD7_cjZzpJHhSedD9w5rBylmX_xoA6w&s"
            />

            <div className="experience-info-left">
              <p className="section-element-title">Research Intern</p>
              <p className="section-element-subtitle">Fermilab</p>
            </div>

            <div className="experience-info-right">
              <p className="section-element-title">May 2023-August 2024</p>
              <p className="section-element-subtitle">1 year 4 months</p>
            </div>
          </div>
          <div className="experience-body ml-20">
            <ul className="list-disc">
              <li>
                Researched and implemented various sensors to improve mobility
                for the robot H.E.R.M.E.S
              </li>
              <li>
                Utilized computer vision libraries to achieve basic autonomous
                movements
              </li>
              <li>
                Presented contributions to a group of researchers and non
                technical employees
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default ExperienceSection;
