import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { SvgIcon, TextField } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import styles from "./Jobs.module.css";
import AddJobForm from "./Posting/AddJobForm";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../provider/authProvider";
const apiURL = process.env.REACT_APP_JP_API_URL;

function SearchColumn({ setUserCoordinate, setFilters, setJobs }) {
  const [jobName, setJobName] = useState("");
  // Still need to cache but that for later
  const [location, setLocation] = useState(null);
  const [locationChanged, setLocationChanged] = useState(false);
  const [isRecruiter, setIsRecruiter] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const { user } = useAuth(); // custom hook for authprovider
  // const { jobToEdit, setJobToEdit } = useState(null);

  useEffect(() => {
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;

            const fetchedAddress = await getAddressFromCoordinates(
              latitude,
              longitude
            );
            setLocation(fetchedAddress);
            setUserCoordinate({ latitude, longitude });
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

  const submitAddress = async () => {
    console.log("Location: ", { location });
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      location
    )}&format=json`;

    if (!location) {
      alert("Please enter a location.");
      return;
    }

    if (locationChanged) {
      try {
        const response = await axios.get(url);
        if (response.data && response.data.length > 0) {
          const { lat, lon } = response.data[0];
          setUserCoordinate({ latitude: lat, longitude: lon });
          setFilters((prev) => {
            const updatedFilters = {
              ...prev,
              longitude: lon,
              latitude: lat,
            };
            return updatedFilters;
          });
        } else {
          console.log("No results found for the location");
        }
      } catch (error) {
        console.error("Error fetching coordinates:", error);
      }
    }
  };

  const clearName = (e) => {
    e.preventDefault();
    if (jobName) {
      setJobName("");
    }
    setFilters((prev) => ({
      ...prev,
      search_query: "",
    }));
  };

  const clearLocation = (e) => {
    e.preventDefault();
    if (location) {
      setLocation("");
    }
  };

  useEffect(() => {
    if (!user?.userID) return;

    const checkRole = async () => {
      try {
        const res = await fetch(
          apiURL + `/api/Recruiter/isRecruiter?userID=${user.userID}`,
          { credentials: "include" }
        );

        if (res.ok) {
          const data = await res.json();
          console.log(user.userID);
          setIsRecruiter(data.isRecruiter);
          setCompanyName(data.companyName);
        }
      } catch (error) {
        console.error("Error checking recruiter role:", error);
      }
    };

    checkRole();
  }, [user?.userID]);

  const search = (input) => {
    setJobName(input);
    setFilters((prev) => ({
      ...prev,
      search_query: input,
    }));
  };

  return (
    <>
      <div className={styles.searchContent}>
        <TextField
          label="Search"
          id="search-input"
          className={styles.searchTextField}
          type="text"
          value={jobName}
          onChange={(e) => search(e.target.value)}
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
          className={styles.searchTextField}
          value={location}
          onChange={(e) => {
            setLocation(e.target.value);
            setLocationChanged(true);
          }}
          slotProps={{
            input: {
              startAdornment: <LocationOnIcon position="start" />,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton aria-label="close" onClick={clearLocation}>
                    <CloseOutlinedIcon />
                  </IconButton>
                  <button variant="contained" onClick={submitAddress}>
                    {" "}
                    Search{" "}
                  </button>
                </InputAdornment>
              ),
            },
          }}
        />
        {/* Eventually change to nav bar */}
        {isRecruiter ? (
          <AddJobForm
            setJobs={setJobs}
            companyName={companyName}
            jobToEdit={false}
            setFilters={setFilters}
          />
        ) : null}
      </div>
    </>
  );
}

export default SearchColumn;
