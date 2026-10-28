// Offline only: sample actual target skinned shoes in the exported asset ground frame.
import {AnimationMixer,Texture,Vector3} from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
export async function measureShoeGrounding(buffer,clipName){
 const loader=new GLTFLoader();loader.register(()=>({name:'offline-texture-stub',loadTexture:()=>Promise.resolve(new Texture())}));
 const asset=await loader.parseAsync(buffer.buffer.slice(buffer.byteOffset,buffer.byteOffset+buffer.byteLength),'');
 const clip=asset.animations.find(c=>c.name===clipName);if(!clip)throw Error('Missing grounding clip '+clipName);
 const meshes=[];asset.scene.traverse(mesh=>{if(!mesh.isSkinnedMesh)return;const vertices={Left:[],Right:[]};for(let i=0;i<mesh.geometry.attributes.position.count;i++)for(const side of ['Left','Right']){let weight=0;for(let j=0;j<4;j++){const bone=mesh.skeleton.bones[mesh.geometry.attributes.skinIndex.array[i*4+j]];if(bone.name.startsWith('mixamorig'+side+'Foot')||bone.name.startsWith('mixamorig'+side+'Toe'))weight+=mesh.geometry.attributes.skinWeight.array[i*4+j]}if(weight>.5)vertices[side].push(i)}meshes.push({mesh,vertices})});
 if(!meshes.length)throw Error('No skinned shoes');
 const times=[...new Set(clip.tracks.flatMap(t=>Array.from(t.times)))].sort((a,b)=>a-b),mixer=new AnimationMixer(asset.scene),action=mixer.clipAction(clip).play(),v=new Vector3(),rows=[];
 for(const time of times){action.time=time;mixer.update(0);asset.scene.updateMatrixWorld(true);let left=Infinity,right=Infinity;for(const {mesh,vertices}of meshes){mesh.skeleton.update();for(const side of ['Left','Right'])for(const i of vertices[side]){mesh.getVertexPosition(i,v).applyMatrix4(mesh.matrixWorld);if(side==='Left')left=Math.min(left,v.y);else right=Math.min(right,v.y)}}const bones={};for(const n of ['LeftFoot','RightFoot','LeftToeBase','RightToeBase'])bones[n]=asset.scene.getObjectByName('mixamorig'+n).getWorldPosition(v).y;rows.push({time,left,right,support:Math.min(left,right),...bones})}
 mixer.stopAllAction();const ranges=Object.fromEntries(Object.keys(rows[0]).filter(k=>k!=='time').map(k=>[k,[Math.min(...rows.map(r=>r[k])),Math.max(...rows.map(r=>r[k]))]]));
 if(!Object.values(ranges).flat().every(Number.isFinite))throw Error('Invalid measured shoe range');
 return {samples:rows.length,ranges,visualYOffset:-ranges.support[0],supportSequence:rows.filter((_,i)=>i%5===0).map(r=>({time:r.time,foot:r.left<r.right?'Left':'Right'})),method:'minimum supporting skinned sole over all output key times; preserve natural bobbing'};
}

