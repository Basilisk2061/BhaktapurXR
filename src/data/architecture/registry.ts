import { spatialFeatures } from "../world/spatial-registry.ts";
import type { SpatialFeature, LocalPoint } from "../../types/spatial.ts";
import { architectureParameters as p, stableSeed } from "./config.ts";
import { monumentIdentities, supplementalSpatialFeatures, type ArchitecturalType } from "./monuments.ts";

export interface ArchitectureEntry {
  id: string; accuracy: "APPROXIMATE" | "PLACEHOLDER"; sourceIds: string[];
  footprint: SpatialFeature; style: "courtyard" | "building" | "pagoda" | "stone-shrine";
  floors: number; tiers: number; bodyHeight: number; interpretation: string;
  architectureType?: ArchitecturalType; monumentId?: string;
}

export function footprintBounds(vertices: LocalPoint[]) {
  const xs = vertices.map(v => v[0]), zs = vertices.map(v => v[1]);
  const minX = Math.min(...xs), maxX = Math.max(...xs), minZ = Math.min(...zs), maxZ = Math.max(...zs);
  return { minX, maxX, minZ, maxZ, width: maxX - minX, depth: maxZ - minZ, x: (minX + maxX) / 2, z: (minZ + maxZ) / 2 };
}

export const sourceArchitecture: ArchitectureEntry[] = spatialFeatures.filter(f => f.kind === "building-footprint").map(f => {
  const monument = f.footprintClass === "monument", complex = !!f.holes?.length;
  const identity = monumentIdentities.find(m => m.sourceFootprintId === f.id);
  const style = complex ? "courtyard" : monument ? "stone-shrine" : "building";
  const floors = complex ? 3 : 2 + stableSeed(f.id) % 2;
  const tiers = identity?.architectureType === "NEWAR_PAGODA" ? 2 : 0;
  return { id: `architecture:${f.id}`, accuracy: "APPROXIMATE", sourceIds: [...f.sourceIds], footprint: f, style, floors, tiers,
    architectureType: identity?.architectureType ?? "CONTEXT_BUILDING", monumentId: identity?.id,
    bodyHeight: complex ? 8.7 : style === "building" ? floors * p.storeyHeight : p.tierSpacing,
    interpretation: "Source-derived placement; approximate procedural mass, roof, facade, plinth and entrance interpretation. Neutral identity; no verified architectural dimensions." };
});

// Deliberate enclosure, NOT map traces. Gaps remain at the east and south approaches.
const contextPositions = [
  [-91,-3,15,12],[-92,17,13,12],[-89,37,15,11],[-64,68,14,11],[-42,71,16,12],[-19,74,13,11],
  [5,76,15,12],[29,79,13,11],[94,44,13,12],[97,21,14,12],[96,-4,13,11],
  [-88,-28,14,12],[-51,-68,14,11],[-28,-69,13,12],[-5,-69,15,11],[23,-68,13,12],
] as const;
export const contextArchitecture: ArchitectureEntry[] = contextPositions.map(([x,z,w,d],i) => {
  const id = `context-enclosure-${i+1}`;
  const footprint: SpatialFeature = { id, name:id, kind:"building-footprint", vertices:[[x-w/2,z-d/2],[x+w/2,z-d/2],[x+w/2,z+d/2],[x-w/2,z+d/2]],
    accuracy:"PLACEHOLDER", sourceIds:[], calibrationId:"", measurementMethod:"Development enclosure only; no mapped position claim", uncertaintyNote:"Not a historical building or footprint", heightMetres:null };
  const floors=2;
  return { id, accuracy:"PLACEHOLDER" as const, sourceIds:[], footprint, style:"building" as const, floors, tiers:0, bodyHeight:floors*p.storeyHeight,
    interpretation:"Low-detail fictional context enclosure, isolated from UNESCO data; replace after further spatial research." };
}).filter(context => {
  const b = footprintBounds(context.footprint.vertices);
  return !sourceArchitecture.some(source => {
    const s = footprintBounds(source.footprint.vertices), clearance = 3;
    return b.minX < s.maxX + clearance && b.maxX > s.minX - clearance && b.minZ < s.maxZ + clearance && b.maxZ > s.minZ - clearance;
  });
});

export const supplementalArchitecture: ArchitectureEntry[] = supplementalSpatialFeatures.map(f => {
  const identity = monumentIdentities.find(m => m.sourceFootprintId === f.id)!;
  return {id:`architecture:${f.id}`,accuracy:"APPROXIMATE",sourceIds:[...f.sourceIds],footprint:f,style:"stone-shrine",floors:0,tiers:0,bodyHeight:2.3,
    architectureType:identity.architectureType,monumentId:identity.id,interpretation:identity.mappingRationale};
});
