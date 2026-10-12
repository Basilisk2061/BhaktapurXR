# Phase 7C - urban enclosure

Baseline: `216908e0db58cb3169b6ac17ba9d866bd1078bf7`. Frozen baseline changed: **NO**. Phase 6 data, world frame, heritage open-space polygons, all Phase 7 monument geometry/anchors/colliders and existing review presets are unchanged. Original 123 tests are untouched.

## Reused evidence and implementation

- Existing Digital Himalaya 2006 plan (`dh-plan`), Phase 6 calibration/adopted fit and open-space datasets.
- Existing `western-2021`, `central-pair-2021`, `silu-photo-2022` photographs and Phase 7 source ledger/docs for brick/timber/tile vocabulary. No new external research.
- Existing shared procedural materials, instanced box renderer and merged roof geometry. Old Phase 5 fictional context coordinates are not reused.

Eight immediate frontage groups cover palace-west adjacency, western back/south edges, the low frontage opposite the palace, southeast/Siddhi context, eastern frontage and Silu east/north context. Short street flanks and four anonymous backdrop rows supply depth. After clearance filtering, **103 building modules** remain: **37 immediate, 23 street-flank, 43 distant**, across 21 populated groups.

Placement directions are **SOURCE_DERIVED** from the schematic plan; facade vocabulary is **PHOTO_INFERRED**. Module divisions, setbacks, heights, depths, street widths and distant masses are **CONTEXT_APPROXIMATE**. Exact modern building footprints, identities and interiors remain **UNRESOLVED**. No context is VERIFIED; these are ordinary contextual groups, not individual heritage reconstructions.

## Streets and ground

Five approximate clear corridors: west entrance, Old Town north, Tachupal east, Taumadhi south and Potters Square south. Flanking context extends approximately 25 m. Body/eave candidates intersecting these corridors, monument clearance envelopes or gameplay/review spawn clearance are omitted. Building bodies also avoid one another. No invisible street barriers.

Outside the frozen heritage polygons, a merged pale context-paving surface overlays the existing safety ground. Conservative bounding boxes plus a small margin retain all heritage paving unchanged. This render-only surface mask is not a new surveyed plaza boundary; the original ground collider remains continuous. New buildings use one simple cuboid each; no interiors or decorative collision.

## Performance and validation

2,504 additional box instances and 103 low-detail roofs share existing material batches. One merged context-ground mesh; no added image textures. Representative player-height counters, shadows included:

| View | Draw calls | Submitted triangles | Texture allocations |
|---|---:|---:|---:|
| urban-central | 36 | 166,830 | 8 |
| urban-east | 35 | 166,734 | 8 |
| urban-west | 30 | 163,266 | 8 |
| urban-wide | 36 | 166,830 | 8 |

Lint, typecheck, **130 tests (123 preserved + 7 essential)** and production build PASS. Development smoke PASS: walking/running, context collision, all four views and a western exit traversal from X -119 to approximately -153.5 m. Browser console/page errors: none. Counters come from headless software WebGL and are not a hardware frame-rate guarantee.

## Limitations and manual review

The 2006 plan is schematic and predates current reconstruction. Context heights (mostly 2-4 storeys), partitions and facade treatment are approximate. Distant masses deliberately have minimal detail; side/rear facades are simplified. Buildings culled for gameplay/monument clearance leave conservative gaps. The paving transition is a conservative rendering mask. No whole-city reconstruction or prohibited atmospheric systems were added.

**MANUAL TEST REQUIRED: YES.** With architectureDebug and silhouette OFF, request only:

1. `/explore?world=bhaktapur&review=urban-central`
2. `/explore?world=bhaktapur&review=urban-east`
3. `/explore?world=bhaktapur&review=urban-west`
4. `/explore?world=bhaktapur&review=urban-wide`

Stop after Phase 7C. Owner's untracked reference material remains outside the commit.
