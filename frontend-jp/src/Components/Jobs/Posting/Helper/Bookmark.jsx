import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { useState, useEffect } from "react";
import { IconButton } from "@mui/material";
import { useAuth } from "../../../../provider/authProvider";
const Bookmark = ({ jobID, setBookmarkedJobs, bookmarkedJobs }) => {
  const { user } = useAuth();

  const toggleBookmark = async (jobID) => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/Bookmark/ToggleBookmark",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userID: user.userID,
            jobID: jobID,
          }),
          credentials: "include",
        }
      );

      setBookmarkedJobs((prev) =>
        prev.includes(jobID)
          ? prev.filter((id) => id !== jobID)
          : [...prev, jobID]
      );
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };
  return (
    <>
      {" "}
      <IconButton aria-label="bookmark" onClick={() => toggleBookmark(jobID)}>
        {bookmarkedJobs.includes(jobID) ? (
          <BookmarkIcon />
        ) : (
          <BookmarkBorderIcon />
        )}
      </IconButton>
    </>
  );
};

export default Bookmark;
