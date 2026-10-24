import polygonClipping,{type Polygon} from 'polygon-clipping';
import {ShapeUtils,Vector2,type BufferGeometry} from 'three';
import type {CentralModel,CentralProfile} from '../central-model.ts';
import type {SolidBox} from '../geometry.ts';
import {urbanVolumeGeometry} from '../urban-surface-geometry.ts';
import {profileGeometry,shapeGeometry,roofGeometry} from '../central-visual-assets.ts';
import {partitionArchitecturalParts} from '../../../features/world-editor/parts.ts';
import {gatePoint,rectangle,type TalejuPlacement} from './spatial.ts';
import {entranceCourt as plan} from './entrance-plan.ts';

type Vertex={p:number[];uv:number[]};
/** Reserve the court AND its enclosing ranges. Public square-facing skins at z >= -1.50
 * are protected. This is an interior void, never a relocation of an exterior owner. */
export function entranceInteriorMask(p:TalejuPlacement):Polygon{
 const back=plan.front+plan.rangeDepth+.48,front=1.50;
 return [rectangle(...gatePoint(p.gate,plan.centreX,-(front+back)/2),plan.width+2*plan.rangeDepth+.96,back-front,p.gate.yaw)];
}
function prism(rings:Polygon,b:SolidBox):SolidBox[]{
 const clean=rings.map(r=>r.slice(0,-1)),points=clean.flat(),height=b.size[1];
 return ShapeUtils.triangulateShape(clean[0].map(p=>new Vector2(...p)),clean.slice(1).map(r=>r.map(p=>new Vector2(...p)))).map((face):SolidBox=>{
  const tri=face.map(i=>points[i]),x=tri.reduce((n,p)=>n+p[0],0)/3,z=tri.reduce((n,p)=>n+p[1],0)/3;
  return {position:[x,b.position[1],z],size:[1,height,1],yaw:0,vertices:[...tri.flatMap(([a,c])=>[a-x,-height/2,c-z]),...tri.flatMap(([a,c])=>[a-x,height/2,c-z])]};
 });
}
function split(poly:Vertex[],distance:(p:number[])=>number){
 const inside:Vertex[]=[],outside:Vertex[]=[];
 for(let i=0;i<poly.length;i++){
  const a=poly[i],b=poly[(i+1)%poly.length],da=distance(a.p),db=distance(b.p);
  (da>=0?inside:outside).push(a);
  if((da>=0)!==(db>=0)){
   const t=da/(da-db),v={p:a.p.map((n,j)=>n+t*(b.p[j]-n)),uv:a.uv.map((n,j)=>n+t*(b.uv[j]-n))};
   inside.push(v);outside.push(v);
  }
 }
 return {inside,outside};
}
/** Cut actual roof triangles, interpolating their original UVs. Rebuilding a hipped roof
 * from a smaller footprint would change its exterior slopes; this deliberately does not. */
function cutSurface(g:BufferGeometry,q:{position:[number,number,number];yaw:number;material:CentralProfile['material'];role:string},mask:Polygon):CentralProfile|null{
 const flat=g.index?g.toNonIndexed():g,pos=flat.getAttribute('position'),uv=flat.getAttribute('uv'),ring=mask[0],positions:number[]=[],uvs:number[]=[],indices:number[]=[];
 const c=Math.cos(q.yaw),s=Math.sin(q.yaw);
 const append=(poly:Vertex[])=>{
  for(let j=1;j<poly.length-1;j++)for(const v of [poly[0],poly[j],poly[j+1]]){
   const x=v.p[0]-q.position[0],z=v.p[2]-q.position[2];
   positions.push(x*c-z*s,v.p[1]-q.position[1],x*s+z*c);uvs.push(...v.uv);indices.push(indices.length);
  }
 };
 for(let i=0;i<pos.count;i+=3){
  let remaining=Array.from({length:3},(_,j)=>({p:[pos.getX(i+j),pos.getY(i+j),pos.getZ(i+j)],uv:uv?[uv.getX(i+j),uv.getY(i+j)]:[0,0]}));
  for(let k=0;k<ring.length-1&&remaining.length>=3;k++){
   const a=ring[k],b=ring[k+1],result=split(remaining,v=>(b[0]-a[0])*(v[2]-a[1])-(b[1]-a[1])*(v[0]-a[0]));
   append(result.outside);remaining=result.inside;
  }
 }
 if(flat!==g)flat.dispose();g.dispose();
 return positions.length?{...q,profile:[[0,0],[.1,1]],segments:4,sculptedSurface:{positions,indices,uvs}}:null;
}
/** Exterior shell / interior representation boundary. Only these three audited owners
 * are eligible. Original IDs, transforms, exterior vertices and editor part bases survive. */
