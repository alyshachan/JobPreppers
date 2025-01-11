import SectionHeader from "../Components/Profile/SectionHeader";
import EditIcon from "@mui/icons-material/Edit";
import styles from "../Components/Profile/ProfileSections.module.css";
import "../Components/JobPreppers.css";
import { IconButton } from "@mui/material";

function ExperienceSection({ edit }) {
  return (
    <>
      <SectionHeader header={"Experience"} edit={edit} />

      <div className={styles.sectionContent}>
        <div className={styles.sectionPictureContent}>
          <div className={`${styles.experience} ${edit ? "!w-full" : ""}`}>
            <img
              className="companyPicture"
              src="https://yt3.googleusercontent.com/ytc/AIdro_lF19YDdjWace_2mr1mAjdfPpFKk_WENZimcl1MG4GUzw=s900-c-k-c0x00ffffff-no-rj"
            />

            <div className={styles.experienceContentLeft}>
              <p className="title">Software Engineering Intern</p>
              <p className="subtitle">T.D Williamson</p>
            </div>

            <div className={styles.experienceContentRight}>
              <p className="title">October 2024-Present</p>
              <p className="subtitle">3 months</p>
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

        <hr className={styles.profileSection} />

        <div className={styles.sectionPictureContent}>
          <div className={`${styles.experience} ${edit ? "!w-full" : ""}`}>
            <img
              className="companyPicture"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Utah_Utes_-_U_logo.svg/1121px-Utah_Utes_-_U_logo.svg.png"
            />

            <div className={styles.experienceContentLeft}>
              <p className="title">Web Development Intern</p>
              <p className="subtitle">University of Utah</p>
            </div>

            <div className={styles.experienceContentRight}>
              <p className="title">July 2024-October 2024</p>
              <p className="subtitle">4 months</p>
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
            <ul className="list-disc">
              <li>
                Utilized best SEO practices to improve site traction by 25%
              </li>
              <li>Created responsive landing pages via HTML & CSS</li>
              <li>Managed backend items and listing updates via Netsuite</li>
            </ul>
          </div>
        </div>

        <hr className={styles.profileSection} />

        <div className={styles.sectionPictureContent}>
          <div className={`${styles.experience} ${edit ? "!w-full" : ""}`}>
            <img
              className="companyPicture"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQc7BLRD7_cjZzpJHhSedD9w5rBylmX_xoA6w&s"
            />

            <div className={styles.experienceContentLeft}>
              <p className="title">Research Intern</p>
              <p className="subtitle">Fermilab</p>
            </div>

            <div className={styles.experienceContentRight}>
              <p className="title">May 2023-August 2024</p>
              <p className="subtitle">1 year 4 months</p>
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
