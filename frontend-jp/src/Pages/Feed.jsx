import AddProjectDialog from "../Components/Profile/AddProjectDialog"
import React, { useEffect, useState } from "react";
import { useAuth } from "../provider/authProvider";
import 'react-activity-feed/dist/index.css';
import { StreamApp, FlatFeed, Activity, StatusUpdateForm } from 'react-activity-feed';



function Feed(){
    const { user, setAuthData } = useAuth();
    const [streamToken, setStreamToken] = useState('');
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
        catch(e) {
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


    return(
        <>
        <h1>Feed</h1>
        </>
    )
}

export default Feed;