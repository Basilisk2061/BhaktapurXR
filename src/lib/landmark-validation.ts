import type { Landmark, SourceReference } from "@/types/landmark";

type RecordValue = Record<string, unknown>;
const record = (v: unknown): v is RecordValue => typeof v === "object" && v !== null && !Array.isArray(v);
const text = (v: unknown): v is string => typeof v === "string" && v.trim().length > 0;
const positive = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v) && v > 0;
const tuple = (v: unknown, scaled = false): boolean => Array.isArray(v) && v.length === 3 && v.every(n => typeof n === "number" && Number.isFinite(n) && (!scaled || n > 0));

/** Only local, uncompressed GLB/glTF paths supported by the existing asset loader. */
export function parseLandmarkModelPath(path: string): { category: "environment" | "architecture" | "characters"; filename: string } {
  const match = /^\/assets\/models\/(environment|architecture|characters)\/([a-zA-Z0-9_-]+\.(?:glb|gltf))$/.exec(path);
  if (!match) throw new Error(`Invalid landmark model path: ${path}`);
  return { category: match[1] as "environment" | "architecture" | "characters", filename: match[2] };
}

/** Validate once before rendering; invalid claims/data fail visibly rather than being trusted. */
export function validateWorldData(data: unknown, references: unknown): asserts data is Landmark[] {
  if (!Array.isArray(data) || !Array.isArray(references)) throw new Error("World registries must be arrays");
  const sourceIds = new Set<string>();
  const sourceTypes = new Set(["survey", "publication", "photograph", "dataset", "other"]);
  for (const s of references) {
    if (!record(s) || !text(s.id) || sourceIds.has(s.id) || !text(s.title) || !text(s.reference) || !sourceTypes.has(String(s.type)) || !Array.isArray(s.supportedClaims) || !s.supportedClaims.length || !s.supportedClaims.every(text)) throw new Error("Invalid or duplicate source reference");
    sourceIds.add(s.id);
  }
  const ids = new Set<string>();
  for (const l of data) {
    if (!record(l) || !text(l.id) || ids.has(l.id)) throw new Error("Missing or duplicate landmark ID");
    ids.add(l.id);
    const fail = (reason: string): never => { throw new Error(`${l.id}: ${reason}`); };
    if (!text(l.name) || !text(l.category)) fail("missing name/category");
    const t = l.transform;
    if (!record(t) || !tuple(t.position) || !tuple(t.rotation) || !tuple(t.scale, true)) fail("invalid transform");
    const d = l.approximateDimensions;
    if (!record(d) || !positive(d.width) || !positive(d.height) || !positive(d.depth)) fail("invalid dimensions");
    if (!["VERIFIED", "APPROXIMATE", "PLACEHOLDER"].includes(String(l.accuracy))) fail("invalid accuracy");
    if (!Array.isArray(l.sourceIds) || !l.sourceIds.every(id => text(id) && sourceIds.has(id))) fail("unknown source reference");
    if (l.accuracy !== "PLACEHOLDER" && !(l.sourceIds as unknown[]).length) fail("sourced accuracy requires evidence");
    if (l.modelAssetPath !== undefined) {
      if (!text(l.modelAssetPath)) fail("invalid model path");
      parseLandmarkModelPath(l.modelAssetPath as string);
    }
    if (l.collision !== "none" && l.collision !== "bounds") fail("invalid collision strategy");
    if (!record(l.interaction) || typeof l.interaction.interactable !== "boolean" || typeof l.interaction.radius !== "number" || !Number.isFinite(l.interaction.radius) || l.interaction.radius < 0 || (l.interaction.interactable && l.interaction.radius === 0)) fail("invalid interaction metadata");
    if (l.developmentOnly !== undefined && typeof l.developmentOnly !== "boolean") fail("invalid development flag");
    if (l.developmentOnly && l.accuracy !== "PLACEHOLDER") fail("development fixtures must be PLACEHOLDER");
  }
}

export function sourceSummary(landmark: Landmark, references: SourceReference[]): string {
  return landmark.sourceIds.map(id => references.find(s => s.id === id)?.title ?? "MISSING SOURCE").join(", ") || "No sources";
}
