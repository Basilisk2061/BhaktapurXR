import manifest from '../../../public/assets/characters/player/crouch-import.json' with {type: 'json'};
/** Offline-measured rendered target speed; controller remains authoritative. */
export const crouchWalkPlaybackScale = manifest.CrouchWalk.playbackScale;
export const crouchLocomotionFade = 0.16;
export function crouchLocomotion(speed: number, threshold: number): 'CrouchIdle' | 'CrouchWalk' {
  return speed < threshold ? 'CrouchIdle' : 'CrouchWalk';
}
export function crouchFade(from: string, to: string, stanceDuration: number): number {
  const a = from === 'CrouchIdle' || from === 'CrouchWalk';
  const b = to === 'CrouchIdle' || to === 'CrouchWalk';
  return a && b ? crouchLocomotionFade : a || b ? stanceDuration : 0.18;
}

