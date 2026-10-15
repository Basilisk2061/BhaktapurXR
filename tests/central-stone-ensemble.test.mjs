import editorFrames from "../src/game/architecture/central-ensemble-editor-frames.json" with {type:"json"};
import {finishCentralStoneMaterials} from "../src/game/architecture/central-stone-materials.ts";
import assert from "node:assert/strict";
import {test} from "node:test";
import RAPIER from "@dimforge/rapier3d-compat";
import {buildCompletedSquareModels} from "../src/game/architecture/square-completion.ts";
import {buildPalaceFrontageModels} from "../src/game/architecture/palace-frontage-models.ts";
import {centralEnsembleIds,centralEnsembleVisualCorrections,refineCentralStoneEnsemble,vatsalaPlinthStages} from "../src/game/architecture/central-stone-ensemble.ts";
import {partitionArchitecturalParts} from "../src/features/world-editor/parts.ts";
import {getEditableRegistry,getEditableParts} from "../src/features/world-editor/registry.ts";
import {squareCompletionReviewCamera} from "../src/game/world/square-completion-review.ts";
import {createCharacterController,stepCharacter} from "../src/game/player/character-physics.ts";
import {createPlayerRuntime} from "../src/game/player/player-runtime.ts";
import {playerConfig} from "../src/game/player/player-config.ts";
const models=buildCompletedSquareModels(),originals=buildPalaceFrontageModels(),v=models.find(m=>m.id==="vatsala-durga");
test("central ensemble retains anchors, evidence, assembly IDs and saved part frames",()=>{
 for(const id of centralEnsembleIds){const old=originals.find(m=>m.id===id),m=models.find(m=>m.id===id);assert.equal(models.filter(m=>m.id===id).length,1);const correction=centralEnsembleVisualCorrections[id];assert.deepEqual(m.origin,correction?[...correction.newPosition]:old.origin);assert.equal(m.yaw,correction?.newYaw??old.yaw);assert.equal(m.accuracy,old.accuracy);const parts=partitionArchitecturalParts(m);for(const [partId,frame]of Object.entries(editorFrames[id])){assert.deepEqual(parts.find(p=>p.id===partId).source,frame);assert.ok(getEditableParts().some(p=>p.id===partId));}assert.ok(getEditableRegistry().some(p=>p.id===id));assert.equal(parts.reduce((n,p)=>n+p.colliderCount,0),m.colliders.length);}
 const other=originals.find(m=>m.id==="chyasilin");assert.equal(refineCentralStoneEnsemble(other),other);
});
test("replacement geometry is deterministic, finite and uses scoped aged stone",()=>{
 for(const id of centralEnsembleIds){const m=models.find(m=>m.id===id);assert.deepEqual(refineCentralStoneEnsemble(originals.find(m=>m.id===id)),m);assert.ok([...m.boxes,...m.profiles,...m.shapes].every(p=>p.position.every(Number.isFinite)));assert.ok(![...m.boxes,...m.profiles,...m.shapes].some(p=>p.material==="stone"||p.material==="gold"));const signatures=m.boxes.filter(p=>!p.role.includes("collision")).map(p=>JSON.stringify([p.position,p.size,p.yaw]));assert.equal(new Set(signatures).size,signatures.length);for(const c of m.colliders)assert.ok(m.boxes.some(b=>JSON.stringify([b.position,b.size,b.yaw])===JSON.stringify([c.position,c.size,c.yaw])));}
 assert.equal(models.filter(m=>centralEnsembleIds.includes(m.id)).flatMap(m=>m.profiles).filter(p=>p.role==="large-hollow-bell").length,1);assert.equal(v.profiles.filter(p=>p.role==="vatsala-main-shikhara").length,1);assert.equal(v.profiles.filter(p=>p.role==="vatsala-subsidiary-spire-crown").length,4);
});
test("coursed bell terrace meets the temple without overlapping its solids; column stays outside",()=>{
 const bell=models.find(m=>m.id==="large-bell"),column=models.find(m=>m.id==="malla-column"),terrace=bell.boxes.filter(b=>/^bell-terrace-(course|coping)$/.test(b.role)),temple=v.boxes.filter(b=>/stepped-base-course|platform-neck|platform-coping|platform-landing/.test(b.role));
 const extent=(a,k)=>k===1?a.size[1]:Math.abs(Math.cos(a.yaw))*a.size[k]+Math.abs(Math.sin(a.yaw))*a.size[2-k];const intersects=(a,b)=>[0,1,2].every(k=>Math.min(a.position[k]+extent(a,k)/2,b.position[k]+extent(b,k)/2)-Math.max(a.position[k]-extent(a,k)/2,b.position[k]-extent(b,k)/2)>1e-5);
 assert.ok(terrace.length>10);assert.ok(terrace.every(b=>b.size[0]>=7));for(const a of terrace)for(const b of temple)assert.ok(!intersects(a,b),"butt joint must not contain overlapping solids");for(const a of terrace)for(const b of column.boxes.filter(b=>/plinth-course/.test(b.role)))assert.ok(!intersects(a,b),"column footing must remain outside terrace");
 const small=models.find(m=>m.id==="vatsala-bell");assert.equal(small.boxes.filter(b=>/small-bell-platform/.test(b.role)).length,0,"no independent small-bell podium remains");assert.ok(!small.boxes.some(b=>/stair/.test(b.role)));
 assert.equal(vatsalaPlinthStages.length,3);for(let i=1;i<3;i++){const lower=vatsalaPlinthStages[i-1],upper=vatsalaPlinthStages[i];assert.ok(lower.front<upper.front&&lower.back>upper.back&&lower.north<upper.north&&lower.south>upper.south);assert.equal(lower.top,upper.bottom);}
 for(const post of small.profiles.filter(p=>p.role==="bell-arch-column")){assert.ok(temple.some(b=>Math.abs(post.position[0]-b.position[0])<b.size[0]/2&&Math.abs(post.position[2]-b.position[2])<b.size[2]/2&&Math.abs(b.position[1]+b.size[1]/2-post.position[1])<.001),"both bell supports must land on the shared temple plinth");}
 const shaft=column.profiles.find(p=>p.role==="malla-shaft");assert.equal(shaft.segments,8);assert.ok(shaft.profile.some(p=>p[0]>=.5));assert.ok(column.origin[0]<-20);assert.ok(Math.min(...terrace.map(b=>b.position[2]-b.size[2]/2))<-2.4);
 assert.ok(terrace.some(a=>temple.some(b=>Math.abs(a.position[2]+a.size[2]/2-(b.position[2]-b.size[2]/2))<.02)),"terrace must meet temple at a narrow masonry joint");
 const stairs=v.boxes.filter(b=>b.role==="vatsala-west-access-stair");assert.equal(stairs.length,16);for(const step of stairs){const top=step.position[1]+step.size[1]/2;assert.ok(!temple.some(b=>Math.abs(step.position[0]-b.position[0])<b.size[0]/2-.001&&Math.abs(step.position[2]-b.position[2])<b.size[2]/2-.001&&b.position[1]+b.size[1]/2>top+.03));}
});

