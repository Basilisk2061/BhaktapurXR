import { architectureQuality } from "@/data/architecture/config";
import { DEFAULT_QUALITY_PRESET } from "@/lib/quality-config";

export function HeritageDaylight() {
  const size=architectureQuality[DEFAULT_QUALITY_PRESET].shadowSize;
  return <>
    <color attach="background" args={["#c8d8e1"]} />
    <fog attach="fog" args={["#c8d8e1",120,240]} />
    <hemisphereLight args={["#e8f0f6","#8f7965",1.45]} />
    <directionalLight name="heritage-sun" position={[-45,65,35]} color="#fff4e2" intensity={3.1} castShadow shadow-mapSize={[size,size]}
      shadow-camera-left={-85} shadow-camera-right={85} shadow-camera-top={85} shadow-camera-bottom={-85} shadow-camera-near={1} shadow-camera-far={200}
      shadow-normalBias={.045} shadow-bias={-.00008} />
  </>;
}
