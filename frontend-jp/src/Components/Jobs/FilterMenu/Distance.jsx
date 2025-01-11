import React from "react";
import { Box, Slider, Button, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import "./Menu.css";

const marks = [
  {
    value: 10,
    label: "10m",
  },
  {
    value: 35,
    label: "35m",
  },
  {
    value: 60,
    label: "60m",
  },
  {
    value: 85,
    label: "85m",
  },
];

function valuetext(value) {
  return `${value} miles`;
}
export default function Distance({ setFilters, userCoordinate }) {
  const [sliderValue, setSliderValue] = useState(5);
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
    setSliderValue(5); // Reset to default value
    handleClose();
    setFilters((prev) => {
      const updatedFilters = {
        ...prev,
        distance: 0,
      };
      return updatedFilters;
    });
  };

  const handleShowResult = () => {
    console.log(`Distance: ${sliderValue}miles`);
    handleClose();
    setFilters((prev) => {
      const updatedFilters = {
        ...prev,
        distance: sliderValue,
        longitude: userCoordinate.longitude,
        latitude: userCoordinate.latitude,
      };
      return updatedFilters;
    });

    return sliderValue;
  };
  return (
    <>
      <Button
        className="filter-button"
        id="distance-button"
        variant="outlined"
        endIcon={<ArrowDropDownIcon />}
        onClick={handleClick}
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        Distance
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        className="location-menu"
        MenuListProps={{
          "aria-labelledby": "location-button",
        }}
      >
        <MenuItem>
          <Box className="slider-box">
            <Slider
              aria-label="Custom marks"
              defaultValue={5}
              getAriaValueText={valuetext}
              step={10}
              value={sliderValue}
              onChange={handleSliderChange}
              valueLabelDisplay="auto"
              marks={marks}
              className="slider"
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