test("the lower-front plinth review camera resolves",()=>{for(const name of ["vatsala-plinth-final"]){const camera=squareCompletionReviewCamera(name);assert.ok(camera.position.every(Number.isFinite));assert.ok(Number.isFinite(camera.yaw));}});
await RAPIER.init();
test("player climbs temple stairs and collides with temple posts and bell piers",()=>{
 const w=new RAPIER.World({x:0,y:-9.81,z:0});w.createCollider(RAPIER.ColliderDesc.cuboid(170,.25,170).setTranslation(-40,-.25,0));for(const id of centralEnsembleIds)for(const c of models.find(m=>m.id===id).colliders)w.createCollider(RAPIER.ColliderDesc.cuboid(...c.size.map(v=>v/2)).setTranslation(...c.position).setRotation({x:0,y:Math.sin(c.yaw/2),z:0,w:Math.cos(c.yaw/2)}));
 const walk=(start,velocity,frames)=>{const body=w.createRigidBody(RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(...start)),collider=w.createCollider(RAPIER.ColliderDesc.capsule(playerConfig.capsuleHalfSegment,playerConfig.radius),body),controller=createCharacterController(w,playerConfig),runtime=createPlayerRuntime();w.step();for(let i=0;i<frames;i++){runtime.velocity.x=velocity[0];runtime.velocity.z=velocity[1];stepCharacter(body,collider,controller,runtime,1/60,playerConfig,-9.81,RAPIER.QueryFilterFlags.EXCLUDE_SENSORS);w.step();}const p=body.translation();w.removeCharacterController(controller);w.removeRigidBody(body);return p;};
 try{const p=walk([v.origin[0]-6.6,.925,v.origin[1]],[1.8,0],260);assert.ok(p.y>3.5,"stair collider channel must reach temple landing");assert.ok(p.x>v.origin[0]-3.0,"central west stair opening must remain accessible");for(const [x,z,top]of [[v.origin[0]-4.7,v.origin[1]+4.7,.84],[v.origin[0]-3,v.origin[1]+2.5,1.68],[v.origin[0]+1,v.origin[1]+1,3.1]]){const standing=walk([x,top+2.4,z],[0,0],180);assert.ok(standing.y>top+.8,"each accessible terrace must support a standing player");}
 const b=models.find(m=>m.id==="large-bell"),q=walk([b.origin[0]-1.65,3.525,b.origin[1]-1.4],[0,1.5],140);assert.ok(q.z<b.origin[1]-.9,"bell massive front pier must stop player");}finally{w.free();}
});

