import React, { useEffect, useState } from "react";
import { useAuth } from "../../provider/authProvider";
import {
  CallingState,
  StreamCall,
  StreamTheme,
  StreamVideo,
  StreamVideoClient,
  useCall,
  useCallStateHooks,
  User,
  ParticipantList,
  LocalParticipant,
  SpeakerLayout,
  CallControls,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { useSearchParams } from "react-router-dom";
const apiURL = process.env.REACT_APP_JP_API_URL;

function VideoCall() {
  const { user, setAuthData } = useAuth();
  const [streamToken, setStreamToken] = useState("");
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [searchParams] = useSearchParams();
  const eventLink = searchParams.get("link") || "globalCall";

  useEffect(() => {
    if (!user) return;

    const fetchVideoCallData = async () => {
      try {
        console.log("requesting user token");
        const response = await fetch(
          apiURL + `/api/VideoCall/token/${user.userID}`,
          {
            credentials: "include", // include cookies
          }
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

  useEffect(() => {
    if (!user || !streamToken) return;

    const newClient = new StreamVideoClient({
      apiKey: process.env.REACT_APP_STREAM_API_KEY,
      user: {
        id: String(user.userID),
        name: `${user.first_name} ${user.last_name}`,
        image: user.profilePicture,
      },
      token: streamToken,
    });
    setClient(newClient);
  }, [user, streamToken]);

  useEffect(() => {
    if (!client) return;

    const newCall = client.call("default", eventLink);
    newCall.join({ create: true });

    setCall(newCall);
  }, [client]);

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <CallLayout />
      </StreamCall>
    </StreamVideo>
  );
}

const CallLayout = () => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  if (callingState != CallingState.JOINED) {
    return <div>Loading...</div>;
  }

  return (
    <StreamTheme>
      <SpeakerLayout />
      <CallControls onLeave={() => window.close()} />
    </StreamTheme>
  );
};

export default VideoCall;
