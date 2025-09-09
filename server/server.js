import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import 'dotenv/config';

const app = express();

app.use(cors());

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

app.get("/access-token", async (req, res) => {
  try {
    const resp = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        refresh_token: REFRESH_TOKEN,
        grant_type: "refresh_token",
      }),
    });

    const data = await resp.json();
    res.json(data); // { access_token, expires_in, token_type, scope }
    console.log("Sent access token")
    console.log(data)
  } catch (e) {
    console.error(e);
    res.status(500).send("Failed to get access token");
    console.log("Failed to get access token")
  }
});

app.listen(4000, () => console.log("Server running on http://localhost:4000"));
