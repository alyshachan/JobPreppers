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
        const response = await fetch("http://localhost:5001/api/users/me", {
            credentials: 'include', // include cookies
          });

        if (response.ok) {
            const data = await response.json();
            if (data.user) {
                setUser(data.user);
            }
        }
      } catch (error) {
        setUser(null); // Clear user data if the token is invalid or expired
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
