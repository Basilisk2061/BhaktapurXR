# World data foundation

No real Bhaktapur data or sources have been added. `/explore` (or
`?world=engineering`) retains the obstacle course. `/explore?world=bhaktapur`
loads neutral ground and the empty registry. Both use the same player and jump.
The Bhaktapur foot-position spawn [0,0.05,4] is PLACEHOLDER / DEVELOPMENT ONLY,
not a real entrance or researched location; the engineering spawn remains [0,0.05,7].

One unit is one metre; +Y is up. Coordinates are local Cartesian values.
The local origin is [0,0,0], with geographic anchor **UNSET**. Rotations are
XYZ Euler radians; scale is positive. Landmark position is the centre of its
footprint at ground level. Dimensions are unscaled width (X), height (Y), depth
(Z). GLBs must follow that pivot and unit convention. Bounds collisions are
explicit cuboids transformed with the landmark; `none` creates no collision.
Visual models never implicitly determine collision. Interaction fields are
metadata only; no interaction system is implemented.

## Evidence

- VERIFIED: researched claims checked against cited evidence. A label is a
  human review assertion, not something the validator can establish.
- APPROXIMATE: evidence-informed estimates; uncertainty and estimated fields
  must be stated in source notes. Never use this label for unsourced guesses.
- PLACEHOLDER: synthetic engineering data with no heritage accuracy claim.

Sources have a stable ID, title, type, document reference or URL, and explicit
supported claims. Add access date and notes where useful. Claims should name
the landmark and fields supported: a photograph does not automatically verify
dimensions or geographic position. Do not fabricate references. A global
accuracy label does not extend evidence to fields absent from supported claims.
The runtime validator checks structure and reference availability, not truth.

## Add a researched landmark later

1. Establish a researched geographic origin and documented local coordinate
   conversion before positioning real landmarks.
2. Record actual references in `src/data/world/registry.ts`, including the
   fields supported and uncertainty. Review accuracy against those claims.
3. Add a `Landmark` entry with unique ID, names/category, transform, dimensions,
   classification, source IDs, collision choice and interaction metadata.
4. Optionally provide a local `/assets/models/architecture/name.glb` (or another
   supported category). Models reuse the cached Phase 1 loader. Pending or
   unavailable assets show plain volume placeholders, with explicit collision
   retained. Placeholder rendering does not increase the accuracy of the data.
5. Run checks and inspect the result and evidence before promoting its accuracy.

The registry starts empty because invented monument locations, proportions,
or history would create misleading heritage claims. No GIS, real models,
asset downloading, streaming, LOD, or reconstruction is included in this phase.

## Development inspection and manual jump check

Default-off `NEXT_PUBLIC_DEBUG_WORLD_DATA=true` shows IDs, classification,
transforms, bounds, origin status and source availability. Existing player
diagnostics show live coordinates. `NEXT_PUBLIC_WORLD_REFERENCE=true` adds
`dev-reference-volume-01` only in development, labelled PLACEHOLDER and
DEVELOPMENT ONLY. Both flags are forced off in production. Existing grid/axes
can mark the local origin. No permanent floating labels appear in production.

Jump height is 1 m, with takeoff speed derived from gravity; physics uses fixed
60 Hz stepping. Space is consumed once per press only while grounded. Invalid
airborne presses are discarded; holding Space cannot jump again after landing.
Blur, capture loss and respawn clear queued presses. Air steering remains active.

Human test required: jump from ground; hold Space through landing; attempt an
air double jump; steer with WASD and mouse in air; judge height and landing feel;
repeat on stairs/ramp; move and jump in both world modes; test blur and respawn.
Further reconstruction awaits manual jump acceptance and real source research.
