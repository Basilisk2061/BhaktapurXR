import {Vector3} from "three";
import {buildTalejuWorldData} from "../architecture/taleju/precinct";
import savedScene from "../../features/bhaktapur/data/world-editor-state.json";
import {heritageSpatialGeometry,heritageAreaTarget} from "./spatial-zones";
import {transformMatrix,type ManualTransform,type TransformOverrides} from "../../features/world-editor/transforms";
import {playerConfig} from "../player/player-config";
import {heritageLandmarks} from "./landmarks";
import {heritageZoneSpecifications} from "./zone-specifications";
import type {HeritageInteractionZone} from "./types";
// Read the renderer's final pipeline once. Retain only frames and interaction
// descriptors/colliders, never extra GPU geometry or complete model arrays.
let frames:Map<string,{source:ManualTransform;doorX:number}>|undefined;
let spatial:ReturnType<typeof heritageSpatialGeometry>;
function sourceFrames(){
 if(!frames){
  const data=buildTalejuWorldData(),models=[...data.models,...data.urban.models];
  spatial=heritageSpatialGeometry(models,savedScene.hiddenObjects);
  const next=new Map<string,{source:ManualTransform;doorX:number}>();
  for(const m of models){
   if(!heritageZoneSpecifications[m.id])continue;
   let doorX=0;
   if(m.id==="gallery-frontage"){
    // Interior clipping removes the construction-time foundation box. The public
    // doorway survives, and gives the same local entrance X without that contract.
    const threshold=m.boxes.find(box=>box.role==="museum-entrance-door-threshold");
    if(!threshold)continue; // No real doorway: skip the museum zone, never invent an anchor.
    doorX=(threshold.position[0]-m.origin[0])*Math.cos(m.yaw)-(threshold.position[2]-m.origin[1])*Math.sin(m.yaw);
   }
   next.set(m.id,{source:{position:[m.origin[0],0,m.origin[1]],rotation:[0,m.yaw,0],scale:[1,1,1]},doorX});
  }
  frames=next;
 }
 return frames;
}
/** Zones follow final source frames and full saved parent Euler/scale overrides. */
export function heritageInteractionZones(overrides:TransformOverrides={}):HeritageInteractionZone[]{
 return Object.entries(heritageZoneSpecifications).flatMap(([id,spec])=>{
  const frame=sourceFrames().get(id),record=heritageLandmarks[id];
  if(!frame||!record)return [];
  if((id==="chyasilin"||id==="fifty-five-frontage")&&savedScene.hiddenObjects.some(hidden=>hidden===id))return [];
  const area=spatial.area(id,overrides);
  const position=new Vector3(spec.offset[0]+frame.doorX,playerConfig.height/2,spec.offset[1]).applyMatrix4(transformMatrix(overrides[id]??frame.source)).toArray() as [number,number,number];
  if(area){
   const points=area.kind==='frontage'?[area.start,area.end]:area.vertices;
   position[0]=points.reduce((sum,p)=>sum+p[0],0)/points.length;position[1]=points.reduce((sum,p)=>sum+p[1],0)/points.length;position[2]=points.reduce((sum,p)=>sum+p[2],0)/points.length;
   const range=Math.max(...points.map(p=>Math.hypot(p[0]-position[0],p[2]-position[2])))+8;
   return [{landmarkId:id,heritageId:id,position,radius:spec.radius,label:`Explore ${record.name}`,area,visibleFrom:spatial.visibility(id,overrides,position,range,savedScene.createdObjects)}];
  }
  return [{landmarkId:id,heritageId:id,position,radius:spec.radius,label:`Explore ${record.name}`}];
 });
}
export function nearestHeritageZone(position:{x:number;y:number;z:number},zones:readonly HeritageInteractionZone[],valid:(id:string)=>boolean,facingYaw?:number){
 let nearest:HeritageInteractionZone|null=null,best=Infinity;
 for(const zone of zones){
  if(!valid(zone.heritageId)||!Number.isFinite(zone.radius)||zone.radius<=0)continue;
  const target=zone.area?heritageAreaTarget(zone.area,position):null;
  if(zone.area){
   if(!target||Math.abs(position.y-zone.position[1])>1.6)continue;
   const dx=target.point[0]-position.x,dz=target.point[2]-position.z,length=Math.hypot(dx,dz);
   if(facingYaw!==undefined&&length>.2&&(-Math.sin(facingYaw)*dx-Math.cos(facingYaw)*dz)/length<.05)continue;
   if(zone.visibleFrom&&!zone.visibleFrom(position,target.point))continue;
  }
  const d=target?target.distance:(position.x-zone.position[0])**2+(position.y-zone.position[1])**2+(position.z-zone.position[2])**2;
  if((zone.area||d<=zone.radius**2)&&(d<best||(d===best&&zone.landmarkId<(nearest?.landmarkId??"")))){nearest=zone;best=d;}
 }
 return nearest;
}
