import test from 'node:test';
import assert from 'node:assert/strict';
import {EditorSession} from '../src/features/world-editor/session.ts';
import {getEditableRegistry} from '../src/features/world-editor/registry.ts';
import {validateScene,primitiveTypes} from '../src/features/world-editor/scene-data.ts';
import {execFileSync} from 'node:child_process';
import {mkdtemp,mkdir,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve,sep} from 'node:path';
import RAPIER from '@dimforge/rapier3d-compat';
import {Quaternion,Euler} from 'three';
import {createPrimitiveGeometries,primitiveHull} from '../src/features/world-editor/primitive-geometry.ts';

const registry=getEditableRegistry(),original=registry[0];
test('Save All preserves legacy overrides exactly and roundtrips primitives, appearance and hidden originals',()=>{
 const overrides={[original.id]:structuredClone(original.source)};
 overrides[original.id].position[0]+=.123456789;
 const before=JSON.stringify(overrides),s=new EditorSession(registry,overrides);
 assert.equal(s.dirty(),false);
 for(const type of primitiveTypes){const id=s.add(type,[4,2,5]);assert.equal(s.state.selectedId,id);assert.equal(s.state.locked[id],false);}
 s.begin(s.state.selectedId);s.editAxis('scale',0,8);s.editAxis('scale',1,3);s.editAxis('scale',2,.4);s.editAxis('rotation',1,.5);s.complete();
 s.appearance(s.state.selectedId,{materialId:'roof',colorOverride:'#aabbcc'});
 s.select(original.id);s.hide();
 const snapshot=s.snapshot(),valid=validateScene(snapshot,new Set(s.baseEntries.map(e=>e.id)));
 assert.equal(JSON.stringify(snapshot.transforms),before);assert.equal(JSON.stringify(overrides),before);
 const loaded=new EditorSession(registry,valid.transforms,valid);
 assert.deepEqual(loaded.snapshot(),snapshot);assert.equal(loaded.dirty(),false);
 assert.deepEqual(loaded.state.hidden,{[original.id]:true});
 loaded.restore(original.id);assert.equal(loaded.dirty(),true);loaded.undo();assert.equal(loaded.state.hidden[original.id],true);loaded.redo();assert.equal(loaded.state.hidden[original.id],undefined);
 s.savedAll(snapshot);assert.equal(s.dirty(),false);
});
test('create, nonuniform transform, appearance, duplicate and delete each undo/redo coherently',()=>{
 const s=new EditorSession(registry),id=s.add('Block',[2,3,4]);
 s.change(id,{position:[2,3,4],rotation:[.1,.2,.3],scale:[8,3,.4]});
 s.appearance(id,{materialId:'timber',colorOverride:'#887766'});s.undo();assert.equal(s.state.createdObjects[0].materialId,'agedBrick');s.redo();
 s.duplicate();const copy=s.state.selectedId;assert.notEqual(copy,id);assert.deepEqual(s.state.transforms[copy].scale,[8,3,.4]);assert.deepEqual(s.state.transforms[copy].position,[3,3,5]);assert.equal(s.state.createdObjects[1].colorOverride,'#887766');
 s.undo();assert.equal(s.state.createdObjects.length,1);s.redo();assert.equal(s.state.createdObjects.length,2);
 s.removeCreated();assert.equal(s.state.createdObjects.length,1);assert.equal(s.ids.has(copy),false);s.undo();assert.equal(s.ids.has(copy),true);s.redo();
 const saved=s.snapshot();assert.ok(!saved.createdObjects.some(o=>o.id===copy));s.savedAll(saved);assert.equal(s.dirty(),false);
});
test('snapshot validation rejects unregistered hides, duplicate IDs and unsupported appearance',()=>{
 const s=new EditorSession(registry);s.add('Cylinder',[0,1,0]);const scene=s.snapshot(),ids=new Set(s.baseEntries.map(e=>e.id));
 for(const change of [v=>v.hiddenObjects.push('player'),v=>v.createdObjects.push(v.createdObjects[0]),v=>v.createdObjects[0].materialId='foreign',v=>v.createdObjects[0].scale[1]=0,v=>v.createdObjects[0].colorOverride='red']){const v=structuredClone(scene);change(v);assert.throws(()=>validateScene(v,ids));}
});
test('atomic full-scene persistence leaves legacy file bytes untouched and reloads hidden state',async()=>{
 const root=await mkdtemp(join(tmpdir(),'bhaktapurxr-scene-'));
 await mkdir(join(root,'src/features/bhaktapur/data'),{recursive:true});
 const legacy=JSON.stringify({[original.id]:original.source},null,3)+'\n';
 await writeFile(join(root,'src/features/bhaktapur/data/manual-transform-overrides.json'),legacy);
 const server=new URL('../src/features/world-editor/server.ts',import.meta.url).href;
 const s=new EditorSession(registry,JSON.parse(legacy));s.add('Block',[2,3,4]);s.select(original.id);s.hide();const scene=s.snapshot();
 const code=`import assert from 'node:assert/strict';import {readFile,readdir} from 'node:fs/promises';const {saveEditorSnapshot,readWorldEditorState,overrideFilePath}=await import(${JSON.stringify(server)});const before=await readFile(overrideFilePath,'utf8');const scene=${JSON.stringify(scene)};await saveEditorSnapshot(scene);assert.deepEqual(await readWorldEditorState(),scene);assert.equal(await readFile(overrideFilePath,'utf8'),before);assert.ok(!(await readdir('src/features/bhaktapur/data')).some(n=>n.endsWith('.tmp')));`;
 try{execFileSync(process.execPath,['--experimental-strip-types','--input-type=module','-e',code],{cwd:root,stdio:'pipe'});}finally{if(!resolve(root).startsWith(resolve(tmpdir())+sep))throw new Error('Unsafe test directory');await rm(root,{recursive:true,force:true});}
});
test('actual Block/Cylinder hulls follow XYZ pose and scale; wall stops a player-sized capsule',async()=>{
 await RAPIER.init();const world=new RAPIER.World({x:0,y:0,z:0}),geometries=createPrimitiveGeometries();
 try{
  const wall=world.createCollider(RAPIER.ColliderDesc.convexHull(primitiveHull(geometries.Block,[8,3,.4])).setTranslation(0,1.5,0));
  const q=new Quaternion().setFromEuler(new Euler(.2,.5,.1));
  world.createCollider(RAPIER.ColliderDesc.convexHull(primitiveHull(geometries.Cylinder,[2,4,1])).setTranslation(10,2,0).setRotation(q));
  const body=world.createRigidBody(RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(0,1,3));
  const player=world.createCollider(RAPIER.ColliderDesc.capsule(.5,.3),body);world.step();
  const controller=world.createCharacterController(.01);controller.computeColliderMovement(player,{x:0,y:0,z:-6});assert.ok(controller.computedMovement().z>-3);
  assert.ok(world.castRay(new RAPIER.Ray({x:10,y:8,z:0},{x:0,y:-1,z:0}),12,true));
  world.removeCollider(wall,true);world.step();controller.computeColliderMovement(player,{x:0,y:0,z:-6});assert.ok(controller.computedMovement().z<-5.9);
 }finally{world.free();Object.values(geometries).forEach(g=>g.dispose());}
});
