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
import LightbulbIcon from "@mui/icons-material/Lightbulb";

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
  "& .css-si425x" : {
    borderRadius: "30px",
    padding: "0px 20px 20px",
    overflow: "hidden",
    maxWidth: "800px",
    minWidth: "800px",
  }
}));
const apiURL = process.env.REACT_APP_JP_API_URL;

function AddProjectDialog({ open, onClose, onAdd, project }) {
  const { user, setAuthData } = useAuth(); // custom hook for authprovider
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (project) {
      setTitle(project.project_title || "");
      setDescription(project.description || "");
    } else {
      setTitle("");
      setDescription("");
    }
  }, [project]);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    onClose();

    try {
      const url = project
        ? `EditProject/${project.userProjectID}`
        : "CreateProject";
      const method = project ? "PUT" : "POST";
      const response = await fetch(apiURL + `/api/UserProject/${url}`, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userID: user.userID,
          projectTitle: title,
          description: description,
        }),
      });

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
        apiURL + `/api/UserProject/DeleteProject/${project.userProjectID}`,
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
        window.alert("Error whilst trying to delete project");
        setError(errorData.message); // Show error message from the backend
      }
    } catch (err) {
      setError("An error occurred. Please try again."); // Catch and display any request error
    }
  };

  return (
    <StyledDialog onClose={onClose} open={open}>
      <DialogTitle className={styles.dialogTitle}/>
        <SectionHeader header={project ? "Edit Project" : "Add Project"} />

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
                <LightbulbIcon className={styles.icon} />
                <div className={styles.inputField}>
                  <label for="title">Project Title</label>
                  <TextField
                    placeholder="e.g. Chatbot"
                    className="w-full"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.input}>
                <EditNoteIcon className={`${styles.icon} mt-[-100px]`} />
                <div className={styles.inputField}>
                  <label for="description">Description</label>
                  <TextareaAutosize
                    placeholder="Enter details, skills, awards"
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          {project ? (
            <DialogActions className="flex !justify-between w-full">
              <button className="lightButton" onClick={handleDelete}>
                Delete Project
              </button>
              <button type="submit">Save Changes</button>
            </DialogActions>
          ) : (
            <DialogActions>
              <button type="submit">Add Project</button>
            </DialogActions>
          )}
        </form>
      </DialogContent>
    </StyledDialog>
  );
}

export default AddProjectDialog;
