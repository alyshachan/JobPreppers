import "./ProfileSections.css";
import SectionHeader from "../Components/SectionHeader";

function ProjectSection() {
  return (
    <>
      <SectionHeader header={"Projects"} />

      <div className="section-content">
        <div className="experience">
          <div className="experience-header">
            <div className="experience-info-left">
              <p className="section-element-title">
                H.E.R.M.E.S
              </p>
            </div>
          </div>
          <div className="experience-body ml-20 !mt-[0px]">
            <ul className="list-disc">
              <li>
              Implemented RealSense camera and Lidar sensors for object detection
              </li>
              <li>Utilized April tags to enable precise localization</li>
              <li>Created a UML diagram to explain the processes of H.E.R.M.E.S</li>
            </ul>
          </div>
        </div>

        <hr className="m-8" />

        <div className="experience">
          <div className="experience-header">
            <div className="experience-info-left">
              <p className="section-element-title">
                Old Bailey Decision
              </p>
            </div>
          </div>
          <div className="experience-body ml-20 !mt-[0px]">
            <ul className="list-disc">
              <li>
              Analyzed digitized proceedings from a court database to predict trial outcomes
              </li>
              <li>Implemented and compared various different learning algorithms for best results</li>
              <li>Evaluated and reported the accuracy and methodologies for each algorithm</li>
            </ul>
          </div>
        </div>

        <hr className="m-8" />

        <div className="experience">
          <div className="experience-header">
            <div className="experience-info-left">
              <p className="section-element-title">
                Raspberry pi Ring Doorbell
              </p>
            </div>
          </div>
          <div className="experience-body ml-20 !mt-[0px]">
            <ul className="list-disc">
              <li>Implemented Pi cameras for object detection
              </li>
              <li>Utilized machine learning libraries to detect faces</li>
              <li>Created TCP sockets to relay information to a server to display footage remotely</li>
            </ul>
          </div>
        </div>

      </div>
    </>
  );
}

export default ProjectSection;
