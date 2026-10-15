import {landmarkSpecifications,frozenArchitectureAnchors,specificationById,vatsalaWorkingDimensions} from "../../data/reconstruction/architecture/specifications.ts";
import {applyFit} from "../../data/reconstruction/geographic-frame.ts";
import {adoptedFit} from "../../data/reconstruction/present-day.ts";
import {openSpaces} from "../../data/reconstruction/open-spaces.ts";
import {proportionParameters as proportions} from "../../data/reconstruction/architecture/proportions.ts";
import type {SolidBox} from "./geometry.ts";
export type CentralMaterial="guardianStone"|"museumRelief"|"museumStone"|"museumSign"|"agedBrick"|"redMasonry"|"carvedTimber"|"gateBrick"|"road"|"brick"|"timber"|"stone"|"roof"|"paving"|"recess"|"gold"|"bronze"|"plaster"|"neutral"|"shutter";
export interface CentralBox extends SolidBox {material:CentralMaterial;role:string;tilt?:number}
export interface CentralProfile {position:[number,number,number];profile:[number,number][];segments:number;material:CentralMaterial;yaw:number;role:string;sculptedSurface?:{positions:number[];indices:number[]}}
export interface CentralShape {position:[number,number,number];points:[number,number][];depth:number;material:CentralMaterial;yaw:number;role:string;sculpturalBevel?:number}
export interface CentralRoof {position:[number,number,number];width:number;depth:number;rise:number;yaw:number;material:CentralMaterial;role:string;family?:"PAGODA"|"SOFFIT";innerWidth?:number;innerDepth?:number;drop?:number}
export interface CentralVolume {rings:[number,number][][];height:number;baseY:number;material:CentralMaterial;role:string}
export interface CentralPolygonRoof {rings:[number,number][][];baseY:number;rise:number;maxEdge:number;material:CentralMaterial;role:string}
export interface CentralModel {id:string;anchorId:string;origin:[number,number];yaw:number;boxes:CentralBox[];profiles:CentralProfile[];shapes:CentralShape[];roofs:CentralRoof[];colliders:SolidBox[];accuracy:string;neutral:boolean;volumes?:CentralVolume[];polygonRoofs?:CentralPolygonRoof[]}
export const centralGround={size:340,centre:[-40,0] as [number,number],surfaceY:.01,openSpaceIds:openSpaces.filter(s=>s.category!=="MONUMENT_PLATFORM").map(s=>s.id),polygons:openSpaces.map(s=>s.polygon.map(p=>applyFit(p,adoptedFit))),notes:"One continuous ground plane and collider, identical paving across frozen open-space categories; outer extent is neutral safety ground, not a new heritage boundary"};
const anchor=(id:string)=>frozenArchitectureAnchors.find(a=>a.id===id)!;
function model(id:string,neutral=false):CentralModel {const a=anchor(id),f=a.footprint,yaw=a.footprintRole==="PUBLIC_EDGE"&&f?-Math.atan2(f[1][1]-f[0][1],f[1][0]-f[0][0]):0;return {id,anchorId:id,origin:[...a.position!],yaw,boxes:[],profiles:[],shapes:[],roofs:[],colliders:[],accuracy:neutral?"PLACEHOLDER":"PHOTO_INFERRED",neutral};}
function point(m:CentralModel,x:number,y:number,z:number):[number,number,number] {const c=Math.cos(m.yaw),s=Math.sin(m.yaw);return [m.origin[0]+x*c+z*s,y,m.origin[1]-x*s+z*c];}
function box(m:CentralModel,x:number,y:number,z:number,w:number,h:number,d:number,material:CentralMaterial,role:string,collision=false,yaw=0,tilt=0){const b:CentralBox={position:point(m,x,y,z),size:[w,h,d],yaw:m.yaw+yaw,material,role,...(tilt?{tilt}:{})};m.boxes.push(b);if(collision)m.colliders.push({position:b.position,size:b.size,yaw:b.yaw});}
function profile(m:CentralModel,x:number,y:number,z:number,p:[number,number][],material:CentralMaterial,role:string,segments=16){m.profiles.push({position:point(m,x,y,z),profile:p,material,role,segments,yaw:m.yaw});}
function shape(m:CentralModel,x:number,y:number,z:number,p:[number,number][],depth:number,material:CentralMaterial,role:string){m.shapes.push({position:point(m,x,y,z),points:p,depth,material,role,yaw:m.yaw});}
function roof(m:CentralModel,x:number,y:number,z:number,w:number,d:number,rise:number,role:string,material:CentralMaterial="roof"){m.roofs.push({position:point(m,x,y,z),width:w,depth:d,rise,yaw:m.yaw,material,role});}
function steppedBase(m:CentralModel,w:number,d:number,height:number,levels:number,material:CentralMaterial="stone"){for(let i=0;i<levels;i++){const h=height/levels;box(m,0,(i+.5)*h,0,w-i*(levels>5?.09:.23),h,d-i*(levels>5?.09:.23),material,"stepped-base",true);}}
function latticeWindow(m:CentralModel,x:number,y:number,z:number,w:number,h:number,peaked=false,open=false){
 if(!open)box(m,x,y,z,w+.18,h+.2,.2,"timber","window-frame");if(!open)box(m,x,y,z+.12,w-.1,h-.08,.07,"recess","window-recess");
 for(const side of [-1,1])box(m,x+side*w/2,y,z+.19,.09,h+.3,.18,"timber","carved-jamb");
 for(const band of [-1,1])box(m,x,y+band*h/2,z+.19,w+.35,.14,.25,"timber","window-cornice");
 for(let i=1;i<7;i++)box(m,x-w/2+i*w/7,y,z+.2,.024,h,.03,"timber","window-lattice");
 for(let i=1;i<6;i++)box(m,x,y-h/2+i*h/6,z+.22,w,.027,.035,"timber","window-lattice");
 if(peaked){shape(m,x,y+h/2+.12,z+.18,[[-w*.7,0],[-w*.5,.18],[-w*.2,.26],[0,.55],[w*.2,.26],[w*.5,.18],[w*.7,0]],.16,"timber","window-torana");box(m,x,y-h/2-.15,z+.15,w+.45,.13,.4,"timber","projecting-sill");}
}
function palaceBand(m:CentralModel,w:number,z:number,bays:number){
 const projection=proportions.palace.upperProjection;
 box(m,0,7.25,z+.32,w,proportions.palace.bandHeight,.28,"timber","continuous-carved-gallery");
 box(m,0,6.24,z+.25,w,.25,.9,"timber","gallery-projected-sill");box(m,0,8.37,z+.35,w+.2,.22,.82,"timber","gallery-header");
 const pitch=w/bays,groupEnds=new Set(proportions.palace.groupModules.reduce<number[]>((ends,n)=>[...ends,(ends.at(-1)??0)+n],[]));
 for(let i=0;i<bays;i++){const x=-w/2+(i+.5)*pitch;
 latticeWindow(m,x,7.3,z+projection,pitch*.8,1.9,false);
 box(m,x,6.62,z+projection+.18,pitch*.81,.14,.18,"timber","carved-gallery-panel");
 shape(m,x,8.08,z+projection+.08,[[-pitch*.45,0],[0,.31],[pitch*.45,0]],.18,"timber","gallery-peaked-crest");
 box(m,x,5.99,z+.3,.13,.4,.85,"timber","gallery-bracket");
 if(groupEnds.has(i+1)&&i<bays-1)box(m,x+pitch/2,7.3,z+projection+.23,.13,2.15,.2,"timber","gallery-group-mullion");
 }
}
function palace(m:CentralModel,gallery:boolean){const s=specificationById[m.id],w=s.baseDimensions[0].value!,depth=5;
 box(m,0,.22,-depth/2,w,.44,depth+.35,"stone","palace-foundation",true);
 box(m,0,4.45,-depth/2,w,8.05,depth,"brick","palace-masonry",true);
 if(gallery){
  for(const y of [3.02,6.05])box(m,0,y,.08,w,.14,.3,"stone","gallery-pale-band");
  const whiteWidth=w*proportions.gallery.paleFraction,redWidth=w-whiteWidth,start=w/2-whiteWidth;
  // Reference grouping: sparse upper rooms, alternating middle openings and doors/slits below.
  const rows=[{y:1.6,centres:[.08,.26,.45,.65,.87],widths:[1.25,.7,1.35,.7,1.25],heights:[2.15,.65,2.15,.65,2.15]},
   {y:4.45,centres:[.07,.29,.46,.63,.88],widths:[1.65,.65,1.35,.65,1.5],heights:[1.6,.7,1.5,.7,1.6]},
   {y:7.2,centres:[.12,.49,.87],widths:[1.75,1.75,1.55],heights:[1.45,1.55,1.4]}];
  for(const row of rows)row.centres.forEach((fraction,i)=>latticeWindow(m,-w/2+fraction*redWidth,row.y,.13,row.widths[i],row.heights[i],false));
  box(m,start+whiteWidth/2,4.43,.09,whiteWidth,8,.2,"plaster","gallery-pale-eastern-arcade");
  for(const y of [3.28,3.51,7.97])box(m,start+whiteWidth/2,y,.25,whiteWidth+.18,.14,.44,"plaster","gallery-arcade-cornice");
  const arch=(x:number,y:number,width:number,height:number,role:string)=>shape(m,x,y,.32,([[-width/2,0],...Array.from({length:13},(_,i)=>{const angle=Math.PI-i*Math.PI/12;return [width/2*Math.cos(angle),height-width/2+width/2*Math.sin(angle)] as [number,number]}),[width/2,0]] as [number,number][]),.16,"recess",role);
  // Lower level is an open arcade: no duplicate shutters from the upper rooms.
  for(const fraction of proportions.gallery.groundArcadeFractions){const x=start+fraction*whiteWidth;arch(x,.52,1.12,2.05,"gallery-arched-opening");
   for(const side of [-1,1]){box(m,x+side*.64,1.7,.47,.11,2.36,.26,"plaster","arcade-pilaster");box(m,x+side*.64,2.7,.52,.22,.16,.32,"plaster","arcade-capital");}}
  for(const fraction of proportions.gallery.upperRoomFractions){const x=start+fraction*whiteWidth;arch(x,4.26,1.32,2.65,"gallery-upper-arched-room");
   for(const side of [-1,1])box(m,x+side*.53,5.35,.55,.38,2.1,.12,"shutter","gallery-upper-paired-shutter",false,side*.22);
   box(m,x,4.18,.47,1.6,.12,.38,"plaster","gallery-upper-window-sill");
   for(const side of [-1,1])box(m,x+side*.84,5.65,.44,.11,3.4,.2,"plaster","upper-arcade-pilaster");}
  // Simplified guardians mark gallery entrance; sculptural likeness remains approximate.
  for(const side of [-1,1]){const x=start+side*1.2;box(m,x,.45,1.2,.8,.45,1,"stone","guardian-base",true);profile(m,x,.67,1.2,[[.32,0],[.34,.6],[.23,1.25],[.3,1.6],[0,1.7]],"stone","gallery-guardian",10);}
 }else{
  box(m,0,3.04,.15,w,.32,.48,"timber","first-floor-deep-cornice");
  for(let i=0;i<11;i++){const x=-w/2+(i+.5)*w/11;latticeWindow(m,x,4.66,.16,i%2===0?1.55:.73,i%2===0?1.65:1.13,true);}
  for(let i=0;i<9;i++){const x=-w/2+(i+.5)*w/9;latticeWindow(m,x,i%3===0?1.5:1.68,.08,i%3===0?1.28:.75,i%3===0?2.35:.65,false);}
  palaceBand(m,w,0,25);
  // Explicit frozen west-return edge. Geometry joins corner, no anchor relocation.
  const ret=anchor("palace-west-return").footprint!;const rw=Math.hypot(ret[1][0]-ret[0][0],ret[1][1]-ret[0][1]);
  const r=model("palace-west-return");r.yaw=-Math.atan2(ret[1][1]-ret[0][1],ret[1][0]-ret[0][0]);
  // Return faces west; invert local normal while retaining edge and origin.
  r.yaw+=Math.PI;box(r,0,4.45,-1,rw,8.05,2,"brick","palace-west-return",true);palaceBand(r,rw,0,9);roof(r,0,8.52,-1,rw+1,3.8,1.2,"palace-return-roof");
  m.boxes.push(...r.boxes);m.roofs.push(...r.roofs);m.shapes.push(...r.shapes);m.colliders.push(...r.colliders);
 }
 roof(m,0,8.55,-2.5,w+1.8,7, gallery?1.05:1.75,"palace-main-roof");
 box(m,0,8.48,.56,w+1.5,.16,.95,"timber","palace-eaves");
 for(let i=0;i<Math.ceil(w/.85);i++)box(m,-w/2+(i+.5)*w/Math.ceil(w/.85),8.12,.6,.1,.75,1.0,"timber","roof-strut",false,0,-.4);
 for(const side of [-1,1])shape(m,side*(w/2+.8),8.56,-2.5,[[0,0],[side*.24,.55],[side*.4,.65],[side*.27,.06]],.18,"timber","roof-end-finial");
}
function gate(m:CentralModel){m.yaw=model("gate-frontage").yaw;
 for(const side of [-1,1]){box(m,side*2.75,2.65,-1.6,2.55,5.3,3.2,"brick","gate-side-masonry",true);box(m,side*.94,1.62,.31,.32,3.25,.6,"gold","gate-relief-jamb",true);for(let i=0;i<8;i++)profile(m,side*.94,.2+i*.36,.68,[[.13,0],[.16,.1],[.11,.22],[0,.28]],"gold","jamb-relief-boss",8);}
 box(m,0,4.78,-1.6,8.05,1.3,3.2,"brick","gate-brick-upper",true);
 box(m,0,3.07,.2,2.35,.23,.48,"gold","gate-lintel");
 for(const side of [-1,1])for(const inset of [0,.13])box(m,side*(1.1+inset),1.65,.8,.085,3.3,.1,"gold","gate-nested-relief-frame");
 // Lobed peaked torana, carved recess and layered metallic relief silhouette.
 const outer:[number,number][]=[[-1.42,0],[-1.5,.45],[-1.18,.95],[-.92,1.14],[-.76,1.5],[-.35,1.64],[0,1.93],[.35,1.64],[.76,1.5],[.92,1.14],[1.18,.95],[1.5,.45],[1.42,0]];
 shape(m,0,3.22,.28,outer.map(([x,y])=>[x*proportions.gate.toranaScaleX,y*proportions.gate.toranaScaleY]),proportions.gate.reliefDepth,"gold","gate-lobed-torana");
 shape(m,0,3.35,.84,outer.map(([x,y])=>[x*.77,y*.73]),.05,"bronze","gate-torana-recess");
 for(let i=0;i<11;i++){const theta=Math.PI*i/10;profile(m,1.19*Math.cos(theta),3.52+1.15*Math.sin(theta),.92,[[.12,0],[.15,.12],[.1,.25],[0,.3]],"gold","torana-relief",8);}
 profile(m,0,3.68,.98,[[.28,0],[.2,.32],[.16,.52],[.18,.7],[0,.83]],"gold","central-deity-silhouette",10);
 // Medium-scale raised relief fan: keeps the torana readable instead of an empty arch.
 shape(m,0,3.78,1.04,[[-.43,0],[-.6,.15],[-.78,.3],[-.69,.38],[-.37,.2],[-.32,.45],[-.62,.64],[-.56,.74],[-.2,.6],[0,.82],[.2,.6],[.56,.74],[.62,.64],[.32,.45],[.37,.2],[.69,.38],[.78,.3],[.6,.15],[.43,0]],.13,"gold","gate-raised-deity-relief");
 shape(m,0,4.92,.76,[[-.8,0],[-.62,.35],[-.25,.18],[0,.65],[.25,.18],[.62,.35],[.8,0]],.17,"gold","winged-garuda-crown");
 roof(m,0,5.55,proportions.gate.canopyCentreZ,6.6,2.4,.65,"golden-gate-swept-canopy","gold");
 for(const side of [-1,1])shape(m,side*3.1,5.57,proportions.gate.canopyCentreZ,[[0,0],[side*.32,.65],[side*.12,.75],[-side*.22,.2]],.15,"gold","gate-canopy-upturn");
 for(const x of [-2,-1,0,1,2])profile(m,x,6.15,proportions.gate.canopyCentreZ,[[.16,0],[.2,.2],[.09,.36],[0,.5]],"bronze","canopy-ridge-figure",8);
 roof(m,0,5.42,proportions.gate.rearRoofCentreZ,8.5,3.5,1.05,"gateway-rear-tile-roof");
}
function octagon(m:CentralModel,y:number,r:number,h:number,material:CentralMaterial,role:string){profile(m,0,y,0,[[0,0],[r,0],[r,h],[0,h]],material,role,8);}
function chya(m:CentralModel){octagon(m,0,2.7,.3,"stone","pavilion-platform");octagon(m,.3,2.53,.48,"brick","pavilion-platform");octagon(m,.78,2.65,.12,"stone","pavilion-landing");
 // Conservative compound octagonal platform, corners outside actual octagon stay open.
 for(let i=0;i<8;i++){const t=i*Math.PI/4;box(m,Math.cos(t)*1.35,.45,Math.sin(t)*1.35,1.8,.9,1.8,"stone","platform-collision-fill",true);}
 for(let i=0;i<5;i++)box(m,0,(i+1)*.18/2,3.35-i*.28,1.4,(i+1)*.18,.3,"stone","pavilion-stair",true);
 for(const tier of [0,1]){const base=tier===0?.9:proportions.chyasilin.upperBaseY,h=tier===0?proportions.chyasilin.lowerPostHeight:proportions.chyasilin.upperPostHeight,r=tier===0?2.18:1.03;
  for(let i=0;i<8;i++){const t=Math.PI/8+i*Math.PI/4,next=t+Math.PI/4,x=Math.cos(t)*r,z=Math.sin(t)*r;
   box(m,x,base+h/2,z,.15,h,.15,"timber","pavilion-post",true);
   const cx=(Math.cos(t)+Math.cos(next))*r/2,cz=(Math.sin(t)+Math.sin(next))*r/2,len=2*r*Math.sin(Math.PI/8),yaw=-t-Math.PI/8-Math.PI/2;
   box(m,cx,base+h-.1,cz,len,.18,.2,"timber","pavilion-ring-beam",false,yaw);
   box(m,cx,base+.68,cz,len,.13,.14,"timber","pavilion-railing",false,yaw);
   const savedOrigin=m.origin,savedYaw=m.yaw;m.origin=[...point(m,cx,0,cz)].filter((_,i)=>i!==1) as [number,number];m.yaw+=yaw;
   if(tier===0){for(const dx of [-.43,.43])latticeWindow(m,dx,base+1.95,.04,.65,1.35,true,true);}else latticeWindow(m,0,base+.95,.04,len*.7,1.6,false,true);
   m.origin=savedOrigin;m.yaw=savedYaw;
   box(m,x,base+h-.4,z+.1,.12,.9,.65,"timber","pavilion-eave-strut",false,t,-.5);
  }
  const roofRadius=tier===0?proportions.chyasilin.lowerRoofRadius:proportions.chyasilin.upperRoofRadius,rise=tier===0?proportions.chyasilin.lowerRoofRise:proportions.chyasilin.upperRoofRise;
  profile(m,0,base+h,0,[[0,0],[roofRadius,.02],[roofRadius,.1],[roofRadius*.93,.18],[roofRadius*.66,rise*.65],[roofRadius*.2,rise],[0,rise+.08]],"roof","octagonal-pavilion-roof",8);
  octagon(m,base+h-.08,roofRadius,.095,"timber","pavilion-eaves");
  for(let side=0;side<8;side++){const angle=side*Math.PI/4;box(m,Math.cos(angle)*roofRadius*.48,base+h+.07,Math.sin(angle)*roofRadius*.48,roofRadius*.85,.14,roofRadius*.85,"timber","pavilion-roof-collision",true,angle);}

 }
 octagon(m,proportions.chyasilin.upperFloorY,1.35,.18,"timber","pavilion-upper-floor");profile(m,0,proportions.chyasilin.finialBaseY,0,[[.12,0],[.18,.18],[.07,.35],[0,.55]],"gold","pavilion-finial",12);
}
function vatsala(m:CentralModel){const plinth=vatsalaWorkingDimensions.workingPlinth.value!,platform=.6,base=plinth+platform,p=proportions.vatsala;
 for(let i=0;i<9;i++){const h=plinth/9,w=p.baseWidth-i*(p.baseWidth-p.upperPlinthWidth)/8,d=p.baseDepth-i*(p.baseDepth-p.upperPlinthDepth)/8;box(m,0,(i+.5)*h,0,w,h,d,"stone","stepped-base",true);}
 box(m,0,plinth+.3,0,p.platformWidth,.6,p.platformDepth,"stone","vatsala-platform",true);
 // West-descending access is distinct from the south-facing sanctum.
 for(let i=0;i<17;i++){const h=(i+1)*base/17;box(m,-6.35+i*.19,h/2,0,.21,h,p.stairWidth,"stone","vatsala-west-access-stair",true);}
 box(m,-2.65,base-.09,0,1.1,.18,p.stairWidth,"stone","vatsala-west-stair-landing",true);
 box(m,0,base+1.82,0,p.sanctumWidth,3.64,p.sanctumWidth,"stone","vatsala-sanctum",true);
 for(let i=0;i<12;i++){const side=Math.floor(i/3),t=(i%3-1)*p.postSpacing;const x=side===0?t:side===1?p.postRadius:side===2?t:-p.postRadius,z=side===0?p.postRadius:side===1?t:side===2?-p.postRadius:t;
 profile(m,x,base,z,[[.24,0],[.29,.24],[.19,.4],[.17,2.85],[.3,3.02],[.34,3.2],[0,3.25]],"stone","vatsala-twelve-column",12);
 box(m,x,base+1.6,z,.42,3.2,.42,"stone","column-collision",true);
 }
 shape(m,0,base+.12,p.sanctumWidth/2+.04,[[-.54,0],[-.54,1.9],[-.36,2.15],[0,2.4],[.36,2.15],[.54,1.9],[.54,0]],.06,"recess","vatsala-south-sanctum-door");
 for(const [y,w] of [[base+3.22,4.2],[base+3.48,p.corniceWidth],[base+3.7,4.1],[base+3.9,3.85]])box(m,0,y,0,w,.18,w,"stone","vatsala-colonnade-entablature");
 const spireBase=base+4.05,spireHeight=7.0;
 // Four-sided shouldered shikhara: stepped convex taper, not conical pagoda.
 profile(m,0,spireBase,0,([[0,0],[2.65,0],[2.65,.25],[2.46,.35],[2.33,1.1],[2.15,2.1],[1.88,3.1],[1.48,4.3],[1.12,5.25],[.87,5.75],[1.02,5.86],[1.02,6.05],[.66,6.35],[0,6.35]] as [number,number][]).map(([r,y])=>[r*p.towerRadius/2.65,y*spireHeight/6.35]),"stone","vatsala-square-shikhara",4);
 for(let i=0;i<12;i++){const y=spireBase+.7+i*.43,r=(2.35-i*.12)*p.towerRadius/2.65;for(const side of [-1,1])box(m,side*r*.65,y,0,.09,.12,r*1.7,"stone","shikhara-masonry-ribs");}
 for(let level=0;level<10;level++){const y=spireBase+.6+level*.59,r=(2.4-level*.15)*p.towerRadius/2.65;for(const side of [-1,1])for(const off of [-.4,0,.4])box(m,side*r*.7,y,off*r,.1,.66,.14,"stone","shikhara-vertical-segmentation");}
 for(const side of [-1,1]){shape(m,0,spireBase+.3,side*1.7,[[-.38,0],[-.38,1.12],[0,1.48],[.38,1.12],[.38,0]],.04,"recess","shikhara-niche-shadow");profile(m,0,spireBase+.43,side*1.76,[[.16,0],[.13,.25],[.12,.45],[0,.61]],"stone","niche-figure",8);}
 for(const sx of [-1,1])for(const sz of [-1,1]){profile(m,sx*1.36,spireBase,sz*1.36,([[.52,0],[.6,.12],[.48,.3],[.4,.8],[.42,.95],[.25,1.15],[.3,1.35],[.15,1.65],[0,1.8]] as [number,number][]).map(([r,y])=>[r*p.subsidiaryScale,y*p.subsidiaryScale]),"stone","subsidiary-spire",16);}
 for(const side of [-1,1])shape(m,0,spireBase+.05,side*1.66,[[-.52,0],[-.52,1.3],[0,1.9],[.52,1.3],[.52,0]],.15,"stone","spire-projecting-niche");
 profile(m,0,spireBase+spireHeight,0,[[.64,0],[.72,.15],[.5,.26],[.57,.4],[.35,.55],[.46,.7],[.25,.9],[.33,1.02],[.12,1.21],[0,1.4]],"stone","vatsala-ringed-pinnacle",20);
 profile(m,0,15.55,0,[[.1,0],[.16,.16],[.06,.28],[0,.4]],"gold","vatsala-metal-finial",12);
}
function malla(m:CentralModel){steppedBase(m,1.25,1.25,.48,3);profile(m,0,.48,0,[[.48,0],[.48,.3],[.31,.47],[.27,5.65],[.38,5.8],[.46,5.95],[.63,6.08],[.68,6.32],[.55,6.56],[.4,6.65],[0,6.65]],"stone","malla-shaft-lotus-capital",20);
 box(m,0,3.3,0,.55,5.6,.55,"stone","column-collision",true);box(m,0,7.17,0,.8,.15,.75,"bronze","royal-seat");
 profile(m,0,7.23,0,[[.28,0],[.3,.18],[.21,.3],[.2,.73],[.12,.8],[.16,.99],[.22,1.07],[.16,1.18],[0,1.2]],"bronze","seated-royal-figure",12);
 for(const side of [-1,1])box(m,side*.2,7.75,-.16,.13,.45,.13,"bronze","prayer-arms",false,0,side*.34);
 box(m,0,8.07,-.26,.16,.2,.14,"gold","joined-hands");box(m,.48,8.18,.1,.04,1.1,.04,"bronze","royal-parasol-stem");profile(m,.48,8.68,.1,[[0,0],[.42,0],[.3,.12],[0,.2]],"bronze","royal-parasol",16);
}
function bell(m:CentralModel,small:boolean){const base=small?.45:1.15;steppedBase(m,small?1.8:2.8,small?1:2.6,base,small?2:3);
 const y=base+(small?1.05:2.6),r=small?.33:.64;
 profile(m,0,y,0,[[.04,0],[r*.9,0],[r*1.03,.12],[r,.25],[r*.78,.6],[r*.63,1.0],[r*.62,1.25],[r*.4,1.4],[.05,1.44],[.05,1.25],[r*.48,1.17],[r*.5,.72],[r*.8,.22],[.04,.15]],"bronze",small?"small-hollow-bell":"large-hollow-bell",24);
 box(m,0,y-.04,0,.055,.6,.055,"bronze","bell-clapper");
 const supportTop=small?3.3:5.1;
 box(m,0,(y+1.44+supportTop)/2,0,.045,Math.max(.05,supportTop-y-1.44),.045,"bronze","bell-suspension");
 if(small){for(const side of [-1,1])profile(m,side*.68,base,0,[[.2,0],[.24,.13],[.14,.3],[.12,2.4],[.25,2.55],[0,2.7]],"stone","bell-arch-column",12);
 for(const side of [-1,1])box(m,side*.68,1.9,0,.3,2.9,.4,"stone","arch-column-collision",true);
 shape(m,0,3.12,0,[[-.97,0],[-.97,.55],[-.67,.7],[-.36,.58],[0,.78],[.36,.58],[.67,.7],[.97,.55],[.97,0],[.47,0],[.36,.18],[0,.32],[-.36,.18],[-.47,0]],.38,"stone","bell-ornate-lobed-lintel");
 profile(m,0,3.78,0,[[.2,0],[.26,.08],[.13,.22],[0,.35]],"stone","arch-central-crown",12);
 }else{
 for(const x of [-1,1])for(const z of [-1,1]){box(m,x*1.02,3.17,z*.88,.44,4.04,.44,"stone","four-bell-piers",true);box(m,x*1.02,5.13,z*.88,.62,.24,.6,"stone","bell-capitals");}
 box(m,0,5.36,0,2.7,.4,2.25,"timber","bell-head-beam");roof(m,0,5.6,0,4,3.45,.65,"large-bell-tile-roof");box(m,0,5.61,0,3.6,.18,3.05,"timber","bell-roof-collision",true);
 for(const side of [-1,1])shape(m,side*1.93,5.58,0,[[0,0],[side*.2,.46],[side*.1,.58],[-side*.16,.12]],.15,"timber","bell-roof-upturn");
 for(let i=0;i<6;i++)box(m,0,(i+1)*.19/2,2.95-i*.24,1.05,(i+1)*.19,.25,"stone","bell-platform-stair",true);
 }
}
export function buildCentralModels():CentralModel[]{const models=landmarkSpecifications.map(s=>model(s.id));for(const m of models){switch(m.id){case "fifty-five-frontage":palace(m,false);break;case "gallery-frontage":palace(m,true);break;case "golden-gate":gate(m);break;case "chyasilin":chya(m);break;case "vatsala-durga":vatsala(m);break;case "malla-column":malla(m);break;case "large-bell":bell(m,false);break;case "vatsala-bell":bell(m,true);break;case "gate-frontage":break;}}
 for(const id of ["yaksheshwar","siddhi-lakshmi","silu-mahadev","rameshwar","badrinath","gopinath-krishna"]){const m=model(id,true),f=anchor(id).footprint;const w=f?Math.max(...f.map(p=>p[0]))-Math.min(...f.map(p=>p[0])):2,d=f?Math.max(...f.map(p=>p[1]))-Math.min(...f.map(p=>p[1])):2;box(m,0,.45,0,w*.8,.9,d*.8,"neutral","non-7a-neutral-massing",true);models.push(m);}return models;
}
