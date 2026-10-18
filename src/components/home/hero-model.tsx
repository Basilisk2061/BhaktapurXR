"use client";
import {use,useEffect,useMemo} from 'react';
import {Canvas} from '@react-three/fiber';
import {ACESFilmicToneMapping,PCFSoftShadowMap,SRGBColorSpace} from 'three';
import {loadHomeModels} from '../../game/world/home-assets';
import type {TransformOverrides} from '../../features/world-editor/transforms';
import {buildPreviewAssets} from './preview-assets';

export default function HeroModel({overrides}:{overrides:TransformOverrides}){
 const models=use(loadHomeModels());
 const assets=useMemo(()=>buildPreviewAssets(overrides,models),[overrides,models]);
 const target=useMemo(()=>{const o=assets.root.clone(false);o.position.set(-48,0,-10);return o;},[assets]);
 useEffect(()=>()=>assets.dispose(),[assets]);
 return <Canvas frameloop="demand" dpr={[1,1.25]} shadows camera={{position:[-131,4.8,-43],fov:48,near:.1,far:350}} gl={{antialias:true}} onCreated={({gl,camera})=>{
  camera.lookAt(-119,4,-30);camera.updateMatrixWorld();
  gl.toneMapping=ACESFilmicToneMapping;gl.outputColorSpace=SRGBColorSpace;gl.shadowMap.type=PCFSoftShadowMap;
 }} fallback={<span/>}>
  <color attach="background" args={['#a1b6c3']}/>
  <hemisphereLight args={['#dceafa','#a29a8b',1.45]}/><ambientLight intensity={.38}/>
  <primitive object={target}/>
  <directionalLight position={[-93,65,25]} target={target} color="#fff5e8" intensity={2.65} castShadow shadow-mapSize={[1024,1024]} shadow-camera-left={-100} shadow-camera-right={100} shadow-camera-top={90} shadow-camera-bottom={-90} shadow-camera-far={240} shadow-normalBias={.022} shadow-bias={-.00008}/>
  <primitive object={assets.root} dispose={null}/>
 </Canvas>;
}
