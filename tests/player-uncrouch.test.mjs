import assert from 'node:assert/strict';
import {test} from 'node:test';
import {createRequire} from 'node:module';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {AnimationClip,AnimationMixer,Group} from 'three';
import {createCrouchController,crouchClearanceTolerance} from '../src/game/player/crouch-controller.ts';
import {playerConfig} from '../src/game/player/player-config.ts';
import {createPlayerInput,pressGameplayKey} from '../src/game/input/player-input.ts';
import {createPlayerRuntime} from '../src/game/player/player-runtime.ts';
import {crouchWalkPlaybackScale} from '../src/game/player/crouch-locomotion.ts';
const require=createRequire(import.meta.url),R=createRequire(require.resolve('@react-three/rapier'))('@dimforge/rapier3d-compat');await R.init();
function fixture(feet=.015){
 const world=new R.World({x:0,y:-9.81,z:0});world.createCollider(R.ColliderDesc.cuboid(10,.1,10).setTranslation(0,-.1,0));
 const body=world.createRigidBody(R.RigidBodyDesc.kinematicPositionBased().setTranslation(0,.875+feet,0));
 const collider=world.createCollider(R.ColliderDesc.capsule(.325,.3).setTranslation(0,-.25,0),body);
 const motion=createPlayerRuntime();Object.assign(motion,{grounded:true,crouchWanted:true,crouchWeight:1,crouchProgress:1,crouchState:'CROUCHED'});
 const input=createPlayerInput(0,0);input.active=true;input.crouched=true;const crouch=createCrouchController(world,R);world.step();
 const step=()=>{crouch.step(body,collider,motion,input,1/60);world.step()};
 const press=()=>{input.keys.delete('KeyC');pressGameplayKey(input,'KeyC');step()};
 return {world,body,collider,motion,input,crouch,step,press};
}
test('stand immediately with stationary/W/A/S/D input at any idle/walk phase or crossfade',()=>{
 for(const direction of [null,'KeyW','KeyA','KeyS','KeyD'])for(const phase of ['idle','walk','start','stop']){
 const f=fixture();try{
 if(direction){f.input.keys.add(direction);f.motion.horizontalSpeed=1.35;f.motion.movement='WALK'}
 f.input.cameraView=true; // Camera Mode must not gate C.
 const mixer=new AnimationMixer(new Group()),idle=mixer.clipAction(new AnimationClip('CrouchIdle',3.966667,[])).play(),walk=mixer.clipAction(new AnimationClip('CrouchWalk',1.666667,[])).setEffectiveTimeScale(crouchWalkPlaybackScale);
 if(phase==='walk'){idle.stop();walk.play();walk.time=.71}else if(phase==='start'){idle.fadeOut(.16);walk.fadeIn(.16).play()}else if(phase==='stop'){walk.play().fadeOut(.16);idle.fadeIn(.16)}
 mixer.update(.035);f.press();assert.equal(f.motion.crouchState,'STANDING_UP',direction+' '+phase);assert.equal(f.motion.crouchWanted,false);
 for(let i=0;i<20;i++){mixer.update(1/60);f.step();assert.equal(f.motion.crouchWanted,false)}
 assert.equal(f.motion.crouchState,'STANDING');assert.equal(f.collider.halfHeight(),Math.fround(.575));assert.equal(f.collider.radius(),Math.fround(.3));mixer.stopAllAction();
 }finally{f.world.free()}}
});
test('transient grounded=false cannot swallow an already-crouched stand request',()=>{
 const f=fixture();try{f.motion.grounded=false;assert.equal(f.crouch.clear(f.body,f.collider),true);f.press();assert.equal(f.motion.crouchState,'STANDING_UP');assert.equal(f.motion.crouchWanted,false);
 for(let i=0;i<20;i++)f.step();assert.equal(f.motion.crouchState,'STANDING');f.input.keys.delete('KeyC');f.press();assert.equal(f.motion.crouchWanted,false,'new crouch entry still requires grounding');
 }finally{f.world.free()}
});
test('lower floor contact reproduces full-capsule false rejection, but does not block upper expansion',()=>{
 const f=fixture(-.02);try{
 const old=f.world.intersectionWithShape(f.body.translation(),{x:0,y:0,z:0,w:1},new R.Capsule(.575,.3-crouchClearanceTolerance),R.QueryFilterFlags.EXCLUDE_SENSORS,undefined,f.collider,f.body);
 assert.ok(old,'old whole-body query intersects lower floor contact');assert.equal(f.crouch.clear(f.body,f.collider),true);f.press();assert.equal(f.motion.crouchState,'STANDING_UP');
 }finally{f.world.free()}
});
test('real overhead obstruction blocks, exit restores standing, and mid-transition obstruction reverses safely',()=>{
 const f=fixture();try{
 const ceiling=f.world.createCollider(R.ColliderDesc.cuboid(1,.1,1).setTranslation(0,1.5,0));f.world.step();assert.equal(f.crouch.clear(f.body,f.collider),false);f.press();assert.equal(f.motion.crouchState,'CROUCHED');assert.equal(f.collider.halfHeight(),Math.fround(.325));
 f.body.setTranslation({x:3,y:.89,z:0},true);f.body.setNextKinematicTranslation({x:3,y:.89,z:0});f.world.step();f.press();assert.equal(f.motion.crouchState,'STANDING_UP');
 ceiling.setTranslation({x:3,y:1.5,z:0});f.world.step();f.step();assert.equal(f.motion.crouchWanted,true);assert.notEqual(f.motion.crouchState,'STANDING');
 }finally{f.world.free()}
});
test('self/owned colliders and sensors are excluded, but actual side overhangs block',()=>{
 const f=fixture();try{
 f.world.createCollider(R.ColliderDesc.ball(.2).setTranslation(0,.6,0),f.body);
 f.world.createCollider(R.ColliderDesc.cuboid(1,.1,1).setTranslation(0,1.5,0).setSensor(true));f.world.step();assert.equal(f.crouch.clear(f.body,f.collider),true);
 f.world.createCollider(R.ColliderDesc.cuboid(.1,.1,.5).setTranslation(.25,1.55,0));f.world.step();assert.equal(f.crouch.clear(f.body,f.collider),false);
 }finally{f.world.free()}
});
test('repeated requests complete twenty cycles; feet anchoring and physical dimensions stay fixed',()=>{
 const f=fixture();try{
 const initial=f.body.translation();for(let cycle=0;cycle<20;cycle++){
 f.press();for(let i=0;i<20;i++)f.step();assert.equal(f.motion.crouchState,'STANDING');assert.equal(f.collider.halfHeight(),Math.fround(.575));
 f.press();for(let i=0;i<20;i++)f.step();assert.equal(f.motion.crouchState,'CROUCHED');assert.equal(f.collider.halfHeight(),Math.fround(.325));assert.equal(f.collider.radius(),Math.fround(.3));assert.ok(Math.abs(f.collider.translation().y-f.collider.halfHeight()-f.collider.radius()-(initial.y-.875))<1e-6);
 }assert.deepEqual(f.body.translation(),initial);assert.equal(playerConfig.height,1.75);assert.equal(playerConfig.crouchHeight,1.25);assert.equal(playerConfig.crouchSpeed,1.35);assert.equal(playerConfig.crouchDuration,.28);
 }finally{f.world.free()}
});

