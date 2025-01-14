

import "../Components/JobPreppers.css"
function Resume() {
    return (
        <div className="content">
            <div className="panel">
                <h1>Resume Builder</h1>

                {/* Job Description Input */}
                <textarea 
                    className="textArea" 
                    placeholder="Enter job description here..."
                />

                {/* PDF Upload */}
                <input 
                    type="file" 
                    accept=".pdf" 
                    className="fileInput"
                />

                {/* Generate Suggestions Button */}
                <button className="button">
                    Generate Suggestions
                </button>

                {/* Output Suggestions */}
                <textarea 
                    className="textArea" 
                    placeholder="Suggestions will appear here..." 
                    readOnly
                />
            </div>
        </div>
    );
}

export default Resume;