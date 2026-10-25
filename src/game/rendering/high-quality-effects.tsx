import {useEffect,useRef,type RefObject} from 'react';
import {useFrame,useThree} from '@react-three/fiber';
import {DepthTexture,HalfFloatType,UnsignedIntType,WebGLRenderTarget,type PerspectiveCamera} from 'three';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import {ShaderPass} from 'three/addons/postprocessing/ShaderPass.js';
import {FXAAShader} from 'three/addons/shaders/FXAAShader.js';
import type {PlayerRuntime} from '../player/player-runtime';
import type {QualityPreset} from '../../types/quality';
import {apertures} from '../inventory/photography-settings';
import {createPhotographyDof} from './photography-dof';
/** Existing HIGH composer, also mounted only while photographing on LOW/MEDIUM. */
export default function HighQualityEffects({runtime,quality}:{runtime:RefObject<PlayerRuntime>;quality:QualityPreset}){
 const {gl,scene,camera,size,viewport}=useThree();
 const pipeline=useRef<{composer:EffectComposer;fxaa:ShaderPass;dof:ShaderPass}|null>(null);
 useEffect(()=>{
  const target=new WebGLRenderTarget(1,1,{type:HalfFloatType});target.depthTexture=new DepthTexture(1,1,UnsignedIntType);
  const composer=new EffectComposer(gl,target),render=new RenderPass(scene,camera),output=new OutputPass(),fxaa=new ShaderPass(FXAAShader),dof=createPhotographyDof(quality==='HIGH'?12:quality==='MEDIUM'?8:4);
  fxaa.material.toneMapped=false;fxaa.enabled=quality==='HIGH';dof.enabled=false;
  composer.addPass(render);composer.addPass(dof);composer.addPass(output);composer.addPass(fxaa);pipeline.current={composer,fxaa,dof};
  return()=>{pipeline.current=null;render.dispose();dof.dispose();output.dispose();fxaa.dispose();composer.dispose();};
 },[gl,scene,camera,quality]);
 useEffect(()=>{
  const p=pipeline.current;if(!p)return;const dpr=gl.getPixelRatio();
  p.composer.setPixelRatio(dpr);p.composer.setSize(size.width,size.height);
  p.fxaa.uniforms.resolution.value.set(1/(size.width*dpr),1/(size.height*dpr));
 },[gl,size.width,size.height,viewport.dpr,quality]);
 useFrame((_,delta)=>{
  const p=pipeline.current;if(!p){gl.render(scene,camera);return;}
  const motion=runtime.current,s=motion.photography?.getState(),view=motion.handheldCamera?.view??0,c=camera as PerspectiveCamera;
  p.dof.enabled=quality!=='VERY LOW'&&view>0&&!!s;
  if(s&&p.dof.enabled){const u=p.dof.uniforms;u.nearClip.value=c.near;u.farClip.value=c.far;u.aspect.value=c.aspect;u.focus.value=s.focus;u.focal.value=36/(2*c.aspect*Math.tan(c.fov*Math.PI/360));u.fstop.value=s.manual?apertures[s.aperture]:4;u.strength.value=view*view;u.maxRadius.value=(quality==='HIGH'?.0045:quality==='MEDIUM'?.0032:.0016)*Math.max(.25,Math.min(1,4/u.fstop.value));}
  p.composer.render(delta);
 },1);
 return null;
}
