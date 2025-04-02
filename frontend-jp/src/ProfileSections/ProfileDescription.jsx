import React, { useEffect, useState } from "react";
import { useAuth } from "../provider/authProvider";
import { Button } from "@mui/material";

import defaultProfilePicture from "../Components/defaultProfilePicture.png";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";
import "../Components/JobPreppers.css";
import styles from "../Components/Profile/Profile.module.css";
const apiURL = process.env.REACT_APP_JP_API_URL;


function ProfileDescription({user, edit, setEdit, friendCount}) {
    const userPic =
      user.profile_pic == null
        ? defaultProfilePicture
        : "data:image/png;base64," +
          user.profile_pic.toString().toString("base64");

  return (
    <div className={styles.personalInfo}>
      <img className="profilePicture" alt="Profile Picture" src={userPic} />
      <p className={styles.name}>
        {user.first_name} {user.last_name}
      </p>
      <p>{user.title}</p>
      <p className="subtitle">{user.location}</p>
      <a
        href="/Friends"
        className="font-bold text-xl text-[#4ba173] hover:underline"
      >
        {friendCount} connections
      </a>
      <p className="subtitle">{user.location}</p>

      <div className={styles.actionButtons}>
        <Button variant="contained" startIcon={<AddCircleOutlineIcon />}>
          Connect
        </Button>
        <Button
          className={styles.editProfileButton}
          variant="contained"
          startIcon={edit ? <VisibilityIcon /> : <EditIcon />}
          onClick={() => setEdit(!edit)}
        >
          {edit ? "View Profile" : "Edit Profile"}
        </Button>
      </div>
    </div>
  );
}

export default ProfileDescription;
