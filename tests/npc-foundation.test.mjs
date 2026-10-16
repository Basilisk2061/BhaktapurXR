import assert from 'node:assert/strict';import {test} from 'node:test';import fs from 'node:fs';
import RAPIER from '@dimforge/rapier3d-compat';import {Vector3,Group,Bone,QuaternionKeyframeTrack,VectorKeyframeTrack,AnimationClip} from 'three';
import overrides from '../src/features/bhaktapur/data/manual-transform-overrides.json' with {type:'json'};
import {buildCompletedSquareModels,buildCompletedSquareEdge} from '../src/game/architecture/square-completion.ts';
import {partitionArchitecturalParts} from '../src/features/world-editor/parts.ts';import {partWorldDelta,affineCollider} from '../src/features/world-editor/transforms.ts';
import {arcadeSeatSpans,nearestArcadeSeat} from '../src/game/player/arcade-sitting.ts';
import {npcInstances,npcDefinitions} from '../src/game/npcs/definitions.ts';import {NpcSimulation} from '../src/game/npcs/behavior.ts';import {pedestrianGraph,route} from '../src/game/npcs/navigation.ts';import {createNpcNavigationProbe} from '../src/game/npcs/physics-navigation.ts';import {mixamoRig,retargetMixamoClip} from '../src/game/npcs/mixamo-retarget.ts';
await RAPIER.init();
const world=new RAPIER.World({x:0,y:-9.81,z:0});world.createCollider(RAPIER.ColliderDesc.cuboid(170,.25,170).setTranslation(-40,-.25,0));
for(const model of [...buildCompletedSquareModels(),...buildCompletedSquareEdge().models]){
 const source={position:[model.origin[0],0,model.origin[1]],rotation:[0,model.yaw,0],scale:[1,1,1]};
 for(const part of partitionArchitecturalParts(model)){const delta=partWorldDelta(source,overrides[model.id]??source,part.source,overrides[part.id]??part.source);for(const collider of part.model.colliders){const c=affineCollider(collider,delta);world.createCollider(RAPIER.ColliderDesc.convexHull(new Float32Array(c.vertices)).setTranslation(...c.position));}}
}world.step();
const span=arcadeSeatSpans(overrides)[0],probe=createNpcNavigationProbe(world,RAPIER),graph=pedestrianGraph(span,probe);

test('small pedestrian graph uses only collision-clear plaza nodes/edges; no disconnected destinations',()=>{
 console.log('NPC graph',graph.nodes.length,'nodes',graph.edges.length,'edges');assert.ok(graph.nodes.length>=4);assert.ok(graph.nodes.length>10);assert.ok(graph.edges.length>13);
 assert.ok(graph.nodes.some(n=>n.point.x< -100));assert.ok(graph.nodes.some(n=>n.point.x> -20&&n.point.z< -10));
 for(const node of graph.nodes){assert.ok(node.point.y<.2);assert.notEqual(probe.height(node.point),null);for(const other of graph.nodes)if(node!==other)assert.ok(route(graph,node.id,other.id).length);}
 for(const [a,b]of graph.edges)assert.ok(probe.clear(graph.nodes.find(n=>n.id===a).point,graph.nodes.find(n=>n.id===b).point));
 assert.equal(probe.height(new Vector3(span.a.x,.775,span.a.z)),null,'raised arcade top is not a normal walking destination');
});

