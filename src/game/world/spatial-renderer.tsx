import { useMemo } from "react";
import { Line } from "@react-three/drei";
import { DoubleSide, Shape } from "three";
import type { SpatialFeature } from "@/types/spatial";

/** Footprint-only geometry: the source supplies no height, so no building is invented. */
export function SpatialFootprint({ feature }: { feature: SpatialFeature }) {
  const shape = useMemo(() => {
    const s = new Shape();
    feature.vertices.forEach(([x, z], i) => { if (i === 0) s.moveTo(x, -z); else s.lineTo(x, -z); });
    s.closePath(); return s;
  }, [feature]);
  return <mesh name={`spatial-footprint:${feature.id}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, 0]} receiveShadow userData={{ accuracy: feature.accuracy, height: "UNKNOWN", sourceIds: feature.sourceIds }}>
    <shapeGeometry args={[shape]} />
    <meshStandardMaterial color="#93948c" roughness={1} side={DoubleSide} />
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
  return <Line name={`spatial-outline:${feature.id}`} points={points} color={color} lineWidth={1} userData={{ accuracy: feature.accuracy, sourceIds: feature.sourceIds }} />;
}
