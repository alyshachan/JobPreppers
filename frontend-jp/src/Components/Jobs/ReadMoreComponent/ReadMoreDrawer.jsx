import React, { useState, useEffect } from "react";
import { Drawer, Box, Typography, Divider } from "@mui/material";
import Header from "./Header";
import PaymentsIcon from "@mui/icons-material/Payments";
import WorkIcon from "@mui/icons-material/Work";
import PlaceIcon from "@mui/icons-material/Place";
import "./ReadMoreStyle.css";
import styles from "../Jobs.module.css"

export default function ReadMoreDrawer({ open, job, onClose }) {
  const [isNarrow, setIsNarrow] = useState(window.innerWidth < 1200); // Initial state based on window width

  useEffect(() => {
    const handleResize = () => {
      setIsNarrow(window.innerWidth < 1200); // Update isNarrow based on window width
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize); // Cleanup
  }, []);

  const drawerWidth = isNarrow ? "100%" : "600px";

  if (!job) return null;

  return (
    <Drawer
      anchor="right"
      variant="persistent"
      open={open}
      onClose={onClose}
      hideBackdrop
      PaperProps={isNarrow ? styles.drawer : styles.drawerNarrow}
    >
      <Box sx={{ width: drawerWidth, padding: 2 }}>
        <Header job={job} onClose={onClose} />

        {/* Divider */}
        <Divider className="custom-divider" />
        <Box>
          <Typography className="start-text">Brief Overview </Typography>
          {job.max_salary == null ? (
            <Box className={styles.descriptionBox}>
              <PaymentsIcon />
              <Typography variant="body" className={styles.descriptionText}>
                ${job.min_salary}
              </Typography>
            </Box>
          ) : (
            <Box className={styles.descriptionBox}>
              <PaymentsIcon />
              <Typography variant="body" className={styles.descriptionText}>
                ${job.min_salary} - ${job.max_salary}
              </Typography>
            </Box>
          )}
          <Box className={styles.descriptionBox}>
            <WorkIcon />
            <Typography variant="body" className={styles.descriptionText}>
              {job.type}
            </Typography>
          </Box>
          <Box className={styles.descriptionBox}>
            <PlaceIcon />
            <Typography variant="body" className={styles.descriptionText}>
              {job.location}
            </Typography>
          </Box>

          <Divider className="custom-divider" />
        </Box>

        <Box>
          <Typography className="start-text"> Benefits</Typography>
          <Typography sx={{ typography: "body1" }}>{job.benefit}</Typography>
        </Box>
        <Divider className="custom-divider" />

        <Box>
          <Typography className="start-text"> Job Description</Typography>
          <Typography sx={{ typography: "body1" }}>
            {job.description || "No description provided."}
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
}
