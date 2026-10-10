import { renderingConfig } from "@/lib/quality-config";

export function Environment() {
  const { sunlight, ambient, shadows } = renderingConfig;
  return (
    <>
      <color attach="background" args={[renderingConfig.background]} />
      <hemisphereLight args={[ambient.skyColor, ambient.groundColor, ambient.intensity]} />
      <directionalLight
        position={sunlight.position}
        intensity={sunlight.intensity}
        color={sunlight.color}
        castShadow
        shadow-mapSize={[shadows.mapSize, shadows.mapSize]}
        shadow-camera-left={-shadows.extent}
        shadow-camera-right={shadows.extent}
        shadow-camera-top={shadows.extent}
        shadow-camera-bottom={-shadows.extent}
        shadow-camera-near={1}
        shadow-camera-far={60}
        shadow-normalBias={shadows.normalBias}
      />
    </>
  );
}
