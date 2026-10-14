import test from 'node:test';
import assert from 'node:assert/strict';
import {buildPalaceFrontageModels} from '../src/game/architecture/palace-frontage-models.ts';
import {buildCompletedSquareModels,buildCompletedSquareEdge} from '../src/game/architecture/square-completion.ts';
import {buildInsideSquareEdge} from '../src/game/architecture/inside-square-models.ts';
import {squareCompletionReviewCamera} from '../src/game/world/square-completion-review.ts';
test('surgical temple rebind preserves Silu and every unrelated heritage model',()=>{
 const old=buildPalaceFrontageModels(),now=buildCompletedSquareModels();
 for(const m of old.filter(m=>!['badrinath','rameshwar'].includes(m.id)))assert.deepEqual(now.find(n=>n.id===m.id),m);
 const target=now.find(m=>m.id==='badrinath'),original=old.find(m=>m.id==='badrinath');
 assert.deepEqual(target.origin,original.origin);assert.equal(target.yaw,original.yaw);
 assert.equal(target.accuracy,'PROVISIONALLY_IDENTIFIED');assert(target.profiles.some(p=>p.role==='silu-main-shikhara'));
 assert(!now.some(m=>m.id==='rameshwar'));
});
test('shed precedes translated school; white frontage low; paving and eye views retained',()=>{
 const old=buildInsideSquareEdge().models,now=buildCompletedSquareEdge().models;
 const school=now.find(m=>m.id==='edge:khauma-north-flank:1158762014'),shed=now.find(m=>m.id==='entrance:khauma-near-shed');
 assert.deepEqual(shed.origin,old.find(m=>m.id===school.id).origin);assert.equal(school.origin[0]-shed.origin[0],12);
 assert(school.profiles.some(p=>p.role==='school-left-guardian'));
 const white=now.find(m=>m.id==='entrance:khauma-raised-veranda');
 assert.equal(white.boxes.find(b=>b.role==='veranda-platform').size[1],.15);assert(!white.boxes.some(b=>b.role==='veranda-platform-stairs'));
 assert(!now.some(m=>m.id==='ground:9c-lane-transitions'));
 for(const name of ['9c2-through-khauma','9c2-rameshwar','9c2-left','9c2-right'])assert.equal(squareCompletionReviewCamera(name).height,1.65);
});
