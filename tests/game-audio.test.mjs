import assert from 'node:assert/strict';
import {test} from 'node:test';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {contactCrossings,canPlayFootstep,chooseVariation} from '../src/game/audio/foot-contacts.ts';
import {modelAudioSurfaces,bindAudioSurface,colliderAudioSurface} from '../src/game/audio/audio-surfaces.ts';
import {audioConfig} from '../src/game/audio/audio-config.ts';
import {GameAudioEngine} from '../src/game/audio/game-audio-engine.ts';
import manifest from '../public/assets/audio/manifest.json' with {type:'json'};

test('contacts follow clip phase through wraps; cadence follows Walk and Run, not a timer',()=>{
 for(const [clip,duration]of [['Walk',1.399999976158142],['Run',.8333333134651184]]){
  const events=[];for(let t=0;t<duration*3;t+=.017){const end=Math.min(t+.017,duration*3);events.push(...contactCrossings(clip,t,end,duration));}
  assert.equal(events.length,6);assert.equal(new Set(events).size,6);
  assert.deepEqual(contactCrossings(clip,.2,.2,duration),[]);
 }
 assert.ok(contactCrossings('Walk',.36,.4,1.4).length);assert.ok(contactCrossings('Run',.27,.3,.833333).length);
 const allowed={grounded:true,flying:false,seat:null,horizontalSpeed:2.3};assert.ok(canPlayFootstep(allowed));
 for(const change of [{grounded:false},{flying:true},{seat:{}},{horizontalSpeed:0}])assert.equal(canPlayFootstep({...allowed,...change}),false);
 let last=-1;for(let i=0;i<100;i++){const pick=chooseVariation(11,last,()=>i%10/10);assert.notEqual(pick,last);last=pick;}
});

test('runtime impacts are individually trimmed WAVs, ambience is loop-ready, masters are untouched',()=>{
 for(const source of Object.values(manifest.sources))if(fs.existsSync(source.file))assert.equal(crypto.createHash('sha256').update(fs.readFileSync(source.file)).digest('hex'),source.sha256);
 assert.equal(manifest.footsteps['brick-stone'].length,11);assert.equal(manifest.footsteps.wood.length,12);
 for(const samples of Object.values(manifest.footsteps))for(const sample of samples){const wav=fs.readFileSync('public'+sample.path);assert.equal(wav.toString('ascii',0,4),'RIFF');assert.equal(wav.readUInt32LE(24),24000);assert.equal(wav.readUInt16LE(22),1);assert.ok(sample.sourceEnd-sample.sourceStart<.6);assert.ok(sample.sourceStart<sample.peak&&sample.sourceEnd>sample.peak);}
 const ambient=fs.readFileSync('public'+manifest.ambience.path);assert.equal(ambient.readUInt16LE(22),2);assert.ok(Math.abs(ambient.readInt16LE(44)-ambient.readInt16LE(ambient.length-4))<1500,'no abrupt loop seam');
});

test('surface follows exact material/collider ownership; tiled roof supports and unknowns stay masonry',()=>{
 const box={position:[0,.1,0],size:[4,.2,3],yaw:.7,material:'timber',role:'arcade-upper-floor'};
 const model={id:'sample',boxes:[box],colliders:[box],roofs:[],profiles:[],shapes:[],origin:[0,0],yaw:0,anchorId:'sample',accuracy:'APPROXIMATE',neutral:false};
 assert.deepEqual(modelAudioSurfaces(model),['wood']);assert.deepEqual(modelAudioSurfaces({...model,boxes:[]}),['brick-stone']);
 assert.deepEqual(modelAudioSurfaces({...model,boxes:[{...box,material:'stone'}]}),['brick-stone']);
 assert.deepEqual(modelAudioSurfaces({...model,boxes:[{...box,role:'pavilion-roof-collision'}]}),['brick-stone']);
 const collider={};assert.equal(colliderAudioSurface(collider),'brick-stone');bindAudioSurface(collider,'wood');assert.equal(colliderAudioSurface(collider),'wood');
});

