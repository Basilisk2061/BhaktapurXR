import { developmentReference, landmarks, sources } from "@/data/world/registry";
import { validateWorldData } from "@/lib/landmark-validation";
import { developmentConfig } from "@/lib/development-config";
import { LandmarkRenderer } from "./landmark-renderer";
import { spatialFeatures } from "@/data/world/spatial-registry";
import { SpatialFootprint } from "./spatial-renderer";
import { SpatialDebug } from "./spatial-debug";
import { useEffect, useMemo } from "react";
import { DoubleSide, MeshStandardMaterial } from "three";
import { spatialVisualConfig } from "./spatial-visual-config";

const renderRegistry = developmentConfig.worldReference ? [...landmarks, developmentReference] : landmarks;
validateWorldData(renderRegistry, sources);

export function BhaktapurWorld() {
  const materials = useMemo(() => ({
    monument: new MeshStandardMaterial({ color: spatialVisualConfig.colors.monument, roughness: 1, side: DoubleSide }),
    building: new MeshStandardMaterial({ color: spatialVisualConfig.colors.building, roughness: 1, side: DoubleSide }),
    openSpace: new MeshStandardMaterial({ color: spatialVisualConfig.colors.openSpace, roughness: 1, side: DoubleSide }),
  }), []);
  useEffect(() => () => { Object.values(materials).forEach(m => m.dispose()); }, [materials]);
  return <group name="bhaktapur-world-container">
    {spatialFeatures.filter(f => f.kind === "building-footprint" || f.kind === "open-square").map(f => <SpatialFootprint key={f.id} feature={f} material={f.kind === "open-square" ? materials.openSpace : f.footprintClass === "monument" ? materials.monument : materials.building} />)}
    {developmentConfig.spatialDebug && <SpatialDebug />}
    {renderRegistry.filter(l => !l.developmentOnly || developmentConfig.worldReference).map(l => <LandmarkRenderer key={l.id} landmark={l} />)}
  </group>;
}
