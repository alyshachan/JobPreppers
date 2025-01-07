import React, { useState, useEffect, useRef } from "react";
import ListBox from "./ListBox";
import "./ProfileSections.css";
import SectionHeader from "../Components/SectionHeader";

function SkillsSection({ skillsDict }) {
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

  const displayedItems = Object.entries(skillsDict).slice(0, 4);
  const hasMoreItems = Object.keys(skillsDict).length > 4;

  return (
    <div ref={containerRef}>
      <SectionHeader header={"Skills"} />
      <div className="section-content">

      <div className={`skills ${isNarrow ? "narrow" : ""}`}>
        {displayedItems.map(([title, list], index) => (
          <ListBox key={index} title={title} list={list} />
        ))}
      </div>
      {hasMoreItems && (
        <div className="see-all-div">
          <button className="see-all">See all Skills -&gt;</button>
        </div>
      )}
    </div>

      </div>
  );
}

export default SkillsSection;
