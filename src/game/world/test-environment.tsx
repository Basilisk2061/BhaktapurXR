import { useEffect, useMemo } from "react";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { BoxGeometry, MeshStandardMaterial } from "three";
import { testEnvironmentBoxes } from "./test-environment-config";

export function TestEnvironment() {
  const geometry = useMemo(() => new BoxGeometry(1, 1, 1), []);
  const material = useMemo(() => new MeshStandardMaterial({ color: "#909a99", roughness: 0.85, metalness: 0 }), []);

  useEffect(() => () => { geometry.dispose(); material.dispose(); }, [geometry, material]);

  return (
    <RigidBody type="fixed" colliders={false} name="engineering-course" friction={0.8}>
      {testEnvironmentBoxes.map(({ id, position, rotation, size }) => (
        <group key={id} name={id} position={position} rotation={rotation}>
          <CuboidCollider args={[size[0] / 2, size[1] / 2, size[2] / 2]} />
          <mesh geometry={geometry} material={material} scale={size} castShadow receiveShadow dispose={null} />
        </group>
      ))}
    </RigidBody>
  );
}
