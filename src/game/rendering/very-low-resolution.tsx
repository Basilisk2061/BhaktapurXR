import {useEffect} from 'react';
import {useThree} from '@react-three/fiber';

/** Deterministic viewport budget, never FPS-driven adaptive resolution. CSS UI is unaffected. */
export function VeryLowResolution({mobile}:{mobile:boolean}){
 const {size,viewport,setDpr}=useThree();
 useEffect(()=>{
  const pixels=mobile?280_000:500_000,min=mobile?.5:.55,max=mobile?.7:.75;
  const dpr=Math.max(min,Math.min(max,Math.sqrt(pixels/Math.max(1,size.width*size.height))));
  if(Math.abs(viewport.dpr-dpr)>.001)setDpr(dpr);
 },[size.width,size.height,viewport.dpr,setDpr,mobile]);
 return null;
}
