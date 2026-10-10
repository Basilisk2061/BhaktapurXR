# BhaktapurXR

Phase 4B source-derived spatial prototype. Home Explore and `/explore` open Bhaktapur with 17 APPROXIMATE UNESCO-map traces. `/explore?world=engineering` retains the controller course. Heights and identities remain unresolved; human visual approval is required before detailed architecture.

## Development

Use Node.js 22 LTS or newer. Run `npm ci`, then `npm run dev`.

Checks: `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`. Tests use Node's built-in runner and type stripping (Node 22.6+). Serve the production build with `npm start`.

Copy `.env.example` to `.env.local` to enable optional development FPS, physics, metre grid, spawn, or player diagnostics. Restart the dev server after changing flags. All diagnostics are gated off in production. Player telemetry updates DOM text at 5 Hz, without React transform updates.

## Conventions

- Three.js +Y is up; one world unit is one metre.
- App routes and website content live in `src/app`; the client-only Canvas lives in `src/game`, with engineering fixtures in `src/game/world`.
- `src/game/world/world-config.ts` centralizes units, ground, gravity, and the retained world inspection camera configuration. Gameplay now uses the camera in `src/game/player/player-config.ts`; OrbitControls are removed. `spawn-config.ts` defines the default ground-level foot position `[0, 0.05, 7]` with zero rotation (forward is local -Z).
- The synthetic course includes a 0.15 m step, five 0.18 m stairs with 0.3 m treads, a 1 m rise / 4 m run ramp, a 1 m Ã— 2.1 m doorway, walls, obstacles, and an open upper floor at 2.7 m. The upper floor is a collision/camera fixture for the existing player controller.
- `src/lib` holds small configurations; `src/types` holds shared types. LOW/MEDIUM/HIGH remain a type foundation; `renderingConfig` is a single neutral baseline with capped DPR and a 1024 px shadow map.
- `World` separates environment lighting, ground, static test fixtures, and development spawn/grid markers. Visible boxes and explicit cuboid colliders share the same fixture data.
- Loading UI stays outside Canvas through code/physics/asset initialization. Asset request counts come from Drei; they are not byte progress. Catastrophic errors and context loss show a reload/home fallback and preserve error logging.
- Future `<ModelAsset category="architecture" filename="building.glb" />` instances use cached `useGLTF` with cloned scene graphs. `preloadModel` shares the loader/path policy. Put them beneath the existing Suspense/error boundary, and provide colliders separately. No sample models, compression decoders, animations, or asset transforms are invented.
- Zustand is installed; create a store when application state is needed. Future player, interaction, NPC, and data modules should be added when their phases begin.
- `public/assets` reserves model, animation, texture, and audio locations. No real assets are included.
- Future real-world assets must distinguish VERIFIED, APPROXIMATE, and PLACEHOLDER evidence status.

## Player and manual checks

Click the scene, use WASD to move relative to camera yaw, hold Shift to run, press Space to jump, move the mouse to look, and press Escape to release. Click again to resume. If capture is unavailable, focus the scene and drag to look. Inputs clear on blur, release, hidden tabs, or form focus; browser shortcuts are preserved.

The 1.75 m kinematic capsule uses Rapier's character controller at the world's fixed 60 Hz timestep, 2.3 / 5 m/s walk/run targets, 0.25 m autosteps, a 45Â° climb limit, and gravity from world config. A 1.5 cm collision skin is intentional. The proxy/model attachment, movement helpers, physics, input, and sphere-sweep follow camera are separate modules. Space jumps to a configured 1 m height; grounded rising-edge presses only, without air jumps or held-key repeats.

**Human manual testing is required.** Check cardinal/diagonal movement and stopping; Shift running; stationary camera orbit and pitch limits; the low step/stairs on the left, ramp/platform on the right, doorway ahead, and walls/obstacles; stepping off the accessible landings; camera retraction/recovery near walls; Escape/re-entry, form focus, and tab switching. Run backward off the ground to test automatic reset below Y = -8 m. Use player/physics debug flags to inspect position, grounding, speed, and camera distance. Headless tests do not validate subjective feel.

Final human assets, animation, real heritage assets, NPCs, heritage data, and backend/AI systems remain outside this phase.

## Tooling limitation

TypeScript 6 and ESLint 9 are pinned for compatibility with the current Next.js lint plugins. npm audit reports five high-severity findings in the development-only lint dependency chain (`braces` via `micromatch`/`fast-glob`); the latest published `braces` version is still affected. Revisit when upstream tooling releases compatible fixes.

Development may log upstream Three.js Clock and Rapier initialization deprecation warnings. They do not prevent rendering or physics initialization; no warnings are suppressed.

See [world data conventions](docs/world-data.md) for sources, calibration, accuracy, origins, measurement entry, and world modes. Run `npm run spatial:check` to validate/report the spatial pipeline. Source-pixel traces and development-only `/reconstruction` comparison are included. No detailed architecture is included. Supplied originals remain under `reference/bhaktapur/unesco/`; production exploration does not load them.