test('four configured agents desynchronize, reserve separate seats, sit and resume without leaving safe segments',()=>{
 assert.equal(npcInstances.length,4);assert.equal(npcInstances.filter(n=>n.character==='female_01').length,2);assert.equal(npcInstances.filter(n=>n.character==='old_man_01').length,2);
 const sim=new NpcSimulation(graph,span,probe,npcInstances),player=new Vector3(-135,0,-35),history=new Map(sim.agents.map(a=>[a.id,new Set()]));let separation=Infinity;const firstSit={},visited=new Set();
 for(let i=0;i<60*600;i++){
  sim.tick(1/60,player,null);
  for(const a of sim.agents){if(a.position.x< -100)visited.add('west');if(a.position.x> -25&&a.position.z< -10)visited.add('palace');const seen=history.get(a.id);if(a.state==='SITTING'){seen.add('sit');firstSit[a.id]??=sim.time;}if(a.state==='WALKING'&&seen.has('sit'))seen.add('resume');const desired=sim.displacement(a,1/60,player);a.position.add(desired);if(a.state!=='SITTING')assert.ok(a.position.y<.2,'only sitting enters the raised platform');}
  for(let a=0;a<4;a++)for(let b=a+1;b<4;b++){const x=sim.agents[a],y=sim.agents[b];separation=Math.min(separation,Math.hypot(x.position.x-y.position.x,x.position.z-y.position.z));if(x.seat&&y.seat)assert.ok(x.seat.point.distanceTo(y.seat.point)>=1.3);}
 }
 console.log('NPC histories',Object.fromEntries([...history].map(([id,set])=>[id,[...set]])),'min separation',separation,'first sit',firstSit);
 assert.ok(visited.has('west'));assert.ok(visited.has('palace'));
 for(const seen of history.values()){assert.ok(seen.has('sit'));assert.ok(seen.has('resume'));}assert.ok(separation>=.85);assert.equal(new Set(sim.agents.map(a=>a.phase)).size,4);assert.ok(npcDefinitions.old_man_01.speed<npcDefinitions.female_01.speed);
 const repeat=new NpcSimulation(graph,span,probe,npcInstances);const again=new NpcSimulation(graph,span,probe,npcInstances);assert.deepEqual(repeat.agents.map(a=>[a.phase,a.speed,a.waitUntil]),again.agents.map(a=>[a.phase,a.speed,a.waitUntil]));
});

test('player occupancy blocks NPC advance and seat selection',()=>{
 const sim=new NpcSimulation(graph,span,probe,[npcInstances[2]]),a=sim.agents[0];a.state='WALKING';a.target=graph.nodes[(a.node+1)%graph.nodes.length].point.clone();const player=a.position.clone().add(a.target.clone().sub(a.position).normalize().multiplyScalar(.7));assert.equal(sim.displacement(a,1/60,player).length(),0);assert.ok(sim.displacement(a,1/60,new Vector3(-1000,0,-1000)).length()>0,'resume once the player clears the path');
});

test('Mixamo role retargeting validates parent chains, normalizes rotations and preserves source clip',()=>{
 const rig=(scale=1)=>{const root=new Group(),hips=new Bone();hips.name='mixamorigHips';root.add(hips);let parent=hips;for(const [name,y]of [['LeftUpLeg',-.1],['LeftLeg',-.4],['LeftFoot',-.4]]){const bone=new Bone();bone.name='mixamorig'+name;bone.position.y=y*scale;parent.add(bone);parent=bone;}return root;};
 const clip=new AnimationClip('Sit',1,[new QuaternionKeyframeTrack('mixamorigLeftLeg.quaternion',[0,1],[0,0,0,1,0,.2,0,.98]),new VectorKeyframeTrack('mixamorigHips.position',[0,1],[1,.2,2,2,.21,3])]),before=clip.tracks.map(t=>Array.from(t.values)),mapped=retargetMixamoClip(clip,mixamoRig(rig()),mixamoRig(rig(.8)));
 assert.ok(Math.abs(mapped.tracks[1].values[1]-.16)<1e-6);assert.equal(mapped.tracks[1].values[0],0);assert.equal(mapped.tracks[1].values[2],0);assert.deepEqual(clip.tracks.map(t=>Array.from(t.values)),before);
 const broken=mixamoRig(rig());broken.bones.get('LeftLeg').parent='Wrong';assert.throws(()=>retargetMixamoClip(clip,mixamoRig(rig()),broken),/Incompatible/);
});

