import test from 'node:test';
import assert from 'node:assert/strict';
import {OldManReactions,femaleVoicePaths} from '../src/game/audio/old-man-reactions.ts';
import {LandingAudioGate} from '../src/game/audio/landing-audio.ts';
import {GameAudioEngine} from '../src/game/audio/game-audio-engine.ts';
const actor=(id='female-a',x=0)=>({id,state:'IDLE',position:{x,y:1.6,z:0}});
const player=(x=2,extra={})=>({position:{x,y:.89,z:0},running:false,...extra});
test('female running reuses cumulative detector, rejects run-by and resets on exit/long pause; actors independent',()=>{
 const r=new OldManReactions(true),actors=[actor(),actor('female-b',20)];let now=0,p=player(2,{running:true}),events=[];
 const step=n=>{for(let i=0;i<n;i++){const event=r.next(now,actors,p,false);if(event)events.push(event);now+=.1;}};
 step(10);assert.equal(events.length,0);p=player(22,{running:true});step(10);assert.equal(events.length,0);
 p=player(2,{running:true});step(15);assert.equal(events.length,0);p.running=false;step(5);p.running=true;step(13);assert.deepEqual(events,[{id:'female-a',kind:'runAgain'}]);
 const quiet=new OldManReactions(true);for(let t=0;t<2;t+=.1)assert.equal(quiet.next(t,[actor()],player(2,{running:true}),false),null);
 quiet.next(2,[actor()],player(5,{running:true}),false);for(let t=2.1;t<4.5;t+=.1)assert.equal(quiet.next(t,[actor()],player(2,{running:true}),false),null);
 quiet.next(5,[actor()],player(),false);quiet.next(7,[actor()],player(),false);assert.equal(quiet.next(7.1,[actor()],player(2,{running:true}),false),null);
});
test('female close line requires dwell, resets on leaving and cannot spam even when sitting',()=>{
 const r=new OldManReactions(true),a={...actor(),state:'SITTING'};
 assert.equal(r.next(0,[a],player(1),false),null);assert.equal(r.next(1,[a],player(2),false),null);
 assert.equal(r.next(3,[a],player(1),false),null);assert.equal(r.next(4.9,[a],player(1),false),null);
 assert.deepEqual(r.next(5,[a],player(1),false),{id:a.id,kind:'tooClose'});
 assert.equal(r.next(100,[a],player(1),false),null);r.next(101,[a],player(2),false);r.next(102,[a],player(1),false);
 assert.deepEqual(r.next(104,[a],player(1),false),{id:a.id,kind:'tooClose'});
});
test('two genuine nearby landings, timeout, fly/distant rejection, per-actor counts and shared cooldowns',()=>{
 const r=new OldManReactions(true),actors=[actor(),actor('female-b',20)],jump=(t,x=2,extra={})=>r.next(t,actors,player(x,{landed:true,...extra}),false);
 assert.equal(jump(0),null);assert.equal(jump(1,22),null);assert.equal(jump(2,40),null);
 assert.equal(jump(3,2,{flying:true}),null);assert.equal(jump(4),null);assert.equal(jump(13),null);
 assert.deepEqual(jump(14),{id:'female-a',kind:'jumpAgain'});
 assert.equal(jump(15),null);assert.equal(jump(16),null);assert.equal(r.next(17,actors,player(),false),null);
 assert.equal(jump(73),null);assert.deepEqual(jump(74),{id:'female-a',kind:'jumpAgain'});
 assert.equal(jump(75,22),null);assert.deepEqual(jump(76,22),{id:'female-b',kind:'jumpAgain'});
 // A new close reaction cannot bypass the same actor's 20-second cross-reaction cooldown.
 r.next(77,actors,player(1),false);assert.equal(r.next(79,actors,player(1),false),null);
 assert.deepEqual(r.next(95,actors,player(1),false),{id:'female-a',kind:'tooClose'});
});
test('existing landing gate counts genuine jump cycles, never startup falls, reset corrections or flying',()=>{
 const gate=new LandingAudioGate(),motion={grounded:false,flying:false,seat:null,velocity:{y:-2},resetSequence:0};
 assert.equal(gate.update(motion,0),false);motion.grounded=true;assert.equal(gate.update(motion,1),false);
 motion.grounded=false;motion.velocity.y=4;assert.equal(gate.update(motion,2),false);motion.grounded=true;assert.equal(gate.update(motion,3),true);
 motion.flying=true;motion.grounded=false;gate.update(motion,4);motion.flying=false;motion.grounded=true;assert.equal(gate.update(motion,5),false);
 motion.grounded=false;motion.velocity.y=4;gate.update(motion,6);motion.resetSequence++;motion.grounded=true;assert.equal(gate.update(motion,7),false);
});
test('female reactions use shared HRTF voice lock, head following, gain and priority without interruption',async()=>{
 const fetch=globalThis.fetch;globalThis.fetch=async path=>({ok:true,arrayBuffer:async()=>new TextEncoder().encode(path).buffer});
 const sources=[],panners=[],gains=[],node=()=>({connect(n){return n;},disconnect(){}}),param=()=>({value:0});
 const context={state:'running',currentTime:0,destination:node(),listener:Object.fromEntries(['positionX','positionY','positionZ','forwardX','forwardY','forwardZ','upX','upY','upZ'].map(k=>[k,param()])),resume:async()=>{},close:async()=>{},decodeAudioData:async b=>({path:new TextDecoder().decode(b)}),createGain(){const n={...node(),gain:{value:0,setTargetAtTime(){}}};gains.push(n);return n;},createPanner(){const n={...node(),positionX:param(),positionY:param(),positionZ:param()};panners.push(n);return n;},createBufferSource(){const n={...node(),playbackRate:param(),start(){},stop(){this.stopped=true;this.onended?.();}};sources.push(n);return n;}};
 const engine=new GameAudioEngine(()=>context);
 try{
  await engine.unlock();await new Promise(resolve=>setImmediate(resolve));
  const old=[{...actor('old-a',30)}],females=[actor(),actor('female-b')],v={x:0,y:0,z:0};
  const update=t=>{context.currentTime=t;engine.updateOldManVoices(old,v,v,v,player(1),females);};
  update(0);update(20);assert.equal(panners.length,1);assert.equal(sources.at(-1).buffer.path,femaleVoicePaths.tooClose,'reaction wins over due ambient');
  assert.equal(panners[0].panningModel,'HRTF');assert.equal(gains.at(-1).gain.value,.060);assert.equal(panners[0].refDistance,2);assert.equal(panners[0].maxDistance,12);
  const active=sources.at(-1);females[0].position.x=.5;update(21);assert.equal(panners[0].positionX.value,.5);assert.equal(panners.length,1);assert.ok(!active.stopped);
  active.onended();update(22);assert.equal(panners.length,2);assert.equal(sources.at(-1).buffer.path,femaleVoicePaths.tooClose,'other female owns pending reaction');
 }finally{engine.dispose();globalThis.fetch=fetch;}
});
