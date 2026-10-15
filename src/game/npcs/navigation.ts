import {Vector3} from 'three';
import type {SeatSpan} from '../player/arcade-sitting.ts';
export interface WalkNode {id:number;point:Vector3;row:number}
export interface WalkGraph {nodes:WalkNode[];edges:[number,number][]}
export interface NavigationProbe {height:(point:Vector3)=>number|null;clear:(from:Vector3,to:Vector3)=>boolean}
/** Deliberately small arcade-front plaza grid. Every node and edge must pass actual static physics. */
export function pedestrianGraph(span:SeatSpan,probe:NavigationProbe):WalkGraph{
 const nodes:WalkNode[]=[];
 for(let row=0;row<2;row++)for(let i=0;i<5;i++){
  const point=span.a.clone().lerp(span.b,.1+i*.2).addScaledVector(span.outward,row===0?2:5),height=probe.height(point);
  if(height===null)continue;point.y=height;nodes.push({id:row*5+i,point,row});
 }
 const edges:[number,number][]=[];for(const a of nodes)for(const b of nodes)if(a.id<b.id&&((a.row===b.row&&b.id-a.id===1)||(b.id-a.id===5))&&probe.clear(a.point,b.point))edges.push([a.id,b.id]);
 // Retain the largest connected component; isolated nodes never become destinations/spawns.
 let largest=new Set<number>();for(const node of nodes){const connected=new Set([node.id]),pending=[node.id];while(pending.length){const id=pending.pop()!;for(const edge of edges)if(edge.includes(id)){const next=edge[0]===id?edge[1]:edge[0];if(!connected.has(next)){connected.add(next);pending.push(next);}}}if(connected.size>largest.size)largest=connected;}
 return {nodes:nodes.filter(n=>largest.has(n.id)),edges:edges.filter(([a,b])=>largest.has(a)&&largest.has(b))};
}
export function route(graph:WalkGraph,from:number,to:number):number[]{
 const pending=[[from]],seen=new Set([from]);while(pending.length){const path=pending.shift()!,last=path.at(-1)!;if(last===to)return path.slice(1);for(const [a,b]of graph.edges){const next=a===last?b:b===last?a:null;if(next!==null&&!seen.has(next)){seen.add(next);pending.push([...path,next]);}}}return [];
}
export const edgeKey=(a:number,b:number)=>a<b?`${a}:${b}`:`${b}:${a}`;
