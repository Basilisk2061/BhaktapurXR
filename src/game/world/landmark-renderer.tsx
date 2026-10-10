import { Component, Suspense, type ReactNode } from "react";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import type { Landmark } from "@/types/landmark";
import { ModelAsset } from "@/game/assets/model-asset";
import { parseLandmarkModelPath } from "@/lib/landmark-validation";

export function LandmarkPlaceholder({ landmark }: { landmark: Landmark }) {
  const { width, height, depth } = landmark.approximateDimensions;
  return <mesh name={`placeholder:${landmark.id}`} position={[0, height / 2, 0]} castShadow receiveShadow>
    <boxGeometry args={[width, height, depth]} />
    <meshStandardMaterial color="#a6a39b" roughness={0.95} />
  </mesh>;
}

class ModelFallback extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error: Error) { console.warn("Landmark model unavailable; using explicit placeholder", error.message); }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

export function LandmarkRenderer({ landmark }: { landmark: Landmark }) {
  const { position, rotation, scale } = landmark.transform;
  const { width, height, depth } = landmark.approximateDimensions;
  const model = landmark.modelAssetPath ? parseLandmarkModelPath(landmark.modelAssetPath) : null;
  const placeholder = <LandmarkPlaceholder landmark={landmark} />;
  return <group name={`landmark:${landmark.id}`} position={position} rotation={rotation} scale={scale} userData={{ id: landmark.id, accuracy: landmark.accuracy, developmentOnly: !!landmark.developmentOnly }}>
    {model ? <ModelFallback key={landmark.modelAssetPath} fallback={placeholder}><Suspense fallback={placeholder}><ModelAsset {...model} /></Suspense></ModelFallback> : placeholder}
    {landmark.collision === "bounds" && <RigidBody type="fixed" colliders={false}>
      <CuboidCollider args={[width / 2, height / 2, depth / 2]} position={[0, height / 2, 0]} />
    </RigidBody>}
  </group>;
}
