import "../JobPreppers.css";
import { useNavigate } from "react-router-dom";
import styles from "./InterviewerCard.module.css";
import DefaultPic from "../../Components/JobPreppers_DefaultPic.png";

function InterviewerCard({
  name,
  username,
  title,
  profilePic,
  specialties,
  availibility,
  onSchedule,
}) {
  const navigate = useNavigate();
  const specialty = specialties?.replace(/^"|"$/g, "");

    const interviewerPic =
      profilePic == null
        ? DefaultPic
        : "data:image/png;base64," +
        profilePic.toString().toString("base64");

  return (
    <>
      <div className={styles.interviewerCard}>
        <img
          className="profilePicture mb-[-100px] z-0"
          src={interviewerPic}
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
