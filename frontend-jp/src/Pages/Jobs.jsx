import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import SearchColumn from "../Components/Jobs/SearchColumn";
import "../Components/JobPreppers.css";
import styles from "../Components/Jobs/Jobs.module.css";
import FilterColumn from "../Components/Jobs/FilterColumn";
import JobDescription from "../Components/Jobs/JobDescription";
import ReadMore from "../Components/Jobs/ReadMoreComponent/ReadMoreDrawer";

function Jobs() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const [filters, setFilters] = useState({
    date: null,
    type: [],
    company: [],
    min_salary: 0,
    longitude: null,
    latitude: null,
    distance: 0,
  });

  const [jobs, setJobs] = useState([]);
  const [userCoordinate, setUserCoordinate] = useState({
    latitude: null,
    longitude: null,
  });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/job");
        if (res.ok) {
          const data = await res.json();
          console.log(data);
          setJobs(data);
        } else {
          console.error("Failed to fetch jobs");
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, []);
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
            <div className="panelTransparent !p-0 items-center">
              <SearchColumn
                setUserCoordinate={setUserCoordinate}
                setFilters={setFilters}
              />
              <FilterColumn
                setJobs={setJobs}
                jobs={jobs}
                filters={filters}
                setFilters={setFilters}
                userCoordinate={userCoordinate}
              />
            </div>
            <JobDescription setDrawerOpen={setDrawerOpen} jobs={jobs} />
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

export default Jobs;
