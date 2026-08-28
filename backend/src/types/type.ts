import z from "zod";

export interface EnvConfig {
  API_SERVER_PORT: number;
  OPENWEATHER_API_KEY: string;
  OPENWEATHER_BASE_URL: string;
  CACHE_TTL_SECONDS: number;
  CORS_ORIGIN: string;
  AUTH0_ISSUER_BASE_URL: string;
  AUTH0_AUDIENCE: string;
  AUTH0_ALLOWED_EMAILS: string;
}

export const CityEntrySchema = z.object({
  CityCode: z.string(),
  CityName: z.string(),
  Temp: z.string(),
  Status: z.string(),
});
export type CityEntry = z.infer<typeof CityEntrySchema>;

export const CitiesFileSchema = z.object({
  List: z.array(CityEntrySchema),
});

// OpenWeatherMap weather response
export const OpenWeatherResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  main: z.object({
    temp: z.number(),
    humidity: z.number(),
  }),
  wind: z.object({
    speed: z.number(),
  }),
  dt: z.number(),
});
export type OpenWeatherResponse = z.infer<typeof OpenWeatherResponseSchema>;

export interface ComfortIndexParameters {
  temperatureScore: number;
  humidityScore: number;
  windScore: number;
}

export interface CityComfortResult {
  cityCode: string;
  cityName: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  comfortIndex: number;
  parameters: ComfortIndexParameters;
  rank: number;
  observedAt: string;
}

export interface DashboardResponse {
  generatedAt: string;
  cityCount: number;
  cities: CityComfortResult[];
}
