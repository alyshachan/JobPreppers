import "./ProfileSections.css";
import SectionHeader from "./SectionHeader";

function SkillsSection() {
  return (
    <>
      <SectionHeader header={"Skills"} />

      <div className="section-content">
        <div className="skills">
          <div className="skill-box">
            <p className="section-element-title">Programming Languages</p>
            <p>Python, Java, C, C++</p>
          </div>

          <div className="skill-box">
            <p className="section-element-title">
              Machine Learning & Data Analysis
            </p>
            <p>Data Analysis, PyTorch, SkLearn</p>
          </div>

          <div className="skill-box">
            <p className="section-element-title">Software Tools</p>
            <p>Data Analysis, PyTorch, SkLearn</p>
          </div>

          <div className="skill-box">
            <p className="section-element-title">Robotics & Engineering</p>
            <p>
              Robotics, Electrical Engineering, Network Systems, Computer
              Systems
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default SkillsSection;
