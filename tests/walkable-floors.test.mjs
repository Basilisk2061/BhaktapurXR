import assert from 'node:assert/strict';
import {test} from 'node:test';
import RAPIER from '@dimforge/rapier3d-compat';
import {Matrix4,Vector3} from 'three';
import overrides from '../src/features/bhaktapur/data/manual-transform-overrides.json' with {type:'json'};
import {walkableFloorColliders} from '../src/game/architecture/walkable-floor-colliders.ts';
import {contextColliders} from '../src/game/architecture/urban-occupancy.ts';
import {rectangle} from '../src/game/architecture/urban-model.ts';
import {insideFootprint} from '../src/game/architecture/geometry.ts';
import {buildCompletedSquareModels,buildCompletedSquareEdge} from '../src/game/architecture/square-completion.ts';
import {affineCollider,partWorldDelta} from '../src/features/world-editor/transforms.ts';
import {partitionArchitecturalParts} from '../src/features/world-editor/parts.ts';
import {createCharacterController,stepCharacter} from '../src/game/player/character-physics.ts';
import {createPlayerRuntime} from '../src/game/player/player-runtime.ts';
import {playerConfig} from '../src/game/player/player-config.ts';
await RAPIER.init();
const models=[...buildCompletedSquareModels(),...buildCompletedSquareEdge().models],arcade=models.find(m=>m.id==='edge:yetachapari:1160027594');
function add(w,c,delta=new Matrix4()){if(!c.vertices&&delta.elements.every((v,i)=>Math.abs(v-new Matrix4().elements[i])<1e-9)){w.createCollider(RAPIER.ColliderDesc.cuboid(...c.size.map(v=>v/2)).setTranslation(...c.position).setRotation({x:0,y:Math.sin(c.yaw/2),z:0,w:Math.cos(c.yaw/2)}));return;}const h=affineCollider(c,delta);w.createCollider(RAPIER.ColliderDesc.convexHull(new Float32Array(h.vertices)).setTranslation(...h.position));}
function ray(w,x,z,y=8){return w.castRay(new RAPIER.Ray({x,y,z},{x:0,y:-1,z:0}),20,true);}
function walk(w,start,velocity,frames,jump=false){const body=w.createRigidBody(RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(...start)),collider=w.createCollider(RAPIER.ColliderDesc.capsule(playerConfig.capsuleHalfSegment,playerConfig.radius),body),controller=createCharacterController(w,playerConfig),motion=createPlayerRuntime();w.step();let min=Infinity,max=-Infinity;for(let i=0;i<frames;i++){motion.velocity.x=velocity[0];motion.velocity.z=velocity[1];stepCharacter(body,collider,controller,motion,1/60,playerConfig,-9.81,RAPIER.QueryFilterFlags.EXCLUDE_SENSORS,jump&&i===8);w.step();min=Math.min(min,body.translation().y);max=Math.max(max,body.translation().y);}const p=body.translation();w.removeCharacterController(controller);w.removeRigidBody(body);return {p,min,max};}

test('rotated rectangles use exact oriented cuboids; concave floor and courtyard holes have no grid gaps',()=>{
 for(const yaw of [0,.37,1.49,-2.2]){const rings=[rectangle([12,-17],12,4,yaw)],c=walkableFloorColliders(rings,.7);assert.equal(c.length,1);assert.ok(!c[0].vertices);const w=new RAPIER.World({x:0,y:0,z:0});c.forEach(c=>add(w,c));w.step();for(let x=-5.9;x<6;x+=.8)for(let z=-1.9;z<2;z+=.7)assert.ok(ray(w,12+x*Math.cos(yaw)+z*Math.sin(yaw),-17-x*Math.sin(yaw)+z*Math.cos(yaw)));w.free();}
 const rings=[[[0,0],[9,1],[9,6],[6,6],[6,3],[0,3],[0,0]],[[2,1],[3,1],[3,2],[2,2],[2,1]]],f={vertices:rings[0],holes:rings.slice(1)},w=new RAPIER.World({x:0,y:0,z:0}),old=new RAPIER.World({x:0,y:0,z:0});walkableFloorColliders(rings,.6).forEach(c=>add(w,c));contextColliders(rings,.6).forEach(c=>add(old,c));w.step();old.step();let missing=0;for(let x=.17;x<9;x+=.31)for(let z=.19;z<6;z+=.31)if(insideFootprint([x,z],f)){assert.ok(ray(w,x,z),'all visible floor must collide');if(!ray(old,x,z))missing++;}assert.ok(missing>0,'reproduces old interior-grid holes');assert.equal(ray(w,2.5,1.5),null);assert.equal(ray(w,3,5),null);w.free();old.free();
});

