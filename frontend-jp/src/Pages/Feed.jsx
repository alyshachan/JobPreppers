import AddProjectDialog from "../Components/Profile/AddProjectDialog"
import React, { useEffect, useState } from "react";
import { useAuth } from "../provider/authProvider";
import 'react-activity-feed/dist/index.css';
import { StreamApp, FlatFeed, Activity, StatusUpdateForm } from 'react-activity-feed';



function Feed() {
    const { user, setAuthData } = useAuth();
    const [streamToken, setStreamToken] = useState('');
    useEffect(() => {
        const fetchFeedData = async () => {
            try {
                console.log("requesting user token")
                const response = await fetch(`http://localhost:5000/api/Feed/token/${user.userID}`);
                if (response.ok) {
                    console.log("did it work?");
                    const data = await response.json()
                    const token = data.token;
                    console.log(token);
                    setStreamToken(token); //set stream broken, fix tmrw
                }
            }
            catch (e) {
                console.error(e);
            }


            try {
                const response = await fetch(`http://localhost:5000/api/Feed/${user.userID}`);

                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                }
                else {
                    console.error("Error fetching feed data");
                }
            }
            catch (error) {
                console.error(error);
            }
        }
        fetchFeedData();
    }, [user])


    return (
        (streamToken && <StreamApp
            apiKey={process.env.REACT_APP_STREAM_API_KEY}
            appId={process.env.REACT_APP_STREAM_APP_ID}
            token={streamToken}
        >
            <div className="flex w-full p-4 space-x-4">

                <div className="w-2/3">
                    <StatusUpdateForm feedGroup="user" />
                    <div className="flex w-full p-4 space-x-4">
                        <div className="w-1/2">
                            <h1>Your posts</h1>
                            <FlatFeed
                                classname="flat-feed"
                                feedGroup="user"
                                options={{ limit: 10 }}
                                Activity={(props) => <Activity {...props} />}
                            />
                        </div>
                        <div className="w-1/2">
                            <h1>Timeline</h1>
                            <FlatFeed
                                classname="flat-feed"
                                feedGroup="user"
                                options={{ enrich:true, limit: 10 }}
                                Activity={(props) => <Activity {...props}
                                actor={(props.activity.actor_data?.name || "Unknown User")} />}
                            />
                        </div>

                    </div>
                </div>
            </div>

        </StreamApp>)
    )
}

export default Feed;