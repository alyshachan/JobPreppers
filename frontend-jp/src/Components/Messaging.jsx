import "../App.css"
import React, { useState, useEffect } from "react";
import { useAuth } from "../provider/authProvider";
import * as signalR from '@microsoft/signalr';
import 'react-chat-elements/dist/main.css';
import defaultProfilePicture from "../Components/defaultProfilePicture.png"
import { MessageList, SystemMessage, ChatList, Input, Button } from 'react-chat-elements';
import { styled } from "@mui/material/styles";

/* Style overrides */
const StyledInput = styled(Input)(({ theme }) => ({
    "& .input": {
        marginbottom: "-20px !important"
    },
  }));

const StyledChatList = styled(ChatList)(({ theme }) => ({
"& .rce-citem": {
    minHeight: "100px !important",
    alignItems: "start"
},
"& .rce-citem-body": {
    // justifyContent: "start"
    alignSelf: "center"
}
}));


function Messaging() {
    const { user, setAuthData } = useAuth();
    /* div render booleans */
    const [chatListOpened, setChatListOpened] = useState(false);
    const [convoOpened, setConvoOpened] = useState(false);
    /* messaging react states */
    const [messages, setMessages] = useState([]);
    const [receiverID, setReceiverID] = useState("");
    const [signalRConnection, setSignalRConnection] = useState(null);
    /* system message states */
    const [showSystemMessage, setShowSystemMessage] = useState(false);
    const [currentSystemMessage, setSystemMessage] = useState("");

    const messageListReference = React.createRef();
    const inputReference = React.createRef();

    /*
    HANDLERS
    */

    const inputClear = () => {
        if (inputReference.current != null) {
            inputReference.current.value = "";
        }
    }

    const handleMessagingClicked = (e) => {
        e.preventDefault();
        setChatListOpened(!chatListOpened);
    }

    const handleMessageSubmit = async (e) => {
        e.preventDefault();

        if (!inputReference.current) {
            console.warn("Input ref is null, something went wrong!");
            return;
        }

        const outMsg = inputReference.current.value;
        if (!outMsg.trim()) return;
        console.log(`You inputted ${outMsg}`);

        try {

            console.log("Attempting a message");
            await signalRConnection.invoke("SendDirectMessage", user.username, parseInt(receiverID), outMsg).then(
                // () => console.log(`You sent this message: ${msg} \n to receiverID: ${receiverID}`)
                () => {
                    setMessages(messages => [...messages, {                        
                        position: 'right',
                        type: 'text',
                        text: outMsg,
                        date: new Date(),
                        
                }])
        
            }
            );
        } catch (error) {
            console.error('Connection failed or invoke error:', error);
        }
        inputClear();
    }

    const handleChatListClick = (chatListItem) => {
        setMessages([]);
        console.log(chatListItem.title);
        setConvoOpened(!convoOpened);

        // TODO: VERY stupid hard coded crap
        // change this to retrieve userID's some other way - will jan 28

        if (chatListItem.title == "Son Goku") {
            console.log("Now conversing with userID 1")
            setReceiverID(1);
        }
        else if (chatListItem.title == "Ma Junior") {
            console.log("Now conversing with userID 2")
            setReceiverID(2);
        }
        else if (chatListItem.title == "Alysha Chan") {
            console.log("Now conversing with userID 5")
            setReceiverID(5);
        }

    }

    const handleMessageListClose = (e) => {
        e.preventDefault();
        setConvoOpened(false);
    }
    
    /* 
    CHAT SERVER CONNECTION
    */

    useEffect(() => {
        const connectToHub = async () => {
            console.log("why does this code run?");
            console.log("Attempting to connect to /DirectMessageHub");
            const connection = new signalR.HubConnectionBuilder()
                .withUrl("http://localhost:5070/directMessageHub", {
                    accessTokenFactory: () => document.cookie.split('authToken=')[1] || '',
                })
                .withAutomaticReconnect()
                .build();

            // configure the connection
            connection.onclose((error) => {
                console.error('Connection closed:', error);
            });

            // connection.on("ReceiveDirectMessage", function (user, inMsg) {
            //     console.log("New message:");
            //     console.log(`${user}: ${inMsg}`)
            //     setMessages([...messages, {                        
            //         position: 'left',
            //         type: 'text',
            //         text: inMsg,
            //         date: new Date(),
            //     }])
            //     console.log(`Messages updated from receiving:`);
            //     console.log(messages);

            // });

            try {
                console.log("Attempting to start connection");
                await connection.start()
                    .then(() => {
                        console.log('Connected to SignalR Hub');
                        setSignalRConnection(connection); // store the connection in a state
                    });

            } catch (error) {
                console.error('Connection failed or invoke error:', error);
            }

            return () => {
                connection.stop();
            };
        };
        connectToHub();
    }, [])

    useEffect(() => {
        if (signalRConnection) {
            signalRConnection.on("ReceiveDirectMessage", function (user, inMsg) {
                // console.log("New message:");
                // console.log(`${user}: ${inMsg}`)
                setMessages([...messages, {                        
                    position: 'left',
                    type: 'text',
                    text: `${user}: ${inMsg}`,
                    date: new Date(),
                }])
            });
        }
    }, [messages]);

    return (
        <div className="flex w-full">
            <div
                className="fixed bottom-4 left-4">
                <button onClick={handleMessagingClicked}>
                    {chatListOpened ? "Close messaging" : "Open Messaging"}
                </button>

                {chatListOpened && <div>

                    <StyledChatList
                        className='outline outline-2 outline-green-500 p-2 bg-[#4ba173]'
                        onClick={handleChatListClick}
                        dataSource={[ // TODO: hardcoded for now, query backend for users then fill in
                            // the json array items with user data - will jan 28
                            {
                                avatar: 'https://github.com/github.png',
                                alt: 'Reactjs',
                                title: 'Son Goku',
                                subtitle: '',
                                date: null,
                                unread: 0,
                            },
                            {
                                avatar: 'https://github.com/github.png',
                                alt: 'Reactjs',
                                title: 'Ma Junior',
                                subtitle: '',
                                date: null,
                                unread: 0,
                            },
                            {
                                avatar: 'https://github.com/github.png',
                                alt: 'Reactjs',
                                title: 'Alysha Chan',
                                subtitle: "",
                                date: null,
                                unread: 0,
                            },

                        ]}
                    />

                </div>}



            </div>
            {convoOpened && chatListOpened && <div className="fixed w-128 flex-none bottom-4 right-4 outline outline-2 outline-green-500 p-2 bg-[#4ba173] max-h-[500px] items-center">
            {/* <h2 className="text-lg font-bold">User placeholder</h2> */}
            {/* <div className="w-16 right-10 bg-red-400"> X </div>
             */}
             <Button 
                className="ml-auto mt-[-3px] w-7 h-7"
                text={'X'}
                backgroundColor="#f55b5b"
                onClick={handleMessageListClose}/>



                <div className="w-80 flex-none bg-white">
                    
                    <MessageList
                        referance={messageListReference}
                        className='outline outline-2 outline-green-500 items-end h-[500px] max-h-[300px] overflow-y-scroll '
                        // lockable={true}
                        // toBottomHeight={'100%'}
                        dataSource={messages} 
                    />

                    <StyledInput
                        className=""
                        referance={inputReference}
                        clear={inputClear}
                        placeholder='Type here...'
                        multiline={true}
                        autoHeight={false}
                        minHeight={2}
                        maxHeight={10}
                        style="h-20"
                        rightButtons={
                            <Button 
                                onClick={handleMessageSubmit}
                                color='white'
                                backgroundColor='#4ba173' 
                                text='Send' />
                            }
                    />
                </div>
            </div>}

        </div>

    );

}

export default Messaging;