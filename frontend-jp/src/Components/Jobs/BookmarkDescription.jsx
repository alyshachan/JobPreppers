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
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import PaidIcon from "@mui/icons-material/Paid";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import PlaceIcon from "@mui/icons-material/Place";
import amazonIcon from "./Img/amazon-icon.png";
import ReadMoreDrawer from "./ReadMoreComponent/ReadMoreDrawer";
import styles from "./Jobs.module.css";
import "../JobPreppers.css";
import Bookmark from "./Posting/Helper/Bookmark";
import { useAuth } from "../../provider/authProvider";
function BookmarkDescription({
  setDrawerOpen,
  jobs,
  bookmarkedJobs,
  setBookmarkedJobs,
}) {
  const [selectedJob, setSelectedJob] = useState(null); // Track the currently selected job
  const handleOpenDrawer = (job) => {
    setSelectedJob(job);
    setDrawerOpen(true); // Open the drawer when "Learn More" is clicked
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false); // Close the drawer
    setSelectedJob(null);
  };

  const { user } = useAuth();

  return (
    <>
      {console.log(jobs)}
      {jobs.map((job, index) => (
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
                <Bookmark
                  jobID={job.jobID}
                  setBookmarkedJobs={setBookmarkedJobs}
                  bookmarkedJobs={bookmarkedJobs}
                />
                {/* <IconButton aria-label="highlight-off">
                  <HighlightOffIcon />
                </IconButton> */}
              </>
            }
          />
          <CardContent>
            <Box className={styles.cardIconDetails}>
              <Stack direction="column" spacing={2}>
                {job.maximumSalary == null ? (
                  <Box className={styles.descriptionBox}>
                    <PaidIcon />
                    <Typography
                      variant="body"
                      className={styles.descriptionText}
                    >
                      ${job.minimumSalary}
                    </Typography>
                  </Box>
                ) : (
                  <Box className={styles.descriptionBox}>
                    <PaidIcon />
                    <Typography
                      variant="body"
                      className={styles.descriptionText}
                    >
                      ${job.minimumSalary} - ${job.maximumSalary}
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
                Apply by {new Date(job.endDate).toLocaleDateString()}
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

export default BookmarkDescription;
