"use client";

import { developmentReference, landmarks, localOrigin, sources } from "@/data/world/registry";
import { sourceSummary } from "@/lib/landmark-validation";
import { developmentConfig } from "@/lib/development-config";
import type { WorldMode } from "@/game/world/world-mode";

export function WorldDataDiagnostics({ mode }: { mode: WorldMode }) {
  const registry = mode === "BHAKTAPUR" ? [...landmarks, ...(developmentConfig.worldReference ? [developmentReference] : [])] : [];
  return <pre data-world-diagnostics className="pointer-events-none absolute right-3 top-3 max-h-[50%] max-w-[70%] overflow-auto rounded bg-stone-100/90 p-3 text-[10px] text-stone-700">
    {`${mode}\n${localOrigin.description}\n1 unit = 1 metre; +Y up; rotations radians\n${landmarks.length} real landmark entries\n` + registry.map(l => `${l.id} | ${l.accuracy}${l.developmentOnly ? " | DEVELOPMENT ONLY" : ""}\nposition ${l.transform.position}; rotation ${l.transform.rotation}; scale ${l.transform.scale}\nbounds ${JSON.stringify(l.approximateDimensions)}; collision ${l.collision}\n${sourceSummary(l, sources)}`).join("\n")}
  </pre>;
}
