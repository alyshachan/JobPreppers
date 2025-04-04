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
import { useQuery } from "@tanstack/react-query";
import CompanyViewJobDescription from "../Components/Jobs/CompanyViewJobDescription";
import { use } from "react";
const apiURL = process.env.REACT_APP_JP_API_URL;

async function fetchCompanyStatus(userID) {
  console.log("user id in fetchStatus: ", userID);
  const res = await fetch(apiURL + `/api/Company/isCompany/?userID=${userID}`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch company status");
  }
  let result = await res.json();
  setIsUserCompany(result.isCompany);
  return result.isCompany;
}

function Jobs() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [IsUserCompany, setIsUserCompany] = useState(false);
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    date: null,
    type: [],
    company: [],
    min_salary: 0,
    longitude: null,
    latitude: null,
    distance: 0,
    userID: user?.userID,
  });
  const [jobs, setJobs] = useState([]);
  const [userCoordinate, setUserCoordinate] = useState({
    latitude: null,
    longitude: null,
  });
  useEffect(() => {
    if (user?.userID) {
      setFilters((prev) => ({ ...prev, userID: user.userID }));
    }
  }, [user]);

  const {
    data: isCompany,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["isCompany", user?.userID],
    queryFn: () => fetchCompanyStatus(user.userID),
    enabled: !!user?.userID, // Only run if userID exists
  });

  if (!user) return <div>Loading user...</div>;
  if (isLoading) return <div>Loading Job Board...</div>;
  if (isError) return <div>Error loading Job Board. Try again later.</div>;

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
                IsUserCompany={IsUserCompany}
                userCoordinate={userCoordinate}
              />

              {}
            </div>
            {isCompany ? (
              jobs.length > 0 ? (
                <div className={styles.containerForCard}>
                  <CompanyViewJobDescription
                    setDrawerOpen={setDrawerOpen}
                    jobs={jobs}
                  />
                </div>
              ) : (
                <NoResultPage />
              )
            ) : jobs.length > 0 ? (
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
