import React from "react";
import { Drawer, Box, Typography, Divider } from "@mui/material";
import Header from "./Header";
import PaymentsIcon from "@mui/icons-material/Payments";
import WorkIcon from "@mui/icons-material/Work";
import PlaceIcon from "@mui/icons-material/Place";
import "./ReadMoreStyle.css";

const drawerWidth = 600;

export default function ReadMoreDrawer({ open, job, onClose }) {
  if (!job) return null; // Render nothing if no job is selected

  return (
    <Drawer
      anchor="right"
      variant="persistent"
      open={open}
      onClose={onClose}
      hideBackdrop
      sx={{
        width: {
          xs: "100%", // Full width on small screens
          sm: "50%",  // 50% width on medium screens
          md: drawerWidth,  // Fixed width (600px) on large screens
        },
        flexShrink: 0, // Prevent shrinking of the drawer
        transition: "width 0.3s ease-in-out", // Smooth transition for opening/closing
      }}
    >
      <Box sx={{ width: drawerWidth, padding: 2 }}>
        <Header job={job} onClose={onClose} />

        {/* Divider */}
        <Divider className="custom-divider" />
        <Box>
          <Typography className="start-text">Brief Overview </Typography>
          {job.max_salary == null ? (
            <Box className="description-box">
              <PaymentsIcon />
              <Typography variant="body" sx={{ color: "text.secondary" }}>
                ${job.min_salary}
              </Typography>
            </Box>
          ) : (
            <Box className="description-box">
              <PaymentsIcon />
              <Typography variant="body" sx={{ color: "text.secondary" }}>
                ${job.min_salary} - ${job.max_salary}
              </Typography>
            </Box>
          )}
          <Box className="description-box">
            <WorkIcon />
            <Typography variant="body" sx={{ color: "text.secondary" }}>
              {job.type}
            </Typography>
          </Box>
          <Box className="description-box">
            <PlaceIcon />
            <Typography variant="body" sx={{ color: "text.secondary" }}>
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
            {" "}
            {job.description || "No description provided."}{" "}
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
}
