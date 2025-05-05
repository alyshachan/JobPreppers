import "../App.css";
import React, { useState, useEffect } from "react";
import { useAuth } from "../provider/authProvider";
import * as signalR from "@microsoft/signalr";
import "react-chat-elements/dist/main.css";
import DefaultPic from "../Components/JobPreppers_DefaultPic.png";
// import { MessageList, SystemMessage, ChatList, Input, Button } from 'react-chat-elements'; // deprecrated 2/26
import { styled } from "@mui/material/styles";
import { StreamChat } from "stream-chat";
// import '@stream-io/stream-chat-css';
// import 'stream-chat-css/dist/v2/css/index.css';
import "stream-chat-react/dist/css/v2/index.css";
// import 'stream-chat-react/dist/css/styles.css';
// import './styles/stream-chat.css';

import {
  Chat,
  Channel,
  ChannelList,
  Window,
  ChannelHeader,
  MessageList,
  MessageInput,
  Thread,
  useCreateChatClient,
} from "stream-chat-react";

/* Style overrides */
// const StyledInput = styled(Input)(({ theme }) => ({
//     "& .input": {
//         marginbottom: "-20px !important"
//     },
// }));

// const StyledChatList = styled(ChatList)(({ theme }) => ({
//     "& .rce-citem": {
//         minHeight: "100px !important",
//         alignItems: "start"
//     },
//     "& .rce-citem-body": {
//         alignSelf: "center"
//     },
//     "& .rce-citem-avatar": {
//         alignSelf: "center"
//     }
// }));

// 2/25: put useState for await chatClient.connectUser... check stream docs

function Messaging() {
  const { user, setAuthData } = useAuth();
  // /* div render booleans */
  const [chatOpened, setChatOpened] = useState(false);

  const [chatToken, setChatToken] = useState(null);
  const [chatClient, setChatClient] = useState(null);
  // const client = StreamChat.getInstance(process.env.REACT_APP_STREAM_API_KEY, {
  //     secret: process.env.REACT_APP_STREAM_SECRET
  // });

  const apiURL = process.env.REACT_APP_JP_API_URL;

  useEffect(() => {
    const fetchMessagingData = async () => {
      // if (user && user.userID) {
      try {
        const response = await fetch(
          apiURL + `/api/Chat/getChatToken/${user.userID}`
        );
        if (response.ok) {
          const data = await response.json();
          setChatToken(data.token);
        }
      } catch (e) {
        console.error("Error connecting to Stream Chat API");
        console.error(e);
      }
      // }
      // if (user && user.userID){
      // }
    };
    if (user && user.userID) {
      fetchMessagingData();
    }
  }, [user]);

  useEffect(() => {
    if (chatToken && user) {
      const createConnection = async () => {
        const client = StreamChat.getInstance(
          process.env.REACT_APP_STREAM_API_KEY,
          {
            secret: process.env.REACT_APP_STREAM_SECRET,
          }
        );
        try {
          if (!client.user) {
            await client.connectUser(
              {
                id: `${user.userID}`,
                name: `${user.first_name + " " + user.last_name}`,
              },
              chatToken
            );

            setChatClient(client);
          }
        } catch (e) {
          console.error(e);
          console.log(e);
        }
      };
      if (chatToken) {
        createConnection();
      }

      return () => {
        if (chatClient) {
          chatClient.disconnectUser();
        }
        // chatClient.disconnectUser();
      };
    }
  }, [chatToken, user, chatClient]);

  if (!user || !chatClient) {
    return <div></div>;
  }

  if (
    !chatClient ||
    !chatClient.wsConnection ||
    !chatClient.wsConnection.isHealthy
  ) {
    return <div>Loading chat...</div>;
  }

  if (chatClient) {
    console.log(chatClient.wsConnection);
  }

  const options = {
    presence: true,
    watch: true,
    state: true,
    connection_id: chatClient.wsConnection.connectionID,
  };
  return (
    <div>
      <button
        onClick={() => setChatOpened(!chatOpened)}
        style={{
          // position: "fixed", // Fixes the button in place
          position: "fixed", // Always fixed
          top: "auto",
          bottom: chatOpened ? "calc(20px + 400px)" : "20px",
          right: "20px", // Places the button on the right
          padding: "10px",
          backgroundColor: "var(--jp-secondary)",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Messaging
      </button>

      {chatClient &&
        chatClient.user &&
        chatClient.wsConnection &&
        chatOpened && (
          <div
            style={{
              position: "fixed",
              bottom: "20px",
              right: "20px",
              width: "700px", // Adjust width as needed
              height: "400px", // Adjust height as needed
              background: "white",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              borderRadius: "10px",
              display: "flex",
              flexDirection: "row"
            }}
          >
            <Chat client={chatClient} style={{ height: "100%" }}>
              <ChannelList
                filters={{
                  type: "messaging",
                  members: { $in: [user.userID.toString()] },
                }}
                options={options}
                connectionID={chatClient.wsConnection.connectionID}
                style={{
                  // flexShrink: 0, // Prevent ChannelList from shrinking
                  height: "250px", // Adjust height for ChannelList
                  width: "600px",
                  overflowY: "auto", // Allow scrolling if there are many channels
                }}
              />
              <div
                style={{
                  // height: "300px",
                  // width: "300px",
                  flexDirection: "row",
                  borderRadius: "10px",
                  flexGrow: 1,
                }}>
                <Channel>
                  <Window>
                    <ChannelHeader />
                    <MessageList
                      style={{
                        height: "150px",
                        position: "fixed",
                        overflowY: "auto", // Makes the message list scrollable
                      }}
                    />
                    <MessageInput
                      style={{
                        marginTop: "auto", // Keep MessageInput at the bottom
                      }}
                    />
                  </Window>
                  <Thread />
                </Channel>
              </div>

            </Chat>
          </div>

        )
      }
    </div >
  );
}

export default Messaging;
