import {Vector3} from 'three';
import type {SeatSpan} from '../player/arcade-sitting.ts';
export interface WalkNode {id:number;point:Vector3;row:number}
export interface WalkGraph {nodes:WalkNode[];edges:[number,number][]}
export interface NavigationProbe {height:(point:Vector3)=>number|null;clear:(from:Vector3,to:Vector3)=>boolean}
/** Arcade links plus public plaza routes, filtered by the current static collision world. */
export function pedestrianGraph(span:SeatSpan,probe:NavigationProbe):WalkGraph{
 const nodes:WalkNode[]=[];
 for(let row=0;row<2;row++)for(let i=0;i<5;i++){
  const point=span.a.clone().lerp(span.b,.1+i*.2).addScaledVector(span.outward,row===0?2:5),height=probe.height(point);
  if(height===null)continue;point.y=height;nodes.push({id:row*5+i,point,row});
 }
 // Keep the original arcade nodes/IDs for seating and existing spawn locations.
 let id=10;
 for(let z=-28;z<=4;z+=8)for(let x=-120;x<=24;x+=8){
  const point=new Vector3(x,0,z),height=probe.height(point);if(height===null)continue;
  point.y=height;if(nodes.some(n=>n.point.distanceTo(point)<2))continue;
  nodes.push({id:id++,point,row:2});
 }
 const edges:[number,number][]=[];
 for(const a of nodes)for(const b of nodes){
  if(a.id>=b.id)continue;
  const arcade=a.id<10&&b.id<10;
  if(arcade?!((a.row===b.row&&b.id-a.id===1)||b.id-a.id===5):a.point.distanceTo(b.point)>11.5)continue;
  if(!probe.clear(a.point,b.point))continue;
  // A clear body sweep alone could bridge a gap or low plinth: verify the floor too.
  const steps=Math.ceil(a.point.distanceTo(b.point));let walkable=true;
  for(let i=1;i<steps;i++)if(probe.height(a.point.clone().lerp(b.point,i/steps))===null){walkable=false;break;}
  if(walkable)edges.push([a.id,b.id]);
 }
 // Retain the largest connected component; isolated nodes never become destinations/spawns.
 let largest=new Set<number>();for(const node of nodes){const connected=new Set([node.id]),pending=[node.id];while(pending.length){const id=pending.pop()!;for(const edge of edges)if(edge.includes(id)){const next=edge[0]===id?edge[1]:edge[0];if(!connected.has(next)){connected.add(next);pending.push(next);}}}if(connected.size>largest.size)largest=connected;}
 return {nodes:nodes.filter(n=>largest.has(n.id)),edges:edges.filter(([a,b])=>largest.has(a)&&largest.has(b))};
}
export function route(graph:WalkGraph,from:number,to:number):number[]{
 const pending=[[from]],seen=new Set([from]);while(pending.length){const path=pending.shift()!,last=path.at(-1)!;if(last===to)return path.slice(1);for(const [a,b]of graph.edges){const next=a===last?b:b===last?a:null;if(next!==null&&!seen.has(next)){seen.add(next);pending.push([...path,next]);}}}return [];
}
export const edgeKey=(a:number,b:number)=>a<b?`${a}:${b}`:`${b}:${a}`;
