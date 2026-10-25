import {Box3,Matrix4,Ray,Vector3} from 'three';
import {partitionArchitecturalParts} from '../../features/world-editor/parts.ts';
import {partWorldDelta,transformMatrix,type ManualTransform,type TransformOverrides} from '../../features/world-editor/transforms.ts';
import type {CentralModel} from '../architecture/central-model.ts';
import type {SolidBox} from '../architecture/geometry.ts';
import type {HeritageSpatialArea} from './types.ts';
type Triple=[number,number,number];
const source=(m:CentralModel):ManualTransform=>({position:[m.origin[0],0,m.origin[1]],rotation:[0,m.yaw,0],scale:[1,1,1]});
/** Cache only interaction descriptors, never extra rendered geometry. */
export function heritageSpatialGeometry(models:CentralModel[],hidden:readonly string[]){
 const solids:{owner:string;part:string;source:ManualTransform;partSource:ManualTransform;box:SolidBox}[]=[];
 const features=new Map<string,{source:ManualTransform;part:string;partSource:ManualTransform;area:HeritageSpatialArea}>();
 for(const m of models){
  if(hidden.includes(m.id)||m.id.startsWith('ground:'))continue;
  const frame=source(m),parts=partitionArchitecturalParts(m);
  for(const part of parts){
   if(hidden.includes(part.id))continue;
   for(const box of part.model.colliders)solids.push({owner:m.id,part:part.id,source:frame,partSource:part.source,box});
   if(m.id==='fifty-five-frontage'){
    const band=part.model.boxes.find(p=>p.role==='continuous-carved-gallery');if(!band)continue;
    const c=Math.cos(band.yaw),s=Math.sin(band.yaw),x=band.position[0]+s*band.size[2]/2,z=band.position[2]+c*band.size[2]/2,w=band.size[0]/2;
    features.set(m.id,{source:frame,part:part.id,partSource:part.source,area:{kind:'frontage',start:[x-w*c,.875,z+w*s],end:[x+w*c,.875,z-w*s],front:[s,0,c],depth:7}});
   }
   if(m.id==='chyasilin'){
    const base=part.model.profiles.find(p=>p.role==='pavilion-platform'&&p.position[1]===0);if(!base)continue;
    const r=Math.max(...base.profile.map(p=>p[0]));
    const vertices=Array.from({length:base.segments},(_,i)=>{const a=i*Math.PI*2/base.segments+base.yaw+Math.PI/8;return [base.position[0]+Math.sin(a)*r,.875,base.position[2]+Math.cos(a)*r] as Triple;});
    features.set(m.id,{source:frame,part:part.id,partSource:part.source,area:{kind:'footprint',vertices,margin:3.5}});
   }
  }
 }
 return {area(id:string,overrides:TransformOverrides){
  const feature=features.get(id);if(!feature)return;
  const delta=partWorldDelta(feature.source,overrides[id]??feature.source,feature.partSource,overrides[feature.part]??feature.partSource),point=(p:Triple)=>new Vector3(...p).applyMatrix4(delta).toArray() as Triple,a=feature.area;
  return a.kind==='frontage'?{...a,start:point(a.start),end:point(a.end),front:new Vector3(...a.front).transformDirection(delta).toArray() as Triple}:{...a,vertices:a.vertices.map(point)};
 },visibility(id:string,overrides:TransformOverrides,centre:Triple,range:number,primitives:readonly {id:string;position:number[];rotation:number[];scale:number[]}[]){
  const near=new Box3(new Vector3(centre[0]-range,-5,centre[2]-range),new Vector3(centre[0]+range,30,centre[2]+range)),blockers:{inverse:Matrix4;bounds:Box3}[]=[];
  for(const item of solids){
   if(item.owner===id)continue;const b=item.box,delta=partWorldDelta(item.source,overrides[item.owner]??item.source,item.partSource,overrides[item.part]??item.partSource);
   let matrix:Matrix4,bounds:Box3;
   if(b.vertices){matrix=delta.clone().multiply(new Matrix4().makeTranslation(...b.position));bounds=new Box3();for(let i=0;i<b.vertices.length;i+=3)bounds.expandByPoint(new Vector3().fromArray(b.vertices,i));}
   else{matrix=delta.clone().multiply(transformMatrix({position:b.position,rotation:[0,b.yaw,0],scale:b.size}));bounds=new Box3(new Vector3(-.5,-.5,-.5),new Vector3(.5,.5,.5));}
   if(near.intersectsBox(bounds.clone().applyMatrix4(matrix)))blockers.push({inverse:matrix.invert(),bounds});
  }
  for(const p of primitives){const matrix=transformMatrix({position:p.position as Triple,rotation:p.rotation as Triple,scale:p.scale as Triple}),bounds=new Box3(new Vector3(-.5,-.5,-.5),new Vector3(.5,.5,.5));if(near.intersectsBox(bounds.clone().applyMatrix4(matrix)))blockers.push({inverse:matrix.invert(),bounds});}
  const a=new Vector3(),b=new Vector3(),direction=new Vector3(),hit=new Vector3(),ray=new Ray();
  return (position:{x:number;y:number;z:number},target:Triple)=>{
   for(const item of blockers){a.set(position.x,position.y+.55,position.z).applyMatrix4(item.inverse);b.set(target[0],position.y+.55,target[2]).applyMatrix4(item.inverse);direction.subVectors(b,a);const length=direction.length();if(length<.001)continue;ray.set(a,direction.divideScalar(length));if(ray.intersectBox(item.bounds,hit)&&a.distanceTo(hit)<length-.03)return false;}
   return true;
  };
 }};
}
/** Closest sensible viewing point; used for range, facing and prompt priority. */
export function heritageAreaTarget(area:HeritageSpatialArea,position:{x:number;y:number;z:number}):{point:Triple;distance:number}|null{
 const segment=(a:Triple,b:Triple)=>{const dx=b[0]-a[0],dz=b[2]-a[2],t=Math.max(0,Math.min(1,((position.x-a[0])*dx+(position.z-a[2])*dz)/(dx*dx+dz*dz||1))),point:Triple=[a[0]+t*dx,a[1],a[2]+t*dz];return {point,distance:(position.x-point[0])**2+(position.z-point[2])**2};};
 if(area.kind==='frontage'){
  const side=(position.x-area.start[0])*area.front[0]+(position.z-area.start[2])*area.front[2],target=segment(area.start,area.end),dx=area.end[0]-area.start[0],dz=area.end[2]-area.start[2],along=(position.x-area.start[0])*dx+(position.z-area.start[2])*dz;
  return side>=-.05&&side<=area.depth&&along>=0&&along<=dx*dx+dz*dz&&target.distance<=area.depth**2?target:null;
 }
 let inside=false,best:{point:Triple;distance:number}|null=null;
 for(let i=0,j=area.vertices.length-1;i<area.vertices.length;j=i++){
  const a=area.vertices[i],b=area.vertices[j];if((a[2]>position.z)!==(b[2]>position.z)&&position.x<(b[0]-a[0])*(position.z-a[2])/(b[2]-a[2])+a[0])inside=!inside;
  const candidate=segment(a,b);if(!best||candidate.distance<best.distance)best=candidate;
 }
 if(!best)return null;if(inside){best.distance=0;best.point=[area.vertices.reduce((sum,p)=>sum+p[0],0)/area.vertices.length,area.vertices[0][1],area.vertices.reduce((sum,p)=>sum+p[2],0)/area.vertices.length];}return best.distance<=area.margin**2?best:null;
}
