import { Typography, IconButton, Avatar, Button, Box } from "@mui/material";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import CloseIcon from "@mui/icons-material/Close";
import amazonIcon from "../Img/amazon-icon.png";
import moment from "moment";
import styles from "../Jobs.module.css";

export default function Header({ job, onClose }) {
  return (
    <>
      {/* Header Section */}
      <Box className={styles.drawerHeader}>
        <Avatar src={amazonIcon} aria-label="amazon">
          {job.company[0]}
        </Avatar>
        <Typography variant="h4" sx={{ ml: 2 }}>
          {job.company}
        </Typography>

        {/* Right Section (IconButton aligned to the right) */}
        <IconButton onClick={onClose} sx={{ ml: "auto" }}>
          <CloseIcon />
        </IconButton>
      </Box>
      {/* Job Title and Additional Information */}
      <Box sx={{ mt: 2 }}>
        <Typography sx={{ fontWeight: "bold" }} variant="h5">
          {job.title}
        </Typography>
        <Typography sx={{ typography: "body1" }}>
          Posted on {new Date(job.postDate).toLocaleDateString()} &nbsp; |
          &nbsp; Apply by {new Date(job.endDate).toLocaleDateString()}
          &nbsp; at {new Date(job.postDate).toLocaleTimeString()}
        </Typography>
        {/* <button className={`${styles.drawerButton} lightButton`}>
          <BookmarkBorderIcon />
          Bookmark
        </button> */}
        <button
          onClick={(e) => {
            e.preventDefault();
            job.link ? window.open(job.link) : window.open("http://google.com");
          }}
          className={styles.drawerButton}
        >
          Apply
        </button>
      </Box>
    </>
  );
}
