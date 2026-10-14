import assert from "node:assert/strict";
import {test} from "node:test";
import {readFileSync} from "node:fs";
import {createHash} from "node:crypto";
import {buildSpatiallyAuditedModels} from "../src/game/architecture/spatially-audited-models.ts";
import {buildSquareEdge} from "../src/game/architecture/square-edge-models.ts";
import {entranceSightlineAudit,entranceSightlineDecision,unresolvedEntranceFootprints} from "../src/data/reconstruction/khauma-sightline.ts";
import {khaumaPhotoCamera,khaumaAxisReviewSpawns,resolveKhaumaAxisReview,isSpatialAerialReview} from "../src/game/world/khauma-axis-review.ts";
import snapshot from "../src/data/reconstruction/urban-footprints.json" with {type:"json"};
const models=buildSpatiallyAuditedModels(),urban=buildSquareEdge(models),hash=v=>createHash("sha256").update(JSON.stringify(v)).digest("hex");
test("approved Phase 9A.3 gate architecture/coordinates/yaw and entrance roadway remain exact",()=>{
 const gate=models.find(m=>m.id==="khauma-gate");assert.deepEqual(gate.origin,[-121.53684759946469,-34.285908249582874]);assert.equal(gate.yaw,-1.7091704202055626);
 assert.equal(hash(gate),"a54e9155a52963dfab5a18fa3d0fb539dec3772b0f6016d4ef61141cabfb1459");assert.equal(hash(urban.models.find(m=>m.id==="entrance:khauma-road")),"87dca4dc77c1b18734a17b10e92a74e8f8941dbe0bba5b0009226bbdd616c0a7");
});
test("frozen Phase 6C data, correction ledger, gate material, lighting and player/fly/camera source remain unchanged",()=>{
 const files={"src/game/architecture/khauma-entrance-model.ts": "d9d2161691eebec301442697324e81af5321a428f8332c627046b6c128601ea8", "src/game/materials/heritage-materials.ts": "162c7b91bebcd1d5a2c87405a35edc33219303f9156ca9744a3c53af3e613ae5", "src/game/player/player.tsx": "9859bf3046a92c1540c41de37c7e723f3a9426100fa062026bb4e53ee83584fb", "src/game/player/third-person-camera.tsx": "b967a1f4ac7c99c62dd32c1cc299ca605e87bf8154ac657849eaed39d11a634a", "src/game/input/player-input.ts": "a29738400672a39e37e9a8401c3e438c163d928f0bc5c5cb8d1be331bdabebe9", "src/game/world/environment.tsx": "cc3477faf119e62df946da334c372ce55cfae46d422086d334350b6a583db3d0", "src/data/reconstruction/central-forecourt.ts": "4d9c92916781ca5e8baafdcbebaef3b3216df33faa077d70ec7ac18a08ed6bb6", "src/data/reconstruction/geographic-frame.ts": "0eba93f71968b7bec5518b24ea80daccc53e09f6a111d275da2db06a19a2fa9e", "src/data/reconstruction/present-day.ts": "677d27229f2bb72006423b8d691e2787cd8462c2cb2b8999388635659afc15c5", "src/data/reconstruction/geospatial-anchors.ts": "2344b2182d5d3162ac117a7fe71544b05d013de5e89ad14c44749930435deef3", "src/data/reconstruction/open-spaces.ts": "b2e28e1699b07bf530e87a1cc736ec1638f7e454c54a9584bbff5e80a210d7be", "src/data/reconstruction/khauma-spatial-audit.ts": "7966e121c9568a663c4308d265588caf84a2a7a832273d1f00d1d6166ecaadc0"};
 for(const [file,digest] of Object.entries(files))assert.equal(createHash("sha256").update(readFileSync(new URL("../"+file,import.meta.url),"utf8").replaceAll("\r\n","\n")).digest("hex"),digest,file);
 // Foundation parameters/shaders remain frozen. Normalize only the type-only return annotation naming the original foundation keys.
 const source=readFileSync(new URL("../src/game/architecture/central-environment.tsx",import.meta.url),"utf8").replaceAll("\r\n","\n"),materialSource=source.slice(source.indexOf("export const centralMaterialDefinitions"),source.indexOf("function profileGeometry")).replace("Record<keyof typeof centralMaterialDefinitions,MeshStandardMaterial>","Record<CentralMaterial,MeshStandardMaterial>");assert.equal(createHash("sha256").update(materialSource).digest("hex"),"66fccd0d08fa39519aa1be73b224b43264516e65155814ae004c66fea7891b71");
});
test("unsupported pale rectangle / tall return / guessed Police low wing are absent without invented replacements",()=>{
 const returned=urban.models.find(m=>m.id==="entrance:khauma-masonry-return");assert.deepEqual(returned.boxes.map(b=>b.role),["photo-inside-brick-sitting-wall","photo-inside-wall-cap"]);assert.equal(returned.colliders.length,1);
 assert.ok(!urban.models.some(m=>m.id==="edge:palace-west-approach-low-wing:1159393573"));assert.equal(unresolvedEntranceFootprints[0].classification,"UNRESOLVED");assert.ok(snapshot.features.some(f=>f.id==="1159393573"));assert.equal(urban.nearSourceIds.length,16);
 assert.equal(urban.distantSourceIds.length,380);assert.equal(hash(urban.models.filter(m=>m.id.startsWith("distant:"))),"6d1e24235292a15a4955dcddb3a2243899de8097b54175bd46004d46cf78bf2f");assert.deepEqual(urban,buildSquareEdge(models));
});
test("large central block is documented gallery end; only observed western-return details are additive",()=>{
 const g=models.find(m=>m.id==="gallery-frontage"),extra=g.boxes.filter(b=>b.role.startsWith("gallery-west-return-photo-"));assert.equal(extra.filter(b=>b.role.endsWith("window-recess")).length,3);assert.ok(g.shapes.some(s=>s.role==="gallery-west-return-photo-upper-arched-window-head"));assert.ok(extra.every(b=>["timber","stone","recess"].includes(b.material)));assert.ok(extra.every(b=>b.position.every(Number.isFinite)));
 assert.deepEqual(entranceSightlineDecision.monumentsMoved,[]);const old=models.filter(m=>m.id!=="khauma-gate").map(m=>m.id==="gallery-frontage"?({...m,boxes:m.boxes.filter(p=>!p.role.startsWith("gallery-west-return-photo-")),shapes:m.shapes.filter(p=>!p.role.startsWith("gallery-west-return-photo-"))}):m);assert.equal(hash(old),"cdc03bebf32de68d8623ecca4546dd4554963efa0811a702b85509ecd42ecc1b");
});
test("sightline audit keeps uncertain identities provisional and excludes Nyatapola / duplicate Jagannath",()=>{
 const classes=["VERIFIED","RECONSTRUCTED_APPROXIMATE","PHOTO_INFERRED","PROVISIONALLY_IDENTIFIED","FOOTPRINT_ONLY_CONTEXT","UNRESOLVED"];
 for(const r of entranceSightlineAudit){assert.ok(classes.includes(r.confidence));assert.notEqual(r.confidence,"VERIFIED");assert.ok(r.sources.length&&r.identityEvidence&&r.positionEvidence&&r.throughPhoto);assert.ok(["KEEP","CORRECT","REMOVE","REPLACE","UNRESOLVED"].includes(r.decision));}
 for(const id of ["gopinath-krishna","kedarnath","edge:yetachapari:1160027594"])assert.equal(entranceSightlineAudit.find(r=>r.id===id).confidence,"PROVISIONALLY_IDENTIFIED");
 assert.equal(entranceSightlineAudit.find(r=>r.id==="jagannath").decision,"UNRESOLVED");assert.ok(!models.some(m=>/nyatapola|jagannath|taleju-temple/i.test(m.id)));assert.ok(models.some(m=>m.id==="rameshwar"));
});
test("four surgical review routes are development-only; original photo comparison poses remain exact",()=>{
 for(const id of ["khauma-sightline-outside","khauma-sightline-through","khauma-west-sequence","khauma-west-aerial"]){assert.equal(resolveKhaumaAxisReview(id,true),id);assert.equal(resolveKhaumaAxisReview(id,false),null);assert.ok(khaumaAxisReviewSpawns[id].position.every(Number.isFinite));}
 assert.deepEqual(khaumaPhotoCamera("khauma-sightline-outside"),khaumaPhotoCamera("khauma-photo-outside"));assert.deepEqual(khaumaPhotoCamera("khauma-sightline-through"),khaumaPhotoCamera("khauma-photo-through"));
 assert.deepEqual(khaumaPhotoCamera("khauma-photo-outside"),{height:1.65,distance:19,yawOffset:.21836212798457577,pitch:.12,fov:40,referenceAspect:650/432,yaw:-1.7091704202055626,position:[-140.35523745471187,1.65,-36.906633961276036]});
 assert.equal(khaumaPhotoCamera("khauma-photo-through").yaw,-2.0175325481901383);assert.equal(khaumaPhotoCamera("khauma-photo-through").distance,7.5);assert.equal(isSpatialAerialReview("khauma-west-aerial"),true);
});
