import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {test} from 'node:test';
import {Texture,TextureLoader,AnimationMixer,Quaternion} from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {FBXLoader} from 'three/addons/loaders/FBXLoader.js';
import {retargetPlayerCrouch,playerMap,bindRig} from '../scripts/player-animation-retarget.mjs';
const dir='public/assets/characters/player/',b=readFileSync(dir+'player.glb'),loader=new GLTFLoader();loader.register(()=>({name:'test-textures',loadTexture:()=>Promise.resolve(new Texture())}));
const asset=await loader.parseAsync(b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength),'');
const digest=c=>createHash('sha256').update(JSON.stringify({name:c.name,duration:c.duration,tracks:c.tracks.map(t=>({name:t.name,times:Array.from(t.times),values:Array.from(t.values)}))})).digest('hex');
const original={CrouchIdle:'848e7105957181eb133b7831b8c6fe49d94405143c35c5670875f0b6255c032b',Idle:'4036715a764ad18a375bc7683b9d3d135eb99df6a0334afb219f1d9c113d28a8',Walk:'2be800cf169de72ecca5dbe5344e791d46c12fef48d7eff279ef8f4c0128c1a4',Run:'4809bae613e559164bd21795923fe1c5a397c952688a4745d9a2fd7518bdae51',Jump:'ce9030baa7cc51b3656888cb4d73902fad399c65150d12fb0744b45e5898c9fd',Sit:'e11008587d8124a2f917e7dc1fb405babde6cebcacf47568b63243aeeecabece'};
test('runtime GLB embeds exactly seven clips and preserves all six approved clips',()=>{assert.deepEqual(asset.animations.map(c=>c.name),['Idle','Walk','Run','Jump','Sit','CrouchIdle','CrouchWalk']);for(const [name,hash] of Object.entries(original))assert.equal(digest(asset.animations.find(c=>c.name===name)),hash);});
test('Meshy output tracks bind, are finite/normalized, and contain no horizontal locomotion',()=>{
 const clip=asset.animations.find(c=>c.name==='CrouchIdle');assert.ok(Number.isFinite(clip.duration)&&clip.duration>0);assert.ok(clip.tracks.length>=20);assert.ok(clip.validate());
 for(const track of clip.tracks){assert.ok(asset.scene.getObjectByName(track.name.split('.')[0]));assert.ok(Array.from(track.times).every(Number.isFinite));assert.ok(Array.from(track.values).every(Number.isFinite));if(track.name.endsWith('.quaternion'))for(let i=0;i<track.values.length;i+=4)assert.ok(Math.abs(Math.hypot(...track.values.slice(i,i+4))-1)<1e-5);else{assert.equal(track.name,'mixamorigHips.position');for(let i=0;i<track.values.length;i+=3){assert.equal(track.values[i],0);assert.equal(track.values[i+2],0);}}}
});
test('Very Low declares the same animations and references valid ranges in the shared GLB',()=>{const low=JSON.parse(readFileSync(dir+'player-very-low.gltf'));assert.equal(low.buffers[0].uri,'player.glb');assert.equal(low.buffers[0].byteLength,b.length);assert.deepEqual(low.animations.map(c=>c.name),asset.animations.map(c=>c.name));for(const view of low.bufferViews)assert.ok(view.byteOffset>=28+b.readUInt32LE(12)&&view.byteOffset+view.byteLength<=b.length);});

const sources=['incoming/player-character/crouch_idle_meshy_mixamo.fbx','incoming/player-character/player_Idle.fbx','incoming/player-character/meshy_mixamo_character_reference.fbx'];
test('Meshy transfer is deterministic, immutable, bind-relative and preserves pelvis motion',{skip:!sources.every(existsSync)},()=>{
 const previous=TextureLoader.prototype.load;TextureLoader.prototype.load=()=>new Texture();try{
 const load=p=>{const b=readFileSync(p);return new FBXLoader().parse(b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength),'');};
 const [source,target,reference]=sources.map(load),before=digest(source.animations[0]);
 const a=retargetPlayerCrouch(source,target,reference),again=retargetPlayerCrouch(source,target,reference);
 assert.equal(digest(source.animations[0]),before);assert.equal(digest(a.clip),digest(again.clip));assert.equal(a.report.compatibility,'CASE C');assert.equal(a.report.mappedBones,22);assert.equal(a.report.referenceMatches,true);
 const from=bindRig(source),to=bindRig(target),sm=new AnimationMixer(source),tm=new AnimationMixer(to.root),sa=sm.clipAction(source.animations[0]).play(),ta=tm.clipAction(a.clip).play();
 for(const time of [0,a.clip.duration*.5,a.clip.duration]){sa.time=ta.time=time;sm.update(0);tm.update(0);source.updateMatrixWorld(true);to.root.updateMatrixWorld(true);
 for(const [s,t] of Object.entries(playerMap)){const expected=source.getObjectByName(s).getWorldQuaternion(new Quaternion()).multiply(from.frames.get(s).rotation.clone().invert()).multiply(to.frames.get(t).rotation).normalize();assert.ok(to.root.getObjectByName(t).getWorldQuaternion(new Quaternion()).normalize().angleTo(expected)<.0001,s+' at '+time+' angle '+to.root.getObjectByName(t).getWorldQuaternion(new Quaternion()).normalize().angleTo(expected));}
 const hip=source.getObjectByName('smartrigHips');assert.ok(Math.abs(to.root.getObjectByName('mixamorigHips').position.y-(to.frames.get('mixamorigHips').position.y+hip.matrixWorld.elements[13]*a.report.scaleRatio))<1e-5);
 }sm.stopAllAction();tm.stopAllAction();
 const invalid=load(sources[2]);invalid.getObjectByName('smartrigHead').name='incorrectHead';assert.throws(()=>retargetPlayerCrouch(source,target,invalid),/reference bind mismatch/);
 }finally{TextureLoader.prototype.load=previous;}
});
test('active provenance is Meshy and rejected/runtime retarget paths remain absent',()=>{
 const report=JSON.parse(readFileSync(dir+'crouch-import.json'));assert.equal(report.provider,'Meshy');assert.equal(report.source,sources[0]);
 const importer=readFileSync('scripts/import-player-character.mjs','utf8');assert.ok(importer.includes('crouch_idle_meshy_mixamo.fbx'));assert.doesNotMatch(importer,/motifect|crouch_idle\.fbx|crouch_idle_meshy\.fbx/i);
 for(const name of ['crouch-animations.ts','crouch-animation-config.ts'])assert.equal(existsSync('src/game/player/'+name),false);
 const runtime=readFileSync('src/game/player/player-character.tsx','utf8');assert.doesNotMatch(runtime,/FBXLoader|retarget|Player_Crouch/);assert.ok(runtime.includes('CrouchIdle'));
});

