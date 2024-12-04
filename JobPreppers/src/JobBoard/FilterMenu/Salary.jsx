import React from "react";
import { Box, Slider, Button, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import "./Menu.css";

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
  const [sliderValue, setSliderValue] = useState(20000);
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
          <Box className="salary-slider-box">
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
              className="salary-slider"
            />
            {/* Need to add cancel and submit at the bottom */}
          </Box>
        </MenuItem>
        <div className="menu-button-section">
          <Button
            className="cancel-button"
            variant="text"
            onClick={handleCancel}
          >
            {" "}
            Cancel{" "}
          </Button>
          <Button
            className="save-button"
            variant="contained"
            onClick={handleShowResult}
          >
            {" "}
            Show Result{" "}
          </Button>
        </div>
      </Menu>
    </>
  );
}
