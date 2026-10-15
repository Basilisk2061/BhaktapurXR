import manifest from '../../../public/assets/audio/manifest.json' with {type:'json'};
import {chooseVariation} from './foot-contacts.ts';
import type {FootstepSurface} from './audio-surfaces.ts';
/** One owner per mounted game. Buffers are cached; only actual impacts allocate one-shot voices. */
export class GameAudioEngine {
 private context:AudioContext|null=null;
 private disposed=false;
 private loading:Promise<void>|null=null;
 private abort=new AbortController();
 private buffers=new Map<string,AudioBuffer>();
 private ambience:AudioBufferSourceNode|null=null;
 private voices=new Set<{source:AudioBufferSourceNode;gain:GainNode}>();
 private last:Record<FootstepSurface,number>={'brick-stone':-1,wood:-1};
 private makeContext:()=>AudioContext;
 constructor(makeContext:()=>AudioContext=()=>new AudioContext()){this.makeContext=makeContext;}
 async unlock(){
  if(this.disposed)return;
  const context=this.context??=this.makeContext();
  // Must be called synchronously from the trusted gesture before any fetch/decode awaits.
  const resumed=context.resume();
  this.loading??=this.load(context).catch(error=>{this.loading=null;throw error;});
  try{await Promise.all([resumed,this.loading]);if(!this.disposed&&context.state==='running'&&!this.ambience){
   const source=context.createBufferSource(),gain=context.createGain();source.buffer=this.buffers.get(manifest.ambience.path)!;source.loop=true;gain.gain.value=.12;source.connect(gain).connect(context.destination);this.ambience=source;source.start();
  }}catch(error){if(!this.disposed)console.warn('Game audio could not start; another game gesture will retry.',error);}
 }
 private async load(context:AudioContext){
  const paths=[manifest.ambience.path,...Object.values(manifest.footsteps).flatMap(set=>set.map(sample=>sample.path))];
  await Promise.all(paths.map(async path=>{if(this.buffers.has(path))return;const response=await fetch(path,{signal:this.abort.signal});if(!response.ok)throw new Error('Audio asset '+response.status+': '+path);const buffer=await context.decodeAudioData(await response.arrayBuffer());if(!this.disposed)this.buffers.set(path,buffer);}));
 }
 footstep(surface:FootstepSurface,running:boolean){
  const context=this.context;if(this.disposed||!context||context.state!=='running')return;
  const samples=manifest.footsteps[surface],index=chooseVariation(samples.length,this.last[surface]),buffer=this.buffers.get(samples[index].path);if(!buffer)return;
  this.last[surface]=index;const source=context.createBufferSource(),gain=context.createGain();source.buffer=buffer;source.playbackRate.value=.98+Math.random()*.04;gain.gain.value=(running?.7:.6)*(.94+Math.random()*.12);source.connect(gain).connect(context.destination);
  const voice={source,gain};this.voices.add(voice);source.onended=()=>{source.disconnect();gain.disconnect();this.voices.delete(voice);};source.start();
 }
 stopSteps(){for(const voice of this.voices){voice.gain.gain.setTargetAtTime(0,this.context!.currentTime,.005);voice.source.stop(this.context!.currentTime+.02);}this.voices.clear();}
 dispose(){if(this.disposed)return;this.disposed=true;this.abort.abort();this.stopSteps();this.ambience?.stop();this.ambience?.disconnect();this.ambience=null;this.buffers.clear();void this.context?.close();}
}
