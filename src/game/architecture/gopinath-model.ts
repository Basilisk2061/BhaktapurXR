import {partitionArchitecturalParts} from "../../features/world-editor/parts.ts";
import {box,profile,shape} from "./architecture-primitives.ts";
import type {CentralModel} from "./central-model.ts";
import {connectedStrut} from "./west-models.ts";

/** Identity facts are sourced; these working dimensions are NOT measured drawings. */
export const entrancePagodaPhotoEvidence={
 id:"gopinath-krishna",identity:"Gopinath / Dwarika / Krishna; Radhakrishna local name",
 identityConfidence:"PROVISIONALLY_IDENTIFIED",form:"PHOTO_INFERRED",dimensions:"APPROXIMATE",
 sources:["https://whc.unesco.org/document/171737#page=32","https://www.bhaktapur.com/discover/radhakrishna-temple/"],
 reference:"User-supplied frontal and oblique photographs; front pillar is separate from shrine",
 platformTop:1.8,lowerShrine:{width:9.2,depth:7.6,height:3.8},galleryHeight:1.3,
 lowerRoof:{width:16.8,depth:15.2,eave:7.3,rise:2.55},
 upperTier:{width:4.8,depth:4.2,height:3.1},upperRoof:{width:8.6,depth:7.8,eave:12,rise:1.65},overallTop:14.7,
 limitations:"No reliable measured dimensions located for the Bhaktapur monument. Exact carving, rear openings and surveyed footprint remain unresolved. Kathmandu Gopinath structural studies excluded."
} as const;

/** Layered carved surrounds: actual setback, side reveals, stepped lintels and relief panels. */
function portal(m:CentralModel,x:number,bottom:number,z:number,w:number,h:number,screen:boolean){
 box(m,x,bottom+h/2,z-.62,w+.65,h+.38,.15,"carvedTimber","gopinath-recessed-timber-panel");
 box(m,x,bottom+h/2,z-.52,w,h,.05,"recess","gopinath-inner-door-shadow");
 for(let layer=0;layer<4;layer++){
  const offset=w/2+.075+layer*.09;
  for(const side of [-1,1])box(m,x+side*offset,bottom+h/2,z-.32+layer*.11,.12,h+.2+layer*.14,.26,"carvedTimber","gopinath-layered-portal-jamb");
  box(m,x,bottom+h+.08+layer*.1,z-.3+layer*.11,w+.4+layer*.21,.15,.3,"carvedTimber","gopinath-layered-portal-lintel");
 }
 box(m,x,bottom-.05,z-.1,w+.7,.18,.65,"carvedTimber","gopinath-portal-threshold");
 if(screen){
  for(const side of [-1,1])box(m,x+side*w*.25,bottom+h/2,z-.46,w*.46,h-.12,.06,"timber","gopinath-recessed-door-leaf");
  for(let i=0;i<5;i++)box(m,x-w*.4+i*w*.2,bottom+h/2,z-.4,.035,h-.18,.05,"carvedTimber","gopinath-panel-vertical-carving");
  for(const y of [bottom+.25,bottom+h-.25])box(m,x,y,z-.37,w-.1,.08,.1,"carvedTimber","gopinath-panel-carved-rail");
 }
 // Pointed timber crest, kept architectural rather than invented deity iconography.
 shape(m,x,bottom+h+.33,z-.08,[[-w*.65,0],[-w*.5,.2],[0,.43],[w*.5,.2],[w*.65,0]],.16,"carvedTimber","gopinath-portal-pointed-crest");
}

