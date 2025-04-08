import React, { useEffect, useState } from "react";
import { useAuth } from "../provider/authProvider";
import User from "./User";
import Company from "./Company";
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
  const { user, setAuthData } = useAuth(); // custom hook for authprovider

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

  return (
    <>
      <div className="content !mt-[175px]">
        {isCompany ? <Company /> : <User />}
      </div>
    </>
  );
}

export default Profile;
