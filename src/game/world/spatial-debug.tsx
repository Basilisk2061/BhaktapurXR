import { Vector3 } from "three";
import { mapCalibrations } from "@/data/world/map-measurements";
import { spatialFeatures } from "@/data/world/spatial-registry";
import { mapPointToLocal } from "@/lib/map-calibration";
import { SpatialOutline } from "./spatial-renderer";

const north = new Vector3(0, 0, -1);
const arrowOrigin = new Vector3(0, 0.1, 0);

export function SpatialDebug() {
  return <group name="bhaktapur-spatial-debug">
    <axesHelper name="local-origin-axes" args={[3]} />
    <arrowHelper name="local-north-convention" args={[north, arrowOrigin, 5, "#557866"]} />
    {spatialFeatures.map(f => <SpatialOutline key={f.id} feature={f} />)}
    {mapCalibrations.flatMap(c => [c.origin, c.scaleBar.start, c.scaleBar.end, c.northArrow.base, c.northArrow.tip].map((p, i) => {
      const [x, z] = mapPointToLocal(p, c);
      return <mesh key={`${c.id}:${i}`} name={`calibration-anchor:${c.id}:${i}`} position={[x, 0.12, z]}><sphereGeometry args={[0.25, 8, 6]} /><meshBasicMaterial color="#96763a" /></mesh>;
    }))}
  </group>;
}
