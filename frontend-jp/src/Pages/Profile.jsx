import EducationSection from "../ProfileSections/EducationSection";
import SkillsSection from "../ProfileSections/SkillsSection";
import ExperienceSection from "../ProfileSections/ExperienceSection";
import ProjectSection from "../ProfileSections/ProjectSection";
import defaultProfilePicture from "../Components/defaultProfilePicture.png"
import { useAuth } from "../provider/authProvider";
import React, { useEffect, useState, useRef } from 'react';
import * as signalR from '@microsoft/signalr';

function Profile() {

  const { user, setAuthData } = useAuth(); // custom hook for authprovider
  const {initialUser, setIntialUser} = useState(null);
  const [message, setMessage] = useState("");
  const [signalRConnection, setSignalRConnection] = useState(null);

  // const skillsTest = {}

  const [skillsTest, setSkillsTest] = useState({});
  // test message box handler
  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    console.log(`You inputted ${message}`);

    try {
      // console.log("Attempting to start connection");
      // await signalRConnection.start();
      // console.log('Connected to SignalR Hub');

      console.log("Attempting to send a test message");
      await signalRConnection.invoke("SendMessageToAll", user.username, message).then(
        () => console.log("Sent a message")
      );
    } catch (error) {
      console.error('Connection failed or invoke error:', error);
    }

    setMessage(""); // clear text box
  }

  useEffect(() => {
    const requestSkills = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/UserSkills/${user.userID}`, {
          credentials: "include", // include cookies
        });

        if (response.ok) {
          const data = await response.json();
          console.log("API Response: ", data);  // Log the response to verify the structure

          if (data) {
            let newSkillsTest = {}
            for (var userSkillID in data) {

              var skills = data[userSkillID]


              if (!newSkillsTest[skills.category]) {
                newSkillsTest[skills.category] = [skills.name]
              }
              else {
                newSkillsTest[skills.category].push(skills.name)
              }
            }
            setSkillsTest(prevState => {
              if (JSON.stringify(prevState) !== JSON.stringify(newSkillsTest)) {
                return newSkillsTest;
              }
              return prevState;
            });
          }
        };

      }
      catch (error) {
        console.log(error)
      }
    };

    if (user) {
      requestSkills(); // populate skills
      console.log("User: ", user)
    }
  }, [user]);  // only populate when user exists



  // useEffect(() => {
  //   const fetchUser = async () => {
  //     try {
  //       const res = await fetch(`http://localhost:5000/api/GetUser/${user.userID}`, {
  //         credentials: "include", // include cookies
  //       });

               
  //       if (res.ok) {
  //         const data = await res.json();
  //         console.log("GetUser: ", data);
  //         setIntialUser(data);
  //       } else {
  //         console.error("Failed to fetch User");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching User:", error);
  //     }
  //   };

  //   fetchUser();
  // }, [user]);

  // Testing chat server connection in this component - Will
  // this useEffect establishes the connection and stores it in a state
  useEffect(() => {
    const connectToHub = async () => {

    console.log("Attempting to connect to /DirectMessageHub");
    const connection = new signalR.HubConnectionBuilder()
    .withUrl("http://localhost:5070/directMessageHub", {
      accessTokenFactory: () => document.cookie.split('authToken=')[1] || '', 
    })
    .withAutomaticReconnect()
    .build();

    connection.onclose((error) => {
      console.error('Connection closed:', error);
    });


    try {
      console.log("Attempting to start connection");
      await connection.start()
      .then(() => {
        console.log('Connected to SignalR Hub');
        setSignalRConnection(connection); // store the connection in a state
      } );

      // moving this code to the handleSubmitMessage
      // console.log("Attempting to send a test message");
      // await connection.invoke("SendMessageToAll", user.username, "Hello world!").then(
      //   () => console.log("Sent a message")
      // );
    } catch (error) {
      console.error('Connection failed or invoke error:', error);
    }

    return () => {
      connection.stop();
    };
    };
    connectToHub();
  }, [])

  if (user == null) {
    return <div>Loading...</div>;
  }


  const userPic = (user.profile_pic == null) ? defaultProfilePicture : "data:image/png;base64," + user.profile_pic.toString().toString('base64');

  return (
    <>
      <div className="content !mt-[175px]">
        <div className="main-panel !flex-row gap-[50px]">
          <div className="main-personal">
          <form id="myForm" onSubmit={handleMessageSubmit}>
              <input 
              type="text" 
              id="message" 
              placeholder="Send a message"
              value = {message}
              onChange = {(e) => setMessage(e.target.value)}>
              </input>
          </form>

            <img className="circle !bg-transparent" alt="Profile Picture" src={userPic}/>
            <p className="name">
              {user.first_name} {user.last_name}
            </p>
            <p>Computer Science Student at the University of Utah</p>
            <p className="section-element-subtitle">
              Salt Lake City, UT
              <br /> United States
            </p>
          </div>

          <div className="main-professional">
            <EducationSection />
            <SkillsSection skillsDict={skillsTest} />
          </div>
        </div>

        <div className="main-panel">
          <ExperienceSection />
        </div>

        <div className="main-panel">
          <ProjectSection />
        </div>

      </div>
    </>
  );
}

export default Profile;
