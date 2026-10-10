# BhaktapurXR

Phase 1 world framework. The `/explore` scene contains **PLACEHOLDER engineering fixtures**, not a reconstruction of Bhaktapur Durbar Square.

## Development

Use Node.js 22 LTS or newer. Run `npm ci`, then `npm run dev`.

Checks: `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`. Tests use Node's built-in runner and type stripping (Node 22.6+). Serve the production build with `npm start`.

Copy `.env.example` to `.env.local` to enable optional development FPS, physics, metre grid, or spawn diagnostics. Restart the dev server after changing flags. All diagnostics are gated off in production.

## Conventions

- Three.js +Y is up; one world unit is one metre.
- App routes and website content live in `src/app`; the client-only Canvas lives in `src/game`, with engineering fixtures in `src/game/world`.
- `src/game/world/world-config.ts` centralizes units, ground, gravity, and the temporary camera. `spawn-config.ts` defines the default ground-level foot position `[0, 0.05, 7]` with zero rotation (forward is local -Z).
- The synthetic course includes a 0.15 m step, five 0.18 m stairs with 0.3 m treads, a 1 m rise / 4 m run ramp, a 1 m × 2.1 m doorway, walls, obstacles, and an open upper floor at 2.7 m. The upper floor is a collision/camera fixture; no player or access controller exists yet.
- `src/lib` holds small configurations; `src/types` holds shared types. LOW/MEDIUM/HIGH remain a type foundation; `renderingConfig` is a single neutral baseline with capped DPR and a 1024 px shadow map.
- `World` separates environment lighting, ground, static test fixtures, and development spawn/grid markers. Visible boxes and explicit cuboid colliders share the same fixture data.
- Loading UI stays outside Canvas through code/physics/asset initialization. Asset request counts come from Drei; they are not byte progress. Catastrophic errors and context loss show a reload/home fallback and preserve error logging.
- Future `<ModelAsset category="architecture" filename="building.glb" />` instances use cached `useGLTF` with cloned scene graphs. `preloadModel` shares the loader/path policy. Put them beneath the existing Suspense/error boundary, and provide colliders separately. No sample models, compression decoders, animations, or asset transforms are invented.
- Zustand is installed; create a store when application state is needed. Future player, interaction, NPC, and data modules should be added when their phases begin.
- `public/assets` reserves model, animation, texture, and audio locations. No real assets are included.
- Future real-world assets must distinguish VERIFIED, APPROXIMATE, and PLACEHOLDER evidence status.

Third-person controls, real heritage assets, NPCs, heritage data, and backend/AI systems are outside this phase.

## Tooling limitation

TypeScript 6 and ESLint 9 are pinned for compatibility with the current Next.js lint plugins. npm audit reports five high-severity findings in the development-only lint dependency chain (`braces` via `micromatch`/`fast-glob`); the latest published `braces` version is still affected. Revisit when upstream tooling releases compatible fixes.

Development may log upstream Three.js Clock and Rapier initialization deprecation warnings. They do not prevent rendering or physics initialization; no warnings are suppressed.
