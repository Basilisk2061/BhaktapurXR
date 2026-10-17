import {Vector3} from "three";
import seatSource from "../world/generated-seat-source.json" with {type:"json"};
import type {CentralModel} from "../architecture/central-model.ts";
import {partitionArchitecturalParts} from "../../features/world-editor/parts.ts";
import {partWorldDelta,type TransformOverrides} from "../../features/world-editor/transforms.ts";

export interface ArcadeSeat {point:Vector3;exit:Vector3;yaw:number}
export interface SeatSpan {a:Vector3;b:Vector3;outward:Vector3;columns:Vector3[]}
export const sittingConfig={distance:1.4,depth:.32,exit:.95,columnClearance:.55,visualY:.008} as const;
let source:CentralModel|undefined;
/** Source geometry is cached; live parent/part overrides are applied exactly once. */
export function arcadeSeatSpans(overrides:TransformOverrides={}):SeatSpan[]{
 source??=seatSource as unknown as CentralModel;
 const m=source!;const parts=partitionArchitecturalParts(m),plinth=parts.find(p=>p.id.endsWith("/plinth"))!,posts=parts.find(p=>p.id.endsWith("/columns"))!;
 const assembly={position:[m.origin[0],0,m.origin[1]],rotation:[0,m.yaw,0],scale:[1,1,1]} as import("../../features/world-editor/transforms.ts").ManualTransform;
 const delta=(p:typeof plinth)=>partWorldDelta(assembly,overrides[m.id]??assembly,p.source,overrides[p.id]??p.source);
 const floorDelta=delta(plinth),columnDelta=delta(posts);
 if(new Vector3(0,1,0).transformDirection(floorDelta).y<.9)return [];
 const columns=m.boxes.filter(b=>b.role==="sattal-columns").map(b=>new Vector3(...b.position).applyMatrix4(columnDelta));
 return (m.volumes??[]).filter(v=>v.role==="sattal-plinth").flatMap(v=>{
  const ring=v.rings[0];return ring.slice(0,-1).flatMap((a,i)=>{
   const b=ring[i+1],dx=b[0]-a[0],dz=b[1]-a[1],length=Math.hypot(dx,dz);
   // Same public facade as the generator, using its actual extended top edge.
   if(length<2||-dx/length>=-.3)return [];
   const outward=new Vector3(dz/length,0,-dx/length).transformDirection(floorDelta);outward.y=0;outward.normalize();
   return [{a:new Vector3(a[0],v.baseY+v.height,a[1]).applyMatrix4(floorDelta),b:new Vector3(b[0],v.baseY+v.height,b[1]).applyMatrix4(floorDelta),outward,columns}];
  });
 });
}
/** Closest continuous seat in a usable bay, with clearance from actual transformed posts. */
export function nearestArcadeSeat(feet:{x:number;y:number;z:number},spans:SeatSpan[]):ArcadeSeat|null{
 let best:ArcadeSeat|null=null,distance:number=sittingConfig.distance;
 for(const span of spans){
  const direction=span.b.clone().sub(span.a),length=direction.length();direction.normalize();
  const cuts=span.columns.map(p=>p.clone().sub(span.a).dot(direction)).filter(t=>t>=-.5&&t<=length+.5).sort((a,b)=>a-b);
  const intervals:[number,number][]=[];let start=.55;
  for(const t of cuts){if(t-.55>start)intervals.push([start,t-.55]);start=Math.max(start,t+.55);}if(start<length-.55)intervals.push([start,length-.55]);
  const projected=new Vector3(feet.x,feet.y,feet.z).sub(span.a).dot(direction);
  for(const [lo,hi]of intervals){const edge=span.a.clone().addScaledVector(direction,Math.max(lo,Math.min(hi,projected))),point=edge.clone().addScaledVector(span.outward,-sittingConfig.depth);
   if(span.columns.some(p=>Math.hypot(point.x-p.x,point.z-p.z)<sittingConfig.columnClearance))continue;
   const d=point.distanceTo(new Vector3(feet.x,feet.y,feet.z));if(d>distance)continue;
   distance=d;best={point,exit:edge.addScaledVector(span.outward,sittingConfig.exit),yaw:Math.atan2(-span.outward.x,-span.outward.z)};
  }
 }return best;
}
