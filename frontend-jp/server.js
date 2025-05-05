// defining the server port
const port = 8000

// initializing installed dependencies
const express = require('express')
require('dotenv').config()
const axios = require('axios')
const app = express()
const cors = require('cors')
app.use(cors())

// listening for port 5000
app.listen(8000, ()=> console.log(`Server is running on ${port}` ))
app.get("/get-token", (req, res) => {
    // res.json({ message: "Hello World!" }); // Properly format as JSON
//   })
    const tokenRequest = {
        method: "POST",
        url: "https://auth.emsicloud.com/connect/token",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: new URLSearchParams({
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          grant_type: "client_credentials",
          scope: process.env.SCOPE,
        }) // Ensure the data is properly formatted
      };
      
        
        axios.request(tokenRequest).then(function (response) {
            console.log(response.data);
            res.json(response.data);
        }).catch(function (error) {
            console.error("Error fetching token:", error);
            res.status(500).json({ error: "Failed to fetch token" });
        });

    })