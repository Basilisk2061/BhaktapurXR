import assert from "node:assert/strict";
import {test} from "node:test";
import {createRequire} from "node:module";
import {createCharacterController,stepCharacter} from "../src/game/player/character-physics.ts";
import {createPlayerRuntime} from "../src/game/player/player-runtime.ts";
import {playerConfig} from "../src/game/player/player-config.ts";
import polygonClipping from "polygon-clipping";
import {buildPhase9Models} from "../src/game/architecture/west-models.ts";
import {buildPhase9a1Models,buildCompleteYaksheshwar} from "../src/game/architecture/complete-monuments.ts";
import {buildUrbanOccupancy,insideUrbanFootprint} from "../src/game/architecture/urban-occupancy.ts";
import {urbanRoofGeometry,urbanVolumeGeometry} from "../src/game/architecture/urban-surface-geometry.ts";
import snapshot from "../src/data/reconstruction/urban-footprints.json" with {type:"json"};
import {urbanStreetExits} from "../src/data/reconstruction/urban-enclosure.ts";
import {urbanCompleteReviewSpawns,resolveUrbanCompleteReview,isUrbanAerialReview} from "../src/game/world/urban-complete-review.ts";
import {westReviewSpawns} from "../src/game/world/west-review.ts";
import {rectangle,streetRectangle} from "../src/game/architecture/urban-model.ts";
import {urbanOccupancyAudit,occupancyClasses,urbanOccupancySources} from "../src/data/reconstruction/urban-occupancy-audit.ts";
const heritage=buildPhase9a1Models(),urban=buildUrbanOccupancy(heritage);
const area=r=>Math.abs(r.reduce((s,a,i)=>{const b=r[(i+1)%r.length];return s+a[0]*b[1]-b[0]*a[1];},0)/2);
const occupied=polys=>polys.reduce((s,r)=>s+area(r[0])-r.slice(1).reduce((s,h)=>s+area(h),0),0);
test("9A.1 preserves every heritage anchor and all correct existing monuments",()=>{
 for(const old of buildPhase9Models()){if(old.id==="khauma-adjoining-fabric")continue;const m=heritage.find(m=>m.id===old.id);assert.deepEqual(m.origin,old.origin);assert.equal(m.yaw,old.yaw);if(!["yaksheshwar","gopinath-krishna","jagannath"].includes(m.id))assert.deepEqual(m,old);}
 assert.deepEqual(heritage,buildPhase9a1Models());
});
test("occupancy comes from individual source polygons and explicit audit, never random frontage rows",()=>{
 assert.ok(urban.buildings.length>300);assert.equal(urban.westPlaceholderIds.length,0);assert.equal(urban.groundPatches.length,0);
 for(const b of urban.buildings){assert.ok(snapshot.features.some(f=>f.id===b.sourceId));assert.equal(b.dimensionClassification,"APPROXIMATE");assert.notEqual(b.classification,"VERIFIED");assert.ok(b.sourceTimestamp);assert.ok(b.footprints.every(p=>p.every(r=>r.every(v=>v.every(Number.isFinite)))));}
 for(const a of urbanOccupancyAudit){assert.ok(occupancyClasses.includes(a.classification));assert.ok(a.sources.every(s=>urbanOccupancySources[s]));}
 assert.ok(urban.sourceConflicts.length>0);assert.deepEqual(urban.buildings,buildUrbanOccupancy(heritage).buildings);
});
test("all three mapped royal courtyards stay unroofed and unfilled",()=>{
 const court=urban.buildings.find(b=>b.sourceId==="18962138");assert.equal(court.footprints[0].length,4);
 for(const hole of court.footprints[0].slice(1)){const centre=hole.slice(0,-1).reduce((s,p)=>[s[0]+p[0]/(hole.length-1),s[1]+p[1]/(hole.length-1)],[0,0]);assert.equal(insideUrbanFootprint(centre,court.footprints[0]),false);}
 const m=urban.models.find(m=>m.id===court.id),roof=m.polygonRoofs[0],g=urbanRoofGeometry(roof),pos=g.getAttribute("position");
 for(let i=0;i<pos.count;i+=3){const p=[(pos.getX(i)+pos.getX(i+1)+pos.getX(i+2))/3,(pos.getZ(i)+pos.getZ(i+1)+pos.getZ(i+2))/3];assert.ok(insideUrbanFootprint(p,roof.rings));}g.dispose();
});
test("five frozen exits remain clear of every added source collider",()=>{
 for(const e of urbanStreetExits){const corridor=[streetRectangle(e.from,e.to,e.width)];for(const m of urban.models)for(const c of m.colliders){const hit=polygonClipping.intersection(corridor,[rectangle([c.position[0],c.position[2]],c.size[0],c.size[2],c.yaw)]);assert.ok(occupied(hit)<1e-6,`${m.id} blocks ${e.id}`);}}
});
test("source adaptation preserves gate approaches and review spawns without moving anchors",()=>{
 const path=[streetRectangle([-123,-38],[-123,1],4.1)];for(const m of urban.models)for(const c of m.colliders)assert.ok(occupied(polygonClipping.intersection(path,[rectangle([c.position[0],c.position[2]],c.size[0],c.size[2],c.yaw)]))<1e-6);
 for(const s of Object.values({...westReviewSpawns,...urbanCompleteReviewSpawns}).filter(s=>s.position[1]<1))for(const b of urban.buildings)assert.ok(!b.footprints.some(p=>insideUrbanFootprint([s.position[0],s.position[2]],p)));
});
test("Yaksheshwar is a complete two-roof temple with enclosure, continuous soffits and attached braces",()=>{
 const m=buildCompleteYaksheshwar();assert.equal(m.roofs.filter(r=>r.family==="PAGODA").length,2);assert.equal(m.roofs.filter(r=>r.family==="SOFFIT").length,2);assert.ok(!m.boxes.some(b=>b.role.includes("hidden-roof-collision")));assert.ok(m.boxes.some(b=>b.role==="yak-complete-enclosed-shrine"));assert.ok(m.boxes.some(b=>b.role==="yak-complete-upper-chamber"));assert.equal(m.boxes.filter(b=>b.role.includes("connected-strut")).length,56);
 for(const b of m.boxes.filter(b=>b.role.includes("connected-strut")))assert.ok(b.tilt>0);
 assert.ok(m.roofs.filter(r=>r.family==="PAGODA")[0].width>m.roofs.filter(r=>r.family==="PAGODA")[1].width);
});
test("mapped geometry is finite and new/retained review routes are development-only",()=>{
 for(const m of urban.models.slice(0,10)){for(const v of m.volumes){const g=urbanVolumeGeometry(v);assert.ok([...g.getAttribute("position").array].every(Number.isFinite));g.dispose();}}
 for(const id of [...Object.keys(westReviewSpawns),...Object.keys(urbanCompleteReviewSpawns)]){assert.equal(resolveUrbanCompleteReview(id,true),id);assert.equal(resolveUrbanCompleteReview(id,false),null);}
 assert.equal(isUrbanAerialReview("west-central-aerial"),true);assert.equal(isUrbanAerialReview("west-street"),false);
});

