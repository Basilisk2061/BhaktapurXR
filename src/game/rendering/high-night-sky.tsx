import {useEffect,useMemo} from 'react';
import {BackSide,BufferGeometry,Color,Float32BufferAttribute,PointsMaterial} from 'three';

const starCount=1500,starRadius=200; // Inside the unchanged 260 m player camera far plane.
/** High-only presentation: one seeded point cloud, no sky assets or gameplay state. */
export function HighNightSky({day}:{day:number}){
 const stars=useMemo(()=>{
  let seed=726183;
  const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
  const positions:number[]=[],colors:number[]=[],sizes:number[]=[];
  const palette=['#e2e5e8','#e7e2da','#d3deea'].map(value=>new Color(value));
  for(let i=0;i<starCount;i++){
   const y=.06+random()*.94,angle=random()*Math.PI*2,r=Math.sqrt(1-y*y);
   positions.push(starRadius*r*Math.cos(angle),starRadius*y,starRadius*r*Math.sin(angle));
   const color=palette[Math.floor(random()*palette.length)],bright=random();
   const luminance=bright>.985?1:.55+random()*.3;
   colors.push(color.r*luminance,color.g*luminance,color.b*luminance);
   sizes.push(bright>.985?1.5:bright>.85?1.15:.8);
  }
  const geometry=new BufferGeometry();
  geometry.setAttribute('position',new Float32BufferAttribute(positions,3));
  geometry.setAttribute('color',new Float32BufferAttribute(colors,3));
  geometry.setAttribute('starScale',new Float32BufferAttribute(sizes,1));
  return geometry;
 },[]);
 useEffect(()=>()=>stars.dispose(),[stars]);
 const skyUniforms=useMemo(()=>({night:{value:0},horizon:{value:new Color('#172d4b')},zenith:{value:new Color('#091a36')}}),[]);
 const starMaterial=useMemo(()=>{
  // PointsMaterial uploads size * renderer pixel ratio. Unlike the old custom
  // gl_PointSize, this remains 1.6-3 CSS pixels on High's DPR 1-2 and survives FXAA.
  const material=new PointsMaterial({size:2,sizeAttenuation:false,vertexColors:true,transparent:true,opacity:0,depthTest:true,depthWrite:false,fog:false,toneMapped:false,alphaTest:.01});
  material.onBeforeCompile=shader=>{
   shader.vertexShader='attribute float starScale;\n'+shader.vertexShader;
   shader.vertexShader=shader.vertexShader.replace('gl_PointSize = size;','gl_PointSize = size * starScale;')
    .replace('#include <project_vertex>',`// Rotation-only view removes player-translation parallax.
     vec4 mvPosition=mat4(mat3(viewMatrix))*vec4(position,1.0);
     gl_Position=projectionMatrix*mvPosition;
     // Same far-background depth as the blue foundation (which never writes depth).
     // Opaque world geometry has nearer depth and therefore masks the stars.
     gl_Position.z=gl_Position.w;`);
   shader.fragmentShader=shader.fragmentShader.replace('#include <map_particle_fragment>',`#include <map_particle_fragment>
    diffuseColor.a*=1.0-smoothstep(.32,.5,length(gl_PointCoord-.5));`);
  };
  material.customProgramCacheKey=()=> 'high-night-stars-dpr-v2';
  return material;
 },[]);
 useEffect(()=>()=>starMaterial.dispose(),[starMaterial]);
 skyUniforms.night.value=.94*(1-day);
 starMaterial.opacity=.9*(1-day)*(1-day);
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
  <points name="high-night-stars" geometry={stars} material={starMaterial} visible={day<1} frustumCulled={false} renderOrder={-998}/>

 </>;
}
