import type {OldManVoiceActor} from './old-man-voice.ts';
export const reactiveVoicePaths={
 runAgain:'/assets/audio/npc/old-man-run-again.mp3',
 tooClose:'/assets/audio/npc/old-man-too-close.mp3',
 sittingTooClose:'/assets/audio/npc/old-man-sitting-too-close.mp3',
} as const;
export const femaleVoicePaths={runAgain:'/assets/audio/npc/female-run-again.mp3',tooClose:'/assets/audio/npc/female-too-close.mp3',jumpAgain:'/assets/audio/npc/female-jump-again.mp3'} as const;
type Reaction=keyof typeof reactiveVoicePaths|'jumpAgain';
export const reactionConfig={close:1.15,sittingClose:.95,delay:2,cooldown:20,repeatCooldown:60,runRadius:3.5,runRequired:2.5,runReset:1.5} as const;
export interface VoicePlayer {position:{x:number;y:number;z:number};running:boolean;landed?:boolean;flying?:boolean}
interface Encounter {since:number|null;proximity:string;latched:boolean;ready:number;last:Reaction|null;lastAt:number;sampleAt:number;runningLast:boolean;runTime:number;stoppedAt:number|null;runLatched:boolean;jumps:number[];lastKinds:Partial<Record<Reaction,number>>}
export class OldManReactions {
 private encounters=new Map<string,Encounter>();
 private female:boolean;
 constructor(female=false){this.female=female;}
 next(now:number,actors:OldManVoiceActor[],player:VoicePlayer,busy:boolean){
  let selected:{id:string;kind:Reaction}|null=null;
  for(const actor of actors){
   let e=this.encounters.get(actor.id);if(!e){e={since:null,proximity:'',latched:false,ready:0,last:null,lastAt:-Infinity,sampleAt:now,runningLast:false,runTime:0,stoppedAt:null,runLatched:false,jumps:[],lastKinds:{}};this.encounters.set(actor.id,e);}
   const x=player.position.x-actor.position.x,z=player.position.z-actor.position.z,d=Math.hypot(x,z),sameLevel=Math.abs(player.position.y-actor.position.y)<2;
   const kind:Reaction=!this.female&&actor.state==='SITTING'?'sittingTooClose':'tooClose',near=sameLevel&&d<(kind==='sittingTooClose'?reactionConfig.sittingClose:reactionConfig.close);
   if(!near||e.proximity!==kind){e.since=null;e.latched=false;}e.proximity=kind;
   if(near&&e.since===null)e.since=now;
   const dt=Math.min(.5,Math.max(0,now-e.sampleAt)),inside=sameLevel&&d<reactionConfig.runRadius;
   e.sampleAt=now;
   if(!inside){e.runTime=0;e.runLatched=false;e.runningLast=false;e.stoppedAt=null;}
   else if(player.running){
    if(e.stoppedAt!==null&&now-e.stoppedAt>=reactionConfig.runReset){e.runTime=0;e.runLatched=false;}
    if(e.runningLast)e.runTime+=dt;
    e.runningLast=true;e.stoppedAt=null;
   }else{
    e.stoppedAt??=now;e.runningLast=false;
    if(now-e.stoppedAt>=reactionConfig.runReset){e.runTime=0;e.runLatched=false;}
   }
   if(this.female){
    e.jumps=inside&&!player.flying?e.jumps.filter(t=>now-t<=8):[];
    if(inside&&player.landed&&!player.flying)e.jumps.push(now);
   }
   const candidate=near&&!e.latched&&e.since!==null&&now-e.since>=reactionConfig.delay?kind:inside&&player.running&&!e.runLatched&&e.runTime>=reactionConfig.runRequired?'runAgain':this.female&&e.jumps.length>=2?'jumpAgain':null;
   if(!candidate||busy||selected||now<e.ready||(this.female?now-(e.lastKinds[candidate]??-Infinity)<reactionConfig.repeatCooldown:e.last===candidate&&now-e.lastAt<reactionConfig.repeatCooldown))continue;
   selected={id:actor.id,kind:candidate};e.ready=now+reactionConfig.cooldown;e.last=candidate;e.lastAt=now;e.lastKinds[candidate]=now;
   if(candidate==='runAgain')e.runLatched=true;else if(candidate==='jumpAgain')e.jumps=[];else e.latched=true;
  }
  return selected;
 }
}
