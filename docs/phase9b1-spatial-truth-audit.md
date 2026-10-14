# Phase 9B.1 spatial truth audit - BEFORE geometry changes

Baseline: 005f2f922028c82af804df899402e75fb3d872ec. Both user research media remain untracked and must not be committed. Manual transform JSON is preserved; source transform values below are implementation coordinates, NOT new measured map distances.

Directly inspected: labelled Digital Himalaya map, supplied westward palace JPG, both Khauma PNGs, and six newly sampled video frames across 0-8.8s. Generated temporary current top-down collider/assembly plan in local coordinates; compared topology conceptually, without metrically registering the tourist map.

## Entrance conclusion

Same western square entrance: Old Town Entrance Gate = West Gate = Khauma-area gate, HIGH confidence in naming/location relationship, APPROXIMATE metric registration. It is NOT Golden Gate. [Commons Old Town photo](https://commons.wikimedia.org/wiki/File:Old_Town_Entrance_Gate,_Bhaktapur_Durbar_Square.jpg) is independently catalogued under West Gate, with camera location near the established entrance; camera GPS is NOT gate-centre GPS. [Local Khauma account](https://www.bhaktapur.com/bktnow/bhaktapur-durbar-square-khauma/) explicitly describes the western square entrance. [Cambridge museum](https://museums.cam.ac.uk/story/continuity-and-change-in-the-durbar-square-at-bhaktapur-nepal/) separates the distant old-city gate from the royal Golden Gate, with opposite palace-facing historic photographs. Existing [UNESCO/DOA report](https://whc.unesco.org/document/165534) describes Khauma restoration. Local inward/outward photographs, mapped street 85465819 and the labelled map establish the same entrance sequence. No evidence for a second entrance at the same western cluster. Local place/gate naming is supported, exact etymology is not resolved. Download of the Commons preview failed; file metadata/classification was read, not falsely claimed as a viewed image.

## Findings and proposed actions

The existing western/central anchors substantially agree with plan ordering. No established coordinate is demonstrated wrong by the schematic map or perspective photographs. KEEP anchors rather than manufacturing corrections. The major observed errors are MODEL/PALETTE relationships: oversized pale lower openings; white Gallery wing too uniformly high/arcaded; generic brown wide Gate backing; insufficient plaster side-wall continuity; weak red Gate/shrine and dark carved-timber contrast. Golden Gate and the Old Town entrance remain separate assemblies.

| Current ID | Real/map identity | Map/neighbour relationship | Current position x,z | Yaw radians | Scale | Evidence/confidence | Action |
|---|---|---|---|---:|---|---|---|
| `khauma-gate` | Old Town Entrance Gate / Khauma-area west gate | NW of Rameshwor; west of Krishna and Gallery | -121.537, -34.286 | -1.709170 | 1,1,1 | Local plan + photographs + prior evidence; HIGH naming/topology; approximate metric | KEEP |
| `rameshwar` | Rameshwor Temple | Just inside entrance, north of Badri, west of Krishna | -108.553, -23.326 | 0.000000 | 1,1,1 | Local plan + photographs + prior evidence; Documented pavilion; provisional binding | KEEP |
| `badrinath` | Badri Temple | SW of Krishna; south of entrance | -116.249, -8.810 | 1.570796 | 1,1,1 | Local plan + photographs + prior evidence; Approximate/provisional position | KEEP |
| `gopinath-krishna` | Krishna Temple / Gopinath-Dwarika | East of Badri; north-west of Shiva | -97.272, -14.605 | 1.492796 | 1,1,1 | Local plan + photographs + prior evidence; HIGH equivalence; provisional footprint | KEEP |
| `kedarnath` | Shiva Temple (western central plan symbol) | SE of Krishna; west of central forecourt | -73.086, 1.230 | 1.570796 | 1,1,1 | Local plan + photographs + prior evidence; PROVISIONAL name binding; not every Shiva label | KEEP |
| `gallery-frontage` | National Art Gallery / adjoining Rana palace wing | North edge, west of Golden Gate | -41.491, -19.027 | -0.088473 | 1,1,1 | Local plan + photographs + prior evidence; PHOTO_INFERRED form; map topology agrees | REFINE MODEL |
| `golden-gate` | Golden Gate / Lu Dhwaka | Royal frontage, between Gallery wing and 55 Palace | -16.157, -16.959 | -0.038936 | 1,1,1 | Local plan + photographs + prior evidence; HIGH identity/topology; approximate geometry | REFINE MODEL |
| `fifty-five-frontage` | 55 Windows Palace | East of Golden Gate; north of Chyasilin | 2.020, -14.218 | -0.109653 | 1,1,1 | Local plan + photographs + prior evidence; HIGH identity; photo-inferred proportion | REFINE MODEL |
| `malla-column` | King Bhupatindra Malla's Column | South of palace Gate; NW of Vatsala Durga | -16.370, 4.532 | 0.000000 | 1,1,1 | Local plan + photographs + prior evidence; Map + calibrated prior evidence; approximate | KEEP |
| `chyasilin` | Chyasalin Mandap | South of 55 Palace; NE of Vatsala Durga | -4.945, -5.025 | 0.000000 | 1,1,1 | Local plan + photographs + prior evidence; Map topology agrees | KEEP |
| `vatsala-durga` | Vatsala Durga Temple | SE of column; SW of Mandap; north of Pashupati | -10.013, 7.277 | 0.000000 | 1,1,1 | Local plan + photographs + prior evidence; Map topology agrees; approximate dimensions | KEEP |
| `yaksheshwar` | Pashupatinath Temple | South of Vatsala Durga | -11.928, 19.708 | -0.138000 | 1,1,1 | Local plan + photographs + prior evidence; Documented equivalence; approximate | KEEP |
| `siddhi-lakshmi` | Siddhi Laxmi Temple | East of Chyasilin | 13.038, -6.078 | -0.135000 | 1,1,1 | Local plan + photographs + prior evidence; Map topology agrees; approximate | KEEP |
| `silu-mahadev` | Fasidega Temple / Phasi Dega | NE of palace public frontage; west of eastward exits | 36.381, -39.589 | -1.496796 | 1,1,1 | Local plan + photographs + prior evidence; Documented equivalence; schematic plan bearing not survey | KEEP |
| `vatsala-bell` | Vatsala-associated bell | Near west side of Vatsala Durga | -13.994, 9.259 | 0.000000 | 1,1,1 | Local plan + photographs + prior evidence; Not independently drawn/labelled in tourist plan | KEEP |
| `large-bell` | Large/Taleju bell | Between column and Vatsala temple | -14.082, 5.485 | 0.000000 | 1,1,1 | Local plan + photographs + prior evidence; Separate prior evidence; map does not resolve exact fixture | KEEP |
| `palace-corner-shrine-unresolved` | Small red shrine next to Golden Gate | Immediately east of Gate, against palace frontage | -11.847, -14.085 | -0.109653 | 1,1,1 | Local plan + photographs + prior evidence; PHOTO_INFERRED / IDENTITY_UNRESOLVED | REFINE MODEL |
| `edge:yetachapari:1160027594` | Southern inn / Yetachapari (provisional) | Southern edge west of Pashupati, above Potters exit | -43.962, 13.974 | 0.000000 | 1,1,1 | Local plan + photographs + prior evidence; Provisional footprint correspondence | KEEP |
| No securely bound assembly / see note | House of Malla | West of Old Town entrance, not the Royal Palace frontage | Unknown / existing context only | Unknown | N/A | Schematic plan; individual reconstruction unresolved | UNRESOLVED |
| No securely bound assembly / see note | Sundari Chowk | Behind gallery; inside Royal Palace | Unknown / existing context only | Unknown | N/A | Schematic plan; individual reconstruction unresolved | UNRESOLVED |
| No securely bound assembly / see note | Taleju Chowk | Behind public frontage, north of central open square | Unknown / existing context only | Unknown | N/A | Schematic plan; individual reconstruction unresolved | UNRESOLVED |
| No securely bound assembly / see note | Bhairab Chowk | Inner palace east of Taleju Chowk | Unknown / existing context only | Unknown | N/A | Schematic plan; individual reconstruction unresolved | UNRESOLVED |
| No securely bound assembly / see note | Royal Palace | Existing public frontage only; no invented complete interior | Unknown / existing context only | Unknown | N/A | Schematic plan; individual reconstruction unresolved | KEEP |
| No securely bound assembly / see note | Vatsala Temple (eastern) | East of 55 Palace / north of Siddhi; distinct from Vatsala Durga | Unknown / existing context only | Unknown | N/A | Schematic plan; individual reconstruction unresolved | UNRESOLVED |
| No securely bound assembly / see note | Taduchhen Bahal | SE edge; existing context is not a detailed Bahal reconstruction | Unknown / existing context only | Unknown | N/A | Schematic plan; individual reconstruction unresolved | UNRESOLVED |
| No securely bound assembly / see note | Khwopa Gate | Eastern exit; not Old Town entrance or Golden Gate | Unknown / existing context only | Unknown | N/A | Schematic plan; individual reconstruction unresolved | UNRESOLVED |
| No securely bound assembly / see note | Shiva Temple near Minibus Stop | Outside west core; not automatically Kedarnath | Unknown / existing context only | Unknown | N/A | Schematic plan; individual reconstruction unresolved | UNRESOLVED |
| No securely bound assembly / see note | Shiva Parbati / Erotic Elephant temples | NW outside current core scope | Unknown / existing context only | Unknown | N/A | Schematic plan; individual reconstruction unresolved | UNRESOLVED |
| No securely bound assembly / see note | Ugrachandi/Bhairab guardians | Western palace/galleries; existing abstract guardians not likenesses | Unknown / existing context only | Unknown | N/A | Schematic plan; individual reconstruction unresolved | UNRESOLVED |
| No securely bound assembly / see note | Potters / Taumadhi / Tachupal exits | South/southeast/east circulation remains distinct | Unknown / existing context only | Unknown | N/A | Schematic plan; individual reconstruction unresolved | KEEP |

## NAME RECONCILIATION

| Name A | Name B | Same monument? | Evidence / confidence |
|---|---|---|---|
| Old Town Entrance Gate | West Gate / Khauma gate | Yes | Commons file category + local Khauma description + DOA + matching western topology; HIGH identity, approximate position |
| Golden Gate | Lu Dhwaka / Swarnadwar | Yes, distinct royal entrance | Cambridge and existing municipal/NTB ledger; HIGH |
| Krishna Temple | Gopinath / Dwarika | Yes | DOA2018 names Gopi/Dwarika/Krishna; Cambridge 2022 caption names Gopinath Krishna; HIGH identity, provisional spatial binding |
| Badri Temple | Badrinath | Strong equivalent | Plan location and existing restoration documentation; approximate binding |
| Rameshwor | Rameshwar | Spelling equivalent | Plan ordering and DOA four-post description; retain pavilion, map pictogram not shape evidence |
| Western-central Shiva Temple | Kedarnath | PROVISIONAL only | Attributable western photograph/caption + prior evidence; generic deity label cannot uniquely identify every Shiva temple |
| Pashupatinath | Yaksheshwar / Yachheswor | Supported equivalent | Existing DOA/municipal/NTB evidence and consistent location; HIGH identity |
| Fasidega / Phasi Dega | Silu Mahadev | Supported equivalent | Existing restored-monument documentation; never Taleju |
| Eastern Vatsala Temple | Vatsala Durga / Vatsala-associated bell | NOT automatically equivalent | Plan contains distinct eastern temple; eastern identity/representation UNRESOLVED |
| Jagannath | Gopinath | NOT equated | Earlier misidentified duplicate remains removed; no new independently bound form |

## Palace photo mismatch list before editing

1. Pale lower facade consists of oversized regular arches, unlike the dark timber door/bay band and smaller pale openings in the supplied photograph.
2. Upper pale wing needs broad plaster fields and shallow blind arch panels above tall red shutters, rather than dark semicircular open heads throughout.
3. Gallery/public wing needs a lower two-storey architectural read relative to the dense timber Palace. Existing accepted model is uniformly tall.
4. Gate backing is an overly wide brown brick rectangle. Red rendered masonry/plaster around the gilded door and close side connections must be reconstructed.
5. Upper palace backing/roof junction does not continue convincingly above/around Gate; side reveals alone did not solve it.
6. Gate canopy sheet, eave cornice and ridge/summit grouping need greater gold identity and coherent attachment; retain frame semantics.
7. Small shrine should have a red polygonal body and tiered curved upper form, not ordinary brick cube.
8. 55 Palace carved-timber band is too light and sparse in contrast. Dense projecting timber silhouette, cornices and window panels should dominate.
9. Column/king/capital/parasol are present and on the correct side; photographic foreground magnification alone does not justify moving/rescaling it.
10. Paving is real open space; darken vertical wall materials instead of filling plaza with new buildings.

## Coordinate policy / scope

No established assembly transform changes proposed. Geometry heights/projections/rhythms will change within source frames and be recorded as approximate photographic refinements. Preserve all previous part IDs/local source pivots through the Phase 9B compatibility metadata. No distant mass rebuild, invented House of Malla, full royal interiors, exposed Taleju or Nyatapola. Six western placeholders stay evidence-honest; schematic absence alone is insufficient to override modern footprint evidence. OSM 211076664 is named Cafe De Tradition in the snapshot, but that does not verify its elevation or identify the video foreground platform.


### Additional pre-correction model conflict: bell and column

Directly re-inspected cached attributable `bell-2018.jpg`, `column-2024.jpg` and `gate-column.jpg` from the Phase 6C research cache, alongside the supplied palace photo. The big bell's earlier 6.25m total was an unsupported rendering assumption; its 4.04m clear piers/roof dominate the view disproportionately against photographed human scale and the column. Refine geometry above the retained 1.15m platform by a 0.75 vertical factor, resulting in approximately 4.975m total, without moving/rescaling the assembly transform. This is PHOTO_INFERRED, not a surveyed new height. Exact bell footprint/separation remains unresolved; no nominal anchor is changed to force a photograph.

The Malla lotus capital is visibly metal in both the local palace photograph and independent 2024 close view. Split it from the stone shaft as bronze, retaining the original envelope. Refine the flat parasol into a shallow tiered metal silhouette (approximately 9.05m model top instead of 8.88m). Action becomes REFINE MODEL for `large-bell` and `malla-column`; original KEEP position/yaw/scale decisions remain. Joined hands, seated figure, base and palace association are supported; fine likeness is not claimed. Evidence: [2018 Big Bell](https://commons.wikimedia.org/wiki/File:Big_Bell,_Bhaktapur_Durbar_Square.jpg), existing `malla-gate-2024` and `gate-column-2013` source records. This addition precedes these specific geometry changes.


## Implemented model refinements / unchanged transforms

No established assembly position, yaw or scale changed. Golden Gate and Khauma remain distinct; no new monument, House of Malla or interior was invented. The larger pale section is a surface/model subdivision within the original gallery footprint, not a relocated building. Preserve actual open plaza rather than filling it. No immediate/distant context mass was removed/moved; six unresolved western placeholders and 380 distant masses remain explicitly footprint-only.

Refined six assemblies: gallery-frontage, golden-gate, fifty-five-frontage, palace-corner-shrine-unresolved, malla-column, large-bell. Geometry-only working changes: pale facade fraction .28 -> .38; pale roof eave 8.55 -> 7.4m while western return stays supported at 8.55m; gate red surround width 8.05 -> 4.88m with adjoining white backing, forward swept canopy and roof return; red polygonal shrine/curved doorway and adequately supported plinth; metal column capital/tiered parasol (8.88 -> 9.05m model top); Bell geometry above retained platform scaled .75 (6.25 -> 4.975m model top). All are photographic rendering approximations, not newly surveyed dimensions or manual transforms baked into source data.

Palette: three shared families (aged brick, red masonry, carved timber) added by cloning existing materials/maps; restored/general brick, weathered timber, plaster, shutters, grey stone, warm bronze/gold, terracotta and paving adjusted. No new texture allocation. Existing material-foundation parameters/shaders and Khauma geometry remain intact; the factory return type now correctly names its thirteen foundation keys. Original Phase 6C/correction files and override JSON untouched. World Editor remains 34 assemblies / 129 parts with every previous local part source frame preserved; new upper shutter/slat/panel geometry belongs to the pale-arcade part, so it moves together.

The plan's broad ordering/adjacency agrees; exact monument bearings, gate-column gap, Bell footprint/separation, House of Malla binding and eastern Vatsala remain uncertain. These are not marked VERIFIED. Remaining ordinary context elevations are still inferred; the nine inherited detailed context lots listed in Phase 9B are not newly verified by this phase.


## Validation and performance - 14 October 2026

- Lint: PASS; standalone typecheck: PASS; production build: PASS.
- Full suite: 193/193 PASS (187 preserved plus six focused correction tests). Current rendered-layer tests cover entrance/royal gate identity separation, qualitative neighbour ordering, all unchanged assembly/part source frames, palace junction/portal headroom, corrected facade ownership, shared-map palette, exclusions (Nyatapola/public Taleju/Jagannath), Rameshwar, five complete exit traversals, mapped gate-to-central path and both gate crossings/pier collision. Bell colliders have no obsolete high roof; original override JSON unchanged. Material-foundation hash test normalizes only the narrowed type-only return annotation; original parameters/shaders/maps remain guarded.
- Browser: all four new and six required retained review cameras loaded and screenshots visually inspected; no console/page errors. Continuous Khauma-to-central walk through twelve waypoint segments and return flight at 25m PASS. A later small shrine-plinth support adjustment remained clear of the same route in current-scene Rapier tests. No source/player/camera/fly changes.
- Editor browser: RMB navigation, part hit selection, numeric correction, composed collider alignment, mock-only save/reload, isolate/show-all, gizmo drag, undo/redo/reset PASS. One cold editor page load timed out at 30s; retry with a 90s DOM-ready window passed without application errors. Save testing never wrote the user's real override file.
- Production browser: canvas loads, editor absent, GET/POST editor API 404, no errors.

Matched diagnostic camera (-35,18,42), target (-25,3,-12):

| Metric | Phase 9B | Phase 9B.1 |
|---|---:|---:|
| Draw calls | 38 | 48 |
| Submitted triangles | 157848 | 160284 |
| Textures | 9 | 9 |
| Colliders including ground/player | 2298 | 2303 |

Three shared material families account for much of the additional draw work; no extra maps allocated. Triangles increased about 1.5%, colliders by five. Existing merging/instancing retained. Editor assembly view: 228 calls / 142927 triangles / 8 textures versus Phase9B 226 / 140491 / 8. Selected Gate part view: 241 calls versus 233. Counts include shadow work, depend on view, and are not a hardware FPS claim. Ten review views measured 47-51 calls and 159860-167072 submitted triangles, with 8-9 warmed textures.

All existing 10 Phase9B review routes retained. New routes: `9b1-map-west`, `9b1-palace-photo`, `9b1-golden-gate-close`, `9b1-plan-aerial`. URL prefix: `http://localhost:3000/explore?world=bhaktapur&review=`. Map-west is elevated 25m; plan-aerial 75m includes the western entrance and central layout. The original `9b-aerial` stays at 35m. No additional review system.

Remaining limitations: exact dimensions/bearings/distances are not surveyed; pale seven-module census, carvings and sculpture are simplified; bell/column separation still has the original relative uncertainty; comparison camera height/lens differ from the unknown photograph pose; hidden palace courts and unresolved names are not invented. Context remains visibly incomplete. Technical validation does not imply manual visual approval.

MANUAL VISUAL APPROVAL REQUIRED. Stop after the requested commit; no Phase9C and no push. User references remain uncommitted. Commit message: `Phase 9B.1: correct square layout and palace frontage`; exact hash reported after creation.
