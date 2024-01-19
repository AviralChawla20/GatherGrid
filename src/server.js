const express = require("express");
const { StreamChat } = require("stream-chat");
const cors = require("cors"); // Import the cors middleware

const app = express();
const port = 1111;

const apiKey = "3n2ymybyf2f4";
const apiSecret =
  "56c8kr3z3cvm2u3jsgvnnvu94rj9hej6w3ue3jmpw49fra5w3nrq8zn8vdpgqqy9";

const serverClient = StreamChat.getInstance(apiKey, apiSecret);

// Use the cors middleware
app.use(cors());
app.use(express.json());

app.post("/generate-token", async (req, res) => {
  const { userId: userId } = req.body;

  try {
    const token = await serverClient.createToken(userId.toString());
    res.status(200).json({ token });
  } catch (error) {
    console.error("Error generating token:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// import React, { useEffect, useState } from "react";

// import { StreamChat } from "stream-chat";

// const api_key = "3n2ymybyf2f4";
// const api_secret =
//   "56c8kr3z3cvm2u3jsgvnnvu94rj9hej6w3ue3jmpw49fra5w3nrq8zn8vdpgqqy9";
// const uid = 1;

// const serverClient = StreamChat.getInstance(api_key, api_secret);
// // Create User Token
// const token = serverClient.createToken(user_id);
