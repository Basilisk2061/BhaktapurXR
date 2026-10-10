"use client";

import { useEffect, useRef, type RefObject } from "react";
import type { PlayerInput } from "@/game/input/player-input";
import { playerConfig } from "@/game/player/player-config";
import type { PlayerRuntime } from "@/game/player/player-runtime";

export function PlayerDiagnostics({ input, runtime }: { input: RefObject<PlayerInput>; runtime: RefObject<PlayerRuntime> }) {
  const output = useRef<HTMLPreElement>(null);
  useEffect(() => {
    const timer = window.setInterval(() => {
      if (!output.current) return;
      const motion = runtime.current, controls = input.current, p = motion.nextPosition;
      output.current.textContent = `Player proxy · ${motion.movement}\nPosition (centre): ${p.x.toFixed(2)}, ${p.y.toFixed(2)}, ${p.z.toFixed(2)} m\nSpeed: ${motion.horizontalSpeed.toFixed(2)} m/s · Grounded: ${motion.grounded}\nFacing: ${(motion.facingYaw * 180 / Math.PI).toFixed(0)}° · Camera: ${motion.cameraDistance.toFixed(2)} m\nPointer: ${controls.locked ? "locked" : controls.active ? "focused" : "released"} · Resets: ${motion.resetSequence}`;
    }, playerConfig.diagnosticsInterval);
    return () => window.clearInterval(timer);
  }, [input, runtime]);
  return <pre ref={output} className="pointer-events-none absolute right-3 top-3 z-10 rounded-sm bg-stone-100/90 p-3 text-[11px] leading-relaxed text-stone-700" aria-label="Development player diagnostics" />;
}
