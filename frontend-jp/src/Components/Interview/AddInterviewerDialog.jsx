import React from "react";
import { useState } from "react";
import { useAuth } from "../../provider/authProvider";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import styles from "./AddDialog.module.css";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import SectionHeader from "../../Components/Profile/SectionHeader";
const apiURL = process.env.REACT_APP_JP_API_URL;

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

function AddInterviewerDialog({ open, onClose, onAdd }) {
  const { user, setAuthData } = useAuth(); // custom hook for authprovider
  const [specialties, setSpecialties] = useState("");
  const [availibility, setAvailibility] = useState("");

  const handleAddInterviewer = async () => {
    const interviewerData = {
      userID: user.userID,
      specialties: specialties,
      availability: availibility,
      rating: null,
    };

    try {
      const response = await fetch(
        apiURL + `/api/InterviewSignUp/SignUpToInterview`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(interviewerData),
        }
      );

      if (response.ok) {
        const data = await response.json();
        onAdd({
            firstName: user.first_name,
            lastName: user.last_name,
            username: user.username,
            title: user.title,
            specialties: data.specialties,
            availability: data.availability,
            signUpID: data.signUpID,
          });
        console.log("Interviewer added successfully");
        onClose();
      } else {
        window.alert("Failed to add interviewer");
      }
    } catch (error) {
      window.alert("Error during interviewer's sign up:", error);
    }
  };

  return (
    <StyledDialog onClose={onClose} open={open}>
      <DialogTitle className={styles.addEventTitle}>
        <SectionHeader header="Mock Interviewer Sign Up" />
      </DialogTitle>

      <IconButton
        aria-label="close"
        onClick={onClose}
        className={styles.closeButton}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent>
        <div className={styles.eventForm}>
          <div className={styles.eventFormLeft}>
            <div className={styles.input}>
              <TipsAndUpdatesIcon className={styles.icon} />
              <div className={styles.inputField}>
                Specialties
                <TextField
                  placeholder="Enter your specialties or career fields you want to interview with"
                  className="w-full"
                  value={specialties}
                  onChange={(e) => setSpecialties(e.target.value)}
                  inputProps={{ maxLength: 45 }}
                />
              </div>
            </div>
            <div className={styles.charCount}>
              Specialty Character Limit: {specialties.length}/45
            </div>

            <div className={styles.input}>
              <EventAvailableIcon className={styles.icon} />
              <div className={styles.inputField}>
                Availibility
                <TextField
                  placeholder="Enter what days and times you're available to mock interview"
                  className="w-full"
                  value={availibility}
                  onChange={(e) => setAvailibility(e.target.value)}
                  inputProps={{ maxLength: 45 }}
                />
              </div>
            </div>
            <div className={styles.charCount}>
              Availibility Character Limit: {availibility.length}/45
            </div>
          </div>
        </div>
      </DialogContent>

      <DialogActions>
        <button autoFocus onClick={handleAddInterviewer}>
          Sign Up
        </button>
      </DialogActions>
    </StyledDialog>
  );
}

export default AddInterviewerDialog;
