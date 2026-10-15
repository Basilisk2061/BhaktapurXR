export const oldManVoiceConfig={
 knee:[35,70],sing:[90,180],cooldown:12,settle:3,
 gain:.045,refDistance:2,maxDistance:12,
 paths:{knee:'/assets/audio/npc/old-man-knee-pain.mp3',sing:'/assets/audio/npc/old-man-resham-firiri.mp3'},
} as const;
export type VoiceKind=keyof typeof oldManVoiceConfig.paths;
export interface OldManVoiceActor {id:string;state:string;position:{x:number;y:number;z:number}}
/** Opportunities expire even while walking/busy, so stopping never releases queued speech. */
export class OldManVoiceTiming {
 private actors=new Map<string,{knee:number;sing:number;eligibleSince:number}>();
 private readyAt=0;
 private random:()=>number;
 constructor(random= Math.random){this.random=random;}
 private interval(kind:VoiceKind){const [a,b]=oldManVoiceConfig[kind];return a+this.random()*(b-a);}
 ended(now:number){this.readyAt=now+oldManVoiceConfig.cooldown;}
 next(now:number,actors:OldManVoiceActor[],busy:boolean){
  let selected:{id:string;kind:VoiceKind}|null=null;
  for(const actor of actors){
   let timing=this.actors.get(actor.id);
   if(!timing){timing={knee:now+this.interval('knee'),sing:now+this.interval('sing'),eligibleSince:now};this.actors.set(actor.id,timing);}
   const eligible=actor.state==='IDLE'||actor.state==='SITTING';
   if(!eligible)timing.eligibleSince=now;
   for(const kind of ['sing','knee'] as const)if(now>=timing[kind]){
    timing[kind]=now+this.interval(kind);
    if(eligible&&now-timing.eligibleSince>=oldManVoiceConfig.settle&&!busy&&!selected&&now>=this.readyAt)selected={id:actor.id,kind};
   }
  }
  return selected;
 }
}
