import assert from 'node:assert/strict';
import {test} from 'node:test';
import {Vector3} from 'three';
import {arcadeSeatSpans,nearestArcadeSeat,sittingConfig} from '../src/game/player/arcade-sitting.ts';
import {createPlayerInput,pressGameplayKey} from '../src/game/input/player-input.ts';
import overrides from '../src/features/bhaktapur/data/manual-transform-overrides.json' with {type:'json'};

test('nearest continuous seats at three places avoid posts and face the final transformed plaza',()=>{
 for(const transforms of [{},overrides,{'edge:yetachapari:1160027594':{position:[15,2,10],rotation:[0,1.2,0],scale:[1.2,1,1]}}]){
  const spans=arcadeSeatSpans(transforms);assert.ok(spans.length);const span=spans.sort((a,b)=>b.a.distanceTo(b.b)-a.a.distanceTo(a.b))[0];
  const seats=[.15,.5,.85].map(t=>{const feet=span.a.clone().lerp(span.b,t).addScaledVector(span.outward,.3);feet.y-=.775;
   const seat=nearestArcadeSeat(feet,spans);assert.ok(seat);assert.ok(Math.abs(seat.point.y-span.a.y)<1e-8);
   assert.ok(span.columns.every(p=>Math.hypot(p.x-seat.point.x,p.z-seat.point.z)>=sittingConfig.columnClearance-1e-8));
   assert.ok(new Vector3(-Math.sin(seat.yaw),0,-Math.cos(seat.yaw)).dot(span.outward)>.999);
   assert.ok(seat.exit.clone().sub(seat.point).dot(span.outward)>1);return seat;
  });assert.ok(seats[0].point.distanceTo(seats[2].point)>10);
 }
 assert.equal(nearestArcadeSeat({x:1000,y:0,z:1000},arcadeSeatSpans()),null);
});
test('E uses rising edges; seated Space cannot jump or toggle flight; normal fly toggle resumes',()=>{
 const input=createPlayerInput(0,0);pressGameplayKey(input,'KeyE');assert.equal(input.interactRequested,true);input.interactRequested=false;pressGameplayKey(input,'KeyE',true);assert.equal(input.interactRequested,false);
 input.sitting=true;for(const now of [100,200,300]){input.keys.delete('Space');pressGameplayKey(input,'Space',false,now);}assert.equal(input.flying,false);assert.equal(input.jumpRequested,false);assert.equal(input.lastSpacePress,null);
 input.sitting=false;for(const now of [1000,1200]){input.keys.delete('Space');pressGameplayKey(input,'Space',false,now);}assert.equal(input.flying,true);
});
