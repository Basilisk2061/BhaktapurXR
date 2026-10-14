import assert from "node:assert/strict";
import {test} from "node:test";
import {createRequire} from "node:module";
import {readFile} from "node:fs/promises";
import {MeshStandardMaterial,DataTexture} from "three";
import {buildPalaceFrontageModels,palaceTruthEvidence,palaceLocalPoint} from "../src/game/architecture/palace-frontage-models.ts";
import {finishPalacePalette} from "../src/game/architecture/palace-palette.ts";
import {buildInsideSquareModels,buildInsideSquareEdge} from "../src/game/architecture/inside-square-models.ts";
import {partitionArchitecturalParts} from "../src/features/world-editor/parts.ts";
import {palaceCorrectionReviews,insideSquareReviews} from "../src/game/world/inside-square-review.ts";
import {resolveKhaumaAxisReview,khaumaPhotoCamera,isSpatialAerialReview} from "../src/game/world/khauma-axis-review.ts";
import sourceSnapshot from "../src/data/reconstruction/urban-footprints.json" with {type:"json"};
import {geographicToLocal} from "../src/data/reconstruction/geographic-frame.ts";
import {urbanStreetExits} from "../src/data/reconstruction/urban-enclosure.ts";
import {createCharacterController,stepCharacter} from "../src/game/player/character-physics.ts";
import {createPlayerRuntime} from "../src/game/player/player-runtime.ts";
import {playerConfig} from "../src/game/player/player-config.ts";
const savedBefore=await readFile("src/features/bhaktapur/data/manual-transform-overrides.json","utf8"),old=buildInsideSquareModels(),models=buildPalaceFrontageModels(),urban=buildInsideSquareEdge(),get=id=>models.find(m=>m.id===id);
test("Old Town / Khauma name reconciliation never conflates the royal Golden Gate or promotes coordinates",()=>{
 const {entrance,royalGate}=palaceTruthEvidence;assert.equal(entrance.sameStructure,true);assert.equal(entrance.classification,"IDENTITY_RECONCILED");assert.equal(entrance.spatialAccuracy,"APPROXIMATE");assert.equal(entrance.royalGate,false);assert.equal(royalGate.royalGate,true);assert.notEqual(entrance.id,royalGate.id);assert.ok(entrance.sources.length>=3);
 assert.ok(get("khauma-gate").origin[0]<get("rameshwar").origin[0]);assert.ok(get("badrinath").origin[0]<get("gopinath-krishna").origin[0]);assert.ok(get("gopinath-krishna").origin[0]<get("kedarnath").origin[0]);assert.ok(get("malla-column").origin[0]<get("vatsala-durga").origin[0]);assert.ok(get("chyasilin").origin[1]<get("vatsala-durga").origin[1]);assert.ok(get("yaksheshwar").origin[1]>get("vatsala-durga").origin[1]);
 assert.ok(!models.some(m=>/nyatapola|jagannath|taleju-temple/i.test(m.id)));assert.deepEqual(get("rameshwar"),old.find(m=>m.id==="rameshwar"));
});
test("palace source frames and every existing local part frame remain compatible without editing saved overrides",async()=>{
 for(const m of old){const n=get(m.id);assert.deepEqual(n.origin,m.origin);assert.equal(n.yaw,m.yaw);for(const part of partitionArchitecturalParts(m))assert.deepEqual(partitionArchitecturalParts(n).find(p=>p.id===part.id)?.source,part.source,part.id);}
 assert.deepEqual(get("khauma-gate"),old.find(m=>m.id==="khauma-gate"));assert.deepEqual(models,buildPalaceFrontageModels());assert.equal(await readFile("src/features/bhaktapur/data/manual-transform-overrides.json","utf8"),savedBefore);
 for(const m of models){const parts=partitionArchitecturalParts(m);for(const key of ["boxes","colliders","profiles","shapes","roofs"])assert.equal(parts.flatMap(p=>p.model[key]).length,m[key].length);}
});
test("new Golden Gate surround meets metal frame and adjoining palace without false open lower arcs",()=>{
 const gate=get("golden-gate"),body=gate.boxes.filter(b=>b.role==="gate-side-masonry-red-body");assert.equal(body.length,2);assert.ok(body.every(b=>b.material==="redMasonry"));
 for(const b of body){const p=palaceLocalPoint(gate,b.position);assert.ok(Math.abs(p[0])-b.size[0]/2<1.28,'red surround reaches nested metal border');}
 const backing=gate.boxes.find(b=>b.role==="gate-brick-upper-palace-backing");assert.ok(backing.position[1]-backing.size[1]/2>=3.3,'palace backing preserves portal headroom');
 const sides=gate.boxes.filter(b=>b.role==="gate-side-masonry-adjoining-palace");assert.ok(sides.every(b=>b.size[0]>=4));assert.ok(gate.boxes.some(b=>b.role==="gate-side-masonry-east-palace-junction"));
 const gallery=get("gallery-frontage");assert.ok(!gallery.shapes.some(p=>p.role==="gallery-arched-opening"||p.role==="gallery-upper-arched-room"));assert.ok(gallery.boxes.some(p=>p.role==="gallery-arcade-lower-continuous-timber-band"));assert.ok(gallery.shapes.some(p=>p.role==="gallery-upper-blind-arched-panel"));
 const roof=gallery.roofs.find(p=>p.role==="palace-main-roof"),paleRoof=gallery.roofs.find(p=>p.role==="palace-main-roof-pale-wing");assert.ok(roof.position[1]>paleRoof.position[1]);
 assert.ok(Math.max(...get("large-bell").colliders.map(c=>c.position[1]+c.size[1]/2))<5,"no legacy high bell roof collider");assert.ok(get("malla-column").profiles.some(p=>p.role==="malla-metal-lotus-capital"&&p.material==="bronze"));
 const shrine=get("palace-corner-shrine-unresolved");assert.ok(shrine.profiles.some(p=>p.role==="corner-shrine-observed-body"&&p.segments===8));assert.equal(shrine.accuracy,"PHOTO_INFERRED");
});
test("palette differentiation reuses maps and preserves instanced UV callback",()=>{
 const map=new DataTexture(),ids=["gateBrick","road","brick","timber","stone","roof","paving","recess","gold","bronze","plaster","neutral","shutter"],materials=Object.fromEntries(ids.map(id=>[id,new MeshStandardMaterial({map})]));
 const previous=materials.brick.onBeforeCompile;finishPalacePalette(materials);assert.equal(Object.keys(materials).length,16);assert.equal(materials.agedBrick.map,map);assert.equal(materials.carvedTimber.map,map);assert.equal(materials.agedBrick.onBeforeCompile,previous);assert.ok(materials.carvedTimber.color.getHSL({}).l<materials.timber.color.getHSL({}).l);assert.ok(materials.paving.color.getHSL({}).l>materials.agedBrick.color.getHSL({}).l);assert.ok(materials.gold.roughness>.5);Object.values(materials).forEach(m=>m.dispose());map.dispose();
});
test("four new comparison cameras and all ten retained reviews work only in development",()=>{
 assert.equal(Object.keys(palaceCorrectionReviews).length,4);for(const id of [...Object.keys(palaceCorrectionReviews),...Object.keys(insideSquareReviews)]){assert.equal(resolveKhaumaAxisReview(id,true),id);assert.equal(resolveKhaumaAxisReview(id,false),null);assert.ok(khaumaPhotoCamera(id).position.every(Number.isFinite));}for(const id of ["9b1-map-west","9b1-plan-aerial"])assert.equal(isSpatialAerialReview(id),true);
});
const RAP=createRequire(import.meta.url)("@dimforge/rapier3d-compat");await RAP.init();
test("Phase 9B.1 rendered scene permits all five complete exits, gate crossing and blocks gate pier",()=>{
 const w=new RAP.World({x:0,y:-9.81,z:0});w.createCollider(RAP.ColliderDesc.cuboid(170,.25,170).setTranslation(-40,-.25,0));for(const c of [...models,...urban.models].flatMap(m=>m.colliders))w.createCollider(RAP.ColliderDesc.cuboid(...c.size.map(v=>v/2)).setTranslation(...c.position).setRotation({x:0,y:Math.sin(c.yaw/2),z:0,w:Math.cos(c.yaw/2)}));
 const cross=(a,b)=>{const dx=b[0]-a[0],dz=b[1]-a[1],length=Math.hypot(dx,dz),body=w.createRigidBody(RAP.RigidBodyDesc.kinematicPositionBased().setTranslation(a[0],.925,a[1])),collider=w.createCollider(RAP.ColliderDesc.capsule(playerConfig.capsuleHalfSegment,playerConfig.radius),body),controller=createCharacterController(w,playerConfig),runtime=createPlayerRuntime();w.step();for(let i=0;i<Math.ceil(length/2.3*60)+30;i++){runtime.velocity.x=dx/length*2.3;runtime.velocity.z=dz/length*2.3;stepCharacter(body,collider,controller,runtime,1/60,playerConfig,-9.81,RAP.QueryFilterFlags.EXCLUDE_SENSORS);w.step();}const p=body.translation(),progress=((p.x-a[0])*dx+(p.z-a[1])*dz)/length;w.removeCharacterController(controller);w.removeRigidBody(body);return {progress,length};};
 try{for(const e of urbanStreetExits){const r=cross(e.from,e.to);assert.ok(r.progress>=r.length-.3,`${e.id} blocked ${r.progress}/${r.length}`);}const p=sourceSnapshot.streets.find(s=>s.id==="85465819").coordinates.map(([latitude,longitude])=>geographicToLocal({latitude,longitude}));for(let i=0;i<p.length-1;i++){const r=cross(p[i],p[i+1]);assert.ok(r.progress>=r.length-.4,`mapped public segment ${i} blocked ${r.progress}/${r.length}`);}const g=models.find(m=>m.id==="khauma-gate"),d=[-Math.sin(g.yaw),-Math.cos(g.yaw)],offset=[Math.cos(g.yaw)*3.3,-Math.sin(g.yaw)*3.3],line=(o)=>[[-6,6].map(t=>[g.origin[0]+o[0]+d[0]*t,g.origin[1]+o[1]+d[1]*t])][0],open=cross(...line([0,0])),pier=cross(...line(offset));assert.ok(open.progress>11.7);assert.ok(pier.progress<6,"pier must block");const royal=get("golden-gate"),portal=z=>[royal.origin[0]+Math.sin(royal.yaw)*z,royal.origin[1]+Math.cos(royal.yaw)*z],door=cross(portal(3),portal(-3));assert.ok(door.progress>5.6,`Golden Gate threshold blocked ${door.progress}`);}finally{w.free();}
});
