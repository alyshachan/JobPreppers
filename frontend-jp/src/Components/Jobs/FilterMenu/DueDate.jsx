import * as React from "react";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { Box, Button, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import "./Menu.css";
import styles from "../Jobs.module.css";

export default function DueDate({ setFilters }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedDate, setSelectDate] = React.useState(dayjs());
  const open = Boolean(anchorEl);
  const [selected, setSetlected] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);

    setFilters((prev) => {
      const updatedFilters = { ...prev, date: null };
      return updatedFilters;
    });
    setSetlected(false);
  };

  const handleSearch = () => {
    const formattedDate = selectedDate ? selectedDate.toISOString() : null;

    console.log("Date in DueDate: ", { selectedDate });
    setFilters((prev) => {
      const updatedFilters = { ...prev, date: formattedDate };
      console.log("Updated Filters: ", updatedFilters);
      return updatedFilters;
    });
    setSetlected(true);

    setAnchorEl(null);
  };

  return (
    <>
      <Button
        className={selected ? "selected-filter-button" : "filter-button"}
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
        MenuListProps={{
          "aria-labelledby": "location-button",
        }}
      >
        <MenuItem>
          <Box>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateCalendar
                value={selectedDate}
                onChange={(newValue) => setSelectDate(newValue)}
              />
            </LocalizationProvider>
          </Box>
        </MenuItem>

        <div className={styles.dropDownMenuSelection}>
          <button className="lightButton" variant="text" onClick={handleClose}>
            Cancel
          </button>
          <button variant="contained" onClick={handleSearch}>
            Show Result
          </button>
        </div>
      </Menu>
    </>
  );
}
