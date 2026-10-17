import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {zoneDistance,streamingDistances,zoneIds} from '../src/game/world/streaming-zones.ts';
test('coarse zones preload before activation and stop unsafe approaches; distance uses whole footprint',()=>{
 assert.equal(zoneDistance([0,0,10,10],5,5),0);
 assert.equal(zoneDistance([0,0,10,10],-3,-4),5);
 assert.ok(streamingDistances.preload>streamingDistances.active);
 assert.ok(streamingDistances.active>streamingDistances.safety);
});
test('generated zones cover every source model exactly once with identical geometry/colliders',async()=>{
 const {buildCompletedSquareModels,buildCompletedSquareEdge}=await import('../src/game/architecture/square-completion.ts');
 const manifest=JSON.parse(await readFile('public/world-data/manifest.json','utf8'));
 assert.deepEqual(manifest.zones.map(e=>e.id),[...zoneIds]);
 const models=(await Promise.all(manifest.zones.map(async e=>{assert.ok(e.bounds.every(Number.isFinite));return JSON.parse(await readFile('public'+e.url,'utf8'));}))).flat();
 for(const m of models)for(const p of m.profiles)if(p.sculptedSurface?.url)p.sculptedSurface=JSON.parse(await readFile('public'+p.sculptedSurface.url,'utf8'));
 const source=[...buildCompletedSquareModels(),...buildCompletedSquareEdge().models];
 assert.equal(new Set(models.map(m=>m.id)).size,source.length);
 const byId=new Map(models.map(m=>[m.id,m]));
 for(const m of source)assert.deepEqual(byId.get(m.id),JSON.parse(JSON.stringify(m)),m.id);
});
