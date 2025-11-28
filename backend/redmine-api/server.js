// backend/redmine-api/server.js
import 'dotenv/config';
import express from "express";
import cors from "cors";
import { fetchIssuesUpdatedTodayByUser } from "./src/fetchUpdatedToday.js";

const app = express();
app.use(cors()); // Vueの開発サーバからアクセスできるようにする

app.get("/api/issues", async (req, res) => {
  try {
    const userId = Number(req.query.user_id);
    const issues = await fetchIssuesUpdatedTodayByUser(userId, undefined);
    res.json(issues);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log("API server running at http://localhost:3000");
});
