import express, { Application } from "express";
import routes from "./routes";

export function createApp(): Application {
  const app = express();

  app.use(express.json());
  app.use("/", routes);

  return app;
}
