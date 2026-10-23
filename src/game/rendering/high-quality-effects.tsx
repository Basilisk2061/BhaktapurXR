import {useEffect,useRef} from 'react';
import {useFrame,useThree} from '@react-three/fiber';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import {ShaderPass} from 'three/addons/postprocessing/ShaderPass.js';
import {FXAAShader} from 'three/addons/shaders/FXAAShader.js';
/** HIGH only: one tone/color conversion, then sRGB FXAA. No bloom or glare. */
export default function HighQualityEffects(){
 const {gl,scene,camera,size,viewport}=useThree();
 const pipeline=useRef<{composer:EffectComposer;fxaa:ShaderPass}|null>(null);
 useEffect(()=>{
  const composer=new EffectComposer(gl),render=new RenderPass(scene,camera),output=new OutputPass(),fxaa=new ShaderPass(FXAAShader);
  // FXAA requires sRGB input, so it follows OutputPass without a second conversion.
  fxaa.material.toneMapped=false;
  composer.addPass(render);composer.addPass(output);composer.addPass(fxaa);pipeline.current={composer,fxaa};
  return()=>{pipeline.current=null;render.dispose();output.dispose();fxaa.dispose();composer.dispose();};
 },[gl,scene,camera]);
 useEffect(()=>{
  const p=pipeline.current;if(!p)return;const dpr=gl.getPixelRatio();
  p.composer.setPixelRatio(dpr);p.composer.setSize(size.width,size.height);
  p.fxaa.uniforms.resolution.value.set(1/(size.width*dpr),1/(size.height*dpr));
 },[gl,size.width,size.height,viewport.dpr]);
 useFrame((_,delta)=>{if(pipeline.current)pipeline.current.composer.render(delta);else gl.render(scene,camera);},1);
 return null;
}
