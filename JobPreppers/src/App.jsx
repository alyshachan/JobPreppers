import logo from "./logo.svg";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "./App.css";
import React, { useState, useEffect } from 'react';

import NavBar from "./NavBar";
import { Route, Routes } from "react-router-dom";
import Jobs from "./Pages/Jobs";
import Profile from "./Pages/Profile";
import Resume from "./Pages/Resume"
import Interview from "./Pages/Interview";
import Login from "./Pages/Login";


function App() {
  const [data, setData] = useState([])
  useEffect(() =>{
    async function fetchData() {
    console.log("le vite url:")
    console.log(import.meta.env.VITE_API_URL)
    // try {
    //   const url = `${import.meta.env.VITE_API_URL}users`
    //   console.log("le url")
    //   console.log(url)
    //   const response = await fetch(url, {
    //     method: "GET",
    //   });

    //   if (!response.ok) {
    //     throw new Error('Network response failed');
    //   }
    //   const result = await response.json();
    //   console.log(result)
    //   setData(result)
    // }
    // catch (error){
    //   console.error("Error fetching data:", error)
    // }
    try {
      const url = `${import.meta.env.VITE_API_URL}users`
      const response = await fetch(url, {
        method: "GET", // Use GET to retrieve data
        // Do not manually add 'Origin', the browser will do it automatically
      });
    
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
    
      const data = await response.json();
      console.log("Fetched data:", data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }


  }
    fetchData();
  }, [])

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Profile/>}/>
        <Route path="/Login" element={<Login/>}/>
        <Route path="/Profile" element={<Profile/>}/>
        <Route path="/Jobs" element={<Jobs/>}/>
        <Route path="/Interview" element={<Interview/>}/>
        <Route path="/Resume" element={<Resume/>}/>
      </Routes>
    </>
  );

  // return <h1>Hello, Vite + React!</h1>;
}

export default App;
