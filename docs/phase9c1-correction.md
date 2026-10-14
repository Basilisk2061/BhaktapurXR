# Phase 9C.1 focused correction

Baseline: `007e393059352779ce28fd74e7ba03d0aed56f8d`. Continued interrupted work; no reset. All local reference media remains untracked and must not be redistributed with this commit.

## Evidence and object audit

Directly inspected Khauma outside/through PNGs; all three `inside-left-school-gate-*` images; `inside-right-pavilion-buildings.png`; `shikhara-sattal-reference.webp`; and the previously extracted contact frames from the owner's `inside-square-reference.mp4`. The still photographs establish form; video frames supply ordering/roofline/platform relationships only. Existing calibrated map/footprint and monument registration remain the spatial basis. No new web research or generated images.

- North flank `edge:khauma-north-flank:1158762014`: replace generic house/frontage with brick boundary wall, central diamond-lattice gate, low tiled gate roof, two outer guardians, two inner reliefs and stepped stone pedestals. DIRECT_PHOTO_RECONSTRUCTION form; dimensions and exact wall/sculpture registration approximate. Source assembly origin unchanged; new visible wall composition shifted 2m east locally to clear frozen gate masonry, not a Khauma transform change. School text omitted; restrained blank board.
- New `entrance:khauma-raised-veranda`: light plastered body, open north-facing timber veranda, broad tiled roof/red eave border, 1m brick retaining platform/stone cap and six 0.16m access risers. DIRECT_PHOTO_RECONSTRUCTION form; PHOTO_RELATIVE_KHAUMA placement approximately [-121.7,-23.6], not surveyed or individually bound to a source lot. No claim of exact building identity.
- Rameshwar: same identity/anchor/yaw and four posts; stronger aged-stone dome, ringed summit and retained lingam/platform. Gopinath/Dwarika two-tier building remains exactly unchanged and supplies the adjacent layered roofline. No duplicate Jagannath, Nyatapola or exposed Taleju.
- Eight occupied context lots have unsupported residential facade/storey interpretations withdrawn: 1158762012, 1158762013, 1158762016, 1159393574, 1159393575, 1159633450, 1159633451, 211076664. FOOTPRINT_ONLY_CONTEXT; simple 3.2m working masses/roofs, no guessed windows. Occupancy is mapped; individual elevations/identity UNRESOLVED. Colliders reduced with visible bodies.
- Exterior approach groups 1159661606, 1159672142, 1159672143 retained PLAN/PHOTO_INFERRED. They are outside the entrance composition and supported by the existing approach photographs.
- `context:9c:1159393579`: withdraw guessed eastern house, retain only a 0.3m low terrace at its footprint. REMOVE_AS_OPEN_SPACE from the residential interpretation; source-object-to-photo correspondence unresolved, no independent surveyed-vacancy claim.
- `context:9c:1159393576`: withdraw only the generic east-apron extrusion (local x6..18.4, z-36..-23.7); retain other ranges. Approved palace frontage is a separate preserved assembly. PLAN/PHOTO_INFERRED public forecourt interpretation, not a correction to raw map geometry or survey coordinates.

## Sculpture method

Reuse museum continuous loft/tube surface construction in a temporary sculpture model; museum builders and geometry remain untouched. School lions receive distinct width/height/depth proportions (1.18/1.22/1.10), heavy breast treatment and taller tiered crowns; stage them on new school pedestals. Reliefs have different scale/staging and posed-arm variants. Unsupported held-object and reclining-figure detail from the museum reference is omitted. Figures have neutral left/right IDs and no deity names. Shared weathered museum stone materials; no new textures. Simplified body/backplate colliders, no per-tooth collision. Medium carving is interpreted, not an exact iconographic replica.

## Eastern temple and arcade

- Corrected landmark is `silu-mahadev`, Silu Mahadev / Phasi Dega, RECONSTRUCTED_APPROXIMATE identity/position with PHOTO_INFERRED form and APPROXIMATE dimensions.
- Anchor unchanged: [36.381141261935795,-39.58947505271122]. Working architectural yaw changes -1.4967963267948965 -> -0.105 radians. The entrance/terrace now addresses the open southern/eastern plaza approach rather than the former axial route treatment. This is a photo/context interpretation, not a surveyed azimuth. Original Phase 6C and correction datasets untouched.
- Old base 18 x18m, 6m high, six receding terraces and 30 stair risers. New base 24 x20m, 2.1m high, three major terraces. One localized front access: 12 risers of 0.175m, 0.33m treads, approximately 3.15m wide, connected to the upper landing/terrace. No all-around staircase pyramid.
- Sanctuary/front recess, projecting entrance articulation, four corner porch/tower groups, cornices, four-sided ribbed central tower, neck and finial rebuilt. Working overall height about 26.2m. Major hierarchy is photo-supported; exact dimensions, rear forms, carving and azimuth are approximate.
- Covered range remains `context:9c:1159393578`; Layku correspondence PROVISIONALLY_IDENTIFIED. The former short-front mapped L extrusion did not reproduce the photograph's long continuous arcade. New approximate visible range x-11..18.1, z-44..-36.5 has raised sitting edge, repeated lower bays/posts/brackets, recessed timber gallery, rear wall, sloping hip roofs/deep eaves/red border and a modest inferred rear return. Existing assembly anchor [8.864425485930088,-44.419865293262056] retained. Raw OSM L trace remains unchanged; new exterior extent is explicitly photo-inferred and must not be mistaken for source-derived geometry. Roof envelope and photographic bay count are working interpretations. No exact-name, 49-bay census or as-built claim.
- Eastern mapped north/south route is preserved to the right of the arcade; first extended range failed this collision check and was narrowed. No invisible blocker left at the old range.

