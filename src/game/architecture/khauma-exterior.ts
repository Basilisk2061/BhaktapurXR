import {Euler,Matrix4} from "three";
import overrides from "../../features/bhaktapur/data/manual-transform-overrides.json" with {type:"json"};
import type {CentralModel,CentralMaterial} from "./central-model.ts";
import {box,profile,shape} from "./remaining-models.ts";

// The approved gate is the sole registration control. Screenshots support relative
// appearance, not surveyed dimensions. +Z is outside; +X is reference-camera right.
const gate=overrides["khauma-gate"],matrix=new Matrix4().makeRotationFromEuler(new Euler(...gate.rotation as [number,number,number]));
export const exteriorFrame={origin:[gate.position[0],gate.position[2]] as [number,number],yaw:Math.atan2(matrix.elements[8],matrix.elements[10])};
/** Gate-local coordinates; never world +Z. */
export function exteriorLocal(p:readonly number[]):[number,number,number]{const dx=p[0]-exteriorFrame.origin[0],dz=p[2]-exteriorFrame.origin[1],a=exteriorFrame.yaw;return [dx*Math.cos(a)-dz*Math.sin(a),p[1],dx*Math.sin(a)+dz*Math.cos(a)];}
export const exteriorPlan={
 classification:"PHOTO_INFERRED",dimensions:"APPROXIMATE",
 rightTurn:-Math.PI/2,rightSource:[17.9,1.1] as [number,number],rightCentre:[8,13.9] as [number,number],
 nearSource:[9.15,.2] as [number,number],nearCentre:[9,4.9] as [number,number],
 leftTurn:Math.PI*2/9,leftDepthSource:[-24.5,2.1] as [number,number],leftDepthCentre:[-30.4,3.5] as [number,number],
 leftCommercialCentre:[-17.9,-2.2] as [number,number],leftTerraceCentre:[-17.9,-2.5] as [number,number],
 roadCentreline:[[0,0],[.12,6],[-.45,16],[.1,28],[.65,40]] as [number,number][],roadWidths:[3.8,3.7,3.4,3.6,3.5],
};
export function exteriorPoint(x:number,y:number,z:number):[number,number,number]{const {origin,yaw}=exteriorFrame;return [origin[0]+x*Math.cos(yaw)+z*Math.sin(yaw),y,origin[1]-x*Math.sin(yaw)+z*Math.cos(yaw)];}
export const exteriorReplacedIds=new Set(["edge:khauma-south-flank:1159661606","edge:western-approach-low-roofs:1159661608","edge:western-approach-low-roofs:1159672142","edge:western-approach-low-roofs:1159672143"]);
export const exteriorEvidence={classification:"PHOTO_INFERRED",references:["Screenshot 2026-10-16 123805.png","Screenshot 2026-10-16 123816.png","Screenshot 2026-10-16 123826.png"],dimensions:"APPROXIMATE",limitations:"No survey solution. Rear shells, shop depth, merchandise counts and street continuation inferred; neutral signage, no business identities asserted."};
export const exteriorNames={LeftTraditional:"Khauma exterior / left traditional building",LeftShops:"Khauma exterior / low left commercial cluster",LeftLaneShops:"Khauma exterior / green commercial range",LeftUrbanContext:"Khauma exterior / older brick commercial frontage",LeftTerrace:"Khauma exterior / restaurant terrace",RightGateShop:"Khauma exterior / gate-side shop",RightCommercial:"Khauma exterior / right shop bays",RightUpper:"Khauma exterior / brick-timber upper storey",Road:"Khauma exterior / roadway and brick margins",StreetProps:"Khauma exterior / street furniture and greenery"};
function model(key:keyof typeof exteriorNames):CentralModel{return {id:`entrance:KhaumaExterior_${key}`,anchorId:"APPROVED_KHAUMA_GATE",origin:[...exteriorFrame.origin],yaw:exteriorFrame.yaw,accuracy:"PHOTO_INFERRED",neutral:false,boxes:[],profiles:[],shapes:[],roofs:[],colliders:[]};}
function tiledRoof(m:CentralModel,x:number,z:number,y:number,w:number,d:number,rise:number){m.roofs.push({position:exteriorPoint(x,y,z),width:w,depth:d,rise,yaw:m.yaw,material:"roof",role:"exterior-tile-roof"});box(m,x,y-.08,z,w,.17,d,"carvedTimber","exterior-deep-eave");for(let i=0;i<w/.6;i++)box(m,x-w/2+.2+i*.6,y-.24,z+d/2-.35,.1,.4,.65,"carvedTimber","exterior-eave-bracket");}
function window(m:CentralModel,x:number,y:number,z:number,w=1.05,h=1.25){box(m,x,y,z,w,h,.12,"recess","exterior-window-recess");for(const s of [-1,1])box(m,x+s*w/2,y,z+.1,.11,h+.22,.18,"carvedTimber","exterior-window-frame");for(const dy of [-h/2,h/2])box(m,x,y+dy,z+.12,w+.25,.12,.2,"carvedTimber","exterior-window-lintel");for(let i=1;i<7;i++)box(m,x-w/2+i*w/7,y,z+.17,.025,h,.035,"carvedTimber","exterior-lattice");for(let i=1;i<6;i++)box(m,x,y-h/2+i*h/6,z+.18,w,.026,.03,"carvedTimber","exterior-lattice");}
function shop(m:CentralModel,x:number,z:number,w:number,h:number,paint:CentralMaterial){
 const d=4.7,front=z+d/2;
 box(m,x,.12,z,w,.24,d,"agedBrick","exterior-shop-platform",true);
 box(m,x,h/2+.24,z-d/2+.15,w,h,.3,"agedBrick","exterior-shop-back-wall",true);
 for(const s of [-1,1])box(m,x+s*(w/2-.13),h/2+.24,z,.26,h,d,paint,"exterior-shop-side-wall",true);
 box(m,x,h+.3,z,w,.18,d,"carvedTimber","exterior-shop-ceiling",true);
 box(m,x,h/2+.3,z-d/2+.32,w-.5,h-.15,.06,"recess","exterior-dark-interior");
 for(const s of [-1,1])box(m,x+s*(w/2-.18),1.6,front,.17,2.85,.22,"carvedTimber","exterior-shop-jamb",true);
 box(m,x,h+.2,front+.18,w+.16,.38,.65,"carvedTimber","exterior-shop-lintel");
 box(m,x,h+.85,front+.12,w-.12,.82,.12,x<0?"exteriorSignCafe":x<11?"exteriorSignExchange":"exteriorSignTextiles","exterior-pale-sign-band");
 box(m,x,.06,front+.24,w+.15,.12,.5,"stone","exterior-shop-access-step",true);
}
const cloth:CentralMaterial[]=["exteriorTeal","exteriorWine","exteriorOchre","plaster","exteriorBlue"];
function display(m:CentralModel,x:number,z:number,w:number){
 for(let i=0;i<Math.floor(w/.48);i++){
  const dx=x-w/2+.28+i*.48,c=cloth[i%cloth.length];
  if(i%3===0){box(m,dx,1.95,z,.34,.48,.18,c,"exterior-hanging-bag");box(m,dx,1.68,z+.1,.28,.16,.07,"carvedTimber","exterior-bag-pocket");profile(m,dx,2.18,z,[[.11,0],[.12,.1],[.07,.18],[0,.18]],"carvedTimber","exterior-bag-loop",6);}
  else if(i%3===1)shape(m,dx,1.42,z,[[-.2,0],[-.2,.55],[-.34,.48],[-.43,.66],[-.19,.9],[-.08,.83],[.08,.83],[.19,.9],[.43,.66],[.34,.48],[.2,.55],[.2,0]],.045,c,"exterior-hanging-shirt");
  else {box(m,dx,1.15,z,.35,1.8,.06,c,"exterior-hanging-textile");for(let j=0;j<6;j++)box(m,dx,.4+j*.24,z+.04,.36,.035,.025,"exteriorOchre","exterior-woven-textile-band");}
 }
 for(let k=0;k<3;k++){box(m,x, .55+k*.45,z-.8,w-.3,.055,.35,"carvedTimber","exterior-shop-shelf");for(let j=0;j<Math.floor(w/.22)-2;j++)profile(m,x-w/2+.35+j*.22,.58+k*.45,z-.8,[[.055,0],[.065,.15],[.03,.2],[.03,.27],[0,.27]],cloth[(j+k)%cloth.length],"exterior-bottle-souvenir",6);}
}
function board(m:CentralModel,x:number,z:number,w=.75){box(m,x,.68,z,w,1.2,.1,"carvedTimber","exterior-standing-board",true);box(m,x,.7,z+.065,w-.1,.98,.025,"exteriorTeal","exterior-board-face");for(let j=0;j<6;j++)box(m,x,.4+j*.12,z+.085,w-.23,.025,.015,"plaster","exterior-menu-lines");for(const s of [-1,1])box(m,x+s*w*.38,.2,z-.18,.05,.4,.55,"carvedTimber","exterior-board-feet");}
/** Reuse primitives in the gate frame. Scale is along the original frontage only. */
function reframe(m:CentralModel,from:[number,number],to:[number,number],turn:number,stretch=1,include=(role:string)=>!!role,updateYaw=true){
 const point=(p:[number,number,number]):[number,number,number]=>{const q=exteriorLocal(p),x=(q[0]-from[0])*stretch,z=q[2]-from[1];return exteriorPoint(to[0]+x*Math.cos(turn)+z*Math.sin(turn),p[1],to[1]-x*Math.sin(turn)+z*Math.cos(turn));};
 const signature=(b:{position:number[];size:number[];yaw:number})=>JSON.stringify([b.position,b.size,b.yaw]);
 const selected=new Set(m.boxes.filter(b=>include(b.role)).map(signature));
 for(const b of m.colliders){if(!updateYaw&&!selected.has(signature(b)))continue;b.position=point(b.position);b.size[0]*=stretch;b.yaw+=turn;}
 for(const b of m.boxes.filter(b=>include(b.role))){b.position=point(b.position);b.size[0]*=stretch;b.yaw+=turn;}
 for(const p of m.profiles.filter(p=>include(p.role))){p.position=point(p.position);p.yaw+=turn;}
 for(const p of m.shapes.filter(p=>include(p.role))){p.position=point(p.position);p.yaw+=turn;p.points=p.points.map(([x,y])=>[x*stretch,y]);}
 for(const p of m.roofs.filter(p=>include(p.role))){p.position=point(p.position);p.yaw+=turn;p.width*=stretch;}
 if(updateYaw)m.yaw+=turn;
}
export function buildKhaumaExterior(){
 const left=model("LeftTraditional");
 box(left,-10.05,1.83,-.4,6.4,3.3,5.4,"agedBrick","exterior-traditional-masonry",true);
 for(const [w,h,d,z]of [[6.9,.14,6.1,-.05],[7.2,.12,6.5,.05]])box(left,-10.05,h/2,z,w,h,d,"agedBrick","exterior-traditional-access-base",true);
 for(const x of [-11.15,-10.05,-8.95]){window(left,x,1.9,2.35,.9,1.25);shape(left,x,2.5,2.47,[[-.5,0],[-.48,.25],[-.26,.47],[0,.54],[.26,.47],[.48,.25],[.5,0]],.12,"carvedTimber","exterior-carved-window-arch");}
 box(left,-10.05,.8,2.4,3.8,.15,.3,"carvedTimber","exterior-carved-window-sill");tiledRoof(left,-10.05,-.4,3.55,7.45,6.5,1.5);
 box(left,-10.05,3.43,2.9,7.3,.18,.07,"exteriorWine","exterior-red-eave-fringe");
 box(left,-10.05,4.65,-.4,1.4,.5,1.25,"agedBrick","exterior-roof-vent");tiledRoof(left,-10.05,-.4,4.96,1.9,1.7,.5);
 const shops=model("LeftShops");
 shop(shops,-16.1,-1,5.3,2.7,"redMasonry");
 // Compact shop shell carries the terrace; only a shallow street-facing roof remains.
 for(const b of [...shops.boxes,...shops.colliders]){if(Math.abs(b.size[1]-2.7)<.001){b.size[1]+=.57;b.position[1]+=.285;}if(Math.abs(b.size[1]-.18)<.001&&b.position[1]>2.8)b.position[1]+=.57;}
 tiledRoof(shops,-16.1,1.95,3.1,5.9,1.8,.35);display(shops,-16.1,1.28,3.8);board(shops,-17.4,2.7);
 box(shops,-16.1,1.61,1.35,.16,2.74,.2,"carvedTimber","exterior-left-shop-centre-post",true);
 for(const b of shops.boxes)if(b.role==="exterior-pale-sign-band"){b.position[1]=3.3;b.size[1]=.4;}
 // One continuous low range: three commercial bays share a roof and platform edge.
 const deeper=model("LeftLaneShops");
 for(const x of [-28.3,-24.5,-20.7]){
  shop(deeper,x,2.1,3.8,2.55,"exteriorTeal");
  box(deeper,x,.62,4.5,3.1,.68,.12,"exteriorTeal","exterior-green-window-stall-base");
 }
 for(const b of deeper.boxes){if(b.role==="exterior-pale-sign-band"){b.position[1]=3.15;b.size[1]=.5;}if(/shop-jamb|shop-lintel/.test(b.role))b.material="exteriorTeal";}
 tiledRoof(deeper,-24.5,2.1,3.3,12.1,5.7,.6);
 // Limited older frontage joins the green range; no distant city expansion.
 const urban=model("LeftUrbanContext");shop(urban,-41.2,6.2,9.5,2.8,"agedBrick");
 box(urban,-42,4.63,5.8,8,2.85,6.2,"agedBrick","exterior-older-upper-storey",true);
 for(const x of [-44.6,-42,-39.4])window(urban,x,4.65,8.98,1.2,1.25);
 tiledRoof(urban,-42,5.8,6.15,9.2,7,.85);tiledRoof(urban,-37.1,6.3,3.4,2.2,5.3,.45);
 for(let i=0;i<6;i++)box(urban,-44.8+i*1.2,1.35,8.74,.65,1.65,.07,cloth[i%cloth.length],"exterior-older-textile-display");
 const terrace=model("LeftTerrace");
 box(terrace,-17.3,3.65,-1.1,6.7,.28,5.2,"redMasonry","exterior-terrace-floor",true);
 for(const z of [-3.55,1.35]){box(terrace,-17.3,4,z,6.7,.45,.18,"agedBrick","exterior-terrace-parapet",true);for(let i=0;i<10;i++)box(terrace,-20.4+i*.68,4.4,z,.055,.8,.055,"exteriorLeaf","exterior-terrace-rail");box(terrace,-17.3,4.8,z,6.7,.055,.07,"exteriorLeaf","exterior-terrace-handrail");}
 for(const [x,z,i]of [[-19.2,-1.9,0],[-16.7,-1.9,1],[-18.6,.4,2],[-15.8,.4,3]]){box(terrace,x,4.5,z,.8,.06,.8,"carvedTimber","exterior-terrace-table");profile(terrace,x,3.8,z,[[.035,0],[.035,2.05],[0,2.05]],"carvedTimber","exterior-umbrella-pole",6);profile(terrace,x,5.65,z,[[1.05,0],[1.07,.08],[.68,.32],[.08,.43],[0,.5]],i%2?"plaster":"exteriorLeaf","exterior-terrace-umbrella",8);}
 const near=model("RightGateShop");shop(near,9.15,.2,4.35,2.7,"agedBrick");tiledRoof(near,9.15,.2,3.72,5,5.45,.85);display(near,9.15,2.8,3.2);
 const right=model("RightCommercial");for(const [x,w,z]of [[13.6,4.4,1.1],[17.85,4.1,1.15],[22.2,4.5,.95]]){shop(right,x,z,w,2.8,"agedBrick");display(right,x,z+2.48,w-.8);board(right,x+w*.32,z+3.1,.6);box(right,x,3.25,z+2.9,w+.1,.13,1.2,"roof","exterior-shop-weathered-awning",false,0,.16);}
 for(let i=0;i<8;i++){const x=14+i*.43;box(right,x,.88,4.45,.38,1.55,.16,cloth[i%cloth.length],"exterior-pavement-textile-rack");for(let j=0;j<6;j++)box(right,x,.25+j*.22,4.55,.36,.025,.025,"exteriorOchre","exterior-textile-rack-stripe");}box(right,15.5,.7,4.45,3.5,1.4,.25,"carvedTimber","exterior-textile-rack-collision",true);
 box(right,15.5,1.72,4.43,3.5,.07,.16,"carvedTimber","exterior-textile-rack-top-rail");
 const upper=model("RightUpper");box(upper,17.9,4.97,1.1,13.1,2.2,4.7,"agedBrick","exterior-upper-brick-shell",true);
 for(let i=0;i<6;i++){const x=12.3+i*2.2;window(upper,x,5.05,3.5,1.3,1.28);box(upper,x,5.16,3.65,.09,2.15,.15,"carvedTimber","exterior-upper-timber-upright");}
 for(const y of [4.02,5.98])box(upper,17.9,y,3.6,13.15,.13,.2,"carvedTimber","exterior-upper-timber-band");tiledRoof(upper,17.9,1.1,6.15,14.4,6,1.5);
 const road=model("Road"),line=exteriorPlan.roadCentreline,widths=exteriorPlan.roadWidths;
 // Reuse ground batches (no new material/shadow system). Short sections gently
 // bend and taper; unequal pedestrian strips replace the 57 m forecourt slab.
 for(let i=1;i<line.length;i++){
  const a=line[i-1],b=line[i],length=Math.hypot(b[0]-a[0],b[1]-a[1]),yaw=Math.atan2(b[0]-a[0],b[1]-a[1]);
  box(road,(a[0]+b[0])/2,.027,(a[1]+b[1])/2,(widths[i-1]+widths[i])/2,.025,length+.03,"exteriorRoad","exterior-irregular-road",false,yaw);
  for(let j=1;j<length;j+=2.4){const t=j/length,w=(widths[i-1]*(1-t)+widths[i]*t)/2;for(const side of [-1,1])if((i+Math.floor(j))%4!==0)box(road,a[0]*(1-t)+b[0]*t+side*(w-.1),.043,a[1]*(1-t)+b[1]*t,.05,.005,.65,"exteriorMark","exterior-faded-road-edge",false,yaw);}
 }
 for(const [x,z,w,d]of [[-4.1,4.5,4.4,8],[-14,4.6,10,2],[-6,15,6,18],[-17.3,14.5,3.2,18],[-2.7,31,3,18],[3.8,15,3.5,22],[8.8,1.7,7,1.4],[3.4,33,2.6,14]])box(road,x,.019,z,w,.016,d,"exteriorPaving","exterior-asymmetric-pedestrian-margin");
 const props=model("StreetProps");board(props,-4.2,5.2);board(props,4.2,6.4,.62);
 for(const [x,z]of [[-15.1,6.5],[12.5,4]]){profile(props,x,0,z,[[.11,0],[.09,7.8],[0,7.8]],"neutral","exterior-utility-pole",8);box(props,x+.2,7.4,z,.6,.1,.18,"neutral","exterior-streetlight");box(props,x,.65,z,.5,1.3,.4,"exteriorTeal","exterior-utility-box",true);}
 // Sagging wire built from a few thin straight segments in the gate-local frame.
 for(let i=0;i<12;i++){const x=i===0?-15.1:-16.3+i*28.8/12,z=6.5-i*2.5/12,y=7.55-.5*Math.sin(i/12*Math.PI),nx=i===0?-13.9:x+28.8/12,nz=z-2.5/12,ny=7.55-.5*Math.sin((i+1)/12*Math.PI);box(props,(x+nx)/2,(y+ny)/2,(z+nz)/2,Math.hypot(nx-x,nz-z),.018,.018,"carvedTimber","exterior-overhead-wire",false,Math.atan2(-(nz-z),nx-x),Math.atan2(ny-y,nx-x));}
 for(const [x,z,h]of [[-13,-4.8,7],[-21,-5.5,7.5],[-35,-8,6.5]]){profile(props,x,0,z,[[.22,0],[.17,h*.66],[0,h*.7]],"carvedTimber","exterior-tree-trunk",7);for(let j=0;j<6;j++){const a=j*2.4;profile(props,x+Math.cos(a)*1.2,h-2+(j%2)*.6,z+Math.sin(a),[[0,0],[1.45,.5],[1.7,1.15],[1.15,2.25],[0,2.7]],j%2?"exteriorLeaf":"exteriorLeafShade","exterior-tree-canopy",7);}}
 for(const [x,z]of [[12,24],[-18,-4.4]]){box(props,x,.5,z,.8,1,.8,"exteriorTeal","exterior-street-bin",true);box(props,x,1.04,z,.87,.09,.87,"carvedTimber","exterior-bin-lid");}
 // One static parked motorcycle silhouette, away from the circulation line.
 for(const z of [5.9,7.45]){shape(props,23.4,.38,z,Array.from({length:12},(_,i)=>[Math.cos(i*Math.PI/6)*.35,Math.sin(i*Math.PI/6)*.35] as [number,number]),.12,"recess","exterior-parked-wheel",Math.PI/2);}
 box(props,23.4,.67,6.7,.38,.3,1.35,"exteriorBlue","exterior-parked-motorcycle-body",true);box(props,23.4,.95,6.6,.42,.12,.75,"recess","exterior-motorcycle-seat");box(props,23.4,1.15,7.25,.8,.065,.08,"neutral","exterior-motorcycle-handlebar");
 // Recompose complete buildings (including props/colliders), not camera facades.
 reframe(near,exteriorPlan.nearSource,exteriorPlan.nearCentre,exteriorPlan.rightTurn);
 for(const m of [right,upper])reframe(m,exteriorPlan.rightSource,exteriorPlan.rightCentre,exteriorPlan.rightTurn);
 reframe(urban,[-41.2,6.2],[-41.2,6.2],Math.PI/4);
 reframe(shops,[-16.1,-1],exteriorPlan.leftCommercialCentre,0,1.25);
 reframe(deeper,exteriorPlan.leftDepthSource,exteriorPlan.leftDepthCentre,exteriorPlan.leftTurn);
 reframe(terrace,[-17.3,-1.1],exteriorPlan.leftTerraceCentre,0,.98);
 // The existing parked motorcycle follows the shop range; no props remain at its old frontage.
 const bike=(role:string)=>role.startsWith("exterior-parked-")||role.startsWith("exterior-motorcycle-");
 reframe(props,exteriorPlan.rightSource,[9,13.9],exteriorPlan.rightTurn,1,bike,false);
 const assemblies=[left,shops,deeper,terrace,near,right,upper,road,props,urban];
 const pivots:[number,number][]=[[-10.05,-.4],exteriorPlan.leftCommercialCentre,exteriorPlan.leftDepthCentre,exteriorPlan.leftTerraceCentre,exteriorPlan.nearCentre,exteriorPlan.rightCentre,exteriorPlan.rightCentre,[0,20],[0,7],[-41.2,6.2]];
 assemblies.forEach((m,i)=>{const p=exteriorPoint(pivots[i][0],0,pivots[i][1]);m.origin=[p[0],p[2]];});
 return assemblies;
}
export const khaumaExteriorReviews={
 "khauma-exterior-front":{position:exteriorPoint(0,1.65,14),target:exteriorPoint(0,3.3,0),fov:66},
 "khauma-exterior-left":{position:exteriorPoint(-8,1.9,13),target:exteriorPoint(-18.5,2.6,0),fov:68},
 "khauma-exterior-right":{position:exteriorPoint(0,1.65,14),target:exteriorPoint(17,3.1,1),fov:66},
};
