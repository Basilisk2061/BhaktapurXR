import { developmentReference, landmarks, sources } from "@/data/world/registry";
import { validateWorldData } from "@/lib/landmark-validation";
import { developmentConfig } from "@/lib/development-config";
import { LandmarkRenderer } from "./landmark-renderer";

const renderRegistry = developmentConfig.worldReference ? [...landmarks, developmentReference] : landmarks;
validateWorldData(renderRegistry, sources);

export function BhaktapurWorld() {
  return <group name="bhaktapur-world-container">
    {renderRegistry.filter(l => !l.developmentOnly || developmentConfig.worldReference).map(l => <LandmarkRenderer key={l.id} landmark={l} />)}
  </group>;
}
