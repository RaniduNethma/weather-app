import { Router } from "express";
import {
  flushCacheHandler,
  getCacheStatusHandler,
} from "../controllers/debugController";

const router = Router();

// cache HIT/MISS + stats
router.get("/debug/cache", getCacheStatusHandler);

// clear all caches
router.post("debug/cache/flush", flushCacheHandler);

export default router;