function templeRoof(m:CentralModel,y:number,w:number,d:number,rise:number,bw:number,bd:number,head:number,upper:boolean){
 const tag=upper?"upper":"main";
 m.roofs.push({position:[m.origin[0],y,m.origin[1]],width:w,depth:d,rise,yaw:m.yaw,material:"roof",role:`gopinath-reference-${tag}-tile-shell`},
 {position:[m.origin[0],y-.12,m.origin[1]],width:w-.12,depth:d-.12,rise:0,yaw:m.yaw,material:"timber",family:"SOFFIT",innerWidth:bw,innerDepth:bd,drop:y-.12-head,role:`gopinath-${tag}-sloping-soffit`});
 // Two deep eave courses, numerous rafter ends and full-length principal rafters.
 for(let face=0;face<4;face++){
  const saved=m.yaw;m.yaw+=face*Math.PI/2;
  const span=face%2?d:w,outer=(face%2?w:d)/2,inner=(face%2?bw:bd)/2,bodySpan=face%2?bd:bw;
  box(m,0,y-.19,outer-.1,span,.42,.3,"carvedTimber",`gopinath-${tag}-deep-fascia`);
  box(m,0,y-.42,outer-.16,span-.15,.12,.26,"timber",`gopinath-${tag}-lower-fascia-band`);
  for(let x=-span/2+.3;x<span/2-.2;x+=.4)box(m,x,y-.22,outer-.43,.08,.13,.7,"timber",`gopinath-${tag}-rafter-end`);
  for(let x=-bodySpan*.44;x<bodySpan*.45;x+=.55){
   connectedStrut(m,x,head-.025,inner,y-.18,outer-.15,`gopinath-${tag}-full-rafter`);
   const rafter=m.boxes[m.boxes.length-1];rafter.size[0]=.11;rafter.size[2]=.13;
  }
  const count=upper?5:7;
  for(let i=0;i<count;i++){
   const x=-bodySpan*.43+i*bodySpan*.86/(count-1);
   connectedStrut(m,x,head-.1,inner+.02,y-.2,outer-.25,`gopinath-${tag}-structural-strut`);
   const b=m.boxes[m.boxes.length-1];b.size[0]=upper?.29:.36;b.size[2]=upper?.32:.4;
   // Shallow relief blocks suggest carved mass without figurative inventions.
   box(m,x,head+.12,inner+.15,upper?.36:.46,.3,.24,"carvedTimber",`gopinath-${tag}-strut-foot-relief`);
  }
  m.yaw=saved;
 }
 box(m,0,y+rise-.04,0,Math.max(.6,w-d)+.55,.2,.36,"roof",`gopinath-${tag}-ridge-cap`);
}

