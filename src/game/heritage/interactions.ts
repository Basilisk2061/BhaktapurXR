import {Vector3} from "three";
import {buildCompletedSquareModels} from "../architecture/square-completion";
import {museumEntranceCentre} from "../architecture/museum-entrance";
import {transformMatrix,type ManualTransform,type TransformOverrides} from "../../features/world-editor/transforms";
import {playerConfig} from "../player/player-config";
import {heritageLandmarks} from "./landmarks";
import {heritageZoneSpecifications} from "./zone-specifications";
import type {HeritageInteractionZone} from "./types";
// Read the renderer's final correction pipeline once on demand. Retain only frames,
// not architectural model arrays. No extra GPU geometry is created.
let frames:Map<string,{source:ManualTransform;doorX:number}>|undefined;
function sourceFrames(){
 if(!frames)frames=new Map(buildCompletedSquareModels().filter(m=>heritageZoneSpecifications[m.id]).map(m=>[m.id,{
  source:{position:[m.origin[0],0,m.origin[1]],rotation:[0,m.yaw,0],scale:[1,1,1]} satisfies ManualTransform,
  doorX:m.id==="gallery-frontage"?museumEntranceCentre(m):0,
 }]));
 return frames;
}
/** Zones follow final source frames and full saved parent Euler/scale overrides. */
export function heritageInteractionZones(overrides:TransformOverrides={}):HeritageInteractionZone[]{
 return Object.entries(heritageZoneSpecifications).flatMap(([id,spec])=>{
  const frame=sourceFrames().get(id),record=heritageLandmarks[id];
  if(!frame||!record)return [];
  const position=new Vector3(spec.offset[0]+frame.doorX,playerConfig.height/2,spec.offset[1]).applyMatrix4(transformMatrix(overrides[id]??frame.source)).toArray() as [number,number,number];
  return [{landmarkId:id,heritageId:id,position,radius:spec.radius,label:`Explore ${record.name}`}];
 });
}
export function nearestHeritageZone(position:{x:number;y:number;z:number},zones:readonly HeritageInteractionZone[],valid:(id:string)=>boolean){
 let nearest:HeritageInteractionZone|null=null,best=Infinity;
 for(const zone of zones){
  if(!valid(zone.heritageId)||!Number.isFinite(zone.radius)||zone.radius<=0)continue;
  const d=(position.x-zone.position[0])**2+(position.y-zone.position[1])**2+(position.z-zone.position[2])**2;
  if(d<=zone.radius**2&&(d<best||(d===best&&zone.landmarkId<(nearest?.landmarkId??"")))){nearest=zone;best=d;}
 }
 return nearest;
}
