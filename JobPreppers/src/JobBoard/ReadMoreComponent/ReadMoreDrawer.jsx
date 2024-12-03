import React from "react";
import { Drawer, Box, Typography, Divider } from "@mui/material";
import Header from "./Header";
import PaymentsIcon from "@mui/icons-material/Payments";
import WorkIcon from "@mui/icons-material/Work";
import "./ReadMoreStyle.css";
import PlaceIcon from "@mui/icons-material/Place";

const drawerWidth = 600;

export default function ReadMoreDrawer({ open, job, onClose }) {
  if (!job) return null; // Render nothing if no job is selected

  return (
    <Drawer anchor="right" variant="persistent" open={open} onClose={onClose}>
      <Box sx={{ width: drawerWidth, padding: 2 }}>
        <Header job={job} onClose={onClose} />

        {/* Divider */}
        <Divider className="custom-divider" />
        <Box>
          <Typography className="start-text">Brief Overview </Typography>
          <Box className="description-box">
            <PaymentsIcon />
            <Typography variant="body" sx={{ color: "text.secondary" }}>
              {job.pay_range}
            </Typography>
          </Box>
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
