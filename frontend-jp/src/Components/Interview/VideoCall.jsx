import React, { useEffect, useState } from "react";
import { useAuth } from "../../provider/authProvider";
import { CallingState, StreamCall, StreamVideo,  StreamVideoClient , useCall, useCallStateHooks, User } from "@stream-io/video-react-sdk"

function VideoCall() {
  const { user, setAuthData } = useAuth();
  const [streamToken, setStreamToken] = useState("");
  useEffect(() => {
    const fetchVideoCallData = async () => {
      try {
        console.log("requesting user token");
        const response = await fetch(
          `http://localhost:5000/api/VideoCall/token/${user.userID}`
        );
        if (response.ok) {
          const data = await response.json();
          const token = data.token;
          setStreamToken(token); //set stream broken, fix tmrw
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchVideoCallData();
  }, [user]);

  const callUser = {
    id: user.userID,
    name: user.firstName,
    image: user.profilePicture
  };

  const client = new StreamVideoClient({REACT_APP_STREAM_API_KEY, callUser, streamToken});
  const call = client.call('default', "testCall")

  return (
    <StreamVideo client={client}>
        <StreamCall call={call}>
            <CallLayout/>
        </StreamCall>
    </StreamVideo>
  );
}

const CallLayout = () => {
    const call = useCall();
    const {useCallCallingState, useParticipantCount} = useCallStateHooks();
    const callingState = useCallCallingState();
    const participantCount = useParticipantCount();

    if (callingState != CallingState.JOINED){
        return <div>Loading...</div>
    }

    return( 
        <div>
            Call "{call.id}" has {participantCount} participants
        </div>
    )

}

export default VideoCall;
