import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {playerConfig,bodySpawnPosition} from '../src/game/player/player-config.ts';
import {createCharacterController,stepCharacter} from '../src/game/player/character-physics.ts';
import {createPlayerRuntime} from '../src/game/player/player-runtime.ts';
import {monumentIdentities,architecturalTypes,reconstructionTarget,supplementalSpatialFeatures,identitySources} from '../src/data/architecture/monuments.ts';
import {sourceArchitecture,supplementalArchitecture,contextArchitecture,footprintBounds} from '../src/data/architecture/registry.ts';
import {spatialFeatures} from '../src/data/world/spatial-registry.ts';
import {buildArchitecturalModel} from '../src/game/architecture/model.ts';
import {profileGeometry,insideFootprint} from '../src/game/architecture/geometry.ts';
import {worldSpawns} from '../src/game/world/world-mode.ts';
const entries=[...sourceArchitecture,...supplementalArchitecture];
const model=id=>buildArchitecturalModel(entries.find(e=>e.monumentId===id),'MEDIUM');

test('identity bindings have unique IDs, valid families, references and honest provisional confidence',()=>{
  assert.equal(new Set(monumentIdentities.map(m=>m.id)).size,monumentIdentities.length);
  for(const m of monumentIdentities){assert.ok(architecturalTypes.includes(m.architectureType));assert.equal(m.classification,'APPROXIMATE');assert.ok(m.sourceReferences.length);for(const ref of m.sourceReferences)assert.ok(identitySources[ref]);
    if(m.sourceFootprintId)assert.ok([...spatialFeatures,...supplementalSpatialFeatures].some(f=>f.id===m.sourceFootprintId));
    if(m.reconstructionState==='PROVISIONALLY_IDENTIFIED')assert.notEqual(m.classification,'VERIFIED');
  }
  for(const suffix of ['004','009']){const m=monumentIdentities.find(m=>m.sourceFootprintId===`unesco-monument-footprint-${suffix}`);assert.equal(m.canonicalName,null);assert.equal(m.reconstructionState,'UNRESOLVED');}
  assert.equal(reconstructionTarget,'CONTEMPORARY_RECONSTRUCTED_BHAKTAPUR_DURBAR_SQUARE');
});
test('shikhara, pagoda, open octagonal mandap and unresolved platforms have distinct structural silhouettes',()=>{
  const v=model('vatsala'),s=model('siddhi-lakshmi'),p=model('yaksheshwar'),m=model('chyasilin');
  assert.equal(v.roofs.length,0);assert.equal(s.roofs.length,0);assert.ok(v.pieces.some(p=>p.role==='shikhara'));assert.equal(p.roofs.length,2);assert.equal(p.pieces.length,0);
  assert.ok(s.volumes.length>v.volumes.length);assert.ok(s.details.filter(d=>d.material==='stone').length>v.details.length);
  assert.equal(m.pieces.filter(p=>p.role==='octagonal-roof'&&p.segments===8).length,2);assert.equal(m.details.filter(d=>d.material==='timber'&&d.size[1]===2.3).length,8);
  const b=footprintBounds(m.entry.footprint.vertices);assert.ok(!m.colliders.some(c=>c.position[1]>1&&Math.abs(c.position[0]-b.x)<.1&&Math.abs(c.position[2]-b.z)<.1),'open pavilion has no central solid temple');
  for(const id of ['silu-mahadev','unresolved-central-symbol','unresolved-southern-sector']){const u=model(id);assert.equal(u.roofs.length,0);assert.equal(u.pieces.length,0);assert.equal(u.volumes.length,1);assert.equal(u.volumes[0].height,.18);}
  assert.ok(model('palace-complex').details.some(d=>d.material==='gold'));
});
test('supplements remain separate, deterministic profiles are finite and visitor spawn stays clear',()=>{
  const spawn=worldSpawns.BHAKTAPUR.position;
  for(const e of [...entries,...contextArchitecture]){assert.ok(!insideFootprint([spawn[0],spawn[2]],e.footprint));const a=buildArchitecturalModel(e,'MEDIUM'),b=buildArchitecturalModel(e,'MEDIUM');assert.deepEqual(a,b);
    for(const p of a.pieces){const g=profileGeometry(p);assert.ok([...g.getAttribute('position').array].every(Number.isFinite));g.dispose();}
  }
  assert.equal(spatialFeatures.length,17);for(const s of supplementalSpatialFeatures)assert.ok(!spatialFeatures.some(f=>f.id===s.id));
});
test('original UNESCO trace file is unchanged from Phase 5, not reshaped for landmark geometry',()=>{
  const bytes=readFileSync(new URL('../src/data/world/unesco-traces.ts',import.meta.url));
  assert.equal(createHash('sha256').update(bytes).digest('hex'),'56e9db5bd3718da5f14d8378f674189d599f038a9933ea941b406e7c974a764b');
});

