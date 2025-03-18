import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from '../Components/Login/Login.module.css';

export default function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {
      const response = await fetch("https://jobpreppers.co:5000/api/Users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, username, email, password}),
      });

      if (response.ok) {
        const data = await response.json();
        navigate("/login");
        window.alert(data.message); // Displays "Login successful."
        setError(""); // Clear any previous error message
      } else {
        const errorData = await response.json();
        setError(errorData.message); // Show error message from the backend
      }
    } catch (err) {
      setError("An error occurred. Please try again."); // Catch and display any request error
    }
  };

  return (
    <div className={styles.loginContainer}>
    <div className={styles.loginFormContainer}>
      <h1 className={styles.heading}>Create New Account</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className={styles.inputGroup}>
          <label htmlFor="firstName" className={styles.label}>First Name</label>
          <input
            className={styles.inputField}
            id="firstName"
            name="firstName"
            type="text"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="lastName" className={styles.label}>Last Name</label>
          <input
            className={styles.inputField}
            id="lastName"
            name="lastName"
            type="text"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="username" className={styles.label}>Username</label>
          <input
            className={styles.inputField}
            id="username"
            name="username"
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="email" className={styles.label}>Email address</label>
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

        <div className={styles.inputGroup}>
          <label htmlFor="password" className={styles.label}>Password</label>
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

        {error && <p className={styles.errorMessage}>{error}</p>}

        <div>
          <button type="submit" className={styles.submitButton}>Create New Account</button>
        </div>
      </form>
    </div>
  </div>
  
  );
}
