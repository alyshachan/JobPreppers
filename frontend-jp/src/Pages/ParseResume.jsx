import "../Components/JobPreppers.css";
import React, { useState } from "react";
import { useAuth } from "../provider/authProvider";
import { TextField } from "@mui/material";
import styles from "../Components/Profile/AddSectionDialog.module.css";
import profileStyles from "../Components/Profile/ProfileSections.module.css";
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

  const handleFieldChange = (section, index, key, value) => {
    setResumeFields((prev) => {
      const updated = [...prev[section]];
      updated[index] = { ...updated[index], [key]: value };
      return { ...prev, [section]: updated };
    });
  };

  const DateInputGroup = ({ section, index, start, end, onChange }) => (
    <div className={styles.input}>
      <CalendarTodayIcon className={styles.icon} />
      <div className={styles.inputField}>
        <label htmlFor="start">Start Date</label>
        <TextField
          type="date"
          id="start"
          value={moment(new Date(parseMonthYear(start))).format("YYYY-MM-DD")}
          onChange={(e) => onChange(section, index, "start", e.target.value)}
        />
      </div>
      <div className={styles.inputField}>
        <label htmlFor="end">End Date</label>
        <TextField
          type="date"
          id="end"
          value={moment(new Date(parseMonthYear(end))).format("YYYY-MM-DD")}
          onChange={(e) => onChange(section, index, "end", e.target.value)}
        />
      </div>
    </div>
  );

  const educationFields = [
    {
      label: "School",
      key: "school",
      icon: <SchoolIcon className={styles.icon} />,
      required: true,
      placeholder: "e.g. Harvard University",
    },
    {
      label: "Degree",
      key: "degree",
      icon: <HistoryEduIcon className={styles.icon} />,
      placeholder: "e.g. Bachelors of Arts",
    },
    {
      label: "Field of Study",
      key: "study",
      icon: <MenuBookIcon className={styles.icon} />,
      placeholder: "e.g. Business",
    },
  ];

  const experienceFields = [
    {
      label: "Job Title",
      key: "jobTitle",
      icon: <WorkIcon className={styles.icon} />,
      placeholder: "e.g. Software Engineer",
    },
    {
      label: "Company",
      key: "companyName",
      icon: <BusinessIcon className={styles.icon} />,
      required: true,
      placeholder: "e.g. Google",
    },
    {
      label: "Location",
      key: "location",
      icon: <PlaceIcon className={styles.icon} />,
      placeholder: "e.g. Los Angeles, California",
    },
  ];

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
              <div>
                <div className={`${styles.dialogContent} my-6`}>
                  <div className={styles.dialogContentLeft}>
                    {educationFields.map(
                      ({ label, key, icon, required, placeholder }) => (
                        <div className={styles.input} key={key}>
                          {icon}
                          <div className={styles.inputField}>
                            <label
                              htmlFor={key}
                              className={required ? styles.required : ""}
                            >
                              {label}
                            </label>
                            <TextField
                              id={key}
                              required={required}
                              placeholder={placeholder}
                              className="w-full"
                              value={edu[key] || ""}
                              onChange={(e) =>
                                handleFieldChange(
                                  "education",
                                  index,
                                  key,
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        </div>
                      )
                    )}

                    <DateInputGroup
                      section="education"
                      index={index}
                      start={edu.start}
                      end={edu.end}
                      onChange={handleFieldChange}
                    />

                    <div className={styles.input}>
                      <EditNoteIcon className={`${styles.icon} mt-[-100px]`} />
                      <div className={styles.inputField}>
                        <label for="description">Description</label>
                        <TextareaAutosize
                          placeholder="Enter grades, activities, awards"
                          id="description"
                          value={edu.description}
                          onChange={(e) =>
                            handleFieldChange(
                              "education",
                              index,
                              "description",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className={styles.dialogContentRight}>
                    <div key={index}>
                      <div className={profileStyles.education}>
                        <img
                          className="companyPicture"
                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Utah_Utes_-_U_logo.svg/1121px-Utah_Utes_-_U_logo.svg.png"
                        />

                        <div className={profileStyles.sectionPictureContent}>
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
                        </div>
                      </div>
                      <p className="whitespace-pre-line">{edu.description}</p>
                    </div>
                  </div>
                </div>
                {index < resumeFields.education.length - 1 && (
                  <hr className={profileStyles.divider} />
                )}
              </div>
            ))}
            {resumeFields.skills.length > 0 ? (
              <>
                <h1>Skills</h1>
                <p className="subtitle">Separate each skill with a comma</p>
              </>
            ) : (
              ""
            )}
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
                            handleFieldChange(
                              "skills",
                              index,
                              "category",
                              e.target.value
                            )
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
                            handleFieldChange(
                              "skills",
                              index,
                              "skillName",
                              e.target.value
                            )
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
                <div className={`${styles.dialogContent} my-6`}>
                  <div className={styles.dialogContentLeft}>
                    {experienceFields.map(
                      ({ label, key, icon, required, placeholder }) => (
                        <div className={styles.input} key={key}>
                          {icon}
                          <div className={styles.inputField}>
                            <label
                              htmlFor={key}
                              className={required ? styles.required : ""}
                            >
                              {label}
                            </label>
                            <TextField
                              id={key}
                              required={required}
                              placeholder={placeholder}
                              className="w-full"
                              value={exp[key] || ""}
                              onChange={(e) =>
                                handleFieldChange(
                                  "experience",
                                  index,
                                  key,
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        </div>
                      )
                    )}

                    <DateInputGroup
                      section="experience"
                      index={index}
                      start={exp.start}
                      end={exp.end}
                      onChange={handleFieldChange}
                    />

                    <div className={styles.input}>
                      <EditNoteIcon className={`${styles.icon} mt-[-100px]`} />
                      <div className={styles.inputField}>
                        <label for="description">Description</label>
                        <TextareaAutosize
                          placeholder="Enter skills, accomplishments, achievements"
                          value={exp.description}
                          onChange={(e) =>
                            handleFieldChange(
                              "experience",
                              index,
                              "description",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className={styles.dialogContentRight}>
                    <div className={profileStyles.sectionPictureContent}>
                      <div className={profileStyles.experience}>
                        <img
                          className="companyPicture"
                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Utah_Utes_-_U_logo.svg/1121px-Utah_Utes_-_U_logo.svg.png"
                        />

                        <div className={profileStyles.experienceContentLeft}>
                          <p className="title">{exp.jobTitle}</p>
                          {exp.location ? (
                            <p className="subtitle">
                              {exp.companyName}, {exp.location}
                            </p>
                          ) : (
                            <p className="subtitle">{exp.companyName}</p>
                          )}
                        </div>

                        <div className={profileStyles.experienceContentRight}>
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
                      <div className="whitespace-pre-line">
                        {exp.description}
                      </div>
                    </div>
                  </div>
                </div>
                {index < resumeFields.experience.length - 1 && (
                  <hr className={profileStyles.divider} />
                )}
              </div>
            ))}

            {resumeFields.projects.length > 0 ? <h1>Projects</h1> : ""}
            {resumeFields.projects.map((proj, index) => (
              <div>
                <div className={`${styles.dialogContent} my-6`}>
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
                            handleFieldChange(
                              "projects",
                              index,
                              "title",
                              e.target.value
                            )
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
                            handleFieldChange(
                              "projects",
                              index,
                              "description",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className={styles.dialogContentRight}>
                    <div key={index}>
                      <div className={profileStyles.project}>
                        <div className={profileStyles.projectHeader}>
                          <div className={profileStyles.project}>
                            <p className="title">{proj.title}</p>
                          </div>
                        </div>
                        <div className="whitespace-pre-line">
                          {proj.description}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {index < resumeFields.projects.length - 1 && (
                  <hr className={profileStyles.divider} />
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ParseResume;
