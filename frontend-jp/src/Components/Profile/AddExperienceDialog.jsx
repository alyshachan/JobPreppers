import React from "react";
import { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { styled } from "@mui/material/styles";
import { TextareaAutosize } from "@mui/base/TextareaAutosize";
import moment from "moment";
import styles from "./AddSectionDialog.module.css";
import "../JobPreppers.css";
import { useAuth } from "../../provider/authProvider";
import WorkIcon from "@mui/icons-material/Work";
import BusinessIcon from "@mui/icons-material/Business";
import PlaceIcon from "@mui/icons-material/Place";

import SectionHeader from "./SectionHeader";

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .css-10d30g3-MuiPaper-root-MuiDialog-paper": {
    borderRadius: "30px",
    margin: "-20px",
    padding: "0px 20px 20px",
    overflow: "hidden",
    maxWidth: "800px",
    minWidth: "800px",
  },
}));

function AddExperienceDialog({ open, onClose, onAdd, experience }) {
  const { user, setAuthData } = useAuth(); // custom hook for authprovider
  const [work, setWork] = useState("");
  const [location, setLocation] = useState("");
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (experience) {
      setWork(experience.work_name || "");
      setLocation(experience.location || "");
      setTitle(experience.job_title || "");
      setStartDate(
        experience.start_date
          ? moment(experience.start_date).format("YYYY-MM-DD")
          : new Date()
      );
      setEndDate(
        experience.end_date
          ? moment(experience.end_date).format("YYYY-MM-DD")
          : new Date()
      );
      setDescription(experience.description || "");
    } else {
      setWork("");
      setLocation("");
      setTitle("");
      setStartDate(new Date());
      setEndDate(new Date());
      setDescription("");
    }
  }, [experience]);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    onClose();

    const start =
      startDate.toDateString === new Date().toDateString
        ? null
        : moment(startDate).add(1, "days").format("YYYY-MM-DD");
    const end =
      endDate.toDateString === new Date().toDateString
        ? null
        : moment(endDate).add(1, "days").format("YYYY-MM-DD");

    try {
      const url = experience
        ? `EditExperience/${experience.userExperienceID}`
        : "CreateExperience";
      const method = experience ? "PUT" : "POST";
      const response = await fetch(
        `http://localhost:5000/api/UserExperience/${url}`,
        {
          method: method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userID: user.userID,
            workName: work,
            location: location,
            jobTitle: title,
            start_date: start,
            end_date: end,
            description: description,
          }),
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

  const handleDelete = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      const response = await fetch(`http://localhost:5000/api/UserExperience/DeleteExperience/${experience.userExperienceID}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok){
        onAdd();
        onClose();
        setError("");
      } else {
        const errorData = await response.json();
        window.alert("Error whilst trying to delete experience");
        setError(errorData.message); // Show error message from the backend
      }
    } catch (err) {
      setError("An error occurred. Please try again."); // Catch and display any request error
    }
  };

  return (
    <StyledDialog onClose={onClose} open={open}>
      <DialogTitle className={styles.dialogTitle}>
        <SectionHeader
          header={experience ? "Edit Experience" : "Add Experience"}
        />
      </DialogTitle>

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
            <div className={styles.dialogContentLeft}>
              <div className={styles.input}>
                <WorkIcon className={styles.icon} />
                <div className={styles.inputField}>
                  <label for="title">Job Title</label>
                  <TextField
                    placeholder="e.g. Software Engineer"
                    className="w-full"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.input}>
                <BusinessIcon className={styles.icon} />
                <div className={styles.inputField}>
                  <label for="work" className={styles.required}>
                    Company
                  </label>
                  <TextField
                    required
                    placeholder="e.g. Google"
                    className="w-full"
                    id="work"
                    value={work}
                    onChange={(e) => setWork(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.input}>
                <PlaceIcon className={styles.icon} />
                <div className={styles.inputField}>
                  <label for="location">Location</label>
                  <TextField
                    placeholder="e.g. Los Angeles, California"
                    className="w-full"
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className={styles.dialogContentRight}>
              {/* Right-side content */}
              <div className={styles.input}>
                <CalendarTodayIcon className={styles.icon} />
                <div className={styles.inputField}>
                  <label for="start">Start Date</label>
                  <TextField
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value || null)}
                  />
                </div>
                <div className={styles.inputField}>
                  <label for="end">End Date</label>
                  <TextField
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value || null)}
                  />
                </div>
              </div>

              <div className={styles.input}>
                <EditNoteIcon className={`${styles.icon} mt-[-100px]`} />
                <div className={styles.inputField}>
                  <label for="description">Description</label>
                  <TextareaAutosize
                    placeholder="Enter skills, accomplishments, achievements"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          {experience ? (
            <DialogActions className="flex !justify-between w-full">
              <button className="lightButton" onClick={handleDelete}>
                Delete Experience
              </button>
              <button type="submit">Save Changes</button>
            </DialogActions>
          ) : (
            <DialogActions>
              <button type="submit">Add Experience</button>
            </DialogActions>
          )}
        </form>
      </DialogContent>
    </StyledDialog>
  );
}

export default AddExperienceDialog;
