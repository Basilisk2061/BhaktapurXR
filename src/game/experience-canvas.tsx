"use client";
import type {ItemSession} from "./inventory/inventory-store";
import {BirdFood} from "./food/bird-food";
import {BellInteractions} from "./bells/bell-session";
const PigeonFlocks=lazy(()=>import("./pigeons/pigeon-flocks").then(m=>({default:m.PigeonFlocks})));
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
import {graphicsPresets} from "../lib/graphics-presets";
import {useGraphicsQuality} from "../lib/graphics-quality";
import {RendererQuality} from "./rendering/renderer-quality";
import {VeryLowResolution} from "./rendering/very-low-resolution";
const HighQualityEffects=lazy(()=>import("./rendering/high-quality-effects"));
import { World } from "@/game/world/world";
import { worldConfig } from "@/game/world/world-config";
import { ACESFilmicToneMapping, AgXToneMapping, PCFShadowMap, PCFSoftShadowMap, SRGBColorSpace } from "three";
import { Player } from "@/game/player/player";
import { playerConfig } from "@/game/player/player-config";
import type { PlayerInput, PointerStatus } from "@/game/input/player-input";
import type { PlayerRuntime } from "@/game/player/player-runtime";

import { type WorldMode } from "./world/world-mode";

import type { SpawnPoint } from "@/types/world";

interface ExperienceCanvasProps {
  items?:ItemSession;
  touchControls?:boolean;
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

/** One render owner: existing HIGH pipeline, or camera-only DOF on LOW/MEDIUM. */
function PhotographyEffects({runtime}:{runtime:RefObject<PlayerRuntime>}){
 const quality=useGraphicsQuality(),[active,setActive]=useState(false),previous=useRef(false);
 useFrame(()=>{const next=quality!=='VERY LOW'&&(runtime.current.handheldCamera?.view??0)>0;if(next!==previous.current){previous.current=next;setActive(next);}});
 return quality==='HIGH'||(quality!=='VERY LOW'&&active)?<Suspense fallback={null}><HighQualityEffects runtime={runtime} quality={quality}/></Suspense>:null;
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

export default function ExperienceCanvas({ items, onReady, onUnavailable, input, runtime, onPointerStatus, mode, spawn, architecturalDebug, silhouette, reviewCamera, review, editorSession, manualOverrides,touchControls=false }: ExperienceCanvasProps) {
  const camera = playerConfig.camera;
  const quality=useGraphicsQuality(),budget=graphicsPresets[quality];
  const dpr:[number,number]=[quality==='VERY LOW'&&touchControls?.5:budget.dpr[0],touchControls?budget.mobileDpr:budget.dpr[1]];
  const [started,setStarted]=useState(false);
  const initialReady=()=>{setStarted(true);onReady();};
  return (
    <Canvas
      style={touchControls?{touchAction:"none"}:undefined}
      shadows={budget.shadows?{type:quality==='HIGH'?PCFSoftShadowMap:PCFShadowMap}:false}
      dpr={dpr}
      camera={{ fov: reviewCamera ? 55 : camera.fov, near: camera.near, far: camera.far }}
      gl={{ antialias:false, toneMapping:quality==='HIGH'?AgXToneMapping:ACESFilmicToneMapping, toneMappingExposure:budget.exposure, outputColorSpace: SRGBColorSpace }}
      fallback={<p>This experience requires a browser with WebGL support.</p>}
      aria-label="Third-person spatial experience. Click to control camera; WASD move, Shift run, Space jump, Escape releases mouse."
    >
      <ContextGuard onUnavailable={onUnavailable} />
      <RendererQuality/>
      {quality==='VERY LOW'&&<VeryLowResolution mobile={touchControls}/>}
      <PhotographyEffects runtime={runtime}/>
      <Suspense fallback={null}>
        <Physics gravity={worldConfig.gravity} lengthUnit={worldConfig.unitsPerMetre} timeStep={worldConfig.physicsTimeStep} updatePriority={-50} colliders={false} debug={developmentConfig.physicsDebug}>
          <GameAudio enabled={mode==="BHAKTAPUR"} runtime={runtime} input={input}>
          <BellInteractions enabled={mode==="BHAKTAPUR"&&!editorSession} runtime={runtime} input={input}>
          {editorSession?<EditorScene session={editorSession} input={input} runtime={runtime} onPointerStatus={onPointerStatus} spawn={spawn}/>:<>
          <SquareCompletionBoundary review={review}/>
          <World manualOverrides={manualOverrides} mode={mode} architecturalDebug={architecturalDebug} silhouette={silhouette} />
          <Player sittingEnabled={mode==="BHAKTAPUR"} seatingTransforms={manualOverrides} reviewCamera={reviewCamera} spawn={spawn} input={input} runtime={runtime} onPointerStatus={onPointerStatus} />
          {started&&mode==="BHAKTAPUR"&&<Suspense fallback={null}><NpcPopulation transforms={manualOverrides} player={runtime}/></Suspense>}
          {started&&mode==="BHAKTAPUR"&&<Suspense fallback={null}><>{items&&<BirdFood session={items} input={input} player={runtime}/>}<PigeonFlocks player={runtime} food={items?.food}/></></Suspense>}
          <KhaumaPhotoCamera review={review} input={input} />
          </>}
          <SceneReady onReady={initialReady} />
          </BellInteractions>
          </GameAudio>
        </Physics>
      </Suspense>
      {developmentConfig.performance && <Stats />}
    </Canvas>
  );
}
