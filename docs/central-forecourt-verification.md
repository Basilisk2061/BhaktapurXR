# Phase 6C — central forecourt verification

Status: implementation complete; relative spatial freeze awaits one central screenshot review. No final 3D architecture is introduced. Baseline: `6b065185131bb65bdd36285775e421f7849c9ba6`.

## Scope and coordinate convention

All Phase 6B nominal positions, source geometry, open spaces, source registration, geographic origin and adopted rigid fit are retained. Phase 6C adds explicit interpretation, independent photographic evidence, typed relationships and relative-layout uncertainty. It does not substitute unmeasured photographic distances for survey data.

Origin remains latitude 27.67205, longitude 85.42856. X is east and Z is south. Rigid scale is 1; rotation is −1.3454844413782245°, with translation [−135.5122877845299, 1.2885277597576867]. The approximately 190 m site extent is unchanged. Alternative similarity fit remains diagnostic only.

Coordinates below are nominal fitted local metres, rounded for reporting, not metre-accurate measurements. Raw positions remain unchanged in `present-day.ts`. Circles are analyst allowances for relative placement, not footprint dimensions or statistically measured confidence intervals. Shared geographic-frame uncertainty is additional; do not interpret a 4 m circle as absolute GPS accuracy. Relationships constrain plausible arrangements inside these regions; overlapping circles do not merge distinct objects.

## Malla column

**Identity/presence:** Bhupatindra Malla statue on a stone column. Confirmed in the independent 4 December 2024 photograph; no 2026 field survey is claimed.

**Plan representation: ICON.** Best available local Digital Himalaya raster is 1201 × 620 pixels. The pseudo-three-dimensional column icon occupies approximately x719–745/y366–394. The retained source anchor [738,374] is near its cap, while the long diagonal “King Bhupatindra Malla’s Column” text lies southwest. No visible leader justifies moving to the text centre. The icon is not an orthographic footing survey: its tilted shaft/body lies southwest of the cap. This explains much of the apparent label-versus-point discrepancy, while the exact footing remains unresolved.

**Coordinate audit:** Contrary to the review concern’s premise, Phase 6B did not snap the column to a web coordinate. The point originated from the plan icon and was transformed with the common rigid fit. The local Malla page’s 27.672017/85.428410 point has about 1.80 m residual; the earlier brief’s 27.672080/85.428410 has about 8.01 m residual. Neither independently establishes a surveyed footing. The local large-bell coordinate is only about 1 m from the local Malla coordinate, illustrating why these web points cannot reliably distinguish neighbouring structures. No new control was added.

**Photographic relationships:** Independent 2024 view confirms the column in front of Golden Gate/palace. The 2016 west-side view distinguishes column, pavilion and roofed bell platform. Opposing 2021 views establish column west/northwest of Vatsala and west/southwest of Chyasilin. Approximate Gate alignment is supported, but perspective does not establish exact lateral offset or distance. Nominal Gate–column distance is about 12.34 m in the retained model, not measured from photographs.

**Chosen position:** previous and final fitted [−16.37, 4.53] m; raw [119.03311258278146, 6.039735099337749]. Moved: **NO**. `PHOTO_INFERRED`, 4 m relative allowance. This accommodates roughly 2–3 m icon cap/body displacement and schematic interpretation; it is an analyst bound, not calibrated confidence.

**Sources:** Digital Himalaya (`dh-plan`); municipal inventory; Nepal Tourism Board; local Malla page; 2016/2024 and opposing 2021 photographs. The 2013 photograph is historical context only.

**Unresolved:** footing centre/outline, pedestal dimensions, exact Gate separation/alignment and surveyed statue bearing. No unsupported VERIFIED status or text-centre coordinate.

## Large bell

**Identity/form:** Taleju / Big Bell / Tagoun Ghan: suspended bell under a roof supported by four stone pillars on an elevated platform. Separate stable object ID `large-bell`.

**Presence:** confirmed by the restored-square 2021 opposing photographs, independently corroborated by the 2018 bell photograph. Latest cited presence is 2021, not a 2026 inspection.

**Plan representation: NONE.** Adjacent unlabelled coloured rectangles cannot uniquely establish a bell footprint or centre. No source pixel anchor is invented and no rectangle is relabelled just to complete the map.

**Relationships:** in the public forecourt before Golden Gate, near the Malla column, west/northwest of Vatsala. Independent 2016/2018 photographs and opposing 2021 views establish a distinct roofed structure. UNESCO’s Bhaktapur Vatsala section describes the temple beside the statue and next to Big Bell. No Swayambhu bell passage is used as Bhaktapur evidence.

**Coordinate evidence:** local bell page gives 27.672008/85.428411, nearly duplicating the column location. It supports general vicinity only; it is not a new control. The 2018 image’s camera GPS is a viewpoint, never the bell centre. No calibrated photogrammetry or metre separation is claimed.

