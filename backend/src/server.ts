import express from "express";
import { env } from "./configs/envConfig";

const app = express();
const PORT = env.API_SERVER_PORT || 5000;

app.use(express.json);

const startServer = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`API running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error when starting API", error);
  }
};

startServer();
