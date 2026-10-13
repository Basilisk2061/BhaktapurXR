import {entranceZone,entranceRoad,entranceRoadEnds,entranceStructureEvidence} from "../../data/reconstruction/khauma-entrance.ts";
import polygonClipping from "polygon-clipping";
import type {Polygon,MultiPolygon} from "polygon-clipping";
import snapshot from "../../data/reconstruction/urban-footprints.json" with {type:"json"};
import {geographicToLocal} from "../../data/reconstruction/geographic-frame.ts";
import {squareEdgeGroups,squareEdgeEvidencePolicy,type SquareEdgeGroup} from "../../data/reconstruction/square-edge.ts";
import {urbanStreetExits} from "../../data/reconstruction/urban-enclosure.ts";
import {KHAUMA_GATE_VIEW_AXIS,gateAxisDirection} from "../../data/reconstruction/khauma-spatial-audit.ts";
import {monumentEnvelopes,rectangle,streetRectangle} from "./urban-model.ts";
import {footprintColliders} from "./geometry.ts";
import {restHouse,contextColliders} from "./urban-occupancy.ts";
import {box,shape} from "./remaining-models.ts";
import {buildSpatiallyAuditedModels} from "./spatially-audited-models.ts";
import type {CentralModel} from "./central-model.ts";
import type {Point} from "../../data/reconstruction/types.ts";
const local=([latitude,longitude]:number[]):Point=>geographicToLocal({latitude,longitude});
const area=(r:Point[])=>Math.abs(r.reduce((s,a,i)=>{const b=r[(i+1)%r.length];return s+a[0]*b[1]-a[1]*b[0]},0)/2);
const netArea=(p:MultiPolygon)=>p.reduce((s,r)=>s+area(r[0])-r.slice(1).reduce((s,h)=>s+area(h),0),0);
const bounds=(rings:Polygon)=>{const p=rings.flat();return {minX:Math.min(...p.map(p=>p[0])),maxX:Math.max(...p.map(p=>p[0])),minZ:Math.min(...p.map(p=>p[1])),maxZ:Math.max(...p.map(p=>p[1]))}};
const model=(id:string,origin:Point):CentralModel=>({id,anchorId:id,origin,yaw:0,boxes:[],profiles:[],shapes:[],roofs:[],colliders:[],accuracy:"RECONSTRUCTED_APPROXIMATE",neutral:false,volumes:[],polygonRoofs:[]});
export const immediateEdgeRegions=[[-130,-65,-31,12],[-65,16,-25,29],[16,72,-52,29],[-166,-103,-58,-17],[-35,20,29,55]] as const;
export const immediateEdgePolygons=immediateEdgeRegions.map(([a,b,c,d])=>[rectangle([(a+b)/2,(c+d)/2],b-a,d-c,0)] as Polygon);
export function immediateEdgeZone([x,z]:Point){return immediateEdgeRegions.some(([a,b,c,d])=>x>a&&x<b&&z>c&&z<d);}
function facade(m:CentralModel,rings:Polygon,g:SquareEdgeGroup){
 const edges=rings[0].slice(0,-1).map((a,i)=>{const b=rings[0][i+1],length=Math.hypot(b[0]-a[0],b[1]-a[1]);return {a,b,length,score:Math.hypot((a[0]+b[0])/2-g.publicSide[0],(a[1]+b[1])/2-g.publicSide[1])}}).filter(e=>e.length>2).sort((a,b)=>a.score-b.score);
 const e=edges[0];if(!e)return;const {a,b,length}=e,dx=(b[0]-a[0])/length,dz=(b[1]-a[1])/length,nx=dz,nz=-dx,yaw=-Math.atan2(dz,dx),bays=Math.max(1,Math.round(length/(g.style==="LOW_SHELTER"?3.8:3))),position=(t:number,offset=.14):Point=>[a[0]+(b[0]-a[0])*t+nx*offset-m.origin[0],a[1]+(b[1]-a[1])*t+nz*offset-m.origin[1]];
 // Closed timber shutters/lattice, not arbitrary black window holes. Only photographed public rhythm is detailed.
 for(let floor=0;floor<g.storeys;floor++)for(let i=0;i<bays;i++){
  const [x,z]=position((i+.5)/bays),w=Math.min(g.style==="TIMBER_BAND"?1.42:1.08,length/bays*.62),h=floor===0?1.75:1.44,y=.5+floor*g.height/g.storeys+h/2;
  box(m,x,y,z,w+.28,h+.25,.14,"timber","photo-public-opening-frame",false,yaw);
  box(m,x+nx*.11,y,z+nz*.11,w,h,.06,"shutter","photo-closed-timber-shutter",false,yaw);
  for(const side of [-1,1])box(m,x+side*w*.26*Math.cos(yaw)+nx*.15,y,z-side*w*.26*Math.sin(yaw)+nz*.15,.065,h,.07,"timber","photo-shutter-divisions",false,yaw);
  box(m,x+nx*.16,y-h/2-.13,z+nz*.16,w+.4,.13,.32,"timber","photo-projecting-window-sill",false,yaw);
  if(floor>0){shape(m,x+nx*.09,y+h/2+.08,z+nz*.09,[[-w*.55,0],[-w*.46,.13],[-w*.2,.22],[0,.3],[w*.2,.22],[w*.46,.13],[w*.55,0]],.13,"timber","photo-window-head-silhouette",yaw);}
 }
 const [x,z]=position(.5);for(let floor=1;floor<=g.storeys;floor++)box(m,x,floor*g.height/g.storeys-.15,z,length,.21,.28,"timber","photo-public-horizontal-band",false,yaw);
 if(g.style==="LOW_SHELTER")box(m,x,.27,z,length,.3,.65,"stone","photo-low-front-sitting-sill",false,yaw);
 if(g.style==="TIMBER_BAND")box(m,x+nx*.1,g.height-.48,z+nz*.1,length,.45,.24,"timber","photo-upper-gallery-band",false,yaw);
}
function finishInn(m:CentralModel){
 m.shapes=m.shapes.filter(s=>s.role!=="yetachapari-open-bracket");
 const band=m.boxes.find(b=>b.role==="yetachapari-continuous-gallery-band");if(!band)return;
 const posts=m.boxes.filter(b=>b.role==="yetachapari-open-bay-post"),yaw=band.yaw,dx=Math.cos(yaw),dz=-Math.sin(yaw);
 for(let i=0;i<posts.length-1;i++){const a=posts[i].position,b=posts[i+1].position,w=Math.hypot(b[0]-a[0],b[2]-a[2]),x=(a[0]+b[0])/2-m.origin[0],z=(a[2]+b[2])/2-m.origin[1],r=w/2;
  const arch=Array.from({length:13},(_,i)=>{const t=Math.PI-i*Math.PI/12;return [r*Math.cos(t),.06+.48*Math.sin(t)] as Point;});
  shape(m,x,2.54,z,[[-r,.65],[r,.65],[r,.06],...arch.toReversed(),[-r,.06]],.17,"timber","yetachapari-photo-open-arched-head",yaw);
  box(m,x,3.08,z,w,.16,.4,"timber","yetachapari-photo-lower-head-band",false,yaw);
 }
 for(const b of m.boxes.filter(b=>b.role==="yetachapari-upper-gallery-window")){b.material="shutter";for(const t of [-.38,0,.38])m.boxes.push({position:[b.position[0]+t*dx, b.position[1],b.position[2]+t*dz-.08],size:[.04,1.58,.07],yaw,material:"timber",role:"yetachapari-photo-timber-window-divisions"});}
}
export function buildSquareEdge(heritage=buildSpatiallyAuditedModels()){
 const masks:Polygon[]=monumentEnvelopes(heritage).map(r=>[r]);
 for(const e of urbanStreetExits)masks.push([streetRectangle(e.from,e.to,e.width+.6,10)]);
 const gate=KHAUMA_GATE_VIEW_AXIS.proposedCentre,d=gateAxisDirection;const gateStart:Point=[gate[0]-d[0]*26,gate[1]-d[1]*26],gateEnd:Point=[gate[0]+d[0]*20,gate[1]+d[1]*20];masks.push([streetRectangle(gateStart,gateEnd,5.2)]);
 for(const s of snapshot.streets){const p=s.coordinates.map(local);for(let i=0;i<p.length-1;i++)masks.push([streetRectangle(p[i],p[i+1],Number(s.tags.width)||3.2)]);}
 const entranceRing:Point[]=Array.from({length:49},(_,i)=>{const a=i*Math.PI/24;return [gate[0]+Math.cos(a)*entranceZone.radius,gate[1]+Math.sin(a)*entranceZone.radius];});
 const nearZone=polygonClipping.union(immediateEdgePolygons[0],...immediateEdgePolygons.slice(1),[entranceRing]);
 const protection=polygonClipping.union(masks[0],...masks.slice(1)),models:CentralModel[]=[],buildings:{id:string;groupId:string;classification:string;dimensionClassification:string;sourceId:string;sourceUrl:string;sourceTimestamp:string;levels:number|null;identity:string|null;adapted:boolean;footprints:MultiPolygon}[]=[],sourceConflicts:{id:string;removedArea:number}[]=[],used=new Set<string>(),nearSourceIds:string[]=[],distantSourceIds:string[]=[],omittedSourceIds:string[]=[];
 const register=(m:CentralModel,f:typeof snapshot.features[number],polygons:MultiPolygon,g:SquareEdgeGroup|null,removed:number)=>{models.push(m);buildings.push({id:m.id,groupId:g?.id??"distant-source-footprints",classification:g?.classification??"FOOTPRINT_ONLY_CONTEXT",dimensionClassification:"RECONSTRUCTED_APPROXIMATE",sourceId:f.id,sourceUrl:`https://www.openstreetmap.org/${f.kind}/${f.id}`,sourceTimestamp:f.timestamp,levels:g?.storeys??null,identity:g?.name??null,adapted:removed>.1,footprints:polygons});if(removed>.1)sourceConflicts.push({id:f.id,removedArea:removed});};
 for(const g of squareEdgeGroups)for(const sourceId of g.sourceIds){
  const f=snapshot.features.find(f=>f.id===sourceId)!;used.add(f.id);const raw=f.rings.map(r=>r.map(local)),polygons=polygonClipping.difference([raw],protection),b=bounds(raw),m=model(`edge:${g.id}:${sourceId}`,[(b.minX+b.maxX)/2,(b.minZ+b.maxZ)/2]);
  for(const rings of polygons){if(netArea([rings])<2)continue;if(g.style==="YETACHAPARI"){restHouse(m,rings);finishInn(m);continue;}
   m.volumes!.push({rings,height:g.height,baseY:0,material:"brick",role:"photo-supported-square-edge-body"});m.colliders.push(...footprintColliders({vertices:rings[0],holes:rings.slice(1)},g.height));
   m.polygonRoofs!.push({rings,baseY:g.height,rise:g.roofRise,maxEdge:1.2,material:"roof",role:"photo-supported-sloped-roof"});facade(m,rings,g);if(g.id==="khauma-north-flank")facade(m,rings,{...g,publicSide:[-130,-41]});
   for(let i=0;i<rings[0].length-1;i++){const a=rings[0][i],b=rings[0][i+1],length=Math.hypot(b[0]-a[0],b[1]-a[1]);if(length>.5){for(let floor=1;floor<g.storeys;floor++)box(m,(a[0]+b[0])/2-m.origin[0],floor*g.height/g.storeys-.13,(a[1]+b[1])/2-m.origin[1],length,.15,.18,"timber","approximate-return-floor-band",false,-Math.atan2(b[1]-a[1],b[0]-a[0]));box(m,(a[0]+b[0])/2-m.origin[0],g.height-.06,(a[1]+b[1])/2-m.origin[1],length,.2,.34,"timber","photo-continuous-eave-cornice",false,-Math.atan2(b[1]-a[1],b[0]-a[0]));}}
  }
  if(m.volumes!.length){nearSourceIds.push(f.id);register(m,f,polygons,g,netArea([raw])-netArea(polygons));}
 }
 for(const f of snapshot.features){if(used.has(f.id)||f.tags.building==="temple"||["495632745","1159652820","1160157266"].includes(f.id))continue;
  const raw=f.rings.map(r=>r.map(local)),b=bounds(raw);if(b.minX< -205||b.maxX>125||b.minZ< -155||b.maxZ>150)continue;
  // All source vertices must be outside immediate reconstructed zone. No OSM-only facade masquerades as square architecture.
  if(netArea(polygonClipping.intersection([raw],nearZone))>.01){omittedSourceIds.push(f.id);continue;}
  const polygons=polygonClipping.difference([raw],protection),m=model(`distant:${f.kind}:${f.id}`,[(b.minX+b.maxX)/2,(b.minZ+b.maxZ)/2]);m.accuracy="PLACEHOLDER";m.neutral=true;
  for(const rings of polygons){if(netArea([rings])<2)continue;m.volumes!.push({rings,height:3.2,baseY:0,material:"neutral",role:"footprint-only-distant-massing"});m.colliders.push(...contextColliders(rings,3.2));}
  if(m.volumes!.length){distantSourceIds.push(f.id);register(m,f,polygons,null,netArea([raw])-netArea(polygons));}
 }
 const entrance=model("entrance:khauma-masonry-return",[...gate]);entrance.yaw=KHAUMA_GATE_VIEW_AXIS.proposedYaw;
 // Only the short photographed right-hand sitting wall/return; no invented room or shops.
 box(entrance,7.2,.57,-.62,3.3,1.14,.55,"gateBrick","photo-inside-brick-sitting-wall",true);
 box(entrance,7.2,1.17,-.62,3.46,.12,.68,"gateBrick","photo-inside-wall-cap");
 box(entrance,7.2,2.05,-1.35,3.3,4.1,.45,"brick","photo-adjoining-masonry-return",true);
 box(entrance,7.2,3.23,-1.09,3.3,1.7,.07,"plaster","photo-pale-upper-return-face");
 const road=model("entrance:khauma-road",[...gate]),[roadStart,roadEnd]=entranceRoadEnds,roadLength=Math.hypot(roadEnd[0]-roadStart[0],roadEnd[1]-roadStart[1]);
 box(road,(roadStart[0]+roadEnd[0])/2-gate[0],.02,(roadStart[1]+roadEnd[1])/2-gate[1],entranceRoad.width,.018,roadLength,"road","photo-grey-approach-road",false,KHAUMA_GATE_VIEW_AXIS.proposedYaw);
 models.push(entrance,road);
 return {models,buildings,entranceEvidence:entranceStructureEvidence,entranceZone,sourceConflicts,groundPatches:[] as {x:number;z:number;width:number;depth:number}[],westRemovedIds:[] as string[],westPlaceholderIds:buildings.filter(b=>b.classification==="FOOTPRINT_ONLY_CONTEXT").map(b=>b.id),westernBackdropClassification:"FOOTPRINT_ONLY_CONTEXT",legacyMassingReplaced:444,nearSourceIds,distantSourceIds,omittedSourceIds,evidenceGroups:squareEdgeGroups,occupancyAudit:squareEdgeGroups,policy:squareEdgeEvidencePolicy,source:snapshot.attributionUrl};
}
