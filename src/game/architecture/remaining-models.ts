import {buildCentralModels,type CentralModel,type CentralBox,type CentralMaterial} from "./central-model.ts";
import {remainingSpecifications,remainingSpecificationById,type RemainingSpecification} from "../../data/reconstruction/architecture/remaining-specifications.ts";

// Low-level solids are shared; each named assembly below follows its own observed construction.
function model(s:RemainingSpecification):CentralModel{return {id:s.id,anchorId:s.id,origin:[...s.frozenAnchor],yaw:s.orientationEvidence.workingYaw,boxes:[],profiles:[],shapes:[],roofs:[],colliders:[],accuracy:s.reconstructionState==="UNRESOLVED"?"PLACEHOLDER":"PHOTO_INFERRED",neutral:s.reconstructionState==="UNRESOLVED"};}
function point(m:CentralModel,x:number,y:number,z:number):[number,number,number]{const c=Math.cos(m.yaw),s=Math.sin(m.yaw);return [m.origin[0]+x*c+z*s,y,m.origin[1]-x*s+z*c];}
export {box,profile,shape} from "./architecture-primitives.ts";
import {box,profile,shape} from "./architecture-primitives.ts";
export function roof(m:CentralModel,y:number,w:number,d:number,rise:number,role:string){m.roofs.push({position:point(m,0,y,0),width:w,depth:d,rise,yaw:m.yaw,material:"roof",role});box(m,0,y-.08,0,w,.14,d,"timber",role+"-eave");box(m,0,y-.12,0,w*.94,.12,d*.94,"timber",role+"-collision",true);for(const sx of [-1,1])for(const sz of [-1,1])shape(m,sx*(w/2-.1),y+.08,sz*(d/2-.1),[[0,0],[sx*.22,.08],[sx*.38,.3],[sx*.3,.48],[sx*.13,.17],[-sx*.15,.02]],.14,"timber",role+"-corner-upturn");}
export function stairs(m:CentralModel,width:number,height:number,count:number,startZ:number,tread:number,mat:CentralMaterial,role:string,x=0){for(let i=0;i<count;i++){const h=(i+1)*height/count;box(m,x,h/2,startZ-i*tread,width,h,tread+.015,mat,role,true);}}
export function doorway(m:CentralModel,x:number,y:number,z:number,w:number,h:number,role:string){box(m,x,y+h/2,z,w,h,.055,"recess",role);for(const side of [-1,1])box(m,x+side*(w/2+.08),y+h/2,z+.07,.16,h+.18,.16,"timber",role+"-jamb");box(m,x,y+h+.08,z+.06,w+.4,.2,.22,"timber",role+"-header");for(let i=1;i<6;i++)box(m,x-w/2+i*w/6,y+h/2,z+.09,.025,h,.04,"timber",role+"-lattice");}
export function stonePost(m:CentralModel,x:number,y:number,z:number,h:number,role:string,collision=true){profile(m,x,y,z,[[0,0],[.24,0],[.26,.16],[.18,.3],[.14,h-.42],[.24,h-.29],[.29,h-.1],[0,h]],"stone",role,8);if(collision)box(m,x,y+h/2,z,.32,h,.32,"stone",role+"-collision",true);}
export function pinnacle(m:CentralModel,x:number,y:number,z:number,h:number,role:string){profile(m,x,y,z,[[.18,0],[.29,h*.15],[.2,h*.3],[.23,h*.43],[.1,h*.6],[.17,h*.7],[.06,h*.84],[0,h]],"gold",role,12);}
// Central stair slots are genuinely open in both rendered terraces and colliders.
function terrace(m:CentralModel,w:number,d:number,y:number,h:number,slot:number,backEdge:number,mat:CentralMaterial,role:string){const flank=(w-slot)/2;for(const side of [-1,1])box(m,side*(slot+flank)/2,y+h/2,0,flank,h,d,mat,role,true);const rearDepth=d/2+backEdge;box(m,0,y+h/2,(backEdge-d/2)/2,slot,h,rearDepth,mat,role,true);}
export function animal(m:CentralModel,x:number,y:number,z:number,kind:"horse"|"rhino"|"camel"|"lion"|"elephant"|"human-faced"|"dog",scale=1){
 // Side extrusions carry torso, feet and head outline; no decorative limb colliders.
 const outlines:Record<typeof kind,[number,number][]>= {
 dog:[[-.62,0],[-.62,.5],[-.83,.71],[-.7,.87],[-.51,.84],[-.34,.63],[.3,.57],[.54,.92],[.61,.8],[.49,.46],[.48,0],[.31,0],[.23,.31],[-.32,.3],[-.4,0]],
 horse:[[-.62,0],[-.67,.6],[-.62,1.1],[-.82,1.25],[-.86,1.48],[-.57,1.55],[-.36,1.07],[.43,.97],[.57,.57],[.51,0],[.33,0],[.29,.56],[-.35,.57],[-.42,0]],
 rhino:[[-.66,0],[-.7,.51],[-.97,.57],[-1.07,.77],[-.91,.8],[-.87,1.08],[-.72,.91],[-.48,1.04],[.43,1.02],[.61,.64],[.56,0],[.34,0],[.26,.47],[-.35,.45],[-.41,0]],
 camel:[[-.57,0],[-.62,.81],[-.8,1.53],[-.89,1.66],[-.79,1.86],[-.51,1.88],[-.33,1.2],[-.12,1.15],[.05,1.43],[.23,1.48],[.38,1.15],[.66,.92],[.66,0],[.49,0],[.44,.74],[-.29,.71],[-.37,0]],
 lion:[[-.52,0],[-.62,.72],[-.64,1.12],[-.48,1.42],[-.16,1.49],[.08,1.25],[.14,.86],[.47,.62],[.57,.24],[.57,0],[.22,0],[.14,.45],[-.18,.4],[-.24,0]],
 elephant:[[-.76,0],[-.78,.62],[-1.03,.24],[-1.1,.25],[-1.1,1.18],[-.94,1.47],[-.52,1.49],[-.31,1.63],[.46,1.59],[.73,1.27],[.77,0],[.48,0],[.4,.85],[-.33,.85],[-.39,0]],
 "human-faced":[[-.53,0],[-.62,.81],[-.55,1.2],[-.4,1.46],[-.12,1.44],[.08,1.19],[.13,.83],[.39,1.01],[.64,.56],[.6,0],[.37,0],[.21,.55],[-.24,.54],[-.3,0]],
 };
 shape(m,x-.23*scale,y,z,outlines[kind].map(([a,b])=>[a*scale,b*scale]),.46*scale,"stone","guardian-"+kind,Math.PI/2);
 // Eased stone edges and four modeled ankles replace the cardboard-cutout reading.
 // The original animal outline, anchor, orientation and pedestal remain the source of truth.
 m.shapes[m.shapes.length-1].sculpturalBevel=.035*scale;
 for(const side of [-1,1])for(const end of [-1,1])profile(m,x+side*.17*scale,y,z+end*.4*scale,[[0,0],[.095*scale,0],[.11*scale,.055*scale],[.085*scale,.16*scale],[.075*scale,.29*scale],[0,.32*scale]],"stone","guardian-carved-ankle",12);
 if(kind==="elephant")for(const side of [-1,1])profile(m,x+side*.32*scale,y+.67*scale,z+.57*scale,[[0,0],[.29*scale,.06*scale],[.35*scale,.45*scale],[.18*scale,.69*scale],[0,.7*scale]],"stone","guardian-elephant-ear",8);
 if(kind==="lion"||kind==="human-faced")profile(m,x,y+.78*scale,z+.45*scale,[[.14*scale,0],[.23*scale,.13*scale],[.21*scale,.35*scale],[0,.45*scale]],"stone","guardian-face",8);
}
function attendant(m:CentralModel,x:number,y:number,z:number){
 for(const side of [-1,1]){
  shape(m,x,y,z+.07,[[side*.18,.68],[side*.3,.65],[side*.37,.87],[side*.31,1.12],[side*.21,1.15],[side*.25,.9]],.13,"stone","guardian-attendant-arm");m.shapes[m.shapes.length-1].sculpturalBevel=.025;
  profile(m,x+side*.13,y,z+.12,[[0,0],[.1,0],[.12,.065],[.085,.15],[0,.18]],"stone","guardian-attendant-foot",12);
 }
 profile(m,x,y,z,[[0,0],[.23,0],[.27,.62],[.22,1.03],[.13,1.19],[.23,1.31],[.19,1.53],[0,1.6]],"stone","guardian-attendant",10);profile(m,x-.32,y,z+.05,[[0,0],[.1,0],[.12,.45],[.08,.57],[.12,.69],[0,.83]],"stone","guardian-child",8);animal(m,x+.37,y,z+.12,"dog",.52);}

