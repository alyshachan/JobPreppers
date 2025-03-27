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
        const response = await fetch("http://localhost:5000/api/Users/auth", {
          method: "GET",
          credentials: "include", // include cookies
          headers: {
            "Accept": "*/*", // Or any other headers you need
            "Accept-Encoding": "gzip, deflate",
            "Accept-Language": "en-US,en;q=0.9",
            "Connection": "keep-alive",
            "Host": "localhost:5000",
            "Origin": "http://localhost",
            "Referer": "http://localhost/",
            "Sec-GPC": "1",
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36"
          }
        });

        if (response.ok) {
          console.log("Auth OK");
          const data = await response.json();
          if (data) {
            const newUser = {
              userID: data.userID,
              username: data.username,
              first_name: data.first_name,
              last_name: data.last_name,
              email: data.email,
              profile_pic: data.profile_pic,
              title: data.title,
              location: data.location
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
