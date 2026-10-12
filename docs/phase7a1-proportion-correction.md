# Phase 7A.1 — central architectural proportion correction

Baseline: `21fb0316d1d8a3d684033aabf05dbcff898de969`. Phase 7A human visual approval was not granted. This pass changes local architecture only; it does not begin Phase 7B. Human approval of the same five screenshot views remains required.

## Same-reference comparison before geometry edits

Revisited the original Phase 7A material, with no broad research or new imagery:

- Restored Vatsala: Rajesh Dhungana, 20 August 2021, CC BY-SA 4.0, [central view](https://commons.wikimedia.org/wiki/File:Vatsala_Bhagwati_%26_Pasupati_Temple_Bhaktapur_Durbar_Square_Bhaktapur_Nepal_Rajesh_Dhungana_(2).jpg) and [reverse view](https://commons.wikimedia.org/wiki/File:Vatsala_Bhagwati_Bhaktapur_Durbar_Square_Bhaktapur_Nepal_Rajesh_Dhungana_(4).jpg). Same-session opposing views are not independent survey controls.
- Palace: owner's frontal/oblique photographs under `reference/landmarks/55-window-palace/photos/`, with photographer/date/licence unresolved. The 2006 Ram Govinda Shrestha conservation report was revisited for traditional timber/roofing and projecting-gallery context. Its historical ~45 cm joist projection is not adopted as a present-day measured value.
- Gallery: Maesi64, 11 April 2014, CC0, [attributed file-page photograph](https://commons.wikimedia.org/wiki/File:National_Art_Gallery_%E2%80%93_Bhaktapur_%E2%80%93_01.jpg). Historical-reference limitations retained; lower open arcade and upper shuttered rooms are visually different. No lost tower introduced.
- Golden Gate: Goutam1962, 4 December 2024, CC BY-SA 4.0, [column/Gate view](https://commons.wikimedia.org/wiki/File:Bhaktapur_Durbar_Square_041224_221.jpg), plus the already inspected 2013 contextual view. Compare aperture, relief surround and forward metal canopy rather than enlarging the entire gateway.
- Chyasilin: Goutam1962, 4 December 2024, CC BY-SA 4.0, [close pavilion view](https://commons.wikimedia.org/wiki/File:Bhaktapur_Durbar_Square_041224_23.jpg), owner's wide palace views and the 2021 composition photographs. Open posts, thin eaves and layered upper pavilion guide internal corrections.

The mislabelled poetry PDF remains excluded from architectural evidence. Reference photographs remain research-only, not textures or redistributed assets.

## Explicit photo-proportion review

`architecture/proportions.ts` stores twelve PHOTO_PROPORTION reviews with reused source IDs, visual ranges, previous/working model ratios and interpretation limits; affected landmark specifications reference these records. Visual ranges are approximate manual comparisons of corresponding feature envelopes, not rectified measurements or confidence intervals. Oblique/low-angle perspective, cropping and occlusion prevent recovery of true overall height:width from these photographs. Those entries therefore store no observed screen range: their ratios are resulting model choices constrained by retained vertical evidence and local photographic relationships.

| Comparison | Previous model | Corrected model | Basis |
|---|---:|---:|---|
| Vatsala cornice / lowest plinth width | 0.88 | 0.77 | Visual envelope range approximately 0.70–0.85; exclude adjacent bell terrace |
| Vatsala upper / lowest plinth width | 0.89 | 0.77 | Visible tier setbacks; approximate visual range 0.70–0.83 |
| Vatsala tower face / cornice width | 0.67 | 0.69 | Four-sided radius converted to face width; both envelopes narrow |
| Vatsala total height / lowest plinth width | 2.52 | 2.75 | Resulting working model ratio, not direct photographic measurement |
| Pale section / gallery frontage width | 0.35 | 0.28 | Historical oblique image suggests approximately 0.25–0.32 |
| Lower arcade / upper room opening height | 1.00 | 0.77 | Different levels, rather than two repeated opening arrays |
| 55-window timber band / eave height | 0.25 | 0.26 | Continuous dark gallery; approximate visual range 0.25–0.33 |
| Gate torana / aperture width | 1.92 | 2.12 | Modest crown width correction; aperture remains 1.56 m |
| Gate torana / adjacent storey height | 0.63 | 0.67 | Relief hierarchy relative to immediate palace levels |
| Chyasilin lower / upper roof diameter | 1.97 | 1.89 | Broad lower eaves with a clearly smaller upper pavilion |
| Chyasilin lower roof rise / lower post height | 0.47 | 0.31 | Thinner roof over a taller open storey |
| Chyasilin total height / lower eave diameter | 1.20 | 1.40 | Resulting model ratio, not calibrated photo height recovery |

No unmeasured dimension or proportion is VERIFIED.

## Vatsala

Previous lowest plinth was 6.34 × 6.59 m with only 0.09 m total-width reduction per course: the top remained 5.62 m wide. Combined with a 5.6 m cornice, broad sanctum and shoulders, this produced nearly vertical heavy stone mass.

Corrected local rendered base is 5.80 × 6.05 m, narrowing to 4.44 × 4.69 m at the upper plinth. Platform is 4.70 × 4.85 m; sanctum narrows from 2.95 to 2.45 m. Twelve columns remain, with a smaller 1.82 m perimeter offset and 1.30 m bay spacing. Largest cornice is 4.45 m. Main four-sided spire radius reduces from 2.65 to 2.18 m; smaller subsidiary spires and closer shoulders improve the slender silhouette. Stair width becomes 1.40 m and its landing connects to the narrower platform.

Documented 12.85 m superstructure, 0.60 m platform and 2.25 / 2.75 m plinth discrepancy remain intact. Working plinth remains 2.50 m and working total remains 15.95 m, explicitly an additive reconstruction assumption. Main pinnacle height is unchanged. Frozen source footprint is untouched: these are local working architectural envelopes within the existing layout, not new surveyed boundaries.

## Palace and Gallery

The same public frontage lengths, heights and masonry volumes remain. Gallery opening placement now follows deterministic sparse groupings: doors/slits at ground level, mixed larger/smaller middle windows and three upper room openings in the red section. Pale frontage shrinks from 35% to 28% of the gallery segment; seven smaller unshuttered lower arcade bays sit below five taller rooms with paired shutters, sills, pilasters and projecting cornices. No random facade noise or identical two-level rectangle grid.

The 55-window concept is kept. A continuous dark timber backing, deeper projecting gallery sill/header, dense frames and grouped mullions connect the individual modules into one upper band. Twenty-five main-face modules and nine return modules remain an approximation, not a claimed census. Their grouping does not assert an exact historic window schedule. Existing return treatment continues the upper band.

Gallery and palace retain their respective ridge heights and tile roof forms. Eave fascia is thinner with more projection; the low gateway transition links the sections. Palette and neutral daylight are unchanged, so geometry—not grading—produces the comparison.

## Golden Gate

A significant weakness was roof occlusion: the rear tiled hip roof occupied much of the same space as the shallow metal canopy. The rear roof depth is reduced from 5 to 3.5 m and recessed locally; the metal canopy projects forward independently. The entire gateway is not scaled.

Portal width and jamb placement are unchanged. Torana width increases about 10%, height about 5%, and relief depth from 0.32 to 0.55 m. Projecting nested jamb mouldings, forward crown/central relief and a medium-scale raised deity fan strengthen the silhouette. Fine iconography remains simplified. Existing aged gilding/bronze materials are retained. Player-scale and wide-view browser checks evaluate the stronger silhouette; recognition approval remains human.

## Chyasilin

The old open-window helper still created a solid timber frame panel, closing most of the pavilion faces. Open pavilion calls now use outline frames and lattice without solid frame/recess infill. Palace windows retain their separate closed-frame implementation.

Lower posts rise from 3.00 to 3.35 m, upper posts from 1.75 to 2.05 m. Lower roof diameter reduces from 7.70 to 6.80 m and rise from 1.40 to 1.05 m; upper roof diameter is 3.60 m. Thin eaves/railings and adjusted floor separation create a lighter, vertically layered structure. Two eight-sided roofs and sixteen posts remain. Highest model extent is 9.55 m, resulting from internal corrections rather than blind whole-model scaling. Platform height and entrance remain unchanged.

## Preserved data and collision

Phase 6C scale, rotation, origin, all monument/frontage anchors, raw footprints and open spaces unchanged. Review spawns, camera framing, ground presentation and daylight unchanged. Malla and both bell model outputs—including their collision—are hash-checked against Phase 7A and unchanged. Six non-7A neutral masses are retained; no new monument or feature is added.

Updated cuboids follow the narrower Vatsala terraces/sanctum/columns and connecting stair landing, taller pavilion posts and smaller roof undersides, and deeper Gate jamb relief. Existing full-scene Rapier tests preserve Vatsala stair access, Chyasilin centre passage, Gate passage and palace camera obstruction. No decorative trimesh collision.

## Validation and performance

Lint PASS; typecheck PASS; all 92 tests PASS; production build PASS. All five unchanged development review views rendered without page, console or shader errors. Production walk/run/jump/landing, engineering world and idle React stability passed; four development-only routes returned 404. Browser tests used test-only body relocation to exercise the real assembled colliders: Vatsala reached body Y 3.99 m; Chyasilin reached 1.79 m and traversed its centre; Golden Gate was passed through; palace camera retracted to about 0.277 m. No page errors. Sampled production counts: 29–37 draw calls, 65,322–68,458 triangles, 11 geometries and 8 texture allocations. Architecture uses 1,995 visible instanced boxes, 73 merged profiles, 91 relief shapes and 126 simple colliders. Materials/maps remain unchanged; approximately 1.17 MiB procedural-map mipmapped estimate excludes shadow buffers and driver memory. These are view-dependent render counts, not a frame-rate or GPU-residency guarantee. All 85 original tests are retained; seven new tests protect unchanged Malla/bells, anchors/ground/review framing, honest proportion provenance, preserved Vatsala height, differentiated Gallery, forward Gate canopy and open octagonal pavilion.

## Same five manual screenshots

Run `npm run dev`. Use the same viewport, route-selected spawn and initial camera framing as the Phase 7A screenshots. Architecture debug must be OFF. No review spawn, field of view or lighting change was made to improve the comparison.

1. `/explore?world=bhaktapur&review=central`
2. `/explore?world=bhaktapur&review=palace`
3. `/explore?world=bhaktapur&review=composition`
4. `/explore?world=bhaktapur&review=close`
5. `/explore?world=bhaktapur&review=wide`

Capture immediately after loading, avoiding substantial repositioning. If the earlier screenshot included a slight turn, reproduce that turn. Click canvas; WASD walk, Shift run, Space jump, mouse look, Escape release; drag if capture is unavailable.

Remaining limits: unrectified photo ratios, historical Gallery reference, approximate unmeasured horizontal dimensions, simplified Gate sculpture/carving, occlusion of neighbouring forecourt landmarks and incomplete neutral surrounding architecture. Engineering completion is not human visual approval. Stop after Phase 7A.1.
