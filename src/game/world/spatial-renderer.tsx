import { useMemo } from "react";
import { Line } from "@react-three/drei";
import { Path, Shape, type Material } from "three";
import type { SpatialFeature } from "@/types/spatial";
import { spatialVisualConfig } from "./spatial-visual-config";

/** Footprint-only geometry: the source supplies no height, so no building is invented. */
export function SpatialFootprint({ feature, material }: { feature: SpatialFeature; material: Material }) {
  const shape = useMemo(() => {
    const s = new Shape();
    feature.vertices.forEach(([x, z], i) => { if (i === 0) s.moveTo(x, -z); else s.lineTo(x, -z); });
    s.closePath();
    for (const ring of feature.holes ?? []) {
      const hole = new Path();
      ring.forEach(([x, z], i) => { if (i === 0) hole.moveTo(x, -z); else hole.lineTo(x, -z); });
      hole.closePath(); s.holes.push(hole);
    }
    return s;
  }, [feature]);
  return <mesh name={`spatial-footprint:${feature.id}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, feature.kind === "open-square" ? spatialVisualConfig.openSpaceElevation : spatialVisualConfig.footprintElevation, 0]} receiveShadow userData={{ accuracy: feature.accuracy, footprintClass: feature.footprintClass, height: "UNKNOWN", sourceIds: feature.sourceIds }}>
    <shapeGeometry args={[shape]} />
    <primitive object={material} attach="material" />
  </mesh>;
}

export function SpatialOutline({ feature }: { feature: SpatialFeature }) {
  const points = useMemo(() => {
    const points: [number, number, number][] = feature.vertices.map(([x, z]) => [x, 0.07, z]);
    if (feature.kind !== "route" && feature.kind !== "landmark-anchor") points.push(points[0]);
    return points;
  }, [feature]);
  const color = feature.kind === "core-boundary" ? "#946844" : feature.kind === "buffer-boundary" ? "#5b7690" : "#557866";
  if (feature.kind === "landmark-anchor") return <mesh position={points[0]} name={`spatial-anchor:${feature.id}`}><sphereGeometry args={[0.3, 8, 6]} /><meshBasicMaterial color={color} /></mesh>;
  return <group>
    <Line name={`spatial-outline:${feature.id}`} points={points} color={color} lineWidth={1} userData={{ accuracy: feature.accuracy, sourceIds: feature.sourceIds }} />
    {(feature.holes ?? []).map((ring, i) => <Line key={i} points={[...ring, ring[0]].map(([x, z]) => [x, 0.07, z])} color={color} lineWidth={1} />)}
  </group>;
}
