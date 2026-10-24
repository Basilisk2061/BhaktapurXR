import {box,shape} from '../architecture-primitives.ts';
import {assembly,gatePoint,type TalejuPlacement} from './spatial.ts';
import {entranceCourt as plan} from './entrance-plan.ts';
import {carvedBand,courtyardMetalFeature,entranceRamp,entranceRoof,galleryLight,plasterArch,smallLattice,uprightWindow} from './entrance-details.ts';

const courtTints={plaster:'#c5b59a',stone:'#97836b',agedBrick:'#9b7960',carvedTimber:'#49362a',timber:'#71553c',redMasonry:'#8d4b3e',bronze:'#847653',gold:'#998458'};
const classification='PHOTO_CONFIRMED_COMPOSITION / PHOTO_INFERRED / APPROXIMATE_DIMENSIONS';
/** A/B show a pale forward range, not one more instance of Beko's brick facade. */
function forward(p:TalejuPlacement){
 const m=assembly('YamForwardRange',gatePoint(p.gate,plan.centreX,-plan.front),p.gate.yaw,classification);
 const w=plan.width,d=plan.rangeDepth,door=plan.doorX,half=plan.doorWidth/2;
 // Ground facade is genuinely split around the onward doorway. The lower range behind it
 // is a covered passage turning east; no full-depth body crosses that route.
 const left=-w/2,right=w/2,a=door-half,b=door+half;
 for(const [from,to] of [[left,a],[b,right]]){
  box(m,(from+to)/2,1.73,-.22,to-from,2.82,.44,'plaster','yam-forward-ground-plaster',true);
  box(m,(from+to)/2,.19,-.08,to-from,.22,.62,'agedBrick','yam-forward-worn-masonry-foot',true);
 }
 box(m,door,2.855,-.22,plan.doorWidth,.57,.44,'plaster','yam-forward-door-over-wall',true);
 box(m,0,5.02,-d/2,w,3.76,d,'plaster','yam-forward-upper-plastered-range',true);
 box(m,d/2,.20,-d/2,w+d,.24,d,'agedBrick','yam-forward-passage-threshold-floor',true);
 box(m,0,3.12,-d/2,w,.18,d,'carvedTimber','yam-forward-covered-passage-ceiling',true);
 // Corner rooms belong to this range, closing the three-range roof corners.
 box(m,-(w/2+d/2),4.49,-d/2,d,8.82,d,'plaster','yam-forward-west-corner-room',true);
 // The east corner is the onward turn: only upper rooms span it, never solid ground masonry.
 box(m,w/2+d/2,6.005,-d/2,d,5.73,d,'plaster','yam-forward-east-upper-corner-room',true);
 box(m,w/2+d/2,1.73,-.22,d,2.82,.44,'plaster','yam-forward-east-passage-front',true);
 box(m,w/2+d/2,3.12,-d/2,d,.18,d,'carvedTimber','yam-forward-east-passage-ceiling',true);
 for(const side of [-1,1]){
  box(m,side*(w/2-.11),4.86,.08,.22,3.32,.22,'plaster','yam-forward-corner-pilaster');
  box(m,side*(w/2-.11),3.26,.16,.36,.16,.34,'plaster','yam-forward-corner-pilaster-foot');
 }
 // Corner ceilings fill only the L-shaped room, below the adjoining roof planes.
 for(const side of [-1,1])box(m,side*(w/2+d/2),8.76,-d/2,d,.16,d,'carvedTimber','yam-corner-ceiling');
 for(const side of [-1,1]){
  box(m,door+side*(half+.08),1.445,.06,.14,2.34,.30,'carvedTimber','yam-forward-door-jamb');
  box(m,door+side*(half+.19),1.47,.015,.12,2.42,.26,'plaster','yam-forward-door-plaster-reveal');
 }
 box(m,door,2.63,.12,2.10,.20,.40,'carvedTimber','yam-forward-door-deep-lintel');
 for(let i=0;i<13;i++)box(m,door-1.06+(i+.5)*2.12/13,2.49,.21,.085,.17,.27,'carvedTimber','yam-forward-lintel-bracket-rhythm');
 for(const side of [-1,1])box(m,door+side*(half+.13),.36,.10,.23,.08,.49,'agedBrick','yam-forward-threshold-side-block');
 // The lower left leaf is visibly closed in B; it is not a second public passage.
 box(m,-3.72,1.40,.025,.91,2.05,.15,'carvedTimber','yam-forward-left-closed-door');
 for(const side of [-1,1])box(m,-3.72+side*.51,1.42,.12,.13,2.19,.25,'plaster','yam-forward-left-door-surround');
 plasterArch(m,-3.72,.31,.06,.94,2.10);
 for(const y of [3.02,3.25])box(m,0,y,.13,w+.10,.12,.37,'plaster','yam-forward-plaster-cornice');
 carvedBand(m,w+.14,2.92,.13,.22);
 // Paired small lower windows/brackets are subordinate to the tall central carved shutter.
 uprightWindow(m,.14,4.68,.055,.72,1.62);
 for(const x of [-2.20,2.80]){
  smallLattice(m,x,4.24,.08,.59,.30);
  box(m,x,4.01,.12,.88,.12,.34,'plaster','yam-forward-small-window-shelf');
  for(const side of [-1,1])shape(m,x+side*.22,3.76,.08,[[-.08,.23],[.08,.23],[.06,0],[-.03,.05]],.22,'plaster','yam-forward-small-window-bracket');
 }
 uprightWindow(m,-4.22,5.62,.05,.77,1.73,false);
 // Muted rosette frieze and alternating pale/red upper panel rhythm in both A and B.
 box(m,0,6.60,.035,w,.42,.13,'plaster','yam-forward-frieze-plaster');
 for(let i=0;i<11;i++){
  const x=-w/2+.43+i*(w-.86)/10;
  shape(m,x,6.60,.12,[[-.17,0],[-.10,.07],[.10,.07],[.17,0],[.10,-.07],[-.10,-.07]],.018,'redMasonry','yam-forward-muted-rosette');
  box(m,x,6.60,.145,.10,.06,.018,'plaster','yam-forward-rosette-pale-centre');
 }
 box(m,0,6.91,.12,w,.13,.31,'carvedTimber','yam-forward-upper-gallery-sill');
 box(m,0,7.80,-.04,w,1.66,.18,'recess','yam-forward-upper-gallery-shadow');
 box(m,0,7.80,-d+.16,w,1.66,.32,'agedBrick','yam-forward-upper-gallery-rear');
 box(m,0,6.94,-d/2,w,.14,d,'carvedTimber','yam-forward-upper-gallery-floor');
 const bays=14,pitch=w/bays;
 for(let i=0;i<bays;i++){
  const x=-w/2+(i+.5)*pitch;
  box(m,x,7.27,.12,pitch-.09,.61,.13,i%3===1?'redMasonry':'plaster','yam-forward-light-red-gallery-panel');
  box(m,x,7.96,.09,pitch-.13,.59,.10,'timber','yam-forward-upper-small-shutter');
  for(const side of [-1,1])box(m,x+side*pitch*.35,7.96,.16,.04,.59,.04,'carvedTimber','yam-forward-upper-window-division');
  box(m,x-pitch/2,7.79,.22,.075,1.76,.22,'carvedTimber','yam-forward-upper-gallery-post');
 }
 box(m,w/2,7.79,.22,.075,1.76,.22,'carvedTimber','yam-forward-upper-gallery-end-post');
 box(m,0,8.63,.15,w,.19,.37,'carvedTimber','yam-forward-upper-gallery-header');
 entranceRoof(m,w,0);
 entranceRamp(m,door,.015,plan.rampWidth,plan.rampRun,plan.threshold-plan.floor);
 m.materialTints=courtTints;return m;
}

