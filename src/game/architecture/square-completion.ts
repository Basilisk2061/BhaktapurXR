import {correctKhaumaContext,khaumaInteriorAudit} from "./khauma-interior-correction.ts";
import editorFrames from "../../data/reconstruction/eastern-editor-frames.json" with {type:"json"};
import {correctEasternShikhara} from "./eastern-correction.ts";
import polygonClipping from "polygon-clipping";
import type {Polygon,MultiPolygon} from "polygon-clipping";
import snapshot from "../../data/reconstruction/urban-footprints.json" with {type:"json"};
import {phase9cBoundary,phase9cEvidence,phase9cZone} from "../../data/reconstruction/square-completion.ts";
import {geographicToLocal} from "../../data/reconstruction/geographic-frame.ts";
import {entranceRoadEnds} from "../../data/reconstruction/khauma-entrance.ts";

import {urbanStreetExits} from "../../data/reconstruction/urban-enclosure.ts";
import {buildPalaceFrontageModels} from "./palace-frontage-models.ts";
import {buildInsideSquareEdge} from "./inside-square-models.ts";
import {monumentEnvelopes,streetRectangle} from "./urban-model.ts";
import {contextColliders} from "./urban-occupancy.ts";
import {insideFootprint} from "./geometry.ts";
import {box,shape,profile,pinnacle,stairs} from "./remaining-models.ts";
import type {CentralModel} from "./central-model.ts";
import type {Point} from "../../data/reconstruction/types.ts";
import {partitionArchitecturalParts} from "../../features/world-editor/parts.ts";
const local=([latitude,longitude]:number[]):Point=>geographicToLocal({latitude,longitude});
const area=(r:Point[])=>Math.abs(r.reduce((s,a,i)=>{const b=r[(i+1)%r.length];return s+a[0]*b[1]-a[1]*b[0]},0)/2);
const netArea=(p:MultiPolygon)=>p.reduce((s,r)=>s+area(r[0])-r.slice(1).reduce((s,h)=>s+area(h),0),0);
const inRegion=(rings:Polygon)=>netArea(polygonClipping.intersection(rings,[phase9cBoundary]))>.01;
const bounds=(rings:Polygon)=>{const p=rings.flat();return {minX:Math.min(...p.map(p=>p[0])),maxX:Math.max(...p.map(p=>p[0])),minZ:Math.min(...p.map(p=>p[1])),maxZ:Math.max(...p.map(p=>p[1]))}};
const seed=(id:string)=>[...id].reduce((a,c)=>(a*31+c.charCodeAt(0))>>>0,0);
const fresh=(id:string,origin:Point,accuracy="RECONSTRUCTED_APPROXIMATE"):CentralModel=>({id,anchorId:id,origin,yaw:0,accuracy,neutral:false,boxes:[],profiles:[],shapes:[],roofs:[],colliders:[],volumes:[],polygonRoofs:[]});
function edges(rings:Polygon){return rings.flatMap(r=>r.slice(0,-1).map((a,i)=>{const b=r[i+1],length=Math.hypot(b[0]-a[0],b[1]-a[1]),yaw=-Math.atan2(b[1]-a[1],b[0]-a[0]);let nx=(b[1]-a[1])/length,nz=-(b[0]-a[0])/length;const mid:Point=[(a[0]+b[0])/2,(a[1]+b[1])/2];if(insideFootprint([mid[0]+nx*.1,mid[1]+nz*.1],{vertices:rings[0],holes:rings.slice(1)})){nx=-nx;nz=-nz;}return {a,b,length,yaw,nx,nz,mid};})).filter(e=>e.length>.8);}
function elevation(m:CentralModel,rings:Polygon,height:number,floors:number,variant:number,palace=false){
 const all=edges(rings),target:Point=[m.origin[0]<-80?-105:m.origin[0]>16?24:-25,0],front=all.filter(e=>e.length>2.8).sort((a,b)=>Math.hypot(a.mid[0]-target[0],a.mid[1]-target[1])-Math.hypot(b.mid[0]-target[0],b.mid[1]-target[1]));
 // All sides get eaves/bands. Near/public faces receive restrained timber depth; no identical box ring.
 for(const e of all){const x=e.mid[0]-m.origin[0],z=e.mid[1]-m.origin[1];
  box(m,x,height-.08,z,e.length,.2,.45,"carvedTimber","9c-continuous-timber-eave",false,e.yaw);
  for(let f=1;f<floors;f++)box(m,x,f*height/floors,z,e.length,.13,.2,"timber","9c-return-floor-band",false,e.yaw);
  if(palace||front.slice(0,2).includes(e)){
   const bays=Math.max(1,Math.min(palace?18:9,Math.floor(e.length/(palace?2.9:2.6))));
   for(let floor=0;floor<floors;floor++)for(let i=0;i<bays;i++){
    const t=(i+.5)/bays,x=e.a[0]+(e.b[0]-e.a[0])*t-m.origin[0]+e.nx*.11,z=e.a[1]+(e.b[1]-e.a[1])*t-m.origin[1]+e.nz*.11,y=.18+floor*height/floors+1.4,w=Math.min(1.25,e.length/bays*.6),h=floor?1.48:1.78;
    box(m,x,y,z,w+.22,h+.22,.18,"carvedTimber","9c-context-carved-window-frame",false,e.yaw);
    box(m,x+e.nx*.11,y,z+e.nz*.11,w,h,.075,variant%3===0?"shutter":"timber","9c-closed-timber-shutters",false,e.yaw);
    for(const q of [-.26,0,.26])box(m,x+q*Math.cos(e.yaw)+e.nx*.16,y,z-q*Math.sin(e.yaw)+e.nz*.16,.035,h,.05,"carvedTimber","9c-window-lattice-division",false,e.yaw);
    box(m,x,y-h/2-.1,z,w+.45,.14,.42,"carvedTimber","9c-projecting-stone-timber-sill",false,e.yaw);
    if(floor&&i%2===0)shape(m,x,y+h/2+.13,z,[[-w*.65,0],[-w*.48,.16],[0,.32],[w*.48,.16],[w*.65,0]],.12,"carvedTimber","9c-timber-window-head",e.yaw);
   }
   box(m,x,.17,z,e.length,.22,.28,"stone","9c-raised-building-threshold",false,e.yaw);
  }
 }
}
function completeExposedReturns(m:CentralModel){
 Object.assign(m,{editorPartSources:Object.fromEntries(partitionArchitecturalParts(m).map(p=>[p.id,p.source]))});
 for(const v of m.volumes??[]){const top=v.baseY+v.height;if(top<3.2)continue;const floors=Math.max(1,Math.round(top/2.8));
  for(const e of edges(v.rings).filter(e=>e.length>3))for(let floor=1;floor<floors;floor++){
   const bays=Math.min(3,Math.max(1,Math.floor(e.length/4)));for(let i=0;i<bays;i++){
    const t=(i+.5)/bays,x=e.a[0]+(e.b[0]-e.a[0])*t,z=e.a[1]+(e.b[1]-e.a[1])*t,y=floor*top/floors+1.35;
    if(m.boxes.some(b=>/window|opening|shutter/.test(b.role)&&Math.hypot(b.position[0]-x,b.position[2]-z)<1.5&&Math.abs(b.position[1]-y)<1))continue;
    box(m,x-m.origin[0]+e.nx*.11,y,z-m.origin[1]+e.nz*.11,1.12,1.45,.15,"carvedTimber","9c-inferred-return-timber-frame",false,e.yaw);
    box(m,x-m.origin[0]+e.nx*.21,y,z-m.origin[1]+e.nz*.21,.9,1.2,.065,"timber","9c-inferred-return-closed-screen",false,e.yaw);
    box(m,x-m.origin[0]+e.nx*.24,y,z-m.origin[1]+e.nz*.24,.035,1.2,.05,"carvedTimber","9c-inferred-return-mullion",false,e.yaw);
   }
  }
 }
}
function occupiedArchitecture(id:string,polygons:MultiPolygon,sourceId:string){
 const b=bounds(polygons[0]),m=fresh(id,[(b.minX+b.maxX)/2,(b.minZ+b.maxZ)/2]),s=seed(sourceId),palace=sourceId==="18962138",floors=palace?2:m.origin[0]<-80?2:s%4===0?3:2,height=palace?7.15:floors*2.75+.3+(s%3)*.12;
 m.accuracy=palace?"PLAN_INFERRED":"PHOTO_INFERRED";
 for(const rings of polygons){if(netArea([rings])<1.5)continue;
  m.volumes!.push({rings,baseY:0,height:.18,material:"stone",role:"9c-footprint-stone-base"},{rings,baseY:.18,height:height-.18,material:palace||s%2?"agedBrick":"brick",role:palace?"9c-palace-court-enclosing-range":"9c-occupied-context-brick-body"});
  const p=rings[0],u:[number,number]=[p[1][0]-p[0][0],p[1][1]-p[0][1]],v:[number,number]=[p[p.length-2][0]-p[0][0],p[p.length-2][1]-p[0][1]],w=Math.hypot(...u),d=Math.hypot(...v),rectangular=!palace&&rings.length===1&&p.length===5&&Math.abs(u[0]*v[0]+u[1]*v[1])/(w*d)<.06&&Math.hypot(p[2][0]-p[0][0]-u[0]-v[0],p[2][1]-p[0][1]-u[1]-v[1])<.2;
  if(rectangular){const along=d>w?v:u;m.roofs.push({position:[p.slice(0,4).reduce((s,p)=>s+p[0],0)/4,height,p.slice(0,4).reduce((s,p)=>s+p[1],0)/4],width:Math.max(w,d)+.28,depth:Math.min(w,d)+.28,rise:1.12+(s%3)*.16,yaw:-Math.atan2(along[1],along[0]),material:"roof",role:"9c-context-hip-roof"});}
  else m.polygonRoofs!.push({rings,baseY:height,rise:palace?1.8:1.12+(s%3)*.16,maxEdge:palace?3:3.4,material:"roof",role:"9c-connected-terracotta-roof"});
  m.colliders.push(...contextColliders(rings,height));elevation(m,rings,height,floors,s,palace);
 }
 return {m,height,floors};
}
function coveredRange(id:string,polygons:MultiPolygon){
 const b=bounds(polygons[0]),m=fresh(id,[(b.minX+b.maxX)/2,(b.minZ+b.maxZ)/2],"PROVISIONALLY_IDENTIFIED");
  // Direct photograph supersedes the provisional short-front L extrusion. Keep its mapped anchor
 // and raw source trace; reconstructed exterior extent is an approximate photographic interpretation.
 const frontage:Polygon=[[[-11,-44],[18.1,-44],[18.1,-36.5],[-11,-36.5],[-11,-44]]];
 for(const rings of [frontage]){
  m.volumes!.push({rings,baseY:0,height:.45,material:"brick",role:"sattal-plinth"},{rings,baseY:3.08,height:1.52,material:"timber",role:"sattal-upper-recessed-gallery"});
  m.colliders.push(...contextColliders(rings,.45),...contextColliders(rings,1.52).map(c=>({...c,position:[c.position[0],c.position[1]+3.08,c.position[2]] as [number,number,number]})));
  const all=edges(rings);
  // Two joined hip ranges over the mapped L-shaped arms, with deep working overhangs.
  // The previous distance-field roof under-sampled the narrow arms and flattened their silhouette.
  if(!m.roofs.length)m.roofs.push({position:[3.55,4.64,-40.25],width:30,depth:9.4,rise:1.8,yaw:0,material:"roof",role:"sattal-broad-tiled-roof"},{position:[15.65,4.655,-46.05],width:24,depth:8.5,rise:1.7,yaw:Math.PI/2,material:"roof",role:"sattal-broad-tiled-roof-return"});
  for(const e of all){const x=e.mid[0]-m.origin[0],z=e.mid[1]-m.origin[1],publicFace=e.nx>.3||e.nz>.3;
   box(m,x,3.04,z,e.length,.22,.4,"carvedTimber","sattal-lower-bay-lintel",false,e.yaw);
   box(m,x+e.nx*.65,4.57,z+e.nz*.65,e.length+.7,.24,.36,"carvedTimber","sattal-deep-eaves",false,e.yaw);
   box(m,x+e.nx*.81,4.53,z+e.nz*.81,e.length+.75,.13,.045,"shutter","sattal-photo-red-roof-border",false,e.yaw);
   if(!publicFace){box(m,x,1.75,z,e.length,2.6,.22,"agedBrick","sattal-rear-wall",true,e.yaw);continue;}
   const bays=Math.max(1,Math.round(e.length/1.75));
   // Set rear plane behind the posts; ground-level bays remain open and colliders follow walls/posts.
   box(m,x-e.nx*1.7,1.75,z-e.nz*1.7,e.length,2.6,.18,"brick","sattal-recessed-rear-wall",true,e.yaw);
   for(let i=0;i<=bays;i++){const t=(i+.05)/(bays+.1),px=e.a[0]+(e.b[0]-e.a[0])*t-m.origin[0],pz=e.a[1]+(e.b[1]-e.a[1])*t-m.origin[1];box(m,px,1.73,pz,.22,2.56,.22,"carvedTimber","sattal-columns",true);box(m,px,.53,pz,.38,.16,.38,"stone","sattal-plinth-post-foot");box(m,px,2.93,pz,.52,.16,.38,"carvedTimber","sattal-columns-capital");}
   for(let i=0;i<bays;i++){const t=(i+.5)/bays,px=e.a[0]+(e.b[0]-e.a[0])*t-m.origin[0],pz=e.a[1]+(e.b[1]-e.a[1])*t-m.origin[1],w=e.length/bays-.24;
    shape(m,px,2.64,pz,[[-w/2,0],[-w/2,.38],[w/2,.38],[w/2,0],[w*.3,.16],[0,.29],[-w*.3,.16]],.16,"carvedTimber","sattal-lower-bay-bracket",e.yaw);
    box(m,px+e.nx*.12,3.83,pz+e.nz*.12,w,.9,.1,"carvedTimber","sattal-upper-gallery-frame",false,e.yaw);
    box(m,px+e.nx*.18,3.83,pz+e.nz*.18,w-.14,.7,.04,"recess","sattal-upper-gallery-recess",false,e.yaw);
    for(const q of [-.35,0,.35])box(m,px+q*w*Math.cos(e.yaw)+e.nx*.22,3.83,pz-q*w*Math.sin(e.yaw)+e.nz*.22,.035,.7,.035,"timber","sattal-upper-gallery-screen",false,e.yaw);
   }
   // Two shallow access treads below the raised sitting edge, aligned to each public face.
   for(let j=0;j<2;j++)box(m,x+e.nx*(.55-j*.28),.075*(j+1),z+e.nz*(.55-j*.28),e.length,.15*(j+1),.3,"brick","sattal-plinth-access",true,e.yaw);
  }
 }
  // Retain a modest rear return within the mapped north arm, classified with the same uncertainty.
 const rear=polygons.flatMap(r=>r[0]).filter(([x,z])=>z< -44&&x>10);if(rear.length){const x0=Math.min(...rear.map(p=>p[0])),x1=Math.max(...rear.map(p=>p[0])),z0=Math.min(...rear.map(p=>p[1]));box(m,(x0+x1)/2-m.origin[0],.225,(z0-44)/2-m.origin[1],x1-x0,.45,-44-z0,"brick","sattal-plinth-rear-return",true);box(m,(x0+x1)/2-m.origin[0],2.52,(z0-44)/2-m.origin[1],x1-x0,4.14,-44-z0,"timber","sattal-inferred-rear-return",true);}
 Object.assign(m,{editorPartSources:editorFrames["context:9c:1159393578"]});
 return m;
}
export function buildCompletedSquareModels(){
 const models=buildPalaceFrontageModels().filter(m=>m.id!=="rameshwar").map(m=>m.id==="badrinath"?correctEasternShikhara(m):m),f=snapshot.features.find(f=>f.id==="211082585")!,rings=f.rings.map(r=>r.map(local)),b=bounds(rings),m=fresh("east:small-shikhara-unresolved",[(b.minX+b.maxX)/2,(b.minZ+b.maxZ)/2],"PROVISIONALLY_IDENTIFIED");
 // Small brick shikhara visible in restored-Silu photographs. Exact Vatsala identity remains unresolved.
 const w=Math.min(4.3,b.maxX-b.minX),d=Math.min(4.5,b.maxZ-b.minZ);for(let i=0;i<3;i++)box(m,0,(i+.5)*.16,0,w-i*.15,.16,d-i*.15,"stone","9c-small-shrine-stepped-base",true);
 box(m,0,1.84,0,2.2,2.72,2.5,"agedBrick","9c-small-shrine-brick-sanctum",true);
 for(const y of [2.8,3.02,3.22])box(m,0,y,0,2.6,.13,2.85,"agedBrick","9c-small-shrine-cornice");
 profile(m,0,3.25,0,[[0,0],[1.6,0],[1.49,.18],[1.34,.45],[1.17,1.35],[.89,2.5],[.62,3.33],[.25,3.65],[0,3.7]],"agedBrick","9c-observed-small-brick-shikhara",4);
 profile(m,0,6.95,0,[[0,0],[.52,0],[.49,.13],[.37,.3],[0,.5]],"roof","9c-small-shrine-capping-form",12);pinnacle(m,0,7.45,0,.47,"9c-small-shrine-summit");
 shape(m,0,.48,1.26,[[-.4,0],[-.4,1.55],[0,1.96],[.4,1.55],[.4,0]],.055,"recess","9c-small-shrine-closed-portal");stairs(m,1.3,.48,3,2.9,.3,"stone","9c-small-shrine-steps");
 return [...models,m];
}
export function buildCompletedSquareEdge(){
 const baseline=buildInsideSquareEdge(),heritage=buildCompletedSquareModels(),oldRaw=baseline.models.filter(m=>m.neutral&&(m.volumes??[]).some(v=>inRegion(v.rings))),rawIds=new Set(oldRaw.map(m=>m.id));
 const models=baseline.models.filter(m=>!rawIds.has(m.id)),buildings=baseline.buildings.filter(b=>!rawIds.has(b.id)),existingSources=new Set(buildings.map(b=>b.sourceId));
 const masks:Polygon[]=monumentEnvelopes(heritage).map(r=>[r]);
 for(const e of urbanStreetExits)masks.push([streetRectangle(e.from,e.to,e.width+.8,10)]);
 for(const s of snapshot.streets){const p=s.coordinates.map(local);for(let i=0;i<p.length-1;i++)masks.push([streetRectangle(p[i],p[i+1],Number(s.tags.width)||3.2)]);}
 const palace=snapshot.features.find(f=>f.id==="18962138")!;for(const h of palace.rings.slice(1))masks.push([h.map(local)]);
 for(const m of models.filter(m=>!m.neutral))for(const v of m.volumes??[])masks.push(v.rings);
 const protection=polygonClipping.union(masks[0],...masks.slice(1)),occupied:MultiPolygon[]=[];
 const candidates=snapshot.features.filter(f=>!existingSources.has(f.id)&&f.tags.building!=="temple"&&!["495632745","1159652820","1160157266"].includes(f.id)&&inRegion(f.rings.map(r=>r.map(local)))).sort((a,b)=>Number(b.id==="18962138")-Number(a.id==="18962138")||Number(b.id==="1159393578")-Number(a.id==="1159393578")||a.id.localeCompare(b.id));
 const inventory:{id:string;sourceId:string;zone:string;before:string;action:string;after:string;classification:string;area:number}[]=[];
 for(const f of candidates){const raw=f.rings.map(r=>r.map(local)),prior=oldRaw.find(m=>m.id.endsWith(":"+f.id)),oldRecord=baseline.buildings.find(b=>b.sourceId===f.id),polygons=polygonClipping.difference([raw],protection,...occupied),b=bounds(raw),origin:Point=[(b.minX+b.maxX)/2,(b.minZ+b.maxZ)/2],id=prior&&!prior.id.startsWith("distant:")?prior.id:`context:9c:${f.id}`;
  const useful=polygons.filter(r=>netArea([r])>1.5);if(!useful.length){inventory.push({id:prior?.id??id,sourceId:f.id,zone:phase9cZone(origin),before:prior?"placeholder":"missing",action:"removed / absorbed by protected existing architecture or source streets",after:"complete enough for Phase 9C",classification:"PLAN_INFERRED",area:0});continue;}
  const covered=f.id==="1159393578",result=occupiedArchitecture(id,useful,f.id),m=covered?coveredRange(id,useful):result.m;
  if(prior&&!prior.id.startsWith("distant:")){m.origin=[...prior.origin];m.yaw=prior.yaw;Object.assign(m,{editorPartSources:Object.fromEntries(partitionArchitecturalParts(prior).map(p=>[p.id,p.source]))});}
  models.push(m);occupied.push(useful);buildings.push({id:m.id,groupId:f.id==="18962138"?"9c-palace-depth":covered?"9c-eastern-covered-range":`9c-zone-${phase9cZone(origin)}`,classification:"PHOTO_DERIVED_CONTEXT",dimensionClassification:"RECONSTRUCTED_APPROXIMATE",sourceId:f.id,sourceUrl:`https://www.openstreetmap.org/${f.kind}/${f.id}`,sourceTimestamp:f.timestamp,levels:covered?2:result.floors,identity:f.id==="18962138"?"Royal Palace exterior ranges / court voids":covered?"Eastern covered range (Layku correspondence provisional)":oldRecord?.identity??null,adapted:true,footprints:useful});
  inventory.push({id,sourceId:f.id,zone:phase9cZone(origin),before:prior?"placeholder":"missing",action:covered?"reconstructed covered range (provisional)":"contextualized occupied footprint",after:"complete enough for Phase 9C",classification:m.accuracy,area:netArea(useful)});
 }
 // Every removed legacy in-scope mass must have an explicit inventory disposition.
 for(const old of oldRaw)if(!inventory.some(r=>old.id.endsWith(":"+r.sourceId)))throw new Error("Unprocessed Phase 9C placeholder: "+old.id);
 for(const m of models.filter(m=>!m.neutral&&m.id!=="context:9c:1159393578"&&(m.volumes??[]).some(v=>inRegion(v.rings))))completeExposedReturns(m);
 // No contrasting route overlay inside the square: the continuous heritage paving is sufficient.
 // Retain only the pale exterior approach, terminating exactly on the frozen gate centreline.
 const approach=models.find(m=>m.id==="entrance:khauma-road")!,outside=entranceRoadEnds[0];
 for(const b of approach.boxes){b.position=[(outside[0]+approach.origin[0])/2,b.position[1],(outside[1]+approach.origin[1])/2];b.size[2]=Math.hypot(outside[0]-approach.origin[0],outside[1]-approach.origin[1]);}
 const rawAfter=models.filter(m=>m.neutral&&(m.volumes??[]).some(v=>inRegion(v.rings))).length;
 return {...baseline,models:correctKhaumaContext(models),buildings,khaumaInteriorAudit,completionEvidence:phase9cEvidence,completionBoundary:phase9cBoundary,completionInventory:inventory,rawPlaceholdersBefore:oldRaw.length,rawPlaceholdersAfter:rawAfter,processedLegacyIds:[...rawIds],distantSourceIds:baseline.distantSourceIds.filter(id=>!oldRaw.some(m=>m.id.endsWith(":"+id))),westPlaceholderIds:[],completedSourceIds:inventory.filter(i=>i.area>0).map(i=>i.sourceId)};
}
