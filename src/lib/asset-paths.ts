export const modelDirectories = {
  environment: "/assets/models/environment",
  architecture: "/assets/models/architecture",
  characters: "/assets/models/characters",
} as const;

export type ModelCategory = keyof typeof modelDirectories;

/** Public-relative paths only; callers supply a future local GLB/glTF filename. */
export function modelPath(category: ModelCategory, filename: string): string {
  if (!/^[a-zA-Z0-9_-]+\.(glb|gltf)$/i.test(filename)) {
    throw new Error("Model filename must be a local .glb or .gltf filename without directories.");
  }
  return `${modelDirectories[category]}/${filename}`;
}
