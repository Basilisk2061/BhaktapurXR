import { developmentConfig } from "@/lib/development-config";
import { Environment } from "./environment";
import { Ground } from "./ground";
import { TestEnvironment } from "./test-environment";
import { SpawnMarker } from "./spawn-marker";
import { worldConfig } from "./world-config";

import { BhaktapurWorld } from "./bhaktapur-world";
import { worldSpawns, type WorldMode } from "./world-mode";
import { bhaktapurGround } from "@/data/world/map-measurements";

export function World({ mode }: { mode: WorldMode }) {
  return (
    <>
      <Environment />
      <Ground config={mode === "BHAKTAPUR" ? bhaktapurGround : worldConfig.ground} name={mode === "BHAKTAPUR" ? "bhaktapur-development-ground" : "engineering-ground"} />
      {mode === "ENGINEERING" ? <TestEnvironment /> : <BhaktapurWorld />}
      {developmentConfig.spawnMarker && <SpawnMarker spawn={worldSpawns[mode]} />}
      {developmentConfig.worldDebug && (
        <group position={[0, 0.01, 0]}>
          <gridHelper args={[worldConfig.ground.size, worldConfig.ground.size, "#727c78", "#a1aaa4"]} />
          <axesHelper args={[3]} />
        </group>
      )}
    </>
  );
}
