import TeamMemberDescription from "../Components/WebPresence/TeamMemberDescription";
import Technologies from "../Components/WebPresence/Technologies";
import Features from "../Components/WebPresence/Features";

function WebPresence() {
  return (
    <>
      <div className="flex flex-col m-4">
        <Technologies />
        <TeamMemberDescription />
        <Features/>
      </div>
    </>
  );
}

export default WebPresence;
