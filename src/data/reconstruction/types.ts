export const accuracyClasses=["VERIFIED","SOURCE_DERIVED","PHOTO_INFERRED","APPROXIMATE","PLACEHOLDER","UNRESOLVED"] as const;
export type AccuracyClass=typeof accuracyClasses[number];
export type Point=[number,number];
export type SourceType="PLAN"|"ARCHAEOLOGICAL_PUBLICATION"|"OFFICIAL_INVENTORY"|"HERITAGE_DOCUMENTATION"|"PHOTOGRAPH"|"SCAN_PUBLICATION"|"UNESCO_CONTEXT";
export interface ReconstructionSource {id:string;title:string;author:string;publisher:string;year:number|null;url:string;sourceType:SourceType;license:string|null;period:string;access:string;notes:string}
export interface Evidence {accuracyClass:AccuracyClass;sourceReferences:string[];method:string;uncertainty:string}
export interface Rotation extends Evidence {bearingDegrees:number|null;state:"PLAN_FRONTAGE"|"DOCUMENTED_FACING"|"AXIS_ONLY"|"UNRESOLVED";accessBearingDegrees?:number;conflictingBearings?:{bearingDegrees:number;role:string;sourceReferences:string[]}[]}
export interface ReconstructionObject {
  id:string;canonicalName:string;alternateNames:string[];category:"PLAZA"|"PALACE_FRONTAGE"|"GATE"|"TEMPLE"|"PAVILION"|"COLUMN"|"BELL";
  position:Point|null;rotation:Rotation;footprint:Point[]|null;approximateHeight:number|null;
  architectureType:string;sourceType:SourceType;sourceReferences:string[];confidence:"HIGH"|"MEDIUM"|"LOW"|"UNRESOLVED";accuracyClass:AccuracyClass;notes:string;
  sourcePixels:Point[]|null;positionEvidence:Evidence;footprintEvidence:Evidence;heightEvidence:Evidence;
  presence:{state:"INVENTORY_SUPPORTED"|"RESTORATION_DOCUMENTED"|"UNRESOLVED";sourceReferences:string[];asOf:string};
  footprintRole:"PUBLIC_EDGE"|"PLAN_OUTLINE"|"SYMBOL_EXTENT"|"NONE";
}
