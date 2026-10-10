import type { RefObject } from "react";
import type { Group } from "three";
import { playerConfig } from "./player-config";

/** Engineering proxy only. A future rigged GLB replaces this attachment, not physics. */
export function PlayerProxy({ visualRef }: { visualRef: RefObject<Group | null> }) {
  return (
    <group ref={visualRef} name="temporary-player-proxy">
      <mesh castShadow receiveShadow>
        <capsuleGeometry args={[playerConfig.radius, playerConfig.capsuleHalfSegment * 2, 4, 12]} />
        <meshStandardMaterial color="#6b776b" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.45, -playerConfig.radius - 0.04]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
        <coneGeometry args={[0.12, 0.22, 4]} />
        <meshStandardMaterial color="#b29a70" roughness={0.85} />
      </mesh>
    </group>
  );
}
