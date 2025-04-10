import AddProjectDialog from "../Components/Profile/AddProjectDialog";
import React, { useEffect, useState } from "react";
import { useAuth } from "../provider/authProvider";
import "react-activity-feed/dist/index.css";
import defaultProfilePicture from "../Components/defaultProfilePicture.png"
import {
  StreamApp,
  FlatFeed,
  Activity,
  StatusUpdateForm,
  LikeButton,
} from "react-activity-feed";
const apiURL = process.env.REACT_APP_JP_API_URL;

function Feed() {
  const { user, setAuthData } = useAuth();
  const [streamToken, setStreamToken] = useState("");
  const [recommendationDict, setRecDict] = useState([]);
  const [selectedFeed, setSelectedFeed] = useState("timeline");
  useEffect(() => {
    
    const fetchFeedData = async () => {
      try {
        const response = await fetch(
          apiURL + `/api/Friend/SyncFriends/${user.userID}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" }
          }
        );

        if (response.ok) {
          console.log("Friends synced");
        }

      }
      catch (err) {
        console.error(err);
      }

      try {
        console.log("requesting user token");
        const response = await fetch(
          apiURL + `/api/Feed/getFeedToken/${user.userID}`
        );
        if (response.ok) {
          const data = await response.json();
          const token = data.token;
          setStreamToken(token);
          console.log("stream client authorized");
        }
      } catch (e) {
        console.error(e);
      }

      try {
        const response = await fetch(
          apiURL + `/api/Stream/getOrCreate/${user.userID}`, // get streamUser
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userID: user.userID }),
          }
        );

        console.log("HELP");

        if (response.ok) {
          const data = await response.json();

          if (data.data.name == "Unknown") {
            await fetch(
              apiURL + `/api/Stream/update/${user.userID}`, // update if needed
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ userID: user.userID }),
              }
            );
          }
          console.log("stream user acquired :)");
        } else {
          console.error("Error getting/creating stream user");
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchFeedData();
  }, [user]);


  useEffect(() => {
    const requestRecommendations = async () => {
      console.log("fetching")
      try {
        const response = await fetch(
          apiURL + `/api/Feed/recommend/${user.userID}`,
          {
            credentials: "include", // include cookies
          }
        );

        if (response.ok) {
          const data = await response.json();

          if (data) {
            console.log(data);
            const newRecDict = data.recommendations.map((friend) => ({
              userID: friend.userID,
              name: friend.name,
              profilePic: friend.profilePic==null ? defaultProfilePicture
                    : "data:image/png;base64," +
                      friend.profilePic.toString().toString("base64"),
              title: friend.title,
              username: friend.username
            }));

            setRecDict((prevState) => {
              if (
                JSON.stringify(prevState) !== JSON.stringify(newRecDict)
              ) {
                return newRecDict;
              }
              return prevState;
            });
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    requestRecommendations();
  }, [user, recommendationDict]);

  const CustomActivity = ({ activity }) => {
    return (
      <div className="activity">
        <div color="white">
          <div className="bg-white p-2 border border-gray-300 rounded-lg mt-2 shadow-md relative">
            <Activity activity={activity} />
            <div className="absolute bottom-0 right-0 mb-0 mr-2">
              <LikeButton
                reactionKind="like"
                activity={activity}
                background-color="white"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    streamToken && (
      <StreamApp
        apiKey={process.env.REACT_APP_STREAM_API_KEY}
        appId={process.env.REACT_APP_STREAM_APP_ID}
        token={streamToken}
      >
        <div className="flex w-full p-4 space-x-4">
          <div className="w-2/3">
            <StatusUpdateForm 
            feedGroup={selectedFeed} 
            userID={selectedFeed === "global" ? "global_feed" : user.userID.toString()} 
            />
            <div>
              <div className="flex items-center justify-between mb-4">
                <h1>{selectedFeed.charAt(0).toUpperCase() + selectedFeed.slice(1)}</h1>
                <select
                  // value={selectedOption}
                  onChange={(e) => setSelectedFeed(e.target.value)}
                  className="ml-4 p-2 border rounded-md w-32"
                >
                  <option value="timeline">Timeline</option>
                  <option value="global">Global</option>
                  <option value="recruiter">Recruiter</option>
                </select>
              </div>
              <FlatFeed
                classname="flat-feed"
                feedGroup={selectedFeed === "global" ? "global" : selectedFeed}
                options={{
                  enrich: true,
                  limit: 10,
                  reactions: { own: true, counts: true },
                }}
                Activity={(props) => <CustomActivity {...props} />}
              />
            </div>

            {/* </div> */}
          </div>
          <div className="flex flex-col h-screen">
            <h1>Discover connections</h1>
            {/* <div className="flex flex-col">
              <hr />
              <div className="panel">
                <hr />
                <button className="lightButton">Load more</button>
              </div>
            </div> */}
            <div className="panel justify-left !px-[20px] flex-grow !w-full overflow-y-auto">
              {recommendationDict.length === 0 ? (
                <p className="text-gray-500 italic">No recommendations found</p>
              ) : (
                recommendationDict.map((rec, index) => (
                  <div key={index}>
                  <div className="flex flex-col flex-grow">
                    <div className="flex p-2 gap-4">
                      <img
                        className="rounded-full aspect-square w-20 h-20"
                        alt={`${rec.name}'s Profile Picture`}
                        src={rec.profilePic}
                      />

                      <div className="flex flex-col flex-grow">
                        <a href={`/Profile/${rec.username}`} className="hover:underline"><b className="text-xl">{rec.name}</b></a>
                        <p className="subtitle"> {rec.title}</p>

                      </div>
                    </div>
                    {index < recommendationDict.length - 1 && (
                      <hr className="border-t border-gray-300 -ml-[3px] my-2" />
                    )}
                  </div>
                </div>
                ))
              )}
            </div>
          </div>
        </div>

      </StreamApp>)
  );
}

export default Feed;
