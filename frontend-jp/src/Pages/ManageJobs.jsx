import React, { useState, useEffect } from "react";
import { Box, TextField, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import SearchColumn from "../Components/Jobs/SearchColumn";
import "../Components/JobPreppers.css";
import styles from "../Components/Jobs/Jobs.module.css";
import FilterColumn from "../Components/Jobs/FilterColumn";
import ReadMore from "../Components/Jobs/ReadMoreComponent/ReadMoreDrawer";
import NoResultPage from "../Components/Jobs/Posting/NoResultPage";
import { useAuth } from "../provider/authProvider";
import ManageDescription from "../Components/Jobs/ManageDescription";
import { useQuery } from "@tanstack/react-query";
const apiURL = process.env.REACT_APP_JP_API_URL;

function ManageJobs() {
  const { user } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [jobName, setJobName] = useState("");

  const fetchJobs = async () => {
    console.log("Went into fetch job for manage job");

    try {
      const res = await fetch(apiURL + `/api/Manage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userID: user.userID,
          search_query: jobName,
        }),
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        console.log("Manage Job: ", data.jobs);
        setJobs(data.jobs);
        return data;
      }
    } catch (error) {
      console.error("Error Getting Jobs:", error);
    }
  };

  const {
    data: job,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["manageJobs", user?.userID, jobName],
    queryFn: () => fetchJobs(),
    enabled: !!user?.userID,
  });

  const clearName = (e) => {
    e.preventDefault();
    if (jobName) {
      setJobName("");
    }
  };

  return (
    <>
      <Box className={styles.jobs}>
        {/* Main Content Area */}
        <Box
          className={`${styles.mainContent} ${
            drawerOpen ? styles.drawerOpen : ""
          }`}
        >
          <div className="content">
            <div className="flex flex-col w-full p-5">
              <TextField
                label="Search"
                id="search-input"
                className={styles.searchTextField}
                type="text"
                value={jobName}
                onChange={(e) => setJobName(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: <SearchIcon position="start" />,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton aria-label="close" onClick={clearName}>
                          <CloseOutlinedIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              {jobs.length > 0 ? (
                <div>
                  <Typography variant="subtitle1" sx={{ color: "grey" }}>
                    {" "}
                    {jobs.length} job{jobs.length !== 1 ? "s" : ""} were found.
                  </Typography>
                  <div className={styles.containerForCard}>
                    <ManageDescription
                      setDrawerOpen={setDrawerOpen}
                      jobs={jobs}
                      setJobs={setJobs}
                      onRefresh={refetch}
                    />
                  </div>
                </div>
              ) : (
                <NoResultPage />
              )}
            </div>
          </div>
        </Box>

        {/* Drawer Area */}
        <Box
          className={`${styles.drawer} ${drawerOpen ? styles.drawerOpen : ""}`}
        >
          <ReadMore />
        </Box>
      </Box>
    </>
  );
}

export default ManageJobs;
