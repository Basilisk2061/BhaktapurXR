import {currentOverrides} from "../../features/world-editor/saved-overrides.ts";
import {Euler,Matrix4,Vector3} from "three";
import {khaumaGateDimensions} from "./khauma-entrance-model.ts";
import {overrideMatrix} from "../../features/world-editor/transforms.ts";
import {walkableFloorColliders} from "./walkable-floor-colliders.ts";
import polygonClipping from "polygon-clipping";
import {contextColliders} from "./urban-occupancy.ts";
import type {CentralModel} from "./central-model.ts";
import {box,profile,shape,roof,pinnacle} from "./remaining-models.ts";
import {buildCarvedMuseumLion,buildCarvedMuseumRelief} from "./museum-sculptures.ts";
import frames from "../../data/reconstruction/eastern-editor-frames.json" with {type:"json"};
const fresh=(id:string,origin:[number,number],yaw=0):CentralModel=>({id,anchorId:"PHOTO_RELATIVE_KHAUMA",origin,yaw,accuracy:"PHOTO_INFERRED",neutral:false,boxes:[],shapes:[],profiles:[],roofs:[],colliders:[]});
export const khaumaInteriorAudit=[
 {id:"entrance:khauma-guardian-enclosure",classification:"PHOTO_INFERRED",action:"align the complete guardian entrance to the main gate left line; replace rear-route wall with stepped front boundary into the National Art Gallery west wing",binding:"Owner stepped-path clarification supersedes nearest-compound routing: gate-left aligned guardian, short straight, forward step, then National Art Gallery west-side mid-depth. Coordinates, wall dimensions and hidden closure remain APPROXIMATE."},
 {id:"entrance:khauma-near-shed",classification:"REMOVE_UNSUPPORTED_DUPLICATE",action:"remove cloned polygon house and its colliders; extend existing adjacent low building instead",binding:"2026-10-18 supplied real interior screenshots 190542/190558 versus game screenshots 190652/190700; manual position retained in saved data but no duplicate rendered"},
 {id:"entrance:KhaumaExterior_LeftTraditional",classification:"PHOTO_INFERRED",action:"extend only the interior range toward the school wall, with one continuous low roof and a clear passage",binding:"Supplied interior photographs support horizontal massing/openings/plinth; dimensions APPROXIMATE, not survey-derived"},
 {id:"context:9c:1159393579",classification:"REMOVE_AS_OPEN_SPACE",action:"withdraw guessed house; retain low terrace/threshold at recorded footprint",binding:"Photo-supported open sattal apron; individual source-object correspondence unresolved"},
 {id:"context:9c:1159393576",classification:"PLAN/PHOTO_INFERRED",action:"withdraw generic east-apron extrusion; approved palace facade untouched",binding:"Photo-supported open foreground of continuous arcade; render interpretation only, no source trace changed"},
 {id:"edge:khauma-north-flank:1158762014",classification:"DIRECT_PHOTO_RECONSTRUCTION",action:"retain wall/gate/guardians beyond the continuous low entrance range",binding:"Mapped northern frontage; photographic gate-to-school adjacency, working dimensions approximate"},
 {id:"entrance:khauma-raised-veranda",classification:"DIRECT_PHOTO_RECONSTRUCTION",action:"retain plastered frontage on low plinth without stair flight",binding:"PHOTO_RELATIVE_KHAUMA; not a surveyed individual footprint"},
 ...["context:9c:1158762012","context:9c:1158762013","context:9c:1158762016","context:9c:1159393574","context:9c:1159393575","edge:western-cluster-south:1159633450","edge:western-cluster-south:1159633451","edge:western-cluster-east-link:211076664"].map(id=>({id,classification:"FOOTPRINT_ONLY_CONTEXT",action:"withdraw unsupported residential facade; retain modest occupied footprint/roof",binding:"Occupancy source-derived; individual architecture UNRESOLVED"})),
 ...["edge:khauma-south-flank:1159661606","edge:western-approach-low-roofs:1159672142","edge:western-approach-low-roofs:1159672143"].map(id=>({id,classification:"PLAN/PHOTO_INFERRED",action:"retain exterior approach roofs",binding:"Outside/through gate photographs; rear details approximate"})),
] as const;
function pedestal(m:CentralModel,x:number,z:number,width:number,depth:number,height:number){
 for(const [fraction,scale]of [[.13,1],[.28,.92],[.67,.83],[.79,.92],[.9,.86],[1,1]] as const){const previous=m.boxes.filter(b=>b.role==="school-pedestals"&&Math.abs(b.position[0]-m.origin[0]-x)<.01).reduce((y,b)=>Math.max(y,b.position[1]+b.size[1]/2),0),top=height*fraction;box(m,x,(top+previous)/2,z,width*scale,top-previous,depth*scale,"stone","school-pedestals",true);}
 for(let j=0;j<9;j++)profile(m,x+(j-4)*width/11,height*.77,z+depth*.49,[[0,0],[.035,0],[.045,.05],[.024,.1],[0,.12]],"stone","school-pedestals-carved-band",8);
}
/** Reuse the continuous loft/tube technique, with distinct proportions, crown and figure staging.
 * Shared sculpture refinements retain the school-specific proportions. No deity identity is assigned. */
