import {CentralHeritageEnvironment} from "@/game/architecture/central-environment";
// Phase 5B renderer/data remain in source control for comparison. Normal gameplay
// uses only Phase 7A identity-bound models at frozen Phase 6C anchors.
export function BhaktapurWorld({architecturalDebug=false}:{architecturalDebug?:boolean}) {
 return <group name="bhaktapur-world-container"><CentralHeritageEnvironment debug={architecturalDebug}/></group>;
}
