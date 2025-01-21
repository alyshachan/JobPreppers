

import "../Components/JobPreppers.css"
import React, { useState } from "react";
import { useAuth } from "../provider/authProvider";


function Resume() {
    const { user } = useAuth(); // Get the authenticated user's data
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const uploadResume = async () => {
        if (!file) {
            setMessage("Please select a file.");
            return;
        }

        if (!user?.id) {
            setMessage("User authentication error. Please log in again.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("userId", user.id); // Use authenticated user's ID

        try {
            const response = await fetch("/api/Resume/upload-resume", {
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

                {/* Display upload message */}
                {message && <p>{message}</p>}
            </div>
        </div>
    );
}

export default Resume;
