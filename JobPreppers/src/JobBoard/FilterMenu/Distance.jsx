import React from "react";
import { Box, Slider, Button, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import "./Menu.css";
import { calculateDistance } from "./CalculateDistance";

const marks = [
  {
    value: 50,
    label: "50m",
  },
  // {
  //   value: 35,
  //   label: "35m",
  // },
  // {
  //   value: 60,
  //   label: "60m",
  // },
  // {
  //   value: 85,
  //   label: "85m",
  // },

  {
    value: 250,
    label: "250m",
  },

  {
    value: 400,
    label: "400m",
  },

  {
    value: 550,
    label: "550m",
  },
];

function valuetext(value) {
  return `${value} miles`;
}
export default function Distance({ jobs, userCoordinate, setJobs }) {
  const [sliderValue, setSliderValue] = useState(5);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [address, setAddress] = useState(""); // Store the address input
  const [coordinates, setCoordinates] = useState(null); // Store the lat/lng

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
  };

  const handleShowResult = () => {
    console.log(`Distance: ${sliderValue}miles`);
    const filteredJobs = jobs.filter((job) => {
      const distanceInMiles = calculateDistance(
        userCoordinate.latitude,
        userCoordinate.longitude,
        job.latitude,
        job.longitude
      );
      console.log("job.latitude : ", job.latitude);
      console.log("job.longitude : ", job.longitude);

      console.log("Calculated Distance: ", distanceInMiles);
      // Filter jobs that are smaller than or equal to the slider value
      return distanceInMiles <= sliderValue;
    });

    console.log(filteredJobs);
    setJobs(filteredJobs);

    handleClose();
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
              defaultValue={10}
              getAriaValueText={valuetext}
              step={20}
              value={sliderValue}
              onChange={handleSliderChange}
              valueLabelDisplay="auto"
              marks={marks}
              max={600}
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
