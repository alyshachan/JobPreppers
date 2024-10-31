import "./ProfileSections.css";
import SectionHeader from "./SectionHeader";

function EducationSection() {
  return (
    <>
      <SectionHeader header={"Education"} />
      
      <div className="section-content">
        <div className="education">
          <div className="rect" />

          <div className="education-content">
            <p className="section-element-title">University of Utah</p>
            <p className="section-element-subtitle">2020 - 2024</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default EducationSection;
