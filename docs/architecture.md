# Phase 5 procedural heritage environment

The manually approved Phase 4B trace remains the coordinate foundation. No source pixels, calibration values, source files or factual heights changed. Fourteen source-derived building footprints drive five ordinary-building masses and nine monument interpretations. Eight separate PLACEHOLDER buildings provide urban enclosure; conservative source-envelope checks exclude overlapping context candidates. This is an early architectural interpretation, not a digital twin or a verified reconstruction of named monuments.

## Data and architectural assumptions

`src/data/architecture/config.ts` centralizes APPROXIMATE architectural parameters: 3.1 m storeys, 0.85 × 1.35 m windows, 1.2 × 2.2 m door representations, 0.65 m eaves, straight roof pitch ratio 0.32, 0.18 m risers and 0.36 m treads. Tier shrink, spacing, posts, finials and plinth parameters are also assumptions. None enters `SpatialFeature.heightMetres`, which remains null. Published VERIFIED component metadata retains its original scope.

`registry.ts` consumes the exact calibrated footprints, preserving source linkage and neutral IDs. Connected footprints with white voids become multi-storey courtyard masses. Ordinary buildings use deterministic two/three-storey variation. Standalone monuments receive approximate stepped bases and restrained one/two/three-tier roof silhouettes; two dark diamond symbols receive stone-body interpretations. Roof type, floors, tiers and entrance positions are design decisions, not identities inferred from the map. No named palace/temple, actual window count or historical entrance is asserted.

Context buildings have empty source IDs, explicit PLACEHOLDER classification and their own registry. Their placement is intentionally invented for enclosure and never written into UNESCO traces. Replace them when better spatial evidence exists.

## Geometry, materials and collision

`geometry.ts` extrudes original polygon rings and holes into masonry volumes. Courtyard voids stay open in the body geometry. Facade roof wings follow original edges; roof/eave overlaps and small courtyard coverage remain approximate. `model.ts` produces static volume, roof, facade and collider descriptions. Straight hip roofs have ridges, deep eaves and no exaggerated curvature. Pagoda tiers clear lower roof peaks. Windows have projecting timber frames, dark inset panels, sills and simplified crossbars. Doors are closed visual representations, not passable historical entrances. Posts, bands, stone plinths and stair flights use shared vocabulary.

Brick, timber, stone, roof and paving are shared rough MeshStandardMaterial resources. Brick, roof and paving use deterministic 256 px GENERATED VISUAL MATERIAL tiles, not source photography. UVs use a two-metre tile with approximately 0.25 × 0.094 m masonry and 0.31 × 0.16 m pavers. Mipmaps and filtering control distant shimmer. Fine carving, detailed tile meshes and weathering are intentionally absent.

Static masonry is merged by material; all roofs merge into one mesh. More than 10,000 small facade/details instances share a unit box and a few material batches. Only major volumes, roofs and player cast shadows. No architecture uses per-frame React state or per-frame geometry work. Resources dispose on unmount. A representative headless production view measured 15 render calls, seven resident geometries and approximately 146,000 triangles; this is not a hardware FPS guarantee.

Physics uses two fixed bodies: plaza and architectural compounds. Footprint boundary walls and coalesced interior cuboids block building entry without filling courtyard holes. Plinths and stair flights use cuboids; no trimesh or decorative-window colliders exist. Conservative roof-level slabs support camera obstruction; slope precision and walkable roofs are not implemented. Administrative boundaries and raster comparison have no collision.

The existing controller and camera algorithms remain unchanged. Camera far clipping increases from 100 to 260 m because architectural context exceeded the old engineering range. Development spawn [30,0.05,35], yaw 0.55 radians, remains inside the interpreted open-square polygon and clear of solids; it is not an official entrance. Plaza support spans the existing 1800 m development ground, without claiming historical paving extents.

## Daylight, quality and reconstruction

Bhaktapur uses neutral daylight, hemisphere fill, directional sun, restrained distance haze, architectural shadows and existing ACES tone mapping. Engineering retains its original lighting and fixtures. LOW/MEDIUM/HIGH share all source masses/roof silhouettes; `architectureQuality` adjusts shadow resolution, window density, lattice detail and context density. The existing `DEFAULT_QUALITY_PRESET` selects MEDIUM; no visitor settings UI was introduced.

Home Explore, plain `/explore` and `?world=bhaktapur` retain Bhaktapur routing. Engineering remains explicit and its selector development-only. `/reconstruction` still compares runtime source footprints with the map and links back to the 3D world. Diagnostics remain default-off and development-only. The raster endpoint and comparison return 404 in production; normal exploration never requests the research raster.

## Validation and human approval

Tests cover source linkage, unknown factual heights, unique IDs, positive parameters, deterministic variation, finite geometry, quality silhouette retention, generated material integrity, collision/spawn validity, real Rapier monument stairs and body blocking. All prior map/player tests remain applicable.

MANUAL TEST REQUIRED: YES. Inspect first impression, plaza breadth, player scale, enclosure, tier spacing, roof/eave proportions, materials, intended stairs, building/camera collision and performance. Compare source placement in development `/reconstruction`. Check that the result feels restrained and Newar-inspired rather than fantasy architecture. Automatic validation does not establish visual or historical approval.

Known limits: partial eastern core, simplified buffer and incomplete urban fabric; unverified heights, elevations, roofs, facades, ornament, identities and geographic tie; schematic roof junctions and closed facade openings; finite research coverage and invented enclosure. NPCs, AI, interactions, audio, final character and detailed individual-monument reconstruction remain outside Phase 5. Await human visual approval before further phases.
