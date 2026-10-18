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
export const entrancePagodaPhotoEvidence={id:"gopinath-krishna",identity:"Gopinath / Dwarika (existing provisional binding)",identityConfidence:"PROVISIONALLY_IDENTIFIED",form:"PHOTO_INFERRED",dimensions:"APPROXIMATE",reference:"Two user-supplied clear frontal/oblique photographs",platformTop:1.44,lowerShrine:{width:6.8,depth:5.4,height:2.6},galleryHeight:.91,lowerRoof:{width:11.6,depth:10.2,eave:5.15,rise:1.55},upperTier:{width:3.8,depth:3.4,height:1.8},upperRoof:{width:6.4,depth:6,eave:8.15,rise:1.15},overallTop:10.2,limitations:"Photographic proportions, not surveyed dimensions. Rear openings, carving and stair-side sculpture remain unresolved. Existing provisional identity and anchor retained."} as const;
function entrancePagoda(source:CentralModel):CentralModel{
 // Fresh arrays remove both previous interpretations and all their collision solids.
 const m:CentralModel={...source,accuracy:"PHOTO_INFERRED",boxes:[],profiles:[],shapes:[],roofs:[],colliders:[],volumes:[],polygonRoofs:[]};
 Object.assign(m,{editorPartSources:Object.fromEntries(partitionArchitecturalParts(source).map(p=>[p.id,p.source]))});
 // Enclosed shrine: brick side/rear masses surround a recessed three-bay timber front.
 box(m,0,2.74,-.22,6.8,2.6,4.96,"agedBrick","gopinath-enclosed-shrine",true);
 for(const x of [-2.75,2.75])box(m,x,2.74,2.48,1.3,2.6,.44,"agedBrick","gopinath-front-masonry-pier",true);
 for(const x of [-1.38,0,1.38]){
  const w=x===0?1.22:1.02,h=x===0?2.12:1.85,bottom=x===0?1.44:1.65;
  box(m,x,bottom+h/2,2.275,w,h,.04,"recess","gopinath-recessed-facade-bay");
  for(const side of [-1,1])for(let layer=0;layer<3;layer++)box(m,x+side*(w/2+.065+layer*.065),bottom+h/2,2.37+layer*.08,.075,h+.12+layer*.13,.12,"carvedTimber","gopinath-layered-portal-jamb");
  for(let layer=0;layer<3;layer++)box(m,x,bottom+h+.06+layer*.09,2.4+layer*.08,w+.35+layer*.16,.1,.2,"carvedTimber","gopinath-layered-portal-lintel");
  box(m,x,bottom-.04,2.45,w+.3,.12,.32,"carvedTimber","gopinath-portal-threshold");
  if(x!==0)for(const side of [-1,1])box(m,x+side*.26,bottom+h/2,2.32,.035,h-.12,.045,"timber","gopinath-side-bay-panel");
 }
 // The gallery is inset behind its structural frontage, not an open ground pavilion.
 box(m,0,4.495,0,5.65,.91,4.25,"agedBrick","gopinath-recessed-gallery-core",true);
 for(let face=0;face<4;face++){
  const saved=m.yaw;m.yaw+=face*Math.PI/2;
  const span=face%2?5.4:6.8,depth=face%2?6.8:5.4;
  for(const y of [3.87,4.04])box(m,0,y,depth/2+.04,span+.22,.14,.28,"carvedTimber","gopinath-shrine-carved-cornice");
  for(const x of [-span*.31,0,span*.31]){
   box(m,x,4.51,depth/2-.49,span*.22,.65,.045,"recess","gopinath-gallery-shadow-opening");
   for(const side of [-1,1])box(m,x+side*span*.12,4.5,depth/2-.16,.18,.83,.24,"carvedTimber","gopinath-gallery-framing");
  }
  box(m,0,4.91,depth/2-.12,span+.18,.25,.36,"carvedTimber","gopinath-gallery-head-beam");
  const outer=(face%2?11.6:10.2)/2-.24;
  for(let i=0;i<5;i++){
   connectedStrut(m,-span*.42+i*span*.21,4.03,depth/2+.05,5.03,outer,"gopinath-heavy-main-strut");
   const strut=m.boxes[m.boxes.length-1];strut.size[0]=.3;strut.size[2]=.32;
  }
  m.yaw=saved;
 }
 pagodaRoof(m,5.15,11.6,10.2,1.55,6.9,5.5,4.15,"gopinath-dominant-main-roof");
 // Upper masonry storey emerges into the roof apex, avoiding a floating neck.
 box(m,0,7.1,0,3.8,1.8,3.4,"agedBrick","gopinath-substantial-upper-tier",true);
 for(let face=0;face<4;face++){
  const saved=m.yaw;m.yaw+=face*Math.PI/2;const span=face%2?3.4:3.8,d=face%2?3.8:3.4;
  for(const x of [-span*.27,0,span*.27]){
   box(m,x,7.35,d/2+.025,.65,.93,.045,"recess","gopinath-upper-recessed-opening");
   for(const side of [-1,1])box(m,x+side*.39,7.34,d/2+.12,.13,1.15,.2,"carvedTimber","gopinath-upper-bay-jamb");
   box(m,x,7.86,d/2+.15,.94,.16,.28,"carvedTimber","gopinath-upper-bay-lintel");
  }
  for(const y of [6.75,7.99])box(m,0,y,d/2+.1,span+.25,.18,.29,"carvedTimber","gopinath-upper-carved-band");
  for(const x of [-span*.36,0,span*.36]){
   connectedStrut(m,x,7.48,d/2+.1,8.03,(face%2?6.4:6)/2-.2,"gopinath-upper-roof-strut");
   const strut=m.boxes[m.boxes.length-1];strut.size[0]=.23;strut.size[2]=.25;
  }
  m.yaw=saved;
 }
 pagodaRoof(m,8.15,6.4,6,1.15,4,3.6,7.55,"gopinath-smaller-upper-roof");
 // Replace helper rims rather than overlaying two sets of eave geometry.
 m.boxes=m.boxes.filter(b=>!/^gopinath-.*-roof-(edge-rim|side-rim)$/.test(b.role));
 // Additional fascia depth and closely spaced underside rafter ends, shared materials.
 for(const tier of [{y:5.15,w:11.6,d:10.2},{y:8.15,w:6.4,d:6}]){
  for(const side of [-1,1]){
   box(m,0,tier.y-.13,side*(tier.d/2-.11),tier.w,.29,.23,"carvedTimber","gopinath-heavy-eave-fascia");
   box(m,side*(tier.w/2-.11),tier.y-.13,0,.23,.29,tier.d,"carvedTimber","gopinath-heavy-side-fascia");
   for(let x=-tier.w/2+.3;x<tier.w/2-.2;x+=.42)box(m,x,tier.y-.16,side*(tier.d/2-.38),.075,.12,.57,"timber","gopinath-rafter-end");
   for(let z=-tier.d/2+.3;z<tier.d/2-.2;z+=.42)box(m,side*(tier.w/2-.38),tier.y-.16,z,.57,.12,.075,"timber","gopinath-side-rafter-end");
  }
 }
 profile(m,0,9.3,0,[[.3,0],[.38,.12],[.26,.23],[.22,.4],[.12,.58],[.17,.66],[.08,.75],[.1,.82],[0,.9]],"bronze","gopinath-ornamental-finial",12);
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
