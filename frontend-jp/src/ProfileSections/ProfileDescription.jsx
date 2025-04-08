import React, { useEffect, useState } from "react";
import { useAuth } from "../provider/authProvider";
import { Button } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import defaultProfilePicture from "../Components/defaultProfilePicture.png";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";
import "../Components/JobPreppers.css";
import styles from "../Components/Profile/Profile.module.css";
const apiURL = process.env.REACT_APP_JP_API_URL;

async function fetchCompanyStatus(userID) {
  const res = await fetch(apiURL + `/api/Company/isCompany/?userID=${userID}`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch company status");
  }
  let result = await res.json();
  return result.isCompany;
}

async function fetchRecruiterStatus(userID) {
  const res = await fetch(apiURL + `/api/Recruiter/isRecruiter/?userID=${userID}`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch recruiter status");
  }
  let result = await res.json();
  return result.isRecruiter;
}

function ProfileDescription({ visitingUser, edit, setEdit, friendCount }) {
  const { user, setAuthData } = useAuth(); // custom hook for authprovider

  const {
    data: isCompany,
  } = useQuery({
    queryKey: ["isCompany", user?.userID],
    queryFn: () => fetchCompanyStatus(user.userID),
    enabled: !!user?.userID, // Only run if userID exists
  });

  const {
    data: isVisitingRecruiter,
  } = useQuery({
    queryKey: ["isRecruiter", visitingUser?.userID],
    queryFn: () => fetchRecruiterStatus(visitingUser.userID),
    enabled: !!visitingUser?.userID, // Only run if userID exists
  });


  const userPic =
    visitingUser.profile_pic == null
      ? defaultProfilePicture
      : "data:image/png;base64," +
        visitingUser.profile_pic.toString().toString("base64");

  return (
    <div className={styles.personalInfo}>
      <img className="profilePicture" alt="Profile Picture" src={userPic} />
      <p className={styles.name}>
        {visitingUser.first_name} {visitingUser.last_name}
      </p>
      <p>{visitingUser.title}</p>
      <p className="subtitle">{visitingUser.location}</p>
      <a
        href="/Friends"
        className="font-bold text-xl text-[#4ba173] hover:underline"
      >
        {friendCount} connections
      </a>
      <p className="subtitle">{visitingUser.location}</p>

      <div className={styles.actionButtons}>
        {user.username === visitingUser.username ? (
          <Button
            className={styles.editProfileButton}
            variant="contained"
            startIcon={edit ? <VisibilityIcon /> : <EditIcon />}
            onClick={() => setEdit(!edit)}
          >
            {edit ? "View Profile" : "Edit Profile"}
          </Button>
        ) : (
          <Button variant="contained" startIcon={<AddCircleOutlineIcon />}>
            Connect
          </Button>
        )}
        {isCompany && isVisitingRecruiter && user.username != visitingUser.username && (
          <Button
            className={styles.editProfileButton}
            variant="contained"
            startIcon={edit ? <VisibilityIcon /> : <EditIcon />}
            onClick={() => setEdit(!edit)}
          >
            {edit ? "Add as Recruiter" : "Remove recruiter"}
          </Button>
        )}
      </div>
    </div>
  );
}

export default ProfileDescription;
