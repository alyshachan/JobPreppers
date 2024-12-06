import "./InterviewerCard.css";

function InterviewerCard({ name, title, rating, onViewProfile, onSchedule }) {
  return (
    <>
      <div className="interviewerCard">
        <img className="circle w-[200px] !bg-transparent" src="https://cdn.discordapp.com/attachments/1275166863864893632/1314439526835421184/115-1150152_default-profile-picture-avatar-png-green.png?ex=6753c6b4&is=67527534&hm=83836f3f3773d0eb1c075b2fd6825f9e37c9a2ee05ccd58fd32fe17644ae8404&"/>

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
