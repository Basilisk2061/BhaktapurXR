export const oldManVoiceConfig = {
  firstInterval: [12,25],
  laterInterval: [30,55],
  cooldown: 12,
  settle: 1,
  gain: 0.060,
  refDistance: 2,
  maxDistance: 12,
  paths: {
    knee: "/assets/audio/npc/old-man-knee-pain.mp3",
    sing: "/assets/audio/npc/old-man-resham-firiri.mp3",
  },
} as const;
export type VoiceKind = keyof typeof oldManVoiceConfig.paths;
export interface OldManVoiceActor {
  id: string;
  state: string;
  position: { x: number; y: number; z: number };
}
/** A due event belongs to its actor until an eligible, settled state and free voice lock. */
export class OldManVoiceTiming {
 private actors=new Map<string,{due:number;eligibleSince:number|null}>();
 private readyAt=0;
 private random:()=>number;
 constructor(random=Math.random){this.random=random;}
 private delay(range:readonly [number,number]){return range[0]+this.random()*(range[1]-range[0]);}
 ended(now:number,ambientActor?:string){
  this.readyAt=now+oldManVoiceConfig.cooldown;
  if(ambientActor){const timing=this.actors.get(ambientActor);if(timing)timing.due=now+this.delay(oldManVoiceConfig.laterInterval);}
 }
 next(now:number,actors:OldManVoiceActor[],busy:boolean){
  let selected:{id:string;kind:VoiceKind}|null=null;
  for(const actor of actors){
   const eligible=actor.state==='IDLE'||actor.state==='SITTING';
   let timing=this.actors.get(actor.id);
   if(!timing){timing={due:now+this.delay(oldManVoiceConfig.firstInterval),eligibleSince:eligible?now:null};this.actors.set(actor.id,timing);}
   if(!eligible)timing.eligibleSince=null;
   else timing.eligibleSince??=now;
   if(now>=timing.due&&eligible&&timing.eligibleSince!==null&&now-timing.eligibleSince>=oldManVoiceConfig.settle&&!busy&&!selected&&now>=this.readyAt){
    selected={id:actor.id,kind:this.random()<.5?'knee':'sing'};timing.due=Infinity;
   }
  }
  return selected;
 }
}
