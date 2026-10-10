"use client";

import { developmentReference, landmarks, localOrigin, sources } from "@/data/world/registry";
import { sourceSummary } from "@/lib/landmark-validation";
import { developmentConfig } from "@/lib/development-config";
import type { WorldMode } from "@/game/world/world-mode";
import { mapCalibrations, mapFeatures } from "@/data/world/map-measurements";
import { spatialFeatures, spatialCalibrationState } from "@/data/world/spatial-registry";
import { bhaktapurComponent } from "@/data/world/sources";

export function WorldDataDiagnostics({ mode }: { mode: WorldMode }) {
  const registry = mode === "BHAKTAPUR" ? [...landmarks, ...(developmentConfig.worldReference ? [developmentReference] : [])] : [];
  return <pre data-world-diagnostics tabIndex={0} aria-label="Development world-data diagnostics" className="absolute left-3 top-36 max-h-[40%] max-w-[calc(100%-1.5rem)] overflow-auto whitespace-pre-wrap break-words rounded bg-stone-100/90 p-3 text-[10px] text-stone-700 sm:top-3 sm:max-w-[45%]">
    {`${mode}\n${localOrigin.description}\n1 unit = 1 metre; +Y up; +X east; -Z north (target convention)\n${landmarks.length} architectural landmarks\n` + (mode === "BHAKTAPUR" ? `${bhaktapurComponent.id}: VERIFIED published metadata only\n${sources.length} source references; ${spatialFeatures.length} measured spatial features\nCalibration: ${spatialCalibrationState}; ${mapCalibrations.length} measured calibrations\n200 m / 478 px = ${(200 / 478).toFixed(6)} m/px; north rotation 0 deg\nNorth aligned from printed N stem; geographic tie unresolved.\nGround/spawn: PLACEHOLDER / DEVELOPMENT ONLY\n${spatialFeatures.map(f => `${f.id} | ${f.footprintClass ?? f.kind} | ${f.accuracy}\n${f.sourceIds.join(", ")}\n${f.measurementMethod}; ${f.uncertaintyNote}\nHeight UNKNOWN; pixels ${JSON.stringify(mapFeatures.find(raw => raw.id === f.id)?.vertices)}\nLocal metres ${JSON.stringify(f.vertices)}; holes ${(f.holes ?? []).length}`).join("\n")}\n` : "") + registry.map(l => `${l.id} | ${l.accuracy}${l.developmentOnly ? " | DEVELOPMENT ONLY" : ""}\nposition ${l.transform.position}; rotation ${l.transform.rotation}; scale ${l.transform.scale}\nbounds ${JSON.stringify(l.approximateDimensions)}; collision ${l.collision}\n${sourceSummary(l, sources)}`).join("\n")}
  </pre>;
}
