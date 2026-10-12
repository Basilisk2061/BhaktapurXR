import { BufferGeometry, Float32BufferAttribute, Shape, Path, ExtrudeGeometry, LatheGeometry, Vector2 } from "three";
import type { ProfilePiece } from "./landmark-families.ts";

export function profileGeometry(piece:ProfilePiece) {
  const indexed=new LatheGeometry(piece.profile.map(([r,y])=>new Vector2(r,y)),piece.segments);
  const geometry=indexed.toNonIndexed();indexed.dispose();
  if(piece.role==="octagonal-roof")geometry.rotateY(Math.PI/8);
  geometry.translate(...piece.position);return geometry;
}
import type { LocalPoint, SpatialFeature } from "../../types/spatial.ts";
import { pointInsidePolygon } from "../../lib/map-calibration.ts";
import { architectureParameters as p } from "../../data/architecture/config.ts";
import { footprintBounds } from "../../data/architecture/registry.ts";

export function footprintShape(f: Pick<SpatialFeature,"vertices"|"holes">) {
  const s = new Shape();
  f.vertices.forEach(([x,z],i)=> i ? s.lineTo(x,-z) : s.moveTo(x,-z)); s.closePath();
  for(const ring of f.holes ?? []) { const hole=new Path();ring.forEach(([x,z],i)=>i?hole.lineTo(x,-z):hole.moveTo(x,-z));hole.closePath();s.holes.push(hole); }
  return s;
}
export function volumeGeometry(f: Pick<SpatialFeature,"vertices"|"holes">, height: number) {
  const g=new ExtrudeGeometry(footprintShape(f),{depth:height,bevelEnabled:false,steps:1,curveSegments:1});
  g.rotateX(-Math.PI/2);
  // World-sized UVs; generated brick texture repeats every 2 metres.
  const positions=g.getAttribute("position"), normals=g.getAttribute("normal"), uv=g.getAttribute("uv");
  for(let i=0;i<positions.count;i++){ const horizontal=Math.abs(normals.getY(i))>.5;uv.setXY(i,(horizontal?positions.getX(i):Math.abs(normals.getX(i))>.5?positions.getZ(i):positions.getX(i))/2,(horizontal?positions.getZ(i):positions.getY(i))/2); }
  return g;
}

/** Restrained straight hip roof: ridge, four slopes, eaves; no fantasy curvature. */
export function hipRoofGeometry(width: number, depth: number, rise: number) {
  const w=width/2,d=depth/2,r=Math.max(0,width*.5-depth*.35);
  const points=[[-w,0,-d],[w,0,-d],[w,0,d],[-w,0,d],[-r,rise,0],[r,rise,0]];
  const triangles=[[0,1,5],[0,5,4],[1,2,5],[2,3,4],[2,4,5],[3,0,4],[3,2,1],[3,1,0]];
  const v:number[]=[],uv:number[]=[];
  for(const face of triangles) for(const i of face){const pt=points[i];v.push(...pt);uv.push(pt[0]/2,(pt[2]+pt[1])/2);}
  const g=new BufferGeometry();g.setAttribute("position",new Float32BufferAttribute(v,3));g.setAttribute("uv",new Float32BufferAttribute(uv,2));g.computeVertexNormals();return g;
}
export function insideFootprint(point: LocalPoint,f:Pick<SpatialFeature,"vertices"|"holes">) {
  return pointInsidePolygon(point,f.vertices) && !(f.holes??[]).some(h=>pointInsidePolygon(point,h));
}
export interface SolidBox { position:[number,number,number]; size:[number,number,number]; yaw:number }

/** Thin compound boundary walls plus coalesced interior cuboids; white voids stay open. */
export function footprintColliders(f: Pick<SpatialFeature,"vertices"|"holes">,height:number): SolidBox[] {
  const boxes:SolidBox[]=[];
  for(const ring of [f.vertices,...(f.holes??[])]) ring.forEach((a,i)=>{const b=ring[(i+1)%ring.length],dx=b[0]-a[0],dz=b[1]-a[1],length=Math.hypot(dx,dz);boxes.push({position:[(a[0]+b[0])/2,height/2,(a[1]+b[1])/2],size:[length,height,p.wallCollisionThickness],yaw:-Math.atan2(dz,dx)});});
  const b=footprintBounds(f.vertices),step=p.collisionCell;
  for(let z=b.minZ+step/2;z<b.maxZ;z+=step){let start:number|null=null;
    for(let x=b.minX+step/2;x<=b.maxX+step;x+=step){ const ok=x+step/2<b.maxX && [[x-step/2,z-step/2],[x+step/2,z-step/2],[x+step/2,z+step/2],[x-step/2,z+step/2]].every(c=>insideFootprint(c as LocalPoint,f));
      if(ok && start===null)start=x-step/2;
      if(!ok && start!==null){const end=x-step/2;boxes.push({position:[(start+end)/2,height/2,z],size:[end-start,height,step],yaw:0});start=null;}
    }
  }return boxes;
}
