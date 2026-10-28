import {measureShoeGrounding} from "./player-animation-grounding.mjs";
import {retargetPlayerCrouch} from './player-animation-retarget.mjs';
import fs from 'node:fs/promises';
import path from 'node:path';
import {FBXLoader} from 'three/addons/loaders/FBXLoader.js';
import {GLTFExporter} from 'three/addons/exporters/GLTFExporter.js';
import {mergeVertices} from 'three/addons/utils/BufferGeometryUtils.js';
import {TextureLoader,Texture,MeshStandardMaterial,AnimationMixer,Group,Box3} from 'three';
import sharp from 'sharp';
// Import only: ignore FBX's embedded/missing textures, then attach the verified Meshy maps.
TextureLoader.prototype.load=()=>new Texture();
globalThis.FileReader=class {readAsArrayBuffer(blob){blob.arrayBuffer().then(b=>{this.result=b;this.onloadend?.();});}};
const source='incoming/player-character',out='public/assets/characters/player',prefix='Meshy_AI_Himalayan_Grace_1015105313_texture';
async function load(file){const b=await fs.readFile(path.join(source,file));return new FBXLoader().parse(b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength),'');}
const master=await load('player_Idle.fbx'),original=await load(prefix+'.fbx');let mesh,sourceMesh;master.traverse(o=>{if(o.isSkinnedMesh)mesh=o;});original.traverse(o=>{if(o.isMesh)sourceMesh=o;});
const uv=mesh.geometry.attributes.uv.array,originalUV=sourceMesh.geometry.attributes.uv.array;
if(uv.length!==originalUV.length||uv.some((v,i)=>Math.abs(v-originalUV[i])>1e-6))throw Error('Source/rig UV mismatch');
mesh.geometry=mergeVertices(mesh.geometry,1e-6);mesh.normalizeSkinWeights();mesh.material=new MeshStandardMaterial({name:'Nepali traditional clothing and skin',color:0xffffff,roughness:1,metalness:1});
const clips=[];
for(const [name,file]of [['Idle','player_Idle.fbx'],['Walk','player_walk.fbx'],['Run','player_running.fbx'],['Jump','player_jumping.fbx'],['Sit','player_sitting.fbx']]){
 const clip=(name==='Idle'?master:await load(file)).animations[0].clone();clip.name=name;
 for(const t of clip.tracks){const node=t.name.split('.')[0];if(!master.getObjectByName(node))throw Error('Missing animation bone '+node);if(t.name.endsWith('.position'))for(let i=0;i<t.values.length;i+=3){t.values[i]=0;t.values[i+2]=0;if(name==='Jump')t.values[i+1]=master.animations[0].tracks.find(t=>t.name==='mixamorigHips.position').values[1];}}
 clips.push(clip);
}
const crouch=retargetPlayerCrouch(await load('crouch_idle_meshy_mixamo.fbx'),master,await load('meshy_mixamo_character_reference.fbx'));clips.push(crouch.clip);
// Matched gait phases at frames 5 and 55 reduce the original ~48-degree foot seam
// to <5 degrees across essential lower-body rotations, without editing retained poses.
const crouchWalk=retargetPlayerCrouch(await load('crouch_walk_forward_meshy_mixamo.fbx'),master,await load('crouch_walk_meshy_character_reference.fbx'),{name:'CrouchWalk',inPlace:true,start:5/30,end:55/30,source:'incoming/player-character/crouch_walk_forward_meshy_mixamo.fbx',reference:'incoming/player-character/crouch_walk_meshy_character_reference.fbx'});clips.push(crouchWalk.clip);
console.log('=== Meshy Crouch Idle ===\n'+JSON.stringify({...crouch.report,ignoredOptionalBones:crouch.report.ignoredOptionalBones.length+' facial/finger/end helpers (full list in crouch-import.json)'},null,2));
const mixer=new AnimationMixer(master);mixer.clipAction(clips[0]).play();mixer.update(0);master.updateMatrixWorld(true);
const bounds=new Box3().setFromObject(master,true),height=bounds.max.y-bounds.min.y,scale=1.74/height;
const root=new Group();root.name='NepaliPlayer';root.scale.setScalar(scale);root.rotation.y=Math.PI;root.position.y=-bounds.min.y*scale;root.add(master);root.updateMatrixWorld(true);
const glb=await new GLTFExporter().parseAsync(root,{binary:true,animations:clips,onlyVisible:true});mixer.stopAllAction();mixer.uncacheRoot(master);
await fs.mkdir(out,{recursive:true});
if(!process.argv.includes('--animations-only')){
await sharp(path.join(source,prefix+'.png')).flip().jpeg({quality:92,chromaSubsampling:'4:4:4'}).toFile(path.join(out,'base-color.jpg'));
await sharp(path.join(source,prefix+'_normal.png')).flip().resize(1024,1024).png().toFile(path.join(out,'normal.png'));
const rough=await sharp(path.join(source,prefix+'_roughness.png')).flip().resize(1024,1024).greyscale().raw().toBuffer(),metal=await sharp(path.join(source,prefix+'_metallic.png')).flip().resize(1024,1024).greyscale().raw().toBuffer(),packed=Buffer.alloc(1024*1024*3);for(let i=0;i<rough.length;i++){packed[i*3]=255;packed[i*3+1]=rough[i];packed[i*3+2]=metal[i];}await sharp(packed,{raw:{width:1024,height:1024,channels:3}}).png().toFile(path.join(out,'metallic-roughness.png'));
}
// Add external images without canvas/DOM dependencies in the offline exporter.
const data=Buffer.from(glb),jsonLength=data.readUInt32LE(12),json=JSON.parse(data.subarray(20,20+jsonLength).toString()),bin=data.subarray(20+jsonLength);
json.images=[{uri:'base-color.jpg'},{uri:'normal.png'},{uri:'metallic-roughness.png'}];json.samplers=[{magFilter:9729,minFilter:9987,wrapS:10497,wrapT:10497}];json.textures=json.images.map((_,source)=>({sampler:0,source}));const mat=json.materials[0];mat.pbrMetallicRoughness.baseColorTexture={index:0};mat.pbrMetallicRoughness.metallicRoughnessTexture={index:2};mat.normalTexture={index:1};
let j=Buffer.from(JSON.stringify(json));j=Buffer.concat([j,Buffer.alloc((4-j.length%4)%4,32)]);const header=Buffer.alloc(20);header.writeUInt32LE(0x46546c67,0);header.writeUInt32LE(2,4);header.writeUInt32LE(20+j.length+bin.length,8);header.writeUInt32LE(j.length,12);header.writeUInt32LE(0x4e4f534a,16);const runtimeGlb=Buffer.concat([header,j,bin]);await fs.writeFile(path.join(out,'player.glb'),runtimeGlb);
const walkGrounding=await measureShoeGrounding(runtimeGlb,'CrouchWalk');
crouchWalk.report.grounding=walkGrounding;
crouchWalk.report.rootMotion.renderedCycleSpeed=crouchWalk.report.rootMotion.cycleTargetSpeed*scale;
crouchWalk.report.playbackScale=1.35/crouchWalk.report.rootMotion.renderedCycleSpeed;
crouchWalk.report.controllerSpeed=1.35;
// Same binary/animations, existing low-cost material and texture. Account for changed GLB JSON size.
const previousLow=JSON.parse(await fs.readFile(path.join(out,'player-very-low.gltf'),'utf8'));
const low=structuredClone(json);low.buffers=[{uri:'player.glb',byteLength:20+j.length+bin.length}];for(const view of low.bufferViews)view.byteOffset=(view.byteOffset??0)+28+j.length;
low.images=previousLow.images;low.textures=previousLow.textures;low.materials=previousLow.materials;low.samplers=previousLow.samplers;
await fs.writeFile(path.join(out,'player-very-low.gltf'),JSON.stringify(low));
await fs.writeFile(path.join(out,'crouch-import.json'),JSON.stringify({...crouch.report,CrouchWalk:crouchWalk.report},null,2)+'\n');
console.log(JSON.stringify({triangles:mesh.geometry.index.count/3,vertices:mesh.geometry.attributes.position.count,bones:mesh.skeleton.bones.length,uvMaxError:'<1e-6 (all 726276 components)',sourceIdleHeight:height,visualScale:scale,assetGroundOffset:root.position.y,physicsChildOffset:-.875,forwardCorrection:'PI',clips:clips.map(c=>({name:c.name,duration:c.duration})),files:await Promise.all((await fs.readdir(out)).map(async f=>({file:f,bytes:(await fs.stat(path.join(out,f))).size})))},null,2));


