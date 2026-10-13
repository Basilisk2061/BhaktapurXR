import assert from "node:assert/strict";
import {test} from "node:test";
import {createHash} from "node:crypto";
import {readFileSync} from "node:fs";
import {buildSpatiallyAuditedModels} from "../src/game/architecture/spatially-audited-models.ts";
import {buildKhaumaEntranceGate,khaumaGateDimensions} from "../src/game/architecture/khauma-entrance-model.ts";
import {buildSquareEdge} from "../src/game/architecture/square-edge-models.ts";
import {entranceZone,entranceStructureEvidence,entranceRoad} from "../src/data/reconstruction/khauma-entrance.ts";
import {KHAUMA_GATE_VIEW_AXIS} from "../src/data/reconstruction/khauma-spatial-audit.ts";
import {khaumaPhotoCamera,resolveKhaumaAxisReview} from "../src/game/world/khauma-axis-review.ts";
const models=buildSpatiallyAuditedModels(),urban=buildSquareEdge(models);
test("Phase 9A.2 non-gate corrected assemblies are byte-identical, including approved Yaksheshwar",()=>{
 const hash=createHash("sha256").update(JSON.stringify(models.filter(m=>m.id!=="khauma-gate"))).digest("hex");
 assert.equal(hash,"cdc03bebf32de68d8623ecca4546dd4554963efa0811a702b85509ecd42ecc1b");
});
test("photo gate retains audited placement, deep opening, brick relief and three finials deterministically",()=>{
 const m=buildKhaumaEntranceGate();assert.deepEqual(m.origin,KHAUMA_GATE_VIEW_AXIS.proposedCentre);assert.equal(m.yaw,KHAUMA_GATE_VIEW_AXIS.proposedYaw);assert.deepEqual(m,buildKhaumaEntranceGate());assert.equal(m.accuracy,"RECONSTRUCTED_APPROXIMATE");
 assert.ok([...m.boxes,...m.profiles,...m.shapes].every(p=>p.material==="gateBrick"));assert.equal(m.profiles.filter(p=>p.role==="khauma-side-finial").length,2);assert.equal(m.profiles.filter(p=>p.role==="khauma-central-finial").length,1);
 assert.ok(m.shapes.some(p=>p.role==="khauma-pointed-deep-brick-vault"&&p.depth===1.6));assert.ok(m.shapes.some(p=>p.role==="khauma-shallow-arched-niche-ring"));assert.ok(m.boxes.some(p=>p.role==="khauma-recessed-panel-sill"));assert.ok(khaumaGateDimensions.opening>3.2);
});
test("entrance evidence never promotes inferred dimensions; nearby footprint-only masses are excluded",()=>{
 for(const e of entranceStructureEvidence){for(const k of ["sources","footprint","facade","roof","confidence","inferred"])assert.ok(e[k]);assert.notEqual(e.confidence,"VERIFIED");assert.ok(["EVIDENCE_RECONSTRUCTED","PHOTO_DERIVED_CONTEXT"].includes(e.classification));}
 for(const b of urban.buildings.filter(b=>b.classification==="FOOTPRINT_ONLY_CONTEXT"))for(const p of b.footprints)for(const v of p[0])assert.ok(Math.hypot(v[0]-entranceZone.centre[0],v[1]-entranceZone.centre[1])>=entranceZone.radius-.1);
 assert.equal(urban.distantSourceIds.length,380);assert.equal(createHash("sha256").update(JSON.stringify(urban.models.filter(m=>m.id.startsWith("distant:")))).digest("hex"),"6d1e24235292a15a4955dcddb3a2243899de8097b54175bd46004d46cf78bf2f");assert.ok(urban.models.some(m=>m.id==="entrance:khauma-masonry-return"));const road=urban.models.find(m=>m.id==="entrance:khauma-road");assert.equal(road.colliders.length,0);assert.equal(road.boxes[0].size[0],entranceRoad.width);assert.deepEqual(urban,buildSquareEdge(models));
});
test("two approximate photo cameras are finite, development-only and preserve normal controller source",()=>{
 for(const id of ["khauma-photo-outside","khauma-photo-through"]){const p=khaumaPhotoCamera(id);assert.equal(resolveKhaumaAxisReview(id,true),id);assert.equal(resolveKhaumaAxisReview(id,false),null);assert.ok(p.position.every(Number.isFinite));assert.equal(p.height,1.65);assert.ok(p.fov>=35&&p.fov<=65);assert.ok(p.distance>5);}
 assert.equal(khaumaPhotoCamera("ordinary"),null);
 // Normal controller and camera were frozen at the phase base, not copied into a new review path.
 for(const [file,hash] of [["player.tsx","165293a399fac510aa90679ce5fd4289f4b5cbdac5f633c6ee027d0f727ae9d7"],["third-person-camera.tsx","b38c6711834d19360a9f4ee698f6ed9c293766cb76c197784c56d63f1f24ea49"]])assert.equal(createHash("sha256").update(readFileSync(new URL("../src/game/player/"+file,import.meta.url))).digest("hex"),hash);
});
