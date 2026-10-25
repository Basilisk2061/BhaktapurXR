import type {CentralModel,CentralBox} from "./central-model.ts";
import {buildCarvedMuseumLion,buildCarvedMuseumRelief} from "./museum-sculptures.ts";
import {box,profile,shape} from "./remaining-models.ts";

// Photo-proportioned entrance details only: not a survey or named deity reconstruction.
import {museumEntrance} from "./museum-entrance-data.ts";
export {museumEntrance} from "./museum-entrance-data.ts";
/** Construction-time helper: call before palace interior clipping. */
export function museumEntranceCentre(m:CentralModel){
 const foundation=m.boxes.find(b=>b.role==="palace-foundation");
 if(!foundation)throw new Error(`museumEntranceCentre requires a pre-clipping palace-foundation box (model: ${m.id})`);
 return foundation.size[0]*(.5-.38)-4.1;
}
const signature=(b:{position:number[];size:number[];yaw:number})=>JSON.stringify([b.position,b.size,b.yaw]);
function remove(m:CentralModel,test:(b:CentralBox)=>boolean){const gone=new Set(m.boxes.filter(test).map(signature));m.boxes=m.boxes.filter(b=>!test(b));m.colliders=m.colliders.filter(c=>!gone.has(signature(c)));}
function localX(m:CentralModel,p:[number,number,number]){return (p[0]-m.origin[0])*Math.cos(m.yaw)-(p[2]-m.origin[1])*Math.sin(m.yaw);}
function lion(m:CentralModel,x:number){
 const r="museum-entrance-lions",y=.95,z=1.62;
 box(m,x,.47,z,1.22,.94,1.62,"stone",r+"-plinth",true);
 box(m,x,.96,z,1.36,.12,1.75,"stone",r+"-plinth-cap");
 for(const y of [.14,.79])box(m,x,y,z,1.34,.13,1.74,"stone",r+"-plinth-moulding");
 buildCarvedMuseumLion(m,x,y,z);
 box(m,x,y+.75,z,.72,1.5,1.18,"stone",r+"-collision",true);
}
function figure(m:CentralModel,x:number){
 const r="museum-entrance-figures",y=.72,z=.92;
 box(m,x,.36,z,1.05,.72,.93,"stone",r+"-base",true);
 for(const [y,w]of [[.14,1.13],[.38,1.07],[.64,1.0]])box(m,x,y,z,w,.12,1.02,"stone",r+"-stepped-base-band");
 buildCarvedMuseumRelief(m,x,y,z,x>museumEntranceCentre(m));
 box(m,x,y+1.08,z,.86,2.16,.55,"stone",r+"-collision",true);
}
function window(m:CentralModel,x:number,y:number,w:number,h:number,crest=true){
 const r="museum-entrance-door-window";
 box(m,x,y,.1,w,h,.1,"recess",r+"-recess");
 for(const side of [-1,1])box(m,x+side*(w/2+.09),y,.27,.22,h+.38,.32,"carvedTimber",r+"-jamb");
 for(const side of [-1,1])box(m,x,y+side*(h/2+.08),.29,w+.52,.18,.38,"carvedTimber",r+"-lintel");
 for(let i=1;i<8;i++)box(m,x-w/2+i*w/8,y,.3,.035,h,.06,"carvedTimber",r+"-lattice");
 for(let i=1;i<7;i++)box(m,x,y-h/2+i*h/7,.32,w,.034,.05,"carvedTimber",r+"-lattice");
 if(crest)shape(m,x,y+h/2+.22,.22,[[-w*.65,0],[-w*.52,.2],[-w*.24,.26],[0,.42],[w*.24,.26],[w*.52,.2],[w*.65,0]],.22,"carvedTimber",r+"-carved-crest");
}
export function refineMuseumEntrance(m:CentralModel){
 const x=museumEntranceCentre(m),wall=m.boxes.find(b=>b.role==="palace-masonry-west")!,width=wall.size[0],centre=localX(m,wall.position),left=centre-width/2,right=centre+width/2;
 remove(m,b=>b.role==="palace-masonry-west"||b.role==="guardian-base"||((/window|jamb|lattice|projecting-sill/.test(b.role))&&Math.abs(localX(m,b.position)-x)<3.7&&b.position[1]<6));
 m.profiles=m.profiles.filter(p=>p.role!=="gallery-guardian");
 m.shapes=m.shapes.filter(p=>!(/window/.test(p.role)&&Math.abs(localX(m,p.position)-x)<3.7&&p.position[1]<6));
 // The inherited continuous band must not cross the photographed upper arched opening.
 const band=m.boxes.find(b=>b.role==="gallery-pale-band"&&b.position[1]>5);
 if(band){const centre=localX(m,band.position),min=centre-band.size[0]/2,max=centre+band.size[0]/2;remove(m,b=>b===band);for(const [a,b]of [[min,x-.8],[x+.8,max]])box(m,(a+b)/2,band.position[1],.08,b-a,band.size[1],band.size[2],band.material,"gallery-pale-band");}
 // Cut a real doorway through the brick wall and its collider; keep original footprint.
 for(const [a,b]of [[left,x-.82],[x+.82,right]])box(m,(a+b)/2,4.45,-2.5,b-a,8.05,5,"agedBrick","museum-entrance-door-wall-flank",true);
 box(m,x,5.69,-2.5,1.64,5.57,5,"agedBrick","museum-entrance-door-wall-head",true);
 box(m,x,1.72,-1.6,1.64,2.56,.06,"recess","museum-entrance-door-dark-interior");
 for(const side of [-1,1]){
  box(m,x+side*.87,1.69,.12,.23,2.55,.5,"carvedTimber","museum-entrance-door-carved-jamb",true);
  box(m,x+side*1.03,1.69,.29,.08,2.78,.18,"carvedTimber","museum-entrance-door-outer-frame");
  for(let i=0;i<8;i++)profile(m,x+side*.88,.53+i*.29,.4,[[0,0],[.055,0],[.09,.08],[.055,.16],[0,.18]],"carvedTimber","museum-entrance-door-jamb-relief",6);
 }
 for(const [y,w]of [[2.91,2.35],[3.04,2.65],[3.16,2.48]])box(m,x,y,.18,w,.14,.58,"carvedTimber","museum-entrance-door-carved-lintel");
 shape(m,x,3.15,.24,[[-1.45,0],[-1.13,.2],[-.45,.26],[0,.38],[.45,.26],[1.13,.2],[1.45,0]],.16,"carvedTimber","museum-entrance-door-lintel-crest");
 box(m,x,.47,.05,1.65,.12,.85,"stone","museum-entrance-door-threshold",true);
 for(const side of [-1,1]){
  const px=x+side*1.15;
  box(m,px,1.85,.2,.3,2.78,.46,"plaster","museum-entrance-door-pale-column",true);
  for(const y of [.58,.81,2.64,2.87,3.14])box(m,px,y,.24,.43,.13,.56,"plaster","museum-entrance-door-column-moulding");
  profile(m,px,3.27,.21,[[0,0],[.17,0],[.15,.23],[.09,.37],[0,.42]],"road","museum-entrance-door-column-capital",8);
 }
 // The inherited continuous three-tread stone base remains unchanged.
 box(m,x,5.2,.31,3.06,.77,.14,"carvedTimber","museum-entrance-sign-frame");
 box(m,x,5.2,.393,2.88,.6,.025,"museumSign","museum-entrance-sign-board");
 window(m,x,3.96,1.42,1.1,false);window(m,x-3.1,4.04,.85,.62,false);
 shape(m,x,5.65,.11,[[-.58,0],[-.58,.76],[-.42,1.02],[0,1.16],[.42,1.02],[.58,.76],[.58,0]],.06,"recess","museum-entrance-door-upper-arched-window");
 for(const side of [-1,1])box(m,x+side*.66,6.17,.2,.18,1.4,.25,"carvedTimber","museum-entrance-door-upper-window-frame");
 box(m,x,6.86,.2,1.6,.18,.35,"carvedTimber","museum-entrance-door-upper-window-header");
 for(const side of [-1,1]){lion(m,x+side*3.08);figure(m,x+side*1.73);}
 for(const p of [...m.profiles,...m.shapes])if(p.role.startsWith("museum-entrance-lions-")&&p.material==="road")p.material="museumStone";
}
