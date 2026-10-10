import { developmentReference, landmarks, sources } from "@/data/world/registry";
import { validateWorldData } from "@/lib/landmark-validation";
import { developmentConfig } from "@/lib/development-config";
import { LandmarkRenderer } from "./landmark-renderer";
import { spatialFeatures } from "@/data/world/spatial-registry";
import { SpatialFootprint } from "./spatial-renderer";
import { SpatialDebug } from "./spatial-debug";

const renderRegistry = developmentConfig.worldReference ? [...landmarks, developmentReference] : landmarks;
validateWorldData(renderRegistry, sources);

export function BhaktapurWorld() {
  return <group name="bhaktapur-world-container">
    {spatialFeatures.filter(f => f.kind === "building-footprint").map(f => <SpatialFootprint key={f.id} feature={f} />)}
    {developmentConfig.spatialDebug && <SpatialDebug />}
    {renderRegistry.filter(l => !l.developmentOnly || developmentConfig.worldReference).map(l => <LandmarkRenderer key={l.id} landmark={l} />)}
  </group>;
}
