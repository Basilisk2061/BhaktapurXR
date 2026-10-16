import {OldManReactions,reactiveVoicePaths,femaleVoicePaths,type VoicePlayer} from './old-man-reactions.ts';
import {OldManVoiceTiming,oldManVoiceConfig,type OldManVoiceActor} from './old-man-voice.ts';
import manifest from '../../../public/assets/audio/manifest.json' with {type:'json'};
import {audioConfig} from './audio-config.ts';
import {chooseVariation} from './foot-contacts.ts';
import type {FootstepSurface} from './audio-surfaces.ts';
const npcVoicePaths={...oldManVoiceConfig.paths,...reactiveVoicePaths};
/** One owner per mounted game. Buffers are cached; only actual impacts allocate one-shot voices. */
export class GameAudioEngine {
 private context:AudioContext|null=null;
 private disposed=false;
 private loading:Promise<void>|null=null;
 private abort=new AbortController();
 private buffers=new Map<string,AudioBuffer>();
 private ambience:AudioBufferSourceNode|null=null;
 private voices=new Set<{source:AudioBufferSourceNode;gain:GainNode;landing:boolean}>();
 private last:Record<FootstepSurface,number>={'brick-stone':-1,wood:-1};
 private npcReactions=new OldManReactions();
 private femaleReactions=new OldManReactions(true);
 private npcTiming=new OldManVoiceTiming();
 private npcLoading:Promise<void>|null=null;
 private npcVoice:{id:string;source:AudioBufferSourceNode;gain:GainNode;panner:PannerNode}|null=null;
 private makeContext:()=>AudioContext;
 constructor(makeContext:()=>AudioContext=()=>new AudioContext()){this.makeContext=makeContext;}
 async unlock(){
  if(this.disposed)return;
  const context=this.context??=this.makeContext();
  // Must be called synchronously from the trusted gesture before any fetch/decode awaits.
  const resumed=context.resume();
  this.loading??=this.load(context).catch(error=>{this.loading=null;throw error;});
  try{await Promise.all([resumed,this.loading]);if(!this.disposed&&context.state==='running'&&!this.ambience){
   const source=context.createBufferSource(),gain=context.createGain();source.buffer=this.buffers.get(manifest.ambience.path)!;source.loop=true;gain.gain.value=audioConfig.ambienceGain;source.connect(gain).connect(context.destination);this.ambience=source;source.start();
  }
   this.npcLoading??=this.loadNpcVoices(context).catch(error=>{this.npcLoading=null;if(!this.disposed)console.warn('NPC voice audio unavailable',error);});
  }catch(error){if(!this.disposed)console.warn('Game audio could not start; another game gesture will retry.',error);}
 }
 private async load(context:AudioContext){
  const paths=[manifest.ambience.path,...Object.values(manifest.footsteps).flatMap(set=>set.map(sample=>sample.path))];
  await Promise.all(paths.map(async path=>{if(this.buffers.has(path))return;const response=await fetch(path,{signal:this.abort.signal});if(!response.ok)throw new Error('Audio asset '+response.status+': '+path);const buffer=await context.decodeAudioData(await response.arrayBuffer());if(!this.disposed)this.buffers.set(path,buffer);}));
 }
 footstep(surface:FootstepSurface,running:boolean,landing=false){
  const context=this.context;if(this.disposed||!context||context.state!=='running')return;
  const samples=manifest.footsteps[surface],index=chooseVariation(samples.length,this.last[surface]),buffer=this.buffers.get(samples[index].path);if(!buffer)return;
  this.last[surface]=index;const source=context.createBufferSource(),gain=context.createGain();source.buffer=buffer;source.playbackRate.value=.98+Math.random()*.04;gain.gain.value=(audioConfig.footstepGain*(landing?audioConfig.landingMultiplier:running?audioConfig.runFootstepMultiplier:1))*(.94+Math.random()*.12);source.connect(gain).connect(context.destination);
  const voice={source,gain,landing};this.voices.add(voice);source.onended=()=>{source.disconnect();gain.disconnect();this.voices.delete(voice);};source.start();
 }
 private async loadNpcVoices(context:AudioContext){
  await Promise.all([...Object.values(npcVoicePaths),...Object.values(femaleVoicePaths)].map(async path=>{
   const response=await fetch(path,{signal:this.abort.signal});if(!response.ok)throw Error('NPC audio '+response.status);
   const buffer=await context.decodeAudioData(await response.arrayBuffer());if(!this.disposed)this.buffers.set(path,buffer);
  }));
 }
 updateOldManVoices(actors:OldManVoiceActor[],position:{x:number;y:number;z:number},forward:{x:number;y:number;z:number},up:{x:number;y:number;z:number},player?:VoicePlayer,females:OldManVoiceActor[]=[]){
  const context=this.context;if(this.disposed||!context||context.state!=='running')return;
  const listener=context.listener;
  listener.positionX.value=position.x;listener.positionY.value=position.y;listener.positionZ.value=position.z;
  listener.forwardX.value=forward.x;listener.forwardY.value=forward.y;listener.forwardZ.value=forward.z;
  listener.upX.value=up.x;listener.upY.value=up.y;listener.upZ.value=up.z;
  const active=this.npcVoice;
  if(active){const actor=[...actors,...females].find(a=>a.id===active.id);if(actor){active.panner.positionX.value=actor.position.x;active.panner.positionY.value=actor.position.y;active.panner.positionZ.value=actor.position.z;}else{active.source.stop();}}
  const ready=Object.values(npcVoicePaths).every(path=>this.buffers.has(path));
  const oldReaction=player?this.npcReactions.next(context.currentTime,actors,player,!!this.npcVoice||!ready):null;
  const femaleReady=Object.values(femaleVoicePaths).every(path=>this.buffers.has(path));
  const femaleReaction=player?this.femaleReactions.next(context.currentTime,females,player,!!this.npcVoice||!femaleReady||!!oldReaction):null;
  const reaction=oldReaction?{id:oldReaction.id,path:reactiveVoicePaths[oldReaction.kind as keyof typeof reactiveVoicePaths]}:femaleReaction?{id:femaleReaction.id,path:femaleVoicePaths[femaleReaction.kind as keyof typeof femaleVoicePaths]}:null;
  const scheduled=this.npcTiming.next(context.currentTime,actors,!!this.npcVoice||!ready||!!reaction);
  const opportunity=reaction??(scheduled?{id:scheduled.id,path:oldManVoiceConfig.paths[scheduled.kind]}:null);
  if(!opportunity)return;
  const actor=[...actors,...females].find(a=>a.id===opportunity.id)!,source=context.createBufferSource(),gain=context.createGain(),panner=context.createPanner();
  source.buffer=this.buffers.get(opportunity.path)!;
  gain.gain.value=oldManVoiceConfig.gain;panner.panningModel='HRTF';panner.distanceModel='linear';panner.refDistance=oldManVoiceConfig.refDistance;panner.maxDistance=oldManVoiceConfig.maxDistance;panner.rolloffFactor=1;
  panner.positionX.value=actor.position.x;panner.positionY.value=actor.position.y;panner.positionZ.value=actor.position.z;
  source.connect(gain).connect(panner).connect(context.destination);this.npcVoice={id:actor.id,source,gain,panner};
  source.onended=()=>{source.disconnect();gain.disconnect();panner.disconnect();this.npcVoice=null;this.npcTiming.ended(context.currentTime,reaction?undefined:actor.id);};source.start();
 }
 landing(surface:FootstepSurface){this.footstep(surface,false,true);}
 stopSteps(){for(const voice of this.voices)if(!voice.landing){voice.gain.gain.setTargetAtTime(0,this.context!.currentTime,.005);voice.source.stop(this.context!.currentTime+.02);this.voices.delete(voice);}}
 dispose(){if(this.disposed)return;this.disposed=true;this.abort.abort();this.npcVoice?.source.stop();this.stopSteps();for(const voice of this.voices)voice.source.stop();this.voices.clear();this.ambience?.stop();this.ambience?.disconnect();this.ambience=null;this.buffers.clear();void this.context?.close();}
}
