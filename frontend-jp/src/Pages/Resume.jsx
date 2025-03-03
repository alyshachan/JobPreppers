
import "../Components/JobPreppers.css";
import React, { useState } from "react";
import { useAuth } from "../provider/authProvider";

function Resume() {
    const { user } = useAuth(); // Get the authenticated user's data
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");
    const [jobDescription, setJobDescription] = useState(""); // Add jobDescription state
    const [suggestions, setSuggestions] = useState([]); // Update suggestions to an array
    const [loading, setLoading] = useState(false);
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
            const response = await fetch("http://107.23.196.38:5000/api/Resume/PostFile", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                setMessage(`Error: ${errorText}`);
            } else {
                const successMessage = await response.text();
                setMessage(successMessage);
            }
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        }
    };

    const generateSuggestions = async () => {
        if (!jobDescription) {
            setMessage("Please enter a job description.");
            return;
        }

        if (!user.userID) {
            setMessage("User authentication error. Please log in again.");
            return;
        }
        setLoading(true);
        try {
            const response = await fetch("http://107.23.196.38:5000/api/Resume/generate-suggestions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ jobDescription, userID: user.userID }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                setMessage(`Error: ${errorText}`);
            } else {
                const jsonResponse = await response.json(); // Parse JSON response
                console.log("Full API Response:", jsonResponse);
                const suggestionsList = jsonResponse.choices[0]?.message?.content.split("\n") || [];
                setSuggestions(suggestionsList); // Store suggestions as an array
            }
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        }
     finally {
        setLoading(false); // Stop loading
    }
    };

    return (
        <div className="content">
            <div className="panel">
                <h1>Resume Builder</h1>

                {/* PDF Upload */}
                <input
                    type="file"
                    accept=".pdf"
                    id="fileInput"
                    className="hidden-file-input"
                    onChange={handleFileChange}
                />
                <label htmlFor="fileInput" onClick={uploadResume} className="custom-file-button">
                    Choose File
                </label>
                 {/* Display Selected File Name */}
            {file && <p className="file-name">Selected File: {file.name}</p>}
                <br></br>
                <button className="button" onClick={uploadResume} disabled={loading}>
                    Upload Resume
                </button>
                <br></br>
                {/* Job Description Input */}
                <textarea
                    className="textArea"
                    placeholder="Enter job description"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                />
                <br></br>
                <button className="button" onClick={generateSuggestions} disabled={loading}>
                    Generate Suggestions
                </button>

                {/* Loading Spinner */}
                {loading && <div className="loading-spinner">Loading...</div>}

                {/* Display Messages */}
                {message && <p className="message">{message}</p>}

                {/* Display Suggestions */}
                {suggestions.length > 0 && (
                    <div className="suggestionsBox">
                        <h2>Recommended Skills, Projects, Keywords</h2>
                        <ul>
                            {suggestions.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Resume;