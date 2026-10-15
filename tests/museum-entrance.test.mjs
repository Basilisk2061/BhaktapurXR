import assert from "node:assert/strict";
import {test} from "node:test";
import RAPIER from "@dimforge/rapier3d-compat";
import {buildPalaceFrontageModels} from "../src/game/architecture/palace-frontage-models.ts";
import {museumEntrance,museumEntranceCentre} from "../src/game/architecture/museum-entrance.ts";
import {museumSculptureGeometry} from "../src/game/architecture/museum-sculptures.ts";
import {partitionArchitecturalParts} from "../src/features/world-editor/parts.ts";
import {getEditableParts} from "../src/features/world-editor/registry.ts";
import {resolveKhaumaAxisReview,khaumaPhotoCamera} from "../src/game/world/khauma-axis-review.ts";
import {createCharacterController,stepCharacter} from "../src/game/player/character-physics.ts";
import {createPlayerRuntime} from "../src/game/player/player-runtime.ts";
import {playerConfig} from "../src/game/player/player-config.ts";
const models=buildPalaceFrontageModels(),m=models.find(m=>m.id==="gallery-frontage"),x=museumEntranceCentre(m);
test("museum entrance stays on red section with four grouped editable components",()=>{
 assert.equal(museumEntrance.classification,"PHOTO_INFERRED");assert.deepEqual(museumEntrance.signLines,["राष्ट्रिय कला संग्रहालय","NATIONAL ART MUSEUM"]);
 assert.ok(x+3.7<m.boxes.find(b=>b.role==="palace-foundation").size[0]*(.5-.38));
 const parts=partitionArchitecturalParts(m);for(const key of museumEntrance.partKeys){assert.ok(parts.find(p=>p.id==="gallery-frontage/"+key));assert.ok(getEditableParts().find(p=>p.id==="gallery-frontage/"+key));}
 for(const kind of ["boxes","profiles","shapes","colliders"])assert.equal(parts.flatMap(p=>p.model[kind]).length,m[kind].length);
 assert.equal(m.profiles.filter(p=>p.role==="museum-entrance-lions-head").length,2);assert.equal(m.profiles.filter(p=>p.role==="museum-entrance-lions-leg").length,8);assert.equal(m.profiles.filter(p=>p.role==="museum-entrance-figures-central-figure").length,2);
 assert.equal(m.boxes.filter(b=>b.material==="museumSign").length,1);assert.ok(!m.profiles.some(p=>p.role==="gallery-guardian"));assert.deepEqual(buildPalaceFrontageModels(),models);
 const sign=m.boxes.find(b=>b.role==="museum-entrance-sign-board"),window=m.boxes.find(b=>b.role==="museum-entrance-door-window-recess");assert.ok(sign.position[1]-sign.size[1]/2>window.position[1]+window.size[1]/2);
 assert.equal(m.boxes.filter(b=>b.role==="museum-entrance-door-pale-column").length,2);const mouths=m.profiles.filter(p=>p.role==="museum-entrance-lions-open-mouth");assert.equal(mouths.length,2);for(const p of mouths){const z=p.sculptedSurface.positions.filter((_,i)=>i%3===2);assert.ok(Math.max(...z)-Math.min(...z)>.3,"mouth must have modeled cavity depth");}
});
test("exactly one new museum review resolves only in development",()=>{
 assert.equal(resolveKhaumaAxisReview("9b2-museum-entrance",true),"9b2-museum-entrance");assert.equal(resolveKhaumaAxisReview("9b2-museum-entrance",false),null);assert.ok(khaumaPhotoCamera("9b2-museum-entrance").position.every(Number.isFinite));
});
test("custom carved surfaces are finite, indexed correctly and remain in the four sculpture groups",()=>{
 const sculptures=m.profiles.filter(p=>p.sculptedSurface);assert.ok(sculptures.length>0);
 for(const p of sculptures){assert.match(p.role,/^museum-entrance-(lions|figures)-/);const s=p.sculptedSurface;assert.equal(s.positions.length%3,0);assert.equal(s.indices.length%3,0);assert.ok(s.positions.every(Number.isFinite));assert.ok(s.indices.every(i=>Number.isInteger(i)&&i>=0&&i<s.positions.length/3));const g=museumSculptureGeometry(p);assert.ok(Array.from(g.getAttribute("normal").array).every(Number.isFinite));g.dispose();}
 for(const role of ["layered-mane","large-fang","necklace","toe"])assert.ok([...m.profiles,...m.shapes].some(p=>p.role==="museum-entrance-lions-"+role));
 for(const role of ["upper-arm","lower-arm","lower-reclining-body","pointed-border"])assert.ok(m.profiles.some(p=>p.role==="museum-entrance-figures-"+role));
 assert.equal(resolveKhaumaAxisReview("9b2-museum-sculptures-close",true),"9b2-museum-sculptures-close");assert.equal(resolveKhaumaAxisReview("9b2-museum-sculptures-close",false),null);
});
await RAPIER.init();
test("museum doorway and shallow threshold are traversable while lion masses collide",()=>{
 const w=new RAPIER.World({x:0,y:-9.81,z:0}),point=(a,y,z)=>({x:m.origin[0]+a*Math.cos(m.yaw)+z*Math.sin(m.yaw),y,z:m.origin[1]-a*Math.sin(m.yaw)+z*Math.cos(m.yaw)});
 w.createCollider(RAPIER.ColliderDesc.cuboid(170,.25,170).setTranslation(-40,-.25,0));for(const c of m.colliders)w.createCollider(RAPIER.ColliderDesc.cuboid(...c.size.map(v=>v/2)).setTranslation(...c.position).setRotation({x:0,y:Math.sin(c.yaw/2),z:0,w:Math.cos(c.yaw/2)}));
 const walk=(a)=>{const start=point(a,.925,4),body=w.createRigidBody(RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(start.x,start.y,start.z)),c=w.createCollider(RAPIER.ColliderDesc.capsule(playerConfig.capsuleHalfSegment,playerConfig.radius),body),controller=createCharacterController(w,playerConfig),runtime=createPlayerRuntime();w.step();for(let i=0;i<160;i++){runtime.velocity.x=-Math.sin(m.yaw)*2.3;runtime.velocity.z=-Math.cos(m.yaw)*2.3;stepCharacter(body,c,controller,runtime,1/60,playerConfig,-9.81,RAPIER.QueryFilterFlags.EXCLUDE_SENSORS);w.step();}const p=body.translation(),z=(p.x-m.origin[0])*Math.sin(m.yaw)+(p.z-m.origin[1])*Math.cos(m.yaw);w.removeCharacterController(controller);w.removeRigidBody(body);return z;};
 try{assert.ok(walk(x)<-1,"old wall must not block doorway");assert.ok(walk(x+3.08)>1.8,"lion plinth must stop player");}finally{w.free();}
});
