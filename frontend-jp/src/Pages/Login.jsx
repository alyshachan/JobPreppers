import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../provider/authProvider";
import styles from "../Components/Login/Login.module.css";

const apiURL = process.env.REACT_APP_JP_API_URL;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user, setAuthData } = useAuth(); // custom hook for authprovider
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    // reach login endpoint
    try {
      const response = await fetch(apiURL + "/api/Users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include", // include cookies
      });

      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          console.log("setting auth data");

          setAuthData({
            userID: data.user.userID,
            username: data.user.username,
            first_name: data.user.first_name,
            last_name: data.user.last_name,
            email: data.user.email,
            profile_pic: data.user.profile_pic,
            title: data.user.title,
            location: data.user.location,
          });

          console.log("auth data set");
          // Show a success popup
          navigate("/profile");
          window.alert(data.message); // Displays "Login successful."
          setError(""); // Clear any previous error message
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message); // Show error message from the backend
      }
    } catch (err) {
      setError("An error occurred while logging in. Please try again."); // Catch and display any request error
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginFormContainer}>
        <h1 className={styles.heading}>Log In</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              Email address
            </label>
            <div className="mt-2">
              <input
                className={styles.inputField}
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <div className="mt-2">
              <input
                className={styles.inputField}
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
          </div>

          {error && <p className={styles.errorMessage}>{error}</p>}
          <div>
            <button type="submit" className={styles.submitButton}>
              Sign in
            </button>
          </div>
        </form>

        <div className={styles.orSeparator}>
          <hr />
          OR
          <hr />
        </div>
        <button
          type="button"
          className={styles.createAccountButton}
          onClick={() => navigate("/Signup")}
        >
          Create New Account
        </button>
      </div>
    </div>
  );
}