test("aged stone grain stays neutral, bounded and shared without downloaded textures",()=>{const materials=finishCentralStoneMaterials({}),a=materials.heritageStone,b=materials.heritageStoneShade;assert.equal(a.map,b.map);assert.equal(a.map.image.width,128);assert.ok(a.roughness>=.95);for(let i=0;i<a.map.image.data.length;i+=4){const pixels=a.map.image.data;assert.ok(pixels[i]>=210&&pixels[i]<=240);assert.ok(Math.abs(pixels[i]-pixels[i+1])<=1);assert.equal(pixels[i],pixels[i+2]);}a.map.dispose();for(const m of Object.values(materials))m.dispose();});

test("authoritative two-pier photo replaces the pavilion and bell-only stairs",()=>{
 const b=models.find(m=>m.id==="large-bell"),small=models.find(m=>m.id==="vatsala-bell"),column=models.find(m=>m.id==="malla-column");assert.equal(small.yaw,-Math.PI/2);assert.ok(column.origin[0]<b.origin[0]-4);
 const piers=b.boxes.filter(p=>/^bell-(left|right)-pier-shaft$/.test(p.role));assert.equal(piers.length,2);assert.ok(piers.every(p=>p.size[0]>=1&&p.size[2]>=1.4&&p.size[1]>=4.7));assert.ok(!b.boxes.some(p=>/stair|bell-support-massive-pier/.test(p.role)));assert.equal(b.profiles.filter(p=>p.role==="large-hollow-bell").length,1);assert.ok(Math.max(...b.profiles.find(p=>p.role==="large-hollow-bell").profile.map(p=>p[0]))>1);
 for(const [id,parts]of [["large-bell",["left-pier","right-pier","roof","bell","suspension","terrace"]],["malla-column",["shaft","capital","statue","pole","umbrella"]],["vatsala-bell",["left-post","right-post","crosspiece","bell"]],["vatsala-durga",["plinth","stairs","columns","shikhara","subsidiary-towers","guardians"]]])for(const key of parts)assert.ok(getEditableParts().some(p=>p.id===id+"/"+key));
 assert.equal(v.boxes.filter(p=>p.role==="vatsala-stair-guardian-pedestal-foot").length,2);for(const foot of v.boxes.filter(p=>p.role==="vatsala-stair-guardian-pedestal-foot"))assert.ok(Math.abs(foot.position[1]-foot.size[1]/2-.84)<1e-6);
 assert.equal(v.profiles.filter(p=>p.role==="vatsala-stair-guardian-head").length,2);for(const p of v.profiles.filter(p=>p.sculptedSurface)){assert.ok(p.sculptedSurface.positions.every(Number.isFinite));assert.ok(p.sculptedSurface.indices.every(i=>i>=0&&i<p.sculptedSurface.positions.length/3));}
});
