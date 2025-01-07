import "./ProfileSections.css";
import SectionHeader from "../Components/SectionHeader";
import EditIcon from "@mui/icons-material/Edit";

import { IconButton } from "@mui/material";
function EducationSection({ edit }) {
  return (
    <>
      <SectionHeader header={"Education"} edit={edit} />

      <div className="section-content">
        <div className="education">
          <img
            className="rect !bg-white"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Utah_Utes_-_U_logo.svg/1121px-Utah_Utes_-_U_logo.svg.png"
          />

          <div className="education-details">
            <div className="education-content">
              <p className="section-element-title">University of Utah</p> 
              <p className="section-element-subtitle">2020 - 2024</p>
            </div>
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
