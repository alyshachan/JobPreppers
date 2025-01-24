

import "../Components/JobPreppers.css"
import React, { useState } from "react";
import { useAuth } from "../provider/authProvider";


function Resume() {
    const { user } = useAuth(); // Get the authenticated user's data
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");
    const [jobDescription, setJobDescription] = useState(""); // Add jobDescription state
    const [suggestions, setSuggestions] = useState(""); // Add suggestions state

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const uploadResume = async () => {

        console.log("User:", user);
        if (!file) {
            setMessage("Please select a file.");
            return;
        }

      
    if (!user?.userID) { // Use userID instead of id
        setMessage("User authentication error. Please log in again.");
        return;
    }
    console.log("UserID is :", user.userID);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userID", user.userID); // Use userID instead of id

        try {
            const response = await fetch("http://localhost:5000/api/Resume/PostFile", {
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
    
        try {
            const response = await fetch("http://localhost:5000/api/Resume/generate-suggestions", {
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
                const suggestionsText = jsonResponse.choices[0]?.message?.content || "No suggestions available."; // Extract text content
                setMessage(suggestionsText); // Set just the text as the message
            }
        } catch (error) {
            setMessage(`Error: ${error.message}`);
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
                    className="fileInput"
                    onChange={handleFileChange}
                />
                <button className="button" onClick={uploadResume}>
                    Upload Resume
                </button>
    
                {/* Job Description Input */}
                <textarea
                    className="textArea"
                    placeholder="Enter job description"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                />
                <button className="button" onClick={generateSuggestions}>
                    Generate Suggestions
                </button>
    
                {/* Display Messages and Suggestions */}
                {message && <p>{message}</p>}
                {suggestions && <div className="suggestions">{suggestions}</div>}
            </div>
        </div>
    );
}

export default Resume;
