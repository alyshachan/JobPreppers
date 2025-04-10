import React from "react";
import { useState } from "react";
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

function AddEventDialog({ open, onClose, onCreateEvent, selectedDate }) {
  const [specialties, setSpecialties] = useState("");
  const [availibility, setAvailibility] = useState("");

  const handleAddInterviewer = () => {
    return;
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
              <div className={styles.charCount}>Specialty Character Limit: {specialties.length}/45</div>

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
              <div className={styles.charCount}>Availibility Character Limit: {availibility.length}/45</div>
          </div>
        </div>
      </DialogContent>

      <DialogActions>
        <button autoFocus onClick={handleAddInterviewer}>
          Create Event
        </button>
      </DialogActions>
    </StyledDialog>
  );
}

export default AddEventDialog;
