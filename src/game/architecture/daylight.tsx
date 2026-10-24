import {useStore} from 'zustand';
import {advanceEnvironment,environmentStore,daylightAmount} from '../world/time-of-day';
import {useMemo,useRef,useEffect,lazy,Suspense} from "react";
import {useFrame} from "@react-three/fiber";
import {useGraphicsQuality} from "../../lib/graphics-quality";
import {graphicsPresets} from "../../lib/graphics-presets";
import {daylightSunOffset,highSunOffset,highDaylightHorizon} from "../rendering/high-environment-config";
const HighDaylightSky=lazy(()=>import("../rendering/high-daylight-sky"));
import {Object3D,Color,Vector3,BackSide,DirectionalLight} from "three";

/** Analytic sky in the existing scene pass: no HDRI, environment capture or post effects. */
function DaylightSky({day}:{day:number}){
 const uniforms=useMemo(()=>({horizon:{value:new Color('#b0d1e9')},zenith:{value:new Color('#2e78bf')},ground:{value:new Color('#c2c7c6')},day:{value:1},sunDirection:{value:new Vector3(-45,65,35).normalize()}}),[]);
 uniforms.day.value=day;
 uniforms.horizon.value.set('#111c35').lerp(new Color('#b0d1e9'),day).lerp(new Color('#bc8b78'),2*day*(1-day));
 uniforms.zenith.value.set('#030817').lerp(new Color('#2e78bf'),day);
 uniforms.ground.value.set('#131924').lerp(new Color('#c2c7c6'),day);
 return <mesh name="daylight-sky" renderOrder={-1000} frustumCulled={false}>
  <sphereGeometry args={[1,16,8]}/>
  <shaderMaterial side={BackSide} depthWrite={false} depthTest={false} uniforms={uniforms}
   vertexShader={`varying vec3 skyDirection;void main(){skyDirection=position;vec4 clip=projectionMatrix*mat4(mat3(viewMatrix))*vec4(position,1.0);gl_Position=clip.xyww;}`}
   fragmentShader={`uniform vec3 horizon,zenith,ground,sunDirection;uniform float day;varying vec3 skyDirection;
    void main(){vec3 direction=normalize(skyDirection);float height=max(direction.y,0.0);
     vec3 sky=mix(horizon,zenith,pow(height,.50));
     sky=mix(sky,ground,(1.0-smoothstep(-.35,0.0,direction.y)));
     float glow=pow(max(dot(direction,sunDirection),0.0),24.0)*.08*day;
     gl_FragColor=vec4(mix(sky,vec3(1.0,.98,.94),glow),1.0);
     #include <tonemapping_fragment>
     #include <colorspace_fragment>
    }`}/>
 </mesh>;
}
/** VERY LOW: one low-poly sky draw, no HDR or environment capture. */
function CheapSky({day}:{day:number}){
 return <mesh name="very-low-sky" renderOrder={-1000} frustumCulled={false}>
  <sphereGeometry args={[1,8,4]}/>
  <shaderMaterial side={BackSide} depthWrite={false} depthTest={false} uniforms={{day:{value:day}}}
   vertexShader={`varying float skyHeight;void main(){skyHeight=position.y;
    vec4 clip=projectionMatrix*mat4(mat3(viewMatrix))*vec4(position,1.0);gl_Position=clip.xyww;}`}
   fragmentShader={`uniform float day;varying float skyHeight;void main(){
    vec3 daylight=mix(vec3(0.434,0.638,0.815),vec3(0.074,0.314,0.624),clamp(skyHeight,0.0,1.0));
    gl_FragColor=vec4(mix(vec3(.008,.015,.04),daylight,day),1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
   }`}/>
 </mesh>;
}
export function HeritageDaylight() {
 const hour=useStore(environmentStore,s=>s.hour),day=daylightAmount(hour);
 const quality=useGraphicsQuality(),budget=graphicsPresets[quality];
 const sky=new Color('#080f24').lerp(new Color(quality==='HIGH'?highDaylightHorizon:'#b0d1e9'),day);
 const twilight=4*day*(1-day);
 const sunColor=new Color(quality==='HIGH'?'#fff7eb':'#fff8ed').lerp(new Color('#efb57b'),twilight);
 const clock=useRef(0);
 const target=useMemo(()=>{const value=new Object3D();value.position.set(-48,0,-10);return value;},[]),sun=useRef<DirectionalLight>(null),elapsed=useRef(1);
 const lightOffset=useMemo(()=>quality==='HIGH'?highSunOffset.clone():new Vector3(...daylightSunOffset),[quality]);
 const direction=useMemo(()=>new Vector3(),[]),focus=useMemo(()=>new Vector3(-48,0,-10),[]);
 useEffect(()=>{sun.current?.position.copy(target.position).add(lightOffset);},[target,lightOffset]);
 useEffect(()=>{if(!sun.current)return;sun.current.shadow.map?.dispose();sun.current.shadow.map=null;sun.current.shadow.needsUpdate=true;},[budget.shadowSize]);
 useFrame(({camera},delta)=>{
  clock.current+=Math.min(delta,.25);if(clock.current>=.1){advanceEnvironment(clock.current);clock.current=0;}
  const angle=(environmentStore.getState().hour-12)*Math.PI/12;
  const altitude=Math.max(.04,Math.cos(angle));
  lightOffset.set(quality==='HIGH'?highSunOffset.x:daylightSunOffset[0],(quality==='HIGH'?highSunOffset.y:daylightSunOffset[1])*altitude,(quality==='HIGH'?highSunOffset.z:daylightSunOffset[2])+Math.sin(angle)*55);
  sun.current?.position.copy(target.position).add(lightOffset);
  if(!budget.shadows)return;elapsed.current+=delta;if(elapsed.current<.1)return;elapsed.current=0;
  camera.getWorldDirection(direction);focus.copy(camera.position).addScaledVector(direction,18);focus.y=0;
  const step=budget.shadowExtent*2/budget.shadowSize;
  focus.x=Math.round(focus.x/step)*step;focus.z=Math.round(focus.z/step)*step;
  target.position.copy(focus);target.updateMatrixWorld();sun.current?.position.copy(focus).add(lightOffset);
 });
 return <>
  <primitive object={target}/>
  <color attach="background" args={[sky]}/>
  {budget.sky==='cheap'&&<CheapSky day={day}/>}
  {budget.sky==='gradient'&&<DaylightSky day={day}/>}
  {budget.sky==='hdr'&&<Suspense fallback={null}><HighDaylightSky day={day}/></Suspense>}
  <fog attach="fog" args={[sky,110,360]}/>
  <hemisphereLight args={[new Color("#9eabc0").lerp(new Color("#d1e2fa"),day),new Color("#626879").lerp(new Color("#aba99f"),day),.55+(budget.hemisphere-.55)*day]}/>
  <ambientLight color={new Color("#b6becb").lerp(new Color("#f4f6f8"),day)} intensity={.12*(1-day)+budget.ambient*day}/>
  <directionalLight ref={sun} name="heritage-sun" position={[-93,65,25]} target={target} color={sunColor} intensity={budget.sun*day} castShadow={budget.shadows&&day>0} shadow-mapSize={[budget.shadowSize,budget.shadowSize]}
   shadow-camera-left={-budget.shadowExtent} shadow-camera-right={budget.shadowExtent} shadow-camera-top={budget.shadowExtent} shadow-camera-bottom={-budget.shadowExtent} shadow-camera-near={1} shadow-camera-far={180}
   shadow-normalBias={quality==='HIGH'?.012:.02} shadow-bias={-.00004} shadow-radius={quality==='HIGH'?2:1}/>
 </>;
}
