import type { Vector3Tuple } from "./world";

export type Accuracy = "VERIFIED" | "APPROXIMATE" | "PLACEHOLDER";
export interface SourceReference {
  id: string;
  title: string;
  type: "survey" | "publication" | "photograph" | "dataset" | "other";
  reference: string;
  supportedClaims: string[];
  notes?: string;
  accessedDate?: string;
}
export interface Landmark {
  id: string;
  name: string;
  nameNe?: string;
  category: string;
  transform: { position: Vector3Tuple; rotation: Vector3Tuple; scale: Vector3Tuple };
  approximateDimensions: { width: number; height: number; depth: number };
  accuracy: Accuracy;
  sourceIds: string[];
  modelAssetPath?: string;
  collision: "none" | "bounds";
  interaction: { interactable: boolean; radius: number };
  developmentOnly?: boolean;
}
