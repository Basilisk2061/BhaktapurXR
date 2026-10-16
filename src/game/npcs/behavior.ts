import {Vector3} from 'three';
import {nearestArcadeSeat,sittingConfig,type ArcadeSeat,type SeatSpan} from '../player/arcade-sitting.ts';
import {seededRandom,npcDefinitions,type NpcState} from './definitions.ts';
import {route,edgeKey,type WalkGraph,type NavigationProbe} from './navigation.ts';
export const oldManSitPreference=(cycles:number)=>Math.min(.85,.55+Math.min(Math.max(cycles,0),3)*.10);
export interface NpcAgent {restCycles:number;id:string;character:string;state:NpcState;position:Vector3;target:Vector3|null;node:number;nextNode:number|null;path:number[];seat:ArcadeSeat|null;sitUntil:number;waitUntil:number;nextSeatAt:number;random:()=>number;phase:number;speed:number;yaw:number;walked:number;actualSpeed:number;blocked:number;edge:string|null;approaching:boolean;returning:boolean}
const flatDistance=(a:Vector3,b:Vector3)=>Math.hypot(a.x-b.x,a.z-b.z);
export class NpcSimulation {
 agents:NpcAgent[];time=0;private claims=new Map<string,string>();private planned=new Map<string,Vector3>();
 graph:WalkGraph;span:SeatSpan;probe:NavigationProbe;
 constructor(graph:WalkGraph,span:SeatSpan,probe:NavigationProbe,instances:readonly {id:string;character:string;seed:number;start:number}[]){
  this.graph=graph;this.span=span;this.probe=probe;
  this.agents=instances.map(instance=>{const random=seededRandom(instance.seed),node=graph.nodes[instance.start%graph.nodes.length];return {restCycles:0,id:instance.id,character:instance.character,state:'IDLE',position:node.point.clone(),target:null,node:node.id,nextNode:null,path:[],seat:null,sitUntil:0,waitUntil:1+random()*5,nextSeatAt:25+random()*35,random,phase:random(),speed:npcDefinitions[instance.character].speed*(.96+random()*.08),yaw:random()*Math.PI*2,walked:0,actualSpeed:0,blocked:0,edge:null,approaching:false,returning:false};});
 }
 private node(id:number){return this.graph.nodes.find(n=>n.id===id)!;}
 private clearOfPeople(point:Vector3,agent:NpcAgent,player:Vector3,margin=.95){return (Math.abs(point.y-player.y)>2||flatDistance(point,player)>margin)&&this.agents.every(other=>other===agent||flatDistance(point,other.position)>margin);}
 private release(agent:NpcAgent){if(agent.edge)this.claims.delete(agent.edge);agent.edge=null;}
 private idle(agent:NpcAgent){if(agent.character==='old_man_01'&&agent.state==='WALKING')agent.restCycles++;this.release(agent);agent.state='IDLE';agent.target=null;agent.nextNode=null;agent.waitUntil=this.time+2+agent.random()*5;agent.blocked=0;}
 private waitForRoute(agent:NpcAgent,delta:number){agent.blocked+=delta;if(agent.blocked>3){agent.path=[];agent.seat=null;agent.approaching=false;this.idle(agent);}}
 private chooseSeat(agent:NpcAgent,player:Vector3,playerSeat:ArcadeSeat|null){
  const fractions=[.13,.31,.5,.69,.87].map(t=>({t,score:flatDistance(this.span.a.clone().lerp(this.span.b,t),agent.position)+agent.random()*4})).sort((a,b)=>a.score-b.score);for(const {t}of fractions){
   const near=this.span.a.clone().lerp(this.span.b,t),seat=nearestArcadeSeat(near,[this.span]);if(!seat)continue;
   const depth=npcDefinitions[agent.character].sitDepth;if(depth!==undefined)seat.point.addScaledVector(this.span.outward,sittingConfig.depth-depth);
   if(playerSeat&&flatDistance(playerSeat.point,seat.point)<1.3||this.agents.some(other=>other!==agent&&other.seat&&flatDistance(other.seat.point,seat.point)<1.3)||!this.clearOfPeople(seat.exit,agent,player,1.2))continue;
   const approach=this.graph.nodes.filter(n=>n.row===0&&this.probe.clear(n.point,new Vector3(seat.exit.x,n.point.y,seat.exit.z))).sort((a,b)=>flatDistance(a.point,seat.exit)-flatDistance(b.point,seat.exit))[0];if(!approach)continue;
   agent.seat=seat;agent.path=route(this.graph,agent.node,approach.id);agent.approaching=true;return true;
  }return false;
 }
 tick(delta:number,player:Vector3,playerSeat:ArcadeSeat|null){
  this.planned.clear();this.time+=delta;
  for(const agent of this.agents){
   if(agent.state==='SITTING'){
    if(agent.seat&&Math.abs(player.y-agent.seat.point.y)<2&&flatDistance(player,agent.seat.point)<.8)agent.sitUntil=this.time;
    if(this.time<agent.sitUntil||!agent.seat||!this.clearOfPeople(agent.seat.exit,agent,player,.9))continue;
    const height=this.probe.height(agent.seat.exit);if(height===null)continue;
    agent.position.copy(agent.seat.exit).setY(height);agent.seat=null;agent.returning=true;agent.state='WALKING';agent.target=this.node(agent.node).point.clone();agent.nextSeatAt=agent.character==='old_man_01'?this.time+55+agent.random()*40:this.time+65+agent.random()*65;continue;
   }
   if(agent.state==='IDLE'){
    if(this.time<agent.waitUntil)continue;
    if(this.time>=agent.nextSeatAt&&agent.random()<(agent.character==='old_man_01'?oldManSitPreference(agent.restCycles):.35))this.chooseSeat(agent,player,playerSeat);
    if(!agent.seat){const candidates=this.graph.nodes.filter(n=>n.id!==agent.node&&route(this.graph,agent.node,n.id).length>0&&this.clearOfPeople(n.point,agent,player));const destination=candidates[Math.floor(agent.random()*candidates.length)];if(!destination){agent.waitUntil=this.time+1;continue;}agent.path=route(this.graph,agent.node,destination.id);}
    agent.state='WALKING';
   }
   if(agent.target&&flatDistance(agent.position,agent.target)<.12){
    if(agent.returning){agent.returning=false;this.idle(agent);continue;}
    if(agent.nextNode!==null){agent.node=agent.nextNode;agent.nextNode=null;this.release(agent);agent.target=null;if(agent.character==='old_man_01'&&!agent.seat){
      agent.restCycles++;
      // Reconsider rest at a reached route node, rather than finishing a long cross-square trip first.
      if(agent.path.length&&this.time>=agent.nextSeatAt&&agent.random()<oldManSitPreference(agent.restCycles))this.chooseSeat(agent,player,playerSeat);
     }}
    else if(agent.approaching&&agent.seat){
     if(!this.clearOfPeople(agent.seat.point,agent,player,1.1)){agent.seat=null;agent.approaching=false;agent.returning=true;agent.target=this.node(agent.node).point.clone();continue;}
     agent.position.copy(agent.seat.point);agent.yaw=agent.seat.yaw;agent.state='SITTING';agent.target=null;agent.approaching=false;if(agent.character==='old_man_01')agent.restCycles=0;agent.sitUntil=this.time+(agent.character==='old_man_01'?22:14)+agent.random()*16;continue;
    }
   }
   if(agent.state==='WALKING'&&!agent.target){
    const next=agent.path[0];if(next!==undefined){const key=edgeKey(agent.node,next);if(this.claims.has(key)&&this.claims.get(key)!==agent.id){this.waitForRoute(agent,delta);continue;}
     if(!this.clearOfPeople(this.node(next).point,agent,player)){this.waitForRoute(agent,delta);continue;}
     agent.blocked=0;this.claims.set(key,agent.id);agent.edge=key;agent.nextNode=next;agent.path.shift();agent.target=this.node(next).point.clone();
    }else if(agent.approaching&&agent.seat){agent.target=agent.seat.exit.clone().setY(this.node(agent.node).point.y);}
    else this.idle(agent);
   }
  }
 }
 /** Stops/yields on the proven segment; never steer randomly outside the route corridor. */
 displacement(agent:NpcAgent,delta:number,player:Vector3){
  const movement=new Vector3();if(agent.state!=='WALKING'||!agent.target)return movement;
  const direction=agent.target.clone().sub(agent.position);direction.y=0;const length=direction.length();if(length<.001)return movement;
  direction.multiplyScalar(Math.min(agent.speed*delta,length)/length);const next=agent.position.clone().add(direction);
  const people=[...(Math.abs(player.y-agent.position.y)<2?[player]:[]),...this.agents.filter(other=>other!==agent).map(other=>this.planned.get(other.id)??other.position)];
  // Permit separation-increasing movement when numerical/kinematic updates leave two walkers
  // slightly inside the personal-space radius. Otherwise both can remain stopped forever.
  if(people.some(point=>flatDistance(next,point)<.9&&flatDistance(next,point)<=flatDistance(agent.position,point)+.00001)){
   agent.blocked+=delta;if(agent.blocked>6&&!agent.returning){agent.path=[];agent.seat=null;agent.approaching=false;agent.returning=true;agent.target=this.node(agent.node).point.clone();}return movement;
  }
  agent.blocked=0;this.planned.set(agent.id,next);return movement.copy(direction);
 }
 dispose(){this.claims.clear();}
}
