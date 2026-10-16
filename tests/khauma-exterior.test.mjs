import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import RAPIER from '@dimforge/rapier3d-compat';
import {buildKhaumaExterior,exteriorPoint,exteriorReplacedIds,khaumaExteriorReviews,exteriorLocal,exteriorFrame,exteriorPlan} from '../src/game/architecture/khauma-exterior.ts';
import {buildCompletedSquareModels,buildCompletedSquareEdge} from '../src/game/architecture/square-completion.ts';
import {getEditableRegistry} from '../src/features/world-editor/registry.ts';
import {partitionArchitecturalParts} from '../src/features/world-editor/parts.ts';
import {partWorldDelta,affineCollider} from '../src/features/world-editor/transforms.ts';
import overrides from '../src/features/bhaktapur/data/manual-transform-overrides.json' with {type:'json'};
import {resolveKhaumaAxisReview} from '../src/game/world/khauma-axis-review.ts';
import {createCharacterController,stepCharacter} from '../src/game/player/character-physics.ts';
import {createPlayerRuntime} from '../src/game/player/player-runtime.ts';
import {arcadeSeatSpans} from '../src/game/player/arcade-sitting.ts';
import {pedestrianGraph} from '../src/game/npcs/navigation.ts';
import {createNpcNavigationProbe} from '../src/game/npcs/physics-navigation.ts';
import {playerConfig} from '../src/game/player/player-config.ts';
const models=buildCompletedSquareModels(),edge=buildCompletedSquareEdge(),exterior=buildKhaumaExterior();
test('exterior leaves every approved monument primitive, source transform and collider unchanged',()=>{
 // Frozen-source regression guards, not image/similarity assertions.
 assert.equal(createHash('sha256').update(JSON.stringify(models)).digest('hex'),'03a247f639c5f2077239c31cafc77a6079af8200f09a9b78a1ddd0fe11bbdacd');
 assert.equal(createHash('sha256').update(JSON.stringify(edge.models.filter(m=>!m.id.startsWith('entrance:KhaumaExterior_')))).digest('hex'),'883f84c6535026240ad0f4e2b9a7914fc4a43e4073e811af561df8479287e247');
});
test('nine deterministic photo-inferred assemblies replace exterior proxies and remain independently editable',()=>{
 assert.deepEqual(buildKhaumaExterior(),exterior);assert.equal(exterior.length,9);
 const registry=getEditableRegistry();for(const m of exterior){assert.equal(m.accuracy,'PHOTO_INFERRED');assert.equal(edge.models.filter(n=>n.id===m.id).length,1);assert(registry.some(e=>e.id===m.id&&e.classification==='PHOTO_INFERRED'));}
 for(const id of exteriorReplacedIds)assert(!edge.models.some(m=>m.id===id));
 for(const [kind,budget]of Object.entries({boxes:627,profiles:248,shapes:15,roofs:6,colliders:67}))assert(exterior.reduce((n,m)=>n+m[kind].length,0)<=budget,kind+' budget');
 for(const [id,c]of Object.entries(khaumaExteriorReviews)){assert.equal(resolveKhaumaAxisReview(id,true),id);assert.equal(resolveKhaumaAxisReview(id,false),null);assert(c.position.every(Number.isFinite));}
});
test('gate stays frozen; immediate left frontage stops and both ranges turn into street depth',()=>{
 assert.deepEqual(overrides['khauma-gate'],{position:[-121.53684759946469,0,-34.285908249582874],rotation:[Math.PI,-1.5163246617599573,Math.PI],scale:[1,1,1]});
 const byId=key=>exterior.find(m=>m.id===`entrance:KhaumaExterior_${key}`);
 const localOrigin=m=>exteriorLocal([m.origin[0],0,m.origin[1]]);
 const left=byId('LeftTraditional'),small=byId('LeftShops'),deep=byId('LeftLaneShops'),terrace=byId('LeftTerrace'),right=byId('RightCommercial'),upper=byId('RightUpper'),near=byId('RightGateShop');
 assert(Math.abs(left.yaw-exteriorFrame.yaw)<1e-8);assert(Math.abs(localOrigin(left)[0]+10.05)<1e-6);
 assert(Math.abs(small.yaw-left.yaw)<1e-8);assert(small.boxes.filter(b=>b.role==='exterior-shop-platform').length===1);
 assert(Math.abs(deep.yaw-left.yaw-Math.PI/2)<1e-8);assert(localOrigin(deep)[2]>8);assert(localOrigin(terrace)[2]>localOrigin(deep)[2]);assert.equal(terrace.yaw,deep.yaw);
 assert(Math.abs(right.yaw-exteriorFrame.yaw+Math.PI/2)<1e-8);assert.equal(upper.yaw,right.yaw);assert.equal(near.yaw,right.yaw);
 const platforms=right.boxes.filter(b=>b.role==='exterior-shop-platform').map(b=>exteriorLocal(b.position));
 assert(Math.max(...platforms.map(p=>p[2]))-Math.min(...platforms.map(p=>p[2]))>8);assert(Math.max(...platforms.map(p=>p[0]))-Math.min(...platforms.map(p=>p[0]))<.3);
 for(const b of right.boxes.filter(b=>/sign-band|shop-jamb|hanging-textile/.test(b.role)))assert.equal(b.yaw,right.yaw);
 const nearEnds=near.boxes.filter(b=>b.role==='exterior-shop-platform').flatMap(b=>{const z=exteriorLocal(b.position)[2];return [z-b.size[0]/2,z+b.size[0]/2];});assert(Math.min(...nearEnds)>2.5,'narrow gap beyond gate/masonry return');
 assert(exteriorPlan.roadWidths.every(w=>w<4));assert(new Set(exteriorPlan.roadCentreline.map(p=>p[0])).size>2);
 assert(!byId('Road').boxes.some(b=>b.size[0]>=20));
});
await RAPIER.init();
test('saved-transform physical scene permits gate round trip, exterior street and both shop approaches',()=>{
 const w=new RAPIER.World({x:0,y:-9.81,z:0});w.createCollider(RAPIER.ColliderDesc.cuboid(170,.25,170).setTranslation(-40,-.25,0));
 for(const m of [...models,...edge.models]){const source={position:[m.origin[0],0,m.origin[1]],rotation:[0,m.yaw,0],scale:[1,1,1]};for(const part of partitionArchitecturalParts(m)){const delta=partWorldDelta(source,overrides[m.id]??source,part.source,overrides[part.id]??part.source);for(const b of part.model.colliders){const c=affineCollider(b,delta);w.createCollider(RAPIER.ColliderDesc.convexHull(new Float32Array(c.vertices)).setTranslation(...c.position));}}}
 const cross=(a,b)=>{const from=exteriorPoint(a[0],.925,a[1]),to=exteriorPoint(b[0],.925,b[1]),dx=to[0]-from[0],dz=to[2]-from[2],length=Math.hypot(dx,dz),body=w.createRigidBody(RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(...from)),collider=w.createCollider(RAPIER.ColliderDesc.capsule(playerConfig.capsuleHalfSegment,playerConfig.radius),body),controller=createCharacterController(w,playerConfig),runtime=createPlayerRuntime();w.step();for(let i=0;i<Math.ceil(length/2.3*60)+10;i++){runtime.velocity.x=dx/length*2.3;runtime.velocity.z=dz/length*2.3;stepCharacter(body,collider,controller,runtime,1/60,playerConfig,-9.81,RAPIER.QueryFilterFlags.EXCLUDE_SENSORS);w.step();}const p=body.translation(),progress=((p.x-from[0])*dx+(p.z-from[2])*dz)/length;w.removeCharacterController(controller);w.removeRigidBody(body);assert(progress>=length-.4,`blocked ${JSON.stringify([a,b])}: ${progress}/${length}`);};
 try{
  cross([0,-3],[0,15]);cross([0,15],[0,-3]);cross([0,14],[0,36]);
  cross([-2,6],[-19.6,6]);cross([-19.6,6],[-17.5,9]);cross([-17.5,9],[-17.5,20]);
  cross([-2,10],[-8.6,10]);cross([-8.6,10],[-8.6,18]);cross([-8.6,11.2],[-10.4,11.2]);
  cross([2.8,1.8],[12.7,1.8]);cross([12.7,1.8],[2.8,1.8]);
  cross([2.8,6],[6,6]);cross([2.8,14],[5.5,14]);cross([3.8,9],[3.8,18]);
 const graph=pedestrianGraph(arcadeSeatSpans(overrides)[0],createNpcNavigationProbe(w,RAPIER));assert.equal(graph.nodes.length,58);assert.equal(graph.edges.length,143);
 }finally{w.free();}
});
