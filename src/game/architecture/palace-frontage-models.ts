import type {CentralModel,CentralBox} from "./central-model.ts";
import {buildInsideSquareModels} from "./inside-square-models.ts";
import {partitionArchitecturalParts} from "../../features/world-editor/parts.ts";
import {transformMatrix,type ManualTransform} from "../../features/world-editor/transforms.ts";
import {Vector3} from "three";
import {refineMuseumEntrance} from "./museum-entrance.ts";
import {box,shape,profile,pinnacle} from "./remaining-models.ts";

export const palaceTruthEvidence={
 entrance:{id:"khauma-gate",mapName:"Old Town Entrance Gate",localName:"Khauma / west square entrance",classification:"IDENTITY_RECONCILED",identityConfidence:"HIGH",spatialAccuracy:"APPROXIMATE",sameStructure:true,royalGate:false,sources:["Digital Himalaya labelled plan","Commons Old Town Entrance Gate file/category","Bhaktapur.com Khauma western entrance","DOA/UNESCO 2018"]},
 royalGate:{id:"golden-gate",mapName:"Golden Gate",localName:"Lu Dhwaka",royalGate:true,classification:"PHOTO_INFERRED"},
 establishedTransformChanges:[] as string[],
 modelRefinements:{
  gallery:{previousPaleFraction:.28,workingPaleFraction:.38,paleEaveY:7.4,westernEaveY:8.55,accuracy:"PHOTO_PROPORTION"},
  goldenGate:{workingRedBodyWidth:4.88,workingPaleBackingWidth:9.25,canopyWidth:5.6,canopyDepth:2.6,accuracy:"PHOTO_INFERRED"},
  largeBell:{previousWorkingTop:6.25,workingTop:4.975,verticalFactorAbovePlatform:.75,accuracy:"RECONSTRUCTED_APPROXIMATE"},
  column:{capitalMaterial:"BRONZE",previousWorkingTop:8.88,workingTop:9.05,accuracy:"PHOTO_INFERRED"},
  shrine:{identity:"UNRESOLVED",form:"OCTAGONAL_RED_BODY_CURVED_ROOF",accuracy:"PHOTO_INFERRED"},
 },
 modelAccuracy:"PHOTO_INFERRED / RECONSTRUCTED_APPROXIMATE",
} as const;
const signature=(p:{position:number[];size:number[];yaw:number})=>JSON.stringify([p.position,p.size,p.yaw]);
function withdraw(m:CentralModel,predicate:(p:CentralBox)=>boolean){const gone=new Set(m.boxes.filter(predicate).map(signature));m.boxes=m.boxes.filter(p=>!predicate(p));m.colliders=m.colliders.filter(p=>!gone.has(signature(p)));}
function local(m:CentralModel,p:[number,number,number]){const c=Math.cos(m.yaw),s=Math.sin(m.yaw),x=p[0]-m.origin[0],z=p[2]-m.origin[1];return [x*c-z*s,p[1],x*s+z*c] as [number,number,number];}
function gallery(m:CentralModel){
 const foundation=m.boxes.find(p=>p.role==="palace-foundation")!,width=foundation.size[0]*.38,centre=foundation.size[0]/2-width/2;
 // Split the lower pale wing from the taller western gallery: keep the
 // approved west return and its eave supported, rather than lowering it wholesale.
 const redWidth=foundation.size[0]-width,start=centre-width/2;
 withdraw(m,p=>p.role==="palace-masonry");
 box(m,-width/2,4.45,-2.5,redWidth,8.05,5,"brick","palace-masonry-west",true);
 box(m,centre,3.865,-2.5,width,6.88,5,"brick","palace-masonry-pale-wing",true);
 const world=(x:number,y:number,z:number):[number,number,number]=>[m.origin[0]+x*Math.cos(m.yaw)+z*Math.sin(m.yaw),y,m.origin[1]-x*Math.sin(m.yaw)+z*Math.cos(m.yaw)];
 const roof=m.roofs.find(p=>p.role==="palace-main-roof")!;roof.position=world(-width/2,8.55,-2.5);roof.width=redWidth+1.8;
 m.roofs.push({...roof,position:world(centre,7.4,-2.5),width:width+1.5,role:"palace-main-roof-pale-wing"});
 for(const p of m.boxes){
  if(p.role.startsWith("gallery-west-return-photo-"))continue;
  if(["palace-eaves","palace-deep-eave-fascia","gallery-pale-band"].includes(p.role)){const q=local(m,p.position);p.position=world(-width/2,q[1],q[2]);p.size[0]=redWidth+(p.role.includes("eave")?1.5:0);}
  if(p.role==="roof-strut"&&local(m,p.position)[0]>start)p.position[1]-=1.15;
 }
 for(const p of m.shapes)if(p.role==="roof-end-finial"&&local(m,p.position)[0]>start)p.position[1]-=1.15;
 box(m,centre,7.31,.56,width+1.5,.18,1.05,"carvedTimber","palace-pale-wing-eaves");
 const pale=/gallery-pale-eastern|gallery-arcade-cornice|arcade-pilaster|arcade-capital|upper-arcade|gallery-upper/;
 withdraw(m,p=>pale.test(p.role));m.shapes=m.shapes.filter(p=>!pale.test(p.role)&&p.role!=="gallery-arched-opening");
 box(m,centre,5.45,.12,width,3.45,.22,"plaster","gallery-pale-upper-wall");
 box(m,centre,1.94,.13,width,3.02,.22,"plaster","gallery-pale-lower-wall");
 for(const y of [3.43,3.66])box(m,centre,y,.31,width+.1,.14,.42,"plaster","gallery-arcade-cornice");
 for(let i=0;i<7;i++){
  const x=centre-width/2+(i+.5)*width/7,r=.69;
  // Blind plaster panel above a RECTANGULAR shutter: no oversized open arch head.
  shape(m,x,6.14,.38,[[-r,0],...Array.from({length:13},(_,j)=>{const t=Math.PI-j*Math.PI/12;return [r*Math.cos(t),.12+.55*Math.sin(t)] as [number,number]}),[r,0]],.07,"plaster","gallery-upper-blind-arched-panel");
  for(const side of [-1,1])box(m,x+side*.285,5.02,.39,.54,2.36,.09,"shutter","gallery-upper-paired-shutter");
  for(let j=0;j<13;j++)box(m,x,3.95+j*.17,.445,1.1,.035,.03,"shutter","gallery-upper-shutter-slats");
  box(m,x,3.79,.36,1.43,.11,.3,"plaster","gallery-upper-window-sill");
  for(const side of [-1,1])box(m,x+side*.73,5.13,.3,.16,2.78,.17,"plaster","upper-arcade-pilaster");
  const timberBay=i<5;
  box(m,x,1.66,.39,timberBay?1.47:.86,timberBay?2.28:1.09,.1,"recess","gallery-arcade-lower-opening");
  if(timberBay){for(const side of [-1,1])box(m,x+side*.75,1.69,.48,.17,2.38,.18,"carvedTimber","gallery-arcade-lower-door-post");box(m,x,2.92,.46,1.7,.22,.27,"carvedTimber","gallery-arcade-lower-timber-head");for(const side of [-1,1])box(m,x+side*.34,1.66,.46,.61,2.12,.055,"carvedTimber","gallery-arcade-lower-door-leaf");}
  else shape(m,x,2.18,.41,[[-.53,0],[-.53,.45],[0,.63],[.53,.45],[.53,0]],.07,"plaster","gallery-arcade-small-arched-panel");
 }
 box(m,centre-2.7,3.13,.45,width*.7,.26,.4,"carvedTimber","gallery-arcade-lower-continuous-timber-band");
}
function golden(m:CentralModel){
 withdraw(m,p=>/gate-side-masonry|gate-brick-upper/.test(p.role));
 // Red gate surround touches nested metal frame, while pale side/upper walls
 // connect the Gallery and 55 Palace. The true aperture remains open through depth.
 for(const side of [-1,1]){
  box(m,side*1.84,2.7,-.35,1.2,5.4,1.8,"redMasonry","gate-side-masonry-red-body",true);
  box(m,side*2.82,1.7,-.3,4.0,3.4,.65,"plaster","gate-side-masonry-adjoining-palace",true);
  box(m,side*1.84,.14,.7,1.29,.28,.9,"stone","gate-side-masonry-stone-base",true);
  shape(m,side*1.84,1.08,.585,Array.from({length:25},(_,i)=>{const a=i*Math.PI/12;return [.28*Math.cos(a),.58+.58*Math.sin(a)] as [number,number]}),.045,"bronze","gate-side-masonry-inscription-tablet");
 }
 box(m,0,4.5,-.35,4.88,1.9,1.8,"redMasonry","gate-brick-upper-red-body",true);
 box(m,0,5.37,-.38,9.25,3.94,.7,"plaster","gate-brick-upper-palace-backing",true);
 box(m,4,4.38,.75,.28,5.95,1.6,"plaster","gate-side-masonry-east-palace-junction",true);
 box(m,0,.055,-.37,1.55,.11,1.75,"stone","gate-side-masonry-threshold",true);
 box(m,0,7.31,-.38,9.4,.18,1.15,"carvedTimber","gateway-rear-tile-roof-eave-band");
 // Documented small upper shutter in the white transition beside the gate.
 box(m,2.86,6.18,.05,1.01,1.52,.09,"shutter","gate-side-masonry-upper-palace-shutter");
 const roof=m.roofs.find(r=>r.role==="phase9b-golden-gate-swept-canopy")!;roof.width=5.6;roof.depth=2.6;roof.rise=.6;roof.position=[m.origin[0]+.55*Math.sin(m.yaw),5.6,m.origin[1]+.55*Math.cos(m.yaw)];
 box(m,0,5.49,.55,5.5,.17,2.48,"carvedTimber","canopy-dark-eave-band");
 box(m,0,5.6,1.87,5.6,.14,.14,"gold","canopy-gilded-front-edge");
 const rear=m.roofs.find(r=>r.role==="gateway-rear-tile-roof")!;rear.position[1]=7.4;rear.width=9.7;rear.depth=4.4;rear.rise=.85;rear.position=[m.origin[0]-1.35*Math.sin(m.yaw),7.4,m.origin[1]-1.35*Math.cos(m.yaw)];
 for(const p of m.shapes.filter(p=>p.role==="gate-canopy-upturn")){const q=local(m,p.position);const c=Math.cos(m.yaw),s=Math.sin(m.yaw),x=Math.sign(q[0])*2.68;p.position=[m.origin[0]+x*c+.55*s,5.61,m.origin[1]-x*s+.55*c];p.points=p.points.map(([x,y])=>[x*.8,y*.7]);}
 for(const p of m.profiles.filter(p=>p.role==="canopy-ridge-figure")){const q=local(m,p.position),c=Math.cos(m.yaw),s=Math.sin(m.yaw);p.position=[m.origin[0]+q[0]*c+.15*s,6.14,m.origin[1]-q[0]*s+.15*c];p.material="gold";}
 box(m,0,6.0,.15,4.5,.28,.17,"gold","canopy-upper-ornament-rail");
 box(m,0,6.185,.15,.48,.09,.4,"gold","winged-garuda-summit-base");
 pinnacle(m,0,6.23,.15,1.0,"winged-garuda-canopy-summit");
}
function shrine(m:CentralModel){
 for(const [i,p]of m.boxes.filter(p=>p.role==="corner-shrine-plinth").entries()){const old=signature(p),c=m.colliders.find(c=>signature(c)===old);p.size[0]=p.size[2]=3.2-i*.15;if(c)c.size=[...p.size];}
 const body=m.boxes.find(p=>p.role==="corner-shrine-observed-body")!;
 withdraw(m,p=>p.role==="corner-shrine-observed-body"||p.role==="corner-shrine-cornice");
 profile(m,0,.42,0,[[0,0],[1.5,0],[1.5,2.06],[0,2.06]],"redMasonry","corner-shrine-observed-body",8);
 // Inscribed cuboid body collision; no retained square corners outside the octagon.
 box(m,0,body.position[1],0,1.9,body.size[1],1.9,"redMasonry","corner-shrine-body-collision",true);
 for(const [y,r]of [[2.5,1.47],[2.69,1.61],[2.87,1.48]])profile(m,0,y-.08,0,[[0,0],[r,0],[r,.16],[0,.16]],"redMasonry","corner-shrine-cornice",8);
 const door=m.shapes.find(p=>p.role==="corner-shrine-pointed-door")!,c=Math.cos(m.yaw),s=Math.sin(m.yaw);door.position=[m.origin[0]+1.395*s,.46,m.origin[1]+1.395*c];door.points=[[-.37,0],[-.37,1.12],[-.3,1.32],[-.18,1.48],[0,1.58],[.18,1.48],[.3,1.32],[.37,1.12],[.37,0]];door.role="corner-shrine-observed-arched-door";
}
function bellProportion(m:CentralModel){
 const base=1.15,remap=(y:number)=>base+(y-base)*.75,updates=new Map<string,{position:[number,number,number];size:[number,number,number]}>();
 for(const p of m.boxes){if(p.position[1]+p.size[1]/2<=base+.01)continue;const old=signature(p);p.position[1]=remap(p.position[1]);p.size[1]*=.75;updates.set(old,{position:[...p.position],size:[...p.size]});}
 for(const p of m.colliders){const updated=updates.get(signature(p));if(updated){p.position=updated.position;p.size=updated.size;}}
 for(const p of m.profiles){p.position[1]=remap(p.position[1]);p.profile=p.profile.map(([r,y])=>[r,y*.75]);}
 for(const p of m.shapes){p.position[1]=remap(p.position[1]);p.points=p.points.map(([x,y])=>[x,y*.75]);}
 for(const p of m.roofs){p.position[1]=remap(p.position[1]);p.rise*=.75;}
}
function columnMaterial(m:CentralModel){
 const shaft=m.profiles.find(p=>p.role==="malla-shaft-lotus-capital")!;
 shaft.profile=shaft.profile.filter(([,y])=>y<=5.65);shaft.profile.push([0,5.65]);
 profile(m,0,6.13,0,[[0,0],[.27,0],[.38,.15],[.46,.3],[.63,.43],[.68,.67],[.55,.91],[.4,1],[0,1]],"bronze","malla-metal-lotus-capital",20);
 const parasol=m.profiles.find(p=>p.role==="royal-parasol")!;parasol.position[1]=8.55;parasol.profile=[[0,0],[.44,0],[.42,.07],[.34,.17],[.35,.23],[.25,.31],[.2,.39],[.13,.43],[0,.5]];
}
/** Source geometry refinement, not a manual transform baked into evidence coordinates. */
export function buildPalaceFrontageModels(){return buildInsideSquareModels().map(source=>{
 if(!["gallery-frontage","golden-gate","fifty-five-frontage","palace-corner-shrine-unresolved","large-bell","malla-column"].includes(source.id))return source;
 const m=structuredClone(source) as CentralModel & {editorPartSources:Record<string,ManualTransform>};
 m.editorPartSources=Object.fromEntries(partitionArchitecturalParts(source).map(p=>[p.id,p.source]));
 if(m.id==="gallery-frontage"){gallery(m);refineMuseumEntrance(m);}
 if(m.id==="large-bell")bellProportion(m);
 if(m.id==="malla-column")columnMaterial(m);
 if(m.id==="golden-gate")golden(m);
 if(m.id==="palace-corner-shrine-unresolved")shrine(m);
 if(m.id==="gallery-frontage"||m.id==="fifty-five-frontage")for(const p of [...m.boxes,...m.shapes,...m.profiles]){if(p.material==="brick")p.material="agedBrick";if(p.material==="timber")p.material="carvedTimber";}
 return m;
});}
/** Geometry projection helper used by diagnostics/tests; source matrices stay unchanged. */
export function palaceLocalPoint(m:CentralModel,p:[number,number,number]){return new Vector3(...p).applyMatrix4(transformMatrix({position:[m.origin[0],0,m.origin[1]],rotation:[0,m.yaw,0],scale:[1,1,1]}).invert()).toArray();}
