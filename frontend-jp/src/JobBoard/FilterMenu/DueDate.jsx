import * as React from "react";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { Box, Button, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import "./Menu.css";
export default function DueDate({ setFilters }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedDate, setSelectDate] = React.useState(dayjs());
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSearch = () => {
    const formattedDate = selectedDate ? selectedDate.toISOString() : null;

    console.log("Date in DueDate: ", { selectedDate });
    setFilters((prev) => {
      const updatedFilters = { ...prev, date: formattedDate };
      console.log("Updated Filters: ", updatedFilters);
      return updatedFilters;
    });
    handleClose();
  };

  return (
    <>
      <Button
        className="filter-button"
        variant="outlined"
        endIcon={<ArrowDropDownIcon />}
        id="due-date-button"
        onClick={handleClick}
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        Apply By Date
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
          <Box className="due-date-box">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateCalendar
                className="calendar"
                value={selectedDate}
                onChange={(newValue) => setSelectDate(newValue)}
              />
            </LocalizationProvider>
          </Box>
        </MenuItem>

        <div className="menu-button-section">
          <Button
            className="cancel-button"
            variant="text"
            onClick={handleClose}
          >
            {" "}
            Cancel{" "}
          </Button>
          <Button
            className="save-button"
            variant="contained"
            onClick={handleSearch}
          >
            {" "}
            Show Result{" "}
          </Button>
        </div>
      </Menu>
    </>
  );
}
