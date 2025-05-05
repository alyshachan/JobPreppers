import React, { useState, useEffect, useRef } from "react";
import ListBox from "./ListBox";
import "../Components/JobPreppers.css"
import styles from "../Components/Profile/ProfileSections.module.css"
import SectionHeader from "../Components/Profile/SectionHeader";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AddSkillDialog from "../Components/Profile/AddSkillDialog";

function SkillsSection({ skillsDict, edit, onAdd }) {
  const [openSkillDialog, setOpenSkillDialog] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [isNarrow, setIsNarrow] = useState(false);
  const containerRef = useRef(null);

  const handleOpenSkillDialog = (skill = null) => {
    setOpenSkillDialog(true);
    setSelectedSkill(skill ? { ...skill} : null)
  };

  const handleCloseSkillDialog = () => {
    setOpenSkillDialog(false);
    setSelectedSkill(null);
  };

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setIsNarrow(containerRef.current.offsetWidth < 550);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const displayedItems = edit == true ? Object.entries(skillsDict) : Object.entries(skillsDict).slice(0, 4);
  const hasMoreItems = Object.keys(skillsDict).length > 4;

  return (
    <div ref={containerRef}>
      <SectionHeader header={"Skills"} edit={edit} onAdd={handleOpenSkillDialog}/>
      <AddSkillDialog
        open={openSkillDialog}
        onClose={handleCloseSkillDialog}
        onAdd={onAdd}
        skill={selectedSkill ? { ...selectedSkill } : null}
      />

      <div className={styles.sectionContent}>
        <div className={`${styles.skills} ${isNarrow ? styles.skillsNarrow : ''}`}>
          {displayedItems.map(([title, list], index) => (
            <ListBox
              key={index}
              title={title}
              list={list}
              edit={edit}
              sliceItems={!edit}
              showAllItems={edit}
              onEdit={handleOpenSkillDialog}
            />
          ))}
        </div>
        {hasMoreItems && !edit && (
          <div className={styles.seeAllDiv}>
            <a href="/Skills">
              <button className={styles.seeAll}>
                See all Skills <ArrowForwardIcon className="mt-1 ml-1" />
              </button>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default SkillsSection;