function guardian(m:CentralModel,x:number,y:number,z:number,left:boolean){
 const temp=fresh("sculpture",[0,0]);buildCarvedMuseumLion(temp,0,0,0);
 const role=left?"school-left-guardian":"school-right-guardian",sx=1.18,sy=1.22,sz=1.1;
 for(const p of temp.profiles){p.position=[m.origin[0]+x+p.position[0]*sx,y+p.position[1]*sy,m.origin[1]+z+p.position[2]*sz];p.role=role;p.material=p.material==="recess"?"recess":"guardianStone";if(p.sculptedSurface)p.sculptedSurface.positions=p.sculptedSurface.positions.map((v,i)=>v*[sx,sy,sz][i%3]);else p.profile=p.profile.map(([r,h])=>[r*sx,h*sy]);m.profiles.push(p);}
 for(const p of temp.shapes){p.position=[m.origin[0]+x+p.position[0]*sx,y+p.position[1]*sy,m.origin[1]+z+p.position[2]*sz];p.points=p.points.map(([a,b])=>[a*sx,b*sy]);p.role=role;m.shapes.push(p);}
 // The school guardians have a conspicuous tiered crown and heavy breast/leg bands.
 profile(m,x,y+2.78,z+.4,[[0,0],[.22,0],[.28,.12],[.2,.22],[.24,.32],[.12,.47],[0,.62]],"guardianStone",role+"-crown",24);
 shape(m,x,y+1.12,z+.69,[[-.36,.13],[-.24,.1],[0,.065],[.24,.1],[.36,.13],[.32,-.015],[0,-.07],[-.32,-.015]],.065,"guardianStone",role+"-breast-band");box(m,x,y+1.09,z+.64,1.15,2.18,1.25,"stone",role+"-collision",true);
}
function relief(m:CentralModel,x:number,y:number,z:number,left:boolean){
 const t=fresh("sculpture",[0,0]);buildCarvedMuseumRelief(t,0,0,0,!left);const role=left?"school-left-relief":"school-right-relief",sx=.87,sy=.79,sz=1.15;
 for(const p of t.profiles){if(/held-|reclining|base-recessed|pedestal/.test(p.role))continue;p.position=[m.origin[0]+x+p.position[0]*sx,y+p.position[1]*sy,m.origin[1]+z+p.position[2]*sz];p.role=role;p.material=p.material==="recess"?"recess":"museumRelief";if(p.sculptedSurface)p.sculptedSurface.positions=p.sculptedSurface.positions.map((v,i)=>v*[sx,sy,sz][i%3]);else p.profile=p.profile.map(([r,h])=>[r*sx,h*sy]);m.profiles.push(p);}
 for(const p of t.shapes){p.position=[m.origin[0]+x+p.position[0]*sx,y+p.position[1]*sy,m.origin[1]+z+p.position[2]*sz];p.points=p.points.map(([a,b])=>[a*sx,b*sy]);p.role=role;p.material=p.material==="recess"?"recess":"museumRelief";m.shapes.push(p);}
 box(m,x,y+.93,z,.95,1.9,.35,"stone",role+"-collision",true);
}
const guardianId="edge:khauma-north-flank:1158762014";
function editedMatrix(m:CentralModel){const source={position:[m.origin[0],0,m.origin[1]] as [number,number,number],rotation:[0,m.yaw,0] as [number,number,number],scale:[1,1,1] as [number,number,number]};return overrideMatrix(source,currentOverrides()[m.id]??source);}
function gateBoundary(){
 const gate=currentOverrides()['khauma-gate'],rotation=new Matrix4().makeRotationFromEuler(new Euler(...gate.rotation));
 const square=new Vector3(1,0,0).applyMatrix4(rotation).normalize(),along=new Vector3(0,0,-1).applyMatrix4(rotation).normalize(),centre=new Vector3(...gate.position);
 return {square,along,edge:centre.addScaledVector(square,-khaumaGateDimensions.width*gate.scale[0]/2)};
}
/** Explicit photo-relative placement correction, preserving editor frames and all saved data.
 * Translate EVERY geometry/collider piece in source space so the existing edited assembly
 * portal lies on the frozen gate's left-edge line. Do not move/rotate individual sculptures.
 */
