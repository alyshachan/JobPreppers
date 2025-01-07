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

import SectionHeader from "../../Components/SectionHeader";
import "./AddEventDialog.css";

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

const iconStyles = {
  width: "1.5em",
  height: "1.5em",
  aspectRatio: "1",
  color: "#4BA173",
};

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
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          borderTop: "50px solid #4BA173",
          width: "calc(100% + 40px)",
          left: "-20px",
          position: "relative",
          paddingLeft: "36px",
        }}
      >
        <SectionHeader header="Add Event" />
      </DialogTitle>

      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: "#085630",
        }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent>
        <div className="eventForm">
          <div className="eventFormLeft">
            <div className="input">
              <TitleIcon sx={iconStyles} />
              <div className="inputField">
                Event Name
                <TextField
                  required
                  placeholder="Enter Event Name"
                  className="w-full"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                />
              </div>
            </div>

            <div className="input">
              <CalendarTodayIcon sx={iconStyles} />
              <div className="inputField">
                Event Date
                <TextField
                  required
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                />
              </div>
            </div>

            <div className="input">
              <AccessTimeOutlinedIcon sx={iconStyles} />
              <div className="inputField">
                Start Time
                <TextField
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div className="inputField">
                End Time
                <TextField
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="eventFormRight">
            <div className="input">
              <PermIdentityOutlinedIcon sx={iconStyles} />
              <div className="inputField">
                Participants
                <TextField
                  placeholder="Enter Participant Name(s)"
                  className="w-full"
                  value={eventParticipants}
                  onChange={(e) => setEventParticipants(e.target.value)}
                />
              </div>
            </div>

            <div className="input">
              <EditNoteIcon sx={{ ...iconStyles, marginTop: "-100px" }} />
              <div className="inputField">
                Event Details
                <TextareaAutosize
                  placeholder="Enter Event Details"
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
          Create Event
        </button>
      </DialogActions>
    </StyledDialog>
  );
}

export default AddEventDialog;