## Paving and frozen work

Removed `ground:9c-lane-transitions`, the contrasting interior route overlay. `entrance:khauma-road` now ends at the frozen gate centreline; only the exterior pale surface remains. Interior uses existing continuous heritage brick paving. No new guide line, plaza-layout or ground-collider change.

Approved Khauma model/transform, museum facade/sign/sculptures, Golden Gate, 55 Palace, palace frontage, Chyasilin, Vatsala, column/bells, Yaksheshwar and other western heritage models preserved. Player/controller/fly/camera behaviour and lighting/material factories unchanged. Manual override JSON untouched. New architecture registered with meaningful grouped parts; old IDs/local part pivots retained in `eastern-editor-frames.json`.

## Limits

This is an evidence-compatible visual correction, not a measured site model. Specific school statue iconography, exact sculpture carving, rear/private architecture, exact veranda registration, covered-range name/footprint correspondence, exact terrace/access inventory and all unphotographed elevations remain unresolved. Ordinary unknown occupied lots are explicitly footprint-only, not named reconstructions. Nearby approved monuments were not moved merely to reproduce a photograph's apparent spacing. Vegetation, people, temporary scaffolding, pots, cloth animation and exact modern signs are omitted.

## Validation and performance

- Lint / typecheck / production build: PASS on final source.
- 115 relevant tests: PASS (48 completion/Khauma/editor/override/collision checks, 67 architecture/museum/palace/west regressions). Six focused new tests cover paving termination, frozen heritage, photo assemblies/editor frames, actual temple/veranda climbs and all three palace court voids including new roof projections. Five street exits and mapped gate-to-central/eastern routes pass actual Rapier traversal.
- Browser: 14 focused 9C.1 routes plus unchanged `9c-eastern-square` comparator loaded without page/console errors; affected views rechecked after final crown/camera correction. Screenshots inspected at walking height and low aerial. No detected floating columns/roof, z-fighting or old route remnant.
- Continuous browser/controller walkthrough: 52 walking segments, outside gate -> left/right inspection -> western/palace/central square -> eastern platform circuit -> return to Khauma. Ten continuous 25m flight segments across the region. PASS, zero errors. One earlier run was invalidated by development refresh and was repeated successfully. Software-rendered steering uses QA pixel ratio .5 and cached shadows; full-resolution review captures checked separately. No player/camera code changed.
- World Editor V2 browser regression: PASS, navigation, focus, assembly/part selection, unlock, numeric/gizmo transforms, undo/redo, isolation, reset, mocked save/reload and collider alignment. Saved override file unchanged. 146 assemblies / 482 parts. New meaningful sculpture/platform/roof parts remain grouped, not per-brick entries.
- Production browser: scene loads, editor UI absent and development transform GET/POST endpoints return 404, no page/console errors.

| Gameplay `9c-eastern-square`, same player-height pose | Phase 9C before | Phase 9C.1 after |
|---|---:|---:|
| Draw calls | 48 | 47 |
| Submitted triangles | 514,120 | 587,284 |
| Textures | 8 | 8 |
| Colliders | 2,672 | 2,677 |

Final warmed overview sample: 62 calls / 761,836 submitted triangles / 10 textures. New detail raises triangle submissions; batching and shared materials keep calls controlled. No new downloaded textures, dependencies or material factories. Editor sample: 1,152 calls / 492,386 submitted triangles / 9 textures, versus Phase 9C sample 1,179 / 503,666 / 9. These are camera/cache-dependent renderer submissions including shadows, not unique mesh triangle counts or a hardware FPS benchmark. The sampled editor measurement precedes the final small crown adjustment; UI/collider/override regression remains applicable.

Acceptance judgment for the major visible compositions: A (real immediate gate environment) YES; B (brick shikhara / broad terrace / long dark arcade / open plaza) YES; C (no interior guide path) YES. Exact photographic spacing/foreshortening and private rooflines are approximate. This is an implementation judgment; user manual visual approval remains REQUIRED.

## Stable manual review URLs

- http://localhost:3000/explore?world=bhaktapur&review=9c1-through-khauma
- http://localhost:3000/explore?world=bhaktapur&review=9c1-khauma-left
- http://localhost:3000/explore?world=bhaktapur&review=9c1-khauma-left-close
- http://localhost:3000/explore?world=bhaktapur&review=9c1-khauma-right
- http://localhost:3000/explore?world=bhaktapur&review=9c1-khauma-interior-aerial
- http://localhost:3000/explore?world=bhaktapur&review=9c1-shikhara-reference
- http://localhost:3000/explore?world=bhaktapur&review=9c1-shikhara-close
- http://localhost:3000/explore?world=bhaktapur&review=9c1-sattal
- http://localhost:3000/explore?world=bhaktapur&review=9c1-plaza-aerial

Original `9c1-shikhara-front`, `9c1-shikhara-platform`, `9c1-shikhara-sattal`, `9c1-path-threshold`, `9c1-eastern-aerial` and all Phase 9C/earlier routes retained.

No reference media staged. No push or later phase work.