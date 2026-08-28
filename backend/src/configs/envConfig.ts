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
  OPENWEATHER_API_KEY: getEnvVariable("OPENWEATHER_API_KEY"),
  OPENWEATHER_BASE_URL: getEnvVariable("OPENWEATHER_BASE_URL"),
  CACHE_TTL_SECONDS: Number("CACHE_TTL_SECONDS"),
  CORS_ORIGIN: getEnvVariable("CORS_ORIGIN"),
  AUTH0_ISSUER_BASE_URL: getEnvVariable("AUTH0_ISSUER_BASE_URL"),
  AUTH0_AUDIENCE: getEnvVariable("AUTH0_AUDIENCE"),
  AUTH0_ALLOWED_EMAILS: getEnvVariable("AUTH0_ALLOWED_EMAILS"),
};
