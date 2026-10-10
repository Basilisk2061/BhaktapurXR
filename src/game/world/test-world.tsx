import { CuboidCollider, RigidBody } from "@react-three/rapier";

// Engineering fixtures only; these positions have no geographic meaning.
export function TestWorld() {
  return (
    <group>
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[15, 0.25, 15]} position={[0, -0.25, 0]} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[30, 30]} />
          <meshStandardMaterial color="#b8b9ae" roughness={1} />
        </mesh>
      </RigidBody>
      <RigidBody position={[-3, 2, 0]} colliders="cuboid">
        <mesh castShadow receiveShadow><boxGeometry args={[1.5, 1.5, 1.5]} /><meshStandardMaterial color="#8b999c" roughness={0.8} /></mesh>
      </RigidBody>
      <RigidBody position={[0, 4, 1]} colliders="ball" restitution={0.35}>
        <mesh castShadow receiveShadow><sphereGeometry args={[0.8, 24, 16]} /><meshStandardMaterial color="#ac9b85" roughness={0.75} /></mesh>
      </RigidBody>
      <RigidBody type="fixed" position={[3, 1.5, -2]} colliders="cuboid">
        <mesh castShadow receiveShadow><boxGeometry args={[1, 3, 1]} /><meshStandardMaterial color="#8e9389" roughness={0.9} /></mesh>
      </RigidBody>
    </group>
  );
}
