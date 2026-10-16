import {Euler,Matrix4} from "three";
import overrides from "../../features/bhaktapur/data/manual-transform-overrides.json" with {type:"json"};
import type {CentralModel,CentralMaterial} from "./central-model.ts";
import {box,profile,shape} from "./remaining-models.ts";

// The approved gate is the sole registration control. Screenshots support relative
// appearance, not surveyed dimensions. +Z is outside; +X is reference-camera right.
const gate=overrides["khauma-gate"],matrix=new Matrix4().makeRotationFromEuler(new Euler(...gate.rotation as [number,number,number]));
export const exteriorFrame={origin:[gate.position[0],gate.position[2]] as [number,number],yaw:Math.atan2(matrix.elements[8],matrix.elements[10])};
export function exteriorPoint(x:number,y:number,z:number):[number,number,number]{const {origin,yaw}=exteriorFrame;return [origin[0]+x*Math.cos(yaw)+z*Math.sin(yaw),y,origin[1]-x*Math.sin(yaw)+z*Math.cos(yaw)];}
export const exteriorReplacedIds=new Set(["edge:khauma-south-flank:1159661606","edge:western-approach-low-roofs:1159661608","edge:western-approach-low-roofs:1159672142","edge:western-approach-low-roofs:1159672143"]);
export const exteriorEvidence={classification:"PHOTO_INFERRED",references:["Screenshot 2026-10-16 123805.png","Screenshot 2026-10-16 123816.png","Screenshot 2026-10-16 123826.png"],dimensions:"APPROXIMATE",limitations:"No survey solution. Rear shells, shop depth, merchandise counts and street continuation inferred; neutral signage, no business identities asserted."};
export const exteriorNames={LeftTraditional:"Khauma exterior / left traditional building",LeftShops:"Khauma exterior / left commercial sequence",LeftTerrace:"Khauma exterior / restaurant terrace",RightGateShop:"Khauma exterior / gate-side shop",RightCommercial:"Khauma exterior / right shop bays",RightUpper:"Khauma exterior / brick-timber upper storey",Road:"Khauma exterior / roadway and brick margins",StreetProps:"Khauma exterior / street furniture and greenery"};
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
export function buildKhaumaExterior(){
 const left=model("LeftTraditional");
 box(left,-10.05,1.83,-.4,6.4,3.3,5.4,"agedBrick","exterior-traditional-masonry",true);
 for(const [w,h,d,z]of [[6.9,.14,6.1,-.05],[7.2,.12,6.5,.05]])box(left,-10.05,h/2,z,w,h,d,"agedBrick","exterior-traditional-access-base",true);
 for(const x of [-11.15,-10.05,-8.95]){window(left,x,1.9,2.35,.9,1.25);shape(left,x,2.5,2.47,[[-.5,0],[-.48,.25],[-.26,.47],[0,.54],[.26,.47],[.48,.25],[.5,0]],.12,"carvedTimber","exterior-carved-window-arch");}
 box(left,-10.05,.8,2.4,3.8,.15,.3,"carvedTimber","exterior-carved-window-sill");tiledRoof(left,-10.05,-.4,3.55,7.45,6.5,1.5);
 box(left,-10.05,3.43,2.9,7.3,.18,.07,"exteriorWine","exterior-red-eave-fringe");
 box(left,-10.05,4.65,-.4,1.4,.5,1.25,"agedBrick","exterior-roof-vent");tiledRoof(left,-10.05,-.4,4.96,1.9,1.7,.5);
 const shops=model("LeftShops");
 shop(shops,-16.1,1,5.3,2.7,"redMasonry");tiledRoof(shops,-16.1,1,3.65,5.9,5.5,.55);display(shops,-16.1,3.28,3.8);board(shops,-17.4,4.7);
 // Lane opening between the terrace shops and green photography-like frontage.
 shop(shops,-24.5,2.1,5.4,2.65,"exteriorTeal");tiledRoof(shops,-24.5,2.1,3.65,6,5.4,.65);
 for(const x of [-26.2,-24.5,-22.8])box(shops,x,1.55,4.5,.16,2.4,.15,"exteriorTeal","exterior-painted-photo-front-frame");
 const terrace=model("LeftTerrace");
 box(terrace,-17.3,3.65,-1.1,6.7,.28,5.2,"redMasonry","exterior-terrace-floor",true);
 for(const z of [-3.55,1.35]){box(terrace,-17.3,4,z,6.7,.45,.18,"agedBrick","exterior-terrace-parapet",true);for(let i=0;i<10;i++)box(terrace,-20.4+i*.68,4.4,z,.055,.8,.055,"exteriorLeaf","exterior-terrace-rail");box(terrace,-17.3,4.8,z,6.7,.055,.07,"exteriorLeaf","exterior-terrace-handrail");}
 for(const [x,z,i]of [[-19.2,-1.9,0],[-16.7,-1.9,1],[-18.6,.4,2],[-15.8,.4,3]]){box(terrace,x,4.5,z,.8,.06,.8,"carvedTimber","exterior-terrace-table");profile(terrace,x,3.8,z,[[.035,0],[.035,2.05],[0,2.05]],"carvedTimber","exterior-umbrella-pole",6);profile(terrace,x,5.65,z,[[1.05,0],[1.07,.08],[.68,.32],[.08,.43],[0,.5]],i%2?"plaster":"exteriorLeaf","exterior-terrace-umbrella",8);}
 const near=model("RightGateShop");shop(near,9.15,.2,4.35,2.7,"agedBrick");tiledRoof(near,9.15,.2,3.72,5,5.45,.85);display(near,9.15,2.8,3.2);
 const right=model("RightCommercial");for(const [x,w,z]of [[13.6,4.4,1.1],[17.85,4.1,1.15],[22.2,4.5,.95]]){shop(right,x,z,w,2.8,"agedBrick");display(right,x,z+2.48,w-.8);board(right,x+w*.32,z+3.1,.6);box(right,x,3.25,z+2.9,w+.1,.13,1.2,"roof","exterior-shop-weathered-awning",false,0,.16);}
 for(let i=0;i<8;i++){const x=14+i*.43;box(right,x,.88,4.45,.38,1.55,.16,cloth[i%cloth.length],"exterior-pavement-textile-rack");for(let j=0;j<6;j++)box(right,x,.25+j*.22,4.55,.36,.025,.025,"exteriorOchre","exterior-textile-rack-stripe");}box(right,15.5,.7,4.45,3.5,1.4,.25,"carvedTimber","exterior-textile-rack-collision",true);
 box(right,15.5,1.72,4.43,3.5,.07,.16,"carvedTimber","exterior-textile-rack-top-rail");
 const upper=model("RightUpper");box(upper,17.9,4.97,.2,13.1,2.2,5.8,"agedBrick","exterior-upper-brick-shell",true);
 for(let i=0;i<6;i++){const x=12.3+i*2.2;window(upper,x,5.05,3.16,1.3,1.28);box(upper,x,5.16,3.3,.09,2.15,.15,"carvedTimber","exterior-upper-timber-upright");}
 for(const y of [4.02,5.98])box(upper,17.9,y,3.24,13.15,.13,.2,"carvedTimber","exterior-upper-timber-band");tiledRoof(upper,17.9,.2,6.15,14.4,7.2,1.5);
 const road=model("Road");box(road,0,.027,20,5.25,.025,40,"exteriorRoad","exterior-worn-grey-road");for(const s of [-1,1]){box(road,s*5.7,.019,20,6.1,.016,40,"exteriorPaving","exterior-brick-pedestrian-margin");for(let i=0;i<23;i++)if(i%4!==0)box(road,s*2.45,.044,1.5+i*1.6,.065,.005,.85,"exteriorMark","exterior-faded-road-edge");}
 // A continuous forecourt joins both storefront rows; lane at x=-20 stays open.
 box(road,0,.02,7.5,57,.018,7,"exteriorPaving","exterior-shop-forecourt");box(road,0,.035,7.5,5.25,.014,7.1,"exteriorRoad","exterior-road-through-forecourt");
 const props=model("StreetProps");board(props,-4.2,5.2);board(props,4.2,6.4,.62);
 for(const [x,z]of [[-21,8],[26,5]]){profile(props,x,0,z,[[.11,0],[.09,7.8],[0,7.8]],"neutral","exterior-utility-pole",8);box(props,x+.2,7.4,z,.6,.1,.18,"neutral","exterior-streetlight");box(props,x,.65,z,.5,1.3,.4,"exteriorTeal","exterior-utility-box",true);}
 // Sagging wire built from a few thin straight segments in the gate-local frame.
 for(let i=0;i<12;i++){const x=-21+i*47/12,z=8-i*3/12,y=7.55-.5*Math.sin(i/12*Math.PI),nx=x+47/12,nz=z-3/12,ny=7.55-.5*Math.sin((i+1)/12*Math.PI);box(props,(x+nx)/2,(y+ny)/2,(z+nz)/2,Math.hypot(nx-x,nz-z),.018,.018,"carvedTimber","exterior-overhead-wire",false,Math.atan2(-(nz-z),nx-x),Math.atan2(ny-y,nx-x));}
 for(const [x,z,h]of [[-13,-4.8,7],[-19,-5.4,7.5],[-26,-3,6.5]]){profile(props,x,0,z,[[.22,0],[.17,h*.66],[0,h*.7]],"carvedTimber","exterior-tree-trunk",7);for(let j=0;j<6;j++){const a=j*2.4;profile(props,x+Math.cos(a)*1.2,h-2+(j%2)*.6,z+Math.sin(a),[[0,0],[1.45,.5],[1.7,1.15],[1.15,2.25],[0,2.7]],j%2?"exteriorLeaf":"exteriorLeafShade","exterior-tree-canopy",7);}}
 for(const [x,z]of [[25,6],[-27,6]]){box(props,x,.5,z,.8,1,.8,"exteriorTeal","exterior-street-bin",true);box(props,x,1.04,z,.87,.09,.87,"carvedTimber","exterior-bin-lid");}
 // One static parked motorcycle silhouette, away from the circulation line.
 for(const z of [5.9,7.45]){shape(props,23.4,.38,z,Array.from({length:12},(_,i)=>[Math.cos(i*Math.PI/6)*.35,Math.sin(i*Math.PI/6)*.35] as [number,number]),.12,"recess","exterior-parked-wheel",Math.PI/2);}
 box(props,23.4,.67,6.7,.38,.3,1.35,"exteriorBlue","exterior-parked-motorcycle-body",true);box(props,23.4,.95,6.6,.42,.12,.75,"recess","exterior-motorcycle-seat");box(props,23.4,1.15,7.25,.8,.065,.08,"neutral","exterior-motorcycle-handlebar");
 // Keep geometry in world space, but give each editable assembly a useful local pivot.
 const assemblies=[left,shops,terrace,near,right,upper,road,props],pivots=[[-10.05,-.4],[-20,1.8],[-17.3,-1.1],[9.15,.2],[17.8,1.1],[17.9,.2],[0,20],[0,0]];
 assemblies.forEach((m,i)=>{const p=exteriorPoint(pivots[i][0],0,pivots[i][1]);m.origin=[p[0],p[2]];});
 return assemblies;
}
export const khaumaExteriorReviews={
 "khauma-exterior-front":{position:exteriorPoint(0,1.65,14),target:exteriorPoint(0,3.3,0),fov:66},
 "khauma-exterior-left":{position:exteriorPoint(0,1.65,14),target:exteriorPoint(-14,2.8,1),fov:68},
 "khauma-exterior-right":{position:exteriorPoint(0,1.65,14),target:exteriorPoint(17,3.1,1),fov:66},
};
