import { developmentConfig } from "@/lib/development-config";
import { Environment } from "./environment";
import { Ground } from "./ground";
import { TestEnvironment } from "./test-environment";
import { SpawnMarker } from "./spawn-marker";
import { worldConfig } from "./world-config";

export function World() {
  return (
    <>
      <Environment />
      <Ground />
      <TestEnvironment />
      {developmentConfig.spawnMarker && <SpawnMarker />}
      {developmentConfig.worldDebug && (
        <group position={[0, 0.01, 0]}>
          <gridHelper args={[worldConfig.ground.size, worldConfig.ground.size, "#727c78", "#a1aaa4"]} />
          <axesHelper args={[3]} />
        </group>
      )}
    </>
  );
}
