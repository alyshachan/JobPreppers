import React, { useState } from "react";
import { Box } from "@mui/material";
import SearchColumn from "../Components/Jobs/SearchColumn";
import "../Components/JobPreppers.css";
import styles from "../Components/Jobs/Jobs.module.css";
import FilterColumn from "../Components/Jobs/FilterColumn";
import JobDescription from "../Components/Jobs/JobDescription";
import ReadMore from "../Components/Jobs/ReadMoreComponent/ReadMoreDrawer";
import NoResultPage from "../Components/Jobs/Posting/NoResultPage";
import { useQuery } from "@tanstack/react-query";
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

  // const fetchUser = async () => {
  //     const res = await fetch(
  //       `http://localhost:5000/api/GetUser/${user.userID}`,
  //       {
  //         credentials: "include", // include cookies
  //       }
  //     );

  //     if (!res.ok) {
  //       throw new Error("Failed to fetch user");
  //     }
  //     return res.json();
  //   };

  //   const { data: initialUser, isLoading, isError } = useQuery({
  //     queryKey: ["user", user.userID], // Cache key based on userID
  //     queryFn: () => fetchUser(user.userID),
  //     enabled: !!user.userID, // Prevent fetching if userID is undefined
  //   });

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
                setJobs={setJobs}
              />
              <FilterColumn
                setJobs={setJobs}
                jobs={jobs}
                filters={filters}
                setFilters={setFilters}
                userCoordinate={userCoordinate}
              />

              {}
            </div>
            {jobs.length > 0 ? (
              <div className={styles.containerForCard}>
                <JobDescription setDrawerOpen={setDrawerOpen} jobs={jobs} />
              </div>
            ) : (
              <NoResultPage />
            )}
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
