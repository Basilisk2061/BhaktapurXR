# Phase 6A current-square reconstruction model

Phase 5B passed technical checks but failed human visual similarity review. This phase establishes a separate reviewable composition dataset. It does not rebuild architecture or change gameplay. Manual spatial approval is pending; the dataset is not a certified current survey.

## Coordinates and calibration

Primary plan: Digital Himalaya, Commons metadata 2006, 1201×620. Raw source pixels are retained per object. Local coordinates are **X east / Z south**, in conditional metres; north bearing 0°. Fixed local origin is source pixel (265,350), not a geographic position. Chosen main-strip endpoints (265,350) to (1020,350) span 755 pixels. Uniform scale = published approximate 190 / 755 = 0.251655629 m/pixel. No scale bar exists in this schematic plan. Therefore metre positions, outline dimensions and areas are APPROXIMATE even when the pixel tracing is SOURCE_DERIVED. No width/area fitting or anisotropic deformation occurs.

The 190 m length is an INPUT constraint, not independent agreement. Chosen envelope bounds actually span 756 pixels, approximately 190.25 m. Typical sampled widths are 27.93, 29.70 and 24.91 m; maximum irregular north–south extent 41.02 m is not typical width. Gross envelope 5022.21 m² (+5.73% relative to published 4750). Partial net 4914.59 m² (+3.47%) subtracts Vatsala, Siddhi and Chyasilin outlines only. Missing shrine/bell/pedestal extents prevent a full walkable/paving area calculation. Envelope choices, map date, linework and published rounding explain an uncertain discrepancy, not a measured error. No boundary is adjusted to force exact area.

At alternative 180–200 m assumed length, distances scale by 0.947–1.053 and areas by 0.898–1.108: gross envelope about 4507–5565 m². These are sensitivity estimates, not confidence intervals. A current georeferenced orthophoto/site survey is needed before treating these as final world coordinates.

## Object model and public frontage

`types.ts` provides six accuracy classes, source registry, explicit nullable orientation state, field-specific position/footprint/height provenance, current-presence evidence, and footprint role. `bhaktapur-current.ts` stores 12 placed objects and five unplaced investigation records with the same nullable object schema. All heights are null. `architectureType` is a descriptive family, not a renderer or an assumed set of dimensions.

The palace is two labelled **public-facing line segments**, not the entire UNESCO compound polygon:

- Gallery section (555,307)–(724,326): ~42.80 m; public-facing normal ~186.41°.
- Fifty-Five Window section (756,328)–(868,343): ~28.44 m; normal ~187.63°.
- Gap between sections is not silently filled; Golden Gate point near (740,325) is approximate. Gate width/depth and palace depth/interiors remain unresolved. Segment endpoints are not claimed to cover every facade bay.

Eight-sided Chyasilin outline is a regular approximation of the labelled octagonal symbol, not eight directly traced survey corners. Plaza outline is an analyst-selected explicit envelope, not the complement of buildings. Both are classified APPROXIMATE. Badrinath/column/gate points have null footprints: no icon-sized building invented. Silu uses the whole historical stepped platform outline, not only an inner UNESCO symbol. Yaksheshwar lies south of the narrow main strip; Silu lies northeast of it. They belong to the spatial context of the royal square, not its measured narrow open-space area.

## Orientation, identities and present-day condition

Bearings are clockwise from north. Solid arrows mean documented facing / plan frontage. Dashed arrows mean outline axis with 180° ambiguity, **not a known entrance**. Unknown direction is null/UNRESOLVED and marked '?'. Vatsala stores south-facing 180° documentation separately from west stair access 270°. Siddhi/Yaksheshwar/Silu have plan axes, with actual front direction unresolved. No temple defaults to rotation 0.

Each object's presence is inventory-supported or restoration-documented, with dated/undated limits. Vatsala restoration completed 2020 is documented; Silu restored presence is supported by June 2022 caption and UNESCO reporting. Neither establishes a 2026 unchanged footprint. Gopinath Krishna, Kedarnath, large bell, eastern Vatsala and Golden Spout remain unplaced. Historical Lamupati and Hari Shankar upper temple are stored separately and never included in current objects. Nyatapola and Taumadhi Bhairavnath are explicitly outside target.

