import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import React, { useState, useEffect, useRef } from "react";
import "../Components/JobPreppers.css";
import styles from "../Components/Profile/ProfileSections.module.css";
import { useAuth } from "../provider/authProvider";
import defaultProfilePicture from "../Components/defaultProfilePicture.png"

function Friends() {
  const { user, setAuthData } = useAuth(); // custom hook for authprovider
  const [friendsDict, setFriendsDict] = useState([]);

  useEffect(() => {
    const requestFriends = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/Friend/GetFriends/${user.userID}`,
          {
            credentials: "include", // include cookies
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("API Response: ", data); // Log the response to verify the structure

          if (data) {
            const newFriendsDict = data.map((friend) => ({
              userID: friend.userID,
              username: friend.username,
              name: friend.name,
              profilePic: "data:image/png;base64," + friend.profilePicture.toString().toString("base64"),
              title: friend.title,
            }));

            setFriendsDict((prevState) => {
              if (
                JSON.stringify(prevState) !== JSON.stringify(newFriendsDict)
              ) {
                return newFriendsDict;
              }
              return prevState;
            });
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    requestFriends();
  }, [user, friendsDict]);

  return (
    <div className="content">
      <div className="panelTransparent">
        <a href="/Profile" className="text-[#0D7944] hover:underline mb-8">
          <ArrowBackIcon /> Go back to Profile Page
        </a>
        <h1>Friends</h1>

        <div className="panel !w-full">
          {friendsDict.map((friend, index) => (
            <div key={index}>
              <div className="flex flex-col">
                <div className="flex p-2 gap-4">
                  <img
                    className="rounded-full aspect-square w-20 h-20"
                    alt={`${friend.name}'s Profile Picture`}
                    src={friend.profilePic}
                  />

                  <div className="flex flex-col flex-grow">
                      <b className="text-xl">{friend.name}</b>
                    <p className="subtitle">
                      {friend.title}
                    </p>

                  </div>
                    <div className="flex items-center justify-end">
                      <button className="lightButton">Message</button>
                    </div>
                </div>
                {index < friendsDict.length - 1 && (
                  <hr className="border-t border-gray-300 -ml-[3px] my-2" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Friends;
