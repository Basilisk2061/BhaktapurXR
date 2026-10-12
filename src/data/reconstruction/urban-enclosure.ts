import {planToMetres} from "./calibration.ts";
import {applyFit} from "./geographic-frame.ts";
import {adoptedFit} from "./present-day.ts";
import type {Point} from "./types.ts";
export const contextClassifications=["SOURCE_DERIVED","PHOTO_INFERRED","CONTEXT_APPROXIMATE","UNRESOLVED"] as const;
export type ContextClassification=typeof contextClassifications[number];
export const contextPoint=(p:Point)=>applyFit(planToMetres(p),adoptedFit);
export interface FrontageGroup {id:string;from:Point;to:Point;depth:number;storeys:number;classification:ContextClassification;sourceReferences:string[];basis:string;distant?:boolean}
const frontage=(id:string,a:Point,b:Point,depth:number,storeys:number,basis:string):FrontageGroup=>({id,from:contextPoint(a),to:contextPoint(b),depth,storeys,classification:"SOURCE_DERIVED",sourceReferences:["dh-plan","western-2021","central-pair-2021","silu-photo-2022"],basis});
// New context interpretations of visible frontage directions, never edits to Phase 6 traces.
export const urbanFrontages:FrontageGroup[]=[
 frontage("palace-west-adjacent",[265,228],[455,245],8,3,"Plan's western north-side frontage; ordinary facade modules, no named palace reconstruction"),
 frontage("western-back-edge",[286,445],[286,312],9,3,"Plan's western approach frontage; shrine clearance controls module retention"),
 frontage("western-south-edge",[530,424],[315,424],8,3,"Southern side of western plaza; approximate connecting frontage, supported by western context photo"),
 frontage("south-palace-opposite",[721,435],[575,435],7,2,"Low frontage opposite palace in existing plan; Potters exit kept open"),
 frontage("siddhi-south-context",[1100,466],[855,465],9,3,"Plan's southeast built fabric beyond the open approach; modules are ordinary context, not a Bahal reconstruction"),
 frontage("eastern-frontage",[1080,415],[970,397],8,3,"Built frontage south/east of Siddhi; context height inferred from reused views"),
 frontage("silu-east-frontage",[1033,205],[1028,345],8,3,"East of Silu and eastern link; source block direction with uncertain modern facade setback"),
 frontage("silu-north-context",[830,154],[1040,154],8,2,"Low northern background behind Silu; schematic fabric, not a new palace wing identity"),
];
export interface StreetExit {id:string;from:Point;to:Point;width:number;classification:"SOURCE_DERIVED";sourceReferences:string[];basis:string}
const exit=(id:string,a:Point,b:Point,width:number,basis:string):StreetExit=>({id,from:contextPoint(a),to:contextPoint(b),width,classification:"SOURCE_DERIVED",sourceReferences:["dh-plan"],basis});
export const urbanStreetExits:StreetExit[]=[
 exit("west-entrance",[330,352],[200,352],7,"West main-square approach; approximate clear width"),
 exit("old-town-north",[460,304],[460,185],6,"Old Town entrance direction; only short continuation"),
 exit("tachupal-east",[1015,351],[1140,351],6,"Plan arrow toward Tachupal; not a surveyed road edge"),
 exit("taumadhi-south",[815,455],[890,565],6,"Existing southern connection and Taumadhi direction"),
 exit("potters-south",[595,450],[560,570],6,"Plan arrow toward Potters Square; approximate street alignment"),
];
// Street flank modules extend only ~25 m past approaches. Background is deliberately anonymous.
export const urbanBackdrops:FrontageGroup[]=[
 {id:"north-roof-depth",from:[-152,-66],to:[69,-66],depth:13,storeys:3,classification:"CONTEXT_APPROXIMATE",sourceReferences:["dh-plan"],basis:"Anonymous low-detail roof depth behind perimeter",distant:true},
 {id:"west-roof-depth",from:[-157,66],to:[-157,-58],depth:10,storeys:3,classification:"CONTEXT_APPROXIMATE",sourceReferences:["dh-plan"],basis:"Anonymous western background, street corridor excluded",distant:true},
 {id:"east-roof-depth",from:[86,-57],to:[86,68],depth:10,storeys:3,classification:"CONTEXT_APPROXIMATE",sourceReferences:["dh-plan"],basis:"Anonymous eastern background, Tachupal corridor excluded",distant:true},
 {id:"south-roof-depth",from:[79,74],to:[-145,74],depth:12,storeys:2,classification:"CONTEXT_APPROXIMATE",sourceReferences:["dh-plan"],basis:"Low distant backdrop; no individual building claim",distant:true},
];
export const urbanEvidencePolicy={placement:"SOURCE_DERIVED plan frontage directions, interpreted setbacks and module partitions",appearance:"PHOTO_INFERRED brick/timber/tile vocabulary from existing dated views",dimensions:"CONTEXT_APPROXIMATE storeys, heights, depths, street widths and facades",unresolved:"Exact modern building outlines, individual identity, ownership and interiors",notes:"No context is VERIFIED. Old Phase 5 fictional placements are not reused in the accepted frame."};
