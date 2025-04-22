import "./Jobs.css";
import Stack from "@mui/material/Stack";
import Salary from "./FilterMenu/Salary";
import JobType from "./FilterMenu/JobType";
import Distance from "./FilterMenu/Distance";
import DueDate from "./FilterMenu/DueDate";
import Company from "./FilterMenu/Company";
import { SvgIcon, IconButton, Typography } from "@mui/material";

import { useEffect, useState, useRef } from "react";
import styles from "./Jobs.module.css";
const apiURL = process.env.REACT_APP_JP_API_URL;

export default function FilterColumn({
  setJobs,
  jobs,
  filters,
  setFilters,
  userCoordinate,
  IsUserCompany,
  setPageSize,
  NumberPerPage,
}) {
  const [isOverflowing, setIsOverflowing] = useState(false);
  const containerRef = useRef(null);
  const [error, setError] = useState(null); // Define error state here
  const [total, setTotal] = useState(0); // Define error state here

  useEffect(() => {
    const handleSearch = async () => {
      // e.preventDefault(); // Prevent default form submission
      if (filters.userID == null || IsUserCompany == null) {
        return;
      }
      try {
        const endpoint = IsUserCompany
          ? "/api/jobpost/filterCompanyView"
          : "/api/jobpost/filter";
        const response = await fetch(apiURL + endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(filters),
          credentials: "include",
        });

        if (response.ok) {
          const { newJobs, totalCount } = await response.json();
          setJobs(newJobs);
          setPageSize(Math.ceil(totalCount / NumberPerPage));
          setTotal(totalCount);
        } else {
          const errorData = await response.json();
          console.log("Error: ", { errorData });

          setError(errorData.message); // Show error message from the backend
        }
      } catch (err) {
        console.log("Catch Error");
        setError("An error occurred. Please try again."); // Catch and display any request error
      }
    };
    handleSearch();
  }, [filters]);

  const checkOverflow = () => {
    const container = containerRef.current;
    if (container) {
      setIsOverflowing(container.scrollWidth > container.clientWidth);
    }
  };

  useEffect(() => {
    checkOverflow();
    window.addEventListener("resize", checkOverflow);

    return () => window.removeEventListener("resize", checkOverflow);
  }, []);

  return (
    <>
      <div ref={containerRef} className="filter-column-container">
        <Stack
          direction="row"
          spacing={2}
          className={`${styles.filterColumn} ${
            isOverflowing ? styles.filterColumnOverflow : ""
          }`}
        >
          <Salary setFilters={setFilters} />
          <Distance setFilters={setFilters} userCoordinate={userCoordinate} />
          <Company setFilters={setFilters} jobs={jobs} />
          <JobType setFilters={setFilters} />
          <DueDate setFilters={setFilters} />
        </Stack>
        <div className={styles.resultText}>
          {jobs.length > 0 ? (
            <Typography variant="subtitle1" sx={{ color: "grey" }}>
              {" "}
              {NumberPerPage * filters.page - jobs.length + 1} -
              {NumberPerPage * filters.page} job
              {jobs.length !== 1 ? "s" : ""} found out of {total} jobs.
            </Typography>
          ) : null}
        </div>
      </div>
    </>
  );
}
