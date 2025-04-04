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
import {
  CircularProgressbar,
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const apiURL = process.env.REACT_APP_JP_API_URL;

function JobDescription({ setDrawerOpen, jobs }) {
  const [selectedJob, setSelectedJob] = useState(null); // Track the currently selected job
  const handleOpenDrawer = (job) => {
    setSelectedJob(job);
    setDrawerOpen(true); // Open the drawer when "Learn More" is clicked
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false); // Close the drawer
    setSelectedJob(null);
  };

  const [bookmarkedJobs, setBookmarkedJobs] = useState([]);
  const { user } = useAuth();
  useEffect(() => {
    const fetchBookmarkedJobs = async () => {
      try {
        const res = await fetch(
          apiURL + `/api/Bookmark/getBookmark/?userID=${user.userID}`,
          { credentials: "include" }
        );

        if (res.ok) {
          const data = await res.json();
          setBookmarkedJobs(data);
        }
      } catch (error) {
        console.error("Error Getting Jobs:", error);
      }
    };
    if (user?.userID) {
      fetchBookmarkedJobs();
    }
  }, [user?.userID]);
  const percentage = 55;

  return (
    <>
      {console.log(jobs)}
      {jobs.map((job, index) => (
        <Card key={job.jobID} className={styles.mainCard}>
          <Box className="flex-row w-2/3 max-h-full">
            <CardHeader
              avatar={
                <Avatar src={amazonIcon} aria-label="recipe">
                  {job.company[0]}
                </Avatar>
              }
              title={job.title}
              subheader={job.company}
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
                    <Typography
                      variant="body"
                      className={styles.descriptionText}
                    >
                      {job.type}
                    </Typography>
                  </Box>
                  <Box className={styles.descriptionBox}>
                    <PlaceIcon />
                    <Typography
                      variant="body"
                      className={styles.descriptionText}
                    >
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
          </Box>
          <Box className="flex-col p-2 justify-center w-1/3 h-full">
            <div className="flex justify-end">
              <Bookmark
                jobID={job.jobID}
                setBookmarkedJobs={setBookmarkedJobs}
                bookmarkedJobs={bookmarkedJobs}
              />
              <IconButton aria-label="highlight-off " className="p-0 m-0">
                <HighlightOffIcon />
              </IconButton>
            </div>
            <CircularProgressbar
              value={job.score}
              text={`${job.score}%`}
              styles={buildStyles({
                // Rotation of path and trail, in number of turns (0-1)
                rotation: 0.25,

                // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                strokeLinecap: "butt",

                // Text size
                textSize: "16px",

                // How long animation takes to go from one percentage to another, in seconds
                pathTransitionDuration: 0.5,

                // Can specify path transition in more detail, or remove it entirely
                // pathTransition: 'none',

                // Colors
                pathColor: `rgba(62, 152, 199, ${percentage / 100})`,
                textColor: "#f88",
                trailColor: "#d6d6d6",
                backgroundColor: "#3e98c7",
              })}
            />
          </Box>
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
