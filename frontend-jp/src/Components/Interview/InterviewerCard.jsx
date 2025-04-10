import "../JobPreppers.css";
import { useNavigate } from "react-router-dom";
import styles from "./InterviewerCard.module.css";
import defaultProfilePicture from "../defaultProfilePicture.png";

function InterviewerCard({
  name,
  username,
  title,
  specialties,
  availibility,
  onViewProfile,
  onSchedule,
}) {
  const navigate = useNavigate();
  const specialty = specialties?.replace(/^"|"$/g, "");

  return (
    <>
      <div className={styles.interviewerCard}>
        <img
          className="profilePicture mb-[-100px] z-0"
          src={defaultProfilePicture}
        />

        <div className={styles.card}>
          <h1>{name}</h1>
          <p className="subtitle">{title}</p>
          <div className="flex flex-col justify-start">
            <p className="font-bold">{specialty ? "Specialty: " : ""}</p>
            <p> {specialty}</p>
            <p className="font-bold">{availibility ? "Availibility: " : ""}</p>
            <p>{availibility}</p>
          </div>
          <div className={styles.cardButtons}>
            <button
              className={styles.viewProfileButton}
              onClick={() => navigate(`/Profile/${username}`)}
            >
              View profile
            </button>
            <button className={styles.scheduleButton} onClick={onSchedule}>
              Schedule
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default InterviewerCard;
