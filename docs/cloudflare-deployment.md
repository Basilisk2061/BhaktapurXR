# Cloudflare deployment preparation

Prepared 19 October 2026. No application build, tests, typecheck, browser session or deployment was performed.

## Target and reason

Worker name: `bhaktapurxr`. Expected address: `https://bhaktapurxr.<your-workers-subdomain>.workers.dev`; the account subdomain is assigned by Cloudflare. This is not a Pages static export.

The existing Next.js App Router `/explore` page awaits request query parameters and loads saved transforms on the server. Three development-only route handlers include request-dependent GET/POST and local filesystem operations. Static export would require route/client restructuring and cannot simply be enabled without changing behavior. No middleware, production server actions, application database, authentication backend or dynamic path segments were found.

Cloudflare currently recommends vinext for Next.js 16, but documents it as beta and asks existing applications to check compatibility before adoption. Its current package also requires React 19.3.1, while this project uses 19.3.0. Replacing the Next build toolchain without permitted validation would be a broader migration. This preparation instead follows Cloudflare's still-documented manual OpenNext adapter path, retaining `next dev`, `next build`, the routes and React version.

Pinned deployment tools: `@opennextjs/cloudflare` 1.20.12 and Wrangler 4.151.1. The adapter's declared Next peer range requires 16.4.1 or later, so the Next dependency/lockfile receives only the 16.4.0 -> 16.4.1 patch update. No forced peer installation or obsolete adapter was used. Only dependency resolution/lockfile generation was run with install scripts disabled; the local installed Next package was not replaced or tested.

## Review, then connect

Use the committed npm lockfile and Node 22.20.0 (`.node-version`). The owner's pre-existing uncommitted pnpm package-manager/lockfile changes are outside this commit and were preserved; do not mix an old pnpm lockfile with the new deployment dependencies.

After review, install dependencies with `npm ci`. For Cloudflare Workers Builds, use:

- Project root: repository root.
- Worker name: `bhaktapurxr` (already in `wrangler.jsonc`).
- Build command: `npm run build:cloudflare`.
- Deploy command: `npm run deploy:cloudflare`.
- No application environment variables, secrets, R2, KV, D1, image service or other backend resources are required by this configuration.

`build:cloudflare` invokes OpenNext, which runs the existing Next build command, including its `prebuild` world-data preparation. Do not bypass that step: `public/world-data` and the generated seat source are intentionally gitignored. This generates the existing deferred homepage assets; it does not add world streaming. `preview:cloudflare` is available after building, for the owner's manual testing. None of these build/preview/deploy commands was run in this phase.

Wrangler uploads the generated `.open-next/assets` directory, including the copied `public/` assets, separately from the Worker code. No blanket SPA fallback or redirect to `/` is added. Next/OpenNext handles `/`, `/explore`, `/explore?world=bhaktapur` and direct requests to `/explore`. The PLAY link remains `/explore?world=bhaktapur`. Native HTTPS hosting supports the existing fullscreen/presentation flow; no UI or controls changed.

## Saved arrangement and development

Workers does not contain a writable checkout of `src/features/bhaktapur/data`. The sole runtime adaptation makes the existing production override reader return the bundled saved state/legacy JSON, with the same precedence as before. It does not change either JSON file. Development still reads those files live through the existing save workflow. The World Editor, reference APIs and review pages remain development-only, as before; they are not made public or given cloud storage.

`next.config.ts`, its LAN interface discovery and `allowedDevOrigins` are unchanged. Existing rendering, full-world mounting, geometry, player, NPCs, audio, mobile controls, heritage book, settings and homepage are unchanged.

Important: the owner's current saved-state edits remain uncommitted. A local deployment build uses those local edits; a Git-connected Cloudflare build can only use the saved-state JSON in the connected commit. Review and commit the desired arrangement separately before connecting Git if those local changes must be public. They were deliberately not swept into this deployment commit.

## Asset inspection

- The inspected public inventory contains approximately 50.8 MB across 360 files before adding `_headers`.
- All three active character GLBs exist under `/assets/characters/`; their external image URIs are relative `base-color.jpg`, `normal.png` and `metallic-roughness.png`, with matching local texture files. Largest individual asset: female character GLB, 9,145,760 bytes.
- Ambience, footsteps and NPC voice files use same-origin `/assets/audio/...` paths.
- Fourteen heritage photographs use same-origin `/heritage/...` paths, with their existing attributions/licenses.
- Local WOFF2 fonts, homepage assets and literal public-asset references were inspected; no missing literal public file reference was found. No active Windows path, file URL or hard-coded localhost asset host was found.
- Research URLs and development-only localhost security checks are not production asset origins. Development reference maps remain outside `public/` and are not exposed in production.
- No assets were removed, compressed, renamed or visually modified. `_headers` preserves immutable caching for content-hashed Next assets and existing world-data chunks; it does not mark mutable files immutable.

Build output size, adapter runtime compatibility and the final deployed routes/assets remain unverified because the user prohibited all build/runtime testing. This preparation is not a claim that a deployment has already succeeded.

Official references: [Cloudflare Next.js/vinext guidance](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/), [Cloudflare manual OpenNext configuration](https://developers.cloudflare.com/workers/framework-guides/web-apps/opennext/), [OpenNext setup](https://opennext.js.org/cloudflare/get-started), [Workers build image](https://developers.cloudflare.com/workers/ci-cd/builds/build-image/).
