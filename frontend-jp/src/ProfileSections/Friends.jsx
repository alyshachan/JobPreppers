import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import React, { useState, useEffect, useRef } from "react";
import "../Components/JobPreppers.css";
import styles from "../Components/Profile/ProfileSections.module.css";
import { useAuth } from "../provider/authProvider";
import DefaultPic from "../Components/JobPreppers_DefaultPic.png";
import { useParams } from "react-router-dom";
const apiURL = process.env.REACT_APP_JP_API_URL;

function Friends() {
    const { username } = useParams();
    const [visitingUser, setUser] = useState(null);
  const [friendsDict, setFriendsDict] = useState([]);

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
          setFriendsDict([]);
        } else {
          throw new Error("Failed to fetch user");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [username, apiURL]);

  useEffect(() => {
    const requestFriends = async () => {
      try {
        const response = await fetch(
          apiURL + `/api/Friend/GetFriends/${visitingUser.userID}`,
          {
            credentials: "include", // include cookies
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data) {
            const newFriendsDict = data.map((friend) => ({
              userID: friend.userID,
              username: friend.username,
              name: friend.name,
              profilePic: friend.profilePicture ? "data:image/png;base64," + friend.profilePicture.toString().toString("base64") : DefaultPic,
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
  }, [visitingUser, friendsDict]);

  if (visitingUser == null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="content">
      <div className="panelTransparent">
        <a href={`/Profile/${visitingUser.username}`} className="text-[var(--jp-border)] hover:underline mb-8">
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
