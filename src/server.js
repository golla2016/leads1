import express from "express";
import cors from "cors";
import { google } from "googleapis";
import serviceAccount from "./service-account.json" assert { type: "json" };

const app = express();
app.use(cors());
app.use(express.json());

const sheets = google.sheets({
  version: "v4",
  auth: new google.auth.GoogleAuth({
    credentials: serviceAccount,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  }),
});

const SHEET_ID = "121LKSyDrAQEHZH3xUxQ1ffN-Jc8SSUj7fZs7abNTwKM"; // e.g. 121LKSyDrAQEHZH3xUxQ1ffN-Jc8SSUj7fZs7abNTwKM

app.get("/api/agents", async (req, res) => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: "Agents!A:C", // Sheet tab + range
    });

    const values = response.data.values;
    if (!values || values.length === 0) return res.json([]);

    // Map sheet rows to objects
    const agents = values.slice(1).map((row) => ({
      id: row[0],
      first_name: row[1],
      surname: row[2],
    }));

    res.json(agents);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch agents from Google Sheet" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
