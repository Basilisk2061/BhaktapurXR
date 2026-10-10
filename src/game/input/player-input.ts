export type PointerStatus = "inactive" | "locked" | "fallback";

export interface PlayerInput {
  keys: Set<string>;
  active: boolean;
  locked: boolean;
  yaw: number;
  pitch: number;
}

export function createPlayerInput(yaw: number, pitch: number): PlayerInput {
  return { keys: new Set(), active: false, locked: false, yaw, pitch };
}

export const gameplayCodes = new Set(["KeyW", "KeyA", "KeyS", "KeyD", "ShiftLeft", "ShiftRight"]);

export function isEditableTarget(target: EventTarget | null): boolean {
  return target instanceof Element && !!target.closest("input, textarea, select, button, a, [contenteditable]:not([contenteditable='false']), [role='textbox']");
}