**Chosen position:** fitted [−14.08, 5.48] m; raw [121.29801324503312, 7.04635761589404], unchanged. `PHOTO_INFERRED`, 6 m relative allowance because no unique plan footprint or measured camera geometry exists. This replaces an unexplained bare point with evidence and a reviewable uncertainty region, without inventing a shift.

**Sources:** municipality, local Taleju/Big Bell page, UNESCO 2018, independent 2016/2018 photographs and opposing 2021 photographs. 2013 supplies historical order only.

**Unresolved:** platform/support outline, precise column separation, ritual naming. “Bell of Barking Dogs” is not a unique object key: descriptive pages may conflate names/date. Morphology and the municipality’s separate entries are stronger disambiguators.

## Vatsala-associated bell

**Identity/form:** smaller suspended bell in ornate stone columns/lintel arch on the low temple terrace, not the roofed four-pillar bell pavilion. Stable ID `vatsala-bell`. The barking-bell alias is qualified rather than treated as decisive identity evidence.

**Presence:** visibly distinct in both 2021 views of the restored temple. NHDP/DANAM describes a bell hanging from ornate columns/lintel on the lowest plinth and records temple renovation in 2020.

**Plan representation: NONE.** No uniquely identifiable independent bell label/symbol/outline. No Vatsala text centre or unidentified rectangular block is used as a bell coordinate.

**Relationships:** on the low terrace near western access, with a southern component in the qualitative reconstruction. The exact cardinal attachment remains unresolved: the graph therefore records NEAR Vatsala, not a surveyed SOUTH_OF/WEST_OF constraint. Opposing views show this smaller arch separately from the roofed large bell.

**Coordinate evidence:** no independent credible object coordinate adopted. Nominal point is constrained by temple/arch relationships; never a fit control or camera GPS location.

**Chosen position:** fitted [−13.99, 9.26] m; raw [121.29801324503312, 10.821192052980132], unchanged. `PHOTO_INFERRED`, 5 m relative allowance covers uncertain terrace attachment and west/southwest/south placement. This is not physical arch size.

**Sources:** NHDP/DANAM Vatsala record, Nepal Tourism Board, municipality, local Vatsala page and both 2021 photographs.

**Unresolved:** exact arch centre, terrace outline, attachment face and name assignment. No historical-only bell object is added to current geometry.

## Source plan representations

| Object | Representation | Interpretation |
|---|---|---|
| Malla | ICON | cap anchor [738,374]; footing unresolved; text southwest |
| Large bell | NONE | unlabelled blocks not uniquely attributable |
| Vatsala bell | NONE | separate bell anchor/footprint unresolved |
| Golden Gate | TEXT_ONLY | existing approximate frontage-gap association retained; not text centre |
| Vatsala | FOOTPRINT | existing schematic outline retained |
| Chyasilin | ICON | octagonal icon [805,357]; regularized footprint remains approximate |

Golden Gate retains its original approximate placement with a 6 m relative review allowance; it is not promoted to a surveyed point. Blue rings mark source icon references, purple points/circles show photograph-inferred placement, and red question marks/legend identify unresolved exact geometry.

## Explicit central relationship graph

All eleven relations are PHOTO_INFERRED qualitative statements. Six valid object IDs are used. No unsupported metric or BETWEEN claim is added.

| From → to | Type | Evidence/limit |
|---|---|---|
| Malla → Golden Gate | IN_FRONT_OF | 2024 independent view, plan, local description, 2021 pair; public/south side |
| Malla → Golden Gate | ALIGNED_WITH | approximate Gate association; no exact axis or measured 12.34 m distance |
| Large bell → Malla | NEAR | 2016 view and 2021 pair distinguish adjacent platform |
| Malla → Vatsala | WEST_OF | plan, UNESCO context, opposing 2021 views |
| Vatsala → Golden Gate | IN_FRONT_OF | plan, UNESCO, 2021 views |
| Large bell → Golden Gate | IN_FRONT_OF | local description and 2021 views |
| Large bell → Vatsala | WEST_OF | UNESCO, independent 2018 view, 2021 pair |
| Vatsala bell → Vatsala | NEAR | NHDP lowest-plinth description and 2021 pair; exact cardinal side unresolved |
| Chyasilin → Vatsala | EAST_OF | plan and 2021 pair |
| Chyasilin → Vatsala | NORTH_OF | plan and 2021 pair |
| Malla → Chyasilin | WEST_OF | plan, independent 2016 view, 2021 pair |

The opposing 2021 views are by the same photographer/session and are not independent survey controls. Independent 2016, 2018 and 2024 photographers strengthen the qualitative cross-check. Image-left/right is not automatically east/west; cardinal interpretations use the plan and identifiable palace orientation together. The 2013 view corroborates historical order only; its pre-earthquake buildings do not establish current architecture.

## Research source ledger

