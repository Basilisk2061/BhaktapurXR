"use client";

import Link from "next/link";
import { useState } from "react";
import { localMapSource, mapCalibrations } from "@/data/world/map-measurements";
import { spatialFeatures } from "@/data/world/spatial-registry";
import { localPointToMap } from "@/lib/map-calibration";
import type { SpatialFeature } from "@/types/spatial";

function projectedPath(f: SpatialFeature): string {
  const calibration = mapCalibrations.find(c => c.id === f.calibrationId)!;
  return [f.vertices, ...(f.holes ?? [])].map(ring => ring.map((p, i) => `${i ? "L" : "M"}${localPointToMap(p, calibration).join(",")}`).join(" ") + " Z").join(" ");
}
const projected = spatialFeatures.map(feature => ({ feature, path: projectedPath(feature) }));

/** Event-driven 2D review, projecting actual runtime metre geometry back to source pixels. */
export function TraceReview() {
  const [opacity, setOpacity] = useState(0.8);
  const [outlines, setOutlines] = useState(true);
  const [focus, setFocus] = useState(true);
  return <main className="min-h-svh bg-stone-100 p-4 text-stone-800">
    <header className="flex flex-wrap items-center gap-5 pb-4 text-sm">
      <Link href="/explore?world=bhaktapur">Back to Bhaktapur</Link>
      <h1 className="font-semibold">Development trace review · APPROXIMATE · Human approval pending</h1>
      <label>Source opacity <input aria-label="Source opacity" type="range" min="0" max="1" step="0.05" value={opacity} onChange={e => setOpacity(Number(e.target.value))} /></label>
      <label><input type="checkbox" checked={outlines} onChange={e => setOutlines(e.target.checked)} /> Runtime outlines</label>
      <label><input type="checkbox" checked={focus} onChange={e => setFocus(e.target.checked)} /> Principal square detail</label>
    </header>
    <p className="mb-3 text-xs">Runtime local-metre geometry projected back into full source pixels. Brown core (main sector only), blue buffer, green open space, dark monument footprints, gray ordinary buildings. No heights or named identities inferred.</p>
    <svg data-trace-review viewBox={focus ? "740 1090 750 650" : `0 0 ${localMapSource.width} ${localMapSource.height}`} className="h-[78svh] w-full border border-stone-300 bg-white" aria-label="UNESCO raster and projected runtime traces">
      <image href="/api/dev/reference-map" width={localMapSource.width} height={localMapSource.height} opacity={opacity} />
      {outlines && projected.map(({ feature: f, path }) => <path key={f.id} data-feature-id={f.id} d={path} fill="none" fillRule="evenodd" stroke={f.kind === "core-boundary" ? "#af6234" : f.kind === "buffer-boundary" ? "#3379a0" : f.kind === "open-square" ? "#438463" : f.footprintClass === "monument" ? "#a24352" : "#5f6687"} strokeWidth={focus ? 1.5 : 3}>
        <title>{`${f.id} · ${f.footprintClass ?? f.kind} · ${f.accuracy}\n${f.uncertaintyNote}`}</title>
      </path>)}
      <circle cx={mapCalibrations[0].origin[0]} cy={mapCalibrations[0].origin[1]} r="4" fill="#267d61"><title>Engineering origin; geographic tie unresolved</title></circle>
    </svg>
  </main>;
}
