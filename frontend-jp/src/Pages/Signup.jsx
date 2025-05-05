import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../Components/Login/Login.module.css";

export default function Signup() {
  const [accountType, setAccountType] = useState("");
  const [page, setPage] = useState(1);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const apiURL = process.env.REACT_APP_JP_API_URL;
  const accountTypeDisabled = !accountType;
  const signupDisabled =
    !firstName ||
    (accountType == "user" && !lastName) ||
    !username ||
    !email ||
    !password;

  const handleNext = () => {
    if (!accountType) {
      setError("Please select an account type");
      return;
    }
    setError("");
    setPage(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {
      const url = accountType == "user" ? "User" : "Company";
      const response = await fetch(apiURL + `/api/Users/Signup/${url}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          username,
          email,
          password,
        }),
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
        {page == 1 ? (
          <>
            <h1 className={styles.heading}>Choose Account Type</h1>
            <div className="w-full flex justify-evenly mb-8">
              <button
                className={
                  accountType == "user"
                    ? `${styles.activeButton}`
                    : `${styles.lightButton}`
                }
                onClick={() => setAccountType("user")}
              >
                <h2>User</h2>
              </button>

              <button
                className={
                  accountType == "company"
                    ? `${styles.activeButton}`
                    : `${styles.lightButton}`
                }
                onClick={() => setAccountType("company")}
              >
                <h2>Company</h2>
              </button>
            </div>
            {error && <p className={styles.errorMessage}>{error}</p>}
            <button
              onClick={handleNext}
              className={styles.submitButton}
              disabled={accountTypeDisabled}
            >
              Next
            </button>
          </>
        ) : (
          <>
            <h1 className={styles.heading}>Create New Account</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className={styles.inputGroup}>
                <label htmlFor="firstName" className={styles.label}>
                  {accountType == "user" ? "First Name" : "Company Name"}
                </label>
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

              {accountType == "user" && (
                <div className={styles.inputGroup}>
                  <label htmlFor="lastName" className={styles.label}>
                    Last Name
                  </label>
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
              )}

              <div className={styles.inputGroup}>
                <label htmlFor="username" className={styles.label}>
                  Username
                </label>
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
                <label htmlFor="email" className={styles.label}>
                  Email address
                </label>
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
                <label htmlFor="password" className={styles.label}>
                  Password
                </label>
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
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={signupDisabled}
                >
                  Create New Account
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
