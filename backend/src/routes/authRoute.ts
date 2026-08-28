import { Router } from "express";
import {
  checkJwt,
  requireAllowlistedEmail,
} from "../middleware/authMiddleware";
import { authHandler } from "../controllers/authController";

const router = Router();

router.get("/auth", checkJwt, requireAllowlistedEmail, authHandler);

export default router;
