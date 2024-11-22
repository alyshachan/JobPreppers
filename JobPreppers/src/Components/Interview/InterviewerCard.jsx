import "./InterviewerCard.css";

function InterviewerCard({ name, title, rating, onViewProfile, onSchedule }) {
  return (
    <>
      <div className="interviewerCard">
        <div className="circle" />

        <div className="card">
          <h1>{name}</h1>

          <p className="title">{title}</p>
          <p className="rating">⭐ {rating}</p>

          <div className="cardButtons">
            <button className="viewProfileButton" onClick={onViewProfile}>
              View profile
            </button>
            <button className="scheduleButton" onClick={onSchedule}>
              Schedule
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default InterviewerCard;
