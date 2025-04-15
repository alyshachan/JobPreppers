import TeamMemberDescription from "../Components/WebPresence/TeamMemberDescription";
import Technologies from "../Components/WebPresence/Technologies";
import Summary from "../Components/WebPresence/Summary";
import NavBar from "../Components/WebPresence/NavBar";
function WebPresence() {
  return (
    <>
      <NavBar />
      <div className="flex flex-col m-4">
        <Summary />
        <Technologies />
        <TeamMemberDescription />
      </div>
    </>
  );
}

export default WebPresence;
