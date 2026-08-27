import z from "zod";

export interface EnvConfig {
  API_SERVER_PORT: number;
  OPENWEATHER_API_KEY: string;
  OPENWEATHER_BASE_URL: string;
  CACHE_TTL_SECONDS: number;
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
  weather: z
    .array(
      z.object({
        main: z.string(),
        description: z.string(),
        icon: z.string(),
      }),
    )
    .min(1),
  main: z.object({
    temp: z.number(),
    feels_like: z.number(),
    humidity: z.number(),
    pressure: z.number(),
  }),
  wind: z.object({
    speed: z.number(),
  }),
  clouds: z.object({
    all: z.number(),
  }),
  visibility: z.number().optional(),
  dt: z.number(),
});
export type OpenWeatherResponse = z.infer<typeof OpenWeatherResponseSchema>;

export interface ComfortIndexParameters {
  temperatureScore: number;
  humidityScore: number;
  windScore: number;
}
