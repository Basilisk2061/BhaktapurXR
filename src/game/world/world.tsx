import { developmentConfig } from "@/lib/development-config";
import { Environment } from "./environment";
import { Ground } from "./ground";
import { TestEnvironment } from "./test-environment";
import { SpawnMarker } from "./spawn-marker";
import { worldConfig } from "./world-config";

import { BhaktapurWorld } from "./bhaktapur-world";
import { worldSpawns, type WorldMode } from "./world-mode";
import { HeritageDaylight } from "@/game/architecture/daylight";

export function World({ mode, architecturalDebug=false }: { mode: WorldMode; architecturalDebug?:boolean }) {
  return (
    <>
      {mode === "BHAKTAPUR" ? <HeritageDaylight /> : <><Environment /><Ground config={worldConfig.ground} name="engineering-ground" /></>}
      {mode === "ENGINEERING" ? <TestEnvironment /> : <BhaktapurWorld architecturalDebug={architecturalDebug} />}
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
