import "../JobPreppers.css";
import styles from "./InterviewerCard.module.css";
import defaultProfilePicture from "../defaultProfilePicture.png";

function InterviewerCard({ name, title, rating, onViewProfile, onSchedule }) {
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
          <p className={styles.rating}>⭐ {rating}</p>

          <div className={styles.cardButtons}>
            <button
              className={styles.viewProfileButton}
              onClick={onViewProfile}
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
