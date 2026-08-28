import { Router } from "express";
import dashboardRoutes from "./dashboardRoute";
import debugRoutes from "./debugRoute";

const router = Router();

router.use("/api", dashboardRoutes);
router.use("/api", debugRoutes);

export default router;
