import { env } from "../configs/envConfig";
import {
  CityEntry,
  OpenWeatherResponse,
  OpenWeatherResponseSchema,
} from "../types/type";
import { AppError } from "../utils/appError";
import { rawWeatherCache } from "./cacheService";

const RAW_CACHE_PREFIX = "raw-weather:";

const cacheKey = (cityCode: string): string => {
  return `${RAW_CACHE_PREFIX}${cityCode}`;
};

// fetches current weather for a single city from open weather map
const fetchFromProvider = async (
  cityCode: string,
): Promise<OpenWeatherResponse> => {
  const url = `${env.OPENWEATHER_BASE_URL}/weather?id=${encodeURIComponent(cityCode)}&appid=${env.OPENWEATHER_API_KEY}&units=metric`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new AppError(
      `OpenWeatherMap request failed for city ${cityCode} (status ${response.status})`,
      response.status === 404 ? 404 : 502,
    );
  }

  const json = await response.json();
  const parsed = OpenWeatherResponseSchema.safeParse(json);

  if (!parsed.success) {
    throw new AppError(
      `Unexpected OpenWeatherMap response shape for city ${cityCode}`,
      502,
    );
  }

  return parsed.data;
};

// serving a cached copy when available. cache hit/miss
export const getWeatherForCity = async (
  city: CityEntry,
): Promise<{ data: OpenWeatherResponse; cacheStatus: "HIT" | "MISS" }> => {
  const key = cacheKey(city.CityCode);
  const cached = rawWeatherCache.get<OpenWeatherResponse>(key);

  if (cached) {
    return { data: cached, cacheStatus: "HIT" };
  }

  const fresh = await fetchFromProvider(city.CityCode);
  rawWeatherCache.set(key, fresh);
  return { data: fresh, cacheStatus: "MISS" };
};

// fetches weather for every city
export const getWeatherForCities = async (cities: CityEntry[]) => {
  // tolerating individual failures
  const settled = await Promise.allSettled(
    cities.map((city) => getWeatherForCity(city).then((r) => ({ city, ...r }))),
  );

  const success: {
    city: CityEntry;
    data: OpenWeatherResponse;
    cacheStatus: "HIT" | "MISS";
  }[] = [];

  // failed cities are reported separately
  const failures: { city: CityEntry; reason: string }[] = [];

  settled.forEach((result, index) => {
    if (result.status == "fulfilled") {
      success.push(result.value);
    } else {
      failures.push({
        city: cities[index],
        reason:
          result.reason instanceof Error
            ? result.reason.message
            : "Unknown error",
      });
    }
  });

  return { success, failures };
};
