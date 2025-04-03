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
import Company from "./Company";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";
import styles from "../Components/Profile/Profile.module.css";
import "../Components/JobPreppers.css";
const apiURL = process.env.REACT_APP_JP_API_URL;

function Profile() {
  const { user, setAuthData } = useAuth(); // custom hook for authprovider
  if (user == null) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="content !mt-[175px]">
          {user.accountType == "user" ? <User/> : <Company/>}
      </div>
    </>
  );
}

export default Profile;
