import AddProjectDialog from "../Components/Profile/AddProjectDialog"
import React, { useEffect, useState } from "react";
import { useAuth } from "../provider/authProvider";
import 'react-activity-feed/dist/index.css';
import { StreamApp, FlatFeed, Activity, StatusUpdateForm, LikeButton } from 'react-activity-feed';
const apiURL = process.env.REACT_APP_JP_API_URL;

function Feed() {
    const { user, setAuthData } = useAuth();
    const [streamToken, setStreamToken] = useState('');
    useEffect(() => {
        const fetchFeedData = async () => {
            try {
                console.log("requesting user token")
                const response = await fetch(apiURL + `/api/Feed/getFeedToken/${user.userID}`);
                if (response.ok) {
                    const data = await response.json()
                    const token = data.token;
                    setStreamToken(token);
                    console.log("stream client authorized")
                }
            }
            catch (e) {
                console.error(e);
            }

            try {
                const response = await fetch(apiURL + `/api/Stream/getOrCreate/${user.userID}`, // get streamUser
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ userID: user.userID })
                    });

                if (response.ok) {
                    const data = await response.json();

                    if (data.data.name == "Unknown") {
                        await fetch(apiURL + `/api/Stream/update/${user.userID}`, // update if needed
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({ userID: user.userID })
                            });
                    }
                    console.log("stream user acquired :)")
                }
                else {
                    console.error("Error getting/creating stream user");
                }
            }
            catch (error) {
                console.error(error);
            }
        }
        fetchFeedData();
    }, [user])


    const CustomActivity = ({ activity }) => {
        return (
            <div className="activity">
                <div color="white">
                    <div className="bg-white p-2 border border-gray-300 rounded-lg mt-2 shadow-md relative">
                        <Activity activity={activity} />
                        <div className="absolute bottom-0 right-0 mb-0 mr-2">
                            <LikeButton reactionKind="like" activity={activity} background-color="white" />
                        </div>
                    </div>
                </div>
            </div>
        );
    };



    return (
        (streamToken && <StreamApp
            apiKey={process.env.REACT_APP_STREAM_API_KEY}
            appId={process.env.REACT_APP_STREAM_APP_ID}
            token={streamToken}
        >
            <div className="flex w-full p-4 space-x-4">

                <div className="w-2/3">
                    <StatusUpdateForm feedGroup="user" />
                    {/* <div className="flex w-full p-4 space-x-4"> */}
                    {/* <div className="w-1/2">
                            <h1>Your posts</h1>
                            <FlatFeed
                                classname="flat-feed"
                                feedGroup="user"
                                options={{ limit: 10 }}
                                Activity={(props) => <CustomActivity {...props} />}
                            />
                        </div> */}
                    <div>
                        <h1>Timeline</h1>
                        <FlatFeed
                            classname="flat-feed"
                            feedGroup="timeline"
                            options={{
                                enrich: true,
                                limit: 10,
                                reactions: { own: true, counts: true }
                            }}
                            //     Activity={(props) => <Activity {...props}
                            //         actor={(props.activity.actor_data?.name || "Unknown User")} />}
                            // />
                            Activity={(props) => <CustomActivity {...props} />}
                        />
                    </div>

                    {/* </div> */}
                </div>
                <div className="w-1/3">
                    <h1>Discover new connections</h1>
                    <div className="flex flex-col">
                        <hr />
                        <div className="panel">
                            <hr />
                            <button className="lightButton">Load more</button>
                        </div>
                    </div>
                </div>
            </div>

        </StreamApp>)
    )
}

export default Feed;