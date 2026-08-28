import express, { Application } from "express";
import routes from "./routes";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

export function createApp(): Application {
  const app = express();

  app.use(express.json());
  app.use("/", routes);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
