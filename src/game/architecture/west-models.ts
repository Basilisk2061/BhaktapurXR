import {buildPhase7Models,buildBadrinath,box,profile,shape,roof,stairs,doorway,stonePost,pinnacle} from "./remaining-models.ts";
import type {CentralModel} from "./central-model.ts";
import {westSpecificationById,westSpecifications,type WestEvidence} from "../../data/reconstruction/architecture/west-specifications.ts";

function model(s:WestEvidence):CentralModel{return {id:s.id,anchorId:s.id,origin:[...s.position],yaw:s.workingYaw,boxes:[],profiles:[],shapes:[],roofs:[],colliders:[],accuracy:s.state==="PROVISIONALLY_IDENTIFIED"?s.state:"PHOTO_INFERRED",neutral:false};}
/** Exact end-to-end diagonal connection in the face's local Y/Z plane. */
export function connectedStrut(m:CentralModel,x:number,fromY:number,fromZ:number,toY:number,toZ:number,role:string){
 const dy=toY-fromY,dz=toZ-fromZ;
 box(m,x,(fromY+toY)/2,(fromZ+toZ)/2,.15,Math.hypot(dy,dz),.16,"timber",role,false,0,Math.atan2(dz,dy));
}
function finial(m:CentralModel,x:number,y:number,h:number,role:string){
 profile(m,x,y,0,[[0,0],[.48,0],[.55,h*.1],[.42,h*.2],[.62,h*.38],[.5,h*.56],[.26,h*.65],[.32,h*.75],[.16,h*.84],[.18,h*.9],[0,h]],"stone",role,12);
 for(let i=0;i<8;i++){const angle=i*Math.PI/4;profile(m,x+Math.cos(angle)*.39,y+h*.26,Math.sin(angle)*.39,[[0,0],[.13,0],[.19,h*.14],[.12,h*.32],[0,h*.4]],"stone",role+"-lotus-petal",6);}
}
export function buildKhaumaGate():CentralModel{
 const m=model(westSpecificationById["khauma-gate"]),halfOpening=2.4,spring=3.1;
 const arch=(x:number)=>spring+1.8*Math.pow(1-Math.abs(x)/halfOpening,.5);
 for(const side of [-1,1]){
  box(m,side*3.3,3.1,0,1.8,6.2,1.65,"brick","khauma-thick-arch-pier",true);
  box(m,side*5.55,2.55,0,2.7,5.1,1.55,"brick","khauma-lower-shoulder",true);
  for(const face of [-1,1]){
   for(const y of [1.18,2.65]){
    box(m,side*5.55,y,face*.8,1.65,.86,.045,"recess","khauma-shallow-panel-recess");
    box(m,side*5.55,y,face*.84,1.51,.74,.055,"brick","khauma-panel-masonry-infill");
    for(const dy of [-.45,.45])box(m,side*5.55,y+dy,face*.87,1.86,.1,.12,"stone","khauma-panel-horizontal-trim");
   }
   const points:[number,number][]=[[-.88,0],[-.88,.25],...Array.from({length:13},(_,i)=>{const a=Math.PI-i*Math.PI/12;return [.88*Math.cos(a),.25+.66*Math.sin(a)] as [number,number];}),[.88,0]];
   shape(m,side*5.55,3.8,face*.79,points,.08,"stone","khauma-shoulder-arched-panel");
   for(const y of [1.4,3.0,4.7])box(m,side*3.3,y,face*.85,.7,.62,.08,"stone","khauma-pier-blind-panel");
  }
  for(const [y,w]of [[5.16,2.92],[5.35,3.1],[5.49,2.7]])box(m,side*5.55,y,0,w,.15,1.8,"stone","khauma-shoulder-cornice");
  finial(m,side*5.55,5.57,1.75,"khauma-side-lotus-finial");
 }
 const curve=Array.from({length:25},(_,i)=>{const x=-halfOpening+i*halfOpening/12;return [x,arch(x)] as [number,number];});
 shape(m,0,0,-.825,[...curve,[halfOpening,6.2],[-halfOpening,6.2]],1.65,"brick","khauma-pointed-arch-spandrel");
 const crown=(x:number)=>6.2+1.15*(1+Math.cos(x/4.2*Math.PI))/2;
 const top=Array.from({length:25},(_,i)=>{const x=-4.2+i*8.4/24;return [x,crown(x)] as [number,number];});
 shape(m,0,0,-.825,[[-4.2,6.15],[4.2,6.15],...top.toReversed()],1.65,"brick","khauma-curved-crowned-parapet");
 // Two curved bands follow the actual crown; no flat castle-like crenellation.
 for(const lift of [.02,.2])shape(m,0,0,-.91,[...top.map(([x,y])=>[x,y+lift] as [number,number]),...top.toReversed().map(([x,y])=>[x,y+lift+.14] as [number,number])],1.82,"stone","khauma-curved-parapet-trim");
 for(const face of [-1,1]){
  const outside=curve.map(([x,y])=>[x*1.09,y+.2] as [number,number]);
  shape(m,0,0,face*.85,[...curve,...outside.toReversed()],.12,"stone","khauma-layered-arch-ring");
 }
 // Conservative header boxes begin at/above the highest opening point in each slice.
 for(let i=0;i<12;i++){const x=-halfOpening+(i+.5)*.4,near=Math.max(0,Math.abs(x)-.2),bottom=arch(near)+.035;box(m,x,(bottom+6.2)/2,0,.4,6.2-bottom,1.6,"brick","khauma-hidden-arch-collision",true);}
 box(m,0,6.76,0,8.4,1.1,1.6,"brick","khauma-hidden-crown-collision",true);
 finial(m,0,7.53,2.25,"khauma-large-central-lotus-kalasha");return m;
}
export function buildGateAdjoiningFabric():CentralModel{
 const gate=westSpecificationById["khauma-gate"],m=model({...gate,id:"khauma-adjoining-fabric"});m.accuracy="PHOTO_INFERRED";
 for(const side of [-1,1]){
  box(m,side*9.65,1.75,-1.2,5.5,3.5,4.7,"brick","gate-adjoining-short-masonry-edge",true);
  m.roofs.push({position:[m.origin[0]+side*9.65*Math.cos(m.yaw)-1.2*Math.sin(m.yaw),3.55,m.origin[1]-side*9.65*Math.sin(m.yaw)-1.2*Math.cos(m.yaw)],width:6.2,depth:5.4,rise:.72,yaw:m.yaw,material:"roof",role:"gate-adjoining-observed-low-tiled-roof"});
  for(const x of [side*8.1,side*10.8])doorway(m,x,1.55,1.19,.74,.92,"gate-adjoining-sparse-timber-opening");
  box(m,side*9.65,3.36,1.2,5.5,.18,.3,"timber","gate-adjoining-eave-head");
 }return m;
}
function pagoda(s:WestEvidence,jagannath=false):CentralModel{
 const m=model(s),w=jagannath?5.6:6,d=jagannath?5.2:5,baseW=jagannath?8:8.4,baseD=jagannath?7.6:7.4;
 for(let i=0;i<4;i++)box(m,0,(i+.5)*.35,0,baseW-i*.32,.35,baseD-i*.24,i===3?"stone":"brick","west-pagoda-stepped-plinth",true);
 stairs(m,2.4,1.4,8,baseD/2+1.35,.245,"stone","west-pagoda-front-access");
 box(m,0,3.31,0,w,3.82,d,"brick","west-pagoda-enclosed-lower-shrine",true);
 for(let face=0;face<4;face++){
  const saved=m.yaw;m.yaw+=face*Math.PI/2;const faceWidth=face%2?d:w,faceDepth=face%2?w:d;
  for(const x of face===0?[-1.75,0,1.75]:[0])doorway(m,x,1.42,faceDepth/2+.05,x===0?1.25:.8,2.57,"west-pagoda-timber-portal");
  if(face===0&&!jagannath)for(const x of [-1.75,0,1.75])shape(m,x,3.96,faceDepth/2+.18,[[-.67,0],[-.52,.2],[-.26,.32],[0,.42],[.26,.32],[.52,.2],[.67,0]],.14,"timber","gopi-observed-portal-crown");
  for(const y of [4.35,4.63,4.93,5.13])box(m,0,y,faceDepth/2+.08,faceWidth+.42,.16,.34,"timber","west-pagoda-layered-carved-head");
  for(let i=0;i<9;i++)connectedStrut(m,-faceWidth*.44+i*faceWidth*.11,4.54,faceDepth/2+.06,5.69,(face===0||face===2?10.2:11.6)/2-.45,"west-pagoda-connected-lower-strut");
  m.yaw=saved;
 }
 roof(m,5.78,11.6,10.2,1.0,"west-pagoda-broad-lower-tile-roof");
 box(m,0,6.8,0,3.45,.12,3.15,"timber","west-pagoda-upper-chamber-support-plate");
 box(m,0,8.02,0,3.15,2.4,2.85,"brick","west-pagoda-supported-upper-chamber",true);
 for(let face=0;face<4;face++){
  const saved=m.yaw;m.yaw+=face*Math.PI/2;const faceDepth=face%2?3.15:2.85;
  doorway(m,0,7.13,faceDepth/2+.05,1.1,1.46,"west-pagoda-upper-timber-opening");
  box(m,0,9.12,faceDepth/2+.08,3.55,.23,.32,"timber","west-pagoda-upper-carved-band");
  for(const x of [-1.13,-.56,0,.56,1.13])connectedStrut(m,x,8.92,faceDepth/2+.04,9.56,(face%2?5.8:5.4)/2-.27,"west-pagoda-connected-upper-strut");
  m.yaw=saved;
 }
 roof(m,9.65,5.8,5.4,1.15,"west-pagoda-smaller-upper-tile-roof");pinnacle(m,0,10.8,0,.8,"west-pagoda-summit");return m;
}
export function buildWesternGopinath(){return pagoda(westSpecificationById["gopinath-krishna"]);}
export function buildJagannath(){return pagoda(westSpecificationById.jagannath,true);}
export function buildKedarnath():CentralModel{
 const m=model(westSpecificationById.kedarnath);
 for(let i=0;i<4;i++)box(m,0,(i+.5)*.38,0,7.6-i*.5,.38,7.4-i*.5,i===3?"stone":"brick","kedar-stepped-brick-stone-base",true);
 stairs(m,2.1,1.52,8,5,.27,"stone","kedar-frontal-platform-stair");
 box(m,0,3.37,-.4,3.5,3.7,3.5,"brick","kedar-enclosed-brick-sanctum",true);
 doorway(m,0,1.56,1.4,1.28,2.6,"kedar-prominent-central-door");
 for(const side of [-1,1]){
  box(m,side*2.04,3.23,.28,.82,3.42,2.65,"brick","kedar-projecting-frontal-mass",true);
  stonePost(m,side*2.05,1.52,1.7,2.8,"kedar-front-stone-column");
  for(let j=0;j<5;j++)box(m,side*2.05,4.46+j*.18,.65,2.05-j*.13,.16,2.4-j*.12,"brick","kedar-subsidiary-cornice");
  profile(m,side*2.05,5.31,.65,[[0,0],[1.18,0],[1.13,.2],[.99,.75],[.79,1.34],[.59,1.65],[0,1.65]],"brick","kedar-paired-subsidiary-tower",4);
  profile(m,side*2.05,6.96,.65,[[0,0],[.54,0],[.62,.2],[.45,.43],[.21,.68],[0,.78]],"roof","kedar-subsidiary-dark-cap",12);
  pinnacle(m,side*2.05,7.74,.65,.48,"kedar-subsidiary-finial");
 }
 for(let i=0;i<4;i++)box(m,0,5.1+i*.2,-.4,4.12-i*.12,.17,4.12-i*.12,"brick","kedar-horizontal-terracotta-cornice");
 const tower:[number,number][]=[[0,0],[2.42,0],[2.38,.35],[2.3,1.6],[2.13,3.4],[1.91,5.05],[1.62,6.5],[1.38,7.18],[0,7.18]];
 profile(m,0,5.88,-.4,tower,"brick","kedar-tall-ribbed-shikhara",4);
 for(let face=0;face<4;face++){const saved=m.yaw,origin=m.origin;m.origin=[origin[0]-.4*Math.sin(saved),origin[1]-.4*Math.cos(saved)];m.yaw+=face*Math.PI/2;
  for(let j=0;j<12;j++){const y=6.15+j*.56,half=1.68-j*.055;for(const fraction of [-.62,0,.62])box(m,half*fraction,y,half+.055,.13,.52,.15,"brick","kedar-vertical-terracotta-rib");}
  shape(m,0,7.6,1.39,[[-.49,0],[-.49,.75],[0,1.2],[.49,.75],[.49,0]],.16,"brick","kedar-tower-relief-pediment");
  m.yaw=saved;m.origin=origin;
 }
 for(const [y,w]of [[13.13,2.36],[13.33,2.5],[13.54,2.1]])box(m,0,y,-.4,w,.18,w,"brick","kedar-summit-cornice");
 profile(m,0,13.65,-.4,[[0,0],[1.0,0],[.85,.25],[.62,.58],[.36,.83],[0,.95]],"roof","kedar-dark-capped-summit",12);pinnacle(m,0,14.6,-.4,.65,"kedar-summit-finial");return m;
}
export function buildWesternBadrinath():CentralModel{
 const m=buildBadrinath();
 // Preserve the accepted porch and frozen anchor; articulate all four tower faces and entrance hierarchy.
 for(let face=0;face<4;face++){const saved=m.yaw,origin=m.origin;m.origin=[origin[0]-.65*Math.sin(saved),origin[1]-.65*Math.cos(saved)];m.yaw+=face*Math.PI/2;
  for(let j=0;j<9;j++){const y=5+j*.59,half=1.36-j*.063;for(const offset of [-.62,0,.62])box(m,offset*half,y,half+.05,.105,.58,.12,"brick","badri-four-face-vertical-rib");}
  m.yaw=saved;m.origin=origin;
 }
 for(const y of [1.25,3.55,3.8])box(m,0,y,.88,3.1,.12,.28,"stone","badri-articulated-door-entablature");
 for(const side of [-1,1]){box(m,side*1.28,2.66,.94,.24,2.75,.25,"brick","badri-portal-masonry-jamb");}
 return m;
}
export function repairYaksheshwar(m:CentralModel):CentralModel{
 const s=structuredClone(m);s.boxes=s.boxes.filter(b=>!b.role.includes("abstract-strut"));
 for(let face=0;face<4;face++){const saved=s.yaw;s.yaw+=face*Math.PI/2;
  for(let j=0;j<9;j++)connectedStrut(s,-2.7+j*.675,4.13,3.02,5.56,5.45,"yak-connected-lower-strut");
  for(let j=0;j<5;j++)connectedStrut(s,-1.6+j*.8,8.98,1.8,9.73,3.18,"yak-connected-upper-strut");
  s.yaw=saved;
 }return s;
}
export function buildPhase9Models():CentralModel[]{
 const replacements=[buildWesternGopinath(),buildWesternBadrinath()],ids=new Set(replacements.map(m=>m.id));
 return [...buildPhase7Models().filter(m=>!ids.has(m.id)).map(m=>m.id==="yaksheshwar"?repairYaksheshwar(m):m),...replacements,buildKhaumaGate(),buildKedarnath(),buildJagannath(),buildGateAdjoiningFabric()];
}
export const westRenderedEvidence=westSpecifications;
