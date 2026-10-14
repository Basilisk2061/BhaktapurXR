import test from "node:test";
import assert from "node:assert/strict";
import {buildCompletedSquareEdge} from "../src/game/architecture/square-completion.ts";
import {KHAUMA_GATE_VIEW_AXIS,gateAxisDirection} from "../src/data/reconstruction/khauma-spatial-audit.ts";
test("pale Khauma approach ends at frozen gate centreline and interior guide overlays are absent",()=>{
 const edge=buildCompletedSquareEdge(),road=edge.models.find(m=>m.id==="entrance:khauma-road");
 assert.deepEqual(road.origin,KHAUMA_GATE_VIEW_AXIS.proposedCentre);
 assert.equal(road.boxes.length,1);
 const b=road.boxes[0],c=KHAUMA_GATE_VIEW_AXIS.proposedCentre,d=gateAxisDirection;
 const projection=(b.position[0]-c[0])*d[0]+(b.position[2]-c[1])*d[1];
 assert.ok(Math.abs(projection+b.size[2]/2)<1e-8,"inside edge ends on gate threshold");
 assert.ok(projection<0,"approach lies outside");
 assert.ok(!edge.models.some(m=>m.id==="ground:9c-lane-transitions"),"no contrast route overlays remain");
 assert.equal(road.colliders.length,0,"no invisible path collider");
});import {buildCompletedSquareModels} from "../src/game/architecture/square-completion.ts";
import {buildPalaceFrontageModels} from "../src/game/architecture/palace-frontage-models.ts";
import {khaumaInteriorAudit} from "../src/game/architecture/khauma-interior-correction.ts";
import {easternCorrection} from "../src/game/architecture/eastern-correction.ts";
import {getEditableRegistry,getEditableParts} from "../src/features/world-editor/registry.ts";
import {partitionArchitecturalParts} from "../src/features/world-editor/parts.ts";
import editorFrames from "../src/data/reconstruction/eastern-editor-frames.json" with {type:"json"};
import {transformMatrix,partWorldDelta} from "../src/features/world-editor/transforms.ts";
import {readFileSync} from "node:fs";
import RAPIER from "@dimforge/rapier3d-compat";
import {createCharacterController,stepCharacter} from "../src/game/player/character-physics.ts";
import {createPlayerRuntime} from "../src/game/player/player-runtime.ts";
import {playerConfig} from "../src/game/player/player-config.ts";
const savedOverrides=readFileSync("src/features/bhaktapur/data/manual-transform-overrides.json","utf8"),models=buildCompletedSquareModels(),edge=buildCompletedSquareEdge(),all=[...models,...edge.models];
test("only authorized eastern temple/pavilion heritage changes; anchor, museum, palace and central/western geometry retained",()=>{
 for(const old of buildPalaceFrontageModels()){const next=models.find(m=>m.id===old.id);assert.deepEqual(next.origin,old.origin);if(!["silu-mahadev","rameshwar"].includes(old.id))assert.deepEqual(next,old);}
 const silu=models.find(m=>m.id==="silu-mahadev");assert.equal(silu.yaw,easternCorrection.newYaw);assert.notEqual(silu.yaw,easternCorrection.oldYaw);assert.equal(silu.boxes.filter(b=>b.role==="silu-platform").length,9);assert.equal(silu.boxes.filter(b=>b.role==="silu-stairs").length,12);assert.ok(silu.profiles.some(p=>p.role==="silu-main-shikhara"));assert.equal(silu.profiles.filter(p=>p.role==="silu-subsidiary-towers").length,4);assert.ok(!all.some(m=>/nyatapola|jagannath|taleju-temple/.test(m.id)));
});
test("photo entrance replaces residential facade; sculpture surfaces, veranda and low open sattal are editable and classification honest",()=>{
 const school=all.find(m=>m.id==="edge:khauma-north-flank:1158762014"),veranda=all.find(m=>m.id==="entrance:khauma-raised-veranda"),sattal=all.find(m=>m.id==="context:9c:1159393578");
 assert.ok(!school.volumes?.length);for(const side of ["left","right"])for(const kind of ["guardian","relief"])assert.ok(school.profiles.some(p=>p.role===`school-${side}-${kind}`&&p.sculptedSurface));
 assert.ok(veranda.boxes.some(b=>b.material==="plaster"));assert.equal(veranda.boxes.filter(b=>b.role==="veranda-posts").length,5);assert.ok(sattal.boxes.filter(b=>b.role==="sattal-columns").length>10);assert.ok(sattal.polygonRoofs.every(r=>r.baseY<5));assert.equal(sattal.accuracy,"PROVISIONALLY_IDENTIFIED");
 for(const r of khaumaInteriorAudit.filter(r=>r.classification==="FOOTPRINT_ONLY_CONTEXT")){const m=all.find(m=>m.id===r.id);assert.equal(m.accuracy,"FOOTPRINT_ONLY_CONTEXT");assert.ok(!m.boxes.some(b=>/window|shutter|lattice/.test(b.role)));}
 const registry=getEditableRegistry(),parts=getEditableParts();for(const id of [school.id,veranda.id,sattal.id,"silu-mahadev"]){assert.ok(registry.some(r=>r.id===id));assert.ok(parts.filter(p=>p.parentId===id).length>=5);}for(const frames of Object.values(editorFrames))for(const [part,source]of Object.entries(frames))assert.deepEqual(parts.find(p=>p.id===part)?.source,source);
 assert.equal(readFileSync("src/features/bhaktapur/data/manual-transform-overrides.json","utf8"),savedOverrides);
 const p=partitionArchitecturalParts(school).find(p=>p.id.endsWith("/left-guardian")),source=registry.find(r=>r.id===school.id).source,changed={...p.source,position:[p.source.position[0]+.3,...p.source.position.slice(1)]};const delta=partWorldDelta(source,source,p.source,changed);assert.ok(delta.elements.every(Number.isFinite));assert.notDeepEqual(delta.elements,transformMatrix({position:[0,0,0],rotation:[0,0,0],scale:[1,1,1]}).elements);
});
await RAPIER.init();
test("temple stair climb reaches usable terrace and entrance sculpture/wall colliders match owned geometry",()=>{
 const m=models.find(m=>m.id==="silu-mahadev"),world=new RAPIER.World({x:0,y:-9.81,z:0});world.createCollider(RAPIER.ColliderDesc.cuboid(170,.25,170).setTranslation(-40,-.25,0));for(const c of m.colliders)world.createCollider(RAPIER.ColliderDesc.cuboid(...c.size.map(v=>v/2)).setTranslation(...c.position).setRotation({x:0,y:Math.sin(c.yaw/2),z:0,w:Math.cos(c.yaw/2)}));const at=(z)=>({x:m.origin[0]+Math.sin(m.yaw)*z,y:.925,z:m.origin[1]+Math.cos(m.yaw)*z}),body=world.createRigidBody(RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(...Object.values(at(11)))),collider=world.createCollider(RAPIER.ColliderDesc.capsule(playerConfig.capsuleHalfSegment,playerConfig.radius),body),controller=createCharacterController(world,playerConfig),runtime=createPlayerRuntime();world.step();try{for(let i=0;i<360;i++){runtime.velocity.x=-Math.sin(m.yaw)*1.7;runtime.velocity.z=-Math.cos(m.yaw)*1.7;stepCharacter(body,collider,controller,runtime,1/60,playerConfig,-9.81,RAPIER.QueryFilterFlags.EXCLUDE_SENSORS);world.step();}const p=body.translation();assert.ok(p.y>2.9,`stairs stopped at ${JSON.stringify(p)}`);assert.ok(p.y<3.2);}finally{world.free();}
 const school=all.find(m=>m.id==="edge:khauma-north-flank:1158762014");for(const part of partitionArchitecturalParts(school).filter(p=>/guardian|wall/.test(p.id)))assert.ok(part.colliderCount>0,part.id);
});
test("raised veranda access rises toward its platform, with actual collision traversal",()=>{
 const m=all.find(m=>m.id==="entrance:khauma-raised-veranda"),w=new RAPIER.World({x:0,y:-9.81,z:0});w.createCollider(RAPIER.ColliderDesc.cuboid(170,.25,170).setTranslation(-40,-.25,0));for(const c of m.colliders)w.createCollider(RAPIER.ColliderDesc.cuboid(...c.size.map(v=>v/2)).setTranslation(...c.position).setRotation({x:0,y:Math.sin(c.yaw/2),z:0,w:Math.cos(c.yaw/2)}));const body=w.createRigidBody(RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(m.origin[0]+.5,.925,m.origin[1]-6)),col=w.createCollider(RAPIER.ColliderDesc.capsule(playerConfig.capsuleHalfSegment,playerConfig.radius),body),controller=createCharacterController(w,playerConfig),rt=createPlayerRuntime();w.step();try{for(let i=0;i<240;i++){rt.velocity.z=1.6;stepCharacter(body,col,controller,rt,1/60,playerConfig,-9.81,RAPIER.QueryFilterFlags.EXCLUDE_SENSORS);w.step();}assert.ok(body.translation().y>1.9,`veranda platform reachable ${JSON.stringify(body.translation())}`);}finally{w.free();}
});
import polygonClipping from "polygon-clipping";
import snapshot from "../src/data/reconstruction/urban-footprints.json" with {type:"json"};
import {geographicToLocal} from "../src/data/reconstruction/geographic-frame.ts";
test("photo-inferred arcade bodies and roof projections preserve all three mapped palace court voids",()=>{
 const m=edge.models.find(m=>m.id==="context:9c:1159393578"),roofs=m.roofs.map(r=>{const corners=[[-r.width/2,-r.depth/2],[r.width/2,-r.depth/2],[r.width/2,r.depth/2],[-r.width/2,r.depth/2],[-r.width/2,-r.depth/2]];return [corners.map(([x,z])=>[r.position[0]+x*Math.cos(r.yaw)+z*Math.sin(r.yaw),r.position[2]-x*Math.sin(r.yaw)+z*Math.cos(r.yaw)])];});
 for(const hole of snapshot.features.find(f=>f.id==="18962138").rings.slice(1)){const ring=hole.map(([latitude,longitude])=>geographicToLocal({latitude,longitude}));for(const rings of [...m.volumes.map(v=>v.rings),...roofs])assert.equal(polygonClipping.intersection(rings,[ring]).length,0);}
});