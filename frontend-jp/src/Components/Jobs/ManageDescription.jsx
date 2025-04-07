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
import { useAuth } from "../../provider/authProvider";
import { useMutation } from "@tanstack/react-query";
import EditIcon from "@mui/icons-material/Edit";

const apiURL = process.env.REACT_APP_JP_API_URL;

function ManageDescription({ setDrawerOpen, jobs, setJobs }) {
  const { user } = useAuth();
  const [selectedJob, setSelectedJob] = useState(null); // Track the currently selected job
  const handleOpenDrawer = (job) => {
    setSelectedJob(job);
    setDrawerOpen(true); // Open the drawer when "Learn More" is clicked
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false); // Close the drawer
    setSelectedJob(null);
  };
  const deleteJob = async (job) => {
    console.log("Job from the frontend: ", job);
    console.log("JobID from the frontend: ", job.jobID);

    const res = await fetch(apiURL + "/api/Manage/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jobID: job.jobID,
        userID: user.userID,
      }),
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error("Failed to Delete Job");
    }
    return res.json();
  };

  const fetchJobs = async () => {
    try {
      const res = await fetch(apiURL + `/api/Manage/?userID=${user.userID}`, {
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs);
      }
    } catch (error) {
      console.error("Error Getting Jobs:", error);
    }
  };

  // Use Mutation for Post calls and anything involving user doing an action
  const {
    mutate: deleteMutation,
    isPending: isParseLoading,
    isError,
  } = useMutation({
    mutationFn: (data) => {
      if (!user?.userID) {
        throw new Error("Invalid job or user data");
      }
      return deleteJob(data);
    },
    onSuccess: (data) => {
      console.log("Sucessful");
      fetchJobs();
    },
    onError: (error) => {
      console.error("Error Deleting Job:", error);
    },
  });

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
                <IconButton aria-label="edit button">
                  <EditIcon />
                </IconButton>
                <IconButton
                  aria-label="highlight-off"
                  onClick={() => deleteMutation(job)}
                >
                  <HighlightOffIcon />
                </IconButton>
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

export default ManageDescription;
