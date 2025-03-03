// import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
// import * as signalR from '@microsoft/signalr';
// import { useAuth } from "../provider/authProvider";

// // Create context
// const ConnectionContext = createContext();

// // Create AuthProvider to manage authentication state
// export const ConnectionProvider = ({ children }) => {
//     const { user, setAuthData } = useAuth();
//     const [signalRConnection, setConnection] = useState(null);

//     // useEffect(() => {
//     //     const connectToHub = async () => {
//     //         console.log("Attempting to connect to /DirectMessageHub");
//     //         const connection = new signalR.HubConnectionBuilder()
//     //             .withUrl("http://localhost:5070/directMessageHub", {
//     //                 accessTokenFactory: () => document.cookie.split('authToken=')[1] || '',
//     //             })
//     //             .withAutomaticReconnect()
//     //             .build();

//     //         // configure the connection
//     //         // connection.onclose((error) => {
//     //         //     console.error('Something went horribly wrong');
//     //         // });

//     //         try {
//     //             console.log("Attempting to start connection");
//     //             await connection.start()
//     //                 .then(() => {
//     //                     console.log('Connected to SignalR Hub');
//     //                     setConnection(connection); // store the connection in a state
//     //                 });

//     //         } catch (error) {
//     //             console.error('Connection failed or invoke error:', error);
//     //         }

//     //         return () => {
//     //             connection.stop();
//     //         };
//     //     };
//     //     connectToHub();
//     // }, [])

//     const connectToHub = async () => {
//         console.log("Attempting to connect to /DirectMessageHub");
//         if (!signalRConnection) {
//             const connection = new signalR.HubConnectionBuilder()
//                 .withUrl("http://localhost:5690/directMessageHub", {
//                     accessTokenFactory: () => document.cookie.split('authToken=')[1] || '',
//                 })
//                 .withAutomaticReconnect()
//                 .build();

//             //configure the connection
//             connection.onclose((error) => {
//                 console.error('Something went horribly wrong');
//             });

//             try {
//                 console.log("Attempting to start connection");
//                 await connection.start()
//                     .then(() => {
//                         console.log('Connected to SignalR Hub');
//                         setConnection(connection); // store the connection in a state
//                     });

//             } catch (error) {
//                 console.error('Connection failed or invoke error:', error);
//             }

//         }
//     };

//     const disconnectFromHub = async () => {
//         if (signalRConnection) {
//             await signalRConnection.stop();
//             setConnection(null);
//             console.log("Disconnected from SignalR");
//         }
//     }

//     const setSignalRConnection = (connection) => {
//         setConnection(connection);
//     };

//     const contextValue = useMemo(() => ({ signalRConnection, setSignalRConnection, connectToHub, disconnectFromHub }), [signalRConnection]);

//     return <ConnectionContext.Provider value={contextValue}>{children}</ConnectionContext.Provider>;
// };

// export const useConnection = () => useContext(ConnectionContext);