export function buildSiddhiLakshmi(s=remainingSpecificationById["siddhi-lakshmi"]):CentralModel {const m=model(s),d=s.dimensions.renderingAssumption;
 for(let i=0;i<5;i++){const w=d.baseWidth-i*.78,dep=d.baseDepth-i*.65;terrace(m,w,dep,i*.72,.72,d.stairWidth,.5,"stone","siddhi-five-terraces");for(const side of [-1,1])box(m,side*(w+d.stairWidth)/4,(i+1)*.72-.09,dep/2+.015,(w-d.stairWidth)/2,.12,.15,"stone","siddhi-terrace-cornice");}
 stairs(m,d.stairWidth,d.plinthHeight,15,4.5,.245,"stone","siddhi-axial-stair");box(m,0,3.51,.56,d.stairWidth,.18,.65,"stone","siddhi-stair-landing",true);
 const kinds=["attendant","horse","rhino","human-faced","camel"] as const;
 for(let level=0;level<5;level++)for(const side of [-1,1]){const x=side*(1.1+(.08*(4-level))),z=3.56-level*.66,y=level*.72;box(m,x,y+.12,z,.65,.24,.72,"stone","siddhi-guardian-pedestal");if(level===0)attendant(m,x,y+.24,z);else animal(m,x,y+.24,z,kinds[level] as "horse"|"rhino"|"human-faced"|"camel",.68);}
 box(m,0,5.0,-.85,d.bodyWidth,2.8,2.5,"stone","siddhi-stone-sanctum",true);
 shape(m,0,3.65,.425,[[-.43,0],[-.43,1.75],[-.28,1.94],[0,2.14],[.28,1.94],[.43,1.75],[.43,0]],.065,"recess","siddhi-sanctum-arched-door");
 for(const side of [-1,1])stonePost(m,side*.99,3.6,.65,2.75,"siddhi-front-portico-post");
 for(const [y,w] of [[6.35,3.4],[6.58,3.6],[6.84,3.25]])box(m,0,y,-.7,w,.22,3.3,"stone","siddhi-projecting-entablature");
 // Stacked rectilinear tower, visually unlike Vatsala's continuous convex spire.
 for(let i=0;i<9;i++){const w=3.12-i*.22,y=6.95+i*.59;box(m,0,y+.23,-.7,w,.46,w,"stone","siddhi-staged-tower");box(m,0,y+.49,-.7,w+.24,.13,w+.24,"stone","siddhi-setback-cornice");}
 for(const y of [7.05,8.84,10.55]){const front=-.7+(3.12-Math.floor((y-6.95)/.59)*.22)/2;shape(m,0,y,front,[[-.43,0],[-.43,.7],[-.27,.94],[0,1.14],[.27,.94],[.43,.7],[.43,0]],.14,"stone","siddhi-projecting-tower-niche");shape(m,0,y+.18,front+.16,[[-.22,0],[-.22,.48],[0,.73],[.22,.48],[.22,0]],.025,"recess","siddhi-niche-shadow");}
 for(const x of [-1.13,1.13])for(const z of [-1.84,.42])profile(m,x,7.0,z,[[0,0],[.34,0],[.34,.18],[.25,.3],[.22,.8],[.3,.93],[.13,1.1],[0,1.43]],"stone","siddhi-secondary-spire",8);
 profile(m,0,12.38,-.7,[[0,0],[.47,0],[.48,.2],[.37,.34],[.3,.6],[0,.74]],"stone","siddhi-stone-crown",12);pinnacle(m,0,13.12,-.7,.68,"siddhi-summit");return m;
}
export function buildYaksheshwar(s=remainingSpecificationById.yaksheshwar):CentralModel{const m=model(s),d=s.dimensions.renderingAssumption;
 for(let i=0;i<3;i++)box(m,0,(i+.5)*.3,0,d.baseWidth-i*.3,.3,d.baseDepth-i*.3,i===2?"stone":"brick","yak-low-plinth",true);
 stairs(m,d.stairWidth,.9,5,4.95,.24,"stone","yak-platform-approach");box(m,0,2.65,0,5.8,3.5,5.8,"brick","yak-brick-sanctum",true);
 for(let side=0;side<4;side++){const saved=m.yaw;m.yaw+=side*Math.PI/2;doorway(m,0,.94,2.94,1.4,2.6,"yak-timber-door");for(const x of [-1.88,1.88]){doorway(m,x,2.15,2.94,.56,.78,"yak-small-blind-opening");box(m,x,3.1,2.95,.72,.12,.2,"timber","yak-blind-niche-cornice");}box(m,0,4.13,3.0,6.5,.32,.35,"timber","yak-carved-timber-head");for(let j=0;j<9;j++)box(m,-2.7+j*.675,4.86,4.0,.15,2.5,.12,"timber","yak-lower-abstract-strut",false,0,-.68);m.yaw=saved;}
 roof(m,5.65,11.8,11.8,1.8,"yak-broad-lower-roof");box(m,0,8.31,0,3.55,2.15,3.55,"brick","yak-upper-chamber",true);
 for(let side=0;side<4;side++){const saved=m.yaw;m.yaw+=side*Math.PI/2;doorway(m,0,7.54,1.81,1.65,1.46,"yak-upper-timber-screen");for(let j=0;j<5;j++)box(m,-1.6+j*.8,9.37,2.34,.13,1.6,.1,"timber","yak-upper-abstract-strut",false,0,-.66);m.yaw=saved;}
 roof(m,9.82,7.2,7.2,1.6,"yak-upper-tile-roof");profile(m,0,11.42,0,[[.26,0],[.34,.23],[.16,.43],[0,.56]],"gold","yak-roof-crown",12);pinnacle(m,0,11.98,0,.32,"yak-finial");return m;
}
export function buildSiluMahadev(s=remainingSpecificationById["silu-mahadev"]):CentralModel{const m=model(s),d=s.dimensions.renderingAssumption;
 for(let i=0;i<6;i++){const w=d.baseWidth-i*1.55,dep=d.baseDepth-i*1.55;terrace(m,w,dep,i,1,d.stairWidth,1.8,"brick","silu-six-brick-terraces");for(const side of [-1,1])box(m,side*(w+d.stairWidth)/4,i+.94,dep/2+.05,(w-d.stairWidth)/2,.13,.2,"stone","silu-terrace-stone-cap");}
 stairs(m,d.stairWidth,6,30,10.1,.245,"brick","silu-west-axial-stair");box(m,0,5.91,2.56,d.stairWidth,.18,1.2,"stone","silu-stair-landing",true);
 for(const [kind,y,z]of [["elephant",1,7.9],["lion",3,5.55],["horse",5,3.65]] as const)for(const side of [-1,1]){const x=side*1.83;box(m,x,y+.13,z,1,.26,1.6,"stone","silu-guardian-pedestal");animal(m,x,y+.26,z,kind,kind==="elephant"?1:.8);}
 box(m,0,8.5,0,d.bodyWidth,5,4.8,"brick","silu-central-brick-sanctum",true);
 for(let side=0;side<4;side++){const saved=m.yaw;m.yaw+=side*Math.PI/2;shape(m,0,6.1,2.43,[[-.6,0],[-.6,2.25],[0,2.7],[.6,2.25],[.6,0]],.06,"recess","silu-arched-sanctum-recess");m.yaw=saved;}
 for(const x of [-2.95,2.95])for(const z of [-2.95,2.95]){
  for(const dx of [-.74,.74])for(const dz of [-.74,.74])stonePost(m,x+dx,6,z+dz,3.35,"silu-open-corner-porch-post");
  for(let j=0;j<4;j++)box(m,x,9.45+j*.27,z,2.45-j*.14,.24,2.45-j*.14,"brick","silu-corner-entablature");box(m,x,11.04,z,1.48,1.35,1.48,"brick","silu-corner-shrine-body");
  for(const [y,w]of [[11.55,1.9],[11.77,2.1],[12.03,1.8]])box(m,x,y,z,w,.17,w,"brick","silu-corner-tiered-head");profile(m,x,12.15,z,[[0,0],[.94,0],[.85,.19],[.65,.52],[.34,.76],[.27,1.02],[0,1.12]],"brick","silu-corner-shrine-cupola",12);pinnacle(m,x,13.27,z,.65,"silu-corner-finial");
 }
 for(let j=0;j<4;j++)box(m,0,11.04+j*.27,0,5.65-j*.14,.22,5.65-j*.14,"brick","silu-central-shoulder");
 profile(m,0,12.0,0,[[0,0],[4.08,0],[4.0,.28],[3.88,1.4],[3.68,3.7],[3.37,5.9],[2.94,8],[2.5,9.5],[2.35,9.8],[0,9.8]],"brick","silu-restored-central-shikhara",4);
 for(let j=0;j<14;j++){const y=12.35+j*.64,w=5.65-j*.16;for(const side of [-1,1])for(const offset of [-.62,0,.62])box(m,side*w/2,y,offset*w*.32,.09,.62,.12,"brick","silu-central-vertical-rib");}
 box(m,0,21.88,0,3.7,.2,3.7,"brick","silu-summit-cornice");profile(m,0,21.98,0,[[0,0],[1.61,0],[1.5,.28],[1.06,.88],[.73,1.38],[.5,1.64],[0,1.7]],"brick","silu-summit-shrine-cap",12);pinnacle(m,0,23.68,0,2.32,"silu-gilded-summit");return m;
}
export function buildRameshwar(s=remainingSpecificationById.rameshwar):CentralModel{const m=model(s),d=s.dimensions.renderingAssumption;
 box(m,0,.22,0,d.baseWidth,.44,d.baseDepth,"brick","rameshwar-brick-platform",true);box(m,0,.52,0,4.9,.16,4.9,"stone","rameshwar-stone-platform-cap",true);
 for(let side=0;side<4;side++){const saved=m.yaw;m.yaw+=side*Math.PI/2;stairs(m,d.stairWidth,.6,3,3.2,.3,"stone","rameshwar-inferred-platform-access");m.yaw=saved;}
 for(const x of [-1.3,1.3])for(const z of [-1.3,1.3]){stonePost(m,x,.6,z,2.8,"rameshwar-four-stone-post");profile(m,x,1.4,z,[[.18,0],[.24,.14],[.2,.27],[0,.3]],"stone","rameshwar-post-carved-band",8);}
 for(const [y,w,mat]of [[3.48,3.75,"stone"],[3.67,3.55,"brick"],[3.89,3.7,"stone"],[4.08,3.35,"brick"]] as const)box(m,0,y,0,w,.19,w,mat,"rameshwar-layered-square-canopy");
 profile(m,0,4.17,0,[[0,0],[1.46,0],[1.34,.1],[1.03,.32],[.69,.52],[.28,.64],[0,.73]],"stone","rameshwar-low-lotus-dome",16);
 profile(m,0,.6,0,[[0,0],[.53,0],[.58,.16],[.43,.28],[.39,.42],[.16,.51],[.16,.83],[0,.89]],"stone","rameshwar-exposed-lingam",12);box(m,0,.94,.55,.3,.14,.45,"stone","rameshwar-jalhari-spout");box(m,0,.85,0,1.1,.5,1.1,"stone","rameshwar-lingam-collision",true);return m;
}
export function buildBadrinath(s=remainingSpecificationById.badrinath):CentralModel{const m=model(s),d=s.dimensions.renderingAssumption;
 for(let i=0;i<3;i++)box(m,0,(i+.5)*d.plinthHeight/3,0,d.baseWidth-i*.35,d.plinthHeight/3,d.baseDepth-i*.35,i===2?"stone":"brick","badri-shallow-plinth",true);
 stairs(m,d.stairWidth,1.1,6,4.2,.23,"stone","badri-front-stair");box(m,0,2.6,-.65,2.8,3,2.8,"brick","badri-brick-sanctum",true);
 doorway(m,0,1.15,.8,1.05,2.1,"badri-front-sanctum-door");for(const x of [-.9,.9])stonePost(m,x,1.1,1.72,2.65,"badri-retained-portico-column");
 for(let i=0;i<5;i++)box(m,0,3.88+i*.19,1.25,2.85-i*.14,.16,2.55-i*.14,"brick","badri-single-portico-head");
 box(m,0,5.27,1.24,1.24,1.2,1.24,"brick","badri-front-subsidiary-shrine");for(const [y,w]of [[5.83,1.58],[6.07,1.73],[6.28,1.38]])box(m,0,y,1.24,w,.17,w,"brick","badri-front-shrine-cornice");profile(m,0,6.37,1.24,[[0,0],[.7,0],[.65,.15],[.4,.48],[.18,.64],[0,.76]],"brick","badri-front-shrine-cap",12);pinnacle(m,0,7.13,1.24,.55,"badri-front-finial");
 for(const [y,w]of [[4.14,3.28],[4.38,3.42],[4.58,3.18]])box(m,0,y,-.65,w,.17,w,"brick","badri-tower-base-cornice");profile(m,0,4.72,-.65,[[0,0],[1.98,0],[1.93,.28],[1.8,1.6],[1.58,3.5],[1.27,5.15],[1.05,5.9],[0,5.9]],"brick","badri-restored-tall-shikhara",4);
 for(let j=0;j<9;j++){const y=5+j*.59,w=2.72-j*.12;for(const side of [-1,1])box(m,side*w/2,y,-.65,.075,.58,.1,"brick","badri-shaft-rib");}
 box(m,0,10.69,-.65,1.77,.18,1.77,"brick","badri-summit-cornice");profile(m,0,10.78,-.65,[[0,0],[.77,0],[.69,.25],[.37,.62],[0,.82]],"brick","badri-summit-cap",12);pinnacle(m,0,11.6,-.65,.6,"badri-summit-finial");
 for(const side of [-1,1]){box(m,side*1.53,.36,3.25,.65,.72,.75,"stone","badri-lion-pedestal");animal(m,side*1.53,.72,3.25,"lion",.63);}return m;
}
export function buildGopinath(s=remainingSpecificationById["gopinath-krishna"]):CentralModel{const m=model(s),d=s.dimensions.renderingAssumption;
 for(let i=0;i<4;i++)box(m,0,(i+.5)*.35,0,d.baseWidth-i*.32,.35,d.baseDepth-i*.24,i===3?"stone":"brick","gopi-low-brick-podium",true);
 stairs(m,d.stairWidth,1.4,8,5.05,.245,"stone","gopi-plaza-stair");box(m,0,3.02,0,6,3.24,5,"brick","gopi-lower-brick-chamber",true);
 for(const x of [-1.85,0,1.85])doorway(m,x,1.42,2.54,x===0?1.25:.93,2.57,"gopi-three-front-portals");
 box(m,0,4.4,2.58,6.48,.28,.42,"timber","gopi-continuous-front-carved-head");for(let side=0;side<4;side++){const saved=m.yaw;m.yaw+=side*Math.PI/2;for(let j=0;j<7;j++)box(m,-2.45+j*.82,5.1,3.95,.16,2.8,.12,"timber","gopi-lower-strut-rhythm",false,0,-1.1);if(side>0)doorway(m,0,2.0,side%2?3.04:2.54,1.3,1.5,"gopi-secondary-screen-assumption");m.yaw=saved;}
 roof(m,5.78,11.6,10.2,1.0,"gopi-shallow-broad-lower-roof");box(m,0,8.02,0,3.15,2.4,2.85,"brick","gopi-small-upper-chamber",true);
 for(let side=0;side<4;side++){const saved=m.yaw;m.yaw+=side*Math.PI/2;doorway(m,0,7.13,1.63,1.1,1.46,"gopi-upper-window");for(const x of [-1.13,0,1.13])box(m,x,9.1,2.02,.15,1.55,.1,"timber","gopi-upper-strut",false,0,-.62);m.yaw=saved;}
 roof(m,9.65,5.8,5.4,1.15,"gopi-smaller-upper-roof");pinnacle(m,0,10.8,0,.8,"gopi-ridge-finial");return m;
}
const assemblies:Record<string,(s:RemainingSpecification)=>CentralModel>={"siddhi-lakshmi":buildSiddhiLakshmi,yaksheshwar:buildYaksheshwar,"silu-mahadev":buildSiluMahadev,rameshwar:buildRameshwar,badrinath:buildBadrinath,"gopinath-krishna":buildGopinath};
export function buildRemainingModels(specs:RemainingSpecification[]=remainingSpecifications):CentralModel[]{return specs.map(s=>{if(s.reconstructionState==="UNRESOLVED"){const m=model(s);box(m,0,.3,0,1.5,.6,1.5,"neutral","intentional-unresolved-massing",true);return m;}return assemblies[s.id](s);});}
/** Compose the accepted central baseline with replacements. Legacy baseline export remains available for historical comparison/tests, never rendered alongside replacements. */
export function buildPhase7Models(specs:RemainingSpecification[]=remainingSpecifications):CentralModel[]{const replacements=buildRemainingModels(specs),ids=new Set(replacements.map(m=>m.id));return [...buildCentralModels().filter(m=>!ids.has(m.id)),...replacements];}
