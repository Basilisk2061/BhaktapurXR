import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {geographicFrame,geographicToLocal,localToGeographic,validateGeographic,applyFit,inverseFit,fitGeoreference,duplicateCoordinateIds,usableAnchors} from '../src/data/reconstruction/geographic-frame.ts';
import {geospatialAnchors} from '../src/data/reconstruction/geospatial-anchors.ts';
import {reviewObjects,presentDayObjects,presentDayUnresolved,georeferenceFits,adoptedFit,evaluatedAnchors,planPositions,presenceAudit,relationshipEvidence,fittedObjects} from '../src/data/reconstruction/present-day.ts';
import {openSpaces,openSpaceCategories} from '../src/data/reconstruction/open-spaces.ts';
import {currentObjects,historicalExclusions,outsideTargetExclusions,vatsalaDimensions} from '../src/data/reconstruction/bhaktapur-current.ts';
import {sourceById} from '../src/data/reconstruction/sources.ts';
const approx=(a,b,tolerance=1e-8)=>assert.ok(Math.abs(a-b)<tolerance,`${a} != ${b}`);
const refs=rs=>{assert.ok(rs.length);rs.forEach(r=>assert.ok(sourceById[r],`Missing source ${r}`));};
test('WGS84 local frame validates coordinates and reversibly converts east/south metres',()=>{
 assert.equal(geographicFrame.accuracyClass,'APPROXIMATE');assert.deepEqual(geographicToLocal(geographicFrame.origin),[0,-0]);
 for(const p of [{latitude:27.67176,longitude:85.42846},{latitude:27.6724,longitude:85.42902}]){validateGeographic(p);const local=geographicToLocal(p),back=localToGeographic(local);assert.deepEqual(local,geographicToLocal(p));approx(back.latitude,p.latitude);approx(back.longitude,p.longitude);}
 assert.ok(geographicToLocal({latitude:27.672,longitude:85.4286}).every(n=>n>0));
 for(const p of [{latitude:91,longitude:0},{latitude:0,longitude:181},{latitude:NaN,longitude:0},{latitude:0,longitude:Infinity}])assert.throws(()=>validateGeographic(p));
 assert.throws(()=>localToGeographic([NaN,0]));
});
test('all geospatial records have valid role, provenance and coordinates; camera never becomes a fit control',()=>{
 for(const a of geospatialAnchors){validateGeographic(a.coordinate);refs(a.evidence.sourceReferences);assert.ok(a.evidence.provenance&&a.evidence.independenceGroup);assert.notEqual(a.status,'CONSISTENT');}
 const malicious=geospatialAnchors.map(a=>({...a,fitEligible:true,status:a.evidence.role==='CAMERA_LOCATION'?'LOW_PRECISION':a.status}));
 assert.ok(usableAnchors(malicious).every(a=>a.evidence.role==='OBJECT_LOCATION'));
 for(const mode of Object.keys(georeferenceFits)){const fit=georeferenceFits[mode];assert.ok(fit.anchorIds.every(id=>geospatialAnchors.find(a=>a.id===id).evidence.role==='OBJECT_LOCATION'));}
 for(const o of presentDayObjects)if(o.geographicEvidence){refs(o.geographicEvidence.sourceReferences);assert.ok(o.geographicEvidence.sourceReferences.every(id=>!sourceById[id].notes.includes('camera coordinate')));assert.match(o.geographicEvidence.provenance,/NOT observed/);}
});
test('suspicious duplicate coordinate pair is detected and excluded even if eligible flag is accidentally enabled',()=>{
 const dup=duplicateCoordinateIds(geospatialAnchors);for(const id of ['vatsala-duplicate-report','yaksheshwar-duplicate-report']){assert.ok(dup.has(id));assert.equal(geospatialAnchors.find(a=>a.id===id).status,'DUPLICATED_SUSPECT');}
 const pair=geospatialAnchors.filter(a=>dup.has(a.id)).map(a=>({...a,status:'LOW_PRECISION',fitEligible:true,evidence:{...a.evidence,role:'OBJECT_LOCATION'}}));assert.equal(usableAnchors(pair).length,0);
});
test('outliers and uncertain reported coordinates cannot silently enter fit',()=>{
 const list=geospatialAnchors.map(a=>({...a,fitEligible:true}));const result=usableAnchors(list);
 assert.ok(result.every(a=>!['OUTLIER','UNRESOLVED','DUPLICATED_SUSPECT','CAMERA_POSITION_ONLY'].includes(a.status)));
 const held=evaluatedAnchors();for(const a of held.filter(a=>a.status==='OUTLIER')){assert.equal(a.usedInFit,false);assert.ok(a.residual>20);}
 for(const id of ['siddhi-brief','malla-brief','siddhi-osm','palace-object'])assert.equal(held.find(a=>a.id===id).usedInFit,false);
});
test('least squares frame is deterministic and has uniform scale, orthogonal axes and finite residuals',()=>{
 for(const [mode,f] of Object.entries(georeferenceFits)){
 assert.deepEqual(f,fitGeoreference(geospatialAnchors,planPositions,mode));const x=applyFit([1,0],f),z=applyFit([0,1],f),o=applyFit([0,0],f);const dx=x.map((v,i)=>v-o[i]),dz=z.map((v,i)=>v-o[i]);approx(Math.hypot(...dx),f.scale);approx(Math.hypot(...dz),f.scale);approx(dx[0]*dz[0]+dx[1]*dz[1],0);
 for(const a of evaluatedAnchors(mode)){assert.ok(a.residual===null||Number.isFinite(a.residual));if(a.evidence.role==='CAMERA_LOCATION')assert.equal(a.residual,null);}
 for(const p of [[10,20],[-15,5]]){const back=inverseFit(applyFit(p,f),f);p.forEach((v,i)=>approx(v,back[i]));}
 const distance=Math.hypot(planPositions.chyasilin[0]-planPositions.yaksheshwar[0],planPositions.chyasilin[1]-planPositions.yaksheshwar[1]);const a=applyFit(planPositions.chyasilin,f),b=applyFit(planPositions.yaksheshwar,f);approx(Math.hypot(a[0]-b[0],a[1]-b[1]),distance*f.scale);
 }
 assert.equal(adoptedFit.mode,'RIGID');assert.equal(adoptedFit.scale,1);assert.ok(georeferenceFits.SIMILARITY.scale>1.1);assert.ok(georeferenceFits.SIMILARITY.rmsResidual<adoptedFit.rmsResidual);
 assert.throws(()=>fitGeoreference([],planPositions,'RIGID'));assert.throws(()=>fitGeoreference(geospatialAnchors,{},'RIGID'));
});
test('original Phase 6A raw source evidence and immutable UNESCO traces are byte-identical',()=>{
 const hash=p=>createHash('sha256').update(readFileSync(new URL(p,import.meta.url))).digest('hex');
 assert.equal(hash('../src/data/reconstruction/bhaktapur-current.ts'),'c48c55968571e4f57d1acc5cbffffe085a40be7a6809c9ed437275ec7c0a1803');
 assert.equal(hash('../src/data/world/unesco-traces.ts'),'56e9db5bd3718da5f14d8378f674189d599f038a9933ea941b406e7c974a764b');
 assert.equal(hash('../src/data/world/map-measurements.ts'),'0a24e0122a5dd66b671bbe746e6098483a1d857cfefb482896bb08f89bea86e0');
 for(const o of currentObjects){const derived=presentDayObjects.find(p=>p.id===o.id);assert.deepEqual(derived.sourcePixels,o.sourcePixels);assert.deepEqual(derived.position,applyFit(o.position,adoptedFit));assert.deepEqual(derived.footprint,o.footprint?.map(p=>applyFit(p,adoptedFit))??null);}
});
test('all current objects audited; historical and other-square structures excluded; uncertain identities stay explicit',()=>{
 assert.equal(new Set(reviewObjects.map(o=>o.id)).size,reviewObjects.length);
 for(const o of [...reviewObjects,...presentDayUnresolved]){assert.ok(presenceAudit.some(a=>a[0]===o.id));refs(o.sourceReferences);for(const e of [o.positionEvidence,o.footprintEvidence,o.heightEvidence,o.rotation])refs(e.sourceReferences);assert.notEqual(o.accuracyClass,'VERIFIED');assert.equal(o.approximateHeight,null);}
 for(const h of [...historicalExclusions,...outsideTargetExclusions])assert.ok(!presentDayObjects.some(o=>o.id===h.id));
 assert.ok(presenceAudit.some(a=>a[0]==='lamupati'&&a[1]==='HISTORICAL_ONLY'));
 for(const id of ['kedarnath','eastern-vatsala','golden-spout']){const o=presentDayUnresolved.find(o=>o.id===id);assert.ok(o);assert.equal(o.position,null);assert.equal(o.rotation.bearingDegrees,null);assert.equal(o.accuracyClass,'UNRESOLVED');}
 assert.match(reviewObjects.find(o=>o.id==='gopinath-krishna').notes,/PROVISIONALLY_IDENTIFIED/);
 for(const id of ['large-bell','vatsala-bell']){const b=reviewObjects.find(o=>o.id===id);assert.equal(b.accuracyClass,'PHOTO_INFERRED');assert.equal(b.sourcePixels,null);assert.equal(b.footprint,null);assert.ok(!georeferenceFits.RIGID.anchorIds.some(a=>geospatialAnchors.find(g=>g.id===a).monumentId===id));}
});
test('six open-space categories are sourced and finite; broad envelopes do not move monuments',()=>{
 assert.deepEqual(new Set(openSpaces.map(s=>s.category)),new Set(openSpaceCategories));
 for(const s of openSpaces){refs(s.sourceReferences);assert.ok(s.notes);assert.notEqual(s.accuracyClass,'VERIFIED');s.polygon.forEach(p=>assert.ok(p.every(Number.isFinite)));}
 assert.deepEqual(openSpaces.find(s=>s.category==='PRIMARY_PLAZA').polygon,currentObjects.find(o=>o.id==='main-plaza').footprint);
 for(const id of ['silu-mahadev','yaksheshwar'])assert.deepEqual(reviewObjects.find(o=>o.id===id).position,currentObjects.find(o=>o.id===id).position);
});
test('relationships reference current or explicitly unresolved endpoints and valid sources',()=>{
 const ids=new Set([...reviewObjects,...presentDayUnresolved].map(o=>o.id));for(const r of relationshipEvidence){assert.ok(ids.has(r.from)&&ids.has(r.to));refs(r.sourceReferences);assert.ok(r.finding);}
 assert.equal(relationshipEvidence.find(r=>r.to==='eastern-vatsala').status,'UNRESOLVED');
});
test('documented facing and stair directions remain absolute and separate while plan axes rotate coherently',()=>{
 for(const mode of Object.keys(georeferenceFits)){const v=fittedObjects(mode).find(o=>o.id==='vatsala-durga');assert.equal(v.rotation.bearingDegrees,180);assert.equal(v.rotation.accessBearingDegrees,270);const ch=fittedObjects(mode).find(o=>o.id==='chyasilin');assert.equal(ch.rotation.bearingDegrees,null);}
 assert.equal(vatsalaDimensions.selectedTotalMetres,null);assert.deepEqual(vatsalaDimensions.plinthReportedMetres,[2.25,2.75]);
 assert.equal(reviewObjects.filter(o=>o.category==='PALACE_FRONTAGE').length,4);assert.equal(reviewObjects.find(o=>o.id==='golden-gate').footprint,null);
});
