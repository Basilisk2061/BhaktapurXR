import {useMemo} from "react";
import {Object3D,Color,Vector3,BackSide} from "three";
import { architectureQuality } from "@/data/architecture/config";
import { DEFAULT_QUALITY_PRESET } from "@/lib/quality-config";

/** Analytic sky in the existing scene pass: no HDRI, environment capture or post effects. */
function DaylightSky(){
 const uniforms=useMemo(()=>({horizon:{value:new Color('#b0d1e9')},zenith:{value:new Color('#2e78bf')},ground:{value:new Color('#c2c7c6')},sunDirection:{value:new Vector3(-45,65,35).normalize()}}),[]);
 return <mesh name="daylight-sky" renderOrder={-1000} frustumCulled={false}>
  <sphereGeometry args={[1,16,8]}/>
  <shaderMaterial side={BackSide} depthWrite={false} depthTest={false} uniforms={uniforms}
   vertexShader={`varying vec3 skyDirection;void main(){skyDirection=position;vec4 clip=projectionMatrix*mat4(mat3(viewMatrix))*vec4(position,1.0);gl_Position=clip.xyww;}`}
   fragmentShader={`uniform vec3 horizon,zenith,ground,sunDirection;varying vec3 skyDirection;
    void main(){vec3 direction=normalize(skyDirection);float height=max(direction.y,0.0);
     vec3 sky=mix(horizon,zenith,pow(height,.50));
     sky=mix(sky,ground,(1.0-smoothstep(-.35,0.0,direction.y)));
     float glow=pow(max(dot(direction,sunDirection),0.0),24.0)*.08;
     gl_FragColor=vec4(mix(sky,vec3(1.0,.98,.94),glow),1.0);
     #include <tonemapping_fragment>
     #include <colorspace_fragment>
    }`}/>
 </mesh>;
}
export function HeritageDaylight() {
  const target=useMemo(()=>{const target=new Object3D();target.position.set(-48,0,-10);return target;},[]);
  const size=architectureQuality[DEFAULT_QUALITY_PRESET].shadowSize;
  return <>
    <primitive object={target} />
    <color attach="background" args={["#b0d1e9"]} />
    <DaylightSky/>
    <fog attach="fog" args={["#b0d1e9",110,360]}/>
    <hemisphereLight args={["#d1e2fa","#aba99f",1.55]} />
    <ambientLight color="#f4f6f8" intensity={.27} />
    <directionalLight name="heritage-sun" position={[-93,65,25]} target={target} color="#fff8ed" intensity={3.35} castShadow shadow-mapSize={[size,size]}
      shadow-camera-left={-100} shadow-camera-right={100} shadow-camera-top={90} shadow-camera-bottom={-90} shadow-camera-near={1} shadow-camera-far={240}
      shadow-normalBias={.014} shadow-bias={-.00004} shadow-radius={1.5} />
  </>;
}
