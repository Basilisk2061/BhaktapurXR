import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import polygonClipping from "polygon-clipping";
import RAPIER from "@dimforge/rapier3d-compat";
import {buildCompletedSquareModels,buildCompletedSquareEdge} from "../src/game/architecture/square-completion.ts";
import {buildPalaceFrontageModels} from "../src/game/architecture/palace-frontage-models.ts";
import {buildInsideSquareEdge} from "../src/game/architecture/inside-square-models.ts";
import {phase9cBoundary} from "../src/data/reconstruction/square-completion.ts";
import {urbanStreetExits} from "../src/data/reconstruction/urban-enclosure.ts";
import {squareCompletionReviews} from "../src/game/world/square-completion-review.ts";
import {resolveKhaumaAxisReview,khaumaAxisExperienceSpawn} from "../src/game/world/khauma-axis-review.ts";
import {partitionArchitecturalParts} from "../src/features/world-editor/parts.ts";
import {getEditableRegistry,getEditableParts} from "../src/features/world-editor/registry.ts";
import snapshot from "../src/data/reconstruction/urban-footprints.json" with {type:"json"};
import {geographicToLocal} from "../src/data/reconstruction/geographic-frame.ts";
import {createCharacterController,stepCharacter} from "../src/game/player/character-physics.ts";
import {createPlayerRuntime} from "../src/game/player/player-runtime.ts";
import {playerConfig} from "../src/game/player/player-config.ts";
const heritage=buildCompletedSquareModels(),urban=buildCompletedSquareEdge(),all=[...heritage,...urban.models],saved=readFileSync("src/features/bhaktapur/data/manual-transform-overrides.json","utf8");
test("all frozen Phase 9B.2 monument geometry/transforms except authorized Silu/Rameshwar correction, detailed museum and exclusions are preserved",()=>{
 for(const old of buildPalaceFrontageModels().filter(m=>!["silu-mahadev","rameshwar"].includes(m.id)))assert.deepEqual(heritage.find(m=>m.id===old.id),old,old.id);
 const gate=heritage.find(m=>m.id==="khauma-gate");assert.ok(Math.abs(gate.origin[0]+121.5368476)<1e-6);assert.ok(Math.abs(gate.origin[1]+34.2859082)<1e-6);assert.ok(Math.abs(gate.yaw+1.70917042)<1e-6);
 assert.ok(!all.some(m=>/nyatapola|jagannath|taleju-temple/i.test(m.id)));assert.ok(heritage.find(m=>m.id==="rameshwar").profiles.some(p=>p.role==="rameshwar-four-stone-post"));
 assert.ok(heritage.find(m=>m.id==="golden-gate").boxes.some(b=>b.role==="gate-side-masonry-east-palace-junction"));assert.ok(heritage.find(m=>m.id==="fifty-five-frontage"));
 const spawn=khaumaAxisExperienceSpawn("BHAKTAPUR",null);assert.ok(spawn.position[0]<gate.origin[0]);for(const c of all.flatMap(m=>m.colliders)){const dx=spawn.position[0]-c.position[0],dz=spawn.position[2]-c.position[2],x=dx*Math.cos(c.yaw)-dz*Math.sin(c.yaw),z=dx*Math.sin(c.yaw)+dz*Math.cos(c.yaw);assert.ok(Math.abs(x)>c.size[0]/2+.35||Math.abs(z)>c.size[2]/2+.35||c.position[1]-c.size[1]/2>2,"operational spawn blocked");}
});
test("every intersecting legacy placeholder processed, zero remain, court voids retained and generation deterministic",()=>{
 assert.deepEqual(phase9cBoundary,[[-148,-80],[78,-80],[78,49],[-148,49],[-148,-80]]);assert.equal(urban.rawPlaceholdersBefore,79);assert.equal(urban.rawPlaceholdersAfter,0);
 for(const id of urban.processedLegacyIds){assert.ok(urban.completionInventory.some(r=>id.endsWith(":"+r.sourceId)),id);assert.ok(!urban.models.some(m=>m.id===id&&m.neutral));}
 assert.ok(!urban.models.filter(m=>m.neutral).some(m=>(m.volumes??[]).some(v=>polygonClipping.intersection(v.rings,[phase9cBoundary]).length)));
 const palace=urban.models.find(m=>m.id==="context:9c:18962138");assert.equal(palace.accuracy,"PLAN_INFERRED");assert.ok(palace.volumes.some(v=>v.rings.length===4));
 assert.ok(urban.completionInventory.every(r=>r.classification!=="VERIFIED"));assert.deepEqual(urban,buildCompletedSquareEdge());
});
test("east/south/palace assemblies registered, old editor frames and saved overrides compatible",()=>{
 const entries=getEditableRegistry(),parts=getEditableParts();for(const zone of ["F","G","H"])assert.ok(urban.completionInventory.filter(r=>r.zone===zone&&r.area>0).every(r=>entries.some(e=>e.id===r.id)));
 const previous=[...buildPalaceFrontageModels(),...buildInsideSquareEdge().models].filter(m=>!m.id.startsWith("distant:")&&!m.id.startsWith("ground:")&&m.id!=="entrance:khauma-road"&&(m.boxes.some(b=>!b.role.includes("collision"))||m.shapes.length||m.profiles.length||m.roofs.length||(m.volumes?.length??0)));
 for(const m of previous){assert.ok(entries.some(e=>e.id===m.id),m.id);for(const p of partitionArchitecturalParts(m))assert.deepEqual(parts.find(n=>n.id===p.id)?.source,p.source,p.id);}
 assert.equal(readFileSync("src/features/bhaktapur/data/manual-transform-overrides.json","utf8"),saved);
 for(const m of all.filter(m=>entries.some(e=>e.id===m.id))){const p=partitionArchitecturalParts(m);for(const kind of ["boxes","profiles","shapes","roofs","volumes","polygonRoofs","colliders"])assert.equal(p.flatMap(p=>p.model[kind]??[]).length,(m[kind]??[]).length,m.id+kind);}
});
test("all existing and seven focused completion reviews resolve only in development",()=>{assert.equal(Object.keys(squareCompletionReviews).length,31);for(const [id,p]of Object.entries(squareCompletionReviews)){assert.equal(resolveKhaumaAxisReview(id,true),id);assert.equal(resolveKhaumaAxisReview(id,false),null);assert.ok(p.position.every(Number.isFinite));}});
await RAPIER.init();
test("five exits and mapped Khauma/central/east/south routes stay clear in completed physical scene",()=>{
 const w=new RAPIER.World({x:0,y:-9.81,z:0});w.createCollider(RAPIER.ColliderDesc.cuboid(170,.25,170).setTranslation(-40,-.25,0));for(const c of all.flatMap(m=>m.colliders))w.createCollider(RAPIER.ColliderDesc.cuboid(...c.size.map(v=>v/2)).setTranslation(...c.position).setRotation({x:0,y:Math.sin(c.yaw/2),z:0,w:Math.cos(c.yaw/2)}));
 const cross=(a,b)=>{const dx=b[0]-a[0],dz=b[1]-a[1],length=Math.hypot(dx,dz),body=w.createRigidBody(RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(a[0],.925,a[1])),collider=w.createCollider(RAPIER.ColliderDesc.capsule(playerConfig.capsuleHalfSegment,playerConfig.radius),body),controller=createCharacterController(w,playerConfig),runtime=createPlayerRuntime();w.step();for(let i=0;i<Math.ceil(length/2.3*60)+30;i++){runtime.velocity.x=dx/length*2.3;runtime.velocity.z=dz/length*2.3;stepCharacter(body,collider,controller,runtime,1/60,playerConfig,-9.81,RAPIER.QueryFilterFlags.EXCLUDE_SENSORS);w.step();}const p=body.translation(),progress=((p.x-a[0])*dx+(p.z-a[1])*dz)/length;w.removeCharacterController(controller);w.removeRigidBody(body);assert.ok(progress>=length-.4,`route blocked ${JSON.stringify([a,b])}: ${progress}/${length}`);};
 try{for(const e of urbanStreetExits)cross(e.from,e.to);for(const id of ["85465819","197122575","1160172645","209494236","191716635"]){const points=snapshot.streets.find(s=>s.id===id).coordinates.map(([latitude,longitude])=>geographicToLocal({latitude,longitude}));for(let i=0;i<points.length-1;i++)if([points[i],points[i+1]].every(([x,z])=>x>-148&&x<78&&z>-80&&z<49))cross(points[i],points[i+1]);}const g=heritage.find(m=>m.id==="khauma-gate"),d=[-Math.sin(g.yaw),-Math.cos(g.yaw)];cross([g.origin[0]-d[0]*6,g.origin[1]-d[1]*6],[g.origin[0]+d[0]*6,g.origin[1]+d[1]*6]);}finally{w.free();}
});
