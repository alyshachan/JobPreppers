import React, { useState, useEffect } from "react";
import { useAuth } from "../../provider/authProvider";
import { TextField, Chip, Box } from "@mui/material";
import defaultProfilePicture from "../defaultProfilePicture.png";
const apiURL = process.env.REACT_APP_JP_API_URL;

function SearchParticipants() {
  const { user, setAuthData } = useAuth(); // custom hook for authprovider
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [participants, setParticipants] = useState([]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSelectParticipant = (user) => {
    const existInParticipants = participants.some(
      (p) => p.userId === user.userId
    );
    if (!existInParticipants) {
      setParticipants([...participants, user]);
    }
    setSearchQuery("");
    setShowResults(false);
  };

  const handleDeleteParticipant = (userId) => {
    setParticipants((prev) => prev.filter((user) => user.userId !== userId));
  };

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `${apiURL}/api/Users/Search?name=${encodeURIComponent(searchQuery)}`,
          {
            credentials: "include",
          }
        );

        if (response.ok) {
          const data = await response.json();
          setSearchResults(data);
          setShowResults(true);
        } else {
          // Handle case where no users are found
          setSearchResults([]);
          setShowResults(false);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
        setSearchResults([]);
        setShowResults(false);
      }
    };

    const timeoutId = setTimeout(fetchUsers, 300); // Debounce API calls
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return (
    <>
      <div className="relative w-full">
        {/* Chip display */}
        <Box className="mb-2 flex flex-wrap gap-1">
          {participants.map((user) => (
            <Chip
              key={user.userId}
              label={`${user.first_name} ${user.last_name ?? ""}`}
              onDelete={() => handleDeleteParticipant(user.userId)}
              avatar={
                <img
                  src={
                    user.profile_pic
                      ? `data:image/png;base64,${user.profile_pic}`
                      : defaultProfilePicture
                  }
                  alt={`${user.first_name} ${user.last_name ?? ""}`}
                  style={{ width: 24, height: 24, borderRadius: "50%" }}
                />
              }
            />
          ))}
        </Box>
        <TextField
          type="text"
          placeholder="Enter Participant Name(s)"
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full"
        />
        {showResults && searchResults.length > 0 && (
          <div className="absolute top-full left-0 w-full bg-white shadow-md rounded-md mt-1 max-h-60 overflow-y-auto">
            {searchResults.map((user) => (
              <div
                key={user.userID}
                className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelectParticipant(user)}
              >
                <img
                  src={
                    user.profile_pic
                      ? `data:image/png;base64,${user.profile_pic}`
                      : defaultProfilePicture
                  }
                  alt={`${user.first_name} ${user.last_name}`}
                  className="w-10 h-10 rounded-full mr-2"
                />
                <div className="flex flex-col">
                  <span className="font-semibold">{`${user.first_name} ${
                    user.last_name ? user.last_name : ""
                  }`}</span>
                  <span className="text-sm text-gray-500">{user.title}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default SearchParticipants;
