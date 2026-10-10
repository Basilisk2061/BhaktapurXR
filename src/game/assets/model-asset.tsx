"use client";

import { Clone, useGLTF } from "@react-three/drei";
import type { ThreeElements } from "@react-three/fiber";
import { modelPath, type ModelCategory } from "@/lib/asset-paths";

type ModelAssetProps = Omit<ThreeElements["group"], "children" | "dispose"> & {
  category: ModelCategory;
  filename: string;
};

/** Render beneath the experience Suspense/error boundary; colliders remain explicit. */
export function ModelAsset({ category, filename, ...transform }: ModelAssetProps) {
  const { scene } = useGLTF(modelPath(category, filename), false, false);
  return <group {...transform} dispose={null}><Clone object={scene} castShadow receiveShadow dispose={null} /></group>;
}

export function preloadModel(category: ModelCategory, filename: string): void {
  useGLTF.preload(modelPath(category, filename), false, false);
}
