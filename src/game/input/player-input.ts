export type PointerStatus = "inactive" | "locked" | "fallback";

export interface PlayerInput {
  keys: Set<string>;
  touchMode?: boolean;
  inputBlocked?: boolean;
  touchMovement?: {forward:number;right:number;running:boolean};
  jumpRequested: boolean;
  interactRequested: boolean;
  sitting: boolean;
  flying: boolean;
  lastSpacePress: number | null;
  active: boolean;
  locked: boolean;
  yaw: number;
  pitch: number;
}

export function createPlayerInput(yaw: number, pitch: number): PlayerInput {
  return { keys: new Set(), jumpRequested: false, interactRequested: false, sitting: false, flying: false, lastSpacePress: null, active: false, locked: false, yaw, pitch };
}

export const gameplayCodes = new Set(["KeyE", "KeyW", "KeyA", "KeyS", "KeyD", "ShiftLeft", "ShiftRight", "Space", "ControlLeft", "ControlRight"]);

export function isEditableTarget(target: EventTarget | null): boolean {
  return target instanceof Element && !!target.closest("input, textarea, select, button, a, [contenteditable]:not([contenteditable='false']), [role='textbox']");
}

/** Rising edge only; repeated keyboard events and held Space cannot queue jumps. */
export function pressGameplayKey(input: PlayerInput, code: string, repeat = false, now = performance.now()): void {
  if (code === "KeyE" && !repeat && !input.keys.has(code)) input.interactRequested = true;
  if (code === "Space" && input.sitting) { input.jumpRequested = false; input.lastSpacePress = null; input.keys.add(code); return; }
  if (code === "Space" && !repeat && !input.keys.has(code)) {
    if (input.lastSpacePress !== null && now - input.lastSpacePress >= 0 && now - input.lastSpacePress <= 350) {
      input.flying = !input.flying;
      input.lastSpacePress = null;
      input.jumpRequested = false;
    } else {
      input.lastSpacePress = now;
      input.jumpRequested = !input.flying;
    }
  }
  input.keys.add(code);
}
export function consumeJump(input: PlayerInput, grounded: boolean): boolean {
  const allowed = input.active && input.jumpRequested && grounded;
  input.jumpRequested = false;
  return allowed;
}
