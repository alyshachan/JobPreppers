import React from "react";
import { useState } from "react";
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
import SchoolIcon from "@mui/icons-material/School";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import MenuBookIcon from "@mui/icons-material/MenuBook";

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
const apiURL = process.env.REACT_APP_JP_API_URL;


function AddEducationDialog({ open, onClose }) {
  const { user, setAuthData } = useAuth(); // custom hook for authprovider
  const [school, setSchool] = useState("");
  const [degree, setDegree] = useState("");
  const [study, setStudy] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    onClose();
    const start =
      startDate.toDateString === new Date().toDateString
        ? null
        : moment(startDate).format("YYYY-MM-DD");
    const end =
      endDate.toDateString === new Date().toDateString
        ? null
        : moment(endDate).format("YYYY-MM-DD");

    try {
      const response = await fetch(
        apiURL + "/api/UserEducation/CreateEducation",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userID: user.userID,
            schoolName: school,
            degreeName: degree,
            studyName: study,
            start_date: start,
            end_date: end,
            description: description,
          }),
        }
      );
      window.location.reload();
      if (response.ok) {
        const data = await response.json();
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

  return (
    <StyledDialog onClose={onClose} open={open}>
      <DialogTitle className={styles.dialogTitle}>
        <SectionHeader header="Add Education" />
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
                <SchoolIcon className={styles.icon} />
                <div className={styles.inputField}>
                  <label for="school" className={styles.required}>
                    School
                  </label>
                  <TextField
                    required
                    placeholder="e.g. Harvard University"
                    className="w-full"
                    id="school"
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.input}>
                <HistoryEduIcon className={styles.icon} />
                <div className={styles.inputField}>
                  <label for="degree">Degree</label>
                  <TextField
                    placeholder="e.g. Bachelors of Arts"
                    className="w-full"
                    id="degree"
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.input}>
                <MenuBookIcon className={styles.icon} />
                <div className={styles.inputField}>
                  <label for="study">Field of Study</label>
                  <TextField
                    placeholder="e.g. Business"
                    className="w-full"
                    id="study"
                    value={study}
                    onChange={(e) => setStudy(e.target.value)}
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
                    id="start"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value || null)}
                  />
                </div>
                <div className={styles.inputField}>
                  <label for="end">End Date</label>
                  <TextField
                    type="date"
                    id="end"
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
                    placeholder="Enter grades, activities, awards"
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogActions>
            <button type="submit">Add Education</button>
          </DialogActions>
        </form>
      </DialogContent>
    </StyledDialog>
  );
}

export default AddEducationDialog;
