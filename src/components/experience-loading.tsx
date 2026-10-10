"use client";

import { useProgress } from "@react-three/drei";

export function ExperienceLoading({ ready = false }: { ready?: boolean }) {
  const active = useProgress((state) => state.active);
  const loaded = useProgress((state) => state.loaded);
  const total = useProgress((state) => state.total);

  if (ready && !active) return null;

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#f5f2eb]" role="status" aria-live="polite" data-experience-loading>
      <div className="px-6 text-center">
        <p className="font-semibold tracking-tight">BhaktapurXR</p>
        <p className="mt-3 text-sm text-stone-600">Preparing 3D experience…</p>
        {active && total > 0 && <p className="mt-2 text-xs text-stone-500">{loaded} of {total} asset requests loaded</p>}
      </div>
    </div>
  );
}
