import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync} from 'node:fs';
import {AnimationMixer,Texture,Vector3} from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {crouchVisualGroundOffset,crouchVisualY} from '../src/game/player/crouch-visual-grounding.ts';
import {playerConfig} from '../src/game/player/player-config.ts';

test('visual grounding uses existing smoothstep weight, with unchanged standing and excluded states',()=>{
 assert.ok(Number.isFinite(crouchVisualGroundOffset));assert.equal(crouchVisualY(0,true),0);
 assert.equal(crouchVisualY(1,true),crouchVisualGroundOffset);
 assert.equal(crouchVisualY(.5,true),crouchVisualGroundOffset/2);
 for(const weight of [0,.1,.5,1])assert.equal(crouchVisualY(weight,false),0);
 assert.equal(crouchVisualY(NaN,true),0);
 assert.equal(playerConfig.height,1.75);assert.equal(playerConfig.crouchHeight,1.25);assert.equal(playerConfig.radius,.3);
 for(const w of [0,.5,1]){const h=1.75+(1.25-1.75)*w;assert.equal((h-1.75)/2-h/2,-.875);}
 const runtime=readFileSync('src/game/player/player-character.tsx','utf8');
 assert.match(runtime,/grounding.current.position.y=crouchVisualY/);
 assert.match(runtime,/!motion.seat&&!motion.bellAction&&motion.grounded&&!motion.flying&&name!=="Jump"/);
 assert.ok(runtime.indexOf('mixer.update(')<runtime.indexOf('cameraPose.apply('));
});

test('approved CrouchIdle constant correction grounds supporting shoe over full loop',async()=>{
 const b=readFileSync('public/assets/characters/player/player.glb');
 const loader=new GLTFLoader();loader.register(()=>({name:'test-textures',loadTexture:()=>Promise.resolve(new Texture())}));
 const asset=await loader.parseAsync(b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength),'');
 let mesh;asset.scene.traverse(o=>{if(o.isSkinnedMesh)mesh=o});
 const vertices=[];for(let i=0;i<mesh.geometry.attributes.position.count;i++){let weight=0;for(let j=0;j<4;j++){const bone=mesh.skeleton.bones[mesh.geometry.attributes.skinIndex.array[i*4+j]];if(/mixamorig(Left|Right)(Foot|Toe)/.test(bone.name))weight+=mesh.geometry.attributes.skinWeight.array[i*4+j]}if(weight>.5)vertices.push(i)}
 assert.ok(vertices.length>100);
 const clip=asset.animations.find(c=>c.name==='CrouchIdle'),mixer=new AnimationMixer(asset.scene),action=mixer.clipAction(clip).play(),v=new Vector3();
 const times=[...new Set(clip.tracks.flatMap(t=>Array.from(t.times)))];assert.equal(times.length,120);
 let minimum=Infinity,maximum=-Infinity;
 for(const time of times){action.time=time;mixer.update(0);asset.scene.updateMatrixWorld(true);mesh.skeleton.update();let sole=Infinity;for(const i of vertices){mesh.getVertexPosition(i,v).applyMatrix4(mesh.matrixWorld);sole=Math.min(sole,v.y)}const corrected=sole+crouchVisualY(1,true);minimum=Math.min(minimum,corrected);maximum=Math.max(maximum,corrected)}
 assert.ok(Math.abs(minimum)<1e-6);assert.ok(maximum<.014);assert.ok(minimum>=-1e-6);mixer.stopAllAction();
});
