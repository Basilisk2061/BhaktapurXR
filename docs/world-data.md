# Bhaktapur source-derived spatial foundation

Home Explore and plain `/explore` open Bhaktapur. Explicit `/explore?world=engineering` retains the controller course. Engineering selectors and reconstruction tools appear only in development.

## Local reference and evidence

The supplied originals remain unchanged under `reference/bhaktapur/unesco/`:

- `NP-121bis-bhaktapur.pdf`: authoritative one-page UNESCO original; SHA-256 `615b700df3706fd7e887f98d6b95e436e4a0667e6cddc7fdd1af38c3221b5666`.
- `bhaktapur_map-1.png`: supplied 3300 × 2550 full-page raster; SHA-256 `03ba3aa18d0ec92887b23edfd716559ce11e5e9ec0916eafcd2e2727981761f5`.

Both were inspected. The PDF embeds a lower-resolution image (901 × 1273, rotated on the page); the larger raster adds no survey precision. Drawing bounds are approximately [590,640]–[2860,1830]. Full-image coordinates use X right, Y down. The map shows the 2006 proposed core/buffer redefinition, not current legal boundaries. Its legend distinguishes solid core, dotted buffer, dark monuments and lighter buildings. DURBAR SQUARE is readable; no monument names are assigned from shapes.

All traces reuse `unesco-bhaktapur-monument-zone-2006`. Previously recorded component coordinates and 3.61 ha / 10.71 ha areas remain VERIFIED published metadata only, without establishing geographic tie or validating traced area. No additional sources were obtained in Phase 4B.

## Calibration and reproducible tracing

The printed bar reads 0, 50, 100 and 200 m. Full span: [2122,1651] to [2600,1651], 478 pixels. Scale = 200 / 478 = 0.418410042 metres/pixel, independent of DPI. The 100 m tick at X2363 measures 241 pixels versus expected 239: roughly 1% discrepancy. Soft edges and manual endpoint placement limit precision.

Printed N stem: [2362,1537] to [2362,1504], page-up, zero-degree rotation. +Y up, +X east, -Z north. Engineering origin [1030,1330] lies in the principal square unshaded label area and maps to world [0,0,0]. Geographic tie remains UNRESOLVED.

`map-measurements.ts` records calibration; `unesco-traces.ts` retains original pixel rings. `map-calibration.ts` converts once: north unit vector n, east [-n.y,n.x], displacement d, scale m; X=dot(d,east)*m and Z=-dot(d,n)*m. Its inverse projects runtime coordinates into source comparison. Numeric precision is not measurement precision.

17 APPROXIMATE features: one main/southern core sector, one simplified outer buffer, one conservative open-square polygon, nine monument footprints/symbols and five ordinary-building footprints. **The separated eastern core remains untraced; the core polygon is incomplete.** Small buffer frontage notches are omitted; deviations may exceed 5 m. Open space is an interpretation, not surveyed paving/navigation. Dark symbols inside plinths do not establish full structural extent.

Visible white voids remain polygon holes, with functions unresolved. Validation rejects invalid rings/holes, missing calibration/source linkage and duplicate IDs. Each feature records method, uncertainty and APPROXIMATE accuracy. Edit source pixels rather than runtime coordinates; run `npm run spatial:check` and compare visually before accepting changes.

## Rendering and development review

Phase 5 now renders approximate 3D architecture from these unchanged footprints; see [architecture conventions](architecture.md). Factual heritage heights remain UNKNOWN. The original Phase 4B diagnostic renderer remains available: flat neutral footprints use shared materials. `spatial-visual-config.ts` centralizes zero extrusion and small drawing offsets to avoid z-fighting. Offsets are development representation, not factual elevations. The Phase 4B footprint-only renderer uses ground-only collision; Phase 5 architecture adds separate simple compounds for volumes and stairs. Administrative boundaries never collide. Phase 5 roofs/facades are explicitly approximate procedural interpretations; no unverified named identities are assigned.

The 1800 m square ground is PLACEHOLDER support for the long mapped corridor, not the real square. Phase 5 spawn [30,0.05,35] is development-only, not an official entrance. Engineering retains 32 m ground and [0,0.05,7] spawn. Existing 1.75 m player, movement, jump, camera and respawn remain unchanged.

Development `/reconstruction` projects runtime rings over the original raster with opacity, outline and detail controls. `/api/dev/reference-map` serves only the fixed PNG in development. Both return 404 in production. Originals stay outside `public/` and are absent from production route file tracing; normal exploration never requests the raster.

Default-off `NEXT_PUBLIC_DEBUG_SPATIAL` draws category outlines, origin/north and calibration markers. `NEXT_PUBLIC_DEBUG_WORLD_DATA` shows sources, pixels, local metres, accuracy and uncertainty. Existing player/grid/physics flags and synthetic reference remain development-only; all diagnostics are disabled in production.

## Human review and unresolved work

MANUAL TEST REQUIRED: YES. Open Home, click Explore, walk/run/jump, judge player scale and arrangement, compare `/reconstruction` against the map, confirm no invented architecture, then check engineering. Automated checks do not establish visual/historical approval.

Exact heights, elevations, facade/roof geometry, ornament, monument identities, geographic tie, ambiguous plinth extents, additional footprints and the separated eastern core remain unresolved. Phase 4B was manually approved. Phase 5 requires separate human visual approval before further reconstruction.
