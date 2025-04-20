import React from "react";
import { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import styles from "./AddSectionDialog.module.css";
import "../JobPreppers.css";
import { useAuth } from "../../provider/authProvider";
import TitleIcon from "@mui/icons-material/Title";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LinkIcon from "@mui/icons-material/Link";
import SectionHeader from "./SectionHeader";
import DefaultPic from "../JobPreppers_DefaultPic.png";

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .css-10d30g3-MuiPaper-root-MuiDialog-paper": {
    borderRadius: "30px",
    padding: "0px 20px 20px",
    overflow: "hidden",
    maxWidth: "800px",
    minWidth: "800px",
  },
  "& .css-si425x": {
    borderRadius: "30px",
    padding: "0px 20px 20px",
    overflow: "hidden",
    maxWidth: "800px",
    minWidth: "800px",
  },
}));
const apiURL = process.env.REACT_APP_JP_API_URL;

function AddProfileDetailsDialog({ open, onClose, onAdd }) {
  const { user, setAuthData } = useAuth(); // custom hook for authprovider
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || "");
      setLastName(user.last_name || "");
      setTitle(user.title || "");
      setLocation(user.location || "");
      setWebsite(user.website || "");
      setProfilePicture(user.profile_pic || "");
    } else {
      setFirstName("");
      setLastName("");
      setTitle("");
      setLocation("");
      setWebsite("");
      setProfilePicture("");
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      const response = await fetch(
        apiURL + `/api/Users/EditUserDetails/` + user.userID,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName,
            lastName,
            title,
            location,
            website,
          }),
          credentials: "include",
        }
      );

      if (response.ok) {
        onAdd();
        onClose();
        setError(""); // Clear any previous error message
      } else {
        const errorData = await response.json();
        window.alert("Your input has invalid characters, please try again.");
        setError(errorData.message); // Show error message from the backend
      }
    } catch (err) {
      setError("An error occurred. Please try again."); // Catch and display any request error
    }
  };

  const userPic =
    profilePicture == null
      ? DefaultPic
      : "data:image/png;base64," + profilePicture;

  return (
    <StyledDialog onClose={onClose} open={open}>
      <DialogTitle className={styles.dialogTitle} />
      <SectionHeader header="Edit Profile" />

      <IconButton
        aria-label="close"
        onClick={onClose}
        className={styles.closeButton}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent>
        <form onSubmit={handleSubmit}>
          <div className={styles.dialogContent}>
            <div
              className={`${styles.dialogContentLeft} flex flex-col items-center gap-5`}
            >
              {profilePicture && (
                <img
                  src={userPic}
                  alt="Profile Preview"
                  className="profilePicture"
                />
              )}
              <input
                type="file"
                accept="image/png, image/jpeg"
                id="fileInput"
                className="hidden-file-input"
                onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        const dataUrl = (reader.result).toString();
                        const base64 = dataUrl.split(',')[1];
                        setProfilePicture(base64);
                      };
                      reader.readAsDataURL(file);
                    }
                }}
              />
              <label htmlFor="fileInput" className="custom-file-button">
                Choose File
              </label>
            </div>

            <div className={styles.dialogContentRight}>
              {/* Right-side content */}
              <div className={styles.input}>
                <AssignmentIndIcon className={styles.icon} />
                <div className={styles.inputField}>
                  <label for="firstname" className={styles.required}>
                    First Name
                  </label>
                  <TextField
                    id="firstname"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className={styles.inputField}>
                  <label for="lastname">Last Name</label>
                  <TextField
                    id="lastname"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.input}>
                <TitleIcon className={styles.icon} />
                <div className={styles.inputField}>
                  <label for="title">Title</label>
                  <TextField
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.input}>
                <LocationOnIcon className={styles.icon} />
                <div className={styles.inputField}>
                  <label for="location">Location</label>
                  <TextField
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.input}>
                <LinkIcon className={styles.icon} />
                <div className={styles.inputField}>
                  <label for="website">Website</label>
                  <TextField
                    id="website"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogActions className="flex w-full">
            <button type="submit">Save Changes</button>
          </DialogActions>
        </form>
      </DialogContent>
    </StyledDialog>
  );
}

export default AddProfileDetailsDialog;
