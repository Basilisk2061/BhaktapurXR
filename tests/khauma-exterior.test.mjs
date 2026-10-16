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
test('approved right assemblies, road, props and right review remain byte-identical',()=>{
 const protectedScene={right:exterior.filter(m=>/KhaumaExterior_Right/.test(m.id)),road:exterior.find(m=>m.id.endsWith('_Road')),gate:overrides['khauma-gate'],review:khaumaExteriorReviews['khauma-exterior-right']};
 assert.equal(createHash('sha256').update(JSON.stringify(protectedScene)).digest('hex'),'e247930cefa1848868afe0ac7dcac6f9055a72f346737146c571dc1a5f7b3422');
 const props=exterior.find(m=>m.id.endsWith('_StreetProps')),rightProps=Object.fromEntries(['boxes','profiles','shapes','roofs','colliders'].map(k=>[k,props[k].filter(p=>exteriorLocal(p.position)[0]>=0)]));
 assert.equal(createHash('sha256').update(JSON.stringify(rightProps)).digest('hex'),'549fceb3d0df2acfa3df1558dbb2e14320639076f7eda6a56f84a315540bb88c');
});
test('ten deterministic photo-inferred assemblies replace exterior proxies and remain independently editable',()=>{
 assert.deepEqual(buildKhaumaExterior(),exterior);assert.equal(exterior.length,10);
 const registry=getEditableRegistry();for(const m of exterior){assert.equal(m.accuracy,'PHOTO_INFERRED');assert.equal(edge.models.filter(n=>n.id===m.id).length,1);assert(registry.some(e=>e.id===m.id&&e.classification==='PHOTO_INFERRED'));}
 for(const id of exteriorReplacedIds)assert(!edge.models.some(m=>m.id===id));
 for(const [kind,budget]of Object.entries({boxes:760,profiles:248,shapes:15,roofs:8,colliders:96}))assert(exterior.reduce((n,m)=>n+m[kind].length,0)<=budget,kind+' budget');
 for(const [id,c]of Object.entries(khaumaExteriorReviews)){assert.equal(resolveKhaumaAxisReview(id,true),id);assert.equal(resolveKhaumaAxisReview(id,false),null);assert(c.position.every(Number.isFinite));}
});
test('gate stays frozen; wide connected green frontage and red terrace cluster frame a real lane',()=>{
 assert.deepEqual(overrides['khauma-gate'],{position:[-121.53684759946469,0,-34.285908249582874],rotation:[Math.PI,-1.5163246617599573,Math.PI],scale:[1,1,1]});
 const byId=key=>exterior.find(m=>m.id===`entrance:KhaumaExterior_${key}`);
 const localOrigin=m=>exteriorLocal([m.origin[0],0,m.origin[1]]);
 const left=byId('LeftTraditional'),small=byId('LeftShops'),deep=byId('LeftLaneShops'),terrace=byId('LeftTerrace'),right=byId('RightCommercial'),upper=byId('RightUpper'),near=byId('RightGateShop');
 assert(Math.abs(left.yaw-exteriorFrame.yaw)<1e-8);assert(Math.abs(localOrigin(left)[0]+10.05)<1e-6);
 assert(Math.abs(small.yaw-left.yaw)<1e-8);assert(small.boxes.filter(b=>b.role==='exterior-shop-platform').length===1);
 assert.equal(deep.yaw,left.yaw+exteriorPlan.leftTurn);assert(localOrigin(deep)[0]<localOrigin(small)[0]);
 const greenBases=deep.boxes.filter(b=>b.role==='exterior-shop-platform'),redBase=small.boxes.find(b=>b.role==='exterior-shop-platform');
 assert.equal(greenBases.length,3);assert(greenBases.reduce((n,b)=>n+b.size[0],0)>10.5,'substantially wider than rejected kiosk');assert(greenBases.every(b=>b.size[2]>=4.5&&b.size[2]<6));assert(deep.roofs.length===1&&deep.roofs[0].width>11);assert(deep.roofs.every(r=>r.position[1]+r.rise<=4));
 const greenRight=Math.max(...greenBases.map(b=>exteriorLocal(b.position)[0]+Math.abs(Math.cos(exteriorPlan.leftTurn))*b.size[0]/2+Math.abs(Math.sin(exteriorPlan.leftTurn))*b.size[2]/2)),redLeft=exteriorLocal(redBase.position)[0]-redBase.size[0]/2;
 assert(redLeft-greenRight>2&&redLeft-greenRight<4.5,'lane directly between connected blocks');
 assert(Math.abs(deep.yaw-left.yaw)<Math.PI/3,'frontage faces approach rather than perpendicular range');
 const urban=byId('LeftUrbanContext');assert(urban&&localOrigin(urban)[0]<localOrigin(deep)[0]);assert(urban.boxes.some(b=>b.role==='exterior-older-upper-storey'));assert(urban.roofs.length===2);
 const edgeX=(b,side)=>exteriorLocal(b.position)[0]+side*(Math.abs(Math.cos(b.yaw-exteriorFrame.yaw))*b.size[0]/2+Math.abs(Math.sin(b.yaw-exteriorFrame.yaw))*b.size[2]/2);
 const greenLeft=Math.min(...greenBases.map(b=>edgeX(b,-1))),urbanRight=Math.max(...urban.boxes.filter(b=>b.role==='exterior-shop-platform').map(b=>edgeX(b,1)));assert(Math.abs(greenLeft-urbanRight)<1.5,'older frontage closes the former detached-kiosk void');

 const redRoofRight=Math.max(...small.roofs.map(r=>exteriorLocal(r.position)[0]+r.width/2)),houseRoofLeft=Math.min(...left.roofs.map(r=>exteriorLocal(r.position)[0]-r.width/2));assert(houseRoofLeft-redRoofRight>.25,'distinct commercial/traditional roof seam');
 assert(Math.abs(localOrigin(terrace)[0]-localOrigin(small)[0])<.1);assert.equal(terrace.yaw,small.yaw);assert(terrace.profiles.filter(p=>p.role==='exterior-terrace-umbrella').length===4);
 assert(localOrigin(terrace)[0]<localOrigin(left)[0]-4,'terrace belongs to red cluster');
 assert(!exterior.filter(m=>/KhaumaExterior_Left/.test(m.id)).some(m=>m.colliders.some(c=>{const p=exteriorLocal(c.position);return p[0]>-15&&p[0]<-8&&p[2]>8;})),'no old foreground colliders');
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
  cross([-2,4.5],[-12,4.5]);cross([-12,4.5],[-17,1]);cross([-17,1],[-17,-.8]);
  cross([-17,4.5],[-22.6,4]);cross([-22.6,4],[-23,0]);cross([-23,0],[-25.5,-4]);cross([-25.5,-4],[-28,-10]);cross([-28,-10],[-25.5,-4]);cross([-25.5,-4],[-23,0]);cross([-23,0],[-22.6,4]);
  cross([-22.6,4],[-26,5]);cross([-26,5],[-28,5.5]);cross([-28,5.5],[-31,8.8]);cross([-31,8.8],[-34,11]);cross([-34,11],[-40,11]);cross([-40,11],[-34,11]);cross([-34,11],[-22.6,7]);cross([-22.6,7],[-2,7]);
  cross([2.8,1.8],[12.7,1.8]);cross([12.7,1.8],[2.8,1.8]);
  cross([2.8,6],[6,6]);cross([2.8,14],[5.5,14]);cross([3.8,9],[3.8,18]);
 const graph=pedestrianGraph(arcadeSeatSpans(overrides)[0],createNpcNavigationProbe(w,RAPIER));assert.equal(graph.nodes.length,58);assert.equal(graph.edges.length,143);
 }finally{w.free();}
});
