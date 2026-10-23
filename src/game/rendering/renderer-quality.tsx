import {useEffect,useMemo,useRef,useState,lazy,Suspense} from 'react';
import {useFrame,useThree} from '@react-three/fiber';
import {ACESFilmicToneMapping,AgXToneMapping,Mesh,MeshStandardMaterial,PCFShadowMap,PCFSoftShadowMap,Vector2,type Material,type Texture} from 'three';
import {useGraphicsQuality} from '../../lib/graphics-quality';
import {graphicsPresets} from '../../lib/graphics-presets';
import type {HighTimberMaps} from './high-material-assets';
const HighMaterialAssets=lazy(()=>import('./high-material-assets'));
interface MaterialState {bump:Texture|null;normal:Texture|null;roughness:number;bumpScale:number;roughnessMap:Texture|null;aoMap:Texture|null;aoIntensity:number;normalScale:Vector2;quality:string}
/** Presentation only. No geometry, visibility, animation, audio or physics budgets change. */
export function RendererQuality(){
 const quality=useGraphicsQuality(),budget=graphicsPresets[quality],{gl,scene}=useThree();
 const [timberMaps,setTimberMaps]=useState<HighTimberMaps|null>(null);
 const materialQuality=quality+(quality==='HIGH'&&timberMaps?':pbr':'');
 const originals=useMemo(()=>({meshes:new WeakMap<Mesh,{cast:boolean;receive:boolean;quality:string}>(),materials:new WeakMap<Material,MaterialState>()}),[]);
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
    if(!saved){saved={bump:material.bumpMap,normal:material.normalMap,roughness:material.roughness,bumpScale:material.bumpScale,roughnessMap:material.roughnessMap,aoMap:material.aoMap,aoIntensity:material.aoMapIntensity,normalScale:material.normalScale.clone(),quality:''};originals.materials.set(material,saved);}
    if(saved.quality===materialQuality)continue;
    // Only tagged masonry/timber finishes: never character skin, clothing or metal.
    // Restore the exact original response on downgrade; colors/maps remain authoritative.
    const surface=material.userData.heritageSurface,highSurface=quality==='HIGH'&&typeof surface==='string';
    material.roughness=highSurface?Math.max(.82,saved.roughness-(surface==='timber'?.04:.02)):saved.roughness;
    material.bumpScale=highSurface?saved.bumpScale*(surface==='brick'||surface==='stone'?1.35:1.15):saved.bumpScale;
    const timber=highSurface&&surface==='timber'&&!saved.normal?timberMaps:null;
    if(material.userData.highPbrDetail)material.userData.highPbrDetail.value=timber?1:0;
    material.normalMap=timber?timber.normal:budget.bump?saved.normal:null;
    material.bumpMap=timber?null:budget.bump?saved.bump:null;
    material.roughnessMap=timber?timber.roughness:saved.roughnessMap;
    material.aoMap=timber?timber.ao:saved.aoMap;
    material.aoMapIntensity=timber?.18:saved.aoIntensity;
    if(timber)material.normalScale.set(.22,.22);else material.normalScale.copy(saved.normalScale);
    for(const map of [material.map,saved.bump,material.normalMap,material.roughnessMap,material.aoMap])if(map&&map.anisotropy!==budget.anisotropy){map.anisotropy=Math.min(budget.anisotropy,gl.capabilities.getMaxAnisotropy());map.needsUpdate=true;}
    material.needsUpdate=true;saved.quality=materialQuality;
   }
  });
 };
 useEffect(()=>{
  gl.toneMapping=quality==='HIGH'?AgXToneMapping:ACESFilmicToneMapping;gl.toneMappingExposure=budget.exposure;
  gl.shadowMap.enabled=budget.shadows;gl.shadowMap.type=quality==='HIGH'?PCFSoftShadowMap:PCFShadowMap;gl.shadowMap.needsUpdate=true;
  apply();
  // Shared materials are restored by the next preset; no world remount is needed.
  // eslint-disable-next-line react-hooks/exhaustive-deps
 },[quality,gl,scene,timberMaps]);
 // Discover asynchronously mounted character/material assets at 1 Hz, not every frame.
 useFrame((_,delta)=>{elapsed.current+=delta;if(elapsed.current>=1){elapsed.current=0;apply();}});
 return quality==='HIGH'?<Suspense fallback={null}><HighMaterialAssets onReady={setTimberMaps}/></Suspense>:null;
}
