import polygonClipping from "polygon-clipping";
import type {Polygon,MultiPolygon} from "polygon-clipping";
import snapshot from "../../data/reconstruction/urban-footprints.json" with {type:"json"};
import {geographicToLocal} from "../../data/reconstruction/geographic-frame.ts";
import {urbanStreetExits} from "../../data/reconstruction/urban-enclosure.ts";
import {urbanOccupancyAudit,urbanArchitecturePolicy} from "../../data/reconstruction/urban-occupancy-audit.ts";
import {buildPhase9a1Models} from "./complete-monuments.ts";
import {buildWestEnclosure} from "./west-enclosure.ts";
import {monumentEnvelopes,rectangle,streetRectangle} from "./urban-model.ts";
import {footprintColliders,insideFootprint} from "./geometry.ts";
import {box,shape} from "./remaining-models.ts";
import type {CentralModel,CentralVolume} from "./central-model.ts";
import type {Point} from "../../data/reconstruction/types.ts";
import {worldSpawns} from "../world/world-mode.ts";
import {allArchitectureReviewSpawns} from "../world/urban-review.ts";
import {plazaReviewSpawns} from "../world/plaza-review.ts";
import {westReviewSpawns} from "../world/west-review.ts";
import {urbanCompleteReviewSpawns} from "../world/urban-complete-review.ts";
const local=([latitude,longitude]:number[]):Point=>geographicToLocal({latitude,longitude});
const area=(ring:Point[])=>Math.abs(ring.reduce((s,a,i)=>{const b=ring[(i+1)%ring.length];return s+a[0]*b[1]-b[0]*a[1];},0)/2);
const netArea=(polys:MultiPolygon)=>polys.reduce((s,r)=>s+area(r[0])-r.slice(1).reduce((s,h)=>s+area(h),0),0);
const bounds=(rings:Point[][])=>{const p=rings.flat(),x=p.map(p=>p[0]),z=p.map(p=>p[1]);return {minX:Math.min(...x),maxX:Math.max(...x),minZ:Math.min(...z),maxZ:Math.max(...z)};};
const empty=(id:string,origin:Point):CentralModel=>({id,anchorId:id,origin,yaw:0,boxes:[],profiles:[],shapes:[],roofs:[],colliders:[],accuracy:"SOURCE_DERIVED",neutral:false,volumes:[],polygonRoofs:[]});
export function contextColliders(rings:Polygon,height:number){
 const ring=rings[0],f={vertices:ring,holes:rings.slice(1)};
 if(rings.length===1&&ring.length===5){
  const edge=ring.slice(0,-1).map((a,i)=>({a,b:ring[i+1],length:Math.hypot(a[0]-ring[i+1][0],a[1]-ring[i+1][1])})).sort((a,b)=>b.length-a.length)[0],yaw=-Math.atan2(edge.b[1]-edge.a[1],edge.b[0]-edge.a[0]),c=Math.cos(yaw),sn=Math.sin(yaw),points=ring.map(([x,z])=>[x*c-z*sn,x*sn+z*c] as Point),b=bounds([points]),w=b.maxX-b.minX-.18,d=b.maxZ-b.minZ-.18,x=(b.minX+b.maxX)/2,z=(b.minZ+b.maxZ)/2,centre:Point=[x*c+z*sn,-x*sn+z*c];
  if(w>0&&d>0&&rectangle(centre,w,d,yaw).every(p=>insideFootprint(p,f)))return [{position:[centre[0],height/2,centre[1]] as [number,number,number],size:[w,height,d] as [number,number,number],yaw}];
 }
 return footprintColliders(f,height);
}
function palaceClosure(raw:Polygon,heritage:CentralModel[]){
 const strips:Polygon[]=[];
 for(const m of heritage.filter(m=>["gallery-frontage","fifty-five-frontage"].includes(m.id))){
  const body=m.boxes.find(b=>b.role==="palace-masonry")!,edge=rectangle([body.position[0],body.position[2]],body.size[0],body.size[2],body.yaw).slice(0,2),[a,b]=edge;
  const rearZ=(x:number)=>a[1]+(b[1]-a[1])*(x-a[0])/(b[0]-a[0]);
  const source=bounds(raw),left=Math.max(Math.min(a[0],b[0]),source.minX),right=Math.min(Math.max(a[0],b[0]),source.maxX);
  const front=(x:number)=>{const hits:number[]=[];for(let i=0;i<raw[0].length-1;i++){const p=raw[0][i],q=raw[0][i+1];if(x>=Math.min(p[0],q[0])&&x<=Math.max(p[0],q[0])&&Math.abs(q[0]-p[0])>1e-8)hits.push(p[1]+(q[1]-p[1])*(x-p[0])/(q[0]-p[0]));}return Math.max(...hits);};
  // Short closure ties the existing rear wall to the mapped palace wing. No facade or court is moved.
  if(right-left>1){const segments=12;for(let i=0;i<segments;i++){const x=left+(right-left)*i/segments,q=left+(right-left)*(i+1)/segments,z=front(x),r=front(q);if(Number.isFinite(z)&&Number.isFinite(r)&&rearZ(x)>z&&rearZ(q)>r)strips.push([[[x,rearZ(x)],[q,rearZ(q)],[q,r-.08],[x,z-.08]]]);}}
 }
 return strips.length?polygonClipping.union(raw,...strips):[raw];
}
function facades(m:CentralModel,rings:Polygon,levels:number,height:number,near:boolean){
 const ring=rings[0],b=bounds(rings),cx=(b.minX+b.maxX)/2;
 const target:Point=[cx<-80?-108:-30,5];
 const candidates=ring.slice(0,-1).map((a,i)=>{const q=ring[i+1],length=Math.hypot(q[0]-a[0],q[1]-a[1]);return {a,q,length,score:Math.hypot((a[0]+q[0])/2-target[0],(a[1]+q[1])/2-target[1])};}).filter(e=>e.length>2.3).sort((a,b)=>a.score-b.score);
 for(const edge of candidates.slice(0,1)){
  const {a,q,length}=edge,dx=(q[0]-a[0])/length,dz=(q[1]-a[1])/length,nx=dz,nz=-dx,yaw=-Math.atan2(dz,dx),bays=Math.max(1,Math.min(near?4:1,Math.floor(length/(near?3.2:6))));
  for(let floor=near?0:levels-1;floor<levels;floor++)for(let bay=0;bay<bays;bay++){
   const t=(bay+.5)/bays,x=a[0]+(q[0]-a[0])*t-m.origin[0],z=a[1]+(q[1]-a[1])*t-m.origin[1],y=floor*height/levels+1.7,w=Math.min(1.1,length/bays*.48);
   box(m,x+nx*.03,y,z+nz*.03,w+.18,1.27,.1,"timber","source-context-timber-window",false,yaw);
   box(m,x+nx*.11,y,z+nz*.11,w,1.04,.05,"recess","source-context-window-recess",false,yaw);
   if(near)box(m,x+nx*.15,y-.64,z+nz*.15,w+.28,.1,.25,"timber","source-context-window-sill",false,yaw);
  }
 }
}
export function restHouse(m:CentralModel,rings:Polygon){
 const b=bounds(rings),cz=(b.minZ+b.maxZ)/2;
 m.volumes!.push({rings,height:.48,baseY:0,material:"brick",role:"yetachapari-source-platform"},{rings,height:3.0,baseY:3.35,material:"brick",role:"yetachapari-upper-gallery"});
 // Mapped north/public facade opens onto the museum; exact source boundary defines the rear/returns.
 const edges=rings[0].slice(0,-1).map((a,i)=>({a,b:rings[0][i+1],i,length:Math.hypot(a[0]-rings[0][i+1][0],a[1]-rings[0][i+1][1])}));
 const front=edges.filter(e=>(e.a[1]+e.b[1])/2<cz).sort((a,b)=>b.length-a.length)[0];
 if(!front)return;
 for(const e of edges)if(e.i!==front.i&&e.length>.3){const yaw=-Math.atan2(e.b[1]-e.a[1],e.b[0]-e.a[0]);box(m,(e.a[0]+e.b[0])/2-m.origin[0],1.91,(e.a[1]+e.b[1])/2-m.origin[1],e.length,2.86,.28,"brick","yetachapari-mapped-return-wall",true,yaw);}
 const count=Math.max(6,Math.round(front.length/2.7)),point=(t:number):Point=>[front.a[0]+(front.b[0]-front.a[0])*t,front.a[1]+(front.b[1]-front.a[1])*t],frontYaw=-Math.atan2(front.b[1]-front.a[1],front.b[0]-front.a[0]);
 for(let i=0;i<=count;i++){const [x,z]=point((i+.15)/(count+.3));box(m,x-m.origin[0],1.91,z+.55-m.origin[1],.3,2.86,.3,"timber","yetachapari-open-bay-post",true);box(m,x-m.origin[0],.64,z+.55-m.origin[1],.51,.3,.5,"stone","yetachapari-post-base");
  if(i<count){const [x,z]=point((i+.5)/count),pitch=front.length/count;shape(m,x-m.origin[0],2.86,z+.6-m.origin[1],[[-pitch/2,0],[-pitch/2,.49],[pitch/2,.49],[pitch/2,0],[pitch*.3,.04],[0,.34],[-pitch*.3,.04]],.15,"timber","yetachapari-open-bracket",frontYaw);}
 }
 const [fx,fz]=point(.5);box(m,fx-m.origin[0],3.25,fz+.6-m.origin[1],front.length,.3,.4,"timber","yetachapari-continuous-gallery-band",false,frontYaw);
 for(let i=0;i<count;i++){const [x,z]=point((i+.5)/count),yaw=frontYaw+Math.PI;
  box(m,x-m.origin[0],4.84,z-.1-m.origin[1],1.52,1.85,.14,"timber","yetachapari-upper-timber-frame",false,yaw);
  box(m,x-m.origin[0],4.84,z-.2-m.origin[1],1.28,1.6,.05,"recess","yetachapari-upper-gallery-window",false,yaw);
 }
 // Shallow public-facing access treads follow the actual sloping front building line.
 for(let level=0;level<3;level++){const h=(level+1)*.16,offset=.75-level*.25,dx=(front.b[0]-front.a[0])/front.length,dz=(front.b[1]-front.a[1])/front.length;
  box(m,fx-m.origin[0]+dz*offset,h/2,fz-m.origin[1]-dx*offset,front.length-.5,h,.27,"stone","yetachapari-front-access-step",true,frontYaw);
 }
 const floor=footprintColliders({vertices:rings[0],holes:rings.slice(1)},.48);m.colliders.push(...floor);
 // Roof/body follow the contributor footprint; detail corresponds only provisionally to the named inn.
 m.polygonRoofs!.push({rings,baseY:6.42,rise:1.3,maxEdge:2.2,material:"roof",role:"yetachapari-continuous-tiled-roof"});

}
export function buildUrbanOccupancy(heritage=buildPhase9a1Models()){
 const legacy=buildWestEnclosure(),masks:Polygon[]=monumentEnvelopes(heritage).map(r=>[r]);
 const exits=urbanStreetExits.map(e=>[streetRectangle(e.from,e.to,e.width+.7,9)] as Polygon);
 masks.push(...exits,[rectangle([-123,-21],6.2,46,-.0235)],[rectangle([-17,-20],2.4,30,-.039)]);
 // Preserve public spawns/review access without moving frozen coordinates. Conflicts are recorded per lot.
 const spawns=[worldSpawns.BHAKTAPUR,...Object.values(allArchitectureReviewSpawns),...Object.values(plazaReviewSpawns),...Object.values(westReviewSpawns),...Object.values(urbanCompleteReviewSpawns)].filter(s=>s.position[1]<1);
 for(const s of spawns)masks.push([rectangle([s.position[0],s.position[2]],2.4,2.4,0)]);
 const protectedGeometry=polygonClipping.union(masks[0],...masks.slice(1));
 const models:CentralModel[]=[],buildings:{id:string;groupId:string;classification:string;dimensionClassification:string;sourceId:string;sourceUrl:string;sourceTimestamp:string;levels:number;identity:string|null;adapted:boolean;removedArea:number;closureArea:number;footprints:MultiPolygon}[]=[],excluded:{id:string;reason:string}[]=[],sourceConflicts:{id:string;removedArea:number;closureArea:number}[]=[];
 for(const f of snapshot.features){
  if(f.tags.building==="temple"||["495632745","1159652820","1160157266"].includes(f.id)){excluded.push({id:f.id,reason:"Existing/provisional heritage representation; no duplicate ordinary building substituted"});continue;}
  const rings=f.rings.map(r=>r.map(local)),b=bounds(rings),centre:Point=[(b.minX+b.maxX)/2,(b.minZ+b.maxZ)/2];
  if(b.minX< -205||b.maxX>125||b.minZ< -155||b.maxZ>150){excluded.push({id:f.id,reason:"Outside limited mapped enclosure / existing ground extent"});continue;}
  const subject=f.id==="1159393576"?palaceClosure(rings,heritage):[rings],sourceArea=netArea(subject),closureArea=sourceArea-netArea([rings]),footprints=polygonClipping.difference(subject,protectedGeometry),remaining=netArea(footprints),removedArea=sourceArea-remaining;
  if(removedArea>.1||closureArea>.1)sourceConflicts.push({id:f.id,removedArea,closureArea});
  if(remaining<2){excluded.push({id:f.id,reason:"Conflicts with frozen heritage / access clearance; raw source retained"});continue;}
  const id=`mapped:${f.kind}:${f.id}`,m=empty(id,centre),isPalace=f.kind==="relation"&&f.id==="18962138"||f.id==="1159393576",isRest=f.id==="1160027594",near=centre[0]>-160&&centre[0]<70&&centre[1]>-45&&centre[1]<52,levels=f.id==="1159661606"?1:f.id==="1159661614"?2:isRest?2:isPalace?3:near?3:2,height=levels*2.8;
  if(removedArea>.1||closureArea>.1)m.accuracy="RECONSTRUCTED_APPROXIMATE";
  for(const polygon of footprints){
   if(isRest){restHouse(m,polygon);continue;}
   const v:CentralVolume={rings:polygon,height,baseY:0,material:"brick",role:isPalace?"source-palace-court-enclosure":"source-urban-masonry"};m.volumes!.push(v);
   m.polygonRoofs!.push({rings:polygon,baseY:height,rise:isPalace?1.4:1.15,maxEdge:near?3.2:5,material:"roof",role:"source-footprint-sloped-roof"});
   m.colliders.push(...contextColliders(polygon,height));
   facades(m,polygon,levels,height,near);
   if(near)for(let i=0;i<polygon[0].length-1;i++){const a=polygon[0][i],b=polygon[0][i+1],length=Math.hypot(b[0]-a[0],b[1]-a[1]);if(length>.3)box(m,(a[0]+b[0])/2-m.origin[0],height-.04,(a[1]+b[1])/2-m.origin[1],length,.16,.18,"timber","photo-inferred-context-eave-cornice",false,-Math.atan2(b[1]-a[1],b[0]-a[0]));}
  }
  models.push(m);buildings.push({id,groupId:isPalace?"royal-palace-court-wings":isRest?"yetachapari-working-correspondence":"mapped-street-fabric",classification:removedArea>.1||closureArea>.1?"RECONSTRUCTED_APPROXIMATE":"SOURCE_DERIVED",dimensionClassification:"APPROXIMATE",sourceId:f.id,sourceUrl:`https://www.openstreetmap.org/${f.kind}/${f.id}`,sourceTimestamp:f.timestamp,levels,identity:isPalace?"Royal palace courtyard enclosure":isRest?"Yetachapari (PROVISIONAL footprint correspondence)":f.tags.name??null,adapted:removedArea>.1||closureArea>.1,removedArea,closureArea,footprints});
 }
 return {models,buildings,groundPatches:[] as {x:number;z:number;width:number;depth:number}[],westRemovedIds:legacy.models.map(m=>m.id),westPlaceholderIds:[] as string[],westernBackdropClassification:"SOURCE_DERIVED",sourceConflicts,excluded,occupancyAudit:urbanOccupancyAudit,policy:urbanArchitecturePolicy,source:snapshot.attributionUrl};
}
export function insideUrbanFootprint(point:Point,polygon:Polygon){return insideFootprint(point,{vertices:polygon[0],holes:polygon.slice(1)});}
