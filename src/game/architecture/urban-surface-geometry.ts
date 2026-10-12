import {BufferGeometry,Float32BufferAttribute,ShapeUtils,Vector2} from "three";
import {volumeGeometry} from "./geometry.ts";
import type {CentralVolume,CentralPolygonRoof} from "./central-model.ts";
export function urbanVolumeGeometry(v:CentralVolume){const g=volumeGeometry({vertices:v.rings[0],holes:v.rings.slice(1)},v.height);g.translate(0,v.baseY,0);return g;}
const distance=([x,z]:[number,number],a:[number,number],b:[number,number])=>{const dx=b[0]-a[0],dz=b[1]-a[1],d=dx*dx+dz*dz,t=d?Math.max(0,Math.min(1,((x-a[0])*dx+(z-a[1])*dz)/d)):0;return Math.hypot(x-a[0]-t*dx,z-a[1]-t*dz);};
/** Continuous pitched surface over the mapped polygon, including courtyard holes.
 * Sampling changes mesh detail, never source boundaries. No roof spans an inner courtyard. */
export function urbanRoofGeometry(r:CentralPolygonRoof){
 const rings=r.rings.map(r=>r.slice(0,-1)),points=rings.flat(),faces=ShapeUtils.triangulateShape(rings[0].map(p=>new Vector2(...p)),rings.slice(1).map(r=>r.map(p=>new Vector2(...p)))),pos:number[]=[],uv:number[]=[];
 const height=(p:[number,number])=>r.baseY+Math.min(r.rise,Math.min(...rings.flatMap(r=>r.map((a,i)=>distance(p,a,r[(i+1)%r.length]))))*.48);
 const triangle=(a:[number,number],b:[number,number],c:[number,number],depth=0)=>{
  const edges=[Math.hypot(a[0]-b[0],a[1]-b[1]),Math.hypot(b[0]-c[0],b[1]-c[1]),Math.hypot(c[0]-a[0],c[1]-a[1])],longest=Math.max(...edges);
  if(longest>r.maxEdge&&depth<12){const i=edges.indexOf(longest),p=[a,b,c][i],q=[b,c,a][i],other=[c,a,b][i],mid:[number,number]=[(p[0]+q[0])/2,(p[1]+q[1])/2];triangle(p,mid,other,depth+1);triangle(mid,q,other,depth+1);return;}
  for(const p of [a,c,b]){const y=height(p);pos.push(p[0],y,p[1]);uv.push(p[0]/2,(p[1]+y)/2);}
 };
 for(const f of faces)triangle(points[f[0]],points[f[1]],points[f[2]]);
 const g=new BufferGeometry();g.setAttribute("position",new Float32BufferAttribute(pos,3));g.setAttribute("uv",new Float32BufferAttribute(uv,2));g.computeVertexNormals();return g;
}
