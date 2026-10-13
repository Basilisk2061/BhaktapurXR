"use client";
import {EditorScene} from "../features/world-editor/editor-scene";
import type {EditorSession} from "../features/world-editor/session";
import type {TransformOverrides} from "../features/world-editor/transforms";
import {KhaumaPhotoCamera} from "./world/khauma-photo-camera";

import { Suspense, useEffect, useRef, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stats } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { developmentConfig } from "@/lib/development-config";
import { renderingConfig } from "@/lib/quality-config";
import { World } from "@/game/world/world";
import { worldConfig } from "@/game/world/world-config";
import { ACESFilmicToneMapping, PCFShadowMap, SRGBColorSpace } from "three";
import { Player } from "@/game/player/player";
import { playerConfig } from "@/game/player/player-config";
import type { PlayerInput, PointerStatus } from "@/game/input/player-input";
import type { PlayerRuntime } from "@/game/player/player-runtime";

import { type WorldMode } from "./world/world-mode";

import type { SpawnPoint } from "@/types/world";

interface ExperienceCanvasProps {
  editorSession?:EditorSession;
  manualOverrides?:TransformOverrides;
  spawn:SpawnPoint;
  reviewCamera:boolean;
  review:string|null;
  architecturalDebug:boolean;
  silhouette:boolean;
  mode: WorldMode;
  onReady: () => void;
  onUnavailable: () => void;
  input: RefObject<PlayerInput>;
  runtime: RefObject<PlayerRuntime>;
  onPointerStatus: (status: PointerStatus) => void;
}

function SceneReady({ onReady }: Pick<ExperienceCanvasProps, "onReady">) {
  const frames = useRef(0);
  useFrame(() => {
    // Notify once after the mounted physics/world has rendered its first frame.
    if (frames.current < 2 && ++frames.current === 2) onReady();
  });
  return null;
}

function ContextGuard({ onUnavailable }: Pick<ExperienceCanvasProps, "onUnavailable">) {
  const canvas = useThree((state) => state.gl.domElement);
  useEffect(() => {
    const handleContextLoss = (event: Event) => { event.preventDefault(); onUnavailable(); };
    canvas.addEventListener("webglcontextlost", handleContextLoss);
    return () => canvas.removeEventListener("webglcontextlost", handleContextLoss);
  }, [canvas, onUnavailable]);
  return null;
}

export default function ExperienceCanvas({ onReady, onUnavailable, input, runtime, onPointerStatus, mode, spawn, architecturalDebug, silhouette, reviewCamera, review, editorSession, manualOverrides }: ExperienceCanvasProps) {
  const camera = playerConfig.camera;
  return (
    <Canvas
      shadows={{ type: PCFShadowMap }}
      dpr={renderingConfig.dpr}
      camera={{ fov: reviewCamera ? 55 : camera.fov, near: camera.near, far: camera.far }}
      gl={{ toneMapping: ACESFilmicToneMapping, toneMappingExposure: renderingConfig.exposure, outputColorSpace: SRGBColorSpace }}
      fallback={<p>This experience requires a browser with WebGL support.</p>}
      aria-label="Third-person spatial experience. Click to control camera; WASD move, Shift run, Space jump, Escape releases mouse."
    >
      <ContextGuard onUnavailable={onUnavailable} />
      <Suspense fallback={null}>
        <Physics gravity={worldConfig.gravity} lengthUnit={worldConfig.unitsPerMetre} timeStep={worldConfig.physicsTimeStep} updatePriority={-50} colliders={false} debug={developmentConfig.physicsDebug}>
          {editorSession?<EditorScene session={editorSession} input={input} runtime={runtime} onPointerStatus={onPointerStatus} spawn={spawn}/>:<>
          <World manualOverrides={manualOverrides} mode={mode} architecturalDebug={architecturalDebug} silhouette={silhouette} />
          <Player reviewCamera={reviewCamera} spawn={spawn} input={input} runtime={runtime} onPointerStatus={onPointerStatus} />
          <KhaumaPhotoCamera review={review} input={input} />
          </>}
          <SceneReady onReady={onReady} />
        </Physics>
      </Suspense>
      {developmentConfig.performance && <Stats />}
    </Canvas>
  );
}
