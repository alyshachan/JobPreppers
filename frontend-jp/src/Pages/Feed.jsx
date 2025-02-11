import AddProjectDialog from "../Components/Profile/AddProjectDialog"
import React, { useEffect, useState } from "react";
import { useAuth } from "../provider/authProvider";
import { StreamApp, FlatFeed, Activity, StatusUpdateForm } from 'react-activity-feed';



function Feed(){
    const { user, setAuthData } = useAuth();
    const {streamToken, setStreamToken} = useState('');
    useEffect(() => {
        const fetchFeedData = async () => {
        try{
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
        catch{
            console.error("Error fetching Stream API token");
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


    return(
        (streamToken && <StreamApp
        apiKey={process.env.REACT_APP_STREAM_API_KEY}
        appId={process.env.REACT_APP_STREAM_APP_ID}
        token={streamToken}
      >
        <div>
          <h1>Feed</h1>
          <StatusUpdateForm feedGroup="user" />
          {/* FlatFeed displays a list of activities from the "user" feed */}
          <FlatFeed
            feedGroup="user"
            options={{ limit: 10 }}
            Activity={(props) => <Activity {...props} />}
          />
        </div>
      </StreamApp>)
    )
}

export default Feed;