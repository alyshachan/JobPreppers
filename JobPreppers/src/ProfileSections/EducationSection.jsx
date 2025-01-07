import "./ProfileSections.css";
import SectionHeader from "../Components/Profile/SectionHeader";
import EditIcon from "@mui/icons-material/Edit";
import profileSectionStyles from "../Components/Profile/ProfileSections.module.css"
import styles from "../Components/JobPreppers.module.css"

import { IconButton } from "@mui/material";
function EducationSection({ edit }) {
  return (
    <>
      <SectionHeader header={"Education"} edit={edit} />

      <div className={profileSectionStyles.sectionContent}>
        <div className={profileSectionStyles.education}>
          <img
            className={styles.companyPicture}
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Utah_Utes_-_U_logo.svg/1121px-Utah_Utes_-_U_logo.svg.png"
          />

          <div className={profileSectionStyles.sectionPictureContent}>
            <p className={styles.title}>University of Utah</p>
            <p className={styles.subtitle}>2020 - 2024</p>
          </div>

          {edit && (
            <div className="ml-auto mb-auto">
              <IconButton>
                <EditIcon />
              </IconButton>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default EducationSection;
