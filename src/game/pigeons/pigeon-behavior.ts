import {MathUtils,Vector3} from 'three';
import {seededRandom} from '../npcs/definitions';
import {playerConfig} from '../player/player-config';
import {dampAngle} from '../player/movement';
import {pigeonLimit,pigeonZones} from './pigeon-config';

export type PigeonState='GROUND_IDLE'|'GROUND_WALK'|'GROUND_PECK'|'ALERT'|'TAKEOFF'|'FLYING'|'LANDING';
export interface BirdProbe {ground:(x:number,z:number)=>number|null;clear:(from:Vector3,to:Vector3)=>boolean;appear:(point:Vector3)=>boolean}
export interface Pigeon {
 id:number;zone:number;random:()=>number;state:PigeonState;age:number;until:number;phase:number;size:number;variant:number;speed:number;
 position:Vector3;goal:Vector3;start:Vector3;c1:Vector3;c2:Vector3;landing:Vector3;previous:Vector3;
 initialized:boolean;fade:number;threshold:number;yaw:number;pitch:number;bank:number;ground:number;
 alert:number;scare:number;startleAt:number;flightTime:number;flightDuration:number;turn:number;retry:number;
}
const groundState=(bird:Pigeon)=>bird.state.startsWith('GROUND_')||bird.state==='ALERT';
const smooth=(value:number)=>{value=Math.max(0,Math.min(1,value));return value*value*(3-2*value);};
export class PigeonSimulation {
 birds:Pigeon[];time=0;
 private curvePoint=new Vector3();private curvePrevious=new Vector3();private backup=Array.from({length:4},()=>new Vector3());
 constructor(readonly probe:BirdProbe){
  this.birds=Array.from({length:pigeonLimit},(_,id)=>{
   const random=seededRandom(83071+id*917),phase=random()*Math.PI*2;
   return {id,zone:id%pigeonZones.length,random,state:'GROUND_IDLE',age:0,until:1+random()*3,phase,size:.9+random()*.17,variant:id%3,speed:.22+random()*.16,
    position:new Vector3(),goal:new Vector3(),start:new Vector3(),c1:new Vector3(),c2:new Vector3(),landing:new Vector3(),previous:new Vector3(),
    initialized:false,fade:0,threshold:.06+random()*.62,yaw:random()*Math.PI*2,pitch:0,bank:0,ground:0,alert:3.8+random()*.9,scare:1.7+random()*.55,startleAt:Infinity,flightTime:0,flightDuration:4,turn:random()>.5?1:-1,retry:0};
  });
 }
 private state(bird:Pigeon,state:PigeonState,duration:number){bird.state=state;bird.age=0;bird.until=duration;}
 private constrain(bird:Pigeon,point:Vector3){
  const zone=pigeonZones[bird.zone],dx=point.x-zone.x,dz=point.z-zone.z,d=Math.hypot(dx,dz),limit=zone.radius-.25;
  if(d>limit){point.x=zone.x+dx/d*limit;point.z=zone.z+dz/d*limit;}return point;
 }
 private sample(bird:Pigeon,player:Vector3,out:Vector3,minPlayer:number,appearance=false){
  const zone=pigeonZones[bird.zone];
  for(let attempt=0;attempt<14;attempt++){
   const angle=bird.random()*Math.PI*2,radius=Math.sqrt(bird.random())*(zone.radius-.3),x=zone.x+Math.cos(angle)*radius,z=zone.z+Math.sin(angle)*radius;
   if(Math.hypot(x-player.x,z-player.z)<minPlayer||!appearance&&bird.initialized&&Math.hypot(x-bird.position.x,z-bird.position.z)<.9)continue;
   const y=this.probe.ground(x,z);if(y===null||Math.abs(y-zone.ground)>.12)continue;
   out.set(x,y+.012,z);
   if(appearance&&!this.probe.appear(out))continue;
   if(this.birds.some(other=>other!==bird&&other.initialized&&groundState(other)&&other.position.distanceToSquared(out)<.45*.45))continue;
   return true;
  }return false;
 }
 private curve(bird:Pigeon,t:number,out:Vector3){
  // Retain brisk lift-off, but ease the final quarter to zero landing velocity.
  if(t>.75){const u=(t-.75)/.25;t=.75+.25*(u+u*u-u*u*u);}
  const s=1-t;return out.copy(bird.start).multiplyScalar(s*s*s).addScaledVector(bird.c1,3*s*s*t).addScaledVector(bird.c2,3*s*t*t).addScaledVector(bird.landing,t*t*t);
 }
 private planFlight(bird:Pigeon,player:Vector3){
  const points=[bird.start,bird.c1,bird.c2,bird.landing],oldTime=bird.flightTime,oldDuration=bird.flightDuration;
  points.forEach((point,i)=>this.backup[i].copy(point));
  const restore=()=>{points.forEach((point,i)=>point.copy(this.backup[i]));bird.flightTime=oldTime;bird.flightDuration=oldDuration;};
  // If the player occupies the entire patch, allow an aerial endpoint there but
  // defer landing until another safe point is available. Birds never chase them.
  if(!this.sample(bird,player,bird.landing,2.8)&&!this.sample(bird,player,bird.landing,0)){restore();return false;}
  const dx=bird.position.x-player.x,dz=bird.position.z-player.z,length=Math.hypot(dx,dz)||1;
  for(let attempt=0;attempt<5;attempt++){
   bird.start.copy(bird.position);
   const climb=2.3+bird.random()*1.1;
   bird.c1.copy(bird.start);bird.c1.x+=dx/length*1.5-dz/length*bird.turn*.7;bird.c1.z+=dz/length*1.5+dx/length*bird.turn*.7;this.constrain(bird,bird.c1);
   bird.c1.y=Math.max(bird.start.y,bird.ground+climb);
   bird.c2.copy(bird.landing);bird.c2.x+=bird.turn*1.5;bird.c2.z+=bird.turn*(bird.random()-.5)*2;this.constrain(bird,bird.c2);bird.c2.y=bird.ground+climb;
   let clear=true;bird.previous.copy(bird.start);
   for(let step=1;step<=10;step++){
    this.curve(bird,step/10,this.curvePoint);
    if(!this.probe.clear(bird.previous,this.curvePoint)){clear=false;break;}bird.previous.copy(this.curvePoint);
   }
   if(clear){bird.flightTime=0;bird.flightDuration=4.2+bird.random()*2.1;bird.retry=this.time;return true;}
   if(!this.sample(bird,player,bird.landing,0))break;
  }restore();return false;
 }
 private startled(bird:Pigeon){
  for(const other of this.birds)if(other.initialized&&other.zone===bird.zone&&groundState(other)&&other.position.distanceToSquared(bird.position)<3.5*3.5){
   other.startleAt=Math.min(other.startleAt,this.time+.025+other.random()*.375);this.state(other,'ALERT',1);
  }
 }
 update(delta:number,player:Vector3,running:boolean,day:number,count:number){
  this.time+=delta;let spawned=0;
  for(const bird of this.birds){
   const desired=bird.id<count?smooth((day-bird.threshold)/.25):0;
   if(desired>0&&!bird.initialized&&this.time>=bird.retry&&spawned<2){
    bird.retry=this.time+.7+bird.random();
    if(this.sample(bird,player,bird.position,3,true)){bird.initialized=true;bird.ground=bird.position.y;bird.startleAt=Infinity;bird.pitch=0;bird.bank=0;this.state(bird,'GROUND_IDLE',1+bird.random()*4);spawned++;}
   }
   bird.fade=MathUtils.damp(bird.fade,bird.initialized?desired:0,3,delta);
   if(bird.fade<.012){if(desired===0)bird.initialized=false;continue;}
   bird.age+=delta;
   if(groundState(bird)){
    const distance=Math.hypot(player.x-bird.position.x,player.z-bird.position.z),sameLevel=Math.abs(player.y-playerConfig.height/2-bird.ground)<2;
    if(sameLevel&&distance<bird.scare+(running?.65:0)&&bird.startleAt===Infinity)this.startled(bird);
    if(bird.startleAt<=this.time){
     if(this.planFlight(bird,player)){bird.startleAt=Infinity;this.state(bird,'TAKEOFF',.65);}
     else bird.startleAt=this.time+.3+bird.random()*.3;
    }
    if(!groundState(bird))continue;
    if(sameLevel&&distance<bird.alert&&bird.startleAt===Infinity&&bird.state!=='ALERT')this.state(bird,'ALERT',.4+bird.random());
    if(bird.state==='ALERT'){
     bird.yaw=dampAngle(bird.yaw,Math.atan2(player.x-bird.position.x,player.z-bird.position.z),3,delta);
     if(distance>bird.alert+.5&&bird.startleAt===Infinity)this.state(bird,'GROUND_IDLE',.8+bird.random()*2);
    }else if(bird.state==='GROUND_WALK'){
     const dx=bird.goal.x-bird.position.x,dz=bird.goal.z-bird.position.z,d=Math.hypot(dx,dz);
     if(d<.025||bird.age>bird.until)this.state(bird,'GROUND_IDLE',1+bird.random()*2);
     else{
      const step=Math.min(d,bird.speed*delta*(.12+1.35*Math.max(0,Math.sin(this.time*12+bird.phase))));
      bird.position.x+=dx/d*step;bird.position.z+=dz/d*step;bird.position.y=MathUtils.lerp(bird.position.y,bird.goal.y,Math.min(1,step/d));bird.ground=bird.position.y;bird.yaw=dampAngle(bird.yaw,Math.atan2(-dx,-dz),6,delta);
     }
    }else if(bird.age>=bird.until){
     const action=bird.random();
     if(action<.38){this.state(bird,'GROUND_PECK',.65*(1+Math.floor(bird.random()*3)));}
     else if(action<.79){
      const angle=bird.random()*Math.PI*2;bird.goal.copy(bird.position);bird.goal.x+=Math.cos(angle)*(.4+bird.random()*.8);bird.goal.z+=Math.sin(angle)*(.4+bird.random()*.8);this.constrain(bird,bird.goal);
      const height=this.probe.ground(bird.goal.x,bird.goal.z);
      if(height!==null&&Math.abs(height+.012-bird.ground)<.08&&this.probe.clear(bird.position,bird.goal)){bird.goal.y=height+.012;this.state(bird,'GROUND_WALK',2+bird.random()*3);}
      else this.state(bird,'GROUND_IDLE',1+bird.random());
     }else{bird.yaw+=(bird.random()-.5)*.5;this.state(bird,'GROUND_IDLE',1+bird.random()*3);}
    }
   }else{
    bird.flightTime+=delta;
    // Recheck both player clearance and live landing occupancy before descent.
    const remaining=bird.flightDuration-bird.flightTime;
    if(remaining<1.1&&(this.time>=bird.retry||remaining<delta*2)){
     bird.retry=this.time+.2;
     const occupied=Math.hypot(player.x-bird.landing.x,player.z-bird.landing.z)<2.8||this.birds.some(other=>other!==bird&&other.initialized&&groundState(other)&&other.position.distanceToSquared(bird.landing)<.45*.45)||this.probe.ground(bird.landing.x,bird.landing.z)===null;
     if(occupied){
      if(!this.planFlight(bird,player)){bird.flightTime=Math.max(0,bird.flightTime-delta);continue;}
      this.state(bird,'FLYING',bird.flightDuration);
     }
    }
    const t=Math.min(1,bird.flightTime/bird.flightDuration);this.curvePrevious.copy(bird.position);this.curve(bird,t,bird.position);
    const dx=bird.position.x-this.curvePrevious.x,dz=bird.position.z-this.curvePrevious.z;
    if(Math.hypot(dx,dz)>.0001)bird.yaw=dampAngle(bird.yaw,Math.atan2(-dx,-dz),7,delta);
    bird.pitch=bird.state==='TAKEOFF'?.22*Math.min(1,bird.flightTime/.2):bird.state==='LANDING'?.12*Math.min(1,(bird.flightDuration-bird.flightTime)/.22):MathUtils.clamp((bird.position.y-this.curvePrevious.y)*5,-.2,.22);
    bird.bank=bird.turn*.12*Math.sin(t*Math.PI);
    if(t===1){bird.position.copy(bird.landing);bird.ground=bird.position.y;bird.pitch=0;bird.bank=0;this.state(bird,'GROUND_IDLE',1.5+bird.random()*3);}
    else if(bird.flightDuration-bird.flightTime<.9){if(bird.state!=='LANDING')this.state(bird,'LANDING',.9);}
    else if(bird.flightTime>.65&&bird.state==='TAKEOFF')this.state(bird,'FLYING',bird.flightDuration);
   }
  }
 }
}
