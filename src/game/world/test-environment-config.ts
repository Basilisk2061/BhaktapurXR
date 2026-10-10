import type { TestBox } from "@/types/world";

export const scaleTestDimensions = {
  lowStep: { height: 0.15, width: 2, depth: 1 },
  stairs: { count: 5, rise: 0.18, tread: 0.3, width: 2 },
  doorway: { width: 1, height: 2.1, wallHeight: 3, wallWidth: 5, thickness: 0.25 },
  ramp: { run: 4, rise: 1, width: 2, thickness: 0.15 },
  structure: { floorHeight: 2.7, floorThickness: 0.2, width: 4, depth: 3 },
} as const;

const { lowStep, stairs, doorway, ramp, structure } = scaleTestDimensions;
const sideWidth = (doorway.wallWidth - doorway.width) / 2;
const rampAngle = Math.atan2(ramp.rise, ramp.run);

// Every box uses the same dimensions and transform for rendering and collision.
// This course is deliberately synthetic; none of its coordinates describe Bhaktapur.
export const testEnvironmentBoxes: TestBox[] = [
  { id: "low-step", position: [-5, lowStep.height / 2, 5], size: [lowStep.width, lowStep.height, lowStep.depth] },
  ...Array.from({ length: stairs.count }, (_, index): TestBox => {
    const height = (index + 1) * stairs.rise;
    return {
      id: `stair-${index + 1}`,
      position: [-5, height / 2, 1.5 - (index + 0.5) * stairs.tread],
      size: [stairs.width, height, stairs.tread],
    };
  }),
  { id: "stair-landing", position: [-5, stairs.count * stairs.rise / 2, -1], size: [2, stairs.count * stairs.rise, 2] },
  {
    id: "ramp",
    position: [3, ramp.rise / 2 - ramp.thickness * Math.cos(rampAngle) / 2, 3 - ramp.thickness * Math.sin(rampAngle) / 2],
    size: [ramp.width, ramp.thickness, Math.hypot(ramp.run, ramp.rise)],
    rotation: [rampAngle, 0, 0],
  },
  { id: "ramp-platform", position: [3, ramp.rise / 2, 0], size: [2, ramp.rise, 2] },
  { id: "wall", position: [-9, 1.5, -3], size: [0.25, 3, 5] },
  { id: "door-left", position: [-sideWidth / 2 - doorway.width / 2, doorway.wallHeight / 2, -6], size: [sideWidth, doorway.wallHeight, doorway.thickness] },
  { id: "door-right", position: [sideWidth / 2 + doorway.width / 2, doorway.wallHeight / 2, -6], size: [sideWidth, doorway.wallHeight, doorway.thickness] },
  { id: "door-header", position: [0, (doorway.height + doorway.wallHeight) / 2, -6], size: [doorway.width, doorway.wallHeight - doorway.height, doorway.thickness] },
  ...[0.3, 0.6, 1.2].map((height, index): TestBox => ({
    id: `obstacle-${height}`,
    position: [7, height / 2, 5 - index * 2],
    size: [1, height, 1],
  })),
  { id: "upper-floor", position: [6, structure.floorHeight + structure.floorThickness / 2, -6], size: [structure.width, structure.floorThickness, structure.depth] },
  ...[4.2, 7.8].flatMap((x) => [-7.3, -4.7].map((z): TestBox => ({
    id: `support-${x}-${z}`,
    position: [x, structure.floorHeight / 2, z],
    size: [0.3, structure.floorHeight, 0.3],
  }))),
];
