/** Metres in the rendered asset's ground frame (including its 0.938576485 scale).
 * Sampled all 120 CrouchIdle key times on the skinned shoe geometry:
 * right sole 0.165395031..0.178660473; left sole 0.209114005..0.215780569.
 * Use the minimum supporting sole height: retain bobbing without penetrating the floor.
 * Standing Idle mesh minimum is -0.000075560..0.000088857 and remains unchanged.
 */
export const crouchVisualGroundOffset = -0.16539503104916287;

/** Existing controller smoothstep weight supplies the complete transition; no new timer. */
export function crouchVisualY(weight: number, eligible: boolean): number {
  return eligible && Number.isFinite(weight) && weight > 0
    ? crouchVisualGroundOffset * Math.max(0, Math.min(1, weight))
    : 0;
}

