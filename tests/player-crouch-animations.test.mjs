import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import {AnimationMixer,Texture,Vector3} from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {createCrouchAnimations} from '../src/game/player/crouch-animations.ts';
const buffer=readFileSync('public/assets/characters/player/player.glb'),loader=new GLTFLoader();
loader.register(()=>({name:'test-textures',loadTexture:()=>Promise.resolve(new Texture())}));
const asset=await loader.parseAsync(buffer.buffer.slice(buffer.byteOffset,buffer.byteOffset+buffer.byteLength),'');
const state=()=>{const rows=[];asset.scene.traverse(o=>{if(o.type==='Bone')rows.push([o.name,o.position.toArray(),o.quaternion.toArray()]);});return rows;};
const before=state(),source=asset.animations.map(c=>c.tracks.map(t=>Array.from(t.values)));
const clips=createCrouchAnimations(asset.scene,asset.animations);
test('authored crouch clips bind to the real rig, close their loops, and preserve source assets',()=>{
 assert.deepEqual(state(),before);assert.deepEqual(asset.animations.map(c=>c.tracks.map(t=>Array.from(t.values))),source);
 assert.deepEqual(clips.map(c=>[c.name,c.duration]),[['Player_CrouchIdle',2.4],['Player_CrouchWalk',1]]);
 for(const clip of clips){assert.ok(clip.validate());for(const track of clip.tracks){assert.ok(asset.scene.getObjectByName(track.name.split('.')[0]));assert.ok(Array.from(track.values).every(Number.isFinite));const size=track.getValueSize();assert.deepEqual(Array.from(track.values.slice(0,size)),Array.from(track.values.slice(-size)));assert.match(track.name,/^mixamorig/);}}
});
test('real-rig crouch keyframes retain planted shoes, readable knees and fixed limb lengths',()=>{
 const root=asset.scene,mixer=new AnimationMixer(root),point=new Vector3();
 const bone=name=>root.getObjectByName('mixamorig'+name),at=name=>bone(name).getWorldPosition(new Vector3());
 mixer.clipAction(asset.animations.find(c=>c.name==='Idle')).play();mixer.update(0);root.updateMatrixWorld(true);
 const feet=[at('LeftFoot'),at('RightFoot')],hipY=at('Hips').y,lengths=['Left','Right'].map(side=>[at(side+'UpLeg').distanceTo(at(side+'Leg')),at(side+'Leg').distanceTo(at(side+'Foot'))]);
 for(const clip of clips){mixer.stopAllAction();const action=mixer.clipAction(clip).reset().play();let minFoot=Infinity,maxFoot=-Infinity,minHip=Infinity,maxHip=-Infinity;
  for(let frame=0;frame<=64;frame++){action.time=clip.duration*frame/64;mixer.update(0);root.updateMatrixWorld(true);const hip=at('Hips');minHip=Math.min(minHip,hip.y);maxHip=Math.max(maxHip,hip.y);
   for(const [index,side] of ['Left','Right'].entries()){const thigh=at(side+'UpLeg'),knee=at(side+'Leg'),foot=at(side+'Foot');minFoot=Math.min(minFoot,foot.y);maxFoot=Math.max(maxFoot,foot.y);assert.ok(hip.y>knee.y+.12,`${clip.name}: pelvis must stay above knee`);assert.ok(knee.y>foot.y+.12,`${clip.name}: calf must remain readable`);assert.ok(Math.abs(thigh.distanceTo(knee)-lengths[index][0])<1e-5);assert.ok(Math.abs(knee.distanceTo(foot)-lengths[index][1])<1e-5);assert.ok(foot.y>=feet[index].y-.012,`${clip.name}: foot buried`);assert.ok(foot.y<=feet[index].y+.065,`${clip.name}: excessive foot lift`);}
   assert.ok(root.position.distanceTo(point.set(0,0,0))<1e-8,'no world root motion');
  }
  assert.ok(hipY-minHip>.07&&hipY-maxHip<.2,'moderately lowered hips');
  console.log(clip.name,JSON.stringify({hipDrop:[hipY-maxHip,hipY-minHip],footY:[minFoot,maxFoot]}));
 }
 mixer.stopAllAction();mixer.uncacheRoot(root);
});
