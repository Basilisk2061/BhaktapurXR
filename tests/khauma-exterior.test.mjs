import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import RAPIER from '@dimforge/rapier3d-compat';
import {buildKhaumaExterior,exteriorPoint,exteriorReplacedIds,khaumaExteriorReviews} from '../src/game/architecture/khauma-exterior.ts';
import {buildCompletedSquareModels,buildCompletedSquareEdge} from '../src/game/architecture/square-completion.ts';
import {getEditableRegistry} from '../src/features/world-editor/registry.ts';
import {partitionArchitecturalParts} from '../src/features/world-editor/parts.ts';
import {partWorldDelta,affineCollider} from '../src/features/world-editor/transforms.ts';
import overrides from '../src/features/bhaktapur/data/manual-transform-overrides.json' with {type:'json'};
import {resolveKhaumaAxisReview} from '../src/game/world/khauma-axis-review.ts';
import {createCharacterController,stepCharacter} from '../src/game/player/character-physics.ts';
import {createPlayerRuntime} from '../src/game/player/player-runtime.ts';
import {playerConfig} from '../src/game/player/player-config.ts';
const models=buildCompletedSquareModels(),edge=buildCompletedSquareEdge(),exterior=buildKhaumaExterior();
test('exterior leaves every approved monument primitive, source transform and collider unchanged',()=>{
 assert.equal(createHash('sha256').update(JSON.stringify(models)).digest('hex'),'03a247f639c5f2077239c31cafc77a6079af8200f09a9b78a1ddd0fe11bbdacd');
});
test('eight deterministic photo-inferred assemblies replace exterior proxies and remain independently editable',()=>{
 assert.deepEqual(buildKhaumaExterior(),exterior);assert.equal(exterior.length,8);
 const registry=getEditableRegistry();for(const m of exterior){assert.equal(m.accuracy,'PHOTO_INFERRED');assert.equal(edge.models.filter(n=>n.id===m.id).length,1);assert(registry.some(e=>e.id===m.id&&e.classification==='PHOTO_INFERRED'));}
 for(const id of exteriorReplacedIds)assert(!edge.models.some(m=>m.id===id));
 assert(exterior.reduce((n,m)=>n+m.boxes.length,0)<1500);
 for(const [id,c]of Object.entries(khaumaExteriorReviews)){assert.equal(resolveKhaumaAxisReview(id,true),id);assert.equal(resolveKhaumaAxisReview(id,false),null);assert(c.position.every(Number.isFinite));}
});
await RAPIER.init();
test('saved-transform physical scene permits gate round trip, exterior street and both shop approaches',()=>{
 const w=new RAPIER.World({x:0,y:-9.81,z:0});w.createCollider(RAPIER.ColliderDesc.cuboid(170,.25,170).setTranslation(-40,-.25,0));
 for(const m of [...models,...edge.models]){const source={position:[m.origin[0],0,m.origin[1]],rotation:[0,m.yaw,0],scale:[1,1,1]};for(const part of partitionArchitecturalParts(m)){const delta=partWorldDelta(source,overrides[m.id]??source,part.source,overrides[part.id]??part.source);for(const b of part.model.colliders){const c=affineCollider(b,delta);w.createCollider(RAPIER.ColliderDesc.convexHull(new Float32Array(c.vertices)).setTranslation(...c.position));}}}
 const cross=(a,b)=>{const from=exteriorPoint(a[0],.925,a[1]),to=exteriorPoint(b[0],.925,b[1]),dx=to[0]-from[0],dz=to[2]-from[2],length=Math.hypot(dx,dz),body=w.createRigidBody(RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(...from)),collider=w.createCollider(RAPIER.ColliderDesc.capsule(playerConfig.capsuleHalfSegment,playerConfig.radius),body),controller=createCharacterController(w,playerConfig),runtime=createPlayerRuntime();w.step();for(let i=0;i<Math.ceil(length/2.3*60)+10;i++){runtime.velocity.x=dx/length*2.3;runtime.velocity.z=dz/length*2.3;stepCharacter(body,collider,controller,runtime,1/60,playerConfig,-9.81,RAPIER.QueryFilterFlags.EXCLUDE_SENSORS);w.step();}const p=body.translation(),progress=((p.x-from[0])*dx+(p.z-from[2])*dz)/length;w.removeCharacterController(controller);w.removeRigidBody(body);assert(progress>=length-.4,`blocked ${JSON.stringify([a,b])}: ${progress}/${length}`);};
 try{cross([0,-3],[0,15]);cross([0,15],[0,-3]);cross([0,14],[0,36]);cross([-2,10],[-18,10]);cross([-18,10],[-18,5.8]);cross([2,10],[22,10]);cross([22,10],[22,5.3]);cross([-16,6.8],[-16,4.2]);cross([13.4,6.8],[13.4,4.1]);}finally{w.free();}
});
