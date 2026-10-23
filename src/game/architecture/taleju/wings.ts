import type {CentralModel} from '../central-model.ts';
import {box,profile,shape} from '../architecture-primitives.ts';
import {assembly,courtPoint,talejuPlan as plan,type TalejuPlacement} from './spatial.ts';
import {closedDoor,doorwayFrame,roofStruts,window,wingRoof} from './details.ts';

const depth=(plan.outerWidth-plan.width)/2;
function wing(p:TalejuPlacement,name:string,x:number,z:number,turn:number,w:number){
 const m=assembly(name,courtPoint(p,x,z),plan.yaw+turn);
 // A continuous raised gallery floor runs beneath EastWing's genuine through-passage.
 box(m,0,.29,-depth/2,w,.42,depth,'agedBrick','taleju-gallery-plinth',true);
 box(m,0,3.34,-depth/2,w,.20,depth,'carvedTimber','taleju-floor-structural-band',true);
 box(m,0,4.75,-depth/2,w,2.62,depth,'agedBrick','taleju-upper-masonry',true);
 for(const y of [.52,3.24,3.45,5.96])box(m,0,y,.01,w,.12,.25,'carvedTimber','taleju-horizontal-cornice');
 if(name==='NorthWing'||name==='SouthShrineWing')for(const side of [-1,1]){
  box(m,side*(w/2+depth/2),3.08,-depth/2,depth,6.0,depth,'agedBrick','taleju-corner-room-masonry',true);
 }
 wingRoof(m,w,depth,name==='SouthShrineWing'?12.9:0);roofStruts(m,w,plan.eave,Math.floor(w/1.45));return m;
}
function lowerWall(m:CentralModel,x:number,w:number){box(m,x,1.88,-depth/2,w,2.72,depth,'agedBrick','taleju-lower-masonry',true);}