test('corrected stone stairs and open mandap work with existing Rapier controller and camera sweep',async()=>{
  const RAP=createRequire(import.meta.url)('@dimforge/rapier3d-compat');await RAP.init();
  for(const id of ['vatsala','siddhi-lakshmi','chyasilin']){
    const m=model(id),w=new RAP.World({x:0,y:-9.81,z:0}),fixed=w.createRigidBody(RAP.RigidBodyDesc.fixed());
    w.createCollider(RAP.ColliderDesc.cuboid(900,.25,900).setTranslation(0,-.25,0),fixed);
    for(const c of m.colliders)w.createCollider(RAP.ColliderDesc.cuboid(...c.size.map(v=>v/2)).setTranslation(...c.position).setRotation({x:0,y:Math.sin(c.yaw/2),z:0,w:Math.cos(c.yaw/2)}),fixed);
    const stair=m.details.find(d=>d.material==='stone'),b=footprintBounds(m.entry.footprint.vertices),length=Math.hypot(b.x-stair.position[0],b.z-stair.position[2]),dx=(b.x-stair.position[0])/length,dz=(b.z-stair.position[2])/length;
    const spawn=bodySpawnPosition({position:[stair.position[0]-dx*(stair.size[2]/2+2),.05,stair.position[2]-dz*(stair.size[2]/2+2)],rotation:[0,0,0]});
    const body=w.createRigidBody(RAP.RigidBodyDesc.kinematicPositionBased().setTranslation(spawn.x,spawn.y,spawn.z)),collider=w.createCollider(RAP.ColliderDesc.capsule(playerConfig.capsuleHalfSegment,playerConfig.radius),body),controller=createCharacterController(w,playerConfig),runtime=createPlayerRuntime();let maxY=0,closest=Infinity;
    for(let i=0;i<480;i++){runtime.velocity.x=dx*2.3;runtime.velocity.z=dz*2.3;stepCharacter(body,collider,controller,runtime,1/60,playerConfig,-9.81,RAP.QueryFilterFlags.EXCLUDE_SENSORS,false);w.step();maxY=Math.max(maxY,body.translation().y);closest=Math.min(closest,Math.hypot(body.translation().x-b.x,body.translation().z-b.z));}
    const platformTop=Math.max(...m.volumes.filter(v=>v.material==='stone').map(v=>v.y+v.height))-(id==='chyasilin'?0:id==='vatsala'?2.7:2.8);
    assert.ok(maxY>playerConfig.height/2+platformTop-.05,`${id} stairs reach platform: maxY=${maxY} top=${platformTop} closest=${closest}`);
    if(id==='chyasilin')assert.ok(closest<.8,`mandap open lower centre is traversable: closest=${closest} max=${maxY} final=${JSON.stringify(body.translation())}`);else assert.ok(closest>1,'stone sanctum blocks entry');
    const post=m.colliders.find(c=>c.size[1]===2.3);
    const hit=w.castShape({x:b.x-15,y:id==='chyasilin'?1.7:5,z:id==='chyasilin'?post.position[2]:b.z},{x:0,y:0,z:0,w:1},{x:1,y:0,z:0},new RAP.Ball(.18),0,30,true,RAP.QueryFilterFlags.EXCLUDE_SENSORS,undefined,undefined,body);assert.ok(hit,`${id}: camera detects stone body or pavilion post`);w.free();
  }
});
