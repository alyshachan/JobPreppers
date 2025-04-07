import "../Components/JobPreppers.css";
import React, { useState } from "react";
import { useAuth } from "../provider/authProvider";
import { TextField } from "@mui/material";

const apiURL = process.env.REACT_APP_JP_API_URL;

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
          website: fields.website?.content || "",
          location: fields.location?.content || "",
          education: fields.Education?.content || [],
          skills: fields.Skills?.content || [], // assuming a list if parsed correctly
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
      <div className="panel">
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
            <div className="content">
              <TextField
                type="text"
                label="First Name"
                value={resumeFields.firstName}
              />
              <TextField
                type="text"
                label="Last Name"
                value={resumeFields.lastName}
              />
              <TextField
                type="text"
                label="Location"
                value={resumeFields.location}
              />
              <TextField
                type="text"
                label="Website"
                value={resumeFields.website}
              />

              <h3>Education</h3>
              {resumeFields.education.map((edu, index) => (
                <div key={index} className="section">
                  <p>
                    <strong>School:</strong> {edu.school}
                  </p>
                  <p>
                    <strong>Degree:</strong> {edu.degree}
                  </p>
                  <p>
                    <strong>Study:</strong> {edu.study}
                  </p>
                  <p>
                    <strong>Start:</strong> {edu.start}
                  </p>
                  <p>
                    <strong>End:</strong> {edu.end}
                  </p>
                  <p>
                    <strong>Description:</strong> {edu.description}
                  </p>
                </div>
              ))}

              <h3>Skills</h3>
              {Array.isArray(resumeFields.skills) &&
              resumeFields.skills.length > 0 ? (
                <ul>
                  {resumeFields.skills.map((skill, index) => (
                    <li key={index}>{skill.skillName || skill}</li>
                  ))}
                </ul>
              ) : (
                <p>No skills detected.</p>
              )}

              <h3>Experience</h3>
              {resumeFields.experience.map((exp, index) => (
                <div key={index} className="section">
                  <p>
                    <strong>Job Title:</strong> {exp.jobTitle}
                  </p>
                  <p>
                    <strong>Company:</strong> {exp.companyName}
                  </p>
                  <p>
                    <strong>Location:</strong> {exp.location}
                  </p>
                  <p>
                    <strong>Start:</strong> {exp.start}
                  </p>
                  <p>
                    <strong>End:</strong> {exp.end}
                  </p>
                  <p>
                    <strong>Description:</strong> {exp.description}
                  </p>
                </div>
              ))}

              <h3>Projects</h3>
              {resumeFields.projects.map((proj, index) => (
                <div key={index} className="section">
                  <p>
                    <strong>Title:</strong> {proj.title}
                  </p>
                  <p>
                    <strong>Description:</strong> {proj.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="parsed-data">
              <h2>Extracted Information</h2>
              <p>User ID: {parsedData.userID}</p>

              <h3>Parsed Fields</h3>
              <pre>{JSON.stringify(parsedData.parsedResult, null, 2)}</pre>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ParseResume;
