import type {OldManVoiceActor} from './old-man-voice.ts';
export const reactiveVoicePaths={
 runAgain:'/assets/audio/npc/old-man-run-again.mp3',
 tooClose:'/assets/audio/npc/old-man-too-close.mp3',
 sittingTooClose:'/assets/audio/npc/old-man-sitting-too-close.mp3',
} as const;
type Reaction=keyof typeof reactiveVoicePaths;
export const reactionConfig={close:1.15,sittingClose:.95,delay:2,cooldown:20,repeatCooldown:60,runRadius:2.5,runExit:3,runWindow:20} as const;
export interface VoicePlayer {position:{x:number;y:number;z:number};running:boolean}
interface Encounter {since:number|null;proximity:string;latched:boolean;ready:number;last:Reaction|null;lastAt:number;entry:{x:number;z:number}|null;passes:number[];runUntil:number}
export class OldManReactions {
 private encounters=new Map<string,Encounter>();
 next(now:number,actors:OldManVoiceActor[],player:VoicePlayer,busy:boolean){
  let selected:{id:string;kind:Reaction}|null=null;
  for(const actor of actors){
   let e=this.encounters.get(actor.id);if(!e){e={since:null,proximity:'',latched:false,ready:0,last:null,lastAt:-Infinity,entry:null,passes:[],runUntil:0};this.encounters.set(actor.id,e);}
   const x=player.position.x-actor.position.x,z=player.position.z-actor.position.z,d=Math.hypot(x,z),sameLevel=Math.abs(player.position.y-actor.position.y)<2;
   const kind:Reaction=actor.state==='SITTING'?'sittingTooClose':'tooClose',near=sameLevel&&d<(kind==='sittingTooClose'?reactionConfig.sittingClose:reactionConfig.close);
   if(!near||e.proximity!==kind){e.since=null;e.latched=false;}e.proximity=kind;
   if(near&&e.since===null)e.since=now;
   e.passes=e.passes.filter(t=>now-t<=reactionConfig.runWindow);
   if(!sameLevel||!player.running)e.entry=null;
   else if(d<reactionConfig.runRadius&&!e.entry)e.entry={x,z};
   else if(d>reactionConfig.runExit&&e.entry){
    if(e.entry.x*x+e.entry.z*z<0){e.passes.push(now);if(e.passes.length>=2)e.runUntil=now+5;}
    e.entry=null;
   }
   const candidate=near&&!e.latched&&e.since!==null&&now-e.since>=reactionConfig.delay?kind:now<e.runUntil?'runAgain':null;
   if(!candidate||busy||selected||now<e.ready||e.last===candidate&&now-e.lastAt<reactionConfig.repeatCooldown)continue;
   selected={id:actor.id,kind:candidate};e.ready=now+reactionConfig.cooldown;e.last=candidate;e.lastAt=now;
   if(candidate==='runAgain'){e.passes=[];e.runUntil=0;}else e.latched=true;
  }
  return selected;
 }
}
