import "../Components/JobPreppers.css";
import React, { useState } from "react";
import { useAuth } from "../provider/authProvider";

const apiURL = process.env.REACT_APP_JP_API_URL;

function ParseResume() {
  const { user } = useAuth(); // Get the authenticated user
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [parsedData, setParsedData] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadResume = async () => {
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
      const response = await fetch(apiURL + `/api/Resume/PostFile`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        setMessage(`Error: ${errorText}`);
      } else {
        setMessage("Resume uploaded successfully!");
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const fetchParsedResume = async () => {
    try {
      const response = await fetch(`${apiURL}/api/Resume/ParseResume/${user.userID}`);
      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      setParsedData(data);
      console.log("Parsed Resume:", data);
    } catch (error) {
      console.error("Error:", error);
      setMessage("Failed to parse resume.");
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
        <button className="button" onClick={uploadResume}>
          Upload Resume
        </button>

        <button className="button" onClick={fetchParsedResume}>
          Parse Resume
        </button>

        {message && <p className="message">{message}</p>}

        {parsedData && (
          <div className="parsed-data">
            <h2>Extracted Information</h2>
            <pre>{JSON.stringify(parsedData, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default ParseResume;
