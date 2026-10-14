import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {Group,Mesh,Vector3,Matrix4,Quaternion} from "three";
import RAPIER from "@dimforge/rapier3d-compat";
import {getEditableRegistry} from "../src/features/world-editor/registry.ts";
import {EditorSession} from "../src/features/world-editor/session.ts";
import {validateTransform,copyTransform,resolveEditor,resolveEditableParent,transformedCollider,overrideMatrix,transformMatrix} from "../src/features/world-editor/transforms.ts";
import {overrideFilePath} from "../src/features/world-editor/server.ts";
import {runEditorApiFixture} from "./editor-api-fixture.mjs";

const registry=getEditableRegistry(),gold=registry.find(r=>r.id==="golden-gate"),make=()=>{const s=new EditorSession(registry);s.select(gold.id);return s;};
test("dev entry, assembly registry, provenance and child selection exclude player/ground/distant context",()=>{
 assert.equal(resolveEditor("1",true,"BHAKTAPUR"),true);for(const args of [[undefined,true,"BHAKTAPUR"],["1",false,"BHAKTAPUR"],["1",true,"ENGINEERING"]])assert.equal(resolveEditor(...args),false);
 assert.equal(registry.length,34);assert.equal(new Set(registry.map(r=>r.id)).size,34);assert.ok(registry.every(r=>r.defaultLocked));assert.ok(!registry.some(r=>/distant:|ground|road|jagannath|nyatapola/.test(r.id)));
 assert.equal(registry.find(r=>r.id==="gopinath-krishna").classification,"PROVISIONALLY_IDENTIFIED");
 const parent=new Group(),child=new Mesh();parent.userData.editableId=gold.id;parent.add(child);assert.equal(resolveEditableParent(child,new Set(registry.map(r=>r.id))),gold.id);assert.equal(resolveEditableParent(new Mesh(),new Set([gold.id])),null);
});
test("locks, all transform axes, uniform numeric scale and walk/drag input guards",()=>{
 const s=make(),t=copyTransform(gold.source);t.position[1]=2;assert.equal(s.change(gold.id,t),false);assert.equal(s.state.past.length,0);s.setLocked(gold.id,false);assert.equal(s.change(gold.id,t),true);
 s.begin(gold.id);for(let axis=0;axis<3;axis++)s.editAxis("rotation",axis,.1*(axis+1));s.editAxis("scale",0,1.2);s.editAxis("scale",1,.8);s.editAxis("scale",2,1.1);s.complete();assert.deepEqual(s.state.transforms[gold.id].rotation,[.1,.2,.30000000000000004]);assert.deepEqual(s.state.transforms[gold.id].scale,[1.2,.8,1.1]);
 s.update({uniformScale:true});s.begin(gold.id);s.editAxis("scale",1,1.5);s.complete();assert.deepEqual(s.state.transforms[gold.id].scale,[1.5,1.5,1.5]);
 s.update({walk:true});assert.equal(s.begin(gold.id),false);assert.equal(s.preview(gold.id,gold.source),false);s.update({walk:false});s.begin(gold.id,true);s.setLocked(gold.id,true);assert.equal(s.state.locked[gold.id],false);const before=s.state.past.length;s.undo();assert.equal(s.state.past.length,before);s.complete();
});
test("optional snap, completed operation history, fifty-step retention, redo/reset/copy",()=>{
 const s=make();s.setLocked(gold.id,false);assert.equal(s.state.translationSnap,null);assert.equal(s.state.rotationSnap,null);s.update({translationSnap:.25,rotationSnap:5*Math.PI/180});s.begin(gold.id);s.editAxis("position",0,-14.13);s.editAxis("rotation",2,7*Math.PI/180);s.complete();assert.equal(s.state.transforms[gold.id].position[0],-14.25);assert.ok(Math.abs(s.state.transforms[gold.id].rotation[2]-5*Math.PI/180)<1e-10);
 s.begin(gold.id,true);for(let n=0;n<100;n++){const t=copyTransform(s.state.transforms[gold.id]);t.position[1]=n/100;s.preview(gold.id,t);}s.complete();assert.equal(s.state.past.length,2);s.undo();assert.equal(s.state.transforms[gold.id].position[1],0);s.redo();assert.equal(s.state.transforms[gold.id].position[1],.99);
 for(let n=0;n<55;n++){const t=copyTransform(s.state.transforms[gold.id]);t.position[1]=n+1;s.change(gold.id,t);}assert.equal(s.state.past.length,50);s.reset();assert.deepEqual(s.state.transforms[gold.id],gold.source);assert.deepEqual(JSON.parse(s.copy()),gold.source);
});
test("temporary visibility, focus, saved state and invalid transforms never mutate source",()=>{
 const source=JSON.stringify(registry),s=make();s.focus();assert.equal(s.state.focusSequence,1);s.hide();assert.equal(s.state.hidden[gold.id],true);assert.equal(s.state.selectedId,null);s.showAll();assert.deepEqual(s.state.hidden,{});s.select(gold.id);s.setLocked(gold.id,false);
 for(const value of [NaN,Infinity,-Infinity]){const t=copyTransform(gold.source);t.position[1]=value;assert.throws(()=>validateTransform(t));assert.equal(s.preview(gold.id,t),false);}const t=copyTransform(gold.source);t.scale[1]=0;assert.throws(()=>validateTransform(t));assert.throws(()=>validateTransform({...gold.source,path:"C:/anything"}));
 s.markSaved(gold.id,gold.source);assert.equal(s.state.message,"Saved \u2713");assert.equal(JSON.stringify(registry),source);
});
test("exact affine hull and visual matrices agree for XYZ rotation/nonuniform scale; no original collider ghost",async()=>{
 await RAPIER.init();const box={position:[4,2,1],size:[2,3,1],yaw:.7},source={position:[1,0,2],rotation:[0,.4,0],scale:[1,1,1]},current={position:[35,8,-14],rotation:[.2,.6,-.3],scale:[1.3,.7,1.8]};
 const h=transformedCollider(box,source,current),matrix=overrideMatrix(source,current),centre=new Vector3(...box.position).applyMatrix4(matrix);assert.ok(centre.distanceTo(new Vector3(...h.position))<1e-9);
 const piece=new Matrix4().compose(new Vector3(...box.position),new Quaternion().setFromAxisAngle(new Vector3(0,1,0),box.yaw),new Vector3(...box.size));let i=0;
 for(const x of [-.5,.5])for(const y of [-.5,.5])for(const z of [-.5,.5]){const world=new Vector3(x,y,z).applyMatrix4(piece).applyMatrix4(matrix),local=new Vector3(x,y,z).applyMatrix4(piece).applyMatrix4(transformMatrix(source).invert()).applyMatrix4(transformMatrix(current));assert.ok(world.distanceTo(local)<1e-9);assert.ok(world.distanceTo(new Vector3(...h.vertices.slice(i,i+3)).add(centre))<1e-9);i+=3;}
 const physics=new RAPIER.World({x:0,y:0,z:0});const desc=RAPIER.ColliderDesc.convexHull(new Float32Array(h.vertices));assert.ok(desc);physics.createCollider(desc.setTranslation(...h.position));physics.step();assert.ok(physics.castRay(new RAPIER.Ray({x:centre.x,y:centre.y+10,z:centre.z},{x:0,y:-1,z:0}),20,true));assert.equal(physics.castRay(new RAPIER.Ray({x:4,y:20,z:1},{x:0,y:-1,z:0}),25,true),null);physics.free();
});
test("local API validates ids/numbers/paths/origin, assembly+part persistence and production rejection in isolated fixture",async()=>{const original=await readFile(overrideFilePath,"utf8");await runEditorApiFixture();assert.equal(await readFile(overrideFilePath,"utf8"),original);});
