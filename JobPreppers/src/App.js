import logo from "./logo.svg";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "./App.css";

import EducationSection from "./ProfileSections/EducationSection";
import SkillsSection from "./ProfileSections/SkillsSection";
import ExperienceSection from "./ProfileSections/ExperienceSection";
import NavBar from "./NavBar";

function App() {
  const skills = {
    "Programming Languages": ["Python", "Java", "C", "C++", "C#"],
    "Machine Learning & Data Analysis": [
      "Data Analysis",
      "PyTorch",
      "Scikit-learn (SkLearn)",
    ],
    "Software Tools": ["Git", "Docker", "MySQL", "Linux", "Figma"],
    "Robotics & Engineering": [
      "Robotics",
      "Electrical Engineering",
      "Network Systems",
      "Computer Systems",
    ],
    "Additional Skills": ["React", "Node.js", "TypeScript", "HTML/CSS"],
  };
  return (
    <>
      <NavBar />
      <body>
        <div className="content">
        <div className="main-panel">
            <div className="main-personal">
              <div className="circle" />
              <p className="name">Justin Ellis</p>
              <p>Computer Science Student at the University of Utah</p>
              <p className="section-element-subtitle">
                Salt Lake City, UT
                <br /> United States
              </p>
            </div>

            <div className="main-professional">
              <EducationSection />
              <SkillsSection skillsDict={skills} />
              <ExperienceSection />
            </div>
          </div>
        </div>
      </body>
    </>
  );
}

export default App;
