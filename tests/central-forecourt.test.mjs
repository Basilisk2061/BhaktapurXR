import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {centralLandmarks,centralRelationships,currentForecourtLandmarks,forecourtReviewObjects,forecourtFittedObjects,sourcePlanRepresentations,photographicObservations,forecourtIds} from '../src/data/reconstruction/central-forecourt.ts';
import {adoptedFit,reviewObjects,presentDayObjects,fittedObjects} from '../src/data/reconstruction/present-day.ts';
import {geographicFrame} from '../src/data/reconstruction/geographic-frame.ts';
import {planToMetres} from '../src/data/reconstruction/calibration.ts';
import {sourceById} from '../src/data/reconstruction/sources.ts';
const references=rs=>{assert.ok(rs.length);rs.forEach(id=>assert.ok(sourceById[id],`Missing source ${id}`));};
test('Phase 6B adopted frame scale, rotation, translation and geographic origin unchanged',()=>{
 assert.equal(adoptedFit.scale,1);assert.equal(adoptedFit.rotationDegrees,-1.3454844413782245);
 assert.equal(adoptedFit.real,.999724283890483);assert.equal(adoptedFit.imaginary,-.02348097527066089);
 assert.deepEqual(adoptedFit.translation,[-135.5122877845299,1.2885277597576867]);
 assert.deepEqual(geographicFrame.origin,{latitude:27.67205,longitude:85.42856});
});
test('all stable geometry and nominal forecourt points preserved across fit comparisons',()=>{
 for(const mode of ['RIGID','TRANSLATION','SIMILARITY']){
 const old=fittedObjects(mode),next=forecourtFittedObjects(mode);assert.equal(old.length,next.length);
 for(const o of old){const n=next.find(n=>n.id===o.id);assert.deepEqual(n.position,o.position);assert.deepEqual(n.footprint,o.footprint);assert.deepEqual(n.rotation,o.rotation);assert.deepEqual(n.geographicPosition,o.geographicPosition);}
 }
 for(const r of centralLandmarks){assert.deepEqual(r.position,reviewObjects.find(o=>o.id===r.id).position);assert.deepEqual(r.previousPosition,presentDayObjects.find(o=>o.id===r.id).position);}
});
test('Malla uses original column icon anchor, never map text-label centre or independently snapped GPS',()=>{
 const m=centralLandmarks.find(r=>r.id==='malla-column');assert.equal(m.planRepresentation,'ICON');assert.deepEqual(m.sourceAnchorPixels,[738,374]);assert.deepEqual(m.position,planToMetres(m.sourceAnchorPixels));assert.match(m.planInterpretation,/not a surveyed footing centre/);assert.match(m.coordinateEvidence,/not snapped/);assert.match(m.planInterpretation,/No visible leader/);
 const gate=sourcePlanRepresentations.find(r=>r.id==='golden-gate');assert.equal(gate.representation,'TEXT_ONLY');assert.equal(gate.sourceAnchorPixels,null);assert.match(gate.notes,/not text centre/);
 for(const r of centralLandmarks)assert.notEqual(r.placementMethod,'TEXT_LABEL_CENTRE');
});
test('every central point has finite nonnegative explicit relative uncertainty; unknown footprints remain null',()=>{
 for(const r of centralLandmarks){assert.ok(r.position.every(Number.isFinite));assert.ok(Number.isFinite(r.positionUncertaintyMeters)&&r.positionUncertaintyMeters>=1);assert.ok(r.uncertaintyBasis&&r.unresolved);assert.equal(r.accuracyClass,'PHOTO_INFERRED');assert.equal(r.presenceStatus,'CONFIRMED_PRESENT');const o=forecourtReviewObjects.find(o=>o.id===r.id);assert.equal(o.positionUncertaintyMeters,r.positionUncertaintyMeters);assert.equal(o.footprint,null);assert.equal(o.approximateHeight,null);assert.equal(o.rotation.bearingDegrees,null);}
 assert.ok(forecourtReviewObjects.find(o=>o.id==='golden-gate').positionUncertaintyMeters>=0);
});
test('large bell and small plinth arch keep distinct identities/forms/points despite ambiguous names',()=>{
 const big=centralLandmarks.find(r=>r.id==='large-bell'),small=centralLandmarks.find(r=>r.id==='vatsala-bell');assert.notEqual(big.identity,small.identity);assert.notDeepEqual(big.position,small.position);assert.match(big.form,/four stone pillars/);assert.match(small.form,/ornate stone columns\/lintel/);assert.match(big.unresolved,/ambiguous textual alias/);assert.ok(big.positionUncertaintyMeters>small.positionUncertaintyMeters);
 for(const b of [big,small]){assert.equal(b.planRepresentation,'NONE');assert.equal(b.sourceAnchorPixels,null);assert.equal(forecourtReviewObjects.find(o=>o.id===b.id).sourcePixels,null);}
});
test('historical-only bell fixture and unresolved identity never enter current landmark selection',()=>{
 const base=centralLandmarks.find(r=>r.id==='large-bell');const records=[base,{...base,id:'historical-test-bell',presenceStatus:'HISTORICAL_ONLY'},{...base,id:'uncertain-test-bell',presenceStatus:'IDENTITY_UNCERTAIN'}];assert.deepEqual(currentForecourtLandmarks(records).map(o=>o.id),['large-bell']);
 assert.equal(photographicObservations.find(o=>o.source==='gate-column-2013').scope,'HISTORICAL_CONTEXT_ONLY');assert.ok(centralLandmarks.every(r=>r.presenceAsOf.includes('2021')||r.presenceAsOf.includes('2024')));
});
test('typed central graph covers all six objects, valid source references and supported cardinal order',()=>{
 const ids=new Set(forecourtIds),covered=new Set(),types=new Set(['NORTH_OF','SOUTH_OF','EAST_OF','WEST_OF','NEAR','ALIGNED_WITH','IN_FRONT_OF','BETWEEN']);
 assert.equal(new Set(centralRelationships.map(r=>r.id)).size,centralRelationships.length);
 for(const r of centralRelationships){assert.ok(ids.has(r.from)&&ids.has(r.to));covered.add(r.from);covered.add(r.to);assert.ok(types.has(r.type));references(r.sourceReferences);assert.equal(r.accuracyClass,'PHOTO_INFERRED');assert.ok(r.observation&&r.limit);const a=reviewObjects.find(o=>o.id===r.from).position,b=reviewObjects.find(o=>o.id===r.to).position;if(r.type==='WEST_OF')assert.ok(a[0]<b[0]);if(r.type==='EAST_OF')assert.ok(a[0]>b[0]);if(r.type==='NORTH_OF')assert.ok(a[1]<b[1]);}
 assert.deepEqual(covered,ids);
});
test('provenance, source licence and accuracy remain explicit; no new VERIFIED classification',()=>{
 for(const r of centralLandmarks){references(r.sourceReferences);assert.notEqual(r.accuracyClass,'VERIFIED');assert.ok(r.coordinateEvidence&&r.planInterpretation);}
 for(const p of photographicObservations){references([p.source]);const s=sourceById[p.source];assert.ok(s.author&&s.url&&s.license);assert.match(s.license,/CC BY-SA/);}
 for(const o of forecourtReviewObjects){assert.notEqual(o.accuracyClass,'VERIFIED');if(o.positionUncertaintyMeters!==undefined)assert.ok(Number.isFinite(o.positionUncertaintyMeters)&&o.positionUncertaintyMeters>=0);}
});
test('original Phase 6B fit/geometry/source evidence files retained exactly after newline normalization',()=>{
 const hashes={'present-day.ts':'677d27229f2bb72006423b8d691e2787cd8462c2cb2b8999388635659afc15c5','geographic-frame.ts':'0eba93f71968b7bec5518b24ea80daccc53e09f6a111d275da2db06a19a2fa9e','geospatial-anchors.ts':'2344b2182d5d3162ac117a7fe71544b05d013de5e89ad14c44749930435deef3','open-spaces.ts':'b2e28e1699b07bf530e87a1cc736ec1638f7e454c54a9584bbff5e80a210d7be'};
 for(const [file,hash] of Object.entries(hashes)){const text=readFileSync(new URL('../src/data/reconstruction/'+file,import.meta.url),'utf8').replaceAll('\r\n','\n');assert.equal(createHash('sha256').update(text).digest('hex'),hash);}
 for(const o of reviewObjects)assert.deepEqual(forecourtReviewObjects.find(r=>r.id===o.id).sourcePixels,o.sourcePixels);
});
