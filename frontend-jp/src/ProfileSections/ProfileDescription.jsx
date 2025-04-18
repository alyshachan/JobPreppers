import React, { useEffect, useState } from "react";
import { useAuth } from "../provider/authProvider";
import { Button } from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import DefaultPic from "../Components/JobPreppers_DefaultPic.png";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";
import "../Components/JobPreppers.css";
import BadgeIcon from "@mui/icons-material/Badge";
import styles from "../Components/Profile/Profile.module.css";
import Tooltip from "@mui/material/Tooltip";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
const apiURL = process.env.REACT_APP_JP_API_URL;

async function fetchCompanyStatus(userID) {
  const response = await fetch(
    apiURL + `/api/Company/isCompany/?userID=${userID}`,
    {
      credentials: "include",
    }
  );
  if (response.ok) {
    let result = await response.json();
    return result.isCompany;
  } else {
    throw new Error("Failed to fetch company status");
  }
}

async function fetchRecruiterStatus(userID) {
  const response = await fetch(
    apiURL + `/api/Recruiter/isRecruiter/?userID=${userID}`,
    {
      credentials: "include",
    }
  );

  if (response.ok) {
    let result = await response.json();
    return result.isRecruiter;
  } else {
    throw new Error("Failed to fetch recruiter status");
  }
}

async function fetchFriendStatus(userId, friendId) {
  const response = await fetch(
    apiURL +
    `/api/Friend/GetFriendStatus?userId=${userId}&friendId=${friendId}`,
    { credentials: "include" }
  );
  if (response.ok) return await response.text();
  else throw new Error("Failed to fetch friend status");
}

function ProfileDescription({ visitingUser, edit, setEdit, friendCount }) {
  const { user, setAuthData } = useAuth(); // custom hook for authprovider
  const [friendStatus, setFriendStatus] = useState("None");
  const queryClient = useQueryClient();

  useEffect(() => {
    if (
      user?.userID &&
      visitingUser?.userID &&
      user.userID !== visitingUser.userID
    ) {
      fetchFriendStatus(user.userID, visitingUser.userID)
        .then(setFriendStatus)
        .catch(console.error);
    }
  }, [user, visitingUser]);

  const handleSendFriendRequest = async () => {
    try {
      const response = await fetch(apiURL + `/api/Friend/FriendRequest`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.userID,
          friendId: visitingUser.userID,
        }),
      });

      if (response.ok) {
        setFriendStatus("Pending");
      } else {
        const err = await response.text();
        console.error("Error sending request:", err);
      }
    } catch (err) {
      console.error("Friend request error:", err);
    }
  };

  const handleAddRecruiter = async () => {
    try {
      const response = await fetch(apiURL + `/api/Recruiter/CreateRecruiter`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userID: visitingUser.userID,
          companyID: user.userID, // Assuming the company is the logged-in user
        }),
      });

      if (response.ok) {
        queryClient.invalidateQueries(["isVisitingRecruiter", visitingUser.userID]);
      } else {
        const err = await response.text();
        console.error("Failed to add recruiter: " + err);
      }
    } catch (err) {
      console.error("Error adding recruiter:", err);
    }
  };


  const { data: isRecruiter } = useQuery({
    queryKey: ["isRecruiter", user?.userID],
    queryFn: () => fetchRecruiterStatus(user.userID),
    enabled: !!user?.userID,
  });

  const { data: isCompany } = useQuery({
    queryKey: ["isCompany", user?.userID],
    queryFn: () => fetchCompanyStatus(user.userID),
    enabled: !!user?.userID,
  });

  const { data: isVisitingRecruiter } = useQuery({
    queryKey: ["isVisitingRecruiter", visitingUser?.userID],
    queryFn: () => fetchRecruiterStatus(visitingUser.userID),
    enabled: !!visitingUser?.userID,
  });

  const { data: isVisitingCompany } = useQuery({
    queryKey: ["isVisitingCompany", visitingUser?.userID],
    queryFn: () => fetchCompanyStatus(visitingUser.userID),
    enabled: !!visitingUser?.userID,
  });

  const userPic =
    visitingUser.profile_pic == null
      ? DefaultPic
      : "data:image/png;base64," +
      visitingUser.profile_pic.toString().toString("base64");

  if (!visitingUser || !user) return <div>Loading user...</div>;
  return (
    <div className={styles.personalInfo}>
      <img className="profilePicture" alt="Profile Picture" src={userPic} />
      <p className={styles.name}>
        {visitingUser.first_name} {visitingUser.last_name}
        {isRecruiter ||
          (isVisitingRecruiter && (
            <Tooltip title="Recruiter" placement="top" arrow>
              <BadgeIcon className={styles.icon} />
            </Tooltip>
          ))}
      </p>
      <p>{visitingUser.title}</p>
      <p className="subtitle">{visitingUser.location}</p>
      <a
        href={`/Friends/${visitingUser.username}`}
        className="font-bold text-xl text-[var(--jp-primary)] hover:underline"
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
          <Button
            variant="contained"
            startIcon={
              friendStatus === "Friends" ? (
                <PeopleAltIcon />
              ) : (
                <AddCircleOutlineIcon />
              )
            }
            onClick={
              friendStatus === "None" ? handleSendFriendRequest : undefined
            }
            disabled={friendStatus === "Pending"}
            style={
              friendStatus === "Friends"
                ? {
                  pointerEvents: "none",
                  opacity: 1,
                }
                : {}
            }
          >
            {friendStatus === "Friends"
              ? "Friends"
              : friendStatus === "Pending"
                ? "Pending"
                : "Connect"}
          </Button>
        )}
        {isCompany &&
          !isVisitingCompany &&
          !isVisitingRecruiter &&
          user.username != visitingUser.username && (
            <Button
              className={styles.editProfileButton}
              variant="contained"
              startIcon={<BadgeIcon />}
              onClick={handleAddRecruiter}
            >
              Add Recruiter
            </Button>
          )}
      </div>
    </div>
  );
}

export default ProfileDescription;