Public text, original photographs and Commons attribution metadata were inspected. Images remain external research references; no research photographs are packaged in the application. Licences below apply to photographs, not survey reliability.

- [Digital Himalaya plan source](https://commons.wikimedia.org/wiki/File:Map_of_Bhaktapur_Durbar_Square.jpg) — local original 1201 × 620 raster, existing CC BY-SA 3.0 adaptation attribution retained.
- [Bhaktapur Municipality inventory](https://bhaktapurmun.gov.np/en/node/4) — separately lists statue, big bell and barking bell; names do not supply geometry.
- [NHDP/DANAM Vatsala record](https://danam.cats.uni-heidelberg.de/aea67ec1-6cb8-4171-997f-1d6791011183/vatsal%C4%81-mandira-bhaktapur/) — lowest-plinth ornate bell supports; renovation chronology.
- [UNESCO 2018 state-of-conservation report](https://whc.unesco.org/document/165534) — PDF page 26 / printed page 25, Bhaktapur Vatsala section; original foundation and statue/Big Bell adjacency.
- [Nepal Tourism Board](https://ntb.gov.np/en/bhaktapur) — palace-front column and terrace bell; naming/date conflation retained as a limitation.
- [Local Malla description](https://www.bhaktapur.com/discover/statue-of-king-bhupatindra-malla/) and [Taleju/Big Bell description](https://www.bhaktapur.com/discover/taleju-bell-big-bell/) — qualitative descriptions and low-precision coordinates.
- [Column/Chyasilin, 9 September 2016](https://commons.wikimedia.org/wiki/File:Bhupatindra_Malla_Statue_Perching_on_the_top_of_stone_monoliths_and_chyasilin_Mandap.jpg) — Suraj Belbase, CC BY-SA 4.0; post-quake context.
- [Big Bell, 19 September 2018](https://commons.wikimedia.org/wiki/File:Big_Bell,_Bhaktapur_Durbar_Square.jpg) — Shadow Ayush, CC BY-SA 4.0; camera location excluded from object controls.
- [Column/Golden Gate, 4 December 2024](https://commons.wikimedia.org/wiki/File:Bhaktapur_Durbar_Square_041224_221.jpg) — Goutam1962, CC BY-SA 4.0; independent current column association.
- [West-side central group, 20 August 2021](https://commons.wikimedia.org/wiki/File:Vatsala_Bhagwati_%26_Pasupati_Temple_Bhaktapur_Durbar_Square_Bhaktapur_Nepal_Rajesh_Dhungana_(2).jpg) and [opposed Vatsala view, same date](https://commons.wikimedia.org/wiki/File:Vatsala_Bhagwati_Bhaktapur_Durbar_Square_Bhaktapur_Nepal_Rajesh_Dhungana_(4).jpg) — Rajesh Dhungana, CC BY-SA 4.0; both bell forms and restored temple.
- [Golden Gate/column, 10 February 2013](https://commons.wikimedia.org/wiki/File:Bhaktapur_Durbar_square_and_Golden_Gate.jpg) — सरोज कुमार ढकाल, CC BY-SA 3.0; HISTORICAL_CONTEXT_ONLY.

Targeted DoA/CHIMS/NHDP searches did not locate an authoritative measured column/bell centre plan. This is a research gap, not evidence that such records do not exist.

## Validation and one manual review

Engineering validation: lint, typecheck, 75 tests (previous 66 plus nine central tests), production build, central and full-map development runtime, and production gameplay/runtime. All passed. Central browser checks confirmed four uncertainty circles (including Golden Gate), two source icon references, eleven central relationships, unchanged registration and no console/hydration errors. Full-map regression retained 17 objects, 16 anchors, five fit controls, 14 residuals, eight open-space categories and 15 old trace paths. Production walking/running/jumping/landing, camera control and engineering world passed, with no page errors or idle React commit loop; all four development-only routes returned 404. Tests freeze the adopted fit/origin, all original nominal positions, raw evidence and stable source files; exercise uncertainty, separate bell forms, historical filtering and valid relationship provenance.

Open `/reconstruction-current` in development and enable **CENTRAL FORECOURT REVIEW**. This selects adopted Rigid, Current reconstruction, Digital Himalaya source plan (opacity 0.35), Relationship lines and Labels; disables old trace, geospatial anchors and open-space fills. Keep those settings and the 10 m grid. Take **one screenshot** containing the map and evidence legend/cards, ideally at 1600 px width. Confirm Golden Gate/palace frontage, Malla, both bell forms, Vatsala and Chyasilin are visible with uncertainty circles, lines and source icons. No additional overall-composition or 3D architecture screenshot is requested.

Relative layout is ready to freeze **pending that human central screenshot review**. Exact footings, bell platform outlines, absolute geolocation, uncertain smaller-bell cardinal side and naming remain documented limitations. Phase 6C stops here; final 3D reconstruction has not begun.