export function buildReferenceGopinath(source:CentralModel):CentralModel{
 const m:CentralModel={...source,accuracy:"PHOTO_INFERRED",boxes:[],profiles:[],shapes:[],roofs:[],colliders:[],volumes:[],polygonRoofs:[]};
 Object.assign(m,{editorPartSources:Object.fromEntries(partitionArchitecturalParts(source).map(p=>[p.id,p.source]))});
 // The solid sanctuary stops behind the deeply inset facade; no flat brick face behind its frames.
 box(m,0,3.7,-.55,9.2,3.8,6.5,"agedBrick","gopinath-solid-sanctuary",true);
 for(const side of [-1,1]){
  box(m,side*3.775,3.7,3.25,1.65,3.8,1.1,"agedBrick","gopinath-front-masonry-shoulder",true);
  for(const y of [2.4,4.4]){
   box(m,side*3.72,y,3.87,.75,.12,.32,"brick","gopinath-projecting-masonry-niche-course");
   box(m,side*3.72,y-.2,3.82,.38,.3,.16,"carvedTimber","gopinath-shoulder-blind-panel");
  }
 }
 box(m,0,5.19,3.27,5.9,.82,1.06,"agedBrick","gopinath-front-masonry-head",true);
 portal(m,0,1.8,3.78,1.35,2.4,false);
 for(const x of [-1.95,1.95])portal(m,x,2.05,3.68,1.15,2.12,true);
 for(const x of [-2.86,-.94,.94,2.86]){
  box(m,x,3.62,3.84,.24,3.56,.35,"carvedTimber","gopinath-facade-structural-division");
  for(const y of [2.15,4.72])box(m,x,y,3.98,.43,.22,.25,"carvedTimber","gopinath-facade-member-capital");
 }
 // Multiple projecting cornices wrap the whole shrine, with deeper relief along the main facade.
 for(let face=0;face<4;face++){
  const saved=m.yaw;m.yaw+=face*Math.PI/2;const w=face%2?7.6:9.2,d=face%2?9.2:7.6;
  for(const [y,h,projection] of [[5.03,.16,.22],[5.29,.22,.32],[5.57,.18,.43]])box(m,0,y,d/2+.06,w+projection,h,.38,"carvedTimber","gopinath-continuous-cornice");
  for(let x=-w/2+.3;x<w/2-.2;x+=.45)box(m,x,5.44,d/2+.23,.13,.18,.25,"carvedTimber","gopinath-cornice-bracket");
  // Rear/side doors are deliberately not invented: a smaller framed blind panel only.
  if(face!==0)portal(m,0,2.5,d/2+.68,1,1.3,true);
  m.yaw=saved;
 }
 // Recessed gallery: small back mass plus actual reveal depth and structural bay divisions.
 box(m,0,6.25,0,7.8,1.3,6.2,"agedBrick","gopinath-gallery-backing",true);
 for(let face=0;face<4;face++){
  const saved=m.yaw;m.yaw+=face*Math.PI/2;const w=face%2?7.6:9.2,d=face%2?9.2:7.6;
  for(const x of [-w*.3,0,w*.3]){
   box(m,x,6.27,d/2-.64,w*.21,.86,.08,"recess","gopinath-gallery-recessed-opening");
   for(const side of [-1,1])box(m,x+side*w*.12,6.25,d/2-.2,.24,1.24,.38,"carvedTimber","gopinath-gallery-post");
   box(m,x,5.76,d/2-.27,w*.24,.14,.42,"carvedTimber","gopinath-gallery-sill");
  }
  box(m,0,6.87,d/2-.13,w+.22,.3,.48,"carvedTimber","gopinath-gallery-head");m.yaw=saved;
 }
 templeRoof(m,7.3,16.8,15.2,2.55,9.3,7.7,5.53,false);
 // Upper walls begin inside the lower hip, making the roof-to-storey transition continuous.
 box(m,0,10.2,0,3.6,3.1,3,"agedBrick","gopinath-upper-setback-core");
 for(const x of [-2.1,2.1])for(const z of [-1.8,1.8])box(m,x,10.2,z,.6,3.1,.6,"agedBrick","gopinath-upper-corner-pier");
 box(m,0,8.98,0,4.8,.66,4.2,"agedBrick","gopinath-upper-masonry-apron");
 box(m,0,11.58,0,4.8,.34,4.2,"agedBrick","gopinath-upper-masonry-head");
 for(let face=0;face<4;face++){
  const saved=m.yaw;m.yaw+=face*Math.PI/2;const w=face%2?4.2:4.8,d=face%2?4.8:4.2;
  for(const x of [-w*.27,0,w*.27])portal(m,x,9.48,d/2+.45,.64,1.12,true);
  for(const y of [9.27,11.35,11.64])box(m,0,y,d/2+.14,w+.38,.2,.42,"carvedTimber","gopinath-upper-carved-cornice");
  for(const x of [-w*.43,w*.43])box(m,x,10.35,d/2+.1,.26,2.4,.3,"carvedTimber","gopinath-upper-structural-post");
  m.yaw=saved;
 }
 templeRoof(m,12,8.6,7.8,1.65,5,4.4,10.8,true);
 profile(m,0,13.65,0,[[.42,0],[.46,.12],[.31,.24],[.24,.47],[.12,.65],[.18,.72],[.12,.8],[.15,.87],[.075,.94],[0,1.05]],"bronze","gopinath-finial-ornamental-base-and-terminal",16);
 for(let i=0;i<8;i++){
  const a=i*Math.PI/4;profile(m,Math.cos(a)*.28,13.73,Math.sin(a)*.28,[[.1,0],[.14,.1],[.06,.22],[0,.3]],"bronze","gopinath-finial-petal",6);
 }
 return m;
}
