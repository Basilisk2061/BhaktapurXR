import type {CentralModel} from '../central-model.ts';
import type {Point} from '../../../data/reconstruction/types.ts';

// Published drawing dimensions (Gutschow/KVPT, December 2008, PDF p8, Bhaktapur plan).
// Placement/yaw and outer depth are APPROXIMATE; none changes the frozen geographic frame.
export const talejuPlan={width:19.55,depth:19.75,outerWidth:27.30,outerDepth:27.50,yaw:-.069,
 centreFromGate:[-17.143449948689255,-36.74137748028019] as Point,
 floor:.08,plinth:.50,eave:6.10,ridge:7.50,doorWidth:1.60,doorHeight:2.65};
export interface TalejuPlacement {centre:Point;gate:CentralModel;entry:Point;bekoX:number;yamNorth:Point}
export function courtPoint(p:TalejuPlacement,x:number,z:number):Point{
 const c=Math.cos(talejuPlan.yaw),s=Math.sin(talejuPlan.yaw);
 return [p.centre[0]+x*c+z*s,p.centre[1]-x*s+z*c];
}
export function gatePoint(gate:CentralModel,x:number,z:number):Point{
 return [gate.origin[0]+x*Math.cos(gate.yaw)+z*Math.sin(gate.yaw),gate.origin[1]-x*Math.sin(gate.yaw)+z*Math.cos(gate.yaw)];
}
export function placeTaleju(gate:CentralModel):TalejuPlacement{
 const p:TalejuPlacement={gate,centre:[gate.origin[0]+talejuPlan.centreFromGate[0],gate.origin[1]+talejuPlan.centreFromGate[1]],entry:[0,0],bekoX:gate.origin[0]+10,yamNorth:gatePoint(gate,0,-13.2)};
 p.entry=courtPoint(p,talejuPlan.outerWidth/2,0);return p;
}
export function rectangle(x:number,z:number,w:number,d:number,yaw=0):Point[]{
 const c=Math.cos(yaw),s=Math.sin(yaw);
 return [[-w/2,-d/2],[w/2,-d/2],[w/2,d/2],[-w/2,d/2],[-w/2,-d/2]].map(([a,b])=>[x+a*c+b*s,z-a*s+b*c] as Point);
}
export function assembly(id:string,origin:Point,yaw=0,accuracy='PROVISIONAL'):CentralModel{
 return {id:'taleju:'+id,anchorId:'GOLDEN_GATE_INTERIOR_CONSTRAINED',origin,yaw,accuracy,neutral:false,
  renderOwnership:'WHOLE_ASSEMBLY',boxes:[],profiles:[],shapes:[],roofs:[],colliders:[],volumes:[],polygonRoofs:[]};
}
