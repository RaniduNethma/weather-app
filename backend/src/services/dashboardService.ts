import { loadCities } from "../configs/cityConfig";
import { CityComfortResult, DashboardResponse } from "../types/type";
import { dashboardCache } from "./cacheService";
import { computeComfortIndex } from "./comfortIndexService";
import { getWeatherForCities } from "./weatherService";

const DASHBOARD_CACHE_KEY = "dashboard:processed";

const buildDashBoard = async (): Promise<DashboardResponse> => {
  const cities = loadCities();
  const { success, failures } = await getWeatherForCities(cities);

  if (failures.length > 0) {
    console.warn(
      `Weather fetch failed for ${failures.length} city(ies):`,
      failures.map((f) => `${f.city.CityName} (${f.reason})`).join(", "),
    );
  }

  // get scores for unranked cities
  const unranked: Omit<CityComfortResult, "rank">[] = success.map(
    ({ city, data }) => {
      const { score, parameters } = computeComfortIndex({
        temperature: data.main.temp,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
      });

      return {
        cityCode: city.CityCode,
        cityName: data.name || city.CityName,
        temperature: Number(data.main.temp.toFixed(1)),
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        comfortIndex: score,
        parameters,
        observedAt: new Date(data.dt * 1000).toISOString(),
      };
    },
  );

  // most comfortable & least comfortable
  const ranked: CityComfortResult[] = unranked
    .sort((a, b) => b.comfortIndex - a.comfortIndex)
    .map((city, index) => ({ ...city, rank: index + 1 }));

  return {
    generatedAt: new Date().toISOString(),
    cityCount: ranked.length,
    cities: ranked,
  };
};

export const getDashboard = async (): Promise<{
  data: DashboardResponse;
  cacheStatus: "HIT" | "MISS";
}> => {
  const cache = dashboardCache.get<DashboardResponse>(DASHBOARD_CACHE_KEY);
  if (cache) {
    return { data: cache, cacheStatus: "HIT" };
  }

  const fresh = await buildDashBoard();
  dashboardCache.set(DASHBOARD_CACHE_KEY, fresh);
  return { data: fresh, cacheStatus: "MISS" };
};

export const getDashboardCacheKey = (): string => {
  return DASHBOARD_CACHE_KEY;
};
