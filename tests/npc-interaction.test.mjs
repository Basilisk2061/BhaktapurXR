import assert from 'node:assert/strict';
import {test} from 'node:test';
import RAPIER from '@dimforge/rapier3d-compat';
import {OldManReactions} from '../src/game/audio/old-man-reactions.ts';
import {npcHorizontalMovement} from '../src/game/npcs/npc-collision.ts';
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
test('run-again requires two genuine recent passes by the SAME actor',()=>{
 const r=new OldManReactions(),a={id:'a',state:'IDLE',position:{x:0,y:1.6,z:0}},b={...a,id:'b',position:{x:30,y:1.6,z:0}},p={position:{x:-4,y:.89,z:0},running:true};
 const at=(t,x)=>{p.position.x=x;return r.next(t,[a,b],p,false);};
 at(0,-4);at(1,-2);assert.equal(at(2,4),null);at(3,2);
 assert.deepEqual(at(4,-4),{id:'a',kind:'runAgain'});assert.equal(at(5,-4),null);
 const other=new OldManReactions();p.position.x=10;assert.equal(other.next(50,[a,b],p,false),null);
 p.position.x=-2;other.next(51,[a],p,false);p.position.x=-4;assert.equal(other.next(52,[a],p,false),null,'turning back is not passing');
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
    ncc.computeColliderMovement(nc,{x:0,y:-.008,z:0},RAPIER.QueryFilterFlags.EXCLUDE_SENSORS);
    const corrected=ncc.computedMovement(),horizontal=npcHorizontalMovement({x:0,z:0},corrected),p=npc.translation();npc.setNextKinematicTranslation({x:p.x+horizontal.x,y:.855,z:p.z+horizontal.z});w.step();
    assert.ok(Math.hypot(body.translation().x-npc.translation().x,body.translation().z-npc.translation().z)>.55,'player blocks/slides without overlapping');
   }
   assert.ok(Math.abs(npc.translation().x)<1e-6);
   assert.deepEqual(npcHorizontalMovement({x:0,z:0},{x:.08,z:-.04}),{x:0,z:0});
   assert.deepEqual(npcHorizontalMovement({x:.02,z:0},{x:.01,z:0}),{x:.01,z:0});
  }finally{w.free();}
 }
});
