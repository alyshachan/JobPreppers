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
} from "@stream-io/video-react-sdk";
import LocalParticipantView from "./LocalParticipantView";
import RemoteParticipantView from "./RemoteParticipantView";

function VideoCall() {
  const { user, setAuthData } = useAuth();
  const [streamToken, setStreamToken] = useState("");
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchVideoCallData = async () => {
      try {
        console.log("requesting user token");
        const response = await fetch(
          `http://localhost:5000/api/VideoCall/token/${user.userID}`,
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
        name: `${user.firstName} ${user.lastName}`,
        image: user.profilePicture,
      },
      token: streamToken,
    });

    setClient(newClient);
  }, [user, streamToken]);

  useEffect(() => {
    if (!client) return;

    const newCall = client.call("default", "testCall");
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
  const call = useCall();
  const {
    useCallCallingState,
    useParticipantCount,
    useLocalParticipant,
    useRemoteParticipants,
  } = useCallStateHooks();
  const callingState = useCallCallingState();
  const localParticipant = useLocalParticipant();
  const remoteParticipants = useRemoteParticipants();
  const participantCount = useParticipantCount();

  if (callingState != CallingState.JOINED) {
    return <div>Loading...</div>;
  }

  return (
    <StreamTheme>
      <RemoteParticipantView
        participantList={{ participants: remoteParticipants }}
      />
      <LocalParticipantView
        participantList={{ participant: localParticipant }}
      />
    </StreamTheme>
    // <div>
    //   Call "{call.id}" has {participantCount} participants
    // </div>
  );
};

export default VideoCall;
