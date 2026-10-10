// Drawing offsets are development choices, NOT architectural heights.
export const spatialVisualConfig = {
  footprintElevation: 0.025, openSpaceElevation: 0.012, extrusionHeight: 0,
  collision: "ground-only",
  colors: { monument: "#85877f", building: "#a7aa9e", openSpace: "#c6c7b7" },
} as const;
