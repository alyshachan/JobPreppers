import React, { useEffect, useState } from "react";
import { useAuth } from "../provider/authProvider";
import { Button, Box } from "@mui/material";
import { useParams } from "react-router-dom";

import EducationSection from "../ProfileSections/EducationSection";
import SkillsSection from "../ProfileSections/SkillsSection";
import ExperienceSection from "../ProfileSections/ExperienceSection";
import ProjectSection from "../ProfileSections/ProjectSection";
import defaultProfilePicture from "../Components/defaultProfilePicture.png";
import ProfileDescription from "../ProfileSections/ProfileDescription";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";
import styles from "../Components/Jobs/Jobs.module.css";
import "../Components/JobPreppers.css";
import JobDescription from "../Components/Jobs/JobDescription";
import SectionHeader from "../Components/Profile/SectionHeader";
import CompanyJobs from "../Components/Profile/CompanyJobs";
import NoResultPage from "../Components/Jobs/Posting/NoResultPage";
import ReadMoreDrawer from "../Components/Jobs/ReadMoreComponent/ReadMoreDrawer";

function User() {
  const { currentUser, setAuthData } = useAuth(); // custom hook for authprovider
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const { initialUser, setIntialUser } = useState(null);
  const [edit, setEdit] = useState(() => {
    return localStorage.getItem("editMode") === "true";
  });
  const [friendCount, setFriendCount] = useState(0);
  const [openDialog, setOpenDialog] = useState({
    education: false,
    skill: false,
    experience: false,
    project: false,
  });
  const [message, setMessage] = useState("");
  const [receiverID, setReceiverID] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [jobs, setJobs] = useState([]);
  const apiURL = process.env.REACT_APP_JP_API_URL;

  const toggleDialog = (type, state) => {
    setOpenDialog((prev) => ({ ...prev, [type]: state }));
  };

  useEffect(() => {
    localStorage.setItem("editMode", edit);
  }, [edit]);

    useEffect(() => {
      const fetchUser = async () => {
        try {
          console.log(username)
          const response = await fetch(
            apiURL + `/api/Users/GetUserFromUsername/${username}`,
            { credentials: "include" }
          );
    
          if (response.ok) {
            const data = await response.json();
            console.log("Fetched user:", data);
            setUser(data); 
          } else {
            throw new Error("Failed to fetch user");
          }
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      };
    
      fetchUser(); 
    }, [username, apiURL]);

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

  useEffect(() => {
    if (!user?.userID) return;

    const fetchJobs = async () => {
      try {
        const res = await fetch(
          apiURL + `/api/Company/?userID=${user.userID}`,
          { credentials: "include" }
        );

        if (res.ok) {
          const data = await res.json();
          setJobs(data);
        }
      } catch (error) {
        console.error("Error Getting Jobs:", error);
      }
    };

    fetchJobs();
  }, [user?.userID]);

  if (!user) return <div>Loading user...</div>;

  return (
    <>
      <div className="panel !flex-row gap-[50px]">
        <ProfileDescription
          user={user}
          edit={edit}
          setEdit={setEdit}
          friendCount={friendCount}
        />
        <div className="flex-col justify-between w-full">
          <SectionHeader header="Job Postings"/>
          {/* Where the job board section goes */}
          <Box className={styles.jobs}>
            {/* Main Content Area */}
            <Box
              className={`${styles.mainContentProfile} ${
                drawerOpen ? styles.drawerOpen : ""
              }`}
            >
              <div className="">
                {jobs.length > 0 ? (
                  <div className={styles.containerForCard}>
                    <CompanyJobs setDrawerOpen={setDrawerOpen} jobs={jobs} />
                  </div>
                ) : (
                  <NoResultPage />
                )}
              </div>
            </Box>

            {/* Drawer Area */}
            <Box
              className={`${styles.drawer} ${
                drawerOpen ? styles.drawerOpen : ""
              }`}
            >
              <ReadMoreDrawer />
            </Box>
          </Box>
        </div>
      </div>
    </>
  );
}

export default User;
