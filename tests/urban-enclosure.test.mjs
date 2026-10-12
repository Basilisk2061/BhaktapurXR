import assert from 'node:assert/strict';
import {test} from 'node:test';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {buildUrbanEnclosure,overlaps,rectangle,streetRectangle,monumentEnvelopes} from '../src/game/architecture/urban-model.ts';
import {contextClassifications,urbanStreetExits} from '../src/data/reconstruction/urban-enclosure.ts';
import {buildPhase7Models} from '../src/game/architecture/remaining-models.ts';
import {centralGround} from '../src/game/architecture/central-model.ts';
import {adoptedFit} from '../src/data/reconstruction/present-day.ts';
import {geographicFrame,applyFit} from '../src/data/reconstruction/geographic-frame.ts';
import {openSpaces} from '../src/data/reconstruction/open-spaces.ts';
import {urbanReviewSpawns,allArchitectureReviewSpawns,resolveUrbanReview,urbanExperienceSpawn} from '../src/game/world/urban-review.ts';
import {architectureReviewSpawns} from '../src/game/world/remaining-review.ts';
import {worldSpawns} from '../src/game/world/world-mode.ts';
import {playerConfig} from '../src/game/player/player-config.ts';
import {createCharacterController,stepCharacter} from '../src/game/player/character-physics.ts';
import {createPlayerRuntime} from '../src/game/player/player-runtime.ts';
const u=buildUrbanEnclosure(),heritage=buildPhase7Models(),hash=o=>createHash('sha256').update(JSON.stringify(o)).digest('hex');

test('7C frozen transform, anchors and heritage ground remain unchanged',()=>{
 assert.equal(adoptedFit.scale,1);assert.equal(adoptedFit.rotationDegrees,-1.3454844413782245);assert.deepEqual(adoptedFit.translation,[-135.5122877845299,1.2885277597576867]);assert.deepEqual(geographicFrame.origin,{latitude:27.67205,longitude:85.42856});assert.equal(u.groundBaseline,centralGround);
 for(const p of u.groundPatches)for(const s of openSpaces)assert.ok(!overlaps(rectangle([p.x,p.z],p.width,p.depth,0),s.polygon.map(p=>applyFit(p,adoptedFit))));
});
test('7C preserves complete 7A/7B monument geometry, anchors and colliders at accepted commit',()=>assert.equal(hash(heritage),'4b96afdd44ef23817248c8837c3267c4dc47fa958e772e42acaeed69787736d7'));
test('urban context classifications, source roles and bounded detail remain honest',()=>{
 assert.ok(u.buildings.length>50&&u.buildings.length<150);assert.ok(u.buildings.some(b=>b.distant));assert.equal(new Set(u.buildings.map(b=>b.id)).size,u.buildings.length);
 for(const b of u.buildings){assert.ok(contextClassifications.includes(b.classification));assert.equal(b.dimensionClassification,'CONTEXT_APPROXIMATE');assert.ok(b.sourceReferences.includes('dh-plan'));assert.ok(b.height>=5.6&&b.height<=11.2);assert.notEqual(b.classification,'VERIFIED');if(b.distant)assert.equal(b.classification,'CONTEXT_APPROXIMATE');}
 for(const m of u.models){assert.equal(m.colliders.length,1);assert.equal(m.profiles.length,0);assert.equal(m.shapes.length,0);}
});
const RAP=createRequire(import.meta.url)('@dimforge/rapier3d-compat');await RAP.init();
test('all five street exits remain clear and Rapier traverses the western continuation',()=>{
 for(const e of urbanStreetExits){const corridor=streetRectangle(e.from,e.to,e.width);assert.ok(u.buildings.every(b=>!overlaps(b.outline,corridor)),e.id);}
 const e=urbanStreetExits.find(e=>e.id==='west-entrance'),w=new RAP.World({x:0,y:-9.81,z:0});w.createCollider(RAP.ColliderDesc.cuboid(170,.25,170).setTranslation(-40,-.25,0));for(const c of [...heritage,...u.models].flatMap(m=>m.colliders))w.createCollider(RAP.ColliderDesc.cuboid(...c.size.map(v=>v/2)).setTranslation(...c.position).setRotation({x:0,y:Math.sin(c.yaw/2),z:0,w:Math.cos(c.yaw/2)}));
 const body=w.createRigidBody(RAP.RigidBodyDesc.kinematicPositionBased().setTranslation(e.from[0],.925,e.from[1])),col=w.createCollider(RAP.ColliderDesc.capsule(playerConfig.capsuleHalfSegment,playerConfig.radius),body),ctrl=createCharacterController(w,playerConfig),runtime=createPlayerRuntime(),dx=e.to[0]-e.from[0],dz=e.to[1]-e.from[1],length=Math.hypot(dx,dz);w.step();for(let i=0;i<420;i++){runtime.velocity.x=dx/length*5;runtime.velocity.z=dz/length*5;stepCharacter(body,col,ctrl,runtime,1/60,playerConfig,-9.81,RAP.QueryFilterFlags.EXCLUDE_SENSORS,false);w.step();}const q=body.translation();assert.ok(((q.x-e.from[0])*dx+(q.z-e.from[1])*dz)/length>length*.9);assert.ok(q.y>.8&&q.y<1);w.free();
});
test('urban bodies/eaves avoid every major monument and building bodies do not overlap',()=>{
 const bounds=monumentEnvelopes();for(const b of u.buildings)assert.ok(bounds.every(p=>!overlaps(b.outline,p,1.19)),b.id);
 for(let i=0;i<u.buildings.length;i++)for(let j=i+1;j<u.buildings.length;j++){const a=u.buildings[i],b=u.buildings[j];assert.ok(!overlaps(rectangle(a.centre,a.width,a.depth,a.yaw),rectangle(b.centre,b.width,b.depth,b.yaw)),a.id+' / '+b.id);}
});
test('urban generation deterministic with finite positive geometry and unchanged shared ground',()=>{
 assert.deepEqual(u,buildUrbanEnclosure());for(const m of u.models)for(const b of [...m.boxes,...m.colliders])assert.ok([...b.position,...b.size,b.yaw].every(Number.isFinite)&&b.size.every(v=>v>0));assert.ok(u.groundPatches.every(p=>[p.x,p.z,p.width,p.depth].every(Number.isFinite)&&p.width>0&&p.depth>0));
});
test('only four urban presets added; all review/gameplay spawns valid and development gated',()=>{
 assert.deepEqual(Object.keys(urbanReviewSpawns),['urban-central','urban-east','urban-west','urban-wide']);for(const [id,s]of Object.entries(architectureReviewSpawns))assert.deepEqual(allArchitectureReviewSpawns[id],s);
 for(const [id,s]of Object.entries(urbanReviewSpawns)){assert.equal(resolveUrbanReview(id,true),id);assert.equal(resolveUrbanReview(id,false),null);assert.deepEqual(urbanExperienceSpawn('BHAKTAPUR',id),s);}
 for(const s of [worldSpawns.BHAKTAPUR,...Object.values(allArchitectureReviewSpawns)])assert.ok(u.buildings.every(b=>!overlaps(b.outline,rectangle([s.position[0],s.position[2]],.7,.7,0))));assert.deepEqual(urbanExperienceSpawn('ENGINEERING','urban-wide'),worldSpawns.ENGINEERING);assert.equal(resolveUrbanReview('__proto__',true),null);
});
