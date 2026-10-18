import {BufferGeometry,Float32BufferAttribute} from "three";
import type {CentralRoof} from "./central-model.ts";

/** Gopinath-only swept hip: eased tile planes, raised perimeter corners and a closed edge shell. */
export function gopinathRoofGeometry(r:CentralRoof){
 const w=r.width/2,d=r.depth/2,ridge=Math.max(0,w-d),positions:number[]=[],uv:number[]=[];
 type Point=[number,number,number];
 const triangle=(a:Point,b:Point,c:Point)=>{for(const p of [a,c,b]){positions.push(...p);uv.push(p[0]/2,(p[2]+p[1])/2);}};
 const ring=(t:number):Point[]=>{
  const x=ridge+(w-ridge)*(1-t),z=d*(1-t),y=.12+r.rise*(.82*t+.18*t*t)+.13*Math.pow(1-t,6);
  return [[-x,y,-z],[x,y,-z],[x,y,z],[-x,y,z]];
 };
 const rings=[0,.12,.48,.8].map(ring);
 for(let n=0;n<rings.length-1;n++)for(let i=0;i<4;i++){
  const j=(i+1)%4;triangle(rings[n][i],rings[n][j],rings[n+1][j]);triangle(rings[n][i],rings[n+1][j],rings[n+1][i]);
 }
 const last=rings[rings.length-1],left:Point=[-ridge,.12+r.rise,0],right:Point=[ridge,.12+r.rise,0];
 triangle(last[0],last[1],right);triangle(last[0],right,left);triangle(last[1],last[2],right);
 triangle(last[2],last[3],left);triangle(last[2],left,right);triangle(last[3],last[0],left);
 // Close the thin tile edge; structural timber soffit is a separate shared-material surface.
 for(let i=0;i<4;i++){
  const j=(i+1)%4,a=rings[0][i],b=rings[0][j],c:Point=[b[0],b[1]-.22,b[2]],e:Point=[a[0],a[1]-.22,a[2]];
  triangle(a,c,b);triangle(a,e,c);
 }
 const g=new BufferGeometry();g.setAttribute("position",new Float32BufferAttribute(positions,3));g.setAttribute("uv",new Float32BufferAttribute(uv,2));g.computeVertexNormals();g.rotateY(r.yaw);g.translate(...r.position);return g;
}
