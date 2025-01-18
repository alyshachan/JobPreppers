import "../Components/JobPreppers.css";
import styles from "../Components/Profile/ProfileSections.module.css";
import SectionHeader from "../Components/Profile/SectionHeader";

function ProjectSection({ edit }) {
  return (
    <>
      <SectionHeader header={"Projects"} edit={edit} />

      <div className={styles.sectionContent}>
        <div className={styles.project}>
          <div className={styles.projectHeader}>
            <div className={styles.project}>
              <p className="title">H.E.R.M.E.S</p>
            </div>
          </div>
          <div className={styles.projectContent}>
            <ul className="list-disc">
              <li>
                Implemented RealSense camera and Lidar sensors for object
                detection
              </li>
              <li>Utilized April tags to enable precise localization</li>
              <li>
                Created a UML diagram to explain the processes of H.E.R.M.E.S
              </li>
            </ul>
          </div>
        </div>

        <hr className={styles.divider} />

        <div className={styles.project}>
          <div className={styles.projectHeader}>
            <div className={styles.project}>
              <p className="title">Old Bailey Decision</p>
            </div>
          </div>
          <div className={styles.projectContent}>
            <ul className="list-disc">
              <li>
                Analyzed digitized proceedings from a court database to predict
                trial outcomes
              </li>
              <li>
                Implemented and compared various different learning algorithms
                for best results
              </li>
              <li>
                Evaluated and reported the accuracy and methodologies for each
                algorithm
              </li>
            </ul>
          </div>
        </div>

        <hr className={styles.divider} />

        <div className={styles.project}>
          <div className={styles.projectHeader}>
            <div className={styles.project}>
              <p className="title">Raspberry pi Ring Doorbell</p>
            </div>
          </div>
          <div className={styles.projectContent}>
            <ul className="list-disc">
              <li>Implemented Pi cameras for object detection</li>
              <li>Utilized machine learning libraries to detect faces</li>
              <li>
                Created TCP sockets to relay information to a server to display
                footage remotely
              </li>
            </ul>
            <img
              className={styles.projectPicture}
              src="https://upload.wikimedia.org/wikipedia/commons/f/ff/Logo_of_Github.jpg"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default ProjectSection;
