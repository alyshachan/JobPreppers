import TeamMemberDescription from "../Components/WebPresence/TeamMemberDescription";
import Technologies from "../Components/WebPresence/Technologies";
import Features from "../Components/WebPresence/Features";
import { useAuth } from "../provider/authProvider";
import Summary from "../Components/WebPresence/Summary";
import NavBar from "../Components/WebPresence/NavBar";
function WebPresence() {
  const { user, setAuthData } = useAuth();

  return (
    <>
    {user == null ? <NavBar /> : <></>}
      <div className="flex flex-col m-4">
        <Summary />
        <Technologies />
        <TeamMemberDescription />
        <Features/>
      </div>
    </>
  );
}

export default WebPresence;
