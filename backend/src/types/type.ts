import z from "zod";

export interface EnvConfig {
  API_SERVER_PORT: number;
  OPENWEATHER_API_KEY: string;
  OPENWEATHER_BASE_URL: string;
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