test('one gesture-owned ambience survives repeated unlocks; one-shots randomize and disposal closes audio',async()=>{
 const original=globalThis.fetch;globalThis.fetch=async()=>({ok:true,arrayBuffer:async()=>new ArrayBuffer(1)});
 const sources=[],gains=[];let contexts=0,closed=0;
 const node=()=>({connect(destination){return destination;},disconnect(){}});
 const context={state:'suspended',currentTime:0,destination:node(),async resume(){this.state='running';},async decodeAudioData(){return {};},createGain(){const n={...node(),gain:{value:0,setTargetAtTime(){}}};gains.push(n);return n;},createBufferSource(){const n={...node(),playbackRate:{value:1},loop:false,start(){this.started=true;},stop(){this.stopped=true;this.onended?.();}};sources.push(n);return n;},async close(){closed++;this.state='closed';}};
 try{
  const engine=new GameAudioEngine(()=>{contexts++;return context;});assert.equal(contexts,0);
  await Promise.all([engine.unlock(),engine.unlock()]);await engine.unlock();assert.equal(contexts,1);assert.equal(sources.filter(s=>s.loop).length,1);
  engine.footstep('brick-stone',false);engine.footstep('wood',true);assert.equal(sources.length,3);assert.ok(sources.slice(1).every(s=>s.started&&s.playbackRate.value>=.98&&s.playbackRate.value<=1.02));assert.equal(gains[0].gain.value,.12*1.25);
  assert.ok(Math.abs(audioConfig.footstepGain-.32)<1e-12);assert.ok(Math.abs(audioConfig.runFootstepMultiplier-.7/.6)<1e-12);
  for(const [i,base]of [[1,.32],[2,.32*(7/6)]])assert.ok(gains[i].gain.value>=base*.94-1e-12&&gains[i].gain.value<=base*1.06+1e-12);
  engine.stopSteps();assert.ok(sources.slice(1).every(s=>s.stopped));assert.ok(!sources[0].stopped);
  engine.dispose();engine.dispose();await engine.unlock();assert.equal(closed,1);assert.ok(sources[0].stopped);assert.equal(contexts,1);
 }finally{globalThis.fetch=original;}
});
import RAPIER from '@dimforge/rapier3d-compat';
test('a downward physics hit selects wood on a material-owned deck and masonry after returning to ground',async()=>{
 await RAPIER.init();const world=new RAPIER.World({x:0,y:0,z:0});
 try{const ground=world.createCollider(RAPIER.ColliderDesc.cuboid(10,.1,10).setTranslation(0,-.1,0)),deck=world.createCollider(RAPIER.ColliderDesc.cuboid(2,.1,2).setTranslation(0,.5,0));bindAudioSurface(deck,'wood');world.step();
 const hit=x=>world.castRay(new RAPIER.Ray({x,y:2,z:0},{x:0,y:-1,z:0}),3,true);
 assert.equal(colliderAudioSurface(hit(0).collider),'wood');assert.equal(hit(5).collider,ground);assert.equal(colliderAudioSurface(hit(5).collider),'brick-stone');
 }finally{world.free();}
});

import {OldManVoiceTiming,oldManVoiceConfig} from '../src/game/audio/old-man-voice.ts';
test('old-man voice opportunities discard walking/busy starts, serialize actors and retain cooldown',()=>{
 const timing=new OldManVoiceTiming(()=>0),actors=['a','b'].map(id=>({id,state:'IDLE',position:{x:1,y:2,z:3}})),knee=oldManVoiceConfig.knee[0];
 assert.equal(timing.next(0,actors,false),null);
 assert.equal(timing.next(knee-1,actors,false),null);
 assert.deepEqual(timing.next(knee,actors,false),{id:'a',kind:'knee'});
 assert.equal(timing.next(knee*2,actors,true),null,'no second voice during playback');
 timing.ended(knee*2);assert.equal(timing.next(knee*2+1,actors,false),null);
 actors.forEach(a=>a.state='WALKING');assert.equal(timing.next(knee*10,actors,false),null);
 actors.forEach(a=>a.state='SITTING');assert.equal(timing.next(knee*10+1,actors,false),null,'no queued voice on stopping');
 assert.deepEqual(timing.next(knee*11+1,actors,false),{id:'a',kind:'knee'});
 const other=new OldManVoiceTiming(()=>.999);other.next(0,actors,false);assert.equal(other.next(knee,actors,false),null);
 assert.equal(oldManVoiceConfig.gain,.060);assert.equal(oldManVoiceConfig.maxDistance,12);
});