test('old-man runtime skin preserves UV-verified geometry and maps Sit to existing player library',()=>{
 const path='public/assets/characters/npcs/old_man_01/character.glb';assert.ok(fs.existsSync(path));const b=fs.readFileSync(path),j=JSON.parse(b.subarray(20,20+b.readUInt32LE(12)));assert.ok(j.skins.length);assert.deepEqual(j.animations.map(a=>a.name),['OldManIdle','OldManWalk']);assert.equal(npcDefinitions.old_man_01.roles.sit.library,'player');assert.equal(npcDefinitions.old_man_01.roles.sit.clip,'Sit');
});
process.on('exit',()=>world.free());
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {Texture,AnimationMixer} from 'three';
import npcManifest from '../public/assets/characters/npcs/manifest.json' with {type:'json'};
test('both actual runtime skins animate; old man reuses an immutable, compatible player Sit clip',async()=>{
 const load=async file=>{const b=fs.readFileSync(file),loader=new GLTFLoader();loader.register(()=>({name:'test-textures',loadTexture:()=>Promise.resolve(new Texture())}));return loader.parseAsync(b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength),'');};
 const player=await load('public/assets/characters/player/player.glb'),sit=player.animations.find(a=>a.name==='Sit'),values=sit.tracks.map(t=>Array.from(t.values));
 for(const id of ['female_01','old_man_01']){
  const asset=await load(`public/assets/characters/npcs/${id}/character.glb`);let skin;asset.scene.traverse(o=>{if(o.isSkinnedMesh)skin=o;});assert.ok(skin);assert.equal(skin.geometry.index.count/3,npcManifest[id].triangles);assert.equal(npcManifest[id].uvVerified,true);
  const seated=id==='old_man_01'?retargetMixamoClip(sit,mixamoRig(player.scene),mixamoRig(asset.scene)):asset.animations.find(c=>c.name==='FemaleSit');assert.equal(seated.tracks.length,35);
  const mixer=new AnimationMixer(asset.scene);for(const clip of [asset.animations[0],asset.animations[1],seated]){mixer.stopAllAction();mixer.clipAction(clip).play();mixer.update(clip.duration*.3);asset.scene.updateMatrixWorld(true);const head=asset.scene.getObjectByName('mixamorigHead').getWorldPosition(new Vector3());assert.ok(head.toArray().every(Number.isFinite));assert.ok(head.y>.5&&head.y<2.2);}
  mixer.stopAllAction();mixer.clipAction(seated).reset().play();
  const offset=npcDefinitions[id].sitPoseOffsetY??npcManifest[id].sitVisualY;
  if(id==='old_man_01'){
   assert.equal(npcDefinitions[id].sitDepth,undefined,'retain shared seat depth');
   assert.ok(offset<npcManifest[id].sitVisualY-.1,'remove the import estimate that lifted the entire pose');
   for(let frame=0;frame<20;frame++){
    mixer.update(seated.duration/20);asset.scene.updateMatrixWorld(true);
    const hip=asset.scene.getObjectByName('mixamorigHips').getWorldPosition(new Vector3());
    const thigh=asset.scene.getObjectByName('mixamorigLeftUpLeg').getWorldPosition(new Vector3());
    assert.ok(hip.y+offset>.08&&hip.y+offset<.16,'pelvis remains just above the support, not floating');
    assert.ok(thigh.y+offset>0&&thigh.y+offset<.08,'folded thigh stays near the sitting surface');
   }
  }else{assert.equal(offset,-.3442643266708278);assert.equal(npcDefinitions[id].sitDepth,.12);}
  mixer.stopAllAction();
 }
 assert.deepEqual(sit.tracks.map(t=>Array.from(t.values)),values);assert.equal(npcInstances.length,4);
});

test('walkers can separate from close occupants; a player taking a seat makes its NPC vacate safely',()=>{
 const sim=new NpcSimulation(graph,span,probe,[npcInstances[2]]),a=sim.agents[0];a.state='WALKING';a.target=a.position.clone().add(new Vector3(-2,0,0));const close=a.position.clone().add(new Vector3(.8,0,0));assert.ok(sim.displacement(a,1/60,close).length()>0,'moving away must remain possible inside the personal-space radius');
 const seat=nearestArcadeSeat(span.a.clone().lerp(span.b,.5),[span]);assert.ok(seat);a.state='SITTING';a.seat=seat;a.position.copy(seat.point);a.sitUntil=999;
 sim.tick(1/60,seat.point.clone(),seat);assert.equal(a.state,'WALKING');assert.equal(a.seat,null);assert.ok(Math.hypot(a.position.x-seat.exit.x,a.position.z-seat.exit.z)<.001);assert.ok(a.position.y<.2);
});
