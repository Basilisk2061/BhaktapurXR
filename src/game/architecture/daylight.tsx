import {useMemo} from "react";
import {Object3D} from "three";
import { architectureQuality } from "@/data/architecture/config";
import { DEFAULT_QUALITY_PRESET } from "@/lib/quality-config";

export function HeritageDaylight() {
  const target=useMemo(()=>{const target=new Object3D();target.position.set(-48,0,-10);return target;},[]);
  const size=architectureQuality[DEFAULT_QUALITY_PRESET].shadowSize;
  return <>
    <primitive object={target} />
    <color attach="background" args={["#9ec8e9"]} />
    <hemisphereLight args={["#dceafa","#a29a8b",1.45]} />
    <ambientLight color="#f4f1e8" intensity={.38} />
    <directionalLight name="heritage-sun" position={[-93,65,25]} target={target} color="#fff5e8" intensity={2.65} castShadow shadow-mapSize={[size,size]}
      shadow-camera-left={-100} shadow-camera-right={100} shadow-camera-top={90} shadow-camera-bottom={-90} shadow-camera-near={1} shadow-camera-far={240}
      shadow-normalBias={.022} shadow-bias={-.00008} />
  </>;
}
