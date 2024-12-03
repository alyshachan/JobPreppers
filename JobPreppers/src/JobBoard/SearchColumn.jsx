import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { SvgIcon, TextField } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import "../JobBoard/JobSection.css";
import React, { useState, useEffect } from "react";
import axios from "axios";

function SearchColumn() {
  const [jobName, setJobName] = useState("");
  const [location, setLocation] = useState(null);
  const [userCoordinate, setUserCoordinate] = useState(null);
  useEffect(() => {
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            setLocation(position);
            setUserCoordinate(position.coordinate);
            const { latitude, longitude } = position.coords;
            setUserCoordinate({ latitude, longitude });
            const fetchedAddress = await getAddressFromCoordinates(
              latitude,
              longitude
            );
            setLocation(fetchedAddress);
          },
          (error) => {
            console.log("Unable to retrieve user location");
          }
        );
      } else {
        console.log("Not supported");
      }
    };
    getUserLocation();
  }, []);

  const getAddressFromCoordinates = async (latitude, longitude) => {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
    try {
      const response = await axios.get(url);
      return response.data.display_name; // Address as a string
    } catch (error) {
      console.error("Error fetching address:", error);
      return "Error fetching address";
    }
  };
  const clearName = (e) => {
    e.preventDefault();
    if (jobName) {
      setJobName("");
    }
  };

  const clearLocation = (e) => {
    e.preventDefault();
    if (location) {
      setLocation("");
    }
  };

  return (
    <>
      <div className="searchContent">
        <TextField
          label="Search"
          id="search-input"
          className="mt-8 bg-white w-[40%]"
          type="text"
          value={jobName}
          onChange={(e) => setJobName(e.target.value)}
          slotProps={{
            input: {
              startAdornment: <SearchIcon position="start" />,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton aria-label="close" onClick={clearName}>
                    <CloseOutlinedIcon />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
        <TextField
          label="Location"
          id="location-input"
          className="mt-8 bg-white w-[40%]"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          slotProps={{
            input: {
              startAdornment: <LocationOnIcon position="start" />,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton aria-label="close" onClick={clearLocation}>
                    <CloseOutlinedIcon />
                  </IconButton>
                  <button className="search-button" variant="contained">
                    {" "}
                    Search{" "}
                  </button>
                </InputAdornment>
              ),
            },
          }}
        />

        <IconButton
          aria-label="filter-button"
          style={{ alignSelf: "center", marginTop: "10px" }}
        >
          <SvgIcon>
            {/* credit: filter icon from https://heroicons.com */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-8"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
              />
            </svg>
          </SvgIcon>
        </IconButton>
      </div>
    </>
  );
}

export default SearchColumn;
