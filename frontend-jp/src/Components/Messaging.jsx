import "../App.css";
import React, { useState, useEffect } from "react";
import { useAuth } from "../provider/authProvider";
import * as signalR from "@microsoft/signalr";
import "react-chat-elements/dist/main.css";
import defaultProfilePicture from "../Components/defaultProfilePicture.png";
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
        console.log(`retrieving chat token for ${user.userID}`);
        const response = await fetch(
          apiURL + `/api/Chat/getChatToken/${user.userID}`
        );
        if (response.ok) {
          const data = await response.json();
          setChatToken(data.token);
          console.log("token set");
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
        console.log(chatToken);
        // console.log(client);
        const client = StreamChat.getInstance(
          process.env.REACT_APP_STREAM_API_KEY,
          {
            secret: process.env.REACT_APP_STREAM_SECRET,
          }
        );
        try {
          console.log(`token being used: ${chatToken}`);
          if (!client.user) {
            await client.connectUser(
              {
                id: `${user.userID}`,
                name: `${user.first_name + " " + user.last_name}`,
              },
              chatToken
            );

            console.log("hello?");
            setChatClient(client);
            console.log(chatClient);
            console.log(client.user);
          }
        } catch (e) {
          console.log("in error");
          console.error(e);
          console.log(e);
        }
      };
      if (chatToken) {
        console.log("please");
        createConnection();
      }

      return () => {
        console.log("disconnecting user from chat");
        if (chatClient) {
          chatClient.disconnectUser();
        }
        // chatClient.disconnectUser();
      };
    }
  }, [chatToken, user, chatClient]);

  if (!user || !chatClient) {
    return <div>Loading user data...</div>;
  }

  if (
    !chatClient ||
    !chatClient.wsConnection ||
    !chatClient.wsConnection.isHealthy
  ) {
    return <div>Loading chat...</div>;
  }

  if (chatClient) {
    console.log("here");
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
          backgroundColor: "#4ba173",
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
  /*
    HANDLERS
    */

  /*
    everything below here is old signalR chat implementation - will
    2/26
    */
  //     const inputClear = () => {
  //         if (inputReference.current != null) {
  //             inputReference.current.value = "";
  //         }
  //     }

  //     const handleMessagingClicked = (e) => {
  //         e.preventDefault();
  //         setChatListOpened(!chatListOpened);
  //     }

  //     const handleMessageSubmit = async (e) => {
  //         e.preventDefault();

  //         if (!inputReference.current) {
  //             console.warn("Input ref is null, something went wrong!");
  //             return;
  //         }

  //         const outMsg = inputReference.current.value;
  //         if (!outMsg.trim()) return;
  //         console.log(`You inputted ${outMsg}`);

  //         try {

  //             console.log("Attempting a message");
  //             await signalRConnection.invoke("SendDirectMessage", user.username, parseInt(receiverID), outMsg).then(
  //                 // () => console.log(`You sent this message: ${msg} \n to receiverID: ${receiverID}`)
  //                 () => {
  //                     setMessages(messages => [...messages, {
  //                         position: 'right',
  //                         type: 'text',
  //                         text: outMsg,
  //                         date: new Date(),

  //                     }])

  //                 }
  //             );
  //         } catch (error) {
  //             console.error('Connection failed or invoke error:', error);
  //         }
  //         inputClear();
  //     }

  //     const handleChatListClick = (chatListItem) => {
  //         setMessages([]);
  //         console.log(chatListItem.title);
  //         setConvoOpened(!convoOpened);

  //         if (chatListItem.title == "Alexander Lex") {
  //             console.log("Now conversing with userID 32")
  //             setReceiverID(32);
  //         }
  //         else if (chatListItem.title == "Justin Ellis") {
  //             console.log("Now conversing with userID 33")
  //             setReceiverID(33);
  //         }
  //         else if (chatListItem.title == "Alysha Chan") {
  //             console.log("Now conversing with userID 5")
  //             setReceiverID(5);
  //         }

  //     }

  //     const handleMessageListClose = (e) => {
  //         e.preventDefault();
  //         setConvoOpened(false);
  //     }

  //     useEffect(() => {
  //         if (signalRConnection) {
  //             signalRConnection.on("ReceiveDirectMessage", function (user, inMsg) {
  //                 // console.log("New message:");
  //                 // console.log(`${user}: ${inMsg}`)
  //                 setMessages([...messages, {
  //                     position: 'left',
  //                     type: 'text',
  //                     text: `${user}: ${inMsg}`,
  //                     date: new Date(),
  //                 }])
  //             });
  //         }
  //     }, [messages]);

  //     return (
  //         <div className="flex w-full">
  //             <div
  //                 className="fixed bottom-4 left-4">
  //                 {user && signalRConnection && <button onClick={handleMessagingClicked}>
  //                     {chatListOpened ? "Close messaging" : "Open Messaging"}
  //                 </button>}

  //                 {chatListOpened && <div>

  //                     <StyledChatList
  //                         className='outline outline-2 outline-green-500 p-2 bg-[#4ba173]'
  //                         onClick={handleChatListClick}
  //                         dataSource={[ // TODO: hardcoded for now, query backend for users then fill in
  //                             // the json array items with user data - will jan 28
  //                             {
  //                                 avatar: 'https://github.com/github.png',
  //                                 alt: 'Reactjs',
  //                                 title: 'Alexander Lex',
  //                                 subtitle: '',
  //                                 date: null,
  //                                 unread: 0,
  //                             },
  //                             {
  //                                 avatar: 'https://github.com/github.png',
  //                                 alt: 'Reactjs',
  //                                 title: 'Justin Ellis',
  //                                 subtitle: '',
  //                                 date: null,
  //                                 unread: 0,
  //                             },
  //                             {
  //                                 avatar: 'https://github.com/github.png',
  //                                 alt: 'Reactjs',
  //                                 title: 'Alysha Chan',
  //                                 subtitle: "",
  //                                 date: null,
  //                                 unread: 0,
  //                             },

  //                         ]}
  //                     />

  //                 </div>}

  //             </div>
  //             {convoOpened && chatListOpened && <div className="fixed w-128 flex-none bottom-4 right-4 outline outline-2 outline-green-500 p-2 bg-[#4ba173] max-h-[500px] items-center">
  //                 {/* <h2 className="text-lg font-bold">User placeholder</h2> */}
  //                 {/* <div className="w-16 right-10 bg-red-400"> X </div>
  //              */}
  //                 <Button
  //                     className="ml-auto mt-[-3px] w-7 h-7"
  //                     text={'X'}
  //                     backgroundColor="#f55b5b"
  //                     onClick={handleMessageListClose} />

  //                 <div className="w-80 flex-none bg-white">

  //                     <MessageList
  //                         referance={messageListReference}
  //                         className='outline outline-2 outline-green-500 items-end h-[500px] max-h-[300px] overflow-y-scroll '
  //                         // lockable={true}
  //                         // toBottomHeight={'100%'}
  //                         dataSource={messages}
  //                     />

  //                     <StyledInput
  //                         className=""
  //                         referance={inputReference}
  //                         clear={inputClear}
  //                         placeholder='Type here...'
  //                         multiline={true}
  //                         autoHeight={false}
  //                         minHeight={2}
  //                         maxHeight={10}
  //                         style="h-20"
  //                         rightButtons={
  //                             <Button
  //                                 onClick={handleMessageSubmit}
  //                                 color='white'
  //                                 backgroundColor='#4ba173'
  //                                 text='Send' />
  //                         }
  //                     />
  //                 </div>
  //             </div>}

  //         </div>

  //     );
}

export default Messaging;
