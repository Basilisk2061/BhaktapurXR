import {useEffect,useMemo,useRef} from 'react';
import {useFrame,useThree} from '@react-three/fiber';
import {ACESFilmicToneMapping,AgXToneMapping,Mesh,MeshStandardMaterial,PCFShadowMap,PCFSoftShadowMap,type Material,type Texture} from 'three';
import {useGraphicsQuality} from '../../lib/graphics-quality';
import {graphicsPresets} from '../../lib/graphics-presets';
/** Presentation only. No geometry, visibility, animation, audio or physics budgets change. */
export function RendererQuality(){
 const quality=useGraphicsQuality(),budget=graphicsPresets[quality],{gl,scene}=useThree();
 const originals=useMemo(()=>({meshes:new WeakMap<Mesh,{cast:boolean;receive:boolean;quality:string}>(),materials:new WeakMap<Material,{bump:Texture|null;normal:Texture|null;quality:string}>()}),[]);
 const elapsed=useRef(0);
 const apply=()=>{
  scene.traverse(object=>{
   if(!(object instanceof Mesh))return;
   let original=originals.meshes.get(object);
   if(!original){original={cast:object.castShadow,receive:object.receiveShadow,quality:''};originals.meshes.set(object,original);}
   if(original.quality!==quality&&!object.userData.graphicsShadowManaged){
    if(!object.geometry.boundingSphere)object.geometry.computeBoundingSphere();
    const radius=object.geometry.boundingSphere?.radius??Infinity;
    object.castShadow=original.cast&&budget.shadows&&('isSkinnedMesh' in object||'isInstancedMesh' in object||radius>=budget.shadowMinRadius);
    object.receiveShadow=original.receive&&budget.shadows;original.quality=quality;
   }
   for(const material of Array.isArray(object.material)?object.material:[object.material]){
    if(!(material instanceof MeshStandardMaterial))continue;
    let saved=originals.materials.get(material);
    if(!saved){saved={bump:material.bumpMap,normal:material.normalMap,quality:''};originals.materials.set(material,saved);}
    if(saved.quality===quality)continue;
    material.bumpMap=budget.bump?saved.bump:null;material.normalMap=budget.bump?saved.normal:null;
    for(const map of [material.map,saved.bump,saved.normal,material.roughnessMap])if(map&&map.anisotropy!==budget.anisotropy){map.anisotropy=Math.min(budget.anisotropy,gl.capabilities.getMaxAnisotropy());map.needsUpdate=true;}
    material.needsUpdate=true;saved.quality=quality;
   }
  });
 };
 useEffect(()=>{
  gl.toneMapping=quality==='HIGH'?AgXToneMapping:ACESFilmicToneMapping;gl.toneMappingExposure=budget.exposure;
  gl.shadowMap.enabled=budget.shadows;gl.shadowMap.type=quality==='HIGH'?PCFSoftShadowMap:PCFShadowMap;gl.shadowMap.needsUpdate=true;
  apply();
  // Shared materials are restored by the next preset; no world remount is needed.
  // eslint-disable-next-line react-hooks/exhaustive-deps
 },[quality,gl,scene]);
 // Discover asynchronously mounted character/material assets at 1 Hz, not every frame.
 useFrame((_,delta)=>{elapsed.current+=delta;if(elapsed.current>=1){elapsed.current=0;apply();}});
 return null;
}
