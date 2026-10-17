import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
test('Explore mounts the complete reconstruction without distance filtering',async()=>{
 const world=await readFile('src/game/world/bhaktapur-world.tsx','utf8');
 const complete=await readFile('src/game/architecture/complete-environment.tsx','utf8');
 const canvas=await readFile('src/game/experience-canvas.tsx','utf8');
 assert.match(world,/<CompleteEnvironment/);
 assert.doesNotMatch(world,/StreamedEnvironment|zoneDistance/);
 assert.match(complete,/models:buildCompletedSquareModels\(\),urban:buildCompletedSquareEdge\(\)/);
 assert.doesNotMatch(complete,/filter\(|includeGround=\{false\}/);
 assert.doesNotMatch(canvas,/StreamingReadiness|paused=\{/);
 const daylight=await readFile('src/game/architecture/daylight.tsx','utf8');
 assert.match(daylight,/args=\{\["#b0d1e9",110,360\]\}/);
});
test('deferred homepage data remains visual-only',async()=>{
 const manifest=JSON.parse(await readFile('public/world-data/manifest.json','utf8'));
 const models=JSON.parse(await readFile('public'+manifest.home,'utf8'));
 assert.ok(models.length>0);
 for(const model of models){assert.deepEqual(model.colliders,[]);assert.ok(model.boxes.every(b=>!b.role.includes('collision')));}
});
