import {useMemo,useRef,useEffect} from "react";
import {useFrame} from "@react-three/fiber";
import {useGraphicsQuality} from "../../lib/graphics-quality";
import {graphicsPresets} from "../../lib/graphics-presets";
import {Object3D,Color,Vector3,BackSide,DirectionalLight} from "three";

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
 const quality=useGraphicsQuality(),budget=graphicsPresets[quality];
 const target=useMemo(()=>{const value=new Object3D();value.position.set(-48,0,-10);return value;},[]),sun=useRef<DirectionalLight>(null),elapsed=useRef(1);
 const lightOffset=useMemo(()=>new Vector3(-45,65,35),[]);
 const direction=useMemo(()=>new Vector3(),[]),focus=useMemo(()=>new Vector3(-48,0,-10),[]);
 useEffect(()=>{if(!sun.current)return;sun.current.shadow.map?.dispose();sun.current.shadow.map=null;sun.current.shadow.needsUpdate=true;},[budget.shadowSize]);
 useFrame(({camera},delta)=>{
  if(!budget.shadows)return;elapsed.current+=delta;if(elapsed.current<.1)return;elapsed.current=0;
  camera.getWorldDirection(direction);focus.copy(camera.position).addScaledVector(direction,18);focus.y=0;
  const step=budget.shadowExtent*2/budget.shadowSize;
  focus.x=Math.round(focus.x/step)*step;focus.z=Math.round(focus.z/step)*step;
  target.position.copy(focus);target.updateMatrixWorld();sun.current?.position.copy(focus).add(lightOffset);
 });
 return <>
  <primitive object={target}/>
  <color attach="background" args={["#b0d1e9"]}/>
  {budget.sky==='gradient'&&<DaylightSky/>}
  <fog attach="fog" args={["#b0d1e9",110,360]}/>
  <hemisphereLight args={["#d1e2fa","#aba99f",budget.hemisphere]}/>
  <ambientLight color="#f4f6f8" intensity={budget.ambient}/>
  <directionalLight ref={sun} name="heritage-sun" position={[-93,65,25]} target={target} color={quality==='HIGH'?"#fff7eb":"#fff8ed"} intensity={budget.sun} castShadow={budget.shadows} shadow-mapSize={[budget.shadowSize,budget.shadowSize]}
   shadow-camera-left={-budget.shadowExtent} shadow-camera-right={budget.shadowExtent} shadow-camera-top={budget.shadowExtent} shadow-camera-bottom={-budget.shadowExtent} shadow-camera-near={1} shadow-camera-far={180}
   shadow-normalBias={quality==='HIGH'?.012:.02} shadow-bias={-.00004} shadow-radius={quality==='HIGH'?2:1}/>
 </>;
}
