import {useEffect,useRef} from 'react';
import {useFrame,useThree} from '@react-three/fiber';
import {Vector2} from 'three';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import {ShaderPass} from 'three/addons/postprocessing/ShaderPass.js';
import {FXAAShader} from 'three/addons/shaders/FXAAShader.js';
/** HIGH only: native Three passes, disposed on downgrade. No downloaded HDR or textures. */
export default function HighQualityEffects(){
 const {gl,scene,camera,size,viewport}=useThree();
 const pipeline=useRef<{composer:EffectComposer;bloom:UnrealBloomPass;fxaa:ShaderPass}|null>(null);
 useEffect(()=>{
  const composer=new EffectComposer(gl),render=new RenderPass(scene,camera),bloom=new UnrealBloomPass(new Vector2(1,1),.08,.15,1.5),output=new OutputPass(),fxaa=new ShaderPass(FXAAShader);
  composer.addPass(render);composer.addPass(bloom);composer.addPass(output);composer.addPass(fxaa);pipeline.current={composer,bloom,fxaa};
  return()=>{pipeline.current=null;render.dispose();bloom.dispose();output.dispose();fxaa.dispose();composer.dispose();};
 },[gl,scene,camera]);
 useEffect(()=>{
  const p=pipeline.current;if(!p)return;const dpr=gl.getPixelRatio();
  p.composer.setPixelRatio(dpr);p.composer.setSize(size.width,size.height);
  p.bloom.setSize(Math.max(1,size.width*dpr/2),Math.max(1,size.height*dpr/2));
  p.fxaa.uniforms.resolution.value.set(1/(size.width*dpr),1/(size.height*dpr));
 },[gl,size.width,size.height,viewport.dpr]);
 useFrame((_,delta)=>{if(pipeline.current)pipeline.current.composer.render(delta);else gl.render(scene,camera);},1);
 return null;
}
