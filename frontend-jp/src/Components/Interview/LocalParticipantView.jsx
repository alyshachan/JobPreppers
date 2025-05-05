import React, { useEffect, useState } from "react";
import { useAuth } from "../../provider/authProvider";
import {
  ParticipantView,
  StreamVideoParticipant,
} from "@stream-io/video-react-sdk";
import styles from "./VideoCall.module.css";

function LocalParticipantView({ participantList }) {
  const { participant } = participantList;
  return (
    <div className={styles.localParticipant}>
      <ParticipantView participant={participant} />
    </div>
  );
}

export default LocalParticipantView;
