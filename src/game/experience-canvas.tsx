"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stats } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { developmentConfig } from "@/lib/development-config";
import { TestWorld } from "@/game/world/test-world";

export default function ExperienceCanvas() {
  return (
    <Canvas shadows dpr={[1, 1.5]} camera={{ position: [10, 8, 12], fov: 45, near: 0.1, far: 100 }} fallback={<p className="p-6">This experience requires a browser with WebGL support.</p>} aria-label="Temporary engineering test scene with a ground plane and primitive physics objects">
      <color attach="background" args={["#dce3e4"]} />
      <hemisphereLight args={["#eef4ff", "#68685c", 1.5]} />
      <directionalLight position={[6, 10, 5]} intensity={2} castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-12} shadow-camera-right={12} shadow-camera-top={12} shadow-camera-bottom={-12} shadow-normalBias={0.03} />
      <Suspense fallback={null}>
        <Physics gravity={[0, -9.81, 0]} debug={developmentConfig.physicsDebug}>
          <TestWorld />
        </Physics>
      </Suspense>
      <OrbitControls makeDefault target={[0, 1, 0]} minDistance={3} maxDistance={35} maxPolarAngle={Math.PI / 2 - 0.05} />
      {developmentConfig.worldDebug && <axesHelper args={[3]} />}
      {developmentConfig.performance && <Stats />}
    </Canvas>
  );
}
