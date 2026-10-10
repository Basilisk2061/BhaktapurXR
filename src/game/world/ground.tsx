import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { worldConfig } from "./world-config";

export function Ground({ config = worldConfig.ground, name = "engineering-ground" }: { config?: { size: number; thickness: number; surfaceY: number }; name?: string }) {
  const { size, thickness, surfaceY } = config;
  return (
    <RigidBody type="fixed" colliders={false} name={name} friction={0.8}>
      <CuboidCollider args={[size / 2, thickness / 2, size / 2]} position={[0, surfaceY - thickness / 2, 0]} />
      <mesh position={[0, surfaceY, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[size, size]} />
        <meshStandardMaterial color="#b8b9ae" roughness={1} />
      </mesh>
    </RigidBody>
  );
}