Seven source-linked relationships encode palace/public-strip edge, Chyasilin south of the eastern palace, Vatsala southeast of Golden Gate, column west/northwest of Vatsala, Yaksheshwar south/southwest of Chyasilin, Siddhi east of Chyasilin, and Badrinath south of Rameshwar. These require human review; numeric positions are not stronger evidence than the source plan.

## Vatsala anchor

`vatsalaDimensions` records historical measured component values cited by archaeology: superstructure 12.85 m, platform 0.60 m, conflicting triple plinth 2.25 / 2.75 m. Conditional additive totals 15.70 / 16.20 m are retained but `selectedTotalMetres` and object height remain null. Component datum overlap and current restoration applicability must be checked before future model generation. No renderer consumes these values in Phase 6A.

## Old versus new

Original UNESCO trace, raster and calibration remain unchanged; checksum tests enforce this. Old trace supplies context only. Development comparison registers Rameshwar and candidate Vatsala control centres:

- Default rigid alignment rotates/translates, preserving old metre distances.
- Optional two-anchor similarity alignment changes **display scale only**, to compare shape residuals. Neither transform mutates stored original points or establishes a new georeferencing.

Main differences from Phase 4B/5B: explicit constrained long/narrow public square; separately labelled palace frontage instead of generic compound mass; directly located Chyasilin instead of a supplementary anchor inferred from gaps; full Silu platform instead of inner symbol; named-plan associations replace footprint-index assumptions; unbound shrine/bell identities stay unresolved. Pink residual outlines illustrate differing source shapes/scale assumptions. Neither overlay is accepted ground truth.

## Review route and manual protocol

Run `npm run dev` and open **http://localhost:3000/reconstruction-current**. Production returns 404 for this route and `/api/dev/reconstruction-plan`; normal gameplay remains Phase 5B. If port 3000 is occupied, use the exact localhost port printed by Next.

Controls: old UNESCO overlay; optional old scale fit; Digital Himalaya source plan; source opacity; labels; 10 m grid; selected object. Hover/click datum for notes; selection panel shows class/confidence, coordinates, direction state, footprint role and source IDs. Legend covers VERIFIED, SOURCE_DERIVED, PHOTO_INFERRED, APPROXIMATE, PLACEHOLDER, UNRESOLVED, old pink dashed trace and facing/axis distinction. North arrow and 10 m reference use the same metric viewbox. Source plan is served only in development from a fixed local path.

Screenshot 1: full above-view, labels/grid on, old/source overlays off. Assess narrow main strip, palace frontage, western group and relative central/eastern arrangement.
Screenshot 2: same view with source plan at ~0.5 opacity and old trace on, default rigid mode. Assess correspondence and residuals.
Screenshot 3: Vatsala selected, with uncertainty panel; optionally compare old scale-fit mode but do not treat fitted agreement as proof.

Manual acceptance should focus on boundaries/identity/relative spacing/front directions, not architecture. No final reconstruction is started until this composition is reviewed.

## Validation and limitations

Tests check IDs, source registry/field evidence, explicit orientation states, finite deterministic geometry, raw-pixel inverse conversion, nullable heights, frontage separation, historical/other-square exclusion, Vatsala discrepancy, scale sanity, rigid overlay distance preservation, source JPEG checksum and immutable original UNESCO files. Existing gameplay/physics/world tests are retained.

Executed validation: lint and typecheck passed; all 56 tests passed (46 retained, 10 added); production build passed. Headless Chrome development checks rendered all 12 placed objects and 15 old comparison outlines, exercised source/opacity/label/grid/selection/registration controls, and received the source JPEG with HTTP 200, with no page or console errors. Production checks passed visitor entry, Bhaktapur walking/running/jump/landing/camera, engineering-world entry/jump and absence of idle React commit loops. Both review routes and both development image endpoints returned 404 in production. No page errors occurred. Automated checks do not establish real-world spatial correctness; manual review remains required.

Known limits: schematic historical plan; unknown as-built 2026 changes; approximate metric scale; analyst envelope and octagon; incompletely subtracted open area; missing current orthophoto/raw scan; uncertain entrance directions; no depths/heights for most monuments; no geospatial origin; no current architecture generated. Research/access/licence details and conflicts are documented in reconstruction-sources.md. User reference photographs remain untouched and untracked.
