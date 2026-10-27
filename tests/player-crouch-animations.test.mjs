import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {test} from 'node:test';
import {Texture,TextureLoader,AnimationMixer,Quaternion} from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {FBXLoader} from 'three/addons/loaders/FBXLoader.js';
import {retargetMotifectCrouch,motifectPlayerMap} from '../scripts/motifect-retarget.mjs';
const dir='public/assets/characters/player/',b=readFileSync(dir+'player.glb'),loader=new GLTFLoader();loader.register(()=>({name:'test-textures',loadTexture:()=>Promise.resolve(new Texture())}));
const asset=await loader.parseAsync(b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength),'');
const digest=c=>createHash('sha256').update(JSON.stringify({name:c.name,duration:c.duration,tracks:c.tracks.map(t=>({name:t.name,times:Array.from(t.times),values:Array.from(t.values)}))})).digest('hex');
const original={Idle:'4036715a764ad18a375bc7683b9d3d135eb99df6a0334afb219f1d9c113d28a8',Walk:'2be800cf169de72ecca5dbe5344e791d46c12fef48d7eff279ef8f4c0128c1a4',Run:'4809bae613e559164bd21795923fe1c5a397c952688a4745d9a2fd7518bdae51',Jump:'ce9030baa7cc51b3656888cb4d73902fad399c65150d12fb0744b45e5898c9fd',Sit:'e11008587d8124a2f917e7dc1fb405babde6cebcacf47568b63243aeeecabece'};
test('runtime GLB embeds exactly six real clips and preserves all five original clips',()=>{assert.deepEqual(asset.animations.map(c=>c.name),['Idle','Walk','Run','Jump','Sit','CrouchIdle']);for(const [name,hash] of Object.entries(original))assert.equal(digest(asset.animations.find(c=>c.name===name)),hash);});
test('Motifect output tracks bind, are finite/normalized, and contain no horizontal locomotion',()=>{
 const clip=asset.animations.find(c=>c.name==='CrouchIdle');assert.ok(Number.isFinite(clip.duration)&&clip.duration>0);assert.ok(clip.tracks.length>=20);assert.ok(clip.validate());
 for(const track of clip.tracks){assert.ok(asset.scene.getObjectByName(track.name.split('.')[0]));assert.ok(Array.from(track.times).every(Number.isFinite));assert.ok(Array.from(track.values).every(Number.isFinite));if(track.name.endsWith('.quaternion'))for(let i=0;i<track.values.length;i+=4)assert.ok(Math.abs(Math.hypot(...track.values.slice(i,i+4))-1)<1e-5);else{assert.equal(track.name,'mixamorigHips.position');for(let i=0;i<track.values.length;i+=3){assert.equal(track.values[i],0);assert.equal(track.values[i+2],0);}}}
});
test('Very Low declares the same animations and references valid ranges in the shared GLB',()=>{const low=JSON.parse(readFileSync(dir+'player-very-low.gltf'));assert.equal(low.buffers[0].uri,'player.glb');assert.equal(low.buffers[0].byteLength,b.length);assert.deepEqual(low.animations.map(c=>c.name),asset.animations.map(c=>c.name));for(const view of low.bufferViews)assert.ok(view.byteOffset>=28+b.readUInt32LE(12)&&view.byteOffset+view.byteLength<=b.length);});
const sources=['incoming/player-character/crouch_idle.fbx','incoming/player-character/player_Idle.fbx'];
test('offline retarget is deterministic, source-immutable and uses only discovered source motion',{skip:!sources.every(existsSync)},()=>{
 const previous=TextureLoader.prototype.load;TextureLoader.prototype.load=()=>new Texture();try{
 const load=p=>{const data=readFileSync(p);return new FBXLoader().parse(data.buffer.slice(data.byteOffset,data.byteOffset+data.byteLength),'');},source=load(sources[0]),target=load(sources[1]);
 const before=digest(source.animations[0]),a=retargetMotifectCrouch(source,target),again=retargetMotifectCrouch(source,target);assert.equal(digest(source.animations[0]),before);assert.equal(digest(a.clip),digest(again.clip));assert.equal(a.report.compatibility,'CASE C');assert.equal(a.report.mappedBones,Object.keys(motifectPlayerMap).length);assert.ok(a.report.scaleRatio>0&&a.report.scaleRatio<.02);
 const input=source.animations[0].tracks.find(t=>t.name==='Hips.position'),out=a.clip.tracks.find(t=>t.name==='mixamorigHips.position');const reference=target.getObjectByName('mixamorigHips');let skin;target.traverse(o=>{if(o.isSkinnedMesh)skin=o;});skin.skeleton.pose();target.updateMatrixWorld(true);
 const interpolant=input.createInterpolant();for(let i=0;i<out.times.length;i++){const value=interpolant.evaluate(out.times[i]);assert.ok(Math.abs(out.values[i*3+1]-(reference.position.y+value[1]*a.report.scaleRatio))<1e-5,'source vertical pelvis motion preserved');}
 const sourceBind=new Map(Object.keys(motifectPlayerMap).map(n=>[n,source.getObjectByName(n).getWorldQuaternion(new Quaternion())])),targetBind=new Map(Object.values(motifectPlayerMap).map(n=>[n,target.getObjectByName(n).getWorldQuaternion(new Quaternion())]));
 const sm=new AnimationMixer(source),tm=new AnimationMixer(target),sa=sm.clipAction(source.animations[0]).play(),ta=tm.clipAction(a.clip).play();
 for(const time of [0,a.clip.duration*.5,a.clip.duration]){sa.time=ta.time=time;sm.update(0);tm.update(0);source.updateMatrixWorld(true);target.updateMatrixWorld(true);for(const [from,to] of Object.entries(motifectPlayerMap)){const expected=source.getObjectByName(from).getWorldQuaternion(new Quaternion()).multiply(sourceBind.get(from).clone().invert()).multiply(targetBind.get(to));const actual=target.getObjectByName(to).getWorldQuaternion(new Quaternion());assert.ok(actual.angleTo(expected)<.0001,'source rest-relative world rotation preserved: '+from);}}
 sm.stopAllAction();tm.stopAllAction();
 }finally{TextureLoader.prototype.load=previous;}
});
