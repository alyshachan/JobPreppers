import ListBox from "./ListBox";
import "./ProfileSections.css";
import SectionHeader from "./SectionHeader";

function SkillsSection({ skillsDict }) {
  const displayedItems = Object.entries(skillsDict).slice(0, 4);
  const hasMoreItems = Object.keys(skillsDict).length > 4;
  return (
    <>
      <SectionHeader header={"Skills"} />

      <div className="section-content">
        <div className="skills">
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
    </>
  );
}

export default SkillsSection;
