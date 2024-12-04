import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

// Create context
const AuthContext = createContext();

// Create AuthProvider to manage authentication state
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if the token exists in the cookies (HTTP-only cookie managed by the browser)
    const checkAuthStatus = async () => {
      try {
        console.log("Attempting an auth request")
        const response = await fetch("http://localhost:5001/api/Users/me", {
            credentials: "include", // include cookies
          });

        if (response.ok) {
            const data = await response.json();
            console.log("Just performed an authentication check")
            console.log(data)
            if (data) {
                setUser(data);
                console.log("yipppe!!")
            }
        }
      } catch (error) {
        console.log("No signed in user detected. :(")
        setUser(null); // Clear user data if the token is invalid or expired
      }
    };

    checkAuthStatus();
  }, []);

  const setAuthData = (newUser) => {
    setUser(newUser); // Set user data after successful login
    console.log("New user set:")
    console.log(newUser)
  };


  const contextValue = useMemo(() => ({ user, setAuthData }), [user]);

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
