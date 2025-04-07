import "../Components/JobPreppers.css";
import React, { useState } from "react";
import { useAuth } from "../provider/authProvider";
import { TextField } from "@mui/material";
import styles from "../Components/Profile/AddSectionDialog.module.css";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EditNoteIcon from "@mui/icons-material/EditNote";
import SchoolIcon from "@mui/icons-material/School";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { TextareaAutosize } from "@mui/base/TextareaAutosize";
import moment from "moment";
import SettingsIcon from "@mui/icons-material/Settings";
import PsychologyIcon from "@mui/icons-material/Psychology";
import ListBox from "../ProfileSections/ListBox";
import WorkIcon from "@mui/icons-material/Work";
import BusinessIcon from "@mui/icons-material/Business";
import PlaceIcon from "@mui/icons-material/Place";
import LightbulbIcon from "@mui/icons-material/Lightbulb";

const apiURL = process.env.REACT_APP_JP_API_URL;
const monthsOfYear = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function ParseResume() {
  const { user } = useAuth(); // Get the authenticated user
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [parsedData, setParsedData] = useState(null);
  const [resumeFields, setResumeFields] = useState({
    firstName: "",
    lastName: "",
    website: "",
    location: "",
    education: [],
    skills: [],
    experience: [],
    projects: [],
  });

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const parseMonthYear = (text) => {
    if (!text || text.toLowerCase().includes("present")) return new Date();
    const date = new Date(text);
    if (isNaN(date.getTime())) return "";
    return moment(date).add(1, "days").format("YYYY-MM-DD");
  };

  function calculateDate(startDate, endDate) {
    if (endDate == null) endDate = new Date();

    const startYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();
    const startMonth = startDate.getMonth();
    const endMonth = endDate.getMonth();

    let yearsDiff = endYear - startYear;
    let monthsDiff = endMonth - startMonth;

    if (monthsDiff < 0) {
      yearsDiff--;
      monthsDiff += 12;
    }

    let message = "";
    if (yearsDiff > 1) message += yearsDiff + " years ";
    else if (yearsDiff == 1) message += yearsDiff + " year ";

    if (monthsDiff > 1) message += monthsDiff + " months";
    else if (monthsDiff == 1) message += monthsDiff + " month";

    return message;
  }

  const fetchParsedResume = async () => {
    if (!file) {
      setMessage("Please select a file.");
      return;
    }

    if (!user?.userID) {
      setMessage("User authentication error. Please log in again.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userID", user.userID);

    try {
      const response = await fetch(
        apiURL + `/api/DocumentIntelligence/PostFile`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (response.ok) {
        const data = await response.json();
        setMessage("Resume parsed successfully!");
        setParsedData(data); // This is the object with userID and parsedResult
        const fields = data.parsedResult.documents[0].fields;

        setResumeFields({
          firstName: fields.firstName?.content || "",
          lastName: fields.lastName?.content || "",
          location: fields.location?.content || "",
          website: fields.website?.content || "",
          education: fields.Education?.content || [],
          skills: fields.Skills?.content || [],
          experience: fields.Experience?.content || [],
          projects: fields.Project?.content || [],
        });
      } else {
        const errorText = await response.text();
        setMessage(`Error: ${errorText}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div className="content">
      <h1>Upload and Parse Your Resume</h1>

      <input
        type="file"
        accept=".pdf"
        id="fileInput"
        className="hidden-file-input"
        onChange={handleFileChange}
      />
      <label htmlFor="fileInput" className="custom-file-button">
        Choose File
      </label>
      {file && <p className="file-name">Selected File: {file.name}</p>}
      <br />

      <button className="button" onClick={fetchParsedResume}>
        Parse Resume
      </button>

      {message && <p className="message">{message}</p>}

      {parsedData && resumeFields && (
        <>
          <div className="panel">
            <div className="flex justify-evenly">
              <TextField
                type="text"
                label="First Name"
                value={resumeFields.firstName}
                onChange={(e) =>
                  setResumeFields((prev) => ({
                    ...prev,
                    firstName: e.target.value,
                  }))
                }
              />
              <TextField
                type="text"
                label="Last Name"
                value={resumeFields.lastName}
                onChange={(e) =>
                  setResumeFields((prev) => ({
                    ...prev,
                    lastName: e.target.value,
                  }))
                }
              />
              <TextField
                type="text"
                label="Location"
                value={resumeFields.location}
                onChange={(e) =>
                  setResumeFields((prev) => ({
                    ...prev,
                    location: e.target.value,
                  }))
                }
              />
              <TextField
                type="text"
                label="Website"
                value={resumeFields.website}
                onChange={(e) =>
                  setResumeFields((prev) => ({
                    ...prev,
                    website: e.target.value,
                  }))
                }
              />
            </div>

            {resumeFields.education.length > 0 ? <h1>Education</h1> : ""}
            {resumeFields.education.map((edu, index) => (
              <div className={styles.dialogContent}>
                <div className={styles.dialogContentLeft}>
                  <div className={styles.input}>
                    <SchoolIcon className={styles.icon} />
                    <div className={styles.inputField}>
                      <label for="school" className={styles.required}>
                        School
                      </label>
                      <TextField
                        required
                        placeholder="e.g. Harvard University"
                        className="w-full"
                        id="school"
                        value={edu.school}
                        onChange={(e) =>
                          setResumeFields((prev) => {
                            const updatedEducation = [...prev.education];
                            updatedEducation[index] = {
                              ...updatedEducation[index],
                              school: e.target.value,
                            };
                            return { ...prev, education: updatedEducation };
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className={styles.input}>
                    <HistoryEduIcon className={styles.icon} />
                    <div className={styles.inputField}>
                      <label for="degree">Degree</label>
                      <TextField
                        placeholder="e.g. Bachelors of Arts"
                        className="w-full"
                        id="degree"
                        value={edu.degree}
                        onChange={(e) =>
                          setResumeFields((prev) => {
                            const updatedEducation = [...prev.education];
                            updatedEducation[index] = {
                              ...updatedEducation[index],
                              degree: e.target.value,
                            };
                            return { ...prev, education: updatedEducation };
                          })
                        }
                      />
                    </div>

                    <MenuBookIcon className={styles.icon} />
                    <div className={styles.inputField}>
                      <label for="study">Field of Study</label>
                      <TextField
                        placeholder="e.g. Business"
                        className="w-full"
                        id="study"
                        value={edu.study}
                        onChange={(e) =>
                          setResumeFields((prev) => {
                            const updatedEducation = [...prev.education];
                            updatedEducation[index] = {
                              ...updatedEducation[index],
                              study: e.target.value,
                            };
                            return { ...prev, education: updatedEducation };
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className={styles.input}>
                    <CalendarTodayIcon className={styles.icon} />
                    <div className={styles.inputField}>
                      <label for="start">Start Date</label>
                      <TextField
                        type="date"
                        id="start"
                        value={moment(
                          new Date(parseMonthYear(edu.start))
                        ).format("YYYY-MM-DD")}
                        onChange={(e) =>
                          setResumeFields((prev) => {
                            const updatedEducation = [...prev.education];
                            updatedEducation[index] = {
                              ...updatedEducation[index],
                              start: e.target.value,
                            };
                            return { ...prev, education: updatedEducation };
                          })
                        }
                      />
                    </div>
                    <div className={styles.inputField}>
                      <label for="end">End Date</label>
                      <TextField
                        type="date"
                        id="end"
                        value={moment(new Date(parseMonthYear(edu.end))).format(
                          "YYYY-MM-DD"
                        )}
                        onChange={(e) =>
                          setResumeFields((prev) => {
                            const updatedEducation = [...prev.education];
                            updatedEducation[index] = {
                              ...updatedEducation[index],
                              end: e.target.value,
                            };
                            return { ...prev, education: updatedEducation };
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className={styles.input}>
                    <EditNoteIcon className={`${styles.icon} mt-[-100px]`} />
                    <div className={styles.inputField}>
                      <label for="description">Description</label>
                      <TextareaAutosize
                        placeholder="Enter grades, activities, awards"
                        id="description"
                        value={edu.description}
                        onChange={(e) =>
                          setResumeFields((prev) => {
                            const updatedEducation = [...prev.education];
                            updatedEducation[index] = {
                              ...updatedEducation[index],
                              description: e.target.value,
                            };
                            return { ...prev, education: updatedEducation };
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className={styles.dialogContentRight}>
                  {resumeFields.education.map((edu, index) => (
                    <div key={index}>
                      <div className={styles.education}>
                        <img
                          className="companyPicture"
                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Utah_Utes_-_U_logo.svg/1121px-Utah_Utes_-_U_logo.svg.png"
                        />

                        <div className={styles.sectionPictureContent}>
                          <p className="title">{edu.school}</p>
                          <p className="subtitle">
                            {edu.degree}
                            {!edu.degree || !edu.study ? "" : ", "}
                            {edu.study}
                          </p>
                          <p className="subtitle">
                            {edu.start || edu.end
                              ? `${
                                  edu.start
                                    ? `${
                                        monthsOfYear[
                                          new Date(
                                            parseMonthYear(edu.start)
                                          ).getMonth()
                                        ]
                                      } ${new Date(
                                        parseMonthYear(edu.start)
                                      ).getFullYear()} - `
                                    : ""
                                }${
                                  edu.end
                                    ? `${
                                        monthsOfYear[
                                          new Date(
                                            parseMonthYear(edu.end)
                                          ).getMonth()
                                        ]
                                      } ${new Date(
                                        parseMonthYear(edu.end)
                                      ).getFullYear()}`
                                    : "Present"
                                }`
                              : ""}
                          </p>
                          <p className={styles.educationContent}>
                            {edu.description}
                          </p>
                        </div>
                      </div>
                      {index < resumeFields.education.length - 1 && (
                        <hr className={styles.divider} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {resumeFields.skills.length > 0 ? <h1>Skills</h1> : ""}
            {resumeFields.skills.map((skill, index) => {
              const skillList = skill.skillName
                ? skill.skillName
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean)
                    .map((name) => ({ name }))
                : [];

              return (
                <div
                  key={index}
                  className={`${styles.dialogContent} items-center mt-2 mb-2`}
                >
                  <div className={styles.dialogContentLeft}>
                    <div className={styles.input}>
                      <SettingsIcon className={styles.icon} />
                      <div className={styles.inputField}>
                        <label htmlFor="category">Skill Category</label>
                        <TextField
                          placeholder="e.g. Interpersonal Skills"
                          className="w-full"
                          id="category"
                          value={skill.category}
                          onChange={(e) =>
                            setResumeFields((prev) => {
                              const updatedSkills = [...prev.skills];
                              updatedSkills[index] = {
                                ...updatedSkills[index],
                                category: e.target.value,
                              };
                              return { ...prev, skills: updatedSkills };
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className={styles.input}>
                      <PsychologyIcon
                        className={`${styles.icon} mt-[-100px]`}
                      />
                      <div className={styles.inputField}>
                        <label htmlFor="skill">Skill</label>
                        <TextareaAutosize
                          placeholder="Enter skills"
                          id="description"
                          value={skill.skillName}
                          onChange={(e) =>
                            setResumeFields((prev) => {
                              const updatedSkills = [...prev.skills];
                              updatedSkills[index] = {
                                ...updatedSkills[index],
                                skillName: e.target.value,
                              };
                              return { ...prev, skills: updatedSkills };
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className={styles.dialogContentRight}>
                    <div
                      className={`${styles.skills} ${styles.skillsNarrow} place-items-center`}
                    >
                      <ListBox
                        key={index}
                        title={skill.category || "Skills"}
                        list={skillList}
                        sliceItems={false}
                        showAllItems={true}
                      />
                    </div>
                  </div>
                </div>
              );
            })}

            {resumeFields.experience.length > 0 ? <h1>Experience</h1> : ""}
            {resumeFields.experience.map((exp, index) => (
              <div>
                <div className={styles.dialogContent}>
                  <div className={styles.dialogContentLeft}>
                    <div className={styles.input}>
                      <WorkIcon className={styles.icon} />
                      <div className={styles.inputField}>
                        <label for="title">Job Title</label>
                        <TextField
                          placeholder="e.g. Software Engineer"
                          className="w-full"
                          id="title"
                          value={exp.jobTitle}
                          onChange={(e) =>
                            setResumeFields((prev) => {
                              const updatedExperience = [...prev.experience];
                              updatedExperience[index] = {
                                ...updatedExperience[index],
                                jobTitle: e.target.value,
                              };
                              return { ...prev, experience: updatedExperience };
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className={styles.input}>
                      <BusinessIcon className={styles.icon} />
                      <div className={styles.inputField}>
                        <label for="work" className={styles.required}>
                          Company
                        </label>
                        <TextField
                          required
                          placeholder="e.g. Google"
                          className="w-full"
                          id="work"
                          value={exp.companyName}
                          onChange={(e) =>
                            setResumeFields((prev) => {
                              const updatedExperience = [...prev.experience];
                              updatedExperience[index] = {
                                ...updatedExperience[index],
                                companyName: e.target.value,
                              };
                              return { ...prev, experience: updatedExperience };
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className={styles.input}>
                      <PlaceIcon className={styles.icon} />
                      <div className={styles.inputField}>
                        <label for="location">Location</label>
                        <TextField
                          placeholder="e.g. Los Angeles, California"
                          className="w-full"
                          id="location"
                          value={exp.location}
                          onChange={(e) =>
                            setResumeFields((prev) => {
                              const updatedExperience = [...prev.experience];
                              updatedExperience[index] = {
                                ...updatedExperience[index],
                                location: e.target.value,
                              };
                              return { ...prev, experience: updatedExperience };
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className={styles.input}>
                      <CalendarTodayIcon className={styles.icon} />
                      <div className={styles.inputField}>
                        <label for="start">Start Date</label>
                        <TextField
                          type="date"
                          value={moment(
                            new Date(parseMonthYear(exp.start))
                          ).format("YYYY-MM-DD")}
                          onChange={(e) =>
                            setResumeFields((prev) => {
                              const updatedExperience = [...prev.experience];
                              updatedExperience[index] = {
                                ...updatedExperience[index],
                                start: e.target.value,
                              };
                              return { ...prev, experience: updatedExperience };
                            })
                          }
                        />
                      </div>
                      <div className={styles.inputField}>
                        <label for="end">End Date</label>
                        <TextField
                          type="date"
                          value={moment(
                            new Date(parseMonthYear(exp.end))
                          ).format("YYYY-MM-DD")}
                          onChange={(e) =>
                            setResumeFields((prev) => {
                              const updatedExperience = [...prev.experience];
                              updatedExperience[index] = {
                                ...updatedExperience[index],
                                end: e.target.value,
                              };
                              return { ...prev, experience: updatedExperience };
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className={styles.input}>
                      <EditNoteIcon className={`${styles.icon} mt-[-100px]`} />
                      <div className={styles.inputField}>
                        <label for="description">Description</label>
                        <TextareaAutosize
                          placeholder="Enter skills, accomplishments, achievements"
                          value={exp.description}
                          onChange={(e) =>
                            setResumeFields((prev) => {
                              const updatedExperience = [...prev.experience];
                              updatedExperience[index] = {
                                ...updatedExperience[index],
                                description: e.target.value,
                              };
                              return { ...prev, experience: updatedExperience };
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className={styles.dialogContentRight}>
                    <div className={styles.sectionPictureContent}>
                      <div className={styles.experience}>
                        <img
                          className="companyPicture"
                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Utah_Utes_-_U_logo.svg/1121px-Utah_Utes_-_U_logo.svg.png"
                        />

                        <div className={styles.experienceContentLeft}>
                          <p className="title">{exp.jobTitle}</p>
                          {exp.location ? (
                            <p className="subtitle">
                              {exp.companyName}, {exp.location}
                            </p>
                          ) : (
                            <p className="subtitle">{exp.companyName}</p>
                          )}
                        </div>

                        <div className={styles.experienceContentRight}>
                          <p className="title">
                            {exp.start || exp.end
                              ? `${
                                  exp.start
                                    ? `${
                                        monthsOfYear[
                                          new Date(
                                            parseMonthYear(exp.start)
                                          ).getMonth()
                                        ]
                                      } ${new Date(
                                        parseMonthYear(exp.start)
                                      ).getFullYear()} - `
                                    : ""
                                }${
                                  exp.end
                                    ? `${
                                        monthsOfYear[
                                          new Date(
                                            parseMonthYear(exp.end)
                                          ).getMonth()
                                        ]
                                      } ${new Date(
                                        parseMonthYear(exp.end)
                                      ).getFullYear()}`
                                    : "Present"
                                }`
                              : ""}
                          </p>
                          <p className="subtitle">
                            {exp.start
                              ? `${calculateDate(
                                  new Date(parseMonthYear(exp.start)),
                                  new Date(parseMonthYear(exp.end))
                                )}`
                              : ""}
                          </p>
                        </div>
                      </div>
                      <div className={styles.experienceContent}>
                        {exp.description}
                      </div>
                    </div>
                  </div>
                </div>
                {index < resumeFields.experience.length - 1 && (
                  <hr className={styles.divider} />
                )}
              </div>
            ))}

            {resumeFields.projects.length > 0 ? <h1>Projects</h1> : ""}
            {resumeFields.projects.map((proj, index) => (
              <div>
                <div className={styles.dialogContent}>
                  <div className={styles.dialogContentLeft}>
                    <div className={styles.input}>
                      <LightbulbIcon className={styles.icon} />
                      <div className={styles.inputField}>
                        <label htmlFor="title">Project Title</label>
                        <TextField
                          placeholder="e.g. Chatbot"
                          className="w-full"
                          id="title"
                          value={proj.title}
                          onChange={(e) =>
                            setResumeFields((prev) => {
                              const updatedProject = [...prev.project];
                              updatedProject[index] = {
                                ...updatedProject[index],
                                title: e.target.value,
                              };
                              return { ...prev, project: updatedProject };
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className={styles.input}>
                      <EditNoteIcon className={`${styles.icon} mt-[-100px]`} />
                      <div className={styles.inputField}>
                        <label for="description">Description</label>
                        <TextareaAutosize
                          placeholder="Enter details, skills, awards"
                          id="description"
                          value={proj.description}
                          onChange={(e) =>
                            setResumeFields((prev) => {
                              const updatedProject = [...prev.project];
                              updatedProject[index] = {
                                ...updatedProject[index],
                                description: e.target.value,
                              };
                              return { ...prev, project: updatedProject };
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className={styles.dialogContentRight}>
                    <div key={index}>
                      <div className={styles.project}>
                        <div className={styles.projectHeader}>
                          <div className={styles.project}>
                            <p className="title">{proj.title}</p>
                          </div>
                        </div>
                        <div className={styles.projectContent}>
                          {proj.description}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {index < resumeFields.projects.length - 1 && (
                  <hr className={styles.divider} />
                )}
              </div>
            ))}
          </div>

          {/* <div className="parsed-data">
            <h2>Extracted Information</h2>
            <p>User ID: {parsedData.userID}</p>

            <h3>Parsed Fields</h3>
            <pre>{JSON.stringify(parsedData.parsedResult, null, 2)}</pre>
          </div> */}
        </>
      )}
    </div>
  );
}

export default ParseResume;
