import type {BellAction,BellPrompt} from "../bells/bell-session";
import type { ArcadeSeat } from "./arcade-sitting.ts";
import type { MovementState } from "./movement";

export interface PlayerRuntime {
  bellAction:BellAction|null;bellPrompt:BellPrompt|null;bellRigReady:boolean;
  velocity: { x: number; y: number; z: number };
  desiredTranslation: { x: number; y: number; z: number };
  nextPosition: { x: number; y: number; z: number };
  grounded: boolean;
  flying: boolean;
  seat: ArcadeSeat | null;
  sitPrompt: "sit" | "stand" | null;
  horizontalSpeed: number;
  movement: MovementState;
  facingYaw: number;
  cameraDistance: number;
  resetSequence: number;
}

export function createPlayerRuntime(): PlayerRuntime {
  return {
    bellAction:null,bellPrompt:null,bellRigReady:false,
    velocity: { x: 0, y: 0, z: 0 },
    desiredTranslation: { x: 0, y: 0, z: 0 },
    nextPosition: { x: 0, y: 0, z: 0 },
    grounded: false,
    seat: null, sitPrompt: null, flying: false, horizontalSpeed: 0, movement: "FALL", facingYaw: 0,
    cameraDistance: 0, resetSequence: 0,
  };
}
