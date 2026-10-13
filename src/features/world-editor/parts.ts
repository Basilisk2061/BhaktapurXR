import {Vector3} from "three";
import type {CentralModel} from "../../game/architecture/central-model.ts";
import type {SolidBox} from "../../game/architecture/geometry.ts";
import {transformMatrix,type ManualTransform} from "./transforms.ts";
export interface ArchitecturalPart {id:string;parentId:string;name:string;source:ManualTransform;model:CentralModel;colliderCount:number}
type Piece={role:string;position?:[number,number,number];yaw?:number};
const labels:Record<string,string>={"gate-frame":"Gate frame / main decorative architecture",masonry:"Palace wall / gate masonry behind frame",canopy:"Golden Gate swept canopy",ornament:"Summit / upper ornament",plinth:"Plinth / platform",stairs:"Access stairs / landing",body:"Structural body",facade:"Timber facade / openings",roof:"Roof / eaves",return:"Palace west return",windows:"Palace window / timber gallery band",arcade:"Gallery pale arcade / upper rooms",shikhara:"Shikhara tower",columns:"Pavilion columns",lower:"Lower open pavilion",upper:"Upper pavilion"};
/** Existing procedural roles are grouped, never split into individual mesh primitives. */
export function architecturalPartKey(m:CentralModel,p:Piece):string{
 const r=p.role;
 if(m.id==="golden-gate")return /gate-side-masonry|gate-brick-upper|gateway-rear-tile-roof/.test(r)?"masonry":/canopy/.test(r)?"canopy":/garuda/.test(r)?"ornament":"gate-frame";
 if(m.id==="fifty-five-frontage"||m.id==="gallery-frontage"){
  if(/west-return|palace-return/.test(r)||(m.id==="fifty-five-frontage"&&p.yaw!==undefined&&Math.abs(Math.sin(p.yaw-m.yaw))>.5))return "return";
  if(/roof|eave/.test(r))return "roof";
  if(/gallery-pale|arcade|upper-paired-shutter|upper-window-sill|upper-arched-room/.test(r))return "arcade";
  if(/window|jamb|gallery|carved|projecting-sill|cornice/.test(r))return "windows";
  return "body";
 }
 if(m.id==="vatsala-durga")return /stair|landing/.test(r)?"stairs":/stepped-base|platform/.test(r)?"plinth":/pinnacle|finial/.test(r)?"ornament":/shikhara|spire|niche/.test(r)?"shikhara":"body";
 if(m.id==="chyasilin")return /platform|landing/.test(r)?"plinth":/stair/.test(r)?"stairs":/roof|eave/.test(r)?"roof":/finial/.test(r)?"ornament":r==="pavilion-post"?"columns":(p.position?.[1]??0)>4?"upper":"lower";
 if(/stair|access|landing/.test(r))return "stairs";
 if(/plinth|terrace|platform|stepped-base/.test(r))return "plinth";
 if(/roof|soffit|eave|strut|canopy/.test(r))return "roof";
 if(/finial|summit|parasol/.test(r))return "ornament";
 if(/window|portal|door|shutter|opening|lattice|guardian|relief|carved|photo-.*band|cornice/.test(r))return "facade";
 return "body";
}
const signature=(b:SolidBox)=>JSON.stringify([b.position,b.size,b.yaw]);
export function partitionArchitecturalParts(m:CentralModel):ArchitecturalPart[]{
 const groups=new Map<string,CentralModel>();
 const group=(key:string)=>{let g=groups.get(key);if(!g){g={...m,id:m.id+"/"+key,boxes:[],profiles:[],shapes:[],roofs:[],colliders:[],volumes:[],polygonRoofs:[]};groups.set(key,g);}return g;};
 for(const kind of ["boxes","profiles","shapes","roofs","volumes","polygonRoofs"] as const)for(const p of m[kind]??[]){const key=architecturalPartKey(m,p);(group(key)[kind] as unknown[]).push(p);}
 const owners=new Map(m.boxes.map(b=>[signature(b),architecturalPartKey(m,b)]));
 for(const c of m.colliders){let key=owners.get(signature(c));if(!key){const roof=m.roofs.find(r=>Math.abs(r.position[1]-.15-c.position[1])<.001&&c.size[1]<.2);key=roof?architecturalPartKey(m,roof):"body";}group(key).colliders.push(c);}
 const source={position:[m.origin[0],0,m.origin[1]],rotation:[0,m.yaw,0],scale:[1,1,1]} as ManualTransform,inv=transformMatrix(source).invert();
 return [...groups].map(([key,model])=>{
  const points=[...model.boxes,...model.profiles,...model.shapes,...model.roofs].map(p=>p.position);
  for(const v of model.volumes??[])for(const ring of v.rings)for(const [x,z]of ring)points.push([x,v.baseY+v.height/2,z]);
  for(const v of model.polygonRoofs??[])for(const ring of v.rings)for(const [x,z]of ring)points.push([x,v.baseY+v.rise/2,z]);
  for(const c of model.colliders)points.push(c.position);
  const min=new Vector3(Infinity,Infinity,Infinity),max=new Vector3(-Infinity,-Infinity,-Infinity);for(const p of points){const v=new Vector3(...p).applyMatrix4(inv);min.min(v);max.max(v);}const pivot=points.length?min.add(max).multiplyScalar(.5).toArray():[0,0,0];
  return {id:model.id,parentId:m.id,name:labels[key]??key,source:{position:pivot as [number,number,number],rotation:[0,0,0],scale:[1,1,1]},model,colliderCount:model.colliders.length};
 });
}
