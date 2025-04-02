import React, { useEffect, useState } from "react";
import { useAuth } from "../provider/authProvider";
import { Button } from "@mui/material";
import ProfileDescription from "../ProfileSections/ProfileDescription";
import EducationSection from "../ProfileSections/EducationSection";
import SkillsSection from "../ProfileSections/SkillsSection";
import ExperienceSection from "../ProfileSections/ExperienceSection";
import ProjectSection from "../ProfileSections/ProjectSection";
import defaultProfilePicture from "../Components/defaultProfilePicture.png";
import User from "./User";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";
import styles from "../Components/Profile/Profile.module.css";
import "../Components/JobPreppers.css";
const apiURL = process.env.REACT_APP_JP_API_URL;

function Profile() {
  const { user, setAuthData } = useAuth(); // custom hook for authprovider
  const [friendCount, setFriendCount] = useState(0);
  const [edit, setEdit] = useState(() => {
    return localStorage.getItem("editMode") === "true";
  });

  const fetchFriendCount = async () => {
    try {
      const response = await fetch(
        apiURL + `/api/Friend/GetFriends/${user.userID}`,
        {
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();

        if (Array.isArray(data)) {
          setFriendCount(data.length); // Count the number of friends
        } else {
          setFriendCount(0); // No friends found
        }
      } else {
        throw new Error("Failed to fetch friends list");
      }
    } catch (error) {
      console.error("Error fetching friend count:", error);
    }
  };
  fetchFriendCount();

  return (
    <>
      <div className="content !mt-[175px]">
        <div className="panel !flex-row gap-[50px]">
          <ProfileDescription
            user={user}
            edit={edit}
            setEdit={setEdit}
            friendCount={friendCount}
          />
          <User />
        </div>
      </div>
    </>
  );
}

export default Profile;
