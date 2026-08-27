import fs from "fs";
import path from "path";
import { CitiesFileSchema, CityEntry } from "../types/type";

// Loads and validates the city list
export function loadCities(): CityEntry[] {
  const filePath = path.resolve(__dirname, "../../data/cities.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  const parsed = CitiesFileSchema.parse(JSON.parse(raw));
  return parsed.List;
}
