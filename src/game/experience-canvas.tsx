"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stats } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { developmentConfig } from "@/lib/development-config";
import { renderingConfig } from "@/lib/quality-config";
import { World } from "@/game/world/world";
import { worldConfig } from "@/game/world/world-config";
import { ACESFilmicToneMapping, PCFShadowMap, SRGBColorSpace } from "three";

interface ExperienceCanvasProps {
  onReady: () => void;
  onUnavailable: () => void;
}

function SceneReady({ onReady }: Pick<ExperienceCanvasProps, "onReady">) {
  const frames = useRef(0);
  useFrame(() => {
    // Notify once after the mounted physics/world has rendered its first frame.
    if (frames.current < 2 && ++frames.current === 2) onReady();
  });
  return null;
}

function ContextGuard({ onUnavailable }: Pick<ExperienceCanvasProps, "onUnavailable">) {
  const canvas = useThree((state) => state.gl.domElement);
  useEffect(() => {
    const handleContextLoss = (event: Event) => { event.preventDefault(); onUnavailable(); };
    canvas.addEventListener("webglcontextlost", handleContextLoss);
    return () => canvas.removeEventListener("webglcontextlost", handleContextLoss);
  }, [canvas, onUnavailable]);
  return null;
}

export default function ExperienceCanvas({ onReady, onUnavailable }: ExperienceCanvasProps) {
  const camera = worldConfig.camera;
  return (
    <Canvas
      shadows={{ type: PCFShadowMap }}
      dpr={renderingConfig.dpr}
      camera={{ position: camera.position, fov: camera.fov, near: camera.near, far: camera.far }}
      gl={{ toneMapping: ACESFilmicToneMapping, toneMappingExposure: renderingConfig.exposure, outputColorSpace: SRGBColorSpace }}
      fallback={<p>This experience requires a browser with WebGL support.</p>}
      aria-label="Engineering scale test scene with steps, ramp, doorway, walls, obstacles and raised floor"
    >
      <ContextGuard onUnavailable={onUnavailable} />
      <Suspense fallback={null}>
        <Physics gravity={worldConfig.gravity} lengthUnit={worldConfig.unitsPerMetre} timeStep={worldConfig.physicsTimeStep} colliders={false} debug={developmentConfig.physicsDebug}>
          <World />
          <SceneReady onReady={onReady} />
        </Physics>
      </Suspense>
      <OrbitControls makeDefault target={camera.target} minDistance={camera.minDistance} maxDistance={camera.maxDistance} maxPolarAngle={camera.maxPolarAngle} />
      {developmentConfig.performance && <Stats />}
    </Canvas>
  );
}
