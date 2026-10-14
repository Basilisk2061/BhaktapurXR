import editorFrames from "../../data/reconstruction/eastern-editor-frames.json" with {type:"json"};
import type {CentralModel} from "./central-model.ts";
import {box,profile,pinnacle,shape,stairs,stonePost} from "./remaining-models.ts";

export const easternCorrection={identity:"Silu Mahadev / Phasi Dega",classification:"PHOTO_INFERRED",dimensions:"APPROXIMATE",oldYaw:-Math.PI/2+.074,newYaw:-.105,platform:{width:24,depth:20,height:2.1},reference:"reference/eastern-square/shikhara-sattal-reference.webp",uncertain:["Exact entrance azimuth and terrace dimensions unmeasured","Rear access and subsidiary details partly inferred","Covered-range Layku identity/source binding provisional"]} as const;
export function correctEasternShikhara(source:CentralModel):CentralModel{
 const m:CentralModel={...source,yaw:easternCorrection.newYaw,boxes:[],profiles:[],shapes:[],roofs:[],colliders:[]};
 Object.assign(m,{editorPartSources:editorFrames["silu-mahadev"]});
 // Three major terraces, not six continuous stair tiers. Central access slots stop at the landing.
 for(const [w,d,base,h]of [[24,20,0,.35],[21.8,17.8,.35,.8],[19.6,15.6,1.15,.95]]){
  const slot=3.2,flank=(w-slot)/2;for(const side of [-1,1])box(m,side*(slot+flank)/2,base+h/2,0,flank,h,d,"brick","silu-platform",true);
  box(m,0,base+h/2,(5.85-d/2)/2,slot,h,d/2+5.85,"brick","silu-platform",true);
  for(const side of [-1,1])box(m,side*(slot+flank)/2,base+h-.045,d/2,flank,.09,.28,"stone","silu-platform-coping");
 }
 stairs(m,3.15,2.1,12,9.63,.33,"brick","silu-stairs");box(m,0,2.055,5.6,3.2,.09,1,"stone","silu-stairs-landing",true);
 // Solid sanctuary, deliberately recessed front threshold. No invented accessible interior.
 box(m,0,4.45,-.2,5.1,4.7,5.5,"brick","silu-lower-sanctuary",true);
 for(const side of [-1,1]){box(m,side*2.8,4.2,2.65,.72,4.2,.8,"brick","silu-entrance-pilaster",true);box(m,side*2.4,4.4,2.9,.24,4.4,.28,"brick","silu-entrance-reveal");}
 shape(m,0,2.15,2.57,[[-.95,0],[-.95,2.65],[-.65,3.05],[0,3.3],[.65,3.05],[.95,2.65],[.95,0]],.04,"recess","silu-entrance-recess");
 box(m,0,5.75,2.8,2.6,.3,.62,"brick","silu-entrance-lintel");
 for(const x of [-3.5,3.5])for(const z of [-3.5,3.5]){
  box(m,x,2.35,z,3.15,.5,3.15,"brick","silu-subsidiary-base",true);
  for(const dx of [-1.05,1.05])for(const dz of [-1.05,1.05])stonePost(m,x+dx,2.6,z+dz,3.3,"silu-subsidiary-columns");
  for(let j=0;j<4;j++)box(m,x,6.04+j*.22,z,3.65-j*.12,.2,3.65-j*.12,"brick","silu-cornices");
  box(m,x,7.65,z,2.18,1.65,2.18,"brick","silu-subsidiary-towers");
  for(const y of [7.03,8.38,8.62])box(m,x,y,z,2.65,.18,2.65,"brick","silu-subsidiary-towers");
  for(const side of [-1,1])box(m,x+side*.62,7.65,z+1.12,.18,1.5,.12,"brick","silu-subsidiary-towers");
  shape(m,x,7.26,z+1.11,[[-.32,0],[-.32,.75],[0,.96],[.32,.75],[.32,0]],.035,"recess","silu-subsidiary-towers");
  profile(m,x,8.72,z,[[0,0],[1.95,0],[1.85,.18],[1.42,.45],[1.15,.85],[.82,1.1],[.58,1.4],[0,1.42]],"brick","silu-subsidiary-towers",4);pinnacle(m,x,10.14,z,.7,"silu-finial");
 }
 for(let j=0;j<5;j++)box(m,0,6.85+j*.26,0,7.3-j*.12,.22,7.3-j*.12,"brick","silu-cornices");
 // Tall four-sided convex tower; relief ribs follow the tapered faces instead of floating beside them.
 const levels:[[number,number],...Array<[number,number]>]=[[0,4.7],[.3,4.62],[2,4.4],[5,4.05],[8,3.7],[11,3.28],[13.4,2.95]];
 profile(m,0,8.15,0,[[0,0],...levels.map(([y,r])=>[r,y] as [number,number]),[0,13.4]],"brick","silu-main-shikhara",4);
 for(let face=0;face<4;face++){const saved=m.yaw;m.yaw+=face*Math.PI/2;for(let j=0;j<20;j++){const y=j*.65+.24,r=4.7-(y/13.4)*1.75,half=r/Math.SQRT2;for(const fraction of [-.78,-.35,.35,.78])box(m,fraction*half,8.15+y,half+.025,.14,.67,.12,"brick","silu-main-shikhara-ribs");}m.yaw=saved;}
 for(const [y,w]of [[21.6,4.5],[21.86,4.78],[22.12,4.6]])box(m,0,y,0,w,.2,w,"brick","silu-cornices");
 profile(m,0,22.2,0,[[0,0],[1.95,0],[1.8,.25],[1.52,.5],[1.15,.72],[1.03,1.25],[.98,1.7],[.68,2.05],[.7,2.22],[.46,2.45],[0,2.6]],"brick","silu-main-shikhara-neck",12);
 pinnacle(m,0,24.8,0,1.4,"silu-finial");return m;
}