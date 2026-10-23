import polygonClipping,{type Polygon,type MultiPolygon} from 'polygon-clipping';
import {ShapeUtils,Vector2} from 'three';
import type {CentralModel} from '../central-model.ts';
import type {SolidBox} from '../geometry.ts';
import {partitionArchitecturalParts} from '../../../features/world-editor/parts.ts';
import {rectangle,talejuPlan,gatePoint,type TalejuPlacement} from './spatial.ts';
import {entranceCourt} from './entrance-plan.ts';

const area=(p:MultiPolygon)=>p.reduce((sum,rings)=>sum+rings.reduce((n,ring,i)=>n+(i?-1:1)*Math.abs(ring.reduce((a,p,j)=>{const q=ring[(j+1)%ring.length];return a+p[0]*q[1]-q[0]*p[1];},0)/2),0),0);
function cutMasks(p:TalejuPlacement):Polygon[]{
 const south=p.yamNorth[1],north=p.entry[1];
 // Replace the complete photo-derived entrance envelope, not just the previous narrow alley.
 const entranceBack=entranceCourt.front+entranceCourt.rangeDepth+.5;
 const yam=gatePoint(p.gate,entranceCourt.centreX,-(entranceCourt.start+entranceBack)/2);
 return [
  [rectangle(...p.centre,talejuPlan.outerWidth+.08,talejuPlan.outerDepth+.08,talejuPlan.yaw)],
  [rectangle(...yam,entranceCourt.width+2*entranceCourt.rangeDepth+1,entranceBack-entranceCourt.start,p.gate.yaw)],
  [rectangle(...gatePoint(p.gate,0,-3.5),4.8,5,p.gate.yaw)],
  [rectangle(p.bekoX,(south+north)/2,10.5,south-north+2.3)],
  [rectangle((p.yamNorth[0]+p.bekoX)/2,south,p.bekoX-p.yamNorth[0]+.2,3.0)],
  [rectangle((p.entry[0]+p.bekoX-2.7)/2,north,p.bekoX-2.7-p.entry[0]+.2,3.0)],
 ];
}
function footprint(b:SolidBox):Polygon{return [rectangle(b.position[0],b.position[2],b.size[0],b.size[2],b.yaw)];}
/** Triangular prisms preserve concave cutouts and courtyard holes. Never replace them by one hull. */
function prisms(rings:Polygon,y:number,height:number):SolidBox[]{
 const clean=rings.map(r=>r.slice(0,-1)),points=clean.flat();
 return ShapeUtils.triangulateShape(clean[0].map(p=>new Vector2(...p)),clean.slice(1).map(r=>r.map(p=>new Vector2(...p)))).map((face):SolidBox=>{
  const triangle=face.map(i=>points[i]),x=triangle.reduce((s,p)=>s+p[0],0)/3,z=triangle.reduce((s,p)=>s+p[1],0)/3;
  return {position:[x,y+height/2,z],size:[1,height,1],yaw:0,vertices:[...triangle.flatMap(([a,b])=>[a-x,-height/2,b-z]),...triangle.flatMap(([a,b])=>[a-x,height/2,b-z])]};
 });
}
/** Only two coarse palace-interior source models are trimmed. Frozen exterior models never enter here. */
export function replaceLegacyInterior(source:CentralModel,p:TalejuPlacement):CentralModel{
 const masks=cutMasks(p),m:CentralModel=structuredClone(source);
 Object.assign(m,{editorPartSources:Object.fromEntries(partitionArchitecturalParts(source).map(part=>[part.id,part.source]))});
 // Use a single union, so overlapping route masks cannot accidentally leave strips/colliders.
 const voids=polygonClipping.union(masks[0],...masks.slice(1));
 const touches=(polygon:Polygon)=>area(polygonClipping.intersection(polygon,voids))>.00001;
 m.volumes=(source.volumes??[]).flatMap(v=>polygonClipping.difference(v.rings,voids).map(rings=>({...v,rings})));
 m.polygonRoofs=(source.polygonRoofs??[]).flatMap(r=>polygonClipping.difference(r.rings,voids).map(rings=>({...r,rings})));
 m.boxes=[];
 for(const b of source.boxes){
  const polygon=footprint(b);if(!touches(polygon)){m.boxes.push(b);continue;}
  for(const rings of polygonClipping.difference(polygon,voids))if(area([rings])>.0001)m.volumes.push({rings,baseY:b.position[1]-b.size[1]/2,height:b.size[1],material:b.material,role:b.role+'-retained-outside-taleju'});
 }
 m.colliders=source.colliders.flatMap(c=>{
  const polygon=footprint(c);return touches(polygon)?polygonClipping.difference(polygon,voids).flatMap(r=>prisms(r,c.position[1]-c.size[1]/2,c.size[1])):[c];
 });
 const decorativeFootprint=(q:{position:[number,number,number];yaw:number;points?:[number,number][];profile?:[number,number][];depth?:number})=>[rectangle(q.position[0],q.position[2],q.points?Math.max(...q.points.map(p=>p[0]))-Math.min(...q.points.map(p=>p[0])):Math.max(...(q.profile??[[1,0]]).map(p=>p[0]))*2,q.depth??.4,q.yaw)] as Polygon;
 m.shapes=source.shapes.filter(q=>!touches(decorativeFootprint(q)));
 m.profiles=source.profiles.filter(q=>!touches(decorativeFootprint(q)));
 m.accuracy=source.accuracy+' / TALEJU_INTERIOR_REPLACED';
 return m;
}
