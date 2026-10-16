import assert from 'node:assert/strict';
import {test} from 'node:test';
import RAPIER from '@dimforge/rapier3d-compat';
import {OldManReactions} from '../src/game/audio/old-man-reactions.ts';
import {npcHorizontalMovement,computeNpcMovement} from '../src/game/npcs/npc-collision.ts';
import {createCharacterController,stepCharacter} from '../src/game/player/character-physics.ts';
import {playerConfig} from '../src/game/player/player-config.ts';
import {createPlayerRuntime} from '../src/game/player/player-runtime.ts';
test('proximity reactions prioritize sitting, respect lock/cooldown and require leaving',()=>{
 const r=new OldManReactions(),a={id:'a',state:'SITTING',position:{x:0,y:1.6,z:0}},p={position:{x:.9,y:.89,z:0},running:false};
 assert.equal(r.next(0,[a],p,false),null);assert.equal(r.next(1.9,[a],p,false),null);
 assert.equal(r.next(2,[a],p,true),null);assert.deepEqual(r.next(3,[a],p,false),{id:'a',kind:'sittingTooClose'});
 assert.equal(r.next(100,[a],p,false),null,'continuous proximity cannot repeat');
 p.position.x=4;r.next(101,[a],p,false);p.position.x=.9;r.next(102,[a],p,false);
 assert.deepEqual(r.next(104,[a],p,false),{id:'a',kind:'sittingTooClose'});
 p.position.x=4;r.next(105,[a],p,false);a.state='IDLE';p.position.x=1;r.next(106,[a],p,false);
 assert.equal(r.next(108,[a],p,false),null,'per-NPC cooldown applies across reactions');
 assert.deepEqual(r.next(125,[a],p,false),{id:'a',kind:'tooClose'});
});
test('running reaction accumulates nearby running only, latches once and resets episodes',()=>{
 const actors=[{id:'a',state:'IDLE',position:{x:0,y:1.6,z:0}}],p={position:{x:2,y:.89,z:0},running:true};
 const r=new OldManReactions();let now=0,events=[];
 const advance=(seconds)=>{for(let i=0;i<Math.round(seconds*10);i++){now+=.1;const event=r.next(now,actors,p,false);if(event)events.push(event);}};
 r.next(0,actors,p,false);advance(2.4);assert.equal(events.length,0);advance(.2);assert.deepEqual(events,[{id:'a',kind:'runAgain'}]);
 advance(70);assert.equal(events.length,1,'one per episode even after cooldown');
 p.position.x=4;advance(.1);p.position.x=2;advance(1);assert.equal(events.length,1,'quick run-by does not trigger');
 p.running=false;advance(2);p.running=true;advance(2.4);assert.equal(events.length,1,'long pause resets cumulative time');advance(.3);assert.equal(events.length,2);
});
test('short pauses preserve cumulative running; walking/standing/distant running never qualify; voice lock preserves due reaction',()=>{
 const actor={id:'a',state:'IDLE',position:{x:0,y:1.6,z:0}},player={position:{x:2,y:.89,z:0},running:true},r=new OldManReactions();let now=0;
 const advance=(seconds,busy=false)=>{let result=null;for(let i=0;i<Math.round(seconds*10);i++){now+=.1;result=r.next(now,[actor],player,busy)??result;}return result;};
 r.next(0,[actor],player,false);assert.equal(advance(1.5),null);player.running=false;assert.equal(advance(.5),null);player.running=true;
 assert.equal(advance(1.2,true),null);assert.deepEqual(advance(.1),{id:'a',kind:'runAgain'});
 for(const [running,x]of [[false,2],[true,4]]){const quiet=new OldManReactions();for(let t=0;t<10;t+=.1)assert.equal(quiet.next(t,[actor],{position:{x,y:.89,z:0},running},false),null);}
 const different=new OldManReactions(),other={...actor,id:'b',position:{x:20,y:1.6,z:0}};
 for(let t=0;t<1.6;t+=.1)assert.equal(different.next(t,[actor,other],{position:{x:2,y:.89,z:0},running:true},false),null);
 for(let t=1.6;t<3.2;t+=.1)assert.equal(different.next(t,[actor,other],{position:{x:22,y:.89,z:0},running:true},false),null,'each actor accumulates independently');
});

