import type {CentralModel,CentralMaterial} from "./central-model.ts";
import {box,profile,shape} from "./remaining-models.ts";
import editorFrames from "./central-ensemble-editor-frames.json" with {type:"json"};
const stone:CentralMaterial="heritageStone",shade:CentralMaterial="heritageStoneShade",metal:CentralMaterial="ensembleBronze";
export const centralEnsembleIds=["vatsala-durga","large-bell","malla-column","vatsala-bell"] as const;
export const centralEnsembleEvidence={classification:"PHOTO_INFERRED",dimensions:"APPROXIMATE",references:["reference/vatsala-area/vatsala-front-reference.jpg","reference/vatsala-area/vatsala-side-reference.jpg"],spatial:"Existing Phase 6C / project-audit anchors retained; photographs do not determine plan coordinates",stairs:"Existing west access retained; new courses are cut around its flight, not laid across it"};
function fresh(source:CentralModel):CentralModel{
 return {...source,editorPartSources:editorFrames[source.id as keyof typeof editorFrames],boxes:[],profiles:[],shapes:[],roofs:[],colliders:[],volumes:[],polygonRoofs:[]} as CentralModel;
}
function course(m:CentralModel,y:number,h:number,w:number,d:number,role:string,slot=false){
 // Three solids leave the west stair channel genuinely open, including in the collision model.
 const cut=-2.05,half=.76;
 if(slot){for(const sign of [-1,1])box(m,0,y,sign*(d/2+half)/2,w,h,d/2-half,stone,role,true);box(m,(cut+w/2)/2,y,0,w/2-cut,h,half*2,stone,role,true);}
 else box(m,0,y,0,w,h,d,stone,role,true);
}
function moulding(m:CentralModel,y:number,width:number,depth:number,role:string){
 for(const [dy,h,p]of [[0,.08,0],[.095,.11,.1],[.205,.14,.16]] as const)box(m,0,y+dy,0,width+p,h,depth+p,stone,role);
}
function facePoint(x:number,z:number,yaw:number):[number,number]{return [x*Math.cos(yaw)+z*Math.sin(yaw),-x*Math.sin(yaw)+z*Math.cos(yaw)];}
function niche(m:CentralModel,x:number,y:number,z:number,w:number,h:number,role:string,yaw=0,relief=true){
 const outer:[number,number][]=[[-w*.63,0],[-w*.63,h*.68],[-w*.45,h*.81],[0,h],[w*.45,h*.81],[w*.63,h*.68],[w*.63,0],[w*.4,0],[w*.4,h*.61],[0,h*.79],[-w*.4,h*.61],[-w*.4,0]];
 shape(m,x,y,z,outer,.14,stone,role+"-framed-niche",yaw);
 const [dx,dz]=facePoint(0,-.025,yaw);shape(m,x+dx,y,z+dz,[[-w*.4,0],[-w*.4,h*.61],[0,h*.79],[w*.4,h*.61],[w*.4,0]],.025,"recess",role+"-niche-recess",yaw);
 const [fx,fz]=facePoint(0,.035,yaw);if(relief)profile(m,x+fx,y+.08,z+fz,[[0,0],[w*.17,0],[w*.18,h*.2],[w*.11,h*.44],[w*.14,h*.53],[0,h*.64]],stone,role+"-niche-relief",12);
}
function miniatureTower(m:CentralModel,x:number,y:number,z:number){
 box(m,x,y+.11,z,.92,.22,.92,shade,"vatsala-subsidiary-spire-base");
 for(const sx of [-1,1])for(const sz of [-1,1])profile(m,x+sx*.28,y+.22,z+sz*.28,[[.11,0],[.12,.08],[.065,.13],[.065,.62],[.13,.7],[0,.73]],stone,"vatsala-subsidiary-spire-columns",12);
 for(const face of [0,Math.PI/2,Math.PI,Math.PI*1.5]){const [dx,dz]=facePoint(0,.24,face);niche(m,x+dx,y+.25,z+dz,.29,.62,"vatsala-subsidiary-spire",face);}
 for(const [dy,w]of [[.94,1.03],[1.08,.92],[1.21,.78]] as const)box(m,x,y+dy,z,w,.15,w,stone,"vatsala-subsidiary-spire-cornice");
 profile(m,x,y+1.27,z,[[0,0],[.51,0],[.47,.15],[.39,.28],[.33,.43],[.23,.62],[.15,.68],[0,.72]],stone,"vatsala-subsidiary-spire-crown",4);
 profile(m,x,y+1.97,z,[[.18,0],[.21,.07],[.11,.17],[.14,.24],[.06,.38],[0,.48]],stone,"vatsala-subsidiary-spire-finial",16);
}
function temple(m:CentralModel){
 const base=3.1;
 // Three setbacks, each with a differently weighted foot, ashlar field and coping.
 for(let tier=0;tier<3;tier++){
  const y=tier*.84,w=5.8-tier*.42,d=6.05-tier*.42;
  for(const [dy,h,projection]of [[0,.14,0],[.14,.13,-.09],[.27,.4,-.17],[.67,.1,-.1],[.77,.07,.035]] as const)course(m,y+dy+h/2,h,w+projection,d+projection,"vatsala-stepped-base-course",true);
 }
 course(m,2.63,.22,4.7,4.85,"vatsala-platform-neck",true);course(m,2.86,.24,4.82,4.97,"vatsala-platform-coping",true);course(m,3.04,.12,4.7,4.85,"vatsala-platform-landing",true);
 for(let i=0;i<18;i++){const top=(i+1)*base/18;box(m,-6.1+i*.22,top/2,0,.235,top,1.4,stone,"vatsala-west-access-stair",true);box(m,-6.1+i*.22-.007,top-.025,0,.25,.05,1.44,stone,"vatsala-west-stair-nosing");}
 box(m,-2.12,base-.065,0,.72,.13,1.44,stone,"vatsala-west-stair-landing",true);
 for(const side of [-1,1])for(let i=0;i<18;i++){const top=(i+1)*base/18;box(m,-6.1+i*.22,top/2,side*.8,.22,top,.14,shade,"vatsala-west-stair-cheek",true);}
 box(m,0,base+1.62,0,2.34,3.24,2.34,shade,"vatsala-sanctum",true);
 for(let i=0;i<12;i++){const side=Math.floor(i/3),t=(i%3-1)*1.3,x=side===0?t:side===1?1.82:side===2?t:-1.82,z=side===0?1.82:side===1?t:side===2?-1.82:t;
  box(m,x,base+.085,z,.46,.17,.46,stone,"vatsala-column-foot");
  profile(m,x,base+.17,z,[[.24,0],[.26,.1],[.19,.2],[.17,.29],[.15,2.3],[.19,2.45],[.28,2.51],[.28,2.64],[.35,2.72],[0,2.75]],stone,"vatsala-twelve-column",16);
  box(m,x,base+2.97,z,.48,.22,.48,stone,"vatsala-column-abacus");box(m,x,base+1.6,z,.32,3.2,.32,stone,"vatsala-column-collision",true);
 }
 for(const face of [0,Math.PI/2,Math.PI,Math.PI*1.5]){
  for(const offset of [-.65,.65]){const [x,z]=facePoint(offset,1.82,face);shape(m,x,base+2.66,z,[[-.65,0],[-.65,.53],[.65,.53],[.65,0],[.49,.07],[.35,.24],[.16,.31],[0,.43],[-.16,.31],[-.35,.24],[-.49,.07]],.23,stone,"vatsala-columned-lobed-arch",face);}
  if(face===0){const [x,z]=facePoint(0,1.185,face);niche(m,x,base+.1,z,.82,2.65,"vatsala-south-sanctum-door",face,false);}
 }
 for(const [y,w]of [[6.28,4.12],[6.54,4.46],[6.81,4.67],[7.08,4.38]] as const)moulding(m,y,w,w,"vatsala-colonnade-entablature");
 for(const face of [0,Math.PI/2,Math.PI,Math.PI*1.5])for(let i=0;i<19;i++){
  const [x,z]=facePoint((i-9)*.225,2.3,face);box(m,x,6.75,z,.09,.13,.12,shade,"vatsala-cornice-dentil",false,face);
  const [a,b]=facePoint((i-9)*.225,2.23,face);profile(m,a,7.01,b,[[0,0],[.065,.025],[.075,.08],[.045,.13],[0,.15]],stone,"vatsala-carved-rosette-band",10);
 }
 const y0=7.35,height=6.9;
 const radius=(t:number)=>2.13*(1-.72*t-.09*Math.sin(t*Math.PI));
 const rings:[number,number][]=[[0,0]];for(let i=0;i<=24;i++){const t=i/24;rings.push([radius(t),height*t]);}rings.push([0,height]);profile(m,0,y0,0,rings,stone,"vatsala-main-shikhara",4);
 for(let i=0;i<18;i++){const t=(i+.3)/18,r=radius(t);profile(m,0,y0+height*t,0,[[r,0],[r+.045,.025],[r+.045,.065],[r,.095]],i%3===0?shade:stone,"vatsala-shikhara-course-band",4);}
 for(const face of [0,Math.PI/2,Math.PI,Math.PI*1.5]){
  for(let level=0;level<20;level++){const t=(level+.5)/21,r=radius(t),half=r/Math.SQRT2;
   for(const off of [-.63,-.3,0,.3,.63]){const [x,z]=facePoint(off*half,half+.025,face);box(m,x,y0+height*t,z,.07+(off===0?.035:0),.34,.085,shade,"vatsala-shikhara-vertical-rib",false,face);}
  }
  const [x,z]=facePoint(0,1.52,face);niche(m,x,y0+.08,z,.83,1.85,"vatsala-shikhara-projecting",face);
  const [a,b]=facePoint(0,radius(3.7/height)/Math.SQRT2+.015,face);niche(m,a,y0+3.7,b,.33,.85,"vatsala-shikhara-upper",face);
 }
 for(const x of [-1.48,1.48])for(const z of [-1.48,1.48])miniatureTower(m,x,y0,z);
 for(const [y,w]of [[14.1,1.15],[14.3,1.3],[14.48,1.2]] as const)moulding(m,y,w,w,"vatsala-shikhara-upper-cornice");
 profile(m,0,14.78,0,[[0,0],[.47,0],[.5,.14],[.43,.32],[.34,.38],[.4,.46],[.26,.56],[.31,.68],[.18,.82],[.2,.91],[.09,1.04],[0,1.12]],stone,"vatsala-pinnacle",24);
 profile(m,0,15.84,0,[[.07,0],[.12,.06],[.07,.16],[0,.26]],metal,"vatsala-finial",16);
}
function bellBody(m:CentralModel,y:number,r:number,height:number){
 const h=height;profile(m,0,y,0,[[r*.85,0],[r*1.07,.035*h],[r*1.09,.09*h],[r,.14*h],[r*.82,.28*h],[r*.62,.7*h],[r*.55,.86*h],[r*.3,.97*h],[.055,h],[.055,h*.88],[r*.45,h*.8],[r*.54,h*.4],[r*.8,h*.13],[r*.85,0]],metal,m.id==="large-bell"?"large-hollow-bell":"small-hollow-bell",32);
 for(const t of [.13,.3,.73])profile(m,0,y+h*t,0,[[r*(t<.4?.97:.62),0],[r*(t<.4?1.01:.65),.035],[r*(t<.4?.97:.62),.07]],metal,"bell-relief-ring",32);
 box(m,0,y+.05,0,.075,.4,.075,metal,"bell-clapper");profile(m,0,y+h,0,[[.09,0],[.15,.08],[.12,.2],[.07,.24],[0,.25]],metal,"bell-crown-hanger",16);
}
function largeBell(m:CentralModel){
 for(const [y,w,d,h]of [[.09,2.2,2.5,.18],[.29,2.08,2.38,.22],[.7,1.94,2.25,.6],[1.05,2.13,2.42,.1],[1.17,2.2,2.5,.14]] as const)box(m,0,y,0,w,h,d,stone,"bell-platform-course",true);
 for(const x of [-.78,.78])for(const z of [-.85,.85]){
  box(m,x,1.31,z,.55,.15,.61,shade,"bell-support-foot");box(m,x,3.45,z,.43,4.15,.5,stone,"bell-support-pier",true);
  for(const y of [1.55,5.48,5.65])box(m,x,y,z,.57,.14,.64,stone,"bell-support-capital");
 }
 box(m,0,5.91,0,2.35,.38,2.4,"carvedTimber","bell-head-beam");
 for(const x of [-.78,.78])for(const z of [-.85,.85])shape(m,x,5.36,z,[[-.11,0],[-.29,.38],[-.47,.43],[-.44,.53],[.12,.53],[.12,0]],.2,"carvedTimber","bell-roof-bracket");
 m.roofs.push({position:[m.origin[0],6.1,m.origin[1]],width:3.35,depth:3.25,rise:.55,yaw:m.yaw,material:"roof",role:"large-bell-tile-roof"});
 box(m,0,6.065,0,3.32,.13,3.2,"carvedTimber","bell-roof-eave");box(m,0,6.08,0,3.3,.12,3.18,"carvedTimber","bell-roof-collision",true);
 for(const side of [-1,1])box(m,0,6.06,side*1.63,3.35,.07,.06,"shutter","bell-roof-red-trim");
 for(const side of [-1,1])for(const end of [-1,1])shape(m,side*1.58,6.1,end*1.53,[[0,0],[side*.22,.06],[side*.34,.28],[side*.26,.37],[side*.12,.16],[-side*.1,.09]],.08,"roof","bell-roof-upturn");
 bellBody(m,3.27,.55,1.65);box(m,0,5.45,0,.07,.56,.07,metal,"bell-suspension");
 for(let i=0;i<6;i++){const h=(i+1)*1.24/6;box(m,0,h/2,2.75-i*.25,1.02,h,.26,stone,"bell-platform-stair",true);}
}
function smallBell(m:CentralModel){
 for(const [y,w,d,h]of [[.1,1.8,1.05,.2],[.3,1.68,.95,.2],[.44,1.82,1.08,.08]] as const)box(m,0,y,0,w,h,d,stone,"small-bell-platform-course",true);
 for(const side of [-1,1]){profile(m,side*.68,.48,0,[[.24,0],[.25,.15],[.18,.27],[.14,2.1],[.21,2.25],[.28,2.4],[0,2.45]],stone,"bell-arch-column",16);box(m,side*.68,1.7,0,.3,2.44,.36,stone,"bell-arch-column-collision",true);}
 shape(m,0,2.95,0,[[-1,0],[-1,.62],[-.7,.72],[-.37,.66],[0,.91],[.37,.66],[.7,.72],[1,.62],[1,0],[.48,0],[.36,.16],[0,.37],[-.36,.16],[-.48,0]],.38,stone,"bell-ornate-lobed-lintel");
 for(const x of [-.7,.7])profile(m,x,3.2,.4,[[0,0],[.13,.02],[.15,.1],[.08,.18],[0,.2]],shade,"bell-carved-rosette",12);
 profile(m,0,3.79,0,[[.18,0],[.23,.08],[.15,.18],[.13,.3],[0,.41]],stone,"bell-arch-central-crown",16);
 bellBody(m,1.55,.33,1.1);box(m,0,3.11,0,.05,.5,.05,metal,"bell-suspension");
}
function column(m:CentralModel){
 for(const [y,w,h]of [[.07,1.26,.14],[.2,1.17,.12],[.34,1.05,.16],[.45,1.2,.06]] as const)box(m,0,y,0,w,h,w,stone,"malla-plinth-course",true);
 profile(m,0,.48,0,[[0,0],[.44,0],[.45,.17],[.34,.29],[.3,.4],[.275,5.55],[.36,5.67],[.43,5.75],[0,5.77]],stone,"malla-shaft",20);box(m,0,3.26,0,.55,5.56,.55,stone,"malla-column-collision",true);
 profile(m,0,6.21,0,[[.37,0],[.42,.09],[.55,.17],[.65,.38],[.62,.64],[.49,.85],[.37,.94],[0,.98]],metal,"malla-lotus-capital",24);
 for(let i=0;i<12;i++){const a=i*Math.PI/6;profile(m,Math.cos(a)*.47,6.25,Math.sin(a)*.47,[[0,0],[.14,.05],[.16,.19],[.11,.3],[0,.35]],metal,"malla-lotus-petal",12);}
 box(m,0,7.22,0,.8,.12,.75,metal,"malla-royal-seat");profile(m,0,7.28,0,[[0,0],[.3,0],[.33,.14],[.22,.29],[.2,.67],[.11,.75],[.16,.79],[.21,.96],[.18,1.12],[.09,1.2],[0,1.23]],metal,"malla-seated-royal-figure",20);
 for(const side of [-1,1]){box(m,side*.15,7.91,-.15,.105,.46,.12,metal,"malla-prayer-arms",false,0,side*.38);profile(m,side*.19,7.37,.16,[[0,0],[.17,.04],[.21,.14],[.12,.22],[0,.25]],metal,"malla-seated-knee",16);}
 box(m,0,8.09,-.24,.12,.18,.13,metal,"malla-joined-hands");box(m,.46,8,.1,.035,1.56,.035,metal,"malla-parasol-stem");profile(m,.46,8.78,.1,[[0,0],[.45,0],[.46,.065],[.36,.14],[.28,.28],[.1,.36],[.12,.43],[0,.49]],metal,"malla-parasol",24);
}
/** Replaces the four assemblies, never overlays legacy geometry or modifies evidence anchors. */
export function refineCentralStoneEnsemble(source:CentralModel){
 if(!centralEnsembleIds.includes(source.id as typeof centralEnsembleIds[number]))return source;
 const m=fresh(source);if(m.id==="vatsala-durga")temple(m);else if(m.id==="large-bell")largeBell(m);else if(m.id==="vatsala-bell")smallBell(m);else column(m);return m;
}
