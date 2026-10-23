import {useEffect,useMemo} from 'react';
import {useLoader,useThree} from '@react-three/fiber';
import {LinearFilter,LinearMipmapLinearFilter,NoColorSpace,RepeatWrapping,TextureLoader,type Texture} from 'three';
import {highTimberFiles} from './high-environment-config';

export interface HighTimberMaps {normal:Texture;roughness:Texture;ao:Texture}

/** Real photographic detail maps only; authoritative heritage albedos are never replaced. */
export default function HighMaterialAssets({onReady}:{onReady:(maps:HighTimberMaps|null)=>void}){
 const textures=useLoader(TextureLoader,highTimberFiles),{gl}=useThree();
 const maps=useMemo(()=>({normal:textures[0],roughness:textures[1],ao:textures[2]}),[textures]);
 useEffect(()=>{
  for(const texture of textures){
   texture.colorSpace=NoColorSpace;texture.wrapS=texture.wrapT=RepeatWrapping;
   texture.repeat.setScalar(2/1.8);texture.minFilter=LinearMipmapLinearFilter;texture.magFilter=LinearFilter;
   texture.anisotropy=Math.min(8,gl.capabilities.getMaxAnisotropy());texture.needsUpdate=true;
  }
  onReady(maps);
  // Cached assets can be reused when HIGH is selected again, but are unbound on downgrade.
  return()=>onReady(null);
 },[textures,maps,gl,onReady]);
 return null;
}
