import assert from "node:assert/strict";
import {test} from "node:test";
import {createHash} from "node:crypto";
import {createRequire} from "node:module";
import polygonClipping from "polygon-clipping";
import {KHAUMA_GATE_VIEW_AXIS,monumentPositionAudit,sceneIdentityAudit,spatialAuditDecision,spatialCorrections} from "../src/data/reconstruction/khauma-spatial-audit.ts";
import {khaumaAxisReviewSpawns,resolveKhaumaAxisReview,gateViewDirection} from "../src/game/world/khauma-axis-review.ts";
import {buildPhase9a1Models} from "../src/game/architecture/complete-monuments.ts";
import {buildSpatiallyAuditedModels} from "../src/game/architecture/spatially-audited-models.ts";
import {buildSquareEdge,immediateEdgePolygons} from "../src/game/architecture/square-edge-models.ts";
import {buildUrbanOccupancy} from "../src/game/architecture/urban-occupancy.ts";
import {squareEdgeGroups,edgeArchitectureClasses} from "../src/data/reconstruction/square-edge.ts";
import sourceSnapshot from "../src/data/reconstruction/urban-footprints.json" with {type:"json"};
import {geographicToLocal} from "../src/data/reconstruction/geographic-frame.ts";
import {urbanStreetExits} from "../src/data/reconstruction/urban-enclosure.ts";
import {rectangle,streetRectangle} from "../src/game/architecture/urban-model.ts";
import {createCharacterController,stepCharacter} from "../src/game/player/character-physics.ts";
import {createPlayerRuntime} from "../src/game/player/player-runtime.ts";
import {playerConfig} from "../src/game/player/player-config.ts";
const original=buildPhase9a1Models(),models=buildSpatiallyAuditedModels(),urban=buildSquareEdge(models);
const area=r=>Math.abs(r.reduce((s,a,i)=>{const b=r[(i+1)%r.length];return s+a[0]*b[1]-a[1]*b[0]},0)/2),occupied=p=>p.reduce((s,r)=>s+area(r[0])-r.slice(1).reduce((s,h)=>s+area(h),0),0);
test("explicit correction ledger covers all 17 identities; original Phase 6/9 source scene remains intact",()=>{
 assert.equal(monumentPositionAudit.length,17);for(const r of monumentPositionAudit){const old=original.find(m=>m.id===r.id);assert.deepEqual(r.baselineCoordinate,old.origin);const active=models.find(m=>m.id===r.id);if(!r.rendered){assert.equal(r.id,"jagannath");assert.ok(!active);continue;}assert.deepEqual(r.currentCoordinate,active.origin);assert.ok(Math.abs(r.currentYaw-active.yaw)<.0001);assert.equal(r.correctionApplied,!!spatialCorrections[r.id]);}
 const hash=x=>createHash("sha256").update(JSON.stringify(x)).digest("hex");assert.equal(hash(original),"367f932f10d79a3a6648c0636eb4a28e668a981bf9b47e3e9d84ff280a338ef3");assert.equal(hash(buildUrbanOccupancy()),"c3188ec807b56b9525be2205995ed91e93765a03de68809e613c059588cc8c98");assert.equal(spatialAuditDecision.globalTransformChanged,false);
});
test("stronger mapped/aerial/photo evidence corrects gate without photo-coordinate extraction",()=>{
 const a=KHAUMA_GATE_VIEW_AXIS;assert.equal(a.status,"FROZEN_CONFLICT_CORRECTED");assert.ok(a.displacementMetres>13&&a.displacementMetres<14);assert.ok(a.proposedInboundBearingDegrees>97&&a.proposedInboundBearingDegrees<99);assert.equal(a.correctionApplied,true);assert.ok(a.sources.includes("userGatePhotos"));assert.notDeepEqual(a.proposedGeographic,{latitude:27.672301,longitude:85.427366});
});
test("Yaksheshwar and every supported non-gate monument assembly are preserved under documented rigid placement corrections",()=>{
 for(const m of models){if(m.id==="khauma-gate")continue;const old=original.find(o=>o.id===m.id);if(!spatialCorrections[m.id]){assert.deepEqual(m,old);continue;}for(const kind of ["boxes","shapes","profiles","roofs","colliders"]){const accepted=m.id==="gallery-frontage"?m[kind].filter(p=>!p.role?.startsWith("gallery-west-return-photo-")):m[kind];assert.equal(accepted.length,old[kind].length);for(let i=0;i<accepted.length;i++){const a=accepted[i],b=old[kind][i];assert.equal(a.position[1],b.position[1]);for(const key of ["size","points","profile","width","depth","rise","role","tilt"])assert.deepEqual(a[key],b[key]);}}}
 assert.equal(models.find(m=>m.id==="yaksheshwar").roofs.length,4);
});
test("unsupported duplicate Jagannath is removed; neither Nyatapola nor exposed Taleju is instantiated",()=>{
 assert.ok(!models.some(m=>/jagannath|nyatapola|taleju-temple/i.test(m.id)));assert.equal(sceneIdentityAudit.nyatapola.rendered,false);assert.equal(sceneIdentityAudit.taleju.standaloneTempleRendered,false);for(const id of sceneIdentityAudit.taleju.represented)assert.ok([...models,...urban.models].some(m=>m.id===id));assert.equal(sceneIdentityAudit.tallest.id,"silu-mahadev");assert.ok(models.some(m=>m.id==="gopinath-krishna"));
});
test("near architecture needs independent form evidence; distant footprint-only context has no invented roof or black windows",()=>{
 for(const g of squareEdgeGroups){assert.ok(edgeArchitectureClasses.includes(g.classification));assert.ok(g.sources.length>=2);assert.ok(g.observation&&g.unresolved);}
 for(const b of urban.buildings){assert.ok(edgeArchitectureClasses.includes(b.classification));assert.notEqual(b.dimensionClassification,"VERIFIED");if(b.classification!=="FOOTPRINT_ONLY_CONTEXT")continue;const m=urban.models.find(m=>m.id===b.id);assert.equal(b.levels,null);assert.equal(m.boxes.length+m.roofs.length+m.polygonRoofs.length+m.shapes.length+m.profiles.length,0);for(const p of b.footprints)for(const region of immediateEdgePolygons)assert.ok(occupied(polygonClipping.intersection(p,region))<.01);}
 assert.deepEqual(urban,buildSquareEdge(models));
});
test("all five exits and entry corridor avoid added colliders; actual inn has open arched lower bays",()=>{
 for(const e of urbanStreetExits)for(const m of urban.models)for(const c of m.colliders)assert.ok(occupied(polygonClipping.intersection([streetRectangle(e.from,e.to,e.width)],[rectangle([c.position[0],c.position[2]],c.size[0],c.size[2],c.yaw)]))<1e-6,`${m.id} blocks ${e.id}`);
 const inn=urban.models.find(m=>m.id.startsWith("edge:yetachapari:"));assert.ok(inn.shapes.some(s=>s.role==="yetachapari-photo-open-arched-head"));assert.ok(inn.boxes.some(b=>b.role==="yetachapari-open-bay-post"));assert.equal(squareEdgeGroups.find(g=>g.id==="yetachapari").storeys,2);
});
test("seven requested development reviews retain aerial exposure and photographic gate-to-square direction",()=>{
 for(const id of [...Object.keys(khaumaAxisReviewSpawns),"yaksheshwar-complete"]){assert.equal(resolveKhaumaAxisReview(id,true),id);assert.equal(resolveKhaumaAxisReview(id,false),null);}
 for(const id of ["khauma-real-axis-outside","khauma-real-axis-inside"]){const s=khaumaAxisReviewSpawns[id];assert.ok(-Math.sin(s.rotation[1])*gateViewDirection[0]-Math.cos(s.rotation[1])*gateViewDirection[1]>.9999);}
 assert.equal(resolveKhaumaAxisReview("west-urban-aerial",true),"west-urban-aerial");assert.ok(khaumaAxisReviewSpawns["square-edge-aerial"].position[1]>=20);
});
const RAP=createRequire(import.meta.url)("@dimforge/rapier3d-compat");await RAP.init();
test("actual corrected scene permits all five complete exits, gate crossing and blocks gate pier",()=>{
 const w=new RAP.World({x:0,y:-9.81,z:0});w.createCollider(RAP.ColliderDesc.cuboid(170,.25,170).setTranslation(-40,-.25,0));for(const c of [...models,...urban.models].flatMap(m=>m.colliders))w.createCollider(RAP.ColliderDesc.cuboid(...c.size.map(v=>v/2)).setTranslation(...c.position).setRotation({x:0,y:Math.sin(c.yaw/2),z:0,w:Math.cos(c.yaw/2)}));
 const cross=(a,b)=>{const dx=b[0]-a[0],dz=b[1]-a[1],length=Math.hypot(dx,dz),body=w.createRigidBody(RAP.RigidBodyDesc.kinematicPositionBased().setTranslation(a[0],.925,a[1])),collider=w.createCollider(RAP.ColliderDesc.capsule(playerConfig.capsuleHalfSegment,playerConfig.radius),body),controller=createCharacterController(w,playerConfig),runtime=createPlayerRuntime();w.step();for(let i=0;i<Math.ceil(length/2.3*60)+30;i++){runtime.velocity.x=dx/length*2.3;runtime.velocity.z=dz/length*2.3;stepCharacter(body,collider,controller,runtime,1/60,playerConfig,-9.81,RAP.QueryFilterFlags.EXCLUDE_SENSORS);w.step();}const p=body.translation(),progress=((p.x-a[0])*dx+(p.z-a[1])*dz)/length;w.removeCharacterController(controller);w.removeRigidBody(body);return {progress,length};};
 try{for(const e of urbanStreetExits){const r=cross(e.from,e.to);assert.ok(r.progress>=r.length-.3,`${e.id} blocked ${r.progress}/${r.length}`);}const p=sourceSnapshot.streets.find(s=>s.id==="85465819").coordinates.map(([latitude,longitude])=>geographicToLocal({latitude,longitude}));for(let i=0;i<p.length-1;i++){const r=cross(p[i],p[i+1]);assert.ok(r.progress>=r.length-.4,`mapped public segment ${i} blocked ${r.progress}/${r.length}`);}const g=models.find(m=>m.id==="khauma-gate"),d=[-Math.sin(g.yaw),-Math.cos(g.yaw)],offset=[Math.cos(g.yaw)*3.3,-Math.sin(g.yaw)*3.3],line=(o)=>[[-6,6].map(t=>[g.origin[0]+o[0]+d[0]*t,g.origin[1]+o[1]+d[1]*t])][0],open=cross(...line([0,0])),pier=cross(...line(offset));assert.ok(open.progress>11.7);assert.ok(pier.progress<6,"pier must block");}finally{w.free();}
});