/** A/B right elevation; D corroborates carved gallery depth, not an exact bay census. */
function right(p:TalejuPlacement){
 const m=assembly('YamEastRange',gatePoint(p.gate,plan.right,-(plan.start+plan.front)/2),p.gate.yaw-Math.PI/2,classification);
 const w=plan.depth,d=plan.rangeDepth;
 box(m,0,.18,-d/2,w,.20,d,'agedBrick','yam-east-masonry-foot',true);
 box(m,0,3.26,-d/2,w,5.96,d,'agedBrick','yam-east-two-level-brick-range',true);
 box(m,0,7.4825,-d/2,w,2.485,d,'carvedTimber','yam-east-upper-gallery-backing',true);
 carvedBand(m,w,3.13,.07,.30);carvedBand(m,w,3.40,.09,.14);
 for(const [x,width,height] of [[-4.2,1.03,.85],[.12,1.22,1.03],[4.1,.92,.81]]){
  smallLattice(m,x,4.73,.055,width,height);
  shape(m,x,5.27,.17,[[-width*.70,0],[-width*.51,.19],[0,.38],[width*.51,.19],[width*.70,0]],.14,'carvedTimber','yam-east-middle-window-projecting-head');
 }
 // A closed small door and low aperture, rather than a uniform row of generic ground windows.
 box(m,-4.32,1.43,.055,.91,2.06,.16,'carvedTimber','yam-east-closed-lower-door');
 for(const side of [-1,1])box(m,-4.32+side*.52,1.48,.17,.13,2.21,.24,'timber','yam-east-lower-door-carved-frame');
 smallLattice(m,3.8,1.45,.06,.82,.48);
 box(m,0,6.11,.26,w+.15,.25,.87,'carvedTimber','yam-east-gallery-projecting-floor');
 carvedBand(m,w+.18,6.36,.39,.39);
 const bays=8,pitch=(w-.28)/bays;
 for(let i=0;i<bays;i++){
  const x=-w/2+.14+(i+.5)*pitch;
  galleryLight(m,x,7.43,pitch*.78,1.18,.68);
  shape(m,x,5.55,.12,[[-.12,0],[-.12,.44],[.20,.69],[.68,.69],[.68,.52],[.34,.37],[.10,0]],.17,'carvedTimber','yam-east-gallery-projecting-bracket',Math.PI/2);
 }
 for(let i=0;i<=bays;i++){
  const x=-w/2+.14+i*pitch;
  box(m,x,7.47,.68,.24,2.18,.50,'carvedTimber','yam-east-continuous-major-gallery-post');
  box(m,x,6.49,.79,.38,.18,.63,'timber','yam-east-gallery-post-foot');
  box(m,x,8.43,.78,.42,.20,.66,'carvedTimber','yam-east-gallery-post-capital');
 }
 for(const y of [3.72,5.88])box(m,0,y,.14,w,.10,.42,'carvedTimber','yam-east-secondary-projecting-cornice');
 carvedBand(m,w+.12,8.56,.62,.22);
 entranceRoof(m,w,-1);
 // A/B establish the silhouette only. It is not the exterior Taleju Bell.
 courtyardMetalFeature(m,-4.40,.89);
 m.materialTints=courtTints;return m;
}

