import "./JobSection.css";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Salary from "./FilterMenu/Salary";
import JobType from "./FilterMenu/JobType";
import Distance from "./FilterMenu/Distance";
import DueDate from "./FilterMenu/DueDate";
import Company from "./FilterMenu/Company";
import { useEffect, useState, useRef } from "react";

export default function FilterColumn() {
  const [isOverflowing, setIsOverflowing] = useState(false);
  const containerRef = useRef(null);

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
            paddingTop: "10px",
            justifyContent: isOverflowing ? "flex-start" : "center",
          }}
        >
          <Salary />
          <Distance />
          <Company />
          <JobType />
          <DueDate />
        </Stack>
      </div>
    </>
  );
}