function north(p:TalejuPlacement){
 const m=wing(p,'NorthWing',0,-plan.depth/2,0,plan.width);
 m.accuracy='PLAN_DERIVED / TEXT_CONFIRMED / PROVISIONAL_ELEVATION';
 // DoA 2016 explicitly records the northern lounge and sandalwood window.
 // The six-metre opening and elevation dimensions remain rendering assumptions.
 lowerWall(m,-6.39,6.77);lowerWall(m,6.39,6.77);
 box(m,0,1.9,-depth+.18,6.0,2.72,.36,'agedBrick','taleju-north-loggia-back',true);
 for(const x of [-3,-1,1,3]){
  box(m,x,1.88,.02,.17,2.72,.20,'carvedTimber','taleju-north-loggia-post',true);
  box(m,x,3.12,.02,.38,.18,.32,'carvedTimber','taleju-north-loggia-capital');
 }
 window(m,0,4.72,.03,3.6,1.45,true);
 for(const x of [-7.2,-4.8,4.8,7.2])window(m,x,4.72,.03,1.05,1.20);
 closedDoor(m,-6.4,.03);closedDoor(m,6.4,.03,1.1);
 for(let i=0;i<3;i++)box(m,0,.08+(i+1)*.14/2,.685-i*.27,6.3,(i+1)*.14,.29,'stone','taleju-north-loggia-access-steps',true);
 return m;
}
function west(p:TalejuPlacement){
 const m=wing(p,'WestWing',-plan.width/2,0,Math.PI/2,plan.depth);
 m.accuracy='PLAN_DERIVED / PROVISIONAL_ELEVATION';
 lowerWall(m,0,plan.depth);
 // Different room rhythm from NorthWing; no copied sacred entrance or invented galleries.
 for(const x of [-6.8,-2.9,3.6])closedDoor(m,x,.03,x===-2.9?1.25:.95);
 for(const x of [-7.3,-3.1,1.2,5.8])window(m,x,4.72,.03,x===1.2?2.25:1.15,1.30,x===1.2);
 window(m,6.8,1.88,.03,.60,.55);
 return m;
}
function east(p:TalejuPlacement){
 const m=wing(p,'EastWing',plan.width/2,0,-Math.PI/2,plan.depth);
 m.accuracy='PLAN_DERIVED / PHOTO_INFERRED';
 const half=(plan.depth-plan.doorWidth)/2;
 lowerWall(m,-(half+plan.doorWidth)/2,half);lowerWall(m,(half+plan.doorWidth)/2,half);
 // A physical opening through the entire range, not a black door painted on a collider.
 box(m,0,3.22,-depth/2,plan.doorWidth,.14,depth,'carvedTimber','taleju-east-entry-through-lintel',true);
 doorwayFrame(m,0,.03,plan.doorWidth,plan.doorHeight);
 for(const x of [-6.8,-3.3,3.6,7.2])window(m,x,4.73,.03,1.18,1.35);
 window(m,0,4.73,.03,2.65,1.40,true);
 closedDoor(m,-5.9,.03,.9);closedDoor(m,5.2,.03,1.0);
 for(let i=0;i<3;i++)box(m,0,.08+(i+1)*.14/2,.71-i*.28,2.0,(i+1)*.14,.30,'stone','taleju-east-entry-court-steps',true);
 // Exterior Beko-facing torana from Sarkar 2013 / Paudel 2013. Side assignment from plan.
 const outer=assembly('EastEntryTorana',[m.origin[0]-Math.sin(m.yaw)*depth,m.origin[1]-Math.cos(m.yaw)*depth],m.yaw+Math.PI,'PHOTO_INFERRED');
 doorwayFrame(outer,0,0,plan.doorWidth,plan.doorHeight,true);
 for(const side of [-1,1])window(outer,side*2.1,1.63,.02,.72,.45);
 m.boxes.push(...outer.boxes);m.profiles.push(...outer.profiles);m.shapes.push(...outer.shapes);m.colliders.push(...outer.colliders);
 return m;
}
function south(p:TalejuPlacement){
 const m=wing(p,'SouthShrineWing',0,plan.depth/2,Math.PI,plan.width);
 m.accuracy='PLAN_DERIVED / PHOTO_CONFIRMED / APPROXIMATE_ORNAMENT';
 lowerWall(m,0,plan.width);
 // The shrine occupies the south range. No standalone pagoda or accessible sanctum.
 box(m,0,1.86,.055,12.3,2.63,.12,'redMasonry','taleju-shrine-red-ground-field');
 box(m,0,4.70,.035,12.3,2.58,.10,'redMasonry','taleju-shrine-red-upper-field');
 doorwayFrame(m,0,.18,1.35,2.35,true,'gold');
 box(m,0,1.675,.27,1.34,2.35,.12,'carvedTimber','taleju-sacred-closed-lattice-door',true);
 for(let i=0;i<8;i++)box(m,-.60+i*.17,1.675,.35,.025,2.20,.035,'bronze','taleju-sacred-door-lattice');
 for(let i=0;i<11;i++)box(m,0,.61+i*.20,.37,1.22,.025,.035,'bronze','taleju-sacred-door-lattice');
 for(const side of [-1,1]){
  // Blank relief panels deliberately omit unreadable inscriptions and painted sacred images.
  box(m,side*2.60,1.27,.18,2.30,1.10,.14,'bronze','taleju-inscription-panel-no-text');
  window(m,side*2.60,2.08,.24,.54,.43);
  box(m,side*4.45,1.75,.19,.83,2.30,.12,'bronze','taleju-standing-figure-backing');
  profile(m,side*4.45,1.15,.31,[[.18,0],[.25,.16],[.18,.40],[.22,.70],[.14,.95],[0,1.10]],'gold','taleju-standing-figure-robe',10);
  for(const leg of [-1,1]){profile(m,side*4.45+leg*.10,.65,.33,[[.09,0],[.075,.18],[.08,.45],[.10,.68],[0,.72]],'gold','taleju-standing-figure-leg',8);box(m,side*4.45+leg*.10,.67,.40,.13,.10,.23,'bronze','taleju-standing-figure-foot');}
  profile(m,side*4.45,2.18,.32,[[0,0],[.15,.05],[.17,.21],[.11,.35],[0,.40]],'gold','taleju-standing-figure-head',10);
  for(const a of [-1,1])shape(m,side*4.45+a*.17,1.29,.34,[[0,0],[a*.13,.15],[a*.17,.68],[0,1.0],[-a*.08,.88],[-a*.02,.25]],.13,'gold','taleju-standing-figure-arm');
  for(const x of [2.1,4.7]){
   box(m,side*x,4.62,.14,1.23,1.25,.12,'bronze','taleju-upper-relief-framed-field');
   shape(m,side*x,4.05,.24,[[-.52,0],[-.65,.2],[-.50,.45],[.50,.45],[.65,.2],[.52,0]],.09,'gold','taleju-upper-relief-projecting-bracket');
  }
 }
 window(m,0,4.72,.12,2.3,1.36,true);
 for(const y of [3.10,3.40,5.94]){
  box(m,0,y,.17,13.0,.16,.35,'gold','taleju-shrine-ornamental-horizontal-band');
  for(let i=0;i<45;i++)box(m,-6.3+i*.286,y-.12,.19,.12,.17,.25,'bronze','taleju-shrine-carved-cornice-block');
 }
 for(const side of [-1,1])shape(m,0,7.75,-depth*.5+.08,[[side*.36,0],[side*.44,0],[side*.055,1.17],[0,1.17]],.07,'bronze','taleju-central-pinnacle-triangular-support');
 for(let i=0;i<11;i++){
  const x=(i-5)*1.02;
  profile(m,x,7.58,-depth*.5,[[.20,0],[.29,.08],[.32,.20],[.22,.35],[.16,.41],[.20,.51],[.10,.66],[0,.80]],'gold','taleju-eleven-lotus-pinnacles',12);
  profile(m,x,8.39,-depth*.5,[[.30,0],[.24,.10],[.17,.26],[.10,.38],[0,i===5?.70:.52]],'bronze','taleju-eleven-small-parasol-crowns',12);
 }
 for(let i=0;i<3;i++)box(m,0,.08+(i+1)*.14/2,.71-i*.28,3.0,(i+1)*.14,.30,'stone','taleju-shrine-front-access-steps',true);
 return m;
}
export function buildTalejuWings(p:TalejuPlacement){return [north(p),south(p),west(p),east(p)];}
