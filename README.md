# BhaktapurXR

Phase 0 foundation. The `/explore` scene contains **PLACEHOLDER engineering fixtures**, not a reconstruction of Bhaktapur Durbar Square.

## Development

Use Node.js 22 LTS or newer. Run `npm ci`, then `npm run dev`.

Checks: `npm run lint`, `npm run typecheck`, `npm run build`. Serve the production build with `npm start`.

Copy `.env.example` to `.env.local` to enable optional development FPS, physics, or world diagnostics. All diagnostics are gated off in production.

## Conventions

- Three.js +Y is up; one world unit is one metre.
- App routes and website content live in `src/app`; the client-only Canvas lives in `src/game`, with engineering fixtures in `src/game/world`.
- `src/lib` holds small configurations; `src/types` holds shared types. Quality presets are a type foundation only.
- Zustand is installed; create a store when application state is needed. Future player, interaction, NPC, and data modules should be added when their phases begin.
- `public/assets` reserves model, animation, texture, and audio locations. No real assets are included.
- Future real-world assets must distinguish VERIFIED, APPROXIMATE, and PLACEHOLDER evidence status.

Third-person controls, real heritage assets, NPCs, heritage data, and backend/AI systems are outside this phase.

## Tooling limitation

TypeScript 6 and ESLint 9 are pinned for compatibility with the current Next.js lint plugins. npm audit reports five high-severity findings in the development-only lint dependency chain (`braces` via `micromatch`/`fast-glob`); the latest published `braces` version is still affected. Revisit when upstream tooling releases compatible fixes.
