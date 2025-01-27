import React from "react";
import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import TitleIcon from "@mui/icons-material/Title";
import TextField from "@mui/material/TextField";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import PermIdentityOutlinedIcon from "@mui/icons-material/PermIdentityOutlined";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { styled } from "@mui/material/styles";
import { TextareaAutosize } from "@mui/base/TextareaAutosize";
import moment from "moment";
import styles from "./AddSectionDialog.module.css";
import "../JobPreppers.css";

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

function AddEventDialog({ open, onClose, onCreateEvent, selectedDate }) {
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState(
    moment(selectedDate).format("YYYY-MM-DD")
  );
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [eventParticipants, setEventParticipants] = useState("");
  const [eventDetails, setEventDetails] = useState("");

  const isFormValid = eventName && eventDate;

  const handleCreateEvent = () => {
    if (isFormValid) {
      const newEvent = {
        name: eventName,
        date: new Date(eventDate),
        start: startTime,
        end: endTime,
        participants: eventParticipants,
        details: eventDetails,
      };
      onCreateEvent(newEvent);
      console.log(newEvent);
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
        <div className={styles.dialogContent}>
          <div className={styles.dialogContentLeft}>
            <div className={styles.input}>
              <TitleIcon className={styles.icon} />
              <div className={styles.inputField}>
                <label for="school" className={styles.required}>
                  School
                </label>
                <TextField
                  required
                  placeholder="e.g. Harvard University"
                  className="w-full"
                  id="school"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.input}>
              <CalendarTodayIcon className={styles.icon} />
              <div className={styles.inputField}>
                <label for="degree">Degree</label>
                <TextField
                  placeholder="e.g. Bachelor's of Arts"
                  className="w-full"
                  id="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.input}>
              <CalendarTodayIcon className={styles.icon} />
              <div className={styles.inputField}>
                <label for="study">Field of Study</label>
                <TextField
                  placeholder="e.g. Business"
                  className="w-full"
                  id="study"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className={styles.dialogContentRight}>
            {/* Right-side content */}
            <div className={styles.input}>
              <AccessTimeOutlinedIcon className={styles.icon} />
              <div className={styles.inputField}>
              <label for="start">Start Date</label>
                <TextField
                  type="date"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div className={styles.inputField}>
              <label for="end">End Date</label>
                <TextField
                  type="date"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.input}>
              <EditNoteIcon className={`${styles.icon} mt-[-100px]`} />
              <div className={styles.inputField}>
              <label for="description">Description</label>
                <TextareaAutosize
                  placeholder="Enter grades, activities, awards"
                  value={eventDetails}
                  onChange={(e) => setEventDetails(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>

      <DialogActions>
        <button autoFocus disabled={!isFormValid} onClick={handleCreateEvent}>
          Add Education
        </button>
      </DialogActions>
    </StyledDialog>
  );
}

export default AddEventDialog;
