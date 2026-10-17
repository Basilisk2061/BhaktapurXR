"use client";
import {use} from 'react';
import {loadHomeModels} from '../../game/world/home-assets';
import {createPortal} from 'react-dom';
import {Canvas,useFrame,useThree} from '@react-three/fiber';
import {PerspectiveCamera,View} from '@react-three/drei';
import {useEffect,useMemo,useRef,useState,type RefObject} from 'react';
import {ACESFilmicToneMapping,PCFSoftShadowMap,SRGBColorSpace} from 'three';
import type {TransformOverrides} from '../../features/world-editor/transforms';
import {buildPreviewAssets} from './preview-assets';
const shots={entrance:{position:[-131,4.8,-43],target:[-119,4,-30]},palace:{position:[-35,5,8],target:[-8,5,-12]},terraces:{position:[-120,5,1],target:[-100,3,-17]}} as const;
function Scene({assets,shot}:{assets:ReturnType<typeof buildPreviewAssets>;shot:keyof typeof shots}){
 const model=useMemo(()=>assets.root.clone(true),[assets]);
 const target=useMemo(()=>{const o=assets.root.clone(false);o.position.set(-48,0,-10);return o;},[assets]);
 const camera=useRef<import('three').PerspectiveCamera>(null),view=shots[shot],invalidate=useThree(s=>s.invalidate);
 useEffect(()=>{if(camera.current){camera.current.position.set(view.position[0],view.position[1],view.position[2]);camera.current.lookAt(view.target[0],view.target[1],view.target[2]);camera.current.updateMatrixWorld();invalidate();}},[view,invalidate]);
 return <><PerspectiveCamera ref={camera} makeDefault fov={48} near={.1} far={350}/><color attach="background" args={['#a1b6c3']}/><hemisphereLight args={['#dceafa','#a29a8b',1.45]}/><ambientLight intensity={.38}/><primitive object={target}/><directionalLight position={[-93,65,25]} target={target} color="#fff5e8" intensity={2.65} castShadow shadow-mapSize={[1024,1024]} shadow-camera-left={-100} shadow-camera-right={100} shadow-camera-top={90} shadow-camera-bottom={-90} shadow-camera-far={240} shadow-normalBias={.022} shadow-bias={-.00008}/><primitive object={model} dispose={null}/></>;
}
function RenderOnChange(){const invalidate=useThree(s=>s.invalidate);useEffect(()=>{const update=()=>invalidate();window.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update);return()=>{window.removeEventListener('scroll',update);window.removeEventListener('resize',update);};},[invalidate]);useFrame(({gl})=>{gl.setScissorTest(false);gl.setClearColor(0,0);gl.clear(true,true,true);},0);return null;}
export default function HeroModel({overrides}:{overrides:TransformOverrides}){
 const [shot,setShot]=useState<'entrance'|'palace'>('entrance'),[tracks,setTracks]=useState<RefObject<HTMLElement>[]>([]);
 const models=use(loadHomeModels());
 const assets=useMemo(()=>buildPreviewAssets(overrides,models),[overrides,models]);
 useEffect(()=>{setTracks(['home-hero-view','home-square-view','home-terrace-view'].map(id=>({current:document.getElementById(id)!})));return()=>assets.dispose();},[assets]);
 return <><div className="home-visuals" aria-hidden="true">{tracks.length===3&&<Canvas frameloop="demand" dpr={[1,1.25]} shadows gl={{alpha:true,antialias:true}} onCreated={({gl})=>{gl.toneMapping=ACESFilmicToneMapping;gl.outputColorSpace=SRGBColorSpace;gl.shadowMap.type=PCFSoftShadowMap;}} fallback={<p>Enter the square to explore the reconstruction.</p>}><RenderOnChange/>{tracks.map((track,i)=><View key={i} track={track} index={i+1}><Scene assets={assets} shot={i===0?shot:i===1?'palace':'terraces'}/></View>)}</Canvas>}</div>{tracks[0]?.current.parentElement&&createPortal(<div className="hero-view-controls"><span>Live reconstruction</span><div role="group" aria-label="Hero reconstruction viewpoint"><button type="button" aria-pressed={shot==='entrance'} onClick={()=>setShot('entrance')}>West entrance</button><button type="button" aria-pressed={shot==='palace'} onClick={()=>setShot('palace')}>Palace frontage</button></div></div>,tracks[0].current.parentElement)}</>;
}
