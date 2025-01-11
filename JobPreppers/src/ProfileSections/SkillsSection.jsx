import React, { useState, useEffect, useRef } from "react";
import ListBox from "./ListBox";
import "../Components/JobPreppers.css"
import styles from "../Components/Profile/ProfileSections.module.css"
import SectionHeader from "../Components/Profile/SectionHeader";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

function SkillsSection({ skillsDict, edit }) {
  const [isNarrow, setIsNarrow] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setIsNarrow(containerRef.current.offsetWidth < 750);
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
      <SectionHeader header={"Skills"} edit={edit} />
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
            />
          ))}
        </div>
        {hasMoreItems && !edit && (
          <div className={styles.seeAllDiv}>
            <a href="./Skills">
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
