"use client";
import {startupDiagnosticsEnabled,startupMark,startupInfo,startupError,startupResource} from "./startup-diagnostics";
const NpcPopulation=lazy(()=>{startupMark("NPC module (after readiness)","WAITING","requested; not a startup prerequisite");return import("./npcs/npc-population").then(m=>{startupMark("NPC module (after readiness)");return {default:m.NpcPopulation};}).catch(error=>{startupMark("NPC module (after readiness)","ERROR");startupError(error,"NPC module");throw error;});});
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
import { DefaultLoadingManager, ACESFilmicToneMapping, PCFShadowMap, SRGBColorSpace } from "three";
import { Player } from "@/game/player/player";
import { playerConfig } from "@/game/player/player-config";
import type { PlayerInput, PointerStatus } from "@/game/input/player-input";
import type { PlayerRuntime } from "@/game/player/player-runtime";

import { type WorldMode } from "./world/world-mode";

import type { SpawnPoint } from "@/types/world";

interface ExperienceCanvasProps {
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

function SceneReady({ onReady }: Pick<ExperienceCanvasProps, "onReady">) {
  const frames = useRef(0);
  useEffect(()=>{startupMark("Critical scene committed");startupMark("Physics/world committed");startupMark("Critical Suspense","OK","existing boundary committed; player/NPC visuals have separate boundaries");},[]);
  useFrame(() => {
    // Notify once after the mounted physics/world has rendered its first frame.
    if (frames.current < 2){
      ++frames.current;
      startupMark(frames.current===1?"First frame callback":"Second frame callback");
      if(frames.current===2)onReady();
    }
  });
  return null;
}

function StartupPending(){
  useEffect(()=>{startupMark("Critical Suspense","WAITING","existing Physics/world boundary is suspended");},[]);
  return null;
}

function ContextGuard({ onUnavailable }: Pick<ExperienceCanvasProps, "onUnavailable">) {
  const canvas = useThree((state) => state.gl.domElement);
  useEffect(() => {
    const handleContextLoss = (event: Event) => { event.preventDefault(); startupMark("Renderer available","ERROR","webglcontextlost event");onUnavailable(); };
    canvas.addEventListener("webglcontextlost", handleContextLoss);
    return () => canvas.removeEventListener("webglcontextlost", handleContextLoss);
  }, [canvas, onUnavailable]);
  return null;
}

export default function ExperienceCanvas({ onReady, onUnavailable, input, runtime, onPointerStatus, mode, spawn, architecturalDebug, silhouette, reviewCamera, review, editorSession, manualOverrides,touchControls=false }: ExperienceCanvasProps) {
  useEffect(()=>{
    startupMark("Canvas component mounted");
    if(!startupDiagnosticsEnabled)return;
    const manager=DefaultLoadingManager,previous={start:manager.onStart,progress:manager.onProgress,error:manager.onError,load:manager.onLoad};
    const start=(url:string,loaded:number,total:number)=>{startupResource(url,"WAITING");startupInfo("Loader progress",`${loaded}/${total} - ${url}`);previous.start?.call(manager,url,loaded,total);};
    const progress=(url:string,loaded:number,total:number)=>{startupResource(url,"OK");startupInfo("Loader progress",`${loaded}/${total} - ${url}`);previous.progress?.call(manager,url,loaded,total);};
    const error=(url:string)=>{startupResource(url,"ERROR");startupError(url,"Three loader resource");previous.error?.call(manager,url);};
    const load=()=>{startupInfo("Loader batch","all observed items ended (see resource errors separately)");previous.load?.call(manager);};
    manager.onStart=start;manager.onProgress=progress;manager.onError=error;manager.onLoad=load;
    return()=>{if(manager.onStart===start)manager.onStart=previous.start;if(manager.onProgress===progress)manager.onProgress=previous.progress;if(manager.onError===error)manager.onError=previous.error;if(manager.onLoad===load)manager.onLoad=previous.load;};
  },[]);
  const camera = playerConfig.camera;
  const [started,setStarted]=useState(false);
  const initialReady=()=>{setStarted(true);onReady();};
  return (
    <Canvas
      style={touchControls?{touchAction:"none"}:undefined}
      onCreated={({gl,camera,scene})=>{startupMark("Canvas onCreated");startupMark("Renderer available","OK",gl.constructor.name);startupMark("Camera available","OK",camera.type);startupInfo("R3F scene",scene.type);startupInfo("Drawing buffer",`${gl.domElement.width} x ${gl.domElement.height}`);}}
      data-experience-canvas
      shadows={{ type: PCFShadowMap }}
      dpr={renderingConfig.dpr}
      camera={{ fov: reviewCamera ? 55 : camera.fov, near: camera.near, far: camera.far }}
      gl={{ toneMapping: ACESFilmicToneMapping, toneMappingExposure: renderingConfig.exposure, outputColorSpace: SRGBColorSpace }}
      fallback={<p>This experience requires a browser with WebGL support.</p>}
      aria-label="Third-person spatial experience. Click to control camera; WASD move, Shift run, Space jump, Escape releases mouse."
    >
      <ContextGuard onUnavailable={onUnavailable} />
      <Suspense fallback={startupDiagnosticsEnabled?<StartupPending/>:null}>
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
