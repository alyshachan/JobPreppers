import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import SearchColumn from "../Components/Jobs/SearchColumn";
import "../Components/JobPreppers.css";
import styles from "../Components/Jobs/Jobs.module.css";
import FilterColumn from "../Components/Jobs/FilterColumn";
import JobDescription from "../Components/Jobs/JobDescription";
import ReadMore from "../Components/Jobs/ReadMoreComponent/ReadMoreDrawer";
import NoResultPage from "../Components/Jobs/Posting/NoResultPage";
import { useAuth } from "../provider/authProvider";
function ManageJobs() {
  const { user } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [jobs, setJobs] = useState([]);
  useEffect(() => {
    if (!user?.userID) return;

    const fetchJobs = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/Manage/?userID=${user.userID}`,
          { credentials: "include" }
        );

        if (res.ok) {
          const data = await res.json();
          setJobs(data.jobs);
        }
      } catch (error) {
        console.error("Error Getting Jobs:", error);
      }
    };

    fetchJobs();
  }, [user?.userID]);

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
              {/* <SearchColumn
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
              /> */}

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

export default ManageJobs;
