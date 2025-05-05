import React from "react";
import { Box, Slider, Button, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import "./Menu.css";
import styles from "../Jobs.module.css";

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
  const [selected, setSetlected] = useState(false);

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
      setSetlected(false);
      return updatedFilters;
    });
  };

  const handleShowResult = () => {
    console.log(`Distance: ${sliderValue}miles`);
    handleClose();
    const userLong = userCoordinate.longitude;
    const userLat = userCoordinate.latitude;
    if (userLong != null && userLat != null) {
      setFilters((prev) => {
        const updatedFilters = {
          ...prev,
          distance: sliderValue,
          longitude: userCoordinate.longitude,
          latitude: userCoordinate.latitude,
        };
        return updatedFilters;
      });
    }
    setSetlected(true);
    return sliderValue;
  };
  return (
    <>
      <Button
        className={selected ? "selected-filter-button" : "filter-button"}
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
        MenuListProps={{
          "aria-labelledby": "location-button",
        }}
      >
        <MenuItem>
          <Box className={styles.sliderBox}>
            <Slider
              aria-label="Custom marks"
              defaultValue={5}
              getAriaValueText={valuetext}
              step={10}
              value={sliderValue}
              onChange={handleSliderChange}
              valueLabelDisplay="auto"
              marks={marks}
              className={styles.slider}
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
