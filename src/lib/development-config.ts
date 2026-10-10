const isDevelopment = process.env.NODE_ENV === "development";

export const developmentConfig = {
  performance: isDevelopment && process.env.NEXT_PUBLIC_DEBUG_PERFORMANCE === "true",
  physicsDebug: isDevelopment && process.env.NEXT_PUBLIC_DEBUG_PHYSICS === "true",
  worldDebug: isDevelopment && process.env.NEXT_PUBLIC_DEBUG_WORLD === "true",
  spawnMarker: isDevelopment && process.env.NEXT_PUBLIC_DEBUG_SPAWN === "true",
} as const;
