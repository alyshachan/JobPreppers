import "../Components/JobPreppers.css";
import styles from "../Components/Profile/ProfileSections.module.css";
import SectionHeader from "../Components/Profile/SectionHeader";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

function ProjectSection({ projectDict, edit }) {
  const displayedItems = edit == true ? projectDict : projectDict.slice(0, 3);
  const hasMoreItems = Object.keys(projectDict).length > 3;

  return (
    <>
      <div className="panel">
        <SectionHeader header={"Projects"} edit={edit} />

        <div className={styles.sectionContent}>
          {displayedItems.map((project, index) => (
            <div key={index}>
              <div className={styles.project}>
                <div className={styles.projectHeader}>
                  <div className={styles.project}>
                    <p className="title">{project.project_title}</p>
                  </div>
                </div>
                <div className={styles.projectContent}>
                  {project.description}
                </div>
              </div>

              {index < displayedItems.length - 1 && (
                <hr className={styles.divider} />
              )}
            </div>
          ))}
          {hasMoreItems && !edit && (
            <div className={styles.seeAllDiv}>
              <a href="./Projects">
                <button className={styles.seeAll}>
                  See all Projects
                  <ArrowForwardIcon className="mt-1 ml-1" />
                </button>
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ProjectSection;
