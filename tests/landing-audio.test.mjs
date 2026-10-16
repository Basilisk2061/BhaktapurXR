import assert from 'node:assert/strict';import {test} from 'node:test';
import {LandingAudioGate} from '../src/game/audio/landing-audio.ts';
const grounded={grounded:true,flying:false,seat:null,velocity:{y:0},resetSequence:0};
const airborne={...grounded,grounded:false,velocity:{y:3}};
test('one genuine jump gives one landing; immediate animation contacts are suppressed then resume',()=>{
 const gate=new LandingAudioGate();assert.equal(gate.update(grounded,0),false);assert.equal(gate.update(grounded,.1),false);
 assert.equal(gate.update(airborne,.2),false);assert.equal(gate.update({...airborne,velocity:{y:-3}},.8),false);
 assert.equal(gate.update(grounded,1),true);assert.equal(gate.update(grounded,1.01),false);
 assert.equal(gate.canFootstep(1),false);assert.equal(gate.canFootstep(1.09),false);assert.equal(gate.canFootstep(1.11),true);
});
test('startup fall, tiny drops, flight, sitting, reset and inactive transitions cannot cause landing audio',()=>{
 const startup=new LandingAudioGate();startup.update(airborne,0);assert.equal(startup.update(grounded,1),false);
 const small=new LandingAudioGate();small.update(grounded,0);small.update({...airborne,velocity:{y:-.1}},.1);assert.equal(small.update(grounded,.2),false);
 for(const change of [{flying:true},{seat:{}},{resetSequence:1}]){const gate=new LandingAudioGate();gate.update(grounded,0);gate.update(airborne,.1);gate.update({...airborne,...change},.2);assert.equal(gate.update({...grounded,resetSequence:change.resetSequence??0},1),false);}
 const inactive=new LandingAudioGate();inactive.update(grounded,0);inactive.update(airborne,.1);inactive.update(airborne,.2,false);assert.equal(inactive.update(grounded,1),false);
});
