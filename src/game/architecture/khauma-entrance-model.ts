import type {CentralModel} from "./central-model.ts";
import {box,shape,profile} from "./remaining-models.ts";
import {KHAUMA_GATE_VIEW_AXIS} from "../../data/reconstruction/khauma-spatial-audit.ts";
/** Photo-proportioned exterior, not a measured elevation. Placement remains Phase 9A.2. */
export const khaumaGateDimensions={opening:3.8,spring:3.15,apex:4.9,depth:1.6,width:11.1,crown:6.9,finialTop:9.65};
export function buildKhaumaEntranceGate():CentralModel {
 const m:CentralModel={id:"khauma-gate",anchorId:"khauma-gate",origin:[...KHAUMA_GATE_VIEW_AXIS.proposedCentre],yaw:KHAUMA_GATE_VIEW_AXIS.proposedYaw,accuracy:"RECONSTRUCTED_APPROXIMATE",neutral:false,boxes:[],shapes:[],profiles:[],roofs:[],colliders:[]};
 const half=1.9,spring=3.15,arch=(x:number)=>spring+1.75*Math.sqrt(Math.max(0,1-Math.abs(x)/half));
 const curve=Array.from({length:33},(_,i)=>{const x=-half+i*half/16;return [x,arch(x)] as [number,number];});
 // Deep continuous vault: facades are relief on masonry, never flat arch decals.
 shape(m,0,0,-.8,[...curve,[half,6.0],[-half,6.0]],1.6,"gateBrick","khauma-pointed-deep-brick-vault");
 for(const side of [-1,1]) {
  box(m,side*2.625,3,0,1.45,6,1.6,"gateBrick","khauma-structural-arch-pier",true);
  // Side panels are recessed relative to their pilasters; same brick, true shadows.
  box(m,side*4.375,2.32,0,2.05,4.64,1.38,"gateBrick","khauma-recessed-side-masonry",true);
  for(const face of [-1,1]) {
   const z=face*.83;
   for(const x of [side*3.48,side*5.3])box(m,x,2.37,z,.22,4.74,.18,"gateBrick","khauma-shoulder-edge-pilaster");
   for(const y of [.46,1.14,2.28,3.42])box(m,side*4.375,y,z,1.9,.13,.19,"gateBrick","khauma-recessed-panel-sill");
   // Nested narrow blind rectangles divide the gate piers vertically.
   for(const y of [.63,1.66,2.7,3.74,4.65]) {
    for(const x of [-.31,.31])box(m,side*2.63+x,y,z,.12,.74,.19,"gateBrick","khauma-pier-panel-jamb");
    for(const dy of [-.37,.37])box(m,side*2.63,y+dy,z,.72,.11,.19,"gateBrick","khauma-pier-panel-sill");
   }
   const niche=Array.from({length:17},(_,i)=>{const a=Math.PI-i*Math.PI/16;return [.79*Math.cos(a),3.51+.18+.63*Math.sin(a)] as [number,number];});
   shape(m,side*4.375,0,face<0?-.93:.78,[...niche,...niche.toReversed().map(([x,y])=>[x*1.13,y+.13] as [number,number])],.15,"gateBrick","khauma-shallow-arched-niche-ring");
   box(m,side*4.375,3.69,z,1.8,.12,.22,"gateBrick","khauma-niche-transom");
   // Little peaked recess above each arch pier, visible in both primary photos.
   shape(m,side*2.63,5.12,face<0?-.9:.8,[[-.34,0],[-.34,.4],[0,.68],[.34,.4],[.34,0]],.08,"gateBrick","khauma-peaked-upper-blind-panel");
   for(const x of [side*1.98,side*3.25])box(m,x,3.06,z,.14,6.12,.16,"gateBrick","khauma-vertical-arch-border");
  }
  for(const [y,w,d] of [[4.75,2.27,1.65],[4.9,2.52,1.86],[5.04,2.35,1.73]])box(m,side*4.375,y,0,w,.14,d,"gateBrick","khauma-stepped-brick-shoulder-cornice");
  lotus(m,side*4.375,5.15,1.65,.42,"khauma-side-finial");
 }
 const top=Array.from({length:41},(_,i)=>{const x=-3.35+i*6.7/40;return [x,6+ .9*(1+Math.cos(x/3.35*Math.PI))/2] as [number,number];});
 shape(m,0,0,-.8,[[-3.35,5.98],[3.35,5.98],...top.toReversed().map(([x,y])=>[x,y+.31] as [number,number])],1.6,"gateBrick","khauma-curved-crown-masonry");
 for(const face of [-1,1]) {
  for(const lift of [.02,.19])shape(m,0,0,face<0?-.95:.8,[...top.map(([x,y])=>[x,y+lift] as [number,number]),...top.toReversed().map(([x,y])=>[x,y+lift+.12] as [number,number])],.15,"gateBrick","khauma-curved-stepped-brick-cornice");
  for(const inset of [0,.13])shape(m,0,0,face<0?-.92-inset*.2:.8+inset*.2,[...curve.map(([x,y])=>[x*(1+inset*.3),y+inset] as [number,number]),...curve.toReversed().map(([x,y])=>[x*1.12,y+.26+inset] as [number,number])],.12,"gateBrick","khauma-brick-arch-voussoir-ring");
  box(m,0,6.25,face*.87,4.05,.12,.15,"gateBrick","khauma-crown-recessed-horizontal-band");
 }
 // Vault collision slices leave the photographed opening and mapped path unobstructed.
 for(let i=0;i<16;i++){const w=half/8,x=-half+(i+.5)*w,bottom=arch(Math.max(0,Math.abs(x)-w/2))+.025;box(m,x,(bottom+6)/2,0,w,6-bottom,1.58,"gateBrick","khauma-vault-collision",true);}
 lotus(m,0,7.13,2.52,.52,"khauma-central-finial");
 for(const side of [-1,1])profile(m,side*.63,7.14,0,[[0,0],[.17,0],[.17,.14],[.11,.24],[0,.26]],"gateBrick","khauma-finial-scroll-base",10);
 return m;
}
function lotus(m:CentralModel,x:number,y:number,h:number,r:number,role:string) {
 if(role==="khauma-side-finial"){profile(m,x,y,0,[[0,0],[r*.95,0],[r*1.1,h*.08],[r*.67,h*.16],[r*1.17,h*.27],[r*1.18,h*.41],[r*.83,h*.53],[r*.39,h*.59],[r*.32,h*.68],[r*.46,h*.74],[r*.23,h*.8],[r*.28,h*.85],[r*.12,h*.9],[r*.18,h*.95],[0,h]],"gateBrick",role,16);return;}
 profile(m,x,y,0,[[0,0],[r*.95,0],[r*1.12,h*.06],[r*.75,h*.13],[r*1.25,h*.23],[r*1.1,h*.32],[r*.66,h*.42],[r*.49,h*.62],[r*.37,h*.68],[r*.43,h*.74],[r*.27,h*.8],[r*.3,h*.85],[r*.13,h*.9],[r*.18,h*.94],[0,h]],"gateBrick",role,16);
 for(let i=0;i<10;i++){const a=i*Math.PI/5;profile(m,x+Math.cos(a)*r*.97,y+h*.18,Math.sin(a)*r*.97,[[0,0],[r*.2,0],[r*.25,h*.11],[r*.16,h*.24],[0,h*.31]],"gateBrick",role+"-lotus-petal",6);}
}
