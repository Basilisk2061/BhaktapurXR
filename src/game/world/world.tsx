import savedScene from "../../features/bhaktapur/data/world-editor-state.json";
import {EditorPrimitives} from "../../features/world-editor/editor-primitives";
import type {CreatedObject} from "../../features/world-editor/scene-data";
import type {AssemblyEditorBinding} from "../../features/world-editor/binding";
import type {TransformOverrides} from "../../features/world-editor/transforms";
import { developmentConfig } from "@/lib/development-config";
import { Environment } from "./environment";
import { Ground } from "./ground";
import { TestEnvironment } from "./test-environment";
import { SpawnMarker } from "./spawn-marker";
import { worldConfig } from "./world-config";

import { BhaktapurWorld } from "./bhaktapur-world";
import { worldSpawns, type WorldMode } from "./world-mode";
import { HeritageDaylight } from "@/game/architecture/daylight";

export function World({ mode, architecturalDebug=false, silhouette=false, assemblyEditor, manualOverrides }: { mode: WorldMode; architecturalDebug?:boolean;silhouette?:boolean;assemblyEditor?:AssemblyEditorBinding;manualOverrides?:TransformOverrides }) {
  return (
    <>
      {mode === "BHAKTAPUR" ? <HeritageDaylight /> : <><Environment /><Ground config={worldConfig.ground} name="engineering-ground" /></>}
      {mode === "ENGINEERING" ? <TestEnvironment /> : <BhaktapurWorld architecturalDebug={architecturalDebug} silhouette={silhouette} assemblyEditor={assemblyEditor} manualOverrides={manualOverrides} />}
      {mode==="BHAKTAPUR"&&!assemblyEditor&&<EditorPrimitives objects={savedScene.createdObjects as CreatedObject[]}/>}
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
