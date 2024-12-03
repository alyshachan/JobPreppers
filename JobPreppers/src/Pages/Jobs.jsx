import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import SearchColumn from "../JobBoard/SearchColumn";
import "../JobBoard/JobSection.css";
import FilterColumn from "../JobBoard/FilterColumn";
import JobDescription from "../JobBoard/JobDescription";
import ReadMore from "../JobBoard/ReadMoreComponent/ReadMoreDrawer";

function Jobs() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [jobs, setJobs] = useState([]);

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
      <Box
        sx={{
          display: "flex",
          width: "100%",
          height: "100vh",
          transition: "all 0.3s ease-in-out",
        }}
      >
        {/* Main Content Area */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flexBasis: drawerOpen ? "55%" : "100%", // Main content takes up 50% when drawer is open
            transition: "flex-basis 0.3s ease-in-out",
            overflowY: "auto",
          }}
        >
          <div className="content">
            <div className="main-panel !bg-transparent !shadow-none !p-0 items-center">
              <SearchColumn />
              <FilterColumn setJobs={setJobs} jobs={jobs} />
            </div>
            <JobDescription setDrawerOpen={setDrawerOpen} jobs={jobs} />
          </div>
        </Box>

        {/* Drawer Area */}
        <Box
          sx={{
            display: drawerOpen ? "flex" : "none", // Only show when the drawer is open
            flexBasis: drawerOpen ? "50%" : "0%", // Drawer occupies 50% when open
            transition: "flex-basis 0.3s ease-in-out",
            overflowY: "auto",
          }}
        >
          <ReadMore />
        </Box>
      </Box>
    </>
  );
}

export default Jobs;
