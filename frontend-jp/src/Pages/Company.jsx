import React, { useEffect, useState } from "react";
import { useAuth } from "../provider/authProvider";
import { Button, Box } from "@mui/material";
import { useParams } from "react-router-dom";
import ProfileDescription from "../ProfileSections/ProfileDescription";
import styles from "../Components/Jobs/Jobs.module.css";
import "../Components/JobPreppers.css";
import JobDescription from "../Components/Jobs/JobDescription";
import SectionHeader from "../Components/Profile/SectionHeader";
import CompanyJobs from "../Components/Profile/CompanyJobs";
import NoResultPage from "../Components/Jobs/Posting/NoResultPage";
import ReadMoreDrawer from "../Components/Jobs/ReadMoreComponent/ReadMoreDrawer";

function User() {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const { initialUser, setIntialUser } = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [friendCount, setFriendCount] = useState(0);
  const [jobs, setJobs] = useState([]);
  const apiURL = process.env.REACT_APP_JP_API_URL;
  const [edit, setEdit] = useState(() => {
    return localStorage.getItem("editMode") === "true";
  });
  const [openDialog, setOpenDialog] = useState({
    education: false,
    skill: false,
    experience: false,
    project: false,
  });

  useEffect(() => {
    localStorage.setItem("editMode", edit);
  }, [edit]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(
          apiURL + `/api/Users/GetUserFromUsername/${username}`,
          { credentials: "include" }
        );

        if (response.ok) {
          const data = await response.json();
          setUser(data);
          setFriendCount(0);
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

  const fetchProfileDescription = async () => {
    try {
      const response = await fetch(
        apiURL + `/api/Users/GetUserFromUsername/${username}`,
        { credentials: "include" }
      );

      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        throw new Error("Failed to fetch user");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  if (!user) return <div>Loading user...</div>;

  return (
    <>
      <div className="panel !flex-row gap-[50px]">
        <ProfileDescription
          visitingUser={user}
          edit={edit}
          setEdit={setEdit}
          friendCount={friendCount}
          onAdd={fetchProfileDescription}
        />
        <div className="flex-col justify-between w-full">
          <SectionHeader header="Job Postings" />
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
