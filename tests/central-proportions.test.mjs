import assert from 'node:assert/strict';
import {test} from 'node:test';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {buildCentralModels,centralGround} from '../src/game/architecture/central-model.ts';
import {proportionReview,proportionParameters} from '../src/data/reconstruction/architecture/proportions.ts';
import {specificationById,vatsalaWorkingDimensions,architectureSourceById,frozenArchitectureAnchors} from '../src/data/reconstruction/architecture/specifications.ts';
const models=buildCentralModels(),get=id=>models.find(m=>m.id===id),hash=o=>createHash('sha256').update(JSON.stringify(o)).digest('hex');
test('Phase 7A.1 keeps complete Malla and bell model geometry/collision unchanged from Phase 7A',()=>{
 const hashes={'malla-column':'5d5a9b797cb5289cd55113b8b6a9538a7bf74c6579caf63e8d7f6662fba6fec2','large-bell':'4979f317877d9abd2e7b9b774f6f3ce91dc1cdba1c05f576f200ce8b569f169d','vatsala-bell':'5ae31f614f92dc98b9b5d324dbf446ca0282e18cce555ca0da098b31602d4259'};
 for(const [id,expected]of Object.entries(hashes))assert.equal(hash(get(id)),expected);
});
test('frozen anchors, ground/open-space presentation and all five review spawns unchanged',()=>{
 for(const m of models)assert.deepEqual(m.origin,frozenArchitectureAnchors.find(a=>a.id===m.anchorId).position);
 assert.equal(hash(centralGround),'2b0fa5b06e4d07f3efc93b2ab52abd7745ed5262cf2bddfe20a04d5cff677328');
 const text=readFileSync(new URL('../src/game/world/review-spawn.ts',import.meta.url),'utf8').replaceAll('\r\n','\n');assert.equal(createHash('sha256').update(text).digest('hex'),'0047dbeb13578d70bc754ffd1d11ee789d0fa935978720b54d86dfd7dc49ec80');
});
test('photo proportion reviews are explicitly approximate with valid reused sources and model targets',()=>{
 assert.equal(proportionReview.length,12);
 for(const r of proportionReview){assert.equal(r.evidenceType,'PHOTO_PROPORTION');assert.ok(r.basis&&r.sourceReferences.length);for(const id of r.sourceReferences)assert.ok(architectureSourceById[id]);assert.ok(Number.isFinite(r.previousModelRatio)&&r.previousModelRatio>0);assert.ok(Number.isFinite(r.workingModelRatio)&&r.workingModelRatio>0);if(r.observedScreenRange)assert.ok(r.observedScreenRange.every(Number.isFinite)&&r.observedScreenRange[0]<=r.observedScreenRange[1]);else assert.match(r.basis,/not a (measured photographic|calibrated total)/);assert.ok(specificationById[r.landmarkId].photoProportions.some(p=>p.ratio===r.ratio));}
});
test('Vatsala narrowing preserves documented vertical values and actual 15.95 m model top',()=>{
 assert.equal(vatsalaWorkingDimensions.superstructure.value,12.85);assert.equal(vatsalaWorkingDimensions.platform.value,.6);assert.deepEqual(vatsalaWorkingDimensions.plinthAlternatives,[2.25,2.75]);assert.equal(specificationById['vatsala-durga'].overallHeight.value,15.95);assert.equal(specificationById['vatsala-durga'].overallHeight.evidenceType,'ARCHITECTURAL_INFERENCE');
 const v=get('vatsala-durga'),top=Math.max(...v.profiles.flatMap(p=>p.profile.map(([,y])=>y+p.position[1])));assert.ok(Math.abs(top-15.95)<1e-10);
 const terraces=v.boxes.filter(b=>b.role==='stepped-base');assert.equal(terraces[0].size[0],5.8);assert.ok(terraces.at(-1).size[0]/terraces[0].size[0]<.8);assert.ok(v.boxes.filter(b=>b.role==='vatsala-colonnade-entablature').every(b=>b.size[0]<=4.45));assert.equal(v.profiles.filter(p=>p.role==='vatsala-twelve-column').length,12);assert.equal(v.roofs.length,0);
});
test('gallery lower arcade differs from upper rooms; palace keeps continuous grouped dark gallery',()=>{
 const gallery=get('gallery-frontage'),palace=get('fifty-five-frontage');assert.equal(gallery.shapes.filter(s=>s.role==='gallery-arched-opening').length,7);assert.equal(gallery.shapes.filter(s=>s.role==='gallery-upper-arched-room').length,5);assert.ok(!gallery.boxes.some(b=>b.role==='gallery-red-shutters'));assert.equal(gallery.boxes.filter(b=>b.role==='gallery-upper-paired-shutter').length,10);
 assert.ok(palace.boxes.some(b=>b.role==='continuous-carved-gallery'));assert.ok(palace.boxes.some(b=>b.role==='gallery-group-mullion'));assert.ok(!gallery.boxes.some(b=>b.role==='continuous-carved-gallery'));assert.equal(proportionParameters.palace.groupModules.reduce((a,b)=>a+b),25);
});
test('Golden Gate aperture stays fixed, relief projects and rear tile roof cannot bury canopy',()=>{
 const gate=get('golden-gate'),metal=gate.roofs.find(r=>r.role==='golden-gate-swept-canopy'),tile=gate.roofs.find(r=>r.role==='gateway-rear-tile-roof'),yaw=gate.yaw;
 const localZ=r=>(r.position[0]-gate.origin[0])*Math.sin(yaw)+(r.position[2]-gate.origin[1])*Math.cos(yaw);
 assert.ok(localZ(metal)+metal.depth/2>localZ(tile)+tile.depth/2+1);assert.ok(gate.shapes.find(s=>s.role==='gate-lobed-torana').depth>=.55);
 const jambs=gate.boxes.filter(b=>b.role==='gate-relief-jamb');assert.equal(jambs.length,2);assert.equal(jambs[0].size[0],.32);assert.equal(jambs[0].size[1],3.25);assert.ok(Math.hypot(...gate.origin.map((v,i)=>v-get('gate-frontage').origin[i]))<1);
});
test('Chyasilin stays open and octagonal with thinner eaves and taller structural levels',()=>{
 const c=get('chyasilin'),roofs=c.profiles.filter(p=>p.role==='octagonal-pavilion-roof');assert.equal(roofs.length,2);assert.ok(roofs.every(r=>r.segments===8));assert.equal(c.boxes.filter(b=>b.role==='pavilion-post'&&b.size[1]===3.35).length,8);assert.equal(c.boxes.filter(b=>b.role==='pavilion-post'&&b.size[1]===2.05).length,8);assert.ok(!c.boxes.some(b=>b.role==='window-frame'||b.role==='window-recess'));assert.ok(c.profiles.filter(p=>p.role==='pavilion-eaves').every(p=>p.profile[2][1]<.1));
});
