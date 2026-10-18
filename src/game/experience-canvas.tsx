"use client";
const NpcPopulation=lazy(()=>import("./npcs/npc-population").then(m=>({default:m.NpcPopulation})));
import {GameAudio} from "./audio/game-audio";
import {SquareCompletionBoundary} from "./world/square-completion-boundary";
const EditorScene=lazy(()=>import("../features/world-editor/editor-scene").then(m=>({default:m.EditorScene})));
import type {EditorSession} from "../features/world-editor/session";
import type {TransformOverrides} from "../features/world-editor/transforms";
import {KhaumaPhotoCamera} from "./world/khauma-photo-camera";

import { Suspense, lazy, useState, useEffect, useRef, type RefObject } from "react";
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

function CanvasUnavailable({onUnavailable}:Pick<ExperienceCanvasProps,"onUnavailable">){
  useEffect(()=>{onUnavailable();},[onUnavailable]);
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
  const [started,setStarted]=useState(false);
  const initialReady=()=>{setStarted(true);onReady();};
  return (
    <Canvas
      shadows={{ type: PCFShadowMap }}
      dpr={renderingConfig.dpr}
      camera={{ fov: reviewCamera ? 55 : camera.fov, near: camera.near, far: camera.far }}
      gl={{ toneMapping: ACESFilmicToneMapping, toneMappingExposure: renderingConfig.exposure, outputColorSpace: SRGBColorSpace }}
      fallback={<CanvasUnavailable onUnavailable={onUnavailable}/> }
      aria-label="Third-person spatial experience. Click to control camera; WASD move, Shift run, Space jump, Escape releases mouse."
    >
      <ContextGuard onUnavailable={onUnavailable} />
      <Suspense fallback={null}>
        <Physics gravity={worldConfig.gravity} lengthUnit={worldConfig.unitsPerMetre} timeStep={worldConfig.physicsTimeStep} updatePriority={-50} colliders={false} debug={developmentConfig.physicsDebug}>
          <GameAudio enabled={mode==="BHAKTAPUR"} runtime={runtime} input={input}>
          {editorSession?<EditorScene session={editorSession} input={input} runtime={runtime} onPointerStatus={onPointerStatus} spawn={spawn}/>:<>
          <SquareCompletionBoundary review={review}/>
          <World manualOverrides={manualOverrides} mode={mode} architecturalDebug={architecturalDebug} silhouette={silhouette} />
          <Player sittingEnabled={mode==="BHAKTAPUR"} seatingTransforms={manualOverrides} reviewCamera={reviewCamera} spawn={spawn} input={input} runtime={runtime} onPointerStatus={onPointerStatus} />
          {started&&mode==="BHAKTAPUR"&&<Suspense fallback={null}><NpcPopulation transforms={manualOverrides} player={runtime}/></Suspense>}
          <KhaumaPhotoCamera review={review} input={input} />
          </>}
          <SceneReady onReady={initialReady} />
          </GameAudio>
        </Physics>
      </Suspense>
      {developmentConfig.performance && <Stats />}
    </Canvas>
  );
}
