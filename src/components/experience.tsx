"use client";

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import { ExperienceLoading } from "./experience-loading";
import { ExperienceErrorBoundary, ExperienceFailure } from "./experience-error-boundary";

const ExperienceCanvas = dynamic(() => import("@/game/experience-canvas"), {
  ssr: false,
  loading: () => null,
});

function ExperienceContent() {
  const [ready, setReady] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const onReady = useCallback(() => setReady(true), []);
  const onUnavailable = useCallback(() => setUnavailable(true), []);

  if (unavailable) return <ExperienceFailure />;

  return (
    <>
      <ExperienceCanvas onReady={onReady} onUnavailable={onUnavailable} />
      <ExperienceLoading ready={ready} />
    </>
  );
}

export function Experience() {
  return <ExperienceErrorBoundary><ExperienceContent /></ExperienceErrorBoundary>;
}
