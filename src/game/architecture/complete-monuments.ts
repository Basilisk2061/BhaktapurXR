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
export function buildPhase9a1Models(){return buildPhase9Models().filter(m=>m.id!=="khauma-adjoining-fabric").map(m=>{
 if(m.id==="yaksheshwar")return buildCompleteYaksheshwar();
 if(!["gopinath-krishna","jagannath"].includes(m.id))return m;
 const complete=structuredClone(m),originalRoofs=complete.roofs;complete.roofs=[];
 complete.boxes=complete.boxes.filter(b=>!b.role.endsWith("-eave"));
 for(const r of originalRoofs){const lower=r.position[1]<7;pagodaRoof(complete,r.position[1],r.width,r.depth,r.rise,lower?6.4:3.55,lower?5.4:3.25,lower?5.1:9.22,r.role);}
 box(complete,0,6.63,0,3.15,1.18,2.85,"brick","west-pagoda-roof-to-upper-chamber-neck",true);return complete;
});}
export const completedTempleEvidence={identity:"Yaksheshwar / Pashupatinath",form:"PHOTO_INFERRED",dimensions:"APPROXIMATE",sources:["yak-2016","urban-east-2024"],changes:["Enclosed shrine and upper chamber, full timber facade/cornices","Two pyramidal hip roofs replacing inappropriate long ridges","Continuous sloped timber soffits and connected struts","Upper chamber descends into lower roof, no open wall/roof seam"],unresolved:["Exact carving and measured roof slopes","Rear doorway rhythm inferred from observed Newar assembly; no survey accuracy"]};
