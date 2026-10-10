"use client";

import dynamic from "next/dynamic";

const ExperienceCanvas = dynamic(() => import("@/game/experience-canvas"), {
  ssr: false,
  loading: () => <div className="flex h-full items-center justify-center text-sm text-stone-600" role="status">Loading engineering scene…</div>,
});

export function Experience() { return <ExperienceCanvas />; }
