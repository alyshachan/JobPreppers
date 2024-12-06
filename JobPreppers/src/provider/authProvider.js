import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

// Create context
const AuthContext = createContext();

// Create AuthProvider to manage authentication state
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/Users/auth", {
            credentials: "include", // include cookies
          });

        if (response.ok) {
            const data = await response.json();
            if (data) {
              const newUser = {
                userID: data.userID,
                username: data.username,
                first_name: data.first_name,
                last_name: data.last_name,
                email: data.email,
              };
              setUser(newUser);
            }
        }
      } catch (error) {
        setUser(null); // clear user data if the token is invalid or expired
      }
    };

    checkAuthStatus();
  }, []);

  const setAuthData = (newUser) => {
    setUser(newUser); // Set user data after successful login
  };


  const contextValue = useMemo(() => ({ user, setAuthData }), [user]);

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
