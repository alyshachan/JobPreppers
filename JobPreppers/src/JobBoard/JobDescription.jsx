import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  CardActions,
  CardContent,
  Stack,
  Typography,
  Avatar,
  CardHeader,
  IconButton,
  Box,
} from "@mui/material";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import PaidIcon from "@mui/icons-material/Paid";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import PlaceIcon from "@mui/icons-material/Place";
import amazonIcon from "./Img/amazon-icon.png";
import "./JobSection.css";
import ReadMoreDrawer from "./ReadMoreComponent/ReadMoreDrawer";

function JobDescription({ setDrawerOpen, jobs }) {
  //   const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null); // Track the currently selected job

  const handleOpenDrawer = (job) => {
    setSelectedJob(job);
    setDrawerOpen(true); // Open the drawer when "Learn More" is clicked
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false); // Close the drawer
    setSelectedJob(null);
  };

  return (
    <>
      {jobs.map((job) => (
        <Card key={job.jobID} sx={{ minWidth: 500, margin: 2 }}>
          <CardHeader
            avatar={
              <Avatar src={amazonIcon} aria-label="recipe">
                {job.company[0]}
              </Avatar>
            }
            title={job.title}
            subheader={job.company}
            action={
              <>
                <IconButton aria-label="bookmark">
                  <BookmarkBorderIcon />
                </IconButton>
                <IconButton aria-label="highlight-off">
                  <HighlightOffIcon />
                </IconButton>
              </>
            }
          />
          <CardContent>
            <Stack
              direction="column"
              spacing={2}
              sx={{ width: "100%", display: "flex", justifyContent: "center" }}
            >
              {job.max_salary == null ? (
                <Box className="description-box">
                  <PaidIcon />
                  <Typography variant="body" sx={{ color: "text.secondary" }}>
                    ${job.min_salary}
                  </Typography>
                </Box>
              ) : (
                <Box className="description-box">
                  <PaidIcon />
                  <Typography variant="body" sx={{ color: "text.secondary" }}>
                    ${job.min_salary} - ${job.max_salary}
                  </Typography>
                </Box>
              )}
              <Box className="description-box">
                <AccessTimeFilledIcon />
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
            </Stack>
          </CardContent>
          <CardActions>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexBasis: "100%",
              }}
            >
              <Typography variant="body" sx={{ color: "text.secondary" }}>
                Apply by {new Date(job.fill_by_date).toLocaleDateString()}
              </Typography>
              <Button
                onClick={() => handleOpenDrawer(job)}
                variant="contained"
                className="learn-more-button"
              >
                Learn More
              </Button>
            </Box>
          </CardActions>
        </Card>
      ))}

      {/* Drawer for displaying job details */}
      <ReadMoreDrawer
        open={selectedJob != null}
        job={selectedJob}
        onClose={handleCloseDrawer}
      />
    </>
  );
}

export default JobDescription;
