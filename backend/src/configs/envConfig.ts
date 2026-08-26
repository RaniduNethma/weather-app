import dotenv from "dotenv";
import { EnvConfig } from "../types/type";

dotenv.config();

function getEnvVariable(key: any, required = true): any {
  const value = process.env[key];
  if (!value && required) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value as string;
}

export const env: EnvConfig = {
  API_SERVER_PORT: Number("API_SERVER_PORT"),
  API_KEY: getEnvVariable("API_KEY"),
};
