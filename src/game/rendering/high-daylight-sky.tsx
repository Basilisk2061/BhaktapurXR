import {useMemo} from 'react';
import {useLoader} from '@react-three/fiber';
import {Environment} from '@react-three/drei';
import {AdditiveBlending,BackSide,EquirectangularReflectionMapping} from 'three';
import {HDRLoader} from 'three/addons/loaders/HDRLoader.js';
import {highSkyFile,highSkyRotation,highSunOffset} from './high-environment-config';

/** Loaded only inside HIGH's local Suspense boundary; no world/physics remount. */
export default function HighDaylightSky({day=1}:{day?:number}){
 const texture=useLoader(HDRLoader,highSkyFile);
 texture.mapping=EquirectangularReflectionMapping;
 const uniforms=useMemo(()=>({sunDirection:{value:highSunOffset.clone().normalize()},day:{value:1}}),[]);
 uniforms.day.value=day;
 return <>
  <Environment map={texture} background backgroundIntensity={.008+.642*day} environmentIntensity={.065+.115*day}
   backgroundRotation={highSkyRotation} environmentRotation={highSkyRotation}/>
  {/* Halo only, not a second sun. Far-plane depth lets opaque architecture occlude it. */}
  <mesh name="high-solar-halo" frustumCulled={false} renderOrder={-1000}>
   <sphereGeometry args={[1,24,12]}/>
   <shaderMaterial side={BackSide} transparent blending={AdditiveBlending} depthWrite={false}
    uniforms={uniforms}
    vertexShader={`varying vec3 skyDirection;void main(){skyDirection=position;
     vec4 clip=projectionMatrix*mat4(mat3(viewMatrix))*vec4(position,1.0);gl_Position=clip.xyww;}`}
    fragmentShader={`uniform vec3 sunDirection;uniform float day;varying vec3 skyDirection;
     void main(){float alignment=dot(normalize(skyDirection),sunDirection);
      float halo=exp(-(1.0-alignment)/0.00012)*smoothstep(0.99863,0.99966,alignment);
      gl_FragColor=vec4(vec3(0.08,0.075,0.065),halo*day);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
     }`}/>
  </mesh>
 </>;
}