/** A/B left elevation: aged plaster, blind lower panels and tall shutters, not a mirrored gallery. */
function left(p:TalejuPlacement){
 const m=assembly('YamWestRange',gatePoint(p.gate,plan.left,-(plan.start+plan.front)/2),p.gate.yaw+Math.PI/2,classification);
 const w=plan.depth,d=plan.rangeDepth;
 box(m,0,.20,-d/2,w,.24,d,'agedBrick','yam-west-exposed-brick-foot',true);
 box(m,0,4.5225,-d/2,w,8.405,d,'plaster','yam-west-aged-plastered-range',true);
 for(const y of [3.20,3.44,3.69])box(m,0,y,.075,w,.105,.29,'plaster','yam-west-stepped-string-course');
 for(const [x,width] of [[-5.12,.78],[-2.78,1.02],[-.35,.92],[2.12,.86],[4.65,.70]]){
  for(const side of [-1,1])box(m,x+side*width*.63,1.76,.13,.11,2.21,.16,'plaster','yam-west-blind-panel-pilaster');
  plasterArch(m,x,.67,.10,width,1.64);
  box(m,x,.63,.13,width+ .34,.12,.28,'plaster','yam-west-blind-panel-base');
 }
 for(const [x,width,height] of [[-4.76,.91,2.16],[-1.64,1.10,2.08],[1.61,.81,1.92],[4.62,.88,2.02]]){
  uprightWindow(m,x,5.34,.045,width,height,false);
  for(let i=0;i<12;i++)box(m,x,5.34-height/2+(i+.5)*height/12,.28,width,.027,.045,'carvedTimber','yam-west-aged-shutter-louvres');
  box(m,x,5.34-height/2-.18,.06,width+.35,.10,.31,'plaster','yam-west-shutter-sill');
 }
 for(const x of [-5.95,-3.95,-.10,3.30,5.95]){
  box(m,x,1.78,.11,.18,2.92,.24,'plaster','yam-west-lower-wall-pier');
  box(m,x,3.00,.19,.32,.16,.35,'plaster','yam-west-pier-capital');
 }
 box(m,0,.39,.08,w,.14,.26,'agedBrick','yam-west-worn-brick-plinth-cap');
 box(m,0,8.60,.08,w,.18,.42,'carvedTimber','yam-west-simple-eave-support-band');
 entranceRoof(m,w,1);
 m.materialTints=courtTints;return m;
}

