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
import ReadMoreDrawer from "./ReadMoreComponent/ReadMoreDrawer";
import styles from "./Jobs.module.css";
import "../JobPreppers.css";

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
        <Card key={job.jobID} className={styles.card}>
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
            <Box className={styles.cardIconDetails}>
              <Stack direction="column" spacing={2}>
                {job.max_salary == null ? (
                  <Box className={styles.descriptionBox}>
                    <PaidIcon />
                    <Typography
                      variant="body"
                      className={styles.descriptionText}
                    >
                      ${job.min_salary}
                    </Typography>
                  </Box>
                ) : (
                  <Box className={styles.descriptionBox}>
                    <PaidIcon />
                    <Typography
                      variant="body"
                      className={styles.descriptionText}
                    >
                      ${job.min_salary} - ${job.max_salary}
                    </Typography>
                  </Box>
                )}
                <Box className={styles.descriptionBox}>
                  <AccessTimeFilledIcon />
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
              </Stack>
            </Box>
          </CardContent>

          <CardActions>
            <Box className={styles.descriptionFooter}>
              <Typography variant="body" className={styles.descriptionText}>
                Apply by {new Date(job.fill_by_date).toLocaleDateString()}
              </Typography>
              <button
                onClick={() => handleOpenDrawer(job)}
                variant="contained"
                className="lightButton"
              >
                Learn More
              </button>
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
