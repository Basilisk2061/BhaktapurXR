import { developmentReference, landmarks, sources } from "@/data/world/registry";
import { validateWorldData } from "@/lib/landmark-validation";
import { developmentConfig } from "@/lib/development-config";
import { LandmarkRenderer } from "./landmark-renderer";

import { SpatialDebug } from "./spatial-debug";
import { HeritageEnvironment } from "@/game/architecture/heritage-environment";

const renderRegistry = developmentConfig.worldReference ? [...landmarks, developmentReference] : landmarks;
validateWorldData(renderRegistry, sources);

export function BhaktapurWorld() {
  return <group name="bhaktapur-world-container">
    <HeritageEnvironment />
    {developmentConfig.spatialDebug && <SpatialDebug />}
    {renderRegistry.filter(l => !l.developmentOnly || developmentConfig.worldReference).map(l => <LandmarkRenderer key={l.id} landmark={l} />)}
  </group>;
}
