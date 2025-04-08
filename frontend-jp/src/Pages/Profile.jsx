import React, { useEffect, useState } from "react";
import { useAuth } from "../provider/authProvider";
import User from "./User";
import Company from "./Company";
import defaultProfilePicture from "../Components/defaultProfilePicture.png";
import { useParams } from "react-router-dom";
import "../Components/JobPreppers.css";
import { useQuery } from "@tanstack/react-query";
const apiURL = process.env.REACT_APP_JP_API_URL;

async function fetchCompanyStatus(userID) {
  console.log("user id in fetchStatus: ", userID);
  const res = await fetch(apiURL + `/api/Company/isCompany/?userID=${userID}`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch company status");
  }
  let result = await res.json();
  return result.isCompany;
}

function Profile() {
  const { currentUser, setAuthData } = useAuth(); // custom hook for authprovider

  const {
    data: isCompany,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["isCompany", user?.userID],
    queryFn: () => fetchCompanyStatus(user.userID),
    enabled: !!user?.userID, // Only run if userID exists
  });

  if (!user) return <div>Loading user...</div>;
  if (isLoading) return <div>Loading profile...</div>;
  if (isError) return <div>Error loading profile. Try again later.</div>;

  const { username } = useParams();
  const [user, setUser] = useState(null);
  const apiURL = process.env.REACT_APP_JP_API_URL;


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
          setFriendCount(0);
          setEducationDict([]);
          setSkillsDict({});
          setExperienceDict([]);
          setProjectDict([]); 
        } else {
          throw new Error("Failed to fetch user");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
  
    fetchUser(); 
  }, [username, apiURL]);
    



  return (
    <>
      <div className="content !mt-[175px]">
        {isCompany ? <Company /> : <User />}
      </div>
    </>
  );
}

export default Profile;
