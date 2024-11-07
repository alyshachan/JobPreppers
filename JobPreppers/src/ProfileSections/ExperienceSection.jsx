import "./ProfileSections.css";
import SectionHeader from "./SectionHeader";

function ExperienceSection() {
  return (
    <>
      <SectionHeader header={"Experience"} />

      <div className="section-content">
        <div className="experience">
          
            <div className="experience-header">
              <div className="rect" />

              <div className="experience-info-left">
                <p className="section-element-title">
                  Software Engineering Intern
                </p>
                <p className="section-element-subtitle">T.D Williamson</p>
              </div>

              <div className="experience-info-right">
                <p className="section-element-title">October 2024-Present</p>
                <p className="section-element-subtitle">1 month</p>
              </div>
            </div>

            <div className="experience-body">bullet points</div>
        </div>
      </div>
    </>
  );
}

export default ExperienceSection;
