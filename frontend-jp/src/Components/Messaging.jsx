import "../App.css"
import React, { useState, useEffect } from "react";
import { useAuth } from "../provider/authProvider";
import * as signalR from '@microsoft/signalr';
import 'react-chat-elements/dist/main.css';
import defaultProfilePicture from "../Components/defaultProfilePicture.png"
import { MessageList, SystemMessage, ChatList, Input, Button } from 'react-chat-elements';


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
        if (inputReference.current.value) {
            inputReference.current.value = "";
        }
    };

    const handleMessagingClicked = (e) => {
        e.preventDefault();
        setChatListOpened(!chatListOpened);
    }

    const handleMessageSubmit = async (e) => {
        e.preventDefault();
        const outMsg = inputReference.current.value;
        console.log(`You inputted ${outMsg}`);

        try {

            console.log("Attempting a message");
            await signalRConnection.invoke("SendDirectMessage", user.username, parseInt(receiverID), outMsg).then(
                // () => console.log(`You sent this message: ${msg} \n to receiverID: ${receiverID}`)
                () => {
                    setMessages([...messages, {                        
                        position: 'right',
                        type: 'text',
                        text: outMsg,
                        date: new Date(),
                        
                }])
                console.log(`Messages updated from outgoing:`);
                console.log(messages);

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

    /* 
    CHAT SERVER CONNECTION
    */

    useEffect(() => {
        const connectToHub = async () => {

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

            connection.on("ReceiveDirectMessage", function (user, inMsg) {
                console.log("New message:");
                console.log(`${user}: ${inMsg}`)
                setMessages([...messages, {                        
                    position: 'left',
                    type: 'text',
                    text: inMsg,
                    date: new Date(),
                }])
                console.log(`Messages updated from receiving:`);
                console.log(messages);

            });


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
    }, [messages])

    return (
        <div className="flex w-full">
            <div
                className="fixed bottom-4 left-4">
                <button onClick={handleMessagingClicked}>
                    {chatListOpened ? "Close messaging" : "Open Messaging"}
                </button>

                {chatListOpened && <div>

                    <ChatList
                        className='chat-list'
                        onClick={handleChatListClick}
                        dataSource={[ // TODO: hardcoded for now, query backend for users then fill in
                            // the json array items with user data - will jan 28
                            {
                                alt: 'Reactjs',
                                title: 'Son Goku',
                                subtitle: '',
                                date: null,
                                unread: 0,
                            },
                            {
                                avatar: 'https://facebook.github.io/react/img/logo.svg',
                                alt: 'Reactjs',
                                title: 'Ma Junior',
                                subtitle: '',
                                date: null,
                                unread: 0,
                            },
                            {
                                avatar: 'https://facebook.github.io/react/img/logo.svg',
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
            {convoOpened && chatListOpened && <div className="fixed w-128 flex-none bottom-4 right-4 outline outline-2 outline-green-500 p-4 bg-green-400">
                <div className="w-80 flex-none bg-white">
                    
                    <MessageList
                        referance={messageListReference}
                        className='message-list'
                        lockable={true}
                        toBottomHeight={'100%'}
                        dataSource={messages} 
                    />

                    <Input
                        className="input"
                        referance={inputReference}
                        clear={inputClear}
                        placeholder='Type here...'
                        multiline={true}
                        autoHeight={false}
                        minHeight={2}
                        maxHeight={10}
                        style="message-input"
                        rightButtons={
                            <Button 
                                onClick={handleMessageSubmit}
                                color='white'
                                backgroundColor='black' 
                                text='Send' />}
                    />
                </div>
            </div>}

        </div>

    );

}

export default Messaging;