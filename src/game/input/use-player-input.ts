import {readMouseSensitivity,subscribeSensitivity} from "./mouse-sensitivity";
import { useEffect, type RefObject } from "react";
import { useThree } from "@react-three/fiber";
import { playerConfig } from "@/game/player/player-config";
import { gameplayCodes, isEditableTarget, pressGameplayKey, type PlayerInput, type PointerStatus } from "./player-input";

export function usePlayerInput(inputRef: RefObject<PlayerInput>, onStatus: (status: PointerStatus) => void): void {
  const canvas = useThree((state) => state.gl.domElement);

  useEffect(() => {
    const input = inputRef.current;
    let sensitivity=readMouseSensitivity();
    const unsubscribeSensitivity=subscribeSensitivity(()=>{sensitivity=readMouseSensitivity();});
    let disposed = false, lockFailed = false, dragging = false, requesting = false;
    const previousTabIndex = canvas.tabIndex;
    canvas.setAttribute("tabindex", "0");
    const clear = () => { input.keys.clear(); input.interactRequested = false; input.jumpRequested = false; input.lastSpacePress = null; input.active = false; if(input.touchMovement){input.touchMovement.forward=0;input.touchMovement.right=0;input.touchMovement.running=false;} dragging = false; };
    const resetFocus = () => {
      clear(); onStatus("inactive");
      if (document.pointerLockElement === canvas) document.exitPointerLock();
    };
    const failLock = () => {
      if (disposed || document.pointerLockElement === canvas) return;
      requesting = false;
      lockFailed = true;
      input.locked = false;
      input.active = document.activeElement === canvas && !document.hidden;
      onStatus(input.active ? "fallback" : "inactive");
    };
    const pointerDown = (event: PointerEvent) => {
      if (event.pointerType === "touch" || input.inputBlocked || input.inventoryOpen || event.button !== 0) return;
      canvas.focus({ preventScroll: true });
      input.active = true;
      dragging = true;
      if (input.locked || requesting) return;
      if (lockFailed || typeof canvas.requestPointerLock !== "function") {
        failLock();
        canvas.setPointerCapture(event.pointerId);
        return;
      }
      requesting = true;
      try { Promise.resolve(canvas.requestPointerLock()).catch(failLock); }
      catch { failLock(); }
    };
    const pointerUp = () => { dragging = false; };
    const lockChanged = () => {
      requesting = false;
      input.locked = document.pointerLockElement === canvas;
      input.active = input.locked;
      if (!input.locked) clear();
      onStatus(input.locked ? "locked" : "inactive");
    };
    const mouseMoved = (event: MouseEvent) => {
      if (input.touchMode || input.inputBlocked || input.inventoryOpen || !input.active || (!input.locked && (!dragging || document.activeElement !== canvas))) return;
      const { maxMouseDelta, minPitch, maxPitch } = playerConfig.camera;
      const x = Math.max(-maxMouseDelta, Math.min(maxMouseDelta, event.movementX));
      const y = Math.max(-maxMouseDelta, Math.min(maxMouseDelta, event.movementY));
      input.yaw = Math.atan2(Math.sin(input.yaw - x * sensitivity), Math.cos(input.yaw - x * sensitivity));
      input.pitch = Math.max(minPitch, Math.min(maxPitch, input.pitch + y * sensitivity));
    };
    const keyDown = (event: KeyboardEvent) => {
      if(input.inputBlocked||input.inventoryOpen)return;
      if (event.code === "Escape") {
        resetFocus();
        return;
      }
      if ((event.ctrlKey && !input.flying) || event.metaKey || event.altKey) { input.keys.clear(); input.interactRequested = false; input.jumpRequested = false; input.lastSpacePress = null; return; }
      if (!input.active || isEditableTarget(event.target) || (!input.locked && document.activeElement !== canvas)) return;
      if (gameplayCodes.has(event.code)) { event.preventDefault(); pressGameplayKey(input, event.code, event.repeat); }
    };
    const keyUp = (event: KeyboardEvent) => { input.keys.delete(event.code); };
    const visibilityChanged = () => { if (document.hidden) resetFocus(); };
    const focusChanged = (event: FocusEvent) => {
      if (!input.touchMode && event.target !== canvas) {
        resetFocus();
      }
    };

    canvas.addEventListener("pointerdown", pointerDown);
    document.addEventListener("pointerup", pointerUp);
    document.addEventListener("pointerlockchange", lockChanged);
    document.addEventListener("pointerlockerror", failLock);
    document.addEventListener("mousemove", mouseMoved);
    document.addEventListener("keydown", keyDown);
    document.addEventListener("keyup", keyUp);
    document.addEventListener("visibilitychange", visibilityChanged);
    document.addEventListener("focusin", focusChanged);
    window.addEventListener("blur", resetFocus);
    return () => {
      unsubscribeSensitivity();
      disposed = true;
      clear(); input.locked = false;
      canvas.setAttribute("tabindex", String(previousTabIndex));
      canvas.removeEventListener("pointerdown", pointerDown);
      document.removeEventListener("pointerup", pointerUp);
      document.removeEventListener("pointerlockchange", lockChanged);
      document.removeEventListener("pointerlockerror", failLock);
      document.removeEventListener("mousemove", mouseMoved);
      document.removeEventListener("keydown", keyDown);
      document.removeEventListener("keyup", keyUp);
      document.removeEventListener("visibilitychange", visibilityChanged);
      document.removeEventListener("focusin", focusChanged);
      window.removeEventListener("blur", resetFocus);
      if (document.pointerLockElement === canvas) document.exitPointerLock();
    };
  }, [canvas, inputRef, onStatus]);
}