function alignGuardianFront(m:CentralModel){
 const matrix=editedMatrix(m),{square,edge}=gateBoundary(),head=m.boxes.find(b=>b.role==='school-central-gate-head')!;
 const portal=new Vector3(...head.position).applyMatrix4(matrix),amount=-portal.sub(edge).dot(square);
 const inverse=matrix.clone().invert(),translation=square.multiplyScalar(amount).applyMatrix4(inverse).sub(new Vector3().applyMatrix4(inverse));
 for(const piece of [...m.boxes,...m.profiles,...m.shapes,...m.roofs,...m.colliders])piece.position=new Vector3(...piece.position).add(translation).toArray() as [number,number,number];
}
export function schoolEntrance(source:CentralModel){
 const m=fresh(source.id,[...source.origin]);Object.assign(m,{editorPartSources:frames["edge:khauma-north-flank:1158762014"]});
 for(const side of [-1,1])box(m,side*4.05,1.25,1.9,5.2,2.5,.5,"brick","school-wall",true);
 for(const side of [-1,1])box(m,side*1.65,1.74,1.85,.45,3.48,.74,"brick","school-central-gate-jamb",true);
 box(m,0,3.14,1.86,3.8,.72,.76,"brick","school-central-gate-head",true);
 box(m,0,3.4,2.25,3.45,.47,.045,"plaster","school-restrained-sign-board");
 roof(m,3.56,4.75,2.8,.6,"school-roof");m.roofs[0].position[2]+=1.86;for(const b of m.boxes.filter(b=>b.role.startsWith("school-roof")))b.position[2]+=1.86;for(const c of m.colliders.filter(c=>c.position[1]>3.3))c.position[2]+=1.86;
 for(const side of [-1,1]){
  box(m,side*.72,1.24,2.02,1.4,2.48,.09,"recess","school-central-gate-leaf",true);
  for(const edge of [-1,1])box(m,side*.72+edge*.69,1.24,2.13,.065,2.48,.08,"timber","school-central-gate-stile");
  for(let intercept=-2.6;intercept<=3.2;intercept+=.24)for(const slope of [-1,1]){
   const lo=Math.max(-.66,slope>0?-intercept:intercept-2.48),hi=Math.min(.66,slope>0?2.48-intercept:intercept);
   if(hi-lo>.03)shape(m,side*.72,0,2.14,[[lo,slope*lo+intercept],[hi,slope*hi+intercept],[hi,slope*hi+intercept+.028],[lo,slope*lo+intercept+.028]],.025,"timber","school-central-gate-diamond-lattice");
  }
 } for(const side of [-1,1]){pedestal(m,side*5.25,3.2,1.9,2.1,1.1);guardian(m,side*5.25,1.1,3.2,side<0);pedestal(m,side*2.2,2.75,1.35,1.35,1.3);relief(m,side*2.2,1.3,2.75,side<0);}
 // Low enclosure and roofline only behind the wall, not a guessed residential facade.
 for(const side of [-1,1])box(m,side*5.2,1.325,-.8,.35,2.65,5.4,"brick","school-wall-return",true);
 // Compound closure behind, never through the existing central entrance or the sculptures.
 box(m,0,1.325,-3.5,10.75,2.65,.45,"agedBrick","school-compound-rear-enclosure",true);
 box(m,0,2.69,-3.5,10.88,.08,.58,"agedBrick","school-compound-rear-cap");
 m.roofs.push({position:[m.origin[0],2.64,m.origin[1]-1],width:10.6,depth:4.8,rise:.9,yaw:0,material:"roof",role:"school-roof-rear-context"});
  // Slide only this reconstructed wall composition east to clear the frozen Khauma masonry.
 for(const p of [...m.boxes,...m.profiles,...m.shapes,...m.roofs,...m.colliders])p.position[0]+=14;
 m.origin[0]+=12;
 alignGuardianFront(m);
 return m;
}
export function raisedVeranda(){
 const m=fresh("entrance:khauma-raised-veranda",[-121.7,-23.6]);
 box(m,0,.5,0,8.4,1,7.2,"brick","veranda-platform",true);box(m,0,1.02,0,8.5,.12,7.3,"stone","veranda-platform-coping",true);
 // Front addresses the entrance apron to the north. Open gallery is genuinely recessed.
 box(m,0,2.48,1.4,7.5,2.8,3.8,"plaster","veranda-body",true);
 for(const side of [-1,1])box(m,side*3.75,2.47,-.9,.2,2.8,1.5,"plaster","veranda-body-return",true);
 for(let i=0;i<5;i++)box(m,-3.4+i*1.7,2.49,-2.5,.18,2.82,.18,"carvedTimber","veranda-posts",true);
 box(m,0,3.89,-2.5,8.3,.27,.42,"carvedTimber","veranda-beam");
 roof(m,4.04,10,9.1,1.45,"veranda-roof");box(m,0,3.91,-4.45,10,.22,.07,"shutter","veranda-photo-red-eave-trim");
 for(let i=0;i<6;i++)box(m,0,(i+1)*.16/2,-5.15+i*.29,2.15,(i+1)*.16,.31,"stone","veranda-platform-stairs",true);
 box(m,0,2.38,-.51,1.2,2.25,.03,"recess","veranda-recessed-door");
 const signature=(p:{position:number[],size:number[],yaw:number})=>JSON.stringify([p.position,p.size,p.yaw]);
 const collisionKeys=new Set(m.colliders.map(signature)),solids=m.boxes.filter(b=>collisionKeys.has(signature(b))&&b.role!=="veranda-platform-stairs");
 m.boxes=m.boxes.filter(b=>b.role!=="veranda-platform-stairs");
 for(const p of [...m.boxes,...m.profiles,...m.shapes,...m.roofs])p.position[1]-=.85;
 for(const b of m.boxes){if(b.role==="veranda-platform"){b.position[1]=.075;b.size[1]=.15;}if(b.role==="veranda-platform-coping"){b.position[1]=.19;b.size[1]=.08;}}
 m.colliders=solids.map(b=>({position:[...b.position],size:[...b.size],yaw:b.yaw}));return m;
}
export function correctPavilion(source:CentralModel){
 const m=structuredClone(source);Object.assign(m,{editorPartSources:frames.rameshwar});
 for(const p of m.profiles){if(p.role==="rameshwar-low-lotus-dome")p.profile=[[0,0],[1.56,0],[1.48,.14],[1.39,.5],[1.12,.99],[.76,1.32],[.24,1.47],[0,1.5]];if(p.role.includes("post"))p.material="museumStone";}
 pinnacle(m,0,5.67,0,.48,"rameshwar-photo-dome-crown");return m;
}
export const guardianEnclosureEvidence={form:"PHOTO_INFERRED",dimensions:"APPROXIMATE",height:2.65,thickness:.45,museumModel:"gallery-frontage",museumPart:"museum-entrance-door-wall-flank / west side at mid-depth",houseModel:"context:9c:1159393574",towerModel:"context:9c:1159393573",sources:["Supplied Khauma interior photographs","Owner stepped-boundary clarification","Existing National Art Gallery metadata and rendered west-wing geometry"],assumptions:"Gate-left alignment, 3 m initial continuation, .8 m front clearance, endpoint at west-side mid-depth, height/thickness and hidden geometry are working approximations. No nearest-compound/collider target selection."} as const;
/** A short continuation, a square-facing step, then the long boundary to the actual museum. */
function guardianMuseumEnclosure(models:CentralModel[],museum:CentralModel):CentralModel|null{
 const guardian=models.find(m=>m.id===guardianId),house=models.find(m=>m.id===guardianEnclosureEvidence.houseModel);
 if(!guardian||!house)return null;
 const {square,along}=gateBoundary(),matrix=editedMatrix(guardian),museumMatrix=editedMatrix(museum);
 const front=guardian.boxes.filter(b=>b.role==='school-wall').sort((a,b)=>b.position[0]-a.position[0])[0];
 const start=new Vector3(front.position[0]+front.size[0]/2,0,front.position[2]).applyMatrix4(matrix);start.y=0;
 // Identity/geometry target: National Art Gallery's broad western brick wing, NOT the
 // narrow foreground tower or compound 18962138. Meet the middle of its west SIDE.
 const body=museum.boxes.filter(b=>b.role==='museum-entrance-door-wall-flank').sort((a,b)=>a.position[0]-b.position[0])[0],u=new Vector3(Math.cos(body.yaw),0,-Math.sin(body.yaw));
 const end=new Vector3(...body.position).addScaledVector(u,-body.size[0]/2+.12).applyMatrix4(museumMatrix);end.y=0;
 const aEnd=start.clone().addScaledVector(along,3),tB=aEnd.dot(along),tE=end.dot(along),qE=end.dot(square);
 // Conservatively put C in front of the full occupied outline of the house AND tower.
 // Solve its required front offset with its museum endpoint fixed; never move a building.
 let qB=aEnd.dot(square);
 for(const building of models.filter(m=>m.id===guardianEnclosureEvidence.houseModel||m.id===guardianEnclosureEvidence.towerModel)){
  const delta=editedMatrix(building);
  for(const volume of building.volumes??[])for(const [x,z]of volume.rings[0]){
   const point=new Vector3(x,0,z).applyMatrix4(delta),alpha=(point.dot(along)-tB)/(tE-tB);
   if(alpha>=0&&alpha<1)qB=Math.max(qB,(point.dot(square)+.8-alpha*qE)/(1-alpha));
  }
 }
 const bEnd=aEnd.clone().addScaledVector(square,qB-aEnd.dot(square));
 const m=fresh('entrance:khauma-guardian-enclosure',[0,0]);
 const wall=(a:Vector3,b:Vector3,segment:string)=>{const dx=b.x-a.x,dz=b.z-a.z,length=Math.hypot(dx,dz);if(length<.05)return;const yaw=-Math.atan2(dz,dx),x=(a.x+b.x)/2,z=(a.z+b.z)/2;
  box(m,x,1.325,z,length,2.65,.45,'agedBrick',`guardian-enclosure-${segment}`,true,yaw);
  box(m,x,2.71,z,length,.12,.58,'agedBrick',`guardian-enclosure-${segment}-cap`,false,yaw);
  box(m,x,.11,z,length,.22,.57,'brick',`guardian-enclosure-${segment}-foot`,false,yaw);
 };
 wall(start,aEnd,'A');wall(aEnd,bEnd,'B');wall(bEnd,end,'C');
 for(const corner of [aEnd,bEnd]){box(m,corner.x,1.325,corner.z,.45,2.65,.45,'agedBrick','guardian-enclosure-corner-joint',true);box(m,corner.x,2.71,corner.z,.58,.12,.58,'agedBrick','guardian-enclosure-corner-cap');}
 return m;
}
export function correctKhaumaContext(models:CentralModel[],museum:CentralModel){
 const auditIds=new Set(khaumaInteriorAudit.filter(a=>a.classification==="FOOTPRINT_ONLY_CONTEXT").map(a=>a.id));
  const corrected=[...models.map(m=>{
 if(m.id==="context:9c:1159393579"){
  const r=structuredClone(m);r.accuracy="PHOTO_INFERRED";r.boxes=[];r.profiles=[];r.shapes=[];r.roofs=[];r.polygonRoofs=[];
  r.volumes=(r.volumes??[]).filter(v=>v.baseY===0).map(v=>({...v,height:.3,material:"brick" as const,role:"sattal-photo-apron-low-platform"}));r.colliders=r.volumes.flatMap(v=>walkableFloorColliders(v.rings,v.height));for(const c of r.colliders)r.boxes.push({...c,material:"brick",role:"sattal-photo-apron-low-platform-collision"});return r;
 }
 if(m.id==="context:9c:1159393576"){
  const r=structuredClone(m),apron:[number,number][][]=[[[6,-36],[18.4,-36],[18.4,-23.7],[6,-23.7],[6,-36]]],inside=(p:[number,number,number])=>p[0]>6&&p[0]<18.4&&p[2]>-36&&p[2]<-23.7;
  r.volumes=(r.volumes??[]).flatMap(v=>polygonClipping.difference(v.rings,apron).map(rings=>({...v,rings})));
  r.polygonRoofs=(r.polygonRoofs??[]).flatMap(v=>polygonClipping.difference(v.rings,apron).map(rings=>({...v,rings})));
  r.boxes=r.boxes.filter(b=>!inside(b.position));r.shapes=r.shapes.filter(b=>!inside(b.position));r.profiles=r.profiles.filter(b=>!inside(b.position));r.roofs=r.roofs.filter(b=>!inside(b.position));
  r.colliders=r.volumes.flatMap(v=>contextColliders(v.rings,v.height).map(c=>({...c,position:[c.position[0],c.position[1]+v.baseY,c.position[2]] as [number,number,number]})));return r;
 }
 if(m.id==="edge:khauma-north-flank:1158762014")return schoolEntrance(m);if(!auditIds.has(m.id))return m;const r=structuredClone(m);r.accuracy="FOOTPRINT_ONLY_CONTEXT";r.boxes=r.boxes.filter(b=>!/window|shutter|lattice|sill|head|frame|mullion/.test(b.role));r.shapes=[];r.profiles=[];
 const oldTop=Math.max(...(r.volumes??[]).map(v=>v.baseY+v.height),3.2);
 for(const v of r.volumes??[])if(v.baseY+v.height>3.2)v.height=3.2-v.baseY;
 for(const c of r.colliders){c.position[1]*=3.2/oldTop;c.size[1]*=3.2/oldTop;}
 for(const roof of r.roofs)roof.position[1]=3.2;for(const roof of r.polygonRoofs??[])roof.baseY=3.2;
 r.boxes=r.boxes.filter(b=>b.position[1]+b.size[1]/2<=3.2);return r;}),raisedVeranda()];
 const enclosure=guardianMuseumEnclosure(corrected,museum);
 return enclosure?[...corrected,enclosure]:corrected;
}
