import { Request, Response } from "express";
import { dashboardCache, rawWeatherCache } from "../services/cacheService";
import { getDashboardCacheKey } from "../services/dashboardService";

export const getCacheStatusHandler = (req: Request, res: Response) => {
  res.status(200).json({
    dashboard: {
      key: getDashboardCacheKey(),
      status: dashboardCache.getStatus(getDashboardCacheKey()),
      stats: dashboardCache.getStats(),
    },
    rawWeather: {
      stats: rawWeatherCache.getStats(),
    },
  });
};

export const flushCacheHandler = (req: Request, res: Response) => {
  dashboardCache.flush();
  rawWeatherCache.flush();
  res.status(200).json({ message: "Caches flushed" });
};
