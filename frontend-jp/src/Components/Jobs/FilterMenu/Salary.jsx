import React from "react";
import { Box, Slider, Button, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import "./Menu.css";
import styles from "../Jobs.module.css";

// const marks = [
//     { value: 20, label: '20k+' },
//     { value: 40, label: '40k+' },
//     { value: 60, label: '60k+' },
//     { value: 80, label: '80k+' },
//     { value: 100, label: '100k+' },
//     { value: 120, label: '120k+' },
//     { value: 140, label: '140k+' },
//     { value: 160, label: '160k+' },
//     { value: 180, label: '180k+' },
//     { value: 200, label: '200k+' },
//     { value: 220, label: '220k+' },
//   ];

const sparseMark = [
  { value: 20000, label: "20k+" },
  { value: 60000, label: "60k+" },
  { value: 100000, label: "100k+" },
  { value: 140000, label: "140k+" },
  { value: 180000, label: "180k+" },
  { value: 220000, label: "220k+" },
];

function valuetext(value) {
  return `$${value}`;
}

export default function Salary({ setFilters }) {
  const deafultSlider = 20000;
  const [sliderValue, setSliderValue] = useState(deafultSlider);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSliderChange = (event, newValue) => {
    setSliderValue(newValue);
  };

  const handleCancel = () => {
    setSliderValue(20000); // Reset to default value
    setFilters((prev) => {
      const updatedFilters = { ...prev, min_salary: deafultSlider };
      return updatedFilters;
    });
    handleClose();
  };

  const handleShowResult = () => {
    console.log("slider value", { sliderValue });
    setFilters((prev) => {
      const updatedFilters = { ...prev, min_salary: sliderValue };
      return updatedFilters;
    });
    handleClose();
  };
  return (
    <>
      <Button
        className="filter-button"
        id="salary-button"
        variant="outlined"
        endIcon={<ArrowDropDownIcon />}
        onClick={handleClick}
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        Salary
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        className="salary-menu"
        MenuListProps={{
          "aria-labelledby": "salary-button",
        }}
      >
        <MenuItem>
          <Box className={styles.salarySliderBox}>
            <Slider
              aria-label="Custom marks"
              getAriaValueText={valuetext}
              step={10000}
              min={20000}
              max={220000}
              value={sliderValue}
              onChange={handleSliderChange}
              valueLabelFormat={valuetext}
              valueLabelDisplay="auto"
              marks={sparseMark}
              className={styles.salarySlider}
            />
          </Box>
        </MenuItem>

        <div className={styles.dropDownMenuSelection}>
          <button className="lightButton" variant="text" onClick={handleCancel}>
            Cancel
          </button>
          <button variant="contained" onClick={handleShowResult}>
            Show Result
          </button>
        </div>
      </Menu>
    </>
  );
}
