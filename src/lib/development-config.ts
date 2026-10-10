const isDevelopment = process.env.NODE_ENV === "development";

export const developmentConfig = {
  spatialDebug: isDevelopment && process.env.NEXT_PUBLIC_DEBUG_SPATIAL === "true",
  worldData: isDevelopment && process.env.NEXT_PUBLIC_DEBUG_WORLD_DATA === "true",
  worldReference: isDevelopment && process.env.NEXT_PUBLIC_WORLD_REFERENCE === "true",
  performance: isDevelopment && process.env.NEXT_PUBLIC_DEBUG_PERFORMANCE === "true",
  physicsDebug: isDevelopment && process.env.NEXT_PUBLIC_DEBUG_PHYSICS === "true",
  worldDebug: isDevelopment && process.env.NEXT_PUBLIC_DEBUG_WORLD === "true",
  spawnMarker: isDevelopment && process.env.NEXT_PUBLIC_DEBUG_SPAWN === "true",
  playerDebug: isDevelopment && process.env.NEXT_PUBLIC_DEBUG_PLAYER === "true",
} as const;