test('target floors are covered at every triangle centroid; parent/part edits transform exact floor vertices once',()=>{
 for(const m of models.filter(m=>m.id==='terrace:khauma-pavilion'||m===arcade||m.id==='context:9c:1159393579'))for(const v of (m.volumes??[]).filter(v=>/plinth|platform|cap/.test(v.role)&&v.baseY<3)){
  const w=new RAPIER.World({x:0,y:0,z:0}),floor=walkableFloorColliders(v.rings,v.height,v.baseY);floor.forEach(c=>add(w,c));w.step();for(const c of floor){const x=c.vertices?(c.vertices[0]+c.vertices[3]+c.vertices[6])/3+c.position[0]:c.position[0],z=c.vertices?(c.vertices[2]+c.vertices[5]+c.vertices[8])/3+c.position[2]:c.position[2];const hit=ray(w,x,z);assert.ok(hit,m.id+v.role);assert.ok(Math.abs(8-hit.timeOfImpact-(v.baseY+v.height))<.003,JSON.stringify({id:m.id,role:v.role,time:hit.timeOfImpact,toi:hit.toi,keys:Object.keys(hit),top:v.baseY+v.height}));}w.free();
 }
 const box=walkableFloorColliders([[[0,0],[4,0],[3,2],[0,3],[0,0]]],.6)[0],source={position:[0,0,0],rotation:[0,.3,0],scale:[1,1,1]},current={position:[7,1,-5],rotation:[.1,.9,.2],scale:[1.2,.8,.7]},part={position:[1,0,0],rotation:[0,.2,0],scale:[1,1,1]},changed={...part,position:[2,.2,1]},delta=partWorldDelta(source,current,part,changed),h=affineCollider(box,delta);for(let i=0;i<box.vertices.length;i+=3){const expected=new Vector3().fromArray(box.vertices,i).add(new Vector3(...box.position)).applyMatrix4(delta),actual=new Vector3().fromArray(h.vertices,i).add(new Vector3(...h.position));assert.ok(actual.distanceTo(expected)<1e-9);}
 const plinth=partitionArchitecturalParts(arcade).find(p=>p.id.endsWith('/plinth'));assert.ok(plinth.model.colliders.some(c=>c.vertices),'floor ownership follows editable plinth');
});

test('normal capsule walks/runs full arcade, jumps/lands, enters open bays and is blocked by columns',()=>{
 const w=new RAPIER.World({x:0,y:-9.81,z:0});w.createCollider(RAPIER.ColliderDesc.cuboid(170,.25,170).setTranslation(-40,-.25,0));arcade.colliders.forEach(c=>add(w,c));w.step();
 const ring=arcade.volumes.find(v=>v.role==='sattal-plinth').rings[0],edges=ring.slice(0,-1).map((a,i)=>{const b=ring[i+1],length=Math.hypot(b[0]-a[0],b[1]-a[1]);return {a,b,length,dx:(b[0]-a[0])/length,dz:(b[1]-a[1])/length};}),front=edges.filter(e=>e.dx>0).sort((a,b)=>b.length-a.length)[0];const {a,dx,dz,length}=front,nx=dz,nz=-dx,at=(t,inside)=>[a[0]+dx*t-nx*inside,.65+.925,a[1]+dz*t-nz*inside];
 try{for(const speed of [2.3,5]){const result=walk(w,at(.8,.85),[dx*speed,dz*speed],Math.floor((length-1.6)/speed*60));assert.ok(result.min>1.5,'no falling through bays or seams');assert.ok(Math.hypot(result.p.x-at(.8,.85)[0],result.p.z-at(.8,.85)[2])>length-2.2,'full frontage traversed');}
 const jump=walk(w,at(length*.5,.85),[0,0],130,true);assert.ok(jump.max>2.0,JSON.stringify(jump));assert.ok(Math.abs(jump.p.y-1.575)<.08);
 const exit=walk(w,at(length*.51,.85),[nx*2.3,nz*2.3],100);assert.ok(exit.p.y<1.05,'leaving the real platform edge returns to plaza');
 const entry=walk(w,at(length*.51,-1.2),[-nx*1.5,-nz*1.5],100);assert.ok(entry.p.y>1.5,'access treads climb into an open bay');
 const post=arcade.boxes.find(b=>b.role==='sattal-columns'),blocked=walk(w,[post.position[0]-nx*.8,1.575,post.position[2]-nz*.8],[nx*1.4,nz*1.4],80);assert.ok(Math.hypot(blocked.p.x-post.position[0],blocked.p.z-post.position[2])>.35);
 }finally{w.free();}
});

test('Khauma raised pavilion/veranda floors support the normal capsule and their access seams stay walkable',()=>{
 const w=new RAPIER.World({x:0,y:-9.81,z:0});w.createCollider(RAPIER.ColliderDesc.cuboid(170,.25,170).setTranslation(-40,-.25,0));
 for(const m of models.filter(m=>['terrace:khauma-pavilion','gopinath-krishna','rameshwar','entrance:khauma-raised-veranda'].includes(m.id))){const source={position:[m.origin[0],0,m.origin[1]],rotation:[0,m.yaw,0],scale:[1,1,1]};for(const p of partitionArchitecturalParts(m)){const delta=partWorldDelta(source,overrides[m.id]??source,p.source,overrides[p.id]??p.source);p.model.colliders.forEach(c=>add(w,c,delta));}}
 w.step();try{
 const g=models.find(m=>m.id==='gopinath-krishna'),sn=Math.sin(g.yaw),cs=Math.cos(g.yaw),climb=walk(w,[g.origin[0]+sn*8.2,.925,g.origin[1]+cs*8.2],[-sn*1.3,-cs*1.3],300);assert.ok(climb.p.y>2.6,'pagoda platform stair seams reach upper level '+JSON.stringify(climb));
 const pavilion=walk(w,[-108.55,3.025,-23.32],[.5,0],60);assert.ok(pavilion.min>2.9,'white pavilion cap is solid');
 const veranda=walk(w,[-117.1691500142475,.925,-30.7],[0,2.3],170);assert.ok(veranda.p.y>2.9,'veranda treads and edited floor position remain aligned '+JSON.stringify(veranda));
 }finally{w.free();}
});
