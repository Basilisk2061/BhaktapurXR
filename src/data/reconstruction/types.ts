export const accuracyClasses=["VERIFIED","SOURCE_DERIVED","PHOTO_INFERRED","APPROXIMATE","PLACEHOLDER","UNRESOLVED"] as const;
export type AccuracyClass=typeof accuracyClasses[number];
export type Point=[number,number];
export type PlanRepresentation="FOOTPRINT"|"POINT_SYMBOL"|"ICON"|"LEADER_LABEL"|"TEXT_ONLY"|"NONE";
export type GeographicPosition={latitude:number;longitude:number};
export type GeospatialStatus="UNASSESSED"|"CONSISTENT"|"LOW_PRECISION"|"OUTLIER"|"CAMERA_POSITION_ONLY"|"DUPLICATED_SUSPECT"|"UNRESOLVED";
export interface GeographicEvidence {role:"OBJECT_LOCATION"|"CAMERA_LOCATION"|"UNVERIFIED_CANDIDATE";usage:"GEOSPATIAL_SANITY_CHECK"|"APPROXIMATE_GEOREFERENCE";sourceReferences:string[];provenance:string;uncertaintyMetres:number|null;independenceGroup:string}
export interface GeographicAnchor {id:string;monumentId:string;coordinate:GeographicPosition;evidence:GeographicEvidence;status:GeospatialStatus;fitEligible:boolean;reason:string}
export type SourceType="GEOSPATIAL_RECORD"|"PLAN"|"ARCHAEOLOGICAL_PUBLICATION"|"OFFICIAL_INVENTORY"|"HERITAGE_DOCUMENTATION"|"PHOTOGRAPH"|"SCAN_PUBLICATION"|"UNESCO_CONTEXT";
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
  planRepresentation?:PlanRepresentation;positionUncertaintyMeters?:number;
  geographicPosition?:GeographicPosition|null;geographicEvidence?:GeographicEvidence|null;geospatialResidual?:number|null;geospatialStatus?:GeospatialStatus;
}
