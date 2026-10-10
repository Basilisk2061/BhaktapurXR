export type PointerStatus = "inactive" | "locked" | "fallback";

export interface PlayerInput {
  keys: Set<string>;
  jumpRequested: boolean;
  active: boolean;
  locked: boolean;
  yaw: number;
  pitch: number;
}

export function createPlayerInput(yaw: number, pitch: number): PlayerInput {
  return { keys: new Set(), jumpRequested: false, active: false, locked: false, yaw, pitch };
}

export const gameplayCodes = new Set(["KeyW", "KeyA", "KeyS", "KeyD", "ShiftLeft", "ShiftRight", "Space"]);

export function isEditableTarget(target: EventTarget | null): boolean {
  return target instanceof Element && !!target.closest("input, textarea, select, button, a, [contenteditable]:not([contenteditable='false']), [role='textbox']");
}

/** Rising edge only; repeated keyboard events and held Space cannot queue jumps. */
export function pressGameplayKey(input: PlayerInput, code: string, repeat = false): void {
  if (code === "Space" && !repeat && !input.keys.has(code)) input.jumpRequested = true;
  input.keys.add(code);
}
export function consumeJump(input: PlayerInput, grounded: boolean): boolean {
  const allowed = input.active && input.jumpRequested && grounded;
  input.jumpRequested = false;
  return allowed;
}
