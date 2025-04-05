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
      const response = await fetch(apiURL + `/api/DocumentIntelligence/PostFile`, {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        setMessage("Resume parsed successfully!");
        setParsedData(data); // This is the object with userID and parsedResult
        console.log("Parsed Resume:", data)
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

        {parsedData && (
        <div className="parsed-data">
          <h2>Extracted Information</h2>
          <p>User ID: {parsedData.userID}</p>

          <h3>Parsed Fields</h3>
          <pre>{JSON.stringify(parsedData.parsedResult, null, 2)}</pre>
        </div>
      )}
      </div>
    </div>
  );
}

export default ParseResume;