const RAP=createRequire(import.meta.url)("@dimforge/rapier3d-compat");await RAP.init();
test("actual Rapier traversal crosses every affected exit through the complete source-built city",()=>{
 const w=new RAP.World({x:0,y:-9.81,z:0});w.createCollider(RAP.ColliderDesc.cuboid(170,.25,170).setTranslation(-40,-.25,0));
 for(const c of [...heritage,...urban.models].flatMap(m=>m.colliders))w.createCollider(RAP.ColliderDesc.cuboid(...c.size.map(v=>v/2)).setTranslation(...c.position).setRotation({x:0,y:Math.sin(c.yaw/2),z:0,w:Math.cos(c.yaw/2)}));
 try{for(const e of urbanStreetExits){const dx=e.to[0]-e.from[0],dz=e.to[1]-e.from[1],length=Math.hypot(dx,dz),body=w.createRigidBody(RAP.RigidBodyDesc.kinematicPositionBased().setTranslation(e.from[0],.925,e.from[1])),collider=w.createCollider(RAP.ColliderDesc.capsule(playerConfig.capsuleHalfSegment,playerConfig.radius),body),controller=createCharacterController(w,playerConfig),runtime=createPlayerRuntime();w.step();
  for(let i=0;i<Math.ceil(length/2.3*60)+30;i++){runtime.velocity.x=dx/length*2.3;runtime.velocity.z=dz/length*2.3;stepCharacter(body,collider,controller,runtime,1/60,playerConfig,-9.81,RAP.QueryFilterFlags.EXCLUDE_SENSORS);w.step();}
  const p=body.translation(),progress=((p.x-e.from[0])*dx+(p.z-e.from[1])*dz)/length;assert.ok(progress>=length-.3,`${e.id} blocked at ${progress}/${length}`);w.removeCharacterController(controller);w.removeRigidBody(body);
 }}finally{w.free();}
});
