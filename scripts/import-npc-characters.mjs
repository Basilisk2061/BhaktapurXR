import fs from 'node:fs/promises';
import path from 'node:path';
import {FBXLoader} from 'three/addons/loaders/FBXLoader.js';
import {GLTFExporter} from 'three/addons/exporters/GLTFExporter.js';
import {mergeVertices} from 'three/addons/utils/BufferGeometryUtils.js';
import {TextureLoader,Texture,MeshStandardMaterial,AnimationMixer,Group,Box3,Vector3} from 'three';
import sharp from 'sharp';
import {mixamoRig,retargetMixamoClip} from '../src/game/npcs/mixamo-retarget.ts';
TextureLoader.prototype.load=()=>new Texture();
globalThis.FileReader=class {readAsArrayBuffer(blob){blob.arrayBuffer().then(b=>{this.result=b;this.onloadend?.();});}};
const base='incoming/npcs',out='public/assets/characters/npcs';
async function load(file){const b=await fs.readFile(file);return new FBXLoader().parse(b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength),'');}
const specs=[{id:'old_man_01',master:'animations/old/Old Man Idle.fbx',prefix:'Meshy_AI_Himalayan_Heritage_Po_1015150316_texture',height:1.68,clips:[['OldManIdle','animations/old/Old Man Idle.fbx'],['OldManWalk','animations/old/Old Man Walk.fbx']]},{id:'female_01',master:'animations/female/Female_Idle.fbx',prefix:'Meshy_AI_Crimson_Grace_1015143011_texture',height:1.63,clips:[['FemaleIdle','animations/female/Female_Idle.fbx'],['FemaleWalk','animations/female/Female_walking.fbx'],['FemaleSit','animations/female/sitting_Idle.fbx'],['FemalePhone','animations/female/talking_on_phone.fbx']]}];
const report={};
for(const spec of specs){
 if(!await fs.stat(path.join(base,spec.master)).catch(()=>null)){console.log(spec.id+': missing WITH SKIN master; no substitute generated');continue;}
 const master=await load(path.join(base,spec.master)),original=await load(path.join(base,'characters',spec.id,spec.prefix+'.fbx'));let mesh,originalMesh;master.traverse(o=>{if(o.isSkinnedMesh)mesh=o;});original.traverse(o=>{if(o.isMesh)originalMesh=o;});
 if(!mesh)throw Error(spec.master+' has no skinned mesh');const uv=mesh.geometry.attributes.uv.array,originalUV=originalMesh.geometry.attributes.uv.array;
 if(uv.length!==originalUV.length||uv.some((v,i)=>Math.abs(v-originalUV[i])>1e-6))throw Error(spec.id+' Meshy/skin UV mismatch; textures cannot be assigned blindly');
 mesh.geometry=mergeVertices(mesh.geometry,1e-6);mesh.normalizeSkinWeights();mesh.material=new MeshStandardMaterial({name:spec.id+' original Meshy texture',color:0xffffff,roughness:1,metalness:1});
 const target=mixamoRig(master),clips=[];
 for(const [name,file]of spec.clips){const src=file===spec.master?master:await load(path.join(base,file));clips.push(retargetMixamoClip(src.animations[0],mixamoRig(src),target,name));}
 const mixer=new AnimationMixer(master);mixer.clipAction(clips[0]).play();mixer.update(0);master.updateMatrixWorld(true);const bounds=new Box3().setFromObject(master,true),scale=spec.height/(bounds.max.y-bounds.min.y),ground=-bounds.min.y*scale;
 const root=new Group();root.name=spec.id;root.scale.setScalar(scale);root.rotation.y=Math.PI;root.position.y=ground;root.add(master);root.updateMatrixWorld(true);
 // Measure the supplied seated pose against the same bind-space map; pelvis support is NPC-specific.
 const sitSource=spec.id==='old_man_01'?await load('incoming/player-character/player_sitting.fbx'):await load(path.join(base,'animations/female/sitting_Idle.fbx'));
 const sit=retargetMixamoClip(sitSource.animations[0],mixamoRig(sitSource),target,'SitProbe');mixer.stopAllAction();mixer.clipAction(sit).play();mixer.update(0);root.updateMatrixWorld(true);
 let contact=Infinity;const p=new Vector3();for(let i=0;i<mesh.geometry.attributes.position.count;i++){mesh.getVertexPosition(i,p);p.applyMatrix4(mesh.matrixWorld);if(Math.abs(p.x)<.2&&p.z>-.12&&p.z<.18&&p.y<.4)contact=Math.min(contact,p.y);}
 if(!Number.isFinite(contact))throw Error('Cannot determine seated body support for '+spec.id);
 mixer.stopAllAction();master.traverse(o=>{if(o.isSkinnedMesh)o.skeleton.pose();});root.updateMatrixWorld(true);
 const glb=await new GLTFExporter().parseAsync(root,{binary:true,animations:clips,onlyVisible:true});mixer.uncacheRoot(master);
 const folder=path.join(out,spec.id),textures=path.join(base,'characters',spec.id,spec.prefix);await fs.mkdir(folder,{recursive:true});
 await sharp(textures+'.png').flip().resize(2048,2048,{fit:'inside',withoutEnlargement:true}).jpeg({quality:92,chromaSubsampling:'4:4:4'}).toFile(path.join(folder,'base-color.jpg'));
 await sharp(textures+'_normal.png').flip().resize(1024,1024).png().toFile(path.join(folder,'normal.png'));
 const rough=await sharp(textures+'_roughness.png').flip().resize(1024,1024).greyscale().raw().toBuffer(),metal=await sharp(textures+'_metallic.png').flip().resize(1024,1024).greyscale().raw().toBuffer(),packed=Buffer.alloc(1024*1024*3);for(let i=0;i<rough.length;i++){packed[i*3]=255;packed[i*3+1]=rough[i];packed[i*3+2]=metal[i];}await sharp(packed,{raw:{width:1024,height:1024,channels:3}}).png().toFile(path.join(folder,'metallic-roughness.png'));
 const data=Buffer.from(glb),len=data.readUInt32LE(12),json=JSON.parse(data.subarray(20,20+len)),bin=data.subarray(20+len);json.images=[{uri:'base-color.jpg'},{uri:'normal.png'},{uri:'metallic-roughness.png'}];json.samplers=[{magFilter:9729,minFilter:9987,wrapS:10497,wrapT:10497}];json.textures=json.images.map((_,source)=>({sampler:0,source}));const mat=json.materials[0];mat.pbrMetallicRoughness.baseColorTexture={index:0};mat.pbrMetallicRoughness.metallicRoughnessTexture={index:2};mat.normalTexture={index:1};let j=Buffer.from(JSON.stringify(json));j=Buffer.concat([j,Buffer.alloc((4-j.length%4)%4,32)]);const header=Buffer.alloc(20);header.writeUInt32LE(0x46546c67,0);header.writeUInt32LE(2,4);header.writeUInt32LE(20+j.length+bin.length,8);header.writeUInt32LE(j.length,12);header.writeUInt32LE(0x4e4f534a,16);await fs.writeFile(path.join(folder,'character.glb'),Buffer.concat([header,j,bin]));
 report[spec.id]={master:spec.master,mesh:spec.prefix+'.fbx',triangles:mesh.geometry.index.count/3,vertices:mesh.geometry.attributes.position.count,weightedBones:mesh.skeleton.bones.length,boneNodes:target.bones.size,height:spec.height,scale,groundOffset:ground,sitVisualY:-contact,uvVerified:true,clips:clips.map(c=>({name:c.name,seconds:c.duration})),textures:{baseColor:2048,normal:1024,metallicRoughness:1024},bytes:(await Promise.all((await fs.readdir(folder)).map(async f=>(await fs.stat(path.join(folder,f))).size))).reduce((a,b)=>a+b,0)};
}
await fs.mkdir(out,{recursive:true});await fs.writeFile(path.join(out,'manifest.json'),JSON.stringify(report,null,2)+'\n');console.log(report);
