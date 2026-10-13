"use client";

import type {TransformOverrides} from "../features/world-editor/transforms";
import dynamic from "next/dynamic";
import { useCallback, useRef, useState } from "react";
import { ExperienceLoading } from "./experience-loading";
import { ExperienceErrorBoundary, ExperienceFailure } from "./experience-error-boundary";
import { createPlayerInput, type PointerStatus } from "@/game/input/player-input";
import { createPlayerRuntime } from "@/game/player/player-runtime";
import { playerConfig } from "@/game/player/player-config";
import { type WorldMode } from "@/game/world/world-mode";
import {khaumaAxisExperienceSpawn,isSpatialAerialReview} from "@/game/world/khauma-axis-review";
import { WorldDataDiagnostics } from "./world-data-diagnostics";
import { developmentConfig } from "@/lib/development-config";
import { FlyModeIndicator, PlayerDiagnostics } from "./player-diagnostics";

const ExperienceCanvas = dynamic(() => import("@/game/experience-canvas"), {
  ssr: false,
  loading: () => null,
});

function createExperienceInput(mode:WorldMode,review:string|null) {
  const input=createPlayerInput(khaumaAxisExperienceSpawn(mode,review).rotation[1],review ? -.04 : playerConfig.camera.initialPitch);
  if(process.env.NODE_ENV==="development"&&isSpatialAerialReview(review)) {input.flying=true;input.pitch=.62;}
  return input;
}

function ExperienceContent({ mode, review, architecturalDebug, silhouette, manualOverrides }: { mode: WorldMode; review:string|null; architecturalDebug:boolean;silhouette:boolean;manualOverrides?:TransformOverrides }) {
  const [ready, setReady] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [pointerStatus, setPointerStatus] = useState<PointerStatus>("inactive");
  const input = useRef(createExperienceInput(mode,review));
  const runtime = useRef(createPlayerRuntime());
  const onReady = useCallback(() => setReady(true), []);
  const onUnavailable = useCallback(() => setUnavailable(true), []);
  const onPointerStatus = useCallback((status: PointerStatus) => setPointerStatus(status), []);

  if (unavailable) return <ExperienceFailure />;

  return (
    <>
      <ExperienceCanvas manualOverrides={manualOverrides} review={review} mode={mode} spawn={khaumaAxisExperienceSpawn(mode,review)} reviewCamera={review!==null} architecturalDebug={architecturalDebug} silhouette={silhouette} onReady={onReady} onUnavailable={onUnavailable} input={input} runtime={runtime} onPointerStatus={onPointerStatus} />
      <ExperienceLoading ready={ready} />
      {ready && <p className="pointer-events-none absolute bottom-4 left-4 rounded-sm bg-stone-100/90 px-4 py-2 text-xs text-stone-600" aria-live="polite">
        {pointerStatus === "locked" ? "WASD move · Shift run · Space jump · Esc release mouse" : pointerStatus === "fallback" ? "Mouse capture unavailable · Drag to look · WASD move · Shift run · Space jump · Esc release" : "Click to control camera · WASD move · Shift run · Space jump · Esc release mouse"}
      </p>}
      {developmentConfig.worldData && <WorldDataDiagnostics mode={mode} />}
      {process.env.NODE_ENV === "development" && <FlyModeIndicator input={input} />}
      {developmentConfig.playerDebug && <PlayerDiagnostics input={input} runtime={runtime} />}
    </>
  );
}

export function Experience({ mode, review=null, architecturalDebug=false, silhouette=false,manualOverrides }: { mode: WorldMode; review?:string|null; architecturalDebug?:boolean;silhouette?:boolean;manualOverrides?:TransformOverrides }) {
  return <ExperienceErrorBoundary><ExperienceContent key={mode+review} manualOverrides={manualOverrides} mode={mode} review={review} architecturalDebug={architecturalDebug} silhouette={silhouette} /></ExperienceErrorBoundary>;
}
