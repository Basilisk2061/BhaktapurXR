import assert from 'node:assert/strict';
import {test} from 'node:test';
import {existsSync,readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {Texture,TextureLoader,AnimationMixer,Quaternion,Vector3} from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {FBXLoader} from 'three/addons/loaders/FBXLoader.js';
import {retargetPlayerCrouch,bindRig,playerMap} from '../scripts/player-animation-retarget.mjs';
import {measureShoeGrounding} from '../scripts/player-animation-grounding.mjs';
import {crouchLocomotion,crouchFade,crouchWalkPlaybackScale} from '../src/game/player/crouch-locomotion.ts';
import {crouchVisualY,crouchWalkVisualGroundOffset,crouchVisualGroundOffset} from '../src/game/player/crouch-visual-grounding.ts';
const dir='public/assets/characters/player/',b=readFileSync(dir+'player.glb'),report=JSON.parse(readFileSync(dir+'crouch-import.json')).CrouchWalk;
const loader=new GLTFLoader();loader.register(()=>({name:'test-textures',loadTexture:()=>Promise.resolve(new Texture())}));const asset=await loader.parseAsync(b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength),'');
const clip=asset.animations.find(c=>c.name==='CrouchWalk');
const digest=c=>createHash('sha256').update(JSON.stringify({name:c.name,duration:c.duration,tracks:c.tracks.map(t=>({name:t.name,times:Array.from(t.times),values:Array.from(t.values)}))})).digest('hex');
test('walk tracks bind and preserve cyclic translation without accumulated locomotion',()=>{
 assert.equal(report.source,'incoming/player-character/crouch_walk_forward_meshy_mixamo.fbx');assert.equal(report.referenceMatches,true);assert.equal(clip.tracks.length,23);assert.ok(clip.validate());
 for(const t of clip.tracks){assert.ok(asset.scene.getObjectByName(t.name.split('.')[0]));assert.ok(Array.from(t.values).every(Number.isFinite));assert.ok(Array.from(t.times).every(Number.isFinite));if(t.name.endsWith('.quaternion'))for(let i=0;i<t.values.length;i+=4)assert.ok(Math.abs(Math.hypot(...t.values.slice(i,i+4))-1)<1e-5)}
 const hips=clip.tracks.find(t=>t.name==='mixamorigHips.position'),range=i=>{const a=Array.from(hips.values).filter((_,j)=>j%3===i);return Math.max(...a)-Math.min(...a)};
 assert.ok(Math.hypot(hips.values.at(-3)-hips.values[0],hips.values.at(-1)-hips.values[2])<1e-6);assert.ok(range(0)>.01);assert.ok(range(2)>.01);assert.ok(range(1)>.01);
});
test('locomotion selection, crossfades, measured playback and independent grounding',()=>{
 for(const speed of [0,.01,.049])assert.equal(crouchLocomotion(speed,.05),'CrouchIdle');for(const speed of [.05,1.35])assert.equal(crouchLocomotion(speed,.05),'CrouchWalk');assert.equal(crouchLocomotion(0,.05),'CrouchIdle');
 assert.equal(crouchFade('CrouchIdle','CrouchWalk',.28),.16);assert.equal(crouchFade('CrouchWalk','CrouchIdle',.28),.16);assert.equal(crouchFade('Walk','CrouchWalk',.28),.28);assert.equal(crouchFade('CrouchWalk','Walk',.28),.28);assert.equal(crouchFade('Idle','Walk',.28),.18);
 assert.ok(Math.abs(crouchWalkPlaybackScale*report.rootMotion.renderedCycleSpeed-1.35)<1e-8);
 assert.equal(crouchVisualY(1,true),crouchVisualGroundOffset);assert.equal(crouchVisualY(1,true,1),crouchWalkVisualGroundOffset);assert.ok(Number.isFinite(crouchWalkVisualGroundOffset));assert.notEqual(crouchWalkVisualGroundOffset,crouchVisualGroundOffset);for(const w of [0,.5,1])assert.equal(crouchVisualY(1,false,w),0);
 const runtime=readFileSync('src/game/player/player-character.tsx','utf8');assert.match(runtime,/motion.crouchWanted&&motion.grounded&&!motion.flying/);assert.match(runtime,/crouching\?crouchLocomotion/);assert.match(runtime,/name==="CrouchWalk"\?crouchWalkPlaybackScale:1/);assert.doesNotMatch(runtime,/FBXLoader|retarget|setTranslation|setNextKinematicTranslation/);
});
test('walk grounding is independently reproducible and alternates supporting feet',async()=>{
 const result=await measureShoeGrounding(b,'CrouchWalk');assert.deepEqual(result,report.grounding);assert.equal(result.visualYOffset,crouchWalkVisualGroundOffset);assert.equal(new Set(result.supportSequence.map(s=>s.foot)).size,2);assert.ok(Math.abs(result.ranges.support[0]+result.visualYOffset)<1e-8);
});
const files=['incoming/player-character/crouch_walk_forward_meshy_mixamo.fbx','incoming/player-character/player_Idle.fbx','incoming/player-character/crouch_walk_meshy_character_reference.fbx'];
test('offline walk import is deterministic, source-immutable and retains source rotations and Y',{skip:!files.every(existsSync)},()=>{
 const previous=TextureLoader.prototype.load;TextureLoader.prototype.load=()=>new Texture();try{
 const load=p=>{const b=readFileSync(p);return new FBXLoader().parse(b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength),'')};const [source,target,reference]=files.map(load),before=digest(source.animations[0]),options={name:'CrouchWalk',inPlace:true,start:5/30,end:55/30,source:files[0],reference:files[2]},a=retargetPlayerCrouch(source,target,reference,options),again=retargetPlayerCrouch(source,target,reference,options);
 assert.equal(digest(source.animations[0]),before);assert.equal(digest(a.clip),digest(again.clip));assert.equal(digest(a.clip),digest(clip));
 const from=bindRig(source),to=bindRig(target),sm=new AnimationMixer(source),tm=new AnimationMixer(to.root),sa=sm.clipAction(source.animations[0]).play(),ta=tm.clipAction(a.clip).play(),p=new Vector3();
 for(const time of [0,a.clip.duration*.5,a.clip.duration]){sa.time=time+options.start;ta.time=time;sm.update(0);tm.update(0);source.updateMatrixWorld(true);to.root.updateMatrixWorld(true);
 for(const [s,t]of Object.entries(playerMap)){const expected=source.getObjectByName(s).getWorldQuaternion(new Quaternion()).multiply(from.frames.get(s).rotation.clone().invert()).multiply(to.frames.get(t).rotation).normalize();assert.ok(to.root.getObjectByName(t).getWorldQuaternion(new Quaternion()).normalize().angleTo(expected)<.001,s)}
 const sourceY=source.getObjectByName('smartrigHips').getWorldPosition(p).y;assert.ok(Math.abs(to.root.getObjectByName('mixamorigHips').position.y-(to.frames.get('mixamorigHips').position.y+sourceY*a.report.scaleRatio))<1e-5);
 }sm.stopAllAction();tm.stopAllAction();
 }finally{TextureLoader.prototype.load=previous;}
});
