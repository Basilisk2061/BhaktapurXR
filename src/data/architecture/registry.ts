import { spatialFeatures } from "../world/spatial-registry.ts";
import type { SpatialFeature, LocalPoint } from "../../types/spatial.ts";
import { architectureParameters as p, stableSeed } from "./config.ts";

export interface ArchitectureEntry {
  id: string; accuracy: "APPROXIMATE" | "PLACEHOLDER"; sourceIds: string[];
  footprint: SpatialFeature; style: "courtyard" | "building" | "pagoda" | "stone-shrine";
  floors: number; tiers: number; bodyHeight: number; interpretation: string;
}

export function footprintBounds(vertices: LocalPoint[]) {
  const xs = vertices.map(v => v[0]), zs = vertices.map(v => v[1]);
  const minX = Math.min(...xs), maxX = Math.max(...xs), minZ = Math.min(...zs), maxZ = Math.max(...zs);
  return { minX, maxX, minZ, maxZ, width: maxX - minX, depth: maxZ - minZ, x: (minX + maxX) / 2, z: (minZ + maxZ) / 2 };
}

export const sourceArchitecture: ArchitectureEntry[] = spatialFeatures.filter(f => f.kind === "building-footprint").map(f => {
  const monument = f.footprintClass === "monument", complex = !!f.holes?.length;
  const index = Number(f.id.slice(-3));
  const style = complex ? "courtyard" : monument ? (index === 4 || index === 8 ? "stone-shrine" : "pagoda") : "building";
  const floors = complex ? 3 : 2 + stableSeed(f.id) % 2;
  const tiers = monument && !complex ? (index === 9 ? 3 : index === 3 || style === "stone-shrine" ? 1 : 2) : 0;
  return { id: `architecture:${f.id}`, accuracy: "APPROXIMATE", sourceIds: [...f.sourceIds], footprint: f, style, floors, tiers,
    bodyHeight: style === "building" || complex ? floors * p.storeyHeight : p.tierSpacing,
    interpretation: "Source-derived placement; approximate procedural mass, roof, facade, plinth and entrance interpretation. Neutral identity; no verified architectural dimensions." };
});

// Deliberate enclosure, NOT map traces. Gaps remain at the east and south approaches.
const contextPositions = [
  [-68,-3,16,13],[-68,14,16,14],[-68,31,16,13],[-49,49,16,13],[-29,52,17,12],[-8,53,17,12],
  [15,57,17,12],[40,57,16,12],[58,37,14,16],[66,15,14,14],[62,-11,14,15],
  [-67,-30,16,14],[-43,-54,16,14],[-22,-54,16,14],[3,-54,17,12],[25,-51,16,12],
] as const;
export const contextArchitecture: ArchitectureEntry[] = contextPositions.map(([x,z,w,d],i) => {
  const id = `context-enclosure-${i+1}`;
  const footprint: SpatialFeature = { id, name:id, kind:"building-footprint", vertices:[[x-w/2,z-d/2],[x+w/2,z-d/2],[x+w/2,z+d/2],[x-w/2,z+d/2]],
    accuracy:"PLACEHOLDER", sourceIds:[], calibrationId:"", measurementMethod:"Development enclosure only; no mapped position claim", uncertaintyNote:"Not a historical building or footprint", heightMetres:null };
  const floors=2+stableSeed(id)%2;
  return { id, accuracy:"PLACEHOLDER" as const, sourceIds:[], footprint, style:"building" as const, floors, tiers:0, bodyHeight:floors*p.storeyHeight,
    interpretation:"Low-detail fictional context enclosure, isolated from UNESCO data; replace after further spatial research." };
}).filter(context => {
  const b = footprintBounds(context.footprint.vertices);
  return !sourceArchitecture.some(source => {
    const s = footprintBounds(source.footprint.vertices), clearance = 3;
    return b.minX < s.maxX + clearance && b.maxX > s.minX - clearance && b.minZ < s.maxZ + clearance && b.maxZ > s.minZ - clearance;
  });
});
