import "../App.css"
import React, { useState, useEffect } from "react";

function Messaging() {
    const [opened, setOpened] = useState(false);

    const handleMessagingClicked = (e) => {
        e.preventDefault();
        setOpened(!opened);
    }
    return (
        <div
        className="fixed bottom-4 right">
            <button onClick={handleMessagingClicked}>
                {opened ? "Close messaging" : "Open Messaging"}
            </button>
        </div>
    );

}

export default Messaging;