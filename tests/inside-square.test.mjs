import assert from "node:assert/strict";
import {test} from "node:test";
import {createRequire} from "node:module";
import {readFile} from "node:fs/promises";
import {buildInsideSquareModels,buildInsideSquareEdge} from "../src/game/architecture/inside-square-models.ts";
import {buildSpatiallyAuditedModels} from "../src/game/architecture/spatially-audited-models.ts";
import {buildSquareEdge} from "../src/game/architecture/square-edge-models.ts";
import {partitionArchitecturalParts} from "../src/features/world-editor/parts.ts";
import {getEditableRegistry,getEditableParts} from "../src/features/world-editor/registry.ts";
import {insideSquareReviews,insideSquareReviewSpawn} from "../src/game/world/inside-square-review.ts";
import {resolveKhaumaAxisReview,khaumaPhotoCamera,isSpatialAerialReview} from "../src/game/world/khauma-axis-review.ts";
import {insideSquarePavingTexture,goldenSweptCanopy} from "../src/game/architecture/inside-square-surfaces.ts";
import sourceSnapshot from "../src/data/reconstruction/urban-footprints.json" with {type:"json"};
import {geographicToLocal} from "../src/data/reconstruction/geographic-frame.ts";
import {urbanStreetExits} from "../src/data/reconstruction/urban-enclosure.ts";
import {createCharacterController,stepCharacter} from "../src/game/player/character-physics.ts";
import {createPlayerRuntime} from "../src/game/player/player-runtime.ts";
import {playerConfig} from "../src/game/player/player-config.ts";
const savedBefore=await readFile("src/features/bhaktapur/data/manual-transform-overrides.json","utf8");
const old=buildSpatiallyAuditedModels(),models=buildInsideSquareModels(),urban=buildInsideSquareEdge();
test("Phase 9B preserves every established assembly transform, approved entrance and distant source geometry",()=>{
 for(const m of old){const current=models.find(n=>n.id===m.id);assert.deepEqual(current.origin,m.origin,m.id);assert.equal(current.yaw,m.yaw,m.id);}
 assert.deepEqual(models.find(m=>m.id==="khauma-gate"),old.find(m=>m.id==="khauma-gate"));
 const before=buildSquareEdge();for(const m of before.models.filter(m=>m.id.startsWith("entrance:")||m.id.startsWith("distant:")))assert.deepEqual(urban.models.find(n=>n.id===m.id),m);
 const gallery=old.find(m=>m.id==="gallery-frontage"),now=models.find(m=>m.id===gallery.id);for(const kind of ["boxes","shapes","profiles","roofs"])assert.deepEqual(now[kind].filter(p=>p.role.startsWith("gallery-west-return-photo-")),gallery[kind].filter(p=>p.role.startsWith("gallery-west-return-photo-")));
 assert.deepEqual(models,buildInsideSquareModels());assert.deepEqual(urban,buildInsideSquareEdge());
});
test("all existing V2 part identities and local source frames survive geometry refinements",async()=>{
 const previous=[...old,...buildSquareEdge().models],current=[...models,...urban.models],registry=getEditableRegistry(),parts=getEditableParts();
 for(const m of previous.filter(m=>registry.some(r=>r.id===m.id))){const newer=partitionArchitecturalParts(current.find(n=>n.id===m.id));for(const p of partitionArchitecturalParts(m))assert.deepEqual(newer.find(n=>n.id===p.id)?.source,p.source,p.id);}
 assert.equal(parts.length,133);assert.equal(registry.length,34);assert.equal(parts.filter(p=>p.parentId==="palace-corner-shrine-unresolved").length,5);
 assert.equal(await readFile("src/features/bhaktapur/data/manual-transform-overrides.json","utf8"),savedBefore);
 for(const m of current){const groups=partitionArchitecturalParts(m);for(const key of ["boxes","shapes","profiles","roofs","colliders","volumes","polygonRoofs"])assert.equal(groups.flatMap(p=>p.model[key]??[]).length,(m[key]??[]).length,m.id+key);}
});
test("identity guards and honest unresolved context; real open space is not filled",()=>{
 assert.ok(!models.some(m=>/jagannath|nyatapola|taleju-temple/i.test(m.id)));
 assert.deepEqual(models.find(m=>m.id==="rameshwar"),old.find(m=>m.id==="rameshwar"));
 const shrine=models.find(m=>m.id==="palace-corner-shrine-unresolved");assert.equal(shrine.accuracy,"PHOTO_INFERRED");assert.equal(shrine.anchorId,"PHOTO_RELATIVE_PALACE_CORNER");
 const downgraded=urban.buildings.filter(b=>b.classification==="FOOTPRINT_ONLY_CONTEXT"&&!b.id.startsWith("distant:"));assert.equal(downgraded.length,6);
 for(const b of downgraded){const m=urban.models.find(m=>m.id===b.id);assert.equal(b.identity,null);assert.equal(b.levels,null);assert.equal(m.boxes.length+m.roofs.length+m.shapes.length+m.profiles.length+m.polygonRoofs.length,0);assert.ok(m.volumes.every(v=>v.height===3.2&&v.material==="neutral"));}
 assert.equal(models.length,old.length+1);
});
test("all ten useful review cameras resolve only in development, aerial exposes 35m view",()=>{
 assert.equal(Object.keys(insideSquareReviews).length,10);for(const id of Object.keys(insideSquareReviews)){assert.equal(resolveKhaumaAxisReview(id,true),id);assert.equal(resolveKhaumaAxisReview(id,false),null);const p=khaumaPhotoCamera(id);assert.ok(p.position.every(Number.isFinite));assert.ok(insideSquareReviewSpawn(id));assert.ok(p.fov>=40&&p.fov<=70);}
 assert.equal(isSpatialAerialReview("9b-aerial"),true);assert.equal(khaumaPhotoCamera("9b-aerial").height,35);
});
test("paving is deterministic at existing allocation size and swept canopy is finite/concave",()=>{
 const a=insideSquarePavingTexture(),b=insideSquarePavingTexture();assert.equal(a.image.width,256);assert.deepEqual(a.image.data,b.image.data);a.dispose();b.dispose();
 const roof=models.find(m=>m.id==="golden-gate").roofs.find(r=>r.role==="phase9b-golden-gate-swept-canopy"),g=goldenSweptCanopy(roof);assert.ok([...g.attributes.position.array].every(Number.isFinite));assert.ok(g.attributes.position.count<3000);
 const local=g.clone().translate(-roof.position[0],-roof.position[1],-roof.position[2]).rotateY(-roof.yaw),pos=local.attributes.position;
 const front=[];for(let i=0;i<pos.count;i++)if(Math.abs(pos.getZ(i)-roof.depth/2)<.0001)front.push([pos.getX(i),pos.getY(i)]);
 assert.ok(Math.max(...front.filter(([x])=>Math.abs(x)>roof.width*.49).map(([,y])=>y))>Math.max(...front.filter(([x])=>Math.abs(x)<.01).map(([,y])=>y))+.3);local.dispose();g.dispose();
});
const RAP=createRequire(import.meta.url)("@dimforge/rapier3d-compat");await RAP.init();
test("Phase 9B rendered scene permits all five complete exits, gate crossing and blocks gate pier",()=>{
 const w=new RAP.World({x:0,y:-9.81,z:0});w.createCollider(RAP.ColliderDesc.cuboid(170,.25,170).setTranslation(-40,-.25,0));for(const c of [...models,...urban.models].flatMap(m=>m.colliders))w.createCollider(RAP.ColliderDesc.cuboid(...c.size.map(v=>v/2)).setTranslation(...c.position).setRotation({x:0,y:Math.sin(c.yaw/2),z:0,w:Math.cos(c.yaw/2)}));
 const cross=(a,b)=>{const dx=b[0]-a[0],dz=b[1]-a[1],length=Math.hypot(dx,dz),body=w.createRigidBody(RAP.RigidBodyDesc.kinematicPositionBased().setTranslation(a[0],.925,a[1])),collider=w.createCollider(RAP.ColliderDesc.capsule(playerConfig.capsuleHalfSegment,playerConfig.radius),body),controller=createCharacterController(w,playerConfig),runtime=createPlayerRuntime();w.step();for(let i=0;i<Math.ceil(length/2.3*60)+30;i++){runtime.velocity.x=dx/length*2.3;runtime.velocity.z=dz/length*2.3;stepCharacter(body,collider,controller,runtime,1/60,playerConfig,-9.81,RAP.QueryFilterFlags.EXCLUDE_SENSORS);w.step();}const p=body.translation(),progress=((p.x-a[0])*dx+(p.z-a[1])*dz)/length;w.removeCharacterController(controller);w.removeRigidBody(body);return {progress,length};};
 try{for(const e of urbanStreetExits){const r=cross(e.from,e.to);assert.ok(r.progress>=r.length-.3,`${e.id} blocked ${r.progress}/${r.length}`);}const p=sourceSnapshot.streets.find(s=>s.id==="85465819").coordinates.map(([latitude,longitude])=>geographicToLocal({latitude,longitude}));for(let i=0;i<p.length-1;i++){const r=cross(p[i],p[i+1]);assert.ok(r.progress>=r.length-.4,`mapped public segment ${i} blocked ${r.progress}/${r.length}`);}const g=models.find(m=>m.id==="khauma-gate"),d=[-Math.sin(g.yaw),-Math.cos(g.yaw)],offset=[Math.cos(g.yaw)*3.3,-Math.sin(g.yaw)*3.3],line=(o)=>[[-6,6].map(t=>[g.origin[0]+o[0]+d[0]*t,g.origin[1]+o[1]+d[1]*t])][0],open=cross(...line([0,0])),pier=cross(...line(offset));assert.ok(open.progress>11.7);assert.ok(pier.progress<6,"pier must block");}finally{w.free();}
});


test("new palace treads climb to the existing ledge with matching colliders",()=>{
 const m=models.find(m=>m.id==="gallery-frontage"),w=new RAP.World({x:0,y:-9.81,z:0});w.createCollider(RAP.ColliderDesc.cuboid(170,.25,170).setTranslation(-40,-.25,0));
 for(const c of m.colliders)w.createCollider(RAP.ColliderDesc.cuboid(...c.size.map(v=>v/2)).setTranslation(...c.position).setRotation({x:0,y:Math.sin(c.yaw/2),z:0,w:Math.cos(c.yaw/2)}));
 const local=(x,z)=>[m.origin[0]+x*Math.cos(m.yaw)+z*Math.sin(m.yaw),m.origin[1]-x*Math.sin(m.yaw)+z*Math.cos(m.yaw)],p=local(0,2.1),body=w.createRigidBody(RAP.RigidBodyDesc.kinematicPositionBased().setTranslation(p[0],.925,p[1])),collider=w.createCollider(RAP.ColliderDesc.capsule(playerConfig.capsuleHalfSegment,playerConfig.radius),body),controller=createCharacterController(w,playerConfig),runtime=createPlayerRuntime();let peak=0;
 try{w.step();for(let i=0;i<180;i++){runtime.velocity.x=-Math.sin(m.yaw)*2.3;runtime.velocity.z=-Math.cos(m.yaw)*2.3;stepCharacter(body,collider,controller,runtime,1/60,playerConfig,-9.81,RAP.QueryFilterFlags.EXCLUDE_SENSORS);w.step();peak=Math.max(peak,body.translation().y);}assert.ok(peak>1.27,`palace step height ${peak}`);assert.ok(runtime.grounded);assert.ok(body.translation().y>1.27);}finally{w.free();}
});