test('walk/sprint controller blocks against stable kinematic NPC; overlap correction cannot shove an idle/yielding NPC',async()=>{
 await RAPIER.init();
 for(const speed of [2.3,5]){
  const w=new RAPIER.World({x:0,y:-9.81,z:0});try{
   w.createCollider(RAPIER.ColliderDesc.cuboid(20,.1,20).setTranslation(0,-.1,0));
   const npc=w.createRigidBody(RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(0,.855,0));
   const nc=w.createCollider(RAPIER.ColliderDesc.capsule(.58,.26),npc);
   const body=w.createRigidBody(RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(-2,.89,0));
   const collider=w.createCollider(RAPIER.ColliderDesc.capsule(playerConfig.capsuleHalfSegment,.3),body),controller=createCharacterController(w,playerConfig),ncc=w.createCharacterController(.015),runtime=createPlayerRuntime();
   runtime.grounded=true;w.step();
   for(let i=0;i<180;i++){
    runtime.velocity.x=speed;stepCharacter(body,collider,controller,runtime,1/60,playerConfig,-9.81,RAPIER.QueryFilterFlags.EXCLUDE_SENSORS);
    const horizontal=computeNpcMovement(ncc,nc,{x:0,y:-.008,z:0},RAPIER.QueryFilterFlags.EXCLUDE_SENSORS),p=npc.translation();npc.setNextKinematicTranslation({x:p.x+horizontal.x,y:.855,z:p.z+horizontal.z});w.step();
    assert.ok(Math.hypot(body.translation().x-npc.translation().x,body.translation().z-npc.translation().z)>.55,'player blocks/slides without overlapping');
   }
   assert.ok(Math.abs(npc.translation().x)<1e-6);
   assert.deepEqual(npcHorizontalMovement({x:0,z:0},{x:.08,z:-.04}),{x:0,z:0});
   assert.deepEqual(npcHorizontalMovement({x:.02,z:0},{x:.01,z:0}),{x:.01,z:0});
  }finally{w.free();}
 }
});

test('NPC controller excludes player contacts even when navigation is nonzero; static world stays solid',()=>{
 let result;
 const controller={computeColliderMovement(_c,desired,flags){
  assert.equal(flags&RAPIER.QueryFilterFlags.ONLY_FIXED,RAPIER.QueryFilterFlags.ONLY_FIXED);
  result=flags&RAPIER.QueryFilterFlags.EXCLUDE_KINEMATIC?desired:{x:.08,y:0,z:.07};
 },computedMovement(){return result;}};
 assert.deepEqual(computeNpcMovement(controller,{}, {x:0,y:0,z:.0125},0),{x:0,y:0,z:.0125});
});
test('sustained contacts in every direction cannot enter idle/yielding or walking NPC displacement',async()=>{
 await RAPIER.init();
 for(const [dx,dz]of [[1,0],[-1,0],[0,1],[0,-1],[Math.SQRT1_2,Math.SQRT1_2]])for(const walking of [false,true]){
  const world=new RAPIER.World({x:0,y:-9.81,z:0});try{
   // Isolate player-contact effects from triangulated ground-normal roundoff; wall/floor coverage is tested separately.
   const npc=world.createRigidBody(RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(0,.855,0)),collider=world.createCollider(RAPIER.ColliderDesc.capsule(.58,.26),npc),controller=world.createCharacterController(.015);
   controller.disableAutostep();controller.enableSnapToGround(.18);controller.setApplyImpulsesToDynamicBodies(false);
   const player=world.createRigidBody(RAPIER.RigidBodyDesc.kinematicPositionBased());world.createCollider(RAPIER.ColliderDesc.capsule(.575,.3),player);
   const nav=walking?{x:-dz*.75/60,z:dx*.75/60}:{x:0,z:0};
   for(let i=0;i<240;i++){
    const p=npc.translation();
    // Deliberately inject overlap/repeated sprint impacts, stronger than ordinary controller contact.
    player.setTranslation({x:p.x-dx*.48,y:.89,z:p.z-dz*.48},true);
    player.setNextKinematicTranslation({x:p.x-dx*.48+dx*5/60,y:.89,z:p.z-dz*.48+dz*5/60});world.step();
    const movement=computeNpcMovement(controller,collider,{...nav,y:0},RAPIER.QueryFilterFlags.EXCLUDE_SENSORS);
    assert.ok(Math.abs(movement.x-nav.x)<1e-7,JSON.stringify({dx,dz,walking,i,movement,nav}));assert.ok(Math.abs(movement.z-nav.z)<1e-7,JSON.stringify({dx,dz,walking,i,movement,nav}));
    npc.setNextKinematicTranslation({x:p.x+movement.x,y:.855,z:p.z+movement.z});world.step();
   }
   assert.ok(Math.abs(npc.translation().x-nav.x*240)<1e-4);assert.ok(Math.abs(npc.translation().z-nav.z*240)<1e-4);
  }finally{world.free();}
 }
});
test('NPC static-world query still blocks a wall',async()=>{
 await RAPIER.init();const world=new RAPIER.World({x:0,y:0,z:0});try{
  world.createCollider(RAPIER.ColliderDesc.cuboid(.1,3,3).setTranslation(1,0,0));
  const npc=world.createRigidBody(RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(0,.855,0)),collider=world.createCollider(RAPIER.ColliderDesc.capsule(.58,.26),npc),controller=world.createCharacterController(.015);world.step();
  for(let i=0;i<120;i++){const p=npc.translation(),m=computeNpcMovement(controller,collider,{x:.75/60,y:0,z:0},0);npc.setNextKinematicTranslation({x:p.x+m.x,y:p.y,z:p.z+m.z});world.step();}
  assert.ok(npc.translation().x<.65);
 }finally{world.free();}
});
