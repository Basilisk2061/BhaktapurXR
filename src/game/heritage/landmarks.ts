import records from "./records.json";
import type {HeritageLandmark} from "./types";
/** Researched records with field-level source claims. */
export const heritageLandmarks:Readonly<Record<string,HeritageLandmark>>=records as Record<string,HeritageLandmark>;
