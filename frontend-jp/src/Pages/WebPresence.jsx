import TeamMemberDescription from "../Components/WebPresence/TeamMemberDescription";
import Technologies from "../Components/WebPresence/Technologies";
function WebPresence() {
  return (
    <>
      <div className="flex flex-col m-4">
        <Technologies />
        <TeamMemberDescription />
      </div>
    </>
  );
}

export default WebPresence;
