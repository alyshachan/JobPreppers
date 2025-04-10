import "../Components/JobPreppers.css";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import styles from "../Components/Profile/ProfileSections.module.css";
import SectionHeader from "../Components/Profile/SectionHeader";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import {useState } from "react";

import AddProjectDialog from "../Components/Profile/AddProjectDialog";

function ProjectSection({ projectDict, edit, onAdd }) {
  const [openProjectDialog, setOpenProjectDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const handleOpenProjectDialog = (project = null) => {
    setOpenProjectDialog(true);
    setSelectedProject(project ? { ...project} : null)
  };

  const handleCloseProjectDialog = () => {
    setOpenProjectDialog(false);
    setSelectedProject(null)
  };

  const displayedItems = edit == true ? projectDict : projectDict.slice(0, 3);
  const hasMoreItems = Object.keys(projectDict).length > 3;

  return (
    <>
      <div className="panel">
        <SectionHeader header={"Projects"} edit={edit} onAdd={() => handleOpenProjectDialog(null)}/>
      <AddProjectDialog
        open={openProjectDialog}
        onClose={handleCloseProjectDialog}
        onAdd={onAdd}
        project={selectedProject ? { ...selectedProject } : null}
      />
        <div className={styles.sectionContent}>
          {displayedItems.map((project, index) => (
            <div key={index}>
              <div className={styles.project}>
                <div className={styles.projectHeader}>
                  <div className={styles.project}>
                    <p className="title">{project.project_title}</p>
                  </div>
                  {edit && (
                    <div className="ml-5">
                      <IconButton  onClick={() => handleOpenProjectDialog(project)}>
                        <EditIcon />
                      </IconButton>
                    </div>
                  )}
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
              <a href="/Project">
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
