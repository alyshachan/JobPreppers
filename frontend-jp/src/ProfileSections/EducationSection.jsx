import SectionHeader from "../Components/Profile/SectionHeader";
import EditIcon from "@mui/icons-material/Edit";
import styles from "../Components/Profile/ProfileSections.module.css"
import "../Components/JobPreppers.css"

import { IconButton } from "@mui/material";
function EducationSection({ edit }) {
  return (
    <>
      <SectionHeader header={"Education"} edit={edit} />

      <div className={styles.sectionContent}>
        <div className={styles.education}>
          <img
            className="companyPicture"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Utah_Utes_-_U_logo.svg/1121px-Utah_Utes_-_U_logo.svg.png"
          />

          <div className={styles.sectionPictureContent}>
            <p className="title">University of Utah</p>
            <p className="subtitle">2020 - 2024</p>
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
