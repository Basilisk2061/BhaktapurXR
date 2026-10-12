import { architectureQuality } from "@/data/architecture/config";
import { DEFAULT_QUALITY_PRESET } from "@/lib/quality-config";

export function HeritageDaylight() {
  const size=architectureQuality[DEFAULT_QUALITY_PRESET].shadowSize;
  return <>
    <color attach="background" args={["#9ec8e9"]} />
    <hemisphereLight args={["#dceafa","#9b8974",1.35]} />
    <ambientLight color="#f4f1e8" intensity={.35} />
    <directionalLight name="heritage-sun" position={[-45,65,35]} color="#fff2dc" intensity={2.8} castShadow shadow-mapSize={[size,size]}
      shadow-camera-left={-85} shadow-camera-right={85} shadow-camera-top={85} shadow-camera-bottom={-85} shadow-camera-near={1} shadow-camera-far={200}
      shadow-normalBias={.022} shadow-bias={-.00008} />
  </>;
}
