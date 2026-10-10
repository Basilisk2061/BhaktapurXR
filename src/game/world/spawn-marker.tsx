import { defaultSpawn } from "./spawn-config";
import { Vector3 } from "three";

const forward = new Vector3(0, 0, -1);
const origin = new Vector3(0, 0.1, 0);

export function SpawnMarker() {
  return (
    <group name="default-spawn-marker" position={defaultSpawn.position} rotation={defaultSpawn.rotation}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.35, 0.45, 24]} />
        <meshBasicMaterial color="#946c36" />
      </mesh>
      <arrowHelper args={[forward, origin, 1, "#946c36"]} />
    </group>
  );
}
