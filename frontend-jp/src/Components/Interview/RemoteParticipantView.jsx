import React, { useEffect, useState } from "react";
import { useAuth } from "../../provider/authProvider";
import {
ParticipantView,
StreamVideoParticipant
} from "@stream-io/video-react-sdk";
import styles from "./VideoCall.module.css"

function RemoteParticipantView({participantList}) {
    const {participants} = participantList
  return (
    <div className={styles.participantView}>
        {participants.map((participant) => (
            <ParticipantView participant={participant} key={participant.sessionID}/>
        ))}
        </div>
  );
}

export default RemoteParticipantView;
