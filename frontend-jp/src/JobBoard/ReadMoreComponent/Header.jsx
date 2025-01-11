import { Typography, IconButton, Avatar, Button, Box } from "@mui/material";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import CloseIcon from "@mui/icons-material/Close";
import amazonIcon from "../Img/amazon-icon.png";
import moment from "moment";

export default function Header({ job, onClose }) {
  return (
    <>
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
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
          Posted on {new Date(job.postedAt).toLocaleDateString()} &nbsp; |
          &nbsp; Apply by {new Date(job.fill_by_date).toLocaleDateString()}
          &nbsp; at {moment(job.postedAt).format("hh:mm A")}
        </Typography>
        <Button
          className="bookmark-button"
          variant="contained"
          startIcon={<BookmarkBorderIcon />}
        >
          {" "}
          Bookmark{" "}
        </Button>
        <Button className="apply-button" variant="contained">
          Apply
        </Button>
      </Box>
    </>
  );
}
