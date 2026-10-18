import {Vector3} from "three";
import {spatialCorrections} from "../../data/reconstruction/khauma-spatial-audit";
import {westSpecificationById} from "../../data/reconstruction/architecture/west-specifications";
import {transformMatrix,type TransformOverrides} from "../../features/world-editor/transforms";
import {playerConfig} from "../player/player-config";
import type {HeritageInteractionZone} from "./types";
/** Use the same corrected assembly frame as the scene, then its saved parent override.
 * Local +Z is the entrance. 8.2 m is outside the current central stair foot (8.05 m).
 * The zone is not geometry and never changes the landmark's placement. */
export function heritageInteractionZones(overrides:TransformOverrides={}):HeritageInteractionZone[]{
 const id="gopinath-krishna",spec=westSpecificationById[id],correction=spatialCorrections[id];
 const origin=correction?.coordinate??spec.position,yaw=correction?.yaw??spec.workingYaw;
 const source={position:[origin[0],0,origin[1]] as [number,number,number],rotation:[0,yaw,0] as [number,number,number],scale:[1,1,1] as [number,number,number]};
 const position=new Vector3(0,playerConfig.height/2,8.2).applyMatrix4(transformMatrix(overrides[id]??source)).toArray() as [number,number,number];
 return [{landmarkId:id,heritageId:id,position,radius:4.5,label:"Explore Gopinath Temple"}];
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
