import { Typography, IconButton, Avatar, Button, Box } from "@mui/material";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import CloseIcon from "@mui/icons-material/Close";
import amazonIcon from "../Img/amazon-icon.png";
import moment from "moment";
import styles from "../Jobs.module.css";
import { useAuth } from "../../../provider/authProvider";
import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import axios from 'axios'; // Import axios

export default function Header({ job, onClose }) {
  const { user } = useAuth();
  const userID = user?.id;
  const [applyCount, setApplyCount] = useState(0);
  const apiURL = process.env.REACT_APP_JP_API_URL;

  useEffect(() => {
    const fetchApplyCount = async () => {
      try {
        const response = await fetch(`${apiURL}/api/Application/count/${job.jobID}`, {
          method: "GET",
          credentials: "include", // if your API needs cookies
        });
  
        if (!response.ok) throw new Error("Request failed");
  
        const data = await response.json();
        setApplyCount(data.applicantCount);
      } catch (err) {
        console.error("Failed to fetch apply count", err);
      }
    };
  
    fetchApplyCount();
  }, [job.jobID]);

  const handleApplyClick = async (e) => {
    e.preventDefault();
  
    try {
      const payload = {
        userID: user.userID, // Correctly reference userID from user object
        recruiterID: 1,
        postID: job.jobID,
      };
      console.log("Job Object:", JSON.stringify(job, null, 2));
      console.log(`Payload to be sent: 
        userID: ${payload.userID}, 
        recruiterID: ${payload.recruiterID}, 
        postID: ${payload.postID}
      `);
      const response = await axios.post(
        `${apiURL}/api/Application/ClickedApply`,
        payload
      );
  
      if (response.status === 200 &&
        response.data?.message !== "User has already applied to this job post.") {
        setApplyCount((prev) => prev + 1);
      } 
    } catch (err) {
      console.error("Error applying to job", err);
      alert("Failed to apply. Please try again.");
    }
  };

  
  return (
    <>
      {/* Header Section */}
      <Box className={styles.drawerHeader}>
        <Avatar src={amazonIcon} aria-label="amazon">
          {job.company[0]}
        </Avatar>
        <Typography variant="h4" sx={{ ml: 2 }}>
          {job.company}
        </Typography>

        {/* Right Section (IconButton aligned to the right) */}
        <IconButton onClick={onClose} sx={{ ml: "auto" }}>
          <CloseIcon />
        </IconButton>
      </Box>
      {/* Job Title and Additional Information */}
      <Box sx={{ mt: 2 }}>
        <Typography sx={{ fontWeight: "bold" }} variant="h5">
          {job.title}
        </Typography>
        <Typography sx={{ typography: "body1" }}>
          Posted on {new Date(job.postDate).toLocaleDateString()} &nbsp; |
          &nbsp; Apply by {new Date(job.endDate).toLocaleDateString()}
          &nbsp; at {new Date(job.postDate).toLocaleTimeString()}
        </Typography>
        <button className={`${styles.drawerButton} lightButton`}>
          <BookmarkBorderIcon />
          Bookmark
        </button>
        <button
            onClick={async (e) => {
              e.preventDefault();

              // Call the function to handle application submission
              await handleApplyClick(e);

              // Now check if there is a job link and open it
              if (job.link) {
                window.open(job.link);
              } else {
                window.open("http://google.com");
              }
            }}
            className={styles.drawerButton}
          >
            Apply
        </button>
          {/* Display the number of applicants */}
          <Typography sx={{ mt: 1, ml: 1 }} variant="body2">
          People who have clicked Apply: <strong>{applyCount}</strong>
        </Typography>
      </Box>
    </>
  );
}