export function separatePalaceInterior(source:CentralModel,p:TalejuPlacement):CentralModel{
 const mask=entranceInteriorMask(p),m:CentralModel=structuredClone(source);
 Object.assign(m,{editorPartSources:Object.fromEntries(partitionArchitecturalParts(source).map(part=>[part.id,part.source]))});
 m.boxes=[];m.volumes=[...(source.volumes??[])];m.profiles=[];m.shapes=[];m.roofs=[];
 const footprint=(b:SolidBox):Polygon=>[rectangle(b.position[0],b.position[2],b.size[0],b.size[2],b.yaw)];
 for(const b of source.boxes){
  const polygon=footprint(b);
  if(!polygonClipping.intersection(polygon,mask).length){m.boxes.push(b);continue;}
  for(const rings of polygonClipping.difference(polygon,mask)){
   const g=urbanVolumeGeometry({rings,baseY:b.position[1]-b.size[1]/2,height:b.size[1],material:b.material,role:b.role});
   const positions=g.getAttribute('position'),normals=g.getAttribute('normal'),uv=g.getAttribute('uv'),c=Math.cos(b.yaw),sn=Math.sin(b.yaw);
   // Retained exterior faces keep the original instanced-box UV phase and metre scale.
   for(let i=0;i<positions.count;i++){
    const dx=positions.getX(i)-b.position[0],dz=positions.getZ(i)-b.position[2],x=dx*c-dz*sn,y=positions.getY(i)-b.position[1],z=dx*sn+dz*c;
    const nx=normals.getX(i)*c-normals.getZ(i)*sn,nz=normals.getX(i)*sn+normals.getZ(i)*c,ny=normals.getY(i);
    const u=Math.abs(ny)>.5?x+b.size[0]/2:Math.abs(nx)>.5?(nx>0?-z:z)+b.size[2]/2:(nz>0?x:-x)+b.size[0]/2;
    const v=Math.abs(ny)>.5?(ny>0?-z:z)+b.size[2]/2:y+b.size[1]/2;
    uv.setXY(i,u/2,v/2);
   }
   // Geometry is already outside the void; this encodes it with its original role/yaw.
   const retained=cutSurface(g,b,mask);if(retained)m.profiles.push(retained);
  }
 }
 for(const q of source.profiles){const retained=cutSurface(profileGeometry(q),q,mask);if(retained)m.profiles.push(retained);}
 for(const q of source.shapes){const retained=cutSurface(shapeGeometry(q),q,mask);if(retained)m.profiles.push(retained);}
 for(const q of source.roofs){const retained=cutSurface(roofGeometry(q),q,mask);if(retained)m.profiles.push(retained);}
 m.colliders=source.colliders.flatMap(b=>{
  const polygon=footprint(b);
  if(!polygonClipping.intersection(polygon,mask).length)return [b];
  const retained=polygonClipping.difference(polygon,mask).flatMap(r=>prism(r,b));
  const original=source.boxes.find(q=>q.yaw===b.yaw&&q.position.every((n,i)=>n===b.position[i])&&q.size.every((n,i)=>n===b.size[i]));
  // Hidden signature boxes retain collider-to-part ownership after convex decomposition.
  if(original)for(const collider of retained)m.boxes.push({...collider,material:original.material,role:original.role+'-collision'});
  return retained;
 });
 m.accuracy=source.accuracy+' / HIDDEN_INTERIOR_PROXY_CLIPPED';
 return m;
}
