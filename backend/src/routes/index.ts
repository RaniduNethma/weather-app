import { Router } from "express";
import dashboardRoutes from "./dashboardRoute";
import debugRoutes from "./debugRoute";
import authRoutes from "./authRoute";

const router = Router();

router.use("/api", dashboardRoutes);
router.use("/api", debugRoutes);
router.use("/api", authRoutes);

export default router;
