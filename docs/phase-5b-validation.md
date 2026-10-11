# Phase 5B validation — 11 October 2026

Implementation/engineering validation COMPLETE. Human visual/historical approval is pending (MANUAL TEST REQUIRED: YES). No Phase 6 work or push.

## Checks

- `npm run lint`: PASS, zero warnings/errors.
- `npm run typecheck`: PASS.
- `npm test`: PASS, 46 tests (all 41 earlier tests preserved plus five Phase 5B tests).
- `npm run build`: PASS, Next.js 16.4 production build.
- `git diff --check`: PASS.
- Original UNESCO trace file SHA256: `56e9db5bd3718da5f14d8378f674189d599f038a9933ea941b406e7c974a764b`, unchanged; map/PDF integrity tests pass.

## Runtime

Headless installed Chrome with Playwright and SwiftShader, production served temporarily on 3002, development review on 3003. Existing browser/server state was not repurposed. QA scripts live in OS temporary storage; no test hooks or camera overrides were added to application code. Temporary development copy/server removed after review.

Home Explore routes to Bhaktapur. WASD walk and Shift run moved the player; a single held Space reached an airborne proxy height of approximately 1.67 m and landed at 0.884 m without repeating. Mouse look changed the camera. Engineering spawn remains approximately [0,0.89,7]; jumping works there. Engineering stairs reached Y=1.790, ramp Y=1.822, and wall stopped Z=-5.560. Running toward the Bhaktapur temple stopped at approximately [21.061,1.006,16.418], unchanged after another 3.5 seconds of held input. No browser page errors occurred.

After controls settled, 1.5 seconds idle produced no additional React commits. The existing Three Clock and Rapier initialization deprecation warnings remain upstream warnings; they are not suppressed. Shadow/material rendering was inspected in the screenshots.

Real Rapier family tests additionally traverse Vatsala/Siddhi stairs to platform heights, block their sanctums, traverse the open lower mandap centre, and confirm camera sphere sweeps detect temple bodies/pavilion posts. Stair flights meet the inset top landing; a narrow inscribed support closes conservative collider-grid gaps without changing the source footprint. Roof collision is simplified; exact sculptural/roof-slope contact remains a limitation.

Production `/reconstruction` and `/api/dev/reference-map` both return 404. Ordinary exploration made no research-raster request. Development `/reconstruction` returns 17 original paths; supplementary checkbox reveals exactly two dashed candidate anchors. Opacity control updates to 0.4, outlines toggle, identity audit expands and the raster endpoint returns 200, without page errors.

## Performance

MEDIUM, 1360x850, headless software WebGL. Renderer counters include shadow passes; these are not hardware FPS guarantees.

| View | Draw calls | Triangles | Resident geometries |
|---|---:|---:|---:|
| Central plaza | 25 | 271,510 | 11 |
| Palace-facing | 25 | 271,510 | 11 |
| Principal cluster | 27 | 271,842 | 11 |
| Wide overview | 29 | 272,066 | 11 |

26 architectural entries (14 original-source, two supplements, ten placeholder context); 10,783 box details in shared material instancing; 65 static volumes, 15 radial profile pieces, 156 roof wings/tiers. Seven heritage material resources, three generated 256px textures; renderer reports six resident textures including renderer resources. Static geometry merges by material, with one shared unit box. Geometry/materials dispose on unmount. Increased shadow/detail geometry retains disciplined static batching.

## Visual review evidence

These are generated application screenshots, not historical references:

- [Visitor spawn](phase-5b-review/spawn.png)
- [Central plaza](phase-5b-review/central.png)
- [Palace-facing view](phase-5b-review/palace.png)
- [Principal monument cluster](phase-5b-review/cluster.png)
- [High/wide overview](phase-5b-review/wide.png)
- [Development reconstruction tools](phase-5b-review/reconstruction.png)

The review shows the long palace/frontage window rhythm, attached gold entrance emphasis, open paving, contrasting stone spires/pagoda/pavilion and column. The palace-facing view includes nearby monuments; walk around for unobstructed frontage assessment. This inspection supports completion of the procedural reconstruction pass, not a claim that the user has accepted resemblance or that provisional identifications are verified. The exact recognizability success condition awaits human review.

All candidate monument bindings remain APPROXIMATE / PROVISIONALLY_IDENTIFIED. Unnamed 004/009, Silu's modern upper form, bell/spout positions, precise dimensions, carving and restoration details remain unresolved. Source evidence/rationale and complete Phase 5 audit are in `architecture.md` and `src/data/architecture/monuments.ts`.
