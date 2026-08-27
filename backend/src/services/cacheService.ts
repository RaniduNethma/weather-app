import NodeCache from "node-cache";
import { env } from "../configs/envConfig";

class CacheService {
  // node-cache object
  private store: NodeCache;
  private hits = 0;
  private misses = 0;

  constructor(ttlSeconds: number) {
    this.store = new NodeCache({
      // standard time to live in seconds
      stdTTL: ttlSeconds,

      // time interval at which the cache automatically scans for and deletes expired keys
      checkperiod: Math.max(30, Math.floor(ttlSeconds / 4)),

      // reference is used directly without making a copy of the data
      useClones: false,
    });
  }

  // If there is no data in the cache, increase in misses. If there is data, increase in hits
  get<T>(key: string): T | undefined {
    const value = this.store.get<T>(key);
    if (value === undefined) {
      this.misses += 1;
      return undefined;
    }
    this.hits += 1;
    return value;
  }

  // new data is being cached

  set<T>(key: string, value: T, ttlSeconds?: number): void {
    if (ttlSeconds !== undefined) {
      this.store.set(key, value, ttlSeconds);
    } else {
      this.store.set(key, value);
    }
  }

  has(key: string): boolean {
    return this.store.has(key);
  }

  getStatus(key: string): "HIT" | "MISS" {
    return this.store.has(key) ? "HIT" : "MISS";
  }

  // Cached Keys, Hits, Misses, and Hit Rate return as an object
  getStats() {
    return {
      keys: this.store.keys(),
      hits: this.hits,
      misses: this.misses,
      hitRate:
        this.hits + this.misses === 0
          ? 0
          : Number((this.hits / (this.hits + this.misses)).toFixed(3)),
    };
  }

  flush(): void {
    this.store.flushAll;
    this.hits = 0;
    this.misses = 0;
  }
}

/**
 * separate cache instances
 * one for rawWeatherCache and the other for processed data that created and ranked using the comfort index
 */

export const rawWeatherCache = new CacheService(env.CACHE_TTL_SECONDS);
export const dashboardCache = new CacheService(env.CACHE_TTL_SECONDS);
