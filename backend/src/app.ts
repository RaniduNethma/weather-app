import express, { Application } from "express";
import cors from "cors";
import routes from "./routes";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { env } from "./configs/envConfig";

export function createApp(): Application {
  const app = express();

  app.use(cors({ origin: env.CORS_ORIGIN }));
  app.use(express.json());
  app.use("/", routes);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
