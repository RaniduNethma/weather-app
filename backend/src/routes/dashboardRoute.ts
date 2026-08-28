import { Router } from "express";
import { getDashboardHandler } from "../controllers/dashboardController";

const router = Router();

// GET ranked comfort index for all cities
router.get("/dashboard", getDashboardHandler);

export default router;
