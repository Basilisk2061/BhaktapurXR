import type {CentralModel} from "./central-model.ts";
import {buildSpatiallyAuditedModels} from "./spatially-audited-models.ts";
import {buildSquareEdge} from "./square-edge-models.ts";
import {box,shape,profile,pinnacle} from "./remaining-models.ts";
import {partitionArchitecturalParts} from "../../features/world-editor/parts.ts";
import type {ManualTransform} from "../../features/world-editor/transforms.ts";

type EditableModel=CentralModel & {editorPartSources?:Record<string,ManualTransform>};
export const insideSquareEvidence={
 palaceCornerShrine:{id:"palace-corner-shrine-unresolved",identity:"UNRESOLVED",form:"PHOTO_INFERRED",placement:"PHOTO_RELATIVE_PALACE_CORNER",dimensions:"RECONSTRUCTED_APPROXIMATE",sources:["user palace westward photograph","owner front-01 and oblique-01","Suraj Belbase palace/Golden Gate photograph, 2016"]},
 coordinateChanges:[] as string[],
 unresolvedContextGroups:["western-cluster-south","western-cluster-east-link","yetachapari-west-return"],
} as const;
const unresolvedContext=(id:string)=>insideSquareEvidence.unresolvedContextGroups.some(group=>id.startsWith(`edge:${group}:`));
/** Preserve V2 local coordinate frames even when procedural piece extents change. */
function refined(source:CentralModel):EditableModel {
 const m:EditableModel=structuredClone(source);
 m.editorPartSources=Object.fromEntries(partitionArchitecturalParts(source).map(p=>[p.id,p.source]));
 return m;
}
function palaceBase(m:CentralModel){
 const foundation=m.boxes.find(b=>b.role==="palace-foundation")!,w=foundation.size[0];
 // Three shallow, continuous stone treads against the existing raised foundation.
 for(let i=0;i<3;i++)box(m,0,(i+1)*.14/2,.84-i*.31,w,(i+1)*.14,.34,"stone","palace-front-platform-step",true);
 box(m,0,.41,.02,w,.1,.48,"stone","palace-front-platform-cap");
 box(m,0,3.21,.19,w,.12,.38,"brick","palace-brick-cornice");
 box(m,0,8.39,.66,w+.6,.12,1.05,"timber","palace-deep-eave-fascia");
}
function gallery(m:CentralModel){
 palaceBase(m);
 const face=m.boxes.find(b=>b.role==="gallery-pale-eastern-arcade")!,w=face.size[0];
 const c=Math.cos(m.yaw),s=Math.sin(m.yaw),dx=face.position[0]-m.origin[0],dz=face.position[2]-m.origin[1],centre=dx*c-dz*s;
 const removed=/gallery-upper-arched-room|gallery-upper-paired-shutter|gallery-upper-window-sill|upper-arcade-pilaster/;
 m.boxes=m.boxes.filter(b=>!removed.test(b.role));m.shapes=m.shapes.filter(b=>!removed.test(b.role));
 // Photo-proportioned room grouping, not a surveyed window census.
 for(let i=0;i<7;i++){
  const x=centre-w/2+(i+.5)*w/7,r=.67;
  const arch:[number,number][]=[[-r,0],[-r,2.05],...Array.from({length:13},(_,j)=>{const t=Math.PI-j*Math.PI/12;return [r*Math.cos(t),2.05+r*Math.sin(t)] as [number,number]}),[r,0]];
  shape(m,x,4.2,.32,arch,.14,"recess","gallery-upper-arched-room");
  // Thin plaster arch surround; the centre remains a visible dark opening.
  shape(m,x,6.22,.49,[[-.83,0],[-.83,.85],[.83,.85],[.83,0],...Array.from({length:13},(_,j)=>{const t=j*Math.PI/12;return [r*Math.cos(t),r*Math.sin(t)] as [number,number]})],.09,"plaster","gallery-upper-arcade-arch-band");
  for(const side of [-1,1])box(m,x+side*.51,5.3,.51,.42,2.04,.12,"shutter","gallery-upper-paired-shutter",false,side*.12);
  box(m,x,4.17,.5,1.66,.12,.42,"plaster","gallery-upper-window-sill");
  for(const side of [-1,1])box(m,x+side*.81,5.68,.43,.12,3.0,.2,"plaster","upper-arcade-pilaster");
 }
}
function golden(m:CentralModel){
 for(const side of [-1,1]){
  box(m,side*1.44,1.92,.06,.2,3.84,.46,"plaster","gate-side-masonry-plaster-reveal");
  box(m,side*2.77,.18,.1,2.55,.36,.62,"stone","gate-side-masonry-stone-base",true);
 }
 // Short east-facing return bridges different facade normals, without moving any anchor.
 box(m,4.0,2.65,.45,.22,5.3,1.12,"brick","gate-side-masonry-east-palace-junction",true);
 box(m,3.97,4.72,.52,.26,1.45,1.18,"plaster","gate-side-masonry-east-plaster-return");
 m.roofs.find(r=>r.role==="golden-gate-swept-canopy")!.role="phase9b-golden-gate-swept-canopy";
}
function chya(m:CentralModel){
 for(let i=0;i<8;i++){
  const t=Math.PI/8+i*Math.PI/4,n=t+Math.PI/4,r=1.03,x=(Math.cos(t)+Math.cos(n))*r/2,z=(Math.sin(t)+Math.sin(n))*r/2,len=2*r*Math.sin(Math.PI/8),yaw=-t-Math.PI/8-Math.PI/2;
  box(m,x,5.98,z,len,.7,.1,"timber","pavilion-upper-enclosed-apron",false,yaw);
  box(m,x,6.79,z,len*.75,.86,.035,"recess","pavilion-upper-recessed-timber-screen",false,yaw);
  box(m,x,7.3,z,len,.2,.13,"timber","pavilion-upper-screen-head",false,yaw);
 }
}
function cornerShrine(palace:CentralModel):CentralModel {
 const w=palace.boxes.find(b=>b.role==="palace-foundation")!.size[0],x=-w/2+.45,z=1.65,c=Math.cos(palace.yaw),s=Math.sin(palace.yaw);
 const m:CentralModel={id:"palace-corner-shrine-unresolved",anchorId:"PHOTO_RELATIVE_PALACE_CORNER",origin:[palace.origin[0]+x*c+z*s,palace.origin[1]-x*s+z*c],yaw:palace.yaw,accuracy:"PHOTO_INFERRED",neutral:false,boxes:[],profiles:[],shapes:[],roofs:[],colliders:[]};
 for(let i=0;i<3;i++)box(m,0,(i+.5)*.14,0,2.65-i*.18,.14,2.65-i*.18,"stone","corner-shrine-plinth",true);
 box(m,0,1.45,0,2.12,2.06,2.12,"brick","corner-shrine-observed-body",true);
 shape(m,0,.46,1.07,[[-.37,0],[-.37,1.24],[0,1.63],[.37,1.24],[.37,0]],.06,"recess","corner-shrine-pointed-door");
 for(const [y,w]of [[2.5,2.4],[2.69,2.6],[2.87,2.43]])box(m,0,y,0,w,.16,w,"brick","corner-shrine-cornice");
 profile(m,0,2.95,0,[[0,0],[1.63,0],[1.53,.16],[1.35,.43],[1.08,.67],[.67,.87],[.22,1.01],[0,1.04]],"roof","corner-shrine-observed-domed-roof",16);
 pinnacle(m,0,3.99,0,.38,"corner-shrine-finial");return m;
}
/** Phase 9B only: original evidence geometry/correction layers are retained for audit. */
export function buildInsideSquareModels():EditableModel[]{
 const models=buildSpatiallyAuditedModels().map(source=>{
  if(!["gallery-frontage","fifty-five-frontage","golden-gate","chyasilin","vatsala-durga"].includes(source.id))return source;
  const m=refined(source);
  if(m.id==="gallery-frontage")gallery(m);
  if(m.id==="fifty-five-frontage")palaceBase(m);
  if(m.id==="golden-gate")golden(m);
  if(m.id==="chyasilin")chya(m);
  if(m.id==="vatsala-durga"){
   const bases=m.boxes.filter(b=>b.role==="stepped-base"),lower=[...bases[0].size],upper=[...bases[8].size];
   bases.forEach((b,i)=>{const old=JSON.stringify([b.position,b.size,b.yaw]),collider=m.colliders.find(c=>JSON.stringify([c.position,c.size,c.yaw])===old),j=Math.floor(i/3)*3;
    b.size[0]=lower[0]-(lower[0]-upper[0])*j/6;b.size[2]=lower[2]-(lower[2]-upper[2])*j/6;if(collider)collider.size=[...b.size];
   });
  }
  return m;
 });
 return [...models,cornerShrine(models.find(m=>m.id==="fifty-five-frontage")!)];
}
export function buildInsideSquareEdge(){
 // Use the frozen protection masks. New decorative geometry must not reshape source footprints.
 const edge=buildSquareEdge();
 const inn=edge.models.find(m=>m.id.startsWith("edge:yetachapari:"))!;
 const m=refined(inn),posts=m.boxes.filter(b=>b.role==="yetachapari-open-bay-post");
 for(const p of posts)m.boxes.push({...p,position:[p.position[0],2.74,p.position[2]],size:[.52,.16,.5],role:"yetachapari-post-capital"});
 edge.models=edge.models.map(source=>{
  if(source.id===m.id)return m;
  if(!unresolvedContext(source.id))return source;
  const context=refined(source);context.boxes=[];context.shapes=[];context.profiles=[];context.roofs=[];context.polygonRoofs=[];context.accuracy="FOOTPRINT_ONLY_CONTEXT";context.neutral=true;
  context.volumes=context.volumes?.map(v=>({...v,height:3.2,material:"neutral",role:"unresolved-footprint-only-context"}));
  context.colliders=context.colliders.map(c=>({...c,position:[c.position[0],1.6,c.position[2]],size:[c.size[0],3.2,c.size[2]]}));
  return context;
 });
 for(const b of edge.buildings)if(unresolvedContext(b.id)){b.classification="FOOTPRINT_ONLY_CONTEXT";b.dimensionClassification="UNRESOLVED";b.levels=null;b.identity=null;}
 edge.westPlaceholderIds=edge.buildings.filter(b=>b.classification==="FOOTPRINT_ONLY_CONTEXT").map(b=>b.id);
 return edge;
}
