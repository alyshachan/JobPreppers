import "../App.css"
import React, { useState, useEffect } from "react";
import { useAuth } from "../provider/authProvider";
import * as signalR from '@microsoft/signalr';
import 'react-chat-elements/dist/main.css';
import defaultProfilePicture from "../Components/defaultProfilePicture.png"
import { MessageList } from 'react-chat-elements';
import { ChatList } from 'react-chat-elements';
import { Input } from 'react-chat-elements';
import { Button } from 'react-chat-elements';

function Messaging() {
    const { user, setAuthData } = useAuth();
    const [chatListOpened, setChatListOpened] = useState(false);
    const [convoOpened, setConvoOpened] = useState(false);
    const [message, setMessage] = useState("");
    const [receiverID, setReceiverID] = useState("");
    const [signalRConnection, setSignalRConnection] = useState(null);

    const messageListReference = React.createRef();
    const inputReference = React.createRef();

    const inputClear = () => {
        inputReference.current.value = "";
    };

    const handleMessagingClicked = (e) => {
        e.preventDefault();
        setChatListOpened(!chatListOpened);
    }

    const handleMessageSubmit = async (e) => {
        e.preventDefault();
        const msg = inputReference.current.value;
        console.log(`You inputted ${msg}`);

        try {

            console.log("Attempting a message");
            await signalRConnection.invoke("SendDirectMessage", user.username, parseInt(receiverID), msg).then(
                () => console.log(`You sent this message: ${msg} \n to receiverID: ${receiverID}`)
            );
        } catch (error) {
            console.error('Connection failed or invoke error:', error);
        }

        inputClear();
    }

    const handleReceiverIDSubmit = async (e) => {
        e.preventDefault();
        console.log(`You are now sending messages to receiverID: ${receiverID}`);
        setMessage("");
    }

    const handleChatListClick = (chatListItem) => {
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

            connection.on("ReceiveDirectMessage", function (user, message) {
                console.log("New message:");
                console.log(`${user}: ${message}`)
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
    }, [])


    return (
        <div className="flex w-full">
            <div
                className="fixed bottom-4 left-4">
                <button onClick={handleMessagingClicked}>
                    {chatListOpened ? "Close messaging" : "Open Messaging"}
                </button>

                {chatListOpened && <div>
                    {/* <form id="userIDMessageForm" onSubmit={handleReceiverIDSubmit}>
                    <input
                        type="number"
                        id="receiverID"
                        placeholder="Input the receiverID"
                        value={receiverID}
                        onChange={(e) => setReceiverID(e.target.value)}>
                    </input>
                </form>

                <form id="messageBoxForm" onSubmit={handleMessageSubmit}>
                    <input
                        type="text"
                        id="message"
                        placeholder="Send a message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}>
                    </input>
                </form> */}

                    <ChatList
                        className='chat-list'
                        onClick={handleChatListClick}
                        dataSource={[ // TODO: hardcoded for now, query backend for users then fill in
                            // the json array items with user data - will jan 28
                            {
                                alt: 'Reactjs',
                                title: 'Son Goku',
                                subtitle: 'What are you doing?',
                                date: new Date(),
                                unread: 0,
                            },
                            {
                                avatar: 'https://facebook.github.io/react/img/logo.svg',
                                alt: 'Reactjs',
                                title: 'Ma Junior',
                                subtitle: 'I am 30m from your current location',
                                date: new Date(),
                                unread: 0,
                            },
                            {
                                avatar: 'https://facebook.github.io/react/img/logo.svg',
                                alt: 'Reactjs',
                                title: 'Alysha Chan',
                                subtitle: "lol",
                                date: new Date(),
                                unread: 0,
                            },

                        ]}
                    />

                </div>}



            </div>
            <div className="fixed bottom-4 right-4">
                {convoOpened && <div>

                    {/* <MessageList
                        referance={messageListReference}
                        className='message-list'
                        lockable={true}
                        toBottomHeight={'100%'}
                        dataSource={[
                            {
                                position: 'right',
                                type: 'text',
                                text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
                                date: new Date(),
                            },
                            
                        ]} /> */}

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
                </div>}
            </div>

        </div>

    );

}

export default Messaging;