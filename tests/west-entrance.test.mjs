import assert from "node:assert/strict";
import {test} from "node:test";
import {createRequire} from "node:module";
import {buildPhase7Models} from "../src/game/architecture/remaining-models.ts";
import {buildPhase9Models,buildKhaumaGate,buildWesternGopinath} from "../src/game/architecture/west-models.ts";
import {buildWestEnclosure} from "../src/game/architecture/west-enclosure.ts";
import {buildPlazaEnclosure} from "../src/game/architecture/plaza-enclosure.ts";
import {westSpecifications,westSources,westIdentityDecision} from "../src/data/reconstruction/architecture/west-specifications.ts";
import {westReviewSpawns,resolveWestReview} from "../src/game/world/west-review.ts";
import {rectangle,overlaps,streetRectangle} from "../src/game/architecture/urban-model.ts";
import {urbanStreetExits} from "../src/data/reconstruction/urban-enclosure.ts";
import {createPlayerRuntime} from "../src/game/player/player-runtime.ts";
import {createCharacterController,stepCharacter} from "../src/game/player/character-physics.ts";
import {playerConfig} from "../src/game/player/player-config.ts";
const original=buildPhase7Models(),models=buildPhase9Models(),urban=buildWestEnclosure(models);
test("Phase 9A retains every existing anchor and all central/eastern models except attached Yak struts",()=>{
 for(const old of original){const m=models.find(m=>m.id===old.id);assert.deepEqual(m.origin,old.origin);assert.equal(m.yaw,old.yaw);if(!["gopinath-krishna","badrinath","yaksheshwar"].includes(m.id))assert.deepEqual(m,old);}
 const yak=models.find(m=>m.id==="yaksheshwar"),old=original.find(m=>m.id==="yaksheshwar");assert.deepEqual(yak.colliders,old.colliders);assert.deepEqual(yak.roofs,old.roofs);assert.deepEqual(yak.profiles,old.profiles);
 assert.equal(new Set(models.map(m=>m.id)).size,models.length);assert.deepEqual(models,buildPhase9Models());
});
test("western identities are distinct and uncertainty/source roles cannot masquerade as verified",()=>{
 assert.equal(westSpecifications.length,6);for(const s of westSpecifications){assert.equal(s.dimensionalSource.classification,"APPROXIMATE");assert.ok(s.unresolvedDetails.length);assert.ok([...s.positionSource.sourceIds,...s.visualFormSource.sourceIds,...s.dimensionalSource.sourceIds].every(id=>westSources[id]));assert.ok(s.position.every(Number.isFinite));}
 for(const id of ["khauma-gate","kedarnath","jagannath"])assert.equal(westSpecifications.find(s=>s.id===id).positionSource.status,"PROVISIONAL");
 assert.equal(westSources["9a-gate-2018"].coordinateRole,"CAMERA_LOCATION");assert.match(westIdentityDecision.decision,/pavilion retained/);
 assert.deepEqual(models.find(m=>m.id==="rameshwar"),original.find(m=>m.id==="rameshwar"));
 assert.equal(models.find(m=>m.id==="kedarnath").roofs.length,0);
 assert.equal(models.find(m=>m.id==="jagannath").roofs.length,2);
 assert.equal(models.find(m=>m.id==="gopinath-krishna").accuracy,"PROVISIONALLY_IDENTIFIED");
});
test("western cleanup retains untouched context, all five existing exits and valid review positions",()=>{
 const old=buildPlazaEnclosure();assert.ok(urban.westRemovedIds.length>0);for(const m of urban.models)if(!urban.westPlaceholderIds.includes(m.id))assert.deepEqual(m,old.models.find(o=>o.id===m.id));
 for(const exit of urbanStreetExits){const corridor=streetRectangle(exit.from,exit.to,exit.width);for(const m of [...models,...urban.models])for(const c of m.colliders)assert.ok(!overlaps(rectangle([c.position[0],c.position[2]],c.size[0],c.size[2],c.yaw),corridor),`${m.id} obstructs ${exit.id}`);}
 for(const [id,spawn]of Object.entries(westReviewSpawns)){assert.equal(resolveWestReview(id,true),id);assert.equal(resolveWestReview(id,false),null);assert.ok(spawn.position.every(Number.isFinite));if(id!=="west-aerial")for(const m of [...models,...urban.models])for(const c of m.colliders)assert.ok(!overlaps(rectangle([spawn.position[0],spawn.position[2]],.7,.7,0),rectangle([c.position[0],c.position[2]],c.size[0],c.size[2],c.yaw)),`${id} inside ${m.id}`);}
});
test("connected pagoda struts terminate at facade and eave instead of floating",()=>{
 const m=buildWesternGopinath();for(const b of m.boxes.filter(b=>b.role.includes("connected"))){assert.ok(b.tilt>0);const dy=Math.cos(b.tilt)*b.size[1]/2;assert.ok(dy>0);assert.ok(b.position[1]-dy>=4.53);assert.ok(b.position[1]+dy<=9.57);
 const localZ=(b.position[0]-m.origin[0])*Math.sin(b.yaw)+(b.position[2]-m.origin[1])*Math.cos(b.yaw),dz=Math.sin(b.tilt)*b.size[1]/2;
 assert.ok(localZ-dz<3.2,"lower attachment stays at facade");assert.ok(localZ+dz>2.4,"upper attachment reaches projecting eave");}
 assert.equal(m.boxes.filter(b=>b.role.includes("connected-lower-strut")).length,36);
});
const RAP=createRequire(import.meta.url)("@dimforge/rapier3d-compat");await RAP.init();
test("Khauma arch is physically passable while its thick piers block the player",()=>{
 const gate=buildKhaumaGate(),world=new RAP.World({x:0,y:-9.81,z:0});world.createCollider(RAP.ColliderDesc.cuboid(170,.25,170).setTranslation(-40,-.25,0));for(const c of gate.colliders)world.createCollider(RAP.ColliderDesc.cuboid(...c.size.map(v=>v/2)).setTranslation(...c.position).setRotation({x:0,y:Math.sin(c.yaw/2),z:0,w:Math.cos(c.yaw/2)}));
 const run=(x)=>{const body=world.createRigidBody(RAP.RigidBodyDesc.kinematicPositionBased().setTranslation(gate.origin[0]+x,.925,gate.origin[1]-4)),collider=world.createCollider(RAP.ColliderDesc.capsule(playerConfig.capsuleHalfSegment,playerConfig.radius),body),controller=createCharacterController(world,playerConfig),runtime=createPlayerRuntime();world.step();for(let i=0;i<240;i++){runtime.velocity.z=2.3;stepCharacter(body,collider,controller,runtime,1/60,playerConfig,-9.81,RAP.QueryFilterFlags.EXCLUDE_SENSORS);world.step();}const z=body.translation().z;world.removeCharacterController(controller);world.removeRigidBody(body);return z;};
 try{assert.ok(run(0)>gate.origin[1]+3);assert.ok(run(3.3)<gate.origin[1]-1);}finally{world.free();}
});
