import {useMemo} from 'react';
import {BackSide,Color,Vector3} from 'three';

// Direction from the shadow focus toward the sun, shared with the directional light.
export const daylightSunOffset:[number,number,number]=[-45,65,35];
export const highDaylightHorizon='#9fc8e8';

/** Bounded sky radiance, not physical HDR scattering. Solar glow never touches scene pixels. */
export function HighDaylightSky(){
 const uniforms=useMemo(()=>({
  zenith:{value:new Color('#2475c5')},middle:{value:new Color('#559ddd')},
  horizon:{value:new Color(highDaylightHorizon)},
  sunDirection:{value:new Vector3(...daylightSunOffset).normalize()},
 }),[]);
 return <mesh name="high-daylight-sky" renderOrder={-1000} frustumCulled={false}>
  <sphereGeometry args={[1,24,12]}/>
  <shaderMaterial side={BackSide} depthWrite={false} depthTest={false} uniforms={uniforms}
   vertexShader={`varying vec3 skyDirection;
    void main(){skyDirection=position;
     vec4 clip=projectionMatrix*mat4(mat3(viewMatrix))*vec4(position,1.0);
     gl_Position=clip.xyww;
    }`}
   fragmentShader={`uniform vec3 zenith,middle,horizon,sunDirection;
    varying vec3 skyDirection;
    void main(){
     vec3 direction=normalize(skyDirection);
     float elevation=max(direction.y,0.0);
     // A shallow horizon layer and broader upper atmosphere, rather than one linear ramp.
     vec3 sky=mix(horizon,middle,1.0-exp(-elevation*5.5));
     sky=mix(sky,zenith,smoothstep(0.22,1.0,elevation));
     float alignment=clamp(dot(direction,sunDirection),-1.0,1.0);
     float separation=1.0-alignment;
     // 0.53 degree solar diameter; derivative smoothing keeps the small disc stable.
     float edge=max(fwidth(alignment),0.0000002);
     float disc=smoothstep(0.9999892-edge,0.9999892+edge,alignment);
     // Local halo fades completely beyond four degrees: no distant/right-side haze.
     float cutoff=smoothstep(0.99756,0.99939,alignment);
     float halo=exp(-separation/0.00018)*cutoff;
     float coreGlow=exp(-separation/0.000025)*cutoff;
     sky=mix(sky,vec3(1.0,0.94,0.81),halo*0.18);
     sky+=vec3(1.0,0.95,0.84)*(coreGlow*0.22+disc*4.0);
     gl_FragColor=vec4(sky,1.0);
     #include <tonemapping_fragment>
     #include <colorspace_fragment>
    }`}/>
 </mesh>;
}
