import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { sourceArchitecture, contextArchitecture, footprintBounds } from '../src/data/architecture/registry.ts';
import { architectureParameters as p, architectureQuality, stableSeed } from '../src/data/architecture/config.ts';
import { spatialFeatures } from '../src/data/world/spatial-registry.ts';
import { buildArchitecturalModel } from '../src/game/architecture/model.ts';
import { insideFootprint, volumeGeometry, hipRoofGeometry, footprintColliders } from '../src/game/architecture/geometry.ts';
import { materialDefinitions, generatedTexture } from '../src/game/materials/heritage-materials.ts';
import { playerConfig, bodySpawnPosition } from '../src/game/player/player-config.ts';
import { createCharacterController, stepCharacter } from '../src/game/player/character-physics.ts';
import { createPlayerRuntime } from '../src/game/player/player-runtime.ts';
import { worldSpawns } from '../src/game/world/world-mode.ts';
const require=createRequire(import.meta.url);
const RAP=require('@dimforge/rapier3d-compat');
const models=sourceArchitecture.map(e=>buildArchitecturalModel(e,'MEDIUM'));

test('source architecture preserves all 14 exact source footprints and unknown factual heights',()=>{
  assert.equal(sourceArchitecture.length,14);assert.equal(sourceArchitecture.filter(e=>e.footprint.footprintClass==='monument').length,9);
  assert.equal(new Set([...sourceArchitecture,...contextArchitecture].map(e=>e.id)).size,14+contextArchitecture.length);
  for(const entry of sourceArchitecture){assert.equal(entry.accuracy,'APPROXIMATE');assert.equal(entry.footprint,spatialFeatures.find(f=>f.id===entry.footprint.id));assert.equal(entry.footprint.heightMetres,null);assert.deepEqual(entry.sourceIds,['unesco-bhaktapur-monument-zone-2006']);assert.ok(entry.bodyHeight>0);}
  assert.equal(p.accuracy,'APPROXIMATE');for(const value of Object.values(p))if(typeof value==='number')assert.ok(value>0);
});
test('context is isolated, explicitly placeholder, and clear of mapped building envelopes',()=>{
  assert.ok(contextArchitecture.length>=6);
  for(const e of contextArchitecture){assert.equal(e.accuracy,'PLACEHOLDER');assert.deepEqual(e.sourceIds,[]);assert.ok(!spatialFeatures.some(f=>f.id===e.id));const b=footprintBounds(e.footprint.vertices);
    for(const source of sourceArchitecture){const s=footprintBounds(source.footprint.vertices);assert.ok(!(b.minX<s.maxX+3&&b.maxX>s.minX-3&&b.minZ<s.maxZ+3&&b.maxZ>s.minZ-3));}
  }
});
test('deterministic models, quality retains source silhouettes, dimensions and geometry stay finite',()=>{
  assert.equal(stableSeed('ordinary-building'),stableSeed('ordinary-building'));assert.notEqual(stableSeed('a'),stableSeed('b'));
  for(const entry of sourceArchitecture){const low=buildArchitecturalModel(entry,'LOW'),high=buildArchitecturalModel(entry,'HIGH');assert.deepEqual(low.volumes,high.volumes);assert.deepEqual(low.roofs,high.roofs);assert.deepEqual(low,buildArchitecturalModel(entry,'LOW'));
    for(const box of high.details){assert.ok(box.size.every(v=>v>0&&Number.isFinite(v)));assert.ok(box.position.every(Number.isFinite));}
    for(const [i,roof] of high.roofs.entries()){const g=hipRoofGeometry(roof.width,roof.depth,roof.rise);assert.ok([...g.getAttribute('position').array].every(Number.isFinite));g.dispose();if(entry.tiers>0&&i>0){const previous=high.roofs[i-1];assert.ok(roof.position[1]>previous.position[1]+previous.rise,'upper roof clears lower peak');}}
    for(const volume of high.volumes){const g=volumeGeometry(volume.footprint,volume.height);assert.ok([...g.getAttribute('position').array].every(Number.isFinite));g.dispose();}
  }assert.ok(architectureQuality.LOW.shadowSize<architectureQuality.HIGH.shadowSize);
});
test('generated materials use deterministic bounded tiles and matte physically plausible settings',()=>{
  for(const m of Object.values(materialDefinitions)){assert.ok(m.roughness>=.8&&m.roughness<=1);assert.match(m.color,/^#[0-9a-f]{6}$/i);}
  for(const kind of ['brick','roof','paving']){const a=generatedTexture(kind),b=generatedTexture(kind);assert.equal(a.image.width,256);assert.deepEqual(a.image.data,b.image.data);assert.ok(new Set(a.image.data).size>30);a.dispose();b.dispose();}
});
test('collision interior cuboids keep white holes open and spawn clear of all solid architecture',()=>{
  const spawn=worldSpawns.BHAKTAPUR.position;
  for(const entry of [...sourceArchitecture,...contextArchitecture]){assert.ok(!insideFootprint([spawn[0],spawn[2]],entry.footprint));
    for(const c of footprintColliders(entry.footprint,entry.bodyHeight).filter(c=>c.yaw===0&&c.size[2]===p.collisionCell))assert.ok(insideFootprint([c.position[0],c.position[2]],entry.footprint));
  }
});
test('real Rapier architecture blocks building entry and allows source-derived monument stairs',async()=>{
  await RAP.init();const world=new RAP.World({x:0,y:-9.81,z:0});
  const ground=world.createRigidBody(RAP.RigidBodyDesc.fixed());world.createCollider(RAP.ColliderDesc.cuboid(900,.25,900).setTranslation(0,-.25,0),ground);
  const fixed=world.createRigidBody(RAP.RigidBodyDesc.fixed());
  for(const model of models)for(const c of model.colliders){world.createCollider(RAP.ColliderDesc.cuboid(...c.size.map(v=>v/2)).setTranslation(...c.position).setRotation({x:0,y:Math.sin(c.yaw/2),z:0,w:Math.cos(c.yaw/2)}),fixed);}
  const model=models.find(m=>m.entry.footprint.id==='unesco-monument-footprint-002');const stair=model.details.find(d=>d.material==='stone');
  const nx=Math.sin(stair.yaw),nz=Math.cos(stair.yaw);const b=footprintBounds(model.entry.footprint.vertices);
  // Start outside stair and move toward the footprint centre, keeping the existing controller.
  const length=Math.hypot(stair.position[0]-b.x,stair.position[2]-b.z),dir={x:(b.x-stair.position[0])/length,z:(b.z-stair.position[2])/length};
  const foot={position:[stair.position[0]-dir.x*2,.05,stair.position[2]-dir.z*2],rotation:[0,0,0]};const spawn=bodySpawnPosition(foot);
  const body=world.createRigidBody(RAP.RigidBodyDesc.kinematicPositionBased().setTranslation(spawn.x,spawn.y,spawn.z));const collider=world.createCollider(RAP.ColliderDesc.capsule(playerConfig.capsuleHalfSegment,playerConfig.radius),body);const controller=createCharacterController(world,playerConfig),runtime=createPlayerRuntime();let maxY=0;
  for(let i=0;i<240;i++){runtime.velocity.x=dir.x*2.3;runtime.velocity.z=dir.z*2.3;stepCharacter(body,collider,controller,runtime,1/60,playerConfig,-9.81,RAP.QueryFilterFlags.EXCLUDE_SENSORS,false);world.step();maxY=Math.max(maxY,body.translation().y);}
  assert.ok(maxY>playerConfig.height/2+p.plinthSteps*p.stairRise-.03,'stairs should reach the full raised plinth');assert.ok(Math.hypot(body.translation().x-b.x,body.translation().z-b.z)>1,'temple body must block entry');
  const cameraHit=world.castShape({x:stair.position[0]-dir.x*2,y:2.2,z:stair.position[2]-dir.z*2},{x:0,y:0,z:0,w:1},{x:dir.x,y:0,z:dir.z},new RAP.Ball(.18),0,15,true,RAP.QueryFilterFlags.EXCLUDE_SENSORS,undefined,undefined,body);
  assert.ok(cameraHit&&cameraHit.time_of_impact<15,'existing sphere-sweep camera detects monument collision');assert.ok(Number.isFinite(nx+nz));world.free();
});
test('visitor routing and development-only source review remain intact',()=>{
  const page=readFileSync(new URL('../src/app/reconstruction/page.tsx',import.meta.url),'utf8');assert.match(page,/NODE_ENV !== "development"/);assert.match(page,/notFound/);
  const api=readFileSync(new URL('../src/app/api/dev/reference-map/route.ts',import.meta.url),'utf8');assert.match(api,/NODE_ENV !== "development"/);assert.match(api,/status: 404/);
});
console.log(JSON.stringify({sourceArchitecture:sourceArchitecture.length,context:contextArchitecture.length,volumes:models.reduce((n,m)=>n+m.volumes.length,0),roofs:models.reduce((n,m)=>n+m.roofs.length,0),detailInstances:models.reduce((n,m)=>n+m.details.length,0),compoundBoxes:models.reduce((n,m)=>n+m.colliders.length,0)}));
