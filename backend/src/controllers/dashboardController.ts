import { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { getDashboard } from "../services/dashboardService";

export const getDashboardHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { data, cacheStatus } = await getDashboard();
    res.setHeader("cache-status", cacheStatus);
    res.status(200).json(data);
  },
);
