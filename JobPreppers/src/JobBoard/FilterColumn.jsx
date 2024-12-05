import "./JobSection.css";
import Stack from "@mui/material/Stack";
import Salary from "./FilterMenu/Salary";
import JobType from "./FilterMenu/JobType";
import Distance from "./FilterMenu/Distance";
import DueDate from "./FilterMenu/DueDate";
import Company from "./FilterMenu/Company";
import { useEffect, useState, useRef } from "react";

export default function FilterColumn({ setJobs, jobs, userCoordinate }) {
  const [isOverflowing, setIsOverflowing] = useState(false);
  const containerRef = useRef(null);
  const [error, setError] = useState(null); // Define error state here

  const [filters, setFilters] = useState({
    date: null,
    type: [],
    company: [],
    min_salary: 0,
  });

  useEffect(() => {
    const handleSearch = async () => {
      // e.preventDefault(); // Prevent default form submission
      console.log("Filter: ", { filters });
      try {
        const response = await fetch("http://localhost:5000/api/job/filter", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(filters),
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Data: ", { data });
          setJobs(data);
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
    if (userCoordinate.latitude !== null && userCoordinate.longitude !== null) {
      handleSearch();
    }
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
          sx={{
            width: "100%",
            justifyContent: isOverflowing ? "flex-start" : "center",
          }}
        >
          <Salary setFilters={setFilters} />
          <Distance
            jobs={jobs}
            userCoordinate={userCoordinate}
            setJobs={setJobs}
          />
          <Company setFilters={setFilters} jobs={jobs} />
          <JobType setFilters={setFilters} />
          <DueDate setFilters={setFilters} />
        </Stack>
      </div>
    </>
  );
}
