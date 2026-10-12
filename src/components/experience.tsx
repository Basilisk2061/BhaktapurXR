"use client";

import dynamic from "next/dynamic";
import { useCallback, useRef, useState } from "react";
import { ExperienceLoading } from "./experience-loading";
import { ExperienceErrorBoundary, ExperienceFailure } from "./experience-error-boundary";
import { createPlayerInput, type PointerStatus } from "@/game/input/player-input";
import { createPlayerRuntime } from "@/game/player/player-runtime";
import { playerConfig } from "@/game/player/player-config";
import { type WorldMode } from "@/game/world/world-mode";
import { urbanExperienceSpawn } from "@/game/world/urban-review";
import { WorldDataDiagnostics } from "./world-data-diagnostics";
import { developmentConfig } from "@/lib/development-config";
import { PlayerDiagnostics } from "./player-diagnostics";

const ExperienceCanvas = dynamic(() => import("@/game/experience-canvas"), {
  ssr: false,
  loading: () => null,
});

function ExperienceContent({ mode, review, architecturalDebug, silhouette }: { mode: WorldMode; review:string|null; architecturalDebug:boolean;silhouette:boolean }) {
  const [ready, setReady] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [pointerStatus, setPointerStatus] = useState<PointerStatus>("inactive");
  const input = useRef(createPlayerInput(urbanExperienceSpawn(mode,review).rotation[1], review ? -0.04 : playerConfig.camera.initialPitch));
  const runtime = useRef(createPlayerRuntime());
  const onReady = useCallback(() => setReady(true), []);
  const onUnavailable = useCallback(() => setUnavailable(true), []);
  const onPointerStatus = useCallback((status: PointerStatus) => setPointerStatus(status), []);

  if (unavailable) return <ExperienceFailure />;

  return (
    <>
      <ExperienceCanvas mode={mode} spawn={urbanExperienceSpawn(mode,review)} reviewCamera={review!==null} architecturalDebug={architecturalDebug} silhouette={silhouette} onReady={onReady} onUnavailable={onUnavailable} input={input} runtime={runtime} onPointerStatus={onPointerStatus} />
      <ExperienceLoading ready={ready} />
      {ready && <p className="pointer-events-none absolute bottom-4 left-4 rounded-sm bg-stone-100/90 px-4 py-2 text-xs text-stone-600" aria-live="polite">
        {pointerStatus === "locked" ? "WASD move · Shift run · Space jump · Esc release mouse" : pointerStatus === "fallback" ? "Mouse capture unavailable · Drag to look · WASD move · Shift run · Space jump · Esc release" : "Click to control camera · WASD move · Shift run · Space jump · Esc release mouse"}
      </p>}
      {developmentConfig.worldData && <WorldDataDiagnostics mode={mode} />}
      {developmentConfig.playerDebug && <PlayerDiagnostics input={input} runtime={runtime} />}
    </>
  );
}

export function Experience({ mode, review=null, architecturalDebug=false, silhouette=false }: { mode: WorldMode; review?:string|null; architecturalDebug?:boolean;silhouette?:boolean }) {
  return <ExperienceErrorBoundary><ExperienceContent key={mode+review} mode={mode} review={review} architecturalDebug={architecturalDebug} silhouette={silhouette} /></ExperienceErrorBoundary>;
}
