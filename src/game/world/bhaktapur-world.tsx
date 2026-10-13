import type {AssemblyEditorBinding} from "../../features/world-editor/binding";
import type {TransformOverrides} from "../../features/world-editor/transforms";
import {CentralHeritageEnvironment} from "@/game/architecture/central-environment";
// Phase 5B renderer/data remain in source control for comparison. Normal gameplay
// uses only Phase 7A/7B identity-bound models at frozen Phase 6C anchors.
export function BhaktapurWorld({architecturalDebug=false,silhouette=false,assemblyEditor,manualOverrides}:{architecturalDebug?:boolean;silhouette?:boolean;assemblyEditor?:AssemblyEditorBinding;manualOverrides?:TransformOverrides}) {
 return <group name="bhaktapur-world-container"><CentralHeritageEnvironment debug={architecturalDebug} silhouette={silhouette} assemblyEditor={assemblyEditor} manualOverrides={manualOverrides}/></group>;
}
