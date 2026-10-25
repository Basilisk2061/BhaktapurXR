import {useEffect,useMemo} from 'react';
import {BackSide,BufferGeometry,Color,Float32BufferAttribute} from 'three';

const starCount=1500;
/** High-only presentation: one seeded point cloud, no sky assets or gameplay state. */
export function HighNightSky({day}:{day:number}){
 const stars=useMemo(()=>{
  let seed=726183;
  const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
  const positions:number[]=[],colors:number[]=[],sizes:number[]=[],brightness:number[]=[];
  const palette=['#e2e5e8','#e7e2da','#d3deea'].map(value=>new Color(value));
  for(let i=0;i<starCount;i++){
   const y=.06+random()*.94,angle=random()*Math.PI*2,r=Math.sqrt(1-y*y);
   positions.push(r*Math.cos(angle),y,r*Math.sin(angle));
   const color=palette[Math.floor(random()*palette.length)];colors.push(color.r,color.g,color.b);
   const bright=random();sizes.push(bright>.985?2.4:bright>.85?1.7:1.15);
   brightness.push(bright>.985?.9:.25+random()*.4);
  }
  const geometry=new BufferGeometry();
  geometry.setAttribute('position',new Float32BufferAttribute(positions,3));
  geometry.setAttribute('starColor',new Float32BufferAttribute(colors,3));
  geometry.setAttribute('starSize',new Float32BufferAttribute(sizes,1));
  geometry.setAttribute('brightness',new Float32BufferAttribute(brightness,1));
  return geometry;
 },[]);
 useEffect(()=>()=>stars.dispose(),[stars]);
 const skyUniforms=useMemo(()=>({night:{value:0},horizon:{value:new Color('#172d4b')},zenith:{value:new Color('#091a36')}}),[]);
 const starUniforms=useMemo(()=>({visibility:{value:0}}),[]);
 skyUniforms.night.value=.94*(1-day);
 starUniforms.visibility.value=(1-day)*(1-day);
 return <>
  {/* Blend a blue-black foundation over the existing dim HDR, leaving day untouched. */}
  <mesh name="high-night-blue-foundation" visible={day<1} frustumCulled={false} renderOrder={-999}>
   <sphereGeometry args={[1,16,8]}/>
   <shaderMaterial side={BackSide} transparent depthWrite={false} depthTest uniforms={skyUniforms}
    vertexShader={`varying float height;void main(){height=position.y;vec4 clip=projectionMatrix*mat4(mat3(viewMatrix))*vec4(position,1.);gl_Position=clip.xyww;}`}
    fragmentShader={`uniform float night;uniform vec3 horizon,zenith;varying float height;void main(){gl_FragColor=vec4(mix(horizon,zenith,sqrt(max(height,0.))),night);
     #include <tonemapping_fragment>
     #include <colorspace_fragment>
    }`}/>
  </mesh>
  {/* Rotation-only view keeps stars infinitely distant; far depth lets buildings occlude them. */}
  <points name="high-night-stars" geometry={stars} visible={day<1} frustumCulled={false} renderOrder={-998}>
   <shaderMaterial transparent depthWrite={false} depthTest toneMapped={false} uniforms={starUniforms}
    vertexShader={`attribute vec3 starColor;attribute float starSize,brightness;varying vec3 tint;varying float strength;void main(){tint=starColor;strength=brightness;vec4 clip=projectionMatrix*mat4(mat3(viewMatrix))*vec4(position,1.);gl_Position=clip;gl_Position.z=clip.w*.999999;gl_PointSize=starSize;}`}
    fragmentShader={`uniform float visibility;varying vec3 tint;varying float strength;void main(){float radius=length(gl_PointCoord-.5);float alpha=(1.-smoothstep(.12,.5,radius))*strength*visibility;if(alpha<.005)discard;gl_FragColor=vec4(tint,alpha);
     #include <colorspace_fragment>
    }`}/>
  </points>
 </>;
}
