import {partitionArchitecturalParts} from "../../features/world-editor/parts.ts";
import {buildPhase9Models,connectedStrut} from "./west-models.ts";
import {box,doorway,profile,pinnacle} from "./remaining-models.ts";
import type {CentralModel} from "./central-model.ts";
import {remainingSpecificationById} from "../../data/reconstruction/architecture/remaining-specifications.ts";
/** Complete pagoda assembly: pyramidal/short-ridge tile roof, continuous sloped timber soffit,
 * eave rims and wall-to-soffit struts. Roof levels are not hollow isolated flat decks. */
function pagodaRoof(m:CentralModel,y:number,width:number,depth:number,rise:number,bodyWidth:number,bodyDepth:number,headY:number,role:string){
 m.roofs.push({position:[m.origin[0],y,m.origin[1]],width,depth,rise,yaw:m.yaw,material:"roof",family:"PAGODA",role},
 {position:[m.origin[0],y-.1,m.origin[1]],width:width-.16,depth:depth-.16,rise:0,yaw:m.yaw,material:"timber",family:"SOFFIT",innerWidth:bodyWidth,innerDepth:bodyDepth,drop:y-.1-headY,role:role+"-continuous-soffit"});
 for(const side of [-1,1]){box(m,0,y-.06,side*(depth/2-.06),width,.17,.18,"timber",role+"-edge-rim");box(m,side*(width/2-.06),y-.06,0,.18,.17,depth,"timber",role+"-side-rim");}
 // Collision-only deck: rendering a flat box here would conceal the sloping soffit.
 m.colliders.push({position:[m.origin[0],y-.15,m.origin[1]],size:[width*.94,.12,depth*.94],yaw:m.yaw});
}
export function buildCompleteYaksheshwar():CentralModel{
 const s=remainingSpecificationById.yaksheshwar,m:CentralModel={id:s.id,anchorId:s.id,origin:[...s.frozenAnchor],yaw:s.orientationEvidence.workingYaw,boxes:[],profiles:[],shapes:[],roofs:[],colliders:[],accuracy:"PHOTO_INFERRED",neutral:false};
 for(let i=0;i<3;i++)box(m,0,(i+.5)*.3,0,8-i*.3,.3,8-i*.3,i===2?"stone":"brick","yak-complete-low-plinth",true);
 for(let i=0;i<5;i++){const h=(i+1)*.18;box(m,0,h/2,4.95-i*.24,2.1,h,.255,"stone","yak-complete-front-stair",true);}
 box(m,0,2.85,0,5.8,3.9,5.8,"brick","yak-complete-enclosed-shrine",true);
 for(let face=0;face<4;face++){
  const saved=m.yaw;m.yaw+=face*Math.PI/2;
  for(const x of [-1.78,0,1.78])doorway(m,x,.94,2.94,x===0?1.4:.83,2.62,"yak-complete-carved-portal");
  for(const x of [-2.37,2.37]){box(m,x,2.5,2.96,.55,.75,.07,"recess","yak-small-blind-niche");box(m,x,2.5,3.03,.67,.94,.09,"timber","yak-niche-carved-surround");}
  for(const y of [3.88,4.13,4.4,4.65])box(m,0,y,3,6.25,.18,.34,"timber","yak-continuous-carved-cornice");
  for(let j=0;j<9;j++)connectedStrut(m,-2.65+j*.6625,4.52,3.03,5.49,5.5,"yak-complete-lower-connected-strut");
  m.yaw=saved;
 }
 pagodaRoof(m,5.65,11.8,11.8,1.8,6.25,6.25,4.65,"yak-complete-broad-lower-roof");
 // Upper chamber descends into the lower roof cone; there is no open seam around its foot.
 box(m,0,8.075,0,3.55,2.85,3.55,"brick","yak-complete-upper-chamber",true);
 for(let face=0;face<4;face++){
  const saved=m.yaw;m.yaw+=face*Math.PI/2;doorway(m,0,7.6,1.82,1.62,1.35,"yak-complete-upper-timber-screen");
  for(const y of [9.01,9.25,9.48])box(m,0,y,1.85,3.93,.15,.32,"timber","yak-complete-upper-carved-head");
  for(let j=0;j<5;j++)connectedStrut(m,-1.58+j*.79,9.2,1.86,9.67,3.27,"yak-complete-upper-connected-strut");m.yaw=saved;
 }
 pagodaRoof(m,9.82,7.2,7.2,1.6,3.93,3.93,9.45,"yak-complete-smaller-upper-roof");
 profile(m,0,11.42,0,[[.26,0],[.34,.23],[.16,.43],[0,.56]],"gold","yak-complete-gilded-roof-crown",12);pinnacle(m,0,11.98,0,.32,"yak-complete-summit");return m;
}
export const entrancePagodaPhotoEvidence={id:"gopinath-krishna",identity:"Gopinath / Dwarika (existing provisional binding)",identityConfidence:"PROVISIONALLY_IDENTIFIED",form:"PHOTO_INFERRED",dimensions:"APPROXIMATE",reference:"Two user-supplied clear frontal/oblique photographs",platformTop:1.44,lowerShrine:{width:8.4,depth:6.8,height:3.45},galleryHeight:1.31,lowerRoof:{width:15.2,depth:13.6,eave:6.5,rise:2.6},upperTier:{width:4.8,depth:4.2,height:2.8},upperRoof:{width:8.2,depth:7.6,eave:11.15,rise:1.65},overallTop:13.75,limitations:"Photographic proportions, not surveyed dimensions. Rear openings, carving and stair-side sculpture remain unresolved. Existing provisional identity and anchor retained."} as const;
function entrancePagoda(source:CentralModel):CentralModel{
 // Fresh arrays remove both previous interpretations and all their collision solids.
 const m:CentralModel={...source,accuracy:"PHOTO_INFERRED",boxes:[],profiles:[],shapes:[],roofs:[],colliders:[],volumes:[],polygonRoofs:[]};
 Object.assign(m,{editorPartSources:Object.fromEntries(partitionArchitecturalParts(source).map(p=>[p.id,p.source]))});
 // Enclosed shrine: brick side/rear masses surround a recessed three-bay timber front.
 box(m,0,3.165,-.28,8.4,3.45,6.24,"agedBrick","gopinath-enclosed-shrine",true);
 for(const x of [-3.25,3.25])box(m,x,3.165,3.08,1.9,3.45,.64,"agedBrick","gopinath-front-masonry-pier",true);
 for(const x of [-1.65,0,1.65]){
  const w=x===0?1.3:1.05,h=x===0?2.3:1.8,bottom=x===0?1.44:2.05;
  box(m,x,bottom+h/2,2.865,w,h,.04,"recess","gopinath-recessed-facade-bay");
  for(const side of [-1,1])for(let layer=0;layer<3;layer++)box(m,x+side*(w/2+.065+layer*.065),bottom+h/2,3.02+layer*.1,.1,h+.16+layer*.16,.18,"carvedTimber","gopinath-layered-portal-jamb");
  for(let layer=0;layer<3;layer++)box(m,x,bottom+h+.06+layer*.09,3.06+layer*.1,w+.4+layer*.2,.14,.28,"carvedTimber","gopinath-layered-portal-lintel");
  box(m,x,bottom-.04,3.1,w+.3,.12,.32,"carvedTimber","gopinath-portal-threshold");
  if(x!==0)for(const side of [-1,1])box(m,x+side*.26,bottom+h/2,2.94,.045,h-.12,.045,"timber","gopinath-side-bay-panel");
 }
 for(const y of [4.02,4.29])box(m,0,y,3.19,4.9,.18,.32,"carvedTimber","gopinath-front-timber-attic-band");
 for(const x of [-2.16,-.8,.8,2.16])box(m,x,3.24,3.21,.18,2.65,.3,"carvedTimber","gopinath-facade-vertical-division");
 // The gallery is inset behind its structural frontage, not an open ground pavilion.
 box(m,0,5.545,0,7.1,1.31,5.5,"agedBrick","gopinath-recessed-gallery-core",true);
 for(let face=0;face<4;face++){
  const saved=m.yaw;m.yaw+=face*Math.PI/2;
  const span=face%2?6.8:8.4,depth=face%2?8.4:6.8;
  for(const y of [4.6,4.87])box(m,0,y,depth/2+.04,span+.34,.2,.4,"carvedTimber","gopinath-shrine-carved-cornice");
  for(const x of [-span*.31,0,span*.31]){
   box(m,x,5.55,depth/2-.59,span*.22,.95,.045,"recess","gopinath-gallery-shadow-opening");
   for(const side of [-1,1])box(m,x+side*span*.12,5.55,depth/2-.18,.24,1.19,.32,"carvedTimber","gopinath-gallery-framing");
  }
  box(m,0,6.15,depth/2-.12,span+.28,.32,.44,"carvedTimber","gopinath-gallery-head-beam");
  const outer=(face%2?15.2:13.6)/2-.24;
  for(let i=0;i<5;i++){
   connectedStrut(m,-span*.42+i*span*.21,4.85,depth/2+.05,6.38,outer,"gopinath-heavy-main-strut");
   const strut=m.boxes[m.boxes.length-1];strut.size[0]=.36;strut.size[2]=.38;
  }
  m.yaw=saved;
 }
 pagodaRoof(m,6.5,15.2,13.6,2.6,8.5,6.9,5.02,"gopinath-dominant-main-roof");
 // Upper masonry storey emerges into the roof apex, avoiding a floating neck.
 box(m,0,9.6,0,4.8,2.8,4.2,"agedBrick","gopinath-substantial-upper-tier",true);
 for(let face=0;face<4;face++){
  const saved=m.yaw;m.yaw+=face*Math.PI/2;const span=face%2?4.2:4.8,d=face%2?4.8:4.2;
  for(const x of [-span*.27,0,span*.27]){
   box(m,x,9.8,d/2+.025,.78,1.45,.045,"recess","gopinath-upper-recessed-opening");
   for(const side of [-1,1])box(m,x+side*.47,9.8,d/2+.16,.18,1.68,.28,"carvedTimber","gopinath-upper-bay-jamb");
   box(m,x,10.64,d/2+.18,1.18,.22,.36,"carvedTimber","gopinath-upper-bay-lintel");
  }
  for(const x of [-span*.4,span*.4])box(m,x,9.78,d/2+.1,.28,1.8,.28,"agedBrick","gopinath-upper-masonry-division");
  for(const y of [8.87,10.93])box(m,0,y,d/2+.1,span+.35,.24,.38,"carvedTimber","gopinath-upper-carved-band");
  for(const x of [-span*.36,0,span*.36]){
   connectedStrut(m,x,10.16,d/2+.1,11.03,(face%2?8.2:7.6)/2-.2,"gopinath-upper-roof-strut");
   const strut=m.boxes[m.boxes.length-1];strut.size[0]=.29;strut.size[2]=.31;
  }
  m.yaw=saved;
 }
 pagodaRoof(m,11.15,8.2,7.6,1.65,5,4.4,10.3,"gopinath-smaller-upper-roof");
 // Replace helper rims rather than overlaying two sets of eave geometry.
 m.boxes=m.boxes.filter(b=>!/^gopinath-.*-roof-(edge-rim|side-rim)$/.test(b.role));
 // Additional fascia depth and closely spaced underside rafter ends, shared materials.
 for(const tier of [{y:6.5,w:15.2,d:13.6},{y:11.15,w:8.2,d:7.6}]){
  for(const side of [-1,1]){
   box(m,0,tier.y-.19,side*(tier.d/2-.11),tier.w,.4,.3,"carvedTimber","gopinath-heavy-eave-fascia");
   box(m,side*(tier.w/2-.11),tier.y-.19,0,.3,.4,tier.d,"carvedTimber","gopinath-heavy-side-fascia");
   for(let x=-tier.w/2+.3;x<tier.w/2-.2;x+=.42)box(m,x,tier.y-.16,side*(tier.d/2-.38),.075,.12,.57,"timber","gopinath-rafter-end");
   for(let z=-tier.d/2+.3;z<tier.d/2-.2;z+=.42)box(m,side*(tier.w/2-.38),tier.y-.16,z,.57,.12,.075,"timber","gopinath-side-rafter-end");
  }
 }
 profile(m,0,12.8,0,[[.3,0],[.38,.12],[.26,.23],[.22,.4],[.12,.58],[.17,.66],[.08,.75],[.1,.82],[0,.95]],"bronze","gopinath-ornamental-finial",12);
 return m;
}
export function buildPhase9a1Models(){return buildPhase9Models().filter(m=>m.id!=="khauma-adjoining-fabric").map(m=>{
 if(m.id==="yaksheshwar")return buildCompleteYaksheshwar();
 if(m.id==="gopinath-krishna")return entrancePagoda(m);
 if(!["gopinath-krishna","jagannath"].includes(m.id))return m;
 const complete=structuredClone(m),originalRoofs=complete.roofs;complete.roofs=[];
 complete.boxes=complete.boxes.filter(b=>!b.role.endsWith("-eave"));
 for(const r of originalRoofs){const lower=r.position[1]<7;pagodaRoof(complete,r.position[1],r.width,r.depth,r.rise,lower?6.4:3.55,lower?5.4:3.25,lower?5.1:9.22,r.role);}
 box(complete,0,6.63,0,3.15,1.18,2.85,"brick","west-pagoda-roof-to-upper-chamber-neck",true);return complete;
});}
export const completedTempleEvidence={identity:"Yaksheshwar / Pashupatinath",form:"PHOTO_INFERRED",dimensions:"APPROXIMATE",sources:["yak-2016","urban-east-2024"],changes:["Enclosed shrine and upper chamber, full timber facade/cornices","Two pyramidal hip roofs replacing inappropriate long ridges","Continuous sloped timber soffits and connected struts","Upper chamber descends into lower roof, no open wall/roof seam"],unresolved:["Exact carving and measured roof slopes","Rear doorway rhythm inferred from observed Newar assembly; no survey accuracy"]};