function ground(p:TalejuPlacement){
 const m=assembly('GoldenGateInteriorTransition',[...p.gate.origin],p.gate.yaw,'PHOTO_CONFIRMED_PAVING / PHOTO_INFERRED / APPROXIMATE');
 const middle=-(plan.start+plan.front)/2;
 // One continuous collider beneath the shallow flags. Joints cannot become physics gaps.
 box(m,plan.centreX,.03,middle,plan.width,.06,plan.depth,'stone','yam-court-joint-bed');
 box(m,plan.centreX,.04,middle,plan.width,.08,plan.depth,'stone','yam-court-ground-collision',true);
 box(m,0,.04,-(1.24+plan.start)/2,4.8,.08,plan.start-1.24,'paving','yam-preserved-gate-threshold-approach',true);
 // Broad worn flags are instanced within this owner, never per-flag React objects. Staggered course lengths
 // follow the mixed paving in A/B; precise flag census/repairs are not claimed.
 const usable=plan.width-.52,rows=16,rowDepth=plan.depth/rows;
 for(let row=0;row<rows;row++){
  let start=plan.centreX-usable/2;
  const end=plan.centreX+usable/2;
  for(let col=0;start<end-.015;col++){
   const nominal=col===0&&row%2?.39:.77+(row%3===0?.10:0),width=Math.min(nominal,end-start);
   if(width>.025)box(m,start+width/2,.0735+(row%3)*.0004,-plan.start-(row+.5)*rowDepth,width-.012,.013,rowDepth-.012,'stone','yam-weathered-stone-flag');
   start+=width;
  }
 }
 for(const x of [plan.left+.13,plan.right-.13])box(m,x,.079,middle,.26,.014,plan.depth,'paving','yam-brick-edge-course');
 m.materialTints=courtTints;return m;
}

function reverse(p:TalejuPlacement){
 const m=assembly('YamGateInteriorFace',gatePoint(p.gate,0,-1.54),p.gate.yaw+Math.PI,classification);
 // Local normal points into the court. Match the frozen opening rather than moving the gate.
 const left=-plan.right,right=-plan.left,half=.82;
 for(const [a,b] of [[left,-half],[half,right]]){
  box(m,(a+b)/2,3.70,-.055,b-a,7.24,.11,'agedBrick','yam-reverse-gate-interior-brick-skin',true);
  box(m,(a+b)/2,.18,.025,b-a,.20,.26,'agedBrick','yam-reverse-gate-brick-foot',true);
 }
 box(m,0,5.25,-.055,1.64,4.14,.11,'agedBrick','yam-reverse-gate-upper-portal-skin',true);
 for(const side of [-1,1])box(m,side*.87,1.66,.065,.10,3.16,.16,'carvedTimber','yam-reverse-gate-door-reveal');
 box(m,0,3.22,.11,2.12,.18,.30,'carvedTimber','yam-reverse-gate-lintel');
 box(m,(left+right)/2,7.37,0,right-left,.12,.30,'agedBrick','yam-reverse-gate-brick-coping');
 // Close the cut rear roof below its retained ridge; the gilded exterior canopy is untouched.
 shape(m,0,0,.015,[[-4.85,7.32],[-4.85,7.51],[-3.65,8.20],[3.65,8.20],[4.85,7.51],[4.85,7.32]],.06,'agedBrick','yam-reverse-gate-roof-end-infill');
 // Short returns bridge the .06 m transition to side ranges, never across the doorway.
 for(const x of [left+.12,right-.12])box(m,x,3.70,.03,.24,7.24,.06,'agedBrick','yam-reverse-gate-side-return',true);
 m.materialTints=courtTints;return m;
}

export function buildEntranceCourt(p:TalejuPlacement){return [ground(p),left(p),right(p),forward(p),reverse(p)];}
