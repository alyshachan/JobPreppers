import "./ProfileSections.css";
import SectionHeader from "../Components/SectionHeader";
import EditIcon from "@mui/icons-material/Edit";

import { IconButton } from "@mui/material";

function ExperienceSection({ edit }) {
  return (
    <>
      <SectionHeader header={"Experience"} edit={edit} />

      <div className="section-content">
        <div className="experience">
          <div className={`experience-header ${edit ? "!w-full" : ""}`}>
            <img
              className="rect"
              src="https://yt3.googleusercontent.com/ytc/AIdro_lF19YDdjWace_2mr1mAjdfPpFKk_WENZimcl1MG4GUzw=s900-c-k-c0x00ffffff-no-rj"
            />

            <div className="experience-info-left">
              <p className="section-element-title">
                Software Engineering Intern
              </p>
              <p className="section-element-subtitle">T.D Williamson</p>
            </div>

            <div className="experience-info-right">
              <p className="section-element-title">October 2024-Present</p>
              <p className="section-element-subtitle">3 months</p>
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

        <hr className="m-8" />

        <div className="experience">
          <div className="experience-header">
            <img
              className="rect !bg-white"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Utah_Utes_-_U_logo.svg/1121px-Utah_Utes_-_U_logo.svg.png"
            />

            <div className="experience-info-left">
              <p className="section-element-title">Web Development Intern</p>
              <p className="section-element-subtitle">University of Utah</p>
            </div>

            <div className="experience-info-right">
              <p className="section-element-title">July 2024-October 2024</p>
              <p className="section-element-subtitle">4 months</p>
            </div>
          </div>
          <div className="experience-body ml-20">
            <ul className="list-disc">
              <li>
                Utilized best SEO practices to improve site traction by 25%
              </li>
              <li>Created responsive landing pages via HTML & CSS</li>
              <li>Managed backend items and listing updates via Netsuite</li>
            </ul>
          </div>
        </div>

        <hr className="m-8" />

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
