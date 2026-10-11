import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {currentObjects,unresolvedResearch,historicalExclusions,outsideTargetExclusions,spatialRelationships,squareMetrics,vatsalaDimensions,reconstructionTarget} from '../src/data/reconstruction/bhaktapur-current.ts';
import {reconstructionSources} from '../src/data/reconstruction/sources.ts';
import {accuracyClasses} from '../src/data/reconstruction/types.ts';
import {planCalibration,planToMetres,metresToPlan,polygonArea,bounds,registerOldPoint} from '../src/data/reconstruction/calibration.ts';
const ids=new Set(reconstructionSources.map(s=>s.id));
const references=refs=>{assert.ok(refs.length);for(const r of refs)assert.ok(ids.has(r),`Missing reference ${r}`);};
const finite=p=>assert.ok(p.length===2&&p.every(Number.isFinite));
test('current dataset has unique identities, full provenance and independent target',()=>{
 const all=[...currentObjects,...unresolvedResearch,...historicalExclusions,...outsideTargetExclusions];
 assert.equal(new Set(all.map(o=>o.id)).size,all.length);
 assert.equal(ids.size,reconstructionSources.length);
 for(const s of reconstructionSources){for(const k of ['title','author','publisher','url','sourceType','access','notes','period'])assert.ok(s[k]);assert.ok(s.year===null||Number.isInteger(s.year));}
 for(const o of currentObjects){assert.ok(o.canonicalName&&o.architectureType&&o.notes);assert.ok(accuracyClasses.includes(o.accuracyClass));references(o.sourceReferences);references(o.presence.sourceReferences);for(const e of [o.positionEvidence,o.footprintEvidence,o.heightEvidence,o.rotation]){assert.ok(accuracyClasses.includes(e.accuracyClass));references(e.sourceReferences);assert.ok(e.method&&e.uncertainty);}}
 assert.match(reconstructionTarget.gameplayIntegration,/NONE/);
 assert.equal(reconstructionTarget.status,'SPATIAL_REVIEW_REQUIRED');
});
test('all numeric geometry is finite, deterministic and uniformly traceable to pixels',()=>{
 const snapshot=JSON.stringify(currentObjects);
 for(const o of currentObjects){finite(o.position);for(const p of o.sourcePixels){finite(p);assert.ok(p[0]>=0&&p[0]<=1201&&p[1]>=0&&p[1]<=620);const inverse=metresToPlan(planToMetres(p));p.forEach((n,i)=>assert.ok(Math.abs(n-inverse[i])<1e-9));}
 if(o.footprint){assert.deepEqual(o.footprint,o.sourcePixels.map(planToMetres));const b=bounds(o.footprint);assert.ok(b.width>=0&&b.depth>=0);if(o.footprintRole==='PLAN_OUTLINE')assert.ok(polygonArea(o.footprint)>0);}
 assert.ok(o.approximateHeight===null||Number.isFinite(o.approximateHeight)&&o.approximateHeight>=0);}
 assert.equal(JSON.stringify(currentObjects),snapshot);
 assert.equal(planCalibration.metresPerPixel,190/755);
});
test('unknown facing never becomes default zero; outline axes and entrance direction stay distinct',()=>{
 for(const o of currentObjects){const r=o.rotation;if(r.state==='UNRESOLVED'){assert.equal(r.bearingDegrees,null);assert.equal(r.accuracyClass,'UNRESOLVED');}else{assert.ok(Number.isFinite(r.bearingDegrees)&&r.bearingDegrees>=0&&r.bearingDegrees<360);}}
 assert.equal(currentObjects.find(o=>o.id==='siddhi-lakshmi').rotation.state,'AXIS_ONLY');
 assert.equal(currentObjects.find(o=>o.id==='chyasilin').rotation.bearingDegrees,null);
 const v=currentObjects.find(o=>o.id==='vatsala-durga');assert.equal(v.rotation.bearingDegrees,180);assert.equal(v.rotation.accessBearingDegrees,270);references(v.rotation.conflictingBearings[0].sourceReferences);
});
test('historical and neighbouring-square structures never leak into current inventory',()=>{
 for(const x of [...historicalExclusions,...outsideTargetExclusions])assert.ok(!currentObjects.some(o=>o.id===x.id));
 assert.ok(historicalExclusions.some(o=>o.id==='lamupati'));
 for(const u of unresolvedResearch){assert.equal(u.position,null);assert.equal(u.footprint,null);assert.equal(u.rotation.bearingDegrees,null);assert.equal(u.accuracyClass,'UNRESOLVED');references(u.sourceReferences);assert.ok(u.notes);}
 for(const id of ['gopinath-krishna','kedarnath','large-bell'])assert.ok(unresolvedResearch.some(o=>o.id===id));
});
test('palace is separated public frontage, not an invented full compound footprint',()=>{
 const front=currentObjects.filter(o=>o.category==='PALACE_FRONTAGE');assert.equal(front.length,2);
 for(const f of front){assert.equal(f.footprintRole,'PUBLIC_EDGE');assert.equal(f.footprint.length,2);assert.equal(f.approximateHeight,null);assert.equal(f.rotation.state,'PLAN_FRONTAGE');}
 assert.equal(currentObjects.find(o=>o.id==='golden-gate').footprint,null);
 assert.equal(currentObjects.find(o=>o.id==='badrinath').footprint,null);
});
test('scale sanity is conditional, area discrepancy stays visible and no false verified geometry appears',()=>{
 assert.ok(squareMetrics.typicalWidthSamples.every(w=>w.width>=20&&w.width<=30));
 assert.ok(squareMetrics.grossArea>4750&&squareMetrics.grossArea<5500);
 assert.ok(squareMetrics.netArea>4750&&squareMetrics.netArea<squareMetrics.grossArea);
 assert.match(squareMetrics.note,/INPUT|input/);assert.match(squareMetrics.note,/no anisotropic/i);
 for(const o of currentObjects){assert.notEqual(o.accuracyClass,'VERIFIED');assert.equal(o.positionEvidence.accuracyClass,'APPROXIMATE');}
 assert.equal(currentObjects.find(o=>o.id==='chyasilin').footprintEvidence.accuracyClass,'APPROXIMATE');
 assert.equal(currentObjects.find(o=>o.id==='main-plaza').footprintEvidence.accuracyClass,'APPROXIMATE');
});
test('Vatsala source components and conflicting plinth values survive without a fabricated total',()=>{
 assert.equal(vatsalaDimensions.superstructureMetres,12.85);assert.equal(vatsalaDimensions.platformMetres,.6);
 assert.deepEqual(vatsalaDimensions.plinthReportedMetres,[2.25,2.75]);assert.deepEqual(vatsalaDimensions.possibleTotalMetres,[15.7,16.2]);assert.equal(vatsalaDimensions.selectedTotalMetres,null);
 assert.equal(vatsalaDimensions.accuracyClass,'SOURCE_DERIVED');assert.equal(currentObjects.find(o=>o.id==='vatsala-durga').approximateHeight,null);
});
test('spatial relationships use valid independently named endpoints and preserve cardinal ordering',()=>{
 for(const r of spatialRelationships){assert.ok(currentObjects.some(o=>o.id===r.from));assert.ok(currentObjects.some(o=>o.id===r.to));references(r.sourceReferences);}
 const pos=id=>currentObjects.find(o=>o.id===id).position;
 assert.ok(pos('siddhi-lakshmi')[0]>pos('chyasilin')[0]);assert.ok(pos('yaksheshwar')[1]>pos('chyasilin')[1]);assert.ok(pos('malla-column')[0]<pos('vatsala-durga')[0]);assert.ok(pos('badrinath')[1]>pos('rameshwar')[1]);
});
test('old comparison rigid registration retains scale and never mutates source geometry',()=>{
 const controls=[[0,0],[80,10]],p=[11,23],q=[55,-9],before=JSON.stringify([controls,p,q]);
 const a=registerOldPoint(p,controls),b=registerOldPoint(q,controls);
 assert.ok(Math.abs(Math.hypot(a[0]-b[0],a[1]-b[1])-Math.hypot(p[0]-q[0],p[1]-q[1]))<1e-8);
 assert.equal(JSON.stringify([controls,p,q]),before);assert.notDeepEqual(registerOldPoint(q,controls,true),b);
});
test('retained plan checksum and original UNESCO trace/calibration remain unchanged',()=>{
 const hash=p=>createHash('sha256').update(readFileSync(new URL(p,import.meta.url))).digest('hex');
 assert.equal(hash('../reference/bhaktapur/digital-himalaya/map.jpg'),planCalibration.image.sha256);
 assert.equal(hash('../src/data/world/unesco-traces.ts'),'56e9db5bd3718da5f14d8378f674189d599f038a9933ea941b406e7c974a764b');
 assert.equal(hash('../src/data/world/map-measurements.ts'),'0a24e0122a5dd66b671bbe746e6098483a1d857cfefb482896bb08f89bea86e0');
});
