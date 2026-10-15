import {ShapeUtils,Vector2} from "three";
import type {Polygon} from "polygon-clipping";
import type {SolidBox} from "./geometry.ts";
/** Exact static floor coverage. Rectangles stay oriented cuboids; irregular footprints
 * use a small compound of triangular prisms, preserving every opening and cut-out. */
export function walkableFloorColliders(rings:Polygon,height:number,baseY=0):SolidBox[]{
 const clean=rings.map(r=>r.filter((p,i)=>i===0||p[0]!==r[i-1][0]||p[1]!==r[i-1][1]).filter((p,i,a)=>i!==a.length-1||p[0]!==a[0][0]||p[1]!==a[0][1]));
 const ring=clean[0],yaw=-Math.atan2(ring[1][1]-ring[0][1],ring[1][0]-ring[0][0]),c=Math.cos(yaw),s=Math.sin(yaw);
 if(clean.length===1&&ring.length===4){const p=ring.map(([x,z])=>[x*c-z*s,x*s+z*c]),x0=Math.min(...p.map(p=>p[0])),x1=Math.max(...p.map(p=>p[0])),z0=Math.min(...p.map(p=>p[1])),z1=Math.max(...p.map(p=>p[1]));
  if(p.every(([x,z])=>Math.min(Math.abs(x-x0),Math.abs(x-x1))<1e-6&&Math.min(Math.abs(z-z0),Math.abs(z-z1))<1e-6)){const x=(x0+x1)/2,z=(z0+z1)/2;return [{position:[x*c+z*s,baseY+height/2,-x*s+z*c],size:[x1-x0,height,z1-z0],yaw}];}
 }
 const contours=clean.map(r=>r.map(p=>new Vector2(...p))),points=clean.flat();
 return ShapeUtils.triangulateShape(contours[0],contours.slice(1)).map(face=>{
  const p=face.map(i=>points[i]),x0=Math.min(...p.map(p=>p[0])),x1=Math.max(...p.map(p=>p[0])),z0=Math.min(...p.map(p=>p[1])),z1=Math.max(...p.map(p=>p[1])),x=(x0+x1)/2,z=(z0+z1)/2;
  return {position:[x,baseY+height/2,z],size:[x1-x0,height,z1-z0],yaw:0,vertices:[-height/2,height/2].flatMap(y=>p.flatMap(([px,pz])=>[px-x,y,pz-z]))};
 });
}
