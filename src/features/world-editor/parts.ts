import {Vector3} from "three";
import type {CentralModel} from "../../game/architecture/central-model.ts";
import type {SolidBox} from "../../game/architecture/geometry.ts";
import {transformMatrix,type ManualTransform} from "./transforms.ts";
export interface ArchitecturalPart {id:string;parentId:string;name:string;source:ManualTransform;model:CentralModel;colliderCount:number}
type Piece={role:string;position?:[number,number,number];yaw?:number};
const labels:Record<string,string>={"museum-entrance-door":"Museum entrance / carved doorway and nearby windows","museum-entrance-sign":"National Art Museum sign","museum-entrance-lions":"Museum guardian lions / plinths","museum-entrance-figures":"Museum carved side figures / bases","gate-frame":"Gate frame / main decorative architecture",masonry:"Palace wall / gate masonry behind frame",canopy:"Golden Gate swept canopy",ornament:"Summit / upper ornament",plinth:"Plinth / platform",stairs:"Access stairs / landing",body:"Structural body",facade:"Timber facade / openings",roof:"Roof / eaves",return:"Palace west return",windows:"Palace window / timber gallery band",arcade:"Gallery pale arcade / upper rooms",shikhara:"Shikhara tower",columns:"Pavilion columns",lower:"Lower open pavilion",upper:"Upper pavilion"};
/** Existing procedural roles are grouped, never split into individual mesh primitives. */
export function architecturalPartKey(m:CentralModel,p:Piece):string{
 const r=p.role;
 if(r.startsWith("school-"))return /left-guardian/.test(r)?"left-guardian":/right-guardian/.test(r)?"right-guardian":/left-relief/.test(r)?"left-relief":/right-relief/.test(r)?"right-relief":/pedestal/.test(r)?"pedestals":/central-gate|sign-board/.test(r)?"central-gate":/roof/.test(r)?"roof":"wall";
 if(m.id==="entrance:khauma-raised-veranda")return /platform/.test(r)?"plinth":/posts/.test(r)?"columns":/roof|trim/.test(r)?"roof":/beam|door/.test(r)?"veranda":"body";
 if(m.id==="silu-mahadev"&&/^silu-(platform|stairs|entrance|subsidiary|main-shikhara|cornices|finial|lower-sanctuary)/.test(r))return /platform/.test(r)?"plinth":/stairs/.test(r)?"stairs":/entrance/.test(r)?"entrance":/subsidiary/.test(r)?"subsidiary-towers":/main-shikhara/.test(r)?"main-shikhara":/cornice/.test(r)?"cornices":/finial/.test(r)?"ornament":"body";
 if(m.id==="context:9c:1159393578"&&r.startsWith("sattal-"))return /plinth/.test(r)?"plinth":/columns/.test(r)?"columns":/rear-wall/.test(r)?"rear-wall":/eaves/.test(r)?"eaves":/roof/.test(r)?"roof":/lower-bay/.test(r)?"lower-bays":"body";
 if(m.id==="golden-gate")return /gate-side-masonry|gate-brick-upper|gateway-rear-tile-roof/.test(r)?"masonry":/canopy/.test(r)?"canopy":/garuda/.test(r)?"ornament":"gate-frame";
 if(m.id==="fifty-five-frontage"||m.id==="gallery-frontage"){
  const museum=r.match(/^museum-entrance-(door|sign|lions|figures)/);if(museum)return "museum-entrance-"+museum[1];
  if(/west-return|palace-return/.test(r)||(m.id==="fifty-five-frontage"&&p.yaw!==undefined&&Math.abs(Math.sin(p.yaw-m.yaw))>.5))return "return";
  if(/roof|eave/.test(r))return "roof";
  if(/gallery-pale|arcade|upper-paired-shutter|upper-window-sill|upper-arched-room|upper-blind-arched-panel|upper-shutter-slats/.test(r))return "arcade";
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
export function partitionArchitecturalParts(m:CentralModel & {editorPartSources?:Record<string,ManualTransform>}):ArchitecturalPart[]{
 const groups=new Map<string,CentralModel>();
 const group=(key:string)=>{let g=groups.get(key);if(!g){g={...m,id:m.id+"/"+key,boxes:[],profiles:[],shapes:[],roofs:[],colliders:[],volumes:[],polygonRoofs:[]};groups.set(key,g);}return g;};
 for(const kind of ["boxes","profiles","shapes","roofs","volumes","polygonRoofs"] as const)for(const p of m[kind]??[]){const key=architecturalPartKey(m,p);(group(key)[kind] as unknown[]).push(p);}
 for(const id of Object.keys(m.editorPartSources??{}))group(id.slice(m.id.length+1));
 const owners=new Map(m.boxes.map(b=>[signature(b),architecturalPartKey(m,b)]));
 for(const c of m.colliders){let key=owners.get(signature(c));if(!key){const roof=m.roofs.find(r=>Math.abs(r.position[1]-.15-c.position[1])<.001&&c.size[1]<.2);key=roof?architecturalPartKey(m,roof):"body";}group(key).colliders.push(c);}
 const source={position:[m.origin[0],0,m.origin[1]],rotation:[0,m.yaw,0],scale:[1,1,1]} as ManualTransform,inv=transformMatrix(source).invert();
 return [...groups].map(([key,model])=>{
  const points=[...model.boxes,...model.profiles,...model.shapes,...model.roofs].map(p=>p.position);
  for(const v of model.volumes??[])for(const ring of v.rings)for(const [x,z]of ring)points.push([x,v.baseY+v.height/2,z]);
  for(const v of model.polygonRoofs??[])for(const ring of v.rings)for(const [x,z]of ring)points.push([x,v.baseY+v.rise/2,z]);
  for(const c of model.colliders)points.push(c.position);
  const min=new Vector3(Infinity,Infinity,Infinity),max=new Vector3(-Infinity,-Infinity,-Infinity);for(const p of points){const v=new Vector3(...p).applyMatrix4(inv);min.min(v);max.max(v);}const pivot=points.length?min.add(max).multiplyScalar(.5).toArray():[0,0,0];
  return {id:model.id,parentId:m.id,name:labels[key]??key,source:m.editorPartSources?.[model.id]??{position:pivot as [number,number,number],rotation:[0,0,0],scale:[1,1,1]},model,colliderCount:model.colliders.length};
 });
}
