import {Vector3} from "three";
import savedState from "../../features/bhaktapur/data/world-editor-state.json" with {type:"json"};
import legacyOverrides from "../../features/bhaktapur/data/manual-transform-overrides.json" with {type:"json"};
import {overrideMatrix,validateTransform,type ManualTransform} from "../../features/world-editor/transforms.ts";
import {exteriorFrame,exteriorLocal} from "./khauma-exterior.ts";
import {box} from "./architecture-primitives.ts";
import type {CentralMaterial,CentralModel} from "./central-model.ts";

/** Khauma entrance rear playable-world boundary: GAMEPLAY / CONTEXTUAL BOUNDARY.
 * This market screen is not a historically verified reconstruction element.
 * Existing edited shop walls determine the joins; no building or saved edit is moved.
 */
export const khaumaRearBoundary={
 classification:"GAMEPLAY_CONTEXTUAL_BOUNDARY",
 leftJoin:"entrance:KhaumaExterior_LeftUrbanContext",
 rightJoin:"entrance:KhaumaExterior_RightCommercial",
 rearClearance:3,height:5.3,thickness:.35,panelPitch:1.7,
} as const;
type Point=[number,number];
export function buildKhaumaRearBoundary(exteriorModels:CentralModel[]):CentralModel{
 const config=khaumaRearBoundary,transforms=savedState.transforms??legacyOverrides;
 const m:CentralModel={id:"entrance:khauma-rear-boundary",anchorId:"GAMEPLAY_CONTEXTUAL_BOUNDARY",origin:[...exteriorFrame.origin],yaw:exteriorFrame.yaw,accuracy:config.classification,neutral:false,boxes:[],profiles:[],shapes:[],roofs:[],colliders:[]};
 const occupied=exteriorModels.filter(model=>model.id!=="entrance:KhaumaExterior_Road"&&model.id!=="entrance:KhaumaExterior_StreetProps");
 const frames=new Map(occupied.map(model=>{
  const source:ManualTransform={position:[model.origin[0],0,model.origin[1]],rotation:[0,model.yaw,0],scale:[1,1,1]};
  const saved:unknown=Object.entries(transforms).find(([id])=>id===model.id)?.[1];
  return [model.id,overrideMatrix(source,saved?validateTransform(saved):source)] as const;
 }));
 // Only read existing solid geometry. Account for full saved rotation/scale, not
 // source pivots or a guessed world-axis rectangle around manually arranged shops.
 const corners=occupied.flatMap(model=>model.colliders.flatMap(solid=>{
  const points:Point[]=[];
  for(const x of [-.5,.5])for(const z of [-.5,.5]){
   const dx=x*solid.size[0],dz=z*solid.size[2],c=Math.cos(solid.yaw),s=Math.sin(solid.yaw);
   const p=new Vector3(solid.position[0]+dx*c+dz*s,solid.position[1],solid.position[2]-dx*s+dz*c).applyMatrix4(frames.get(model.id)!);
   const q=exteriorLocal(p.toArray());points.push([q[0],q[2]]);
  }
  return points;
 }));
 const join=(id:string):Point=>{
  const model=occupied.find(model=>model.id===id)!;
  // This is a known ground-level solid back wall, not a roof-bound corner.
  // Ending the return in its centre guarantees a physical overlap with the shop.
  const wall=model.boxes.filter(b=>b.role==="exterior-shop-back-wall").sort((a,b)=>a.position[0]-b.position[0])[0];
  const p=new Vector3(...wall.position).applyMatrix4(frames.get(id)!);
  const q=exteriorLocal(p.toArray());return [q[0],q[2]];
 };
 const left=join(config.leftJoin),right=join(config.rightJoin);
 const rear=Math.max(24,...corners.map(p=>p[1]))+config.rearClearance;
 const minX=Math.min(left[0],...corners.map(p=>p[0]))-2;
 const maxX=Math.max(right[0],...corners.map(p=>p[0]))+2;
 const path:Point[]=[left,[minX,rear],[maxX,rear],right];
 const cloth:CentralMaterial[]=["exteriorWine","exteriorTeal","exteriorOchre","exteriorBlue","plaster"];
 for(let segment=0;segment<path.length-1;segment++){
  const a=path[segment],b=path[segment+1],dx=b[0]-a[0],dz=b[1]-a[1],length=Math.hypot(dx,dz),yaw=-Math.atan2(dz,dx),nx=dz/length,nz=-dx/length;
  const point=(t:number,depth=0):Point=>[a[0]+dx*t+nx*depth,a[1]+dz*t+nz*depth];
  // Continuous dark backing closes cloth gaps; the same piece carries solid fixed
  // Rapier collision through the existing architecture pipeline. No debug mesh.
  const back=point(.5,-.18);
  box(m,back[0],config.height/2,back[1],length+.3,config.height,config.thickness,"recess","gameplay-rear-screen-backing",true,yaw);
  for(const y of [.18,2.65,config.height]){
   const p=point(.5,.08);box(m,p[0],y,p[1],length+.3,.12,.15,"carvedTimber","gameplay-textile-horizontal-rail",false,yaw);
  }
  const count=Math.ceil(length/config.panelPitch),pitch=length/count;
  for(let i=0;i<count;i++){
   const p=point((i+.5)/count,.18+(i%3)*.045),height=config.height-.22-(i%3)*.09,width=pitch+.025;
   box(m,p[0],height/2+.08,p[1],width,height,.055,cloth[(i+segment)%cloth.length],"gameplay-hanging-textile",false,yaw);
   // Shallow folds and woven bands suggest hanging cloth without animated meshes.
   for(const offset of [-.25,.25])box(m,p[0]+dx/length*width*offset,height/2+.08,p[1]+dz/length*width*offset,.055,height,.12,cloth[(i+segment)%cloth.length],"gameplay-textile-fold",false,yaw);
   for(const y of [.35,.46,height-.12])box(m,p[0],y,p[1],width,.035,.085,"exteriorOchre","gameplay-woven-hem",false,yaw);
  }
  const posts=Math.ceil(length/3.2);
  for(let i=0;i<=posts;i++){
   const p=point(i/posts,.12);box(m,p[0],config.height/2,p[1],.14,config.height+.15,.16,"carvedTimber","gameplay-timber-support",false,yaw);
  }
 }
 return m;
}
