import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import SearchColumn from "../JobBoard/SearchColumn";
import "../JobBoard/JobSection.css";
import FilterColumn from "../JobBoard/FilterColumn";
import JobDescription from "../JobBoard/JobDescription";
import ReadMore from "../JobBoard/ReadMoreComponent/ReadMoreDrawer";

const drawerWidth = 600;

function Jobs() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [userCoordinate, setUserCoordinate] = useState(null);

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
        }}
      >
        {/* Main Content Area */}
        <Box
          sx={{
            display: drawerOpen && { xs: "flex", md: "block" }, // Hide Main Content on small screens when Drawer is open
            flexBasis: drawerOpen ? `calc(200% - ${drawerWidth})` : "100%",
            transition: "flex 0.3s ease-in-out",
            overflowY: drawerOpen ? "auto" : "none",
            flexDirection: { xs: "column", md: "row" },
            width: "100%",
          }}
        >
          <div className="content">
            <div className="main-panel !bg-transparent !shadow-none !p-0 items-center">
              <SearchColumn setUserCoordinate={setUserCoordinate} />
              <FilterColumn
                setJobs={setJobs}
                jobs={jobs}
                userCoordinate={userCoordinate}
              />
            </div>
            <JobDescription setDrawerOpen={setDrawerOpen} jobs={jobs} />
          </div>
        </Box>

        {/* Drawer Area */}
        <Box
          sx={{
            display: drawerOpen ? "flex" : "none", // Only show when the drawer is open
            flexBasis: drawerOpen ? "100%" : "0%", // Drawer occupies 50% when open
            transition: "flex-basis 0.3s ease-in-out",
            backgroundColor: "red",
          }}
        >
          <ReadMore />
        </Box>
      </Box>
    </>
  );
}

export default Jobs;
