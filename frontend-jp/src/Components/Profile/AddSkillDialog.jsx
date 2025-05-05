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
import styles from "./AddSectionDialog.module.css";
import "../JobPreppers.css";
import { useAuth } from "../../provider/authProvider";
import SettingsIcon from "@mui/icons-material/Settings";
import PsychologyIcon from "@mui/icons-material/Psychology";

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
  "& .css-si425x": {
    borderRadius: "30px",
    padding: "0px 20px 20px",
    overflow: "hidden",
    maxWidth: "800px",
    minWidth: "800px",
  },
}));

const apiURL = process.env.REACT_APP_JP_API_URL;

function AddSkillDialog({ open, onClose, onAdd, skill }) {
  const { user, setAuthData } = useAuth(); // custom hook for authprovider
  const [category, setCategory] = useState("");
  const [skillName, setSkillName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (skill) {
      setCategory(skill.category || "");
      setSkillName(skill.name || "");
    } else {
      setCategory("");
      setSkillName("");
    }
  }, [skill]);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    onClose();
    try {
      const url =
        skill && skill.userSkillID
          ? `EditSkill/${skill.userSkillID}`
          : "AddSkillToUser";
      const method = skill && skill.userSkillID ? "PUT" : "POST";

      const response = await fetch(apiURL + `/api/UserSkills/${url}`, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userID: user.userID,
          skillName: skillName,
          category: category,
        }),
      });

      const responseData = await response.json();
      console.log("Response Data:", responseData);

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
      const response = await fetch(
        apiURL + `/api/UserSkills/DeleteSkill/${skill.userSkillID}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (response.ok) {
        onAdd();
        onClose();
        setError("");
      } else {
        const errorData = await response.json();
        window.alert("Error whilst trying to delete skill");
        setError(errorData.message); // Show error message from the backend
      }
    } catch (err) {
      setError("An error occurred. Please try again."); // Catch and display any request error
    }
  };

  return (
    <StyledDialog onClose={onClose} open={open}>
      <DialogTitle className={styles.dialogTitle} />
      <SectionHeader header={skill ? "Edit Skill" : "Add Skill"} />

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
                <SettingsIcon className={styles.icon} />
                <div className={styles.inputField}>
                  <label for="category">Skill Category</label>
                  <TextField
                    placeholder="e.g. Interpersonal Skills"
                    className="w-full"
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.input}>
                <PsychologyIcon className={styles.icon} />
                <div className={styles.inputField}>
                  <label for="skill">Skill</label>
                  <TextField
                    placeholder="e.g. Leadership"
                    className="w-full"
                    id="skill"
                    value={skillName}
                    onChange={(e) => setSkillName(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          {skill ? (
            <DialogActions className="flex !justify-between w-full">
              <button className="lightButton" onClick={handleDelete}>
                Delete Skill
              </button>
              <button type="submit">Save Changes</button>
            </DialogActions>
          ) : (
            <DialogActions>
              <button type="submit">Add Skill</button>
            </DialogActions>
          )}
        </form>
      </DialogContent>
    </StyledDialog>
  );
}

export default AddSkillDialog;
