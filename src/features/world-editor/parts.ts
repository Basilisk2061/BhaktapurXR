import {Vector3} from "three";
import type {CentralModel} from "../../game/architecture/central-model.ts";
import type {SolidBox} from "../../game/architecture/geometry.ts";
import {transformMatrix,type ManualTransform} from "./transforms.ts";
export interface ArchitecturalPart {id:string;parentId:string;name:string;source:ManualTransform;model:CentralModel;colliderCount:number}
type Piece={role:string;position?:[number,number,number];yaw?:number};
const labels:Record<string,string>={"lower-left-elephant":"Lower left elephant","lower-right-elephant":"Lower right elephant","upper-left-guardian":"Upper left guardian","upper-right-guardian":"Upper right guardian","left-pier":"Left massive bell pier","right-pier":"Right massive bell pier",suspension:"Bell suspension",terrace:"Raised bell terrace",shaft:"Column shaft",capital:"Decorated lotus capital",statue:"Seated royal figure",pole:"Parasol pole",umbrella:"Parasol canopy","left-post":"Left stone bell post","right-post":"Right stone bell post",crosspiece:"Carved stone crosspiece",guardians:"Temple stair guardians","museum-entrance-door":"Museum entrance / carved doorway and nearby windows","museum-entrance-sign":"National Art Museum sign","museum-entrance-lions":"Museum guardian lions / plinths","museum-entrance-figures":"Museum carved side figures / bases","gate-frame":"Gate frame / main decorative architecture",masonry:"Palace wall / gate masonry behind frame",canopy:"Golden Gate swept canopy",ornament:"Summit / upper ornament",plinth:"Plinth / platform",stairs:"Access stairs / landing",body:"Structural body",facade:"Timber facade / openings",roof:"Roof / eaves","pagoda-platform":"Pagoda platform","pavilion-platform":"Pavilion brick plinth","pavilion-stone-cap":"Pavilion stone cap","veranda-platform":"Veranda platform","main-terrace":"Main raised terrace","secondary-terrace":"Secondary pavilion/veranda terrace","pagoda-terrace":"Pagoda terrace","stone-slabs":"Stone coping / slabs","access-steps":"Terrace access steps",gallery:"Upper timber gallery",return:"Palace west return",windows:"Palace window / timber gallery band",arcade:"Gallery pale arcade / upper rooms",shikhara:"Shikhara tower",columns:"Pavilion columns",lower:"Lower open pavilion",upper:"Upper pavilion"};
/** Existing procedural roles are grouped, never split into individual mesh primitives. */
export function architecturalPartKey(m:CentralModel,p:Piece):string{
 const r=p.role;
 if(m.id==="terrace:khauma-pavilion")return r.startsWith("pavilion-stone-cap")?"pavilion-stone-cap":r.startsWith("pavilion-platform")?"pavilion-platform":r.startsWith("veranda-platform")?"veranda-platform":"pagoda-platform";
 if(r.startsWith("school-"))return /left-guardian/.test(r)?"left-guardian":/right-guardian/.test(r)?"right-guardian":/left-relief/.test(r)?"left-relief":/right-relief/.test(r)?"right-relief":/pedestal/.test(r)?"pedestals":/central-gate|sign-board/.test(r)?"central-gate":/roof/.test(r)?"roof":"wall";
 if(m.id==="entrance:khauma-raised-veranda")return /platform/.test(r)?"plinth":/posts/.test(r)?"columns":/roof|trim/.test(r)?"roof":/beam|door/.test(r)?"veranda":"body";
 if(m.id==="silu-mahadev"&&/^silu-(platform|stairs|entrance|subsidiary|main-shikhara|cornices|finial|lower-sanctuary)/.test(r))return /platform/.test(r)?"plinth":/stairs/.test(r)?"stairs":/entrance/.test(r)?"entrance":/subsidiary/.test(r)?"subsidiary-towers":/main-shikhara/.test(r)?"main-shikhara":/cornice/.test(r)?"cornices":/finial/.test(r)?"ornament":"body";
 if(m.id==="edge:yetachapari:1160027594")return /roof|eave/.test(r)?"roof":/plinth|platform|post-base/.test(r)?"plinth":/open-bay-post|post-capital|bracket|arched-head|lower-head-band|sattal-columns|sattal-lower-bay/.test(r)?"columns":/upper|gallery-band/.test(r)?"gallery":/step/.test(r)?"stairs":"body";
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
 if(m.id==="large-bell"){
  if(r.startsWith("bell-left-pier"))return "left-pier";if(r.startsWith("bell-right-pier"))return "right-pier";
  if(r==="bell-suspension"||r==="bell-crown-hanger")return "suspension";if(r.startsWith("bell-terrace"))return "terrace";
 }
 if(m.id==="malla-column"){
  if(/parasol-stem/.test(r))return "pole";if(/parasol/.test(r))return "umbrella";if(/capital|lotus/.test(r))return "capital";if(r==="malla-shaft"||r==="malla-column-collision")return "shaft";
 }
 if(m.id==="vatsala-bell"){
  if(/hollow-bell|bell-relief-ring|bell-clapper|bell-crown-hanger|bell-suspension/.test(r))return "bell";
  if(/arch-column/.test(r))return (p.position?.[2]??m.origin[1])<m.origin[1]?"left-post":"right-post";
  if(/lintel|rosette|central-crown/.test(r))return "crosspiece";
 }
 if(m.id==="vatsala-durga"){const guardian=r.match(/^vatsala-((?:lower-(?:left|right)-elephant|upper-(?:left|right)-guardian))(?:-|$)/);if(guardian)return guardian[1];if(/stair-guardian/.test(r))return "guardians";}
 if(m.id==="large-bell"&&/hollow-bell|bell-relief-ring|bell-clapper|bell-crown-hanger|bell-suspension/.test(r))return "bell";
 if(m.id==="malla-column"&&/royal-seat|royal-figure|prayer|joined-hands|seated-knee/.test(r))return "statue";
 if(m.id==="vatsala-durga"&&/subsidiary-spire/.test(r))return "subsidiary-towers";
 if(m.id==="vatsala-durga"&&/column-foot|twelve-column|column-abacus|column-collision|columned-lobed-arch/.test(r))return "columns";
 if(m.id==="vatsala-durga")return /stair|landing/.test(r)?"stairs":/stepped-base|platform/.test(r)?"plinth":/pinnacle|finial/.test(r)?"ornament":/shikhara|spire|niche/.test(r)?"shikhara":"body";
 if(m.id==="chyasilin")return /platform|landing/.test(r)?"plinth":/stair/.test(r)?"stairs":/roof|eave/.test(r)?"roof":/finial/.test(r)?"ornament":r==="pavilion-post"?"columns":(p.position?.[1]??0)>4?"upper":"lower";
 if(/stair|access|landing/.test(r))return "stairs";
 if(/plinth|terrace|platform|stepped-base/.test(r))return "plinth";
 if(/roof|soffit|eave|strut|canopy/.test(r))return "roof";
 if(/finial|summit|parasol/.test(r))return "ornament";
 if(/window|portal|door|shutter|opening|lattice|guardian|relief|carved|photo-.*band|cornice/.test(r))return "facade";
 return "body";
}
/** Requested guardian IDs keep their existing Vatsala assembly as parent. */
export function architecturalPartId(m:CentralModel,key:string){return m.id==="vatsala-durga"&&/^(lower-(left|right)-elephant|upper-(left|right)-guardian)$/.test(key)?"vatsala/"+key:m.id+"/"+key;}
const signature=(b:SolidBox)=>JSON.stringify([b.position,b.size,b.yaw]);
export function partitionArchitecturalParts(m:CentralModel & {editorPartSources?:Record<string,ManualTransform>}):ArchitecturalPart[]{
 const groups=new Map<string,CentralModel>();
 const group=(key:string)=>{let g=groups.get(key);if(!g){g={...m,id:architecturalPartId(m,key),boxes:[],profiles:[],shapes:[],roofs:[],colliders:[],volumes:[],polygonRoofs:[]};groups.set(key,g);}return g;};
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
