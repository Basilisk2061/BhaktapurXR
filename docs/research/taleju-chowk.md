# Taleju Chowk / Mul Cok, Bhaktapur royal palace

Research and implementation date: **23 October 2026**. Target appearance: the present/restored palace precinct, using documented surviving forms. This is an evidence-qualified reconstruction, **not a surveyed digital twin or a declaration of visual approval**. No application tests, build, typecheck, server, browser review or gameplay screenshots were run, as requested.

## Identity, terminology and function

Taleju is the royal lineage/tutelary goddess associated with the Malla palace. Her Bhaktapur shrine is integrated into the palace and its inner courts. It is not the large freestanding Taleju pagoda familiar from Kathmandu, nor Nyatapola in Taumadhi Square. Robert I. Levy's *Mesocosm* describes the Golden Gate approach, inner courts and royal ritual role. Gutschow's comparative architectural drawing explicitly identifies **Mul Cok of Bhaktapur** and places Taleju in the central south range at first-floor level. Here “first floor” means the level above the ground storey. [S1, S2]

“Taleju Chowk” is used in the project's schematic map and in broad descriptions of the shrine precinct. The principal Taleju-associated court reconstructed here is **Mul Chowk / Mul Cok / Mu Cuka**. The broader Taleju precinct includes other named spaces. These terms are not grounds for merging Mul, Kumari, Bhairav, Beko, Jamdwar/Yama Dwar or the royal bath into one square. Spelling varies between publications. The festival guide's Jamdwar and the secondary diagram's Yama Dwar probably refer to the small entrance court; that correspondence remains qualified. [S2–S5, S10]

Historically this was a controlled royal and religious precinct, with Taleju central to Malla kingship and Mohani-related ritual. A courtyard simulation does not imply that every modeled threshold is ordinarily open to every visitor. Levy's historical account describes restrictions on non-Hindu entry. Photographs show a guarded inner entrance. Current access policies, festival exceptions and photography permissions were not established from an official current notice; secondary travel accounts contradict one another. The reconstruction therefore exposes architectural exteriors but keeps sacred doors shut. No deity, yantra, sanctum, ritual script, invented inscription or hidden sacred interior is modeled. [S2, S6–S9, S14]

## Historical development and restoration

- The shrine belongs to a layered Malla palace tradition. A single “built in” year for the whole surviving precinct is not justified by the collected evidence.
- Gutschow's 2008 comparative plate attributes the extant courtyard structures in its comparison to the later eighteenth century. This is not a date for the origin of Taleju worship. [S1]
- KVPT's 2008 repoussé report mentions Bhaktapur Ganga/Yamuna sculpture in 1641 as a comparison. Its main doorway restoration is **Patan**, so those sculptures and facade photographs were not copied here. [S13]
- The Department of Archaeology's February 2016 World Heritage update reports Mul Chowk conservation begun in fiscal year 2068/69, including the northern lounge and sandalwood window, and completion of the eastern part north of the main entrance. This establishes restored components, not their surveyed elevations. [S3]
- The adjacent 55 Windows Palace conservation report discusses 1934 earthquake effects, salvaged/shortened gallery timbers, a corrugated-metal roof later replaced with tiles in 1963, office/museum alterations and conservation work. These facts concern the adjacent palace; they were not transferred to Mul as if it were the same building. [S12]
- Sources inspected do not support a complete damage/loss inventory for Mul after 1934 or 2015. A tourism claim that the precinct was “untouched” in 2015 was not adopted. No lost tower or hypothetical pre-earthquake facade was restored into this present-day model.

## Repository and git audit

### What the old object actually was

| Property | Finding |
|---|---|
| Runtime ID | `context:9c:18962138` |
| Generator | `src/game/architecture/square-completion.ts`, `occupiedArchitecture()` |
| Original geometry source | OSM multipolygon relation 18962138, version 1, snapshot timestamp 2025-04-08T17:03Z |
| Origin | `[-32.99125078160133, 0, -52.415108603625974]` |
| Rotation / scale | yaw `0`; scale `[1,1,1]` |
| Outer bounds | X `[-64.34477799, -1.63772357]`; Z `[-71.37541533, -33.45480188]` |
| Outer extent | about `62.707 × 37.921 m`; this is a compound envelope, not one temple |
| Elevation | generic two-storey masonry to `7.15 m`, polygon roof with nominal `1.8 m` rise |
| Inventory before this phase | 1,596 box details, two polygon volumes, polygon roof, 99 colliders |
| Classification | `PLAN_INFERRED`; surrounding metadata sometimes used broader `PHOTO_DERIVED_CONTEXT`, which did not verify its facade |
| Manual changes | Neither supplied transform JSON nor saved scene JSON contained an override/hidden entry for this model; browser-local state was not accessed |
| Heritage interaction | No directly bound Taleju-court entry. Golden Gate/bell records mention Taleju; those records did not depend on a modeled standalone temple |

The source already contained courtyard holes. It would be inaccurate to call the entire object an invented freestanding Taleju temple. Its problem was **coarse compound massing and generic elevations**, with no usable, evidenced entrance sequence or differentiated Mul facades. The local central hole bounds were approximately X `[-44.7118,-23.7865]`, Z `[-63.2417,-44.6581]`, with an irregular west notch; its principal rectangular portion was only about 15.6 m wide, inconsistent with the published 19.55 m court dimension.

Git history traces generic distant palace massing through `31dd7bc` (Phase 9A.1) and `f3e62d3` (Phase 9A.2). `007e393059352779ce28fd74e7ba03d0aed56f8d` introduced the Phase 9C two-storey occupied architecture treatment. Its 7.15 m height and facade rhythm were procedural assumptions, not a measured Taleju elevation. Existing spatial audits correctly left a standalone Taleju temple unrendered and its detailed identity unresolved. Survival across phases did not make those generic elevations verified.

### Narrow replacement, not exterior relocation

The reconstruction is applied after the existing world factories. It cuts only the new court/wing and approach footprints from **two coarse interior-context models**:

1. `context:9c:18962138`: the generic royal compound envelope.
2. `context:9c:1159393576`: a generic rear closure across part of the Golden Gate approach/turn. Origin approximately `[-60.64510124,0,-27.10539860]`; its pre-edit inventory was 179 boxes and 44 colliders.

Only pieces intersecting the new precinct/route masks are removed or clipped. Unaffected occupied ranges and other courtyard holes remain. Source OSM coordinates and Phase 6 data are not edited. Existing parent IDs and original part source frames are retained for the surviving geometry. The replacement does not inherit a placeholder transform. Old colliders are cut with the same footprint union; concave remnants are triangulated into prisms instead of one hull that could bridge a passage.

Frozen public models are not passed to this cutting function. Their audited baseline transforms include:

| Model | X/Z origin | Yaw |
|---|---|---|
| `golden-gate` | `[-16.156550051310745,-16.95862251971981]` | `-0.038935676459550594` |
| `fifty-five-frontage` | `[2.0197052457578195,-14.218166102530466]` | `-0.1096531940152409` |
| `gallery-frontage` | `[-41.491195052570205,-19.02749654092371]` | `-0.08847278820605028` |

These models, other exterior monuments, editor transforms and their source files remain untouched. There is no replacement tower alongside the courtyard.

## Plans and drawings

| Source | Date / author | Scale / orientation | What is usable | Limits |
|---|---|---|---|---|
| S1, comparative page “Nepal – Courtyard Buildings”, PDF p8, **upper right** | Niels Gutschow / KVPT, **December 2008** | Explicit metre dimensions; no north arrow or printed scale ratio on this plate | Bhaktapur court `19.55 × 19.75 m`; outer width `27.30 m`; room ranges, east doorway, north central open area, south central shrine, southwest rectangle | Hosting filename says 2018, title page says 2008. Main report concerns Patan. Upper-left plan is Kathmandu; lower plan is Bhim-muktesvara. They are not Bhaktapur dimensions |
| S10, existing Digital Himalaya schematic | Project attribution 2006 | North-up schematic; no metric calibration | Taleju behind the gallery, Bhairab east, Golden Gate on the south/east approach | Labels/topology, not room dimensions or exact roof plan |
| S5, Taleju complex diagram | Garima Bhandari article, 18 August 2026; underlying drawing unattributed | Unscaled; orientation cross-checked with palace exterior | Yama Dwar, Beko, east Mul entrance, Kumari west, Bhairav southeast, Lun Hiti northeast | Secondary topology corroboration only; colored access categories not treated as current policy |
| S11, existing OSM compound footprint | Snapshot 8 April 2025 | Georeferenced polygon in existing project frame | Occupation envelope and approximate void placement | No elevation, facade, ritual identity or reliable court measurement |
| S12, 55 Windows conservation report | Ram Govinda Shrestha, February 2006 | Adjacent building's drawings and conservation account | Boundary/history cross-check only | Not a measured Mul plan; no adoption of its facade as the court's |

The 19.55/19.75 assignment follows the drawing's horizontal/vertical labels. Cardinal side names use the explicitly identified south shrine plus the entrance/topology sources; they do not come from an invented north arrow. Outer depth `27.50 m` follows the chosen symmetric range depth and remains **APPROXIMATE**, not a fourth published measurement.

## Spatial sequence and relationship to other courts

**Golden Gate → threshold/covered palace entrance → small Jamdwar/Yama Dwar entrance court → right/east connector → elongated Beko Chowk → westward inner doorway through the east range → Mul Cok → closed south shrine exterior.** [S1, S4–S7]

The order has multiple corroborations; exact lengths and alignment within the frozen world do not. The implementation preserves the measured main court and anchors the route to the existing Golden Gate. It is deliberately indirect; the player cannot step through the Golden Gate directly into Mul without intermediate courts.

Local world convention: one unit is one metre, +Y is up, north is approximately −Z in this part of the world. New main-court yaw is `-0.069 rad` (`-3.9534°`). The new court center is `[-33.3,0.08,-53.7]`; its offset from the frozen Golden Gate is `[-17.143449948689255,-36.74137748028019]` in X/Z. These are **APPROXIMATE integration coordinates**, not surveyed geographic positions.

Key route points:

| Point | World X/Z | Meaning |
|---|---|---|
| Golden Gate | `[-16.15655,-16.95862]` | Frozen exterior anchor |
| Entrance court north turn | `[-15.64273,-30.14862]` | Approximate Yam-to-Beko connector start |
| Beko centerline | X `-6.15655` | Clear court width `5.4 m` |
| Mul outer east doorway | `[-19.68248,-52.75890]` | Physical passage through east range |
| Court center | `[-33.3,-53.7]` | Dimensioned court placed in mapped compound void |

The main Beko centerline span is about `22.61 m`; its paving extends another 1.1 m at either end. The east/west connecting strips are about `9.49 m` and `10.78 m` long, `2.20 m` clear. These are model dimensions, not published measurements. The first junction has a real side-wall opening. The covered connector leaves the last 3 m by the carved entrance open as the ramp/apron, following the photographic relationship.

### Naga Pokhari / Lun Hiti

The royal bath is associated with the palace sequence but is **a separate court**, northeast of Mul in the secondary diagram. Local descriptions distinguish Lunhiti/Sundhara from the Dwinmaju pond associated with Kumari. No calibrated bath plan or verified local level/doorway arrangement was found adequate for integration into this frozen scene. It is deferred rather than randomly inserted into Mul's southwest rectangle. The modeled Beko north continuation is visibly closed. Exact bath position, serpent sculpture, basin dimensions, hiti fittings and water level remain unknown for this model. [S4, S5, S9]

## Courtyard plan, dimensions and levels

| Quantity | Model value | Evidence |
|---|---|---|
| Clear main court width | `19.55 m` | **MEASURED**: published S1 dimension, not a new field survey |
| Clear main court depth | `19.75 m` | **MEASURED**: published S1 dimension |
| Outer width | `27.30 m` | **MEASURED**: published S1 dimension |
| Outer depth | `27.50 m` | **APPROXIMATE**, inferred from adopted range depth |
| Typical range depth | `3.875 m` | **PLAN_DERIVED / APPROXIMATE**, `(27.30−19.55)/2`; not all real rooms claimed equal |
| Main paving top | `Y=0.08 m` | **APPROXIMATE** integration level |
| Raised range/gallery floor | `Y=0.50 m` | **PHOTO_INFERRED / APPROXIMATE** |
| Stair rise | Three `0.14 m` risers, `0.42 m` total | **APPROXIMATE**, reconciles court and floor |
| Structural floor band | around `Y=3.34 m` | **APPROXIMATE** |
| Eave / ridge | `6.10 / 7.50 m` | **PHOTO_INFERRED / APPROXIMATE** |
| Roof front / rear projection | `0.65 / 0.50 m` | **APPROXIMATE** |
| Inner entry width / headroom | `1.60 / 2.65 m` above raised floor | **PHOTO_INFERRED / APPROXIMATE** |

Court and approach use the existing brick paving material, not the grey road material. Thin stone edge courses suggest drainage without inventing an underground network. The exact brick bond, drainage falls and paving repairs are not documented. S7 directly confirms Beko brick paving; extrapolation to the whole Mul court is **PHOTO_INFERRED**, not photo-confirmed.

The plan's unlabelled southwest square is represented by a plain `5.0 × 5.0 m` low masonry feature with a `5.14 × 5.14 m` stone cap at `Y=0.42 m`, centered at court-local `[-5.7,5.1]`. Plan presence is supported, but its function and height are **UNKNOWN / APPROXIMATE**. This restrained placeholder must not be described as a verified altar, pond or shrine.

## Individual wings

### North — `taleju:NorthWing`

- Clear court-facing run `19.55 m`, nominal depth `3.875 m`; owns the two north corner rooms, giving overall range width `27.30 m`.
- Origin X/Z `[-32.61917,-63.55150]`, yaw `-0.069`.
- Two architectural levels, raised gallery floor at 0.50 m, eave/ridge 6.10/7.50 m.
- Lower central open loggia about 6 m wide, four slim timber posts and solid back wall; closed rooms flank it.
- A wider compound central upper timber window and four smaller side windows; two closed lower room doors. Three access steps to the loggia.
- DoA confirms northern lounge and sandalwood-window conservation; S1 supports a central open zone. **Neither establishes the exact six-metre opening, post count, carving or upper elevation**. The central window is a restrained compound-frame representation, not a claim to replicate the documented sandalwood carving.
- Confidence: **PLAN_DERIVED / TEXT_CONFIRMED; PROVISIONAL_ELEVATION**.

### South — `taleju:SouthShrineWing`

- Same nominal run/depth and corner ownership as north. Origin `[-33.98083,-43.84850]`, yaw `π−0.069`.
- Shrine exterior remains embedded in a two-level palace range, facing into Mul. No separate multi-tier pagoda.
- Central red panel fields about 12.3 m wide, deep timber/metal framing, closed lattice door `1.35 × 2.35 m`, lobed torana, layered bands, side relief fields and standing-figure silhouettes.
- Central court-facing roof strip `12.9 m` wide is gilded. Side portions and unseen rear slope remain tiled; no evidence was found for gilding the entire south range. The roof is one range roof, not a pagoda stack.
- Eleven ridge pinnacle/crown groups follow the count visible in S8; about 1.02 m spacing, middle crown raised with a triangular support. Model highest point about 9.09 m; exact heights and profiles are approximate.
- The temple's sacred first-floor location is text-confirmed. The visible lower doorway is modeled as a **closed facade threshold**, not an invented access route to the deity. There is no invented internal stair, cella or liturgical furnishing.
- Standing figures are architectural relief suggestions without assigned deity identities. Painted panels and inscriptions remain blank rather than fabricated. Front steps span 3 m.
- Confidence: **PLAN_DERIVED / PHOTO_CONFIRMED** for arrangement; **APPROXIMATE** for dimensions, ornaments and unseen roof portions.

### East — `taleju:EastWing`

- Court-facing run `19.75 m`, depth `3.875 m`; origin `[-23.54826,-53.02606]`, yaw `−π/2−0.069`.
- Two levels, common 6.10/7.50 m roof envelope. Tile range roof with mitered corners.
- A real `1.60 m` opening passes through the full ground-level range, with lintel bottom 2.65 m above the 0.50 m entry floor. Closed rooms remain to either side.
- Court side has a central compound upper window, four narrower windows, two closed room doors and 2 m-wide access steps.
- Beko-facing side has a nested carved timber portal, broad lobed torana, small lateral lattice apertures and a stone ramp. S6/S7 are exterior entrance references, not evidence that all east courtyard windows match their oblique outer facade.
- Ramp extends 3 m east, is 1.85 m wide and rises 0.42 m from paving to threshold. The frame, roof and apron are all owned by **EastWing**, avoiding detached fragments in future visibility grouping.
- Confidence: **PLAN_DERIVED / PHOTO_INFERRED**. Portal vocabulary is photo-confirmed; bay spacing, yaw registration and dimensions approximate.

### West — `taleju:WestWing`

- Court-facing run `19.75 m`, depth `3.875 m`; origin `[-43.05174,-54.37394]`, yaw `π/2−0.069`.
- Two levels with common tiled range roof; closed masonry rooms.
- Three unequal-positioned ground doors, four upper windows of differing widths, one low small aperture. No central open loggia or copied gilded shrine facade.
- S1 supports enclosed room ranges. No side-identified full west elevation was obtained. Openings are restrained architectural placeholders and must not be called recovered historic bays.
- Confidence: **PLAN_DERIVED / PROVISIONAL_ELEVATION**.

## Roof, window and doorway strategy

Four range roofs meet at mitered corners; they do not overlap as four generic hip-roof prefabs. Each has a front slope, ridge, rear slope, dark underside and structural struts. Corner room mass belongs to north/south wings. Roof pitch follows the adopted 1.4 m eave-to-ridge rise across about 2.59 m horizontal run; this is not a surveyed pitch. The south central roof uses a separate surface partition without coplanar overlaps for its gilded treatment.

Shared window helpers provide simple lattice and compound timber frames, but each wing has a different layout and opening hierarchy. Unseen room interiors remain solid. These are material/relief recesses, not claims to reproduce every carved window. The documented outer Mul doorway receives a distinctive lobed torana and nested jambs. The shrine has a separate closed metal/timber lattice door and stronger bands. Door widths were not inflated to several metres for gameplay.

## Materials and surface limits

No new material family, texture download, dependency or global lighting change was introduced. New geometry uses the existing `agedBrick`, `redMasonry`, `carvedTimber`, `timber`, `roof`, `paving`, `stone`, `recess`, `gold` and `bronze` palette. Thus existing weathering, HIGH PBR/HDR and low-quality material substitutions continue to apply.

Roof custom surfaces supply metre-related UVs through an optional extension to the existing sculpted-surface helper. Existing museum sculptures do not supply that field and retain their previous UV behavior. The helper extension does not alter museum geometry/materials. Fine epigraphic carving, painted sacred images, unique floral designs and metal weathering patterns are not reproduced from photographs as textures.

## Collision and closed boundaries

- New masonry, gallery plinths, loggia posts, floors and solid steps receive static colliders following visible geometry.
- The east passage is structurally split; no full ground-level block/collider crosses it.
- East ramp mesh and convex hull use the same wedge vertices and 0.42 m rise.
- First connector's south wall leaves its entrance junction open. The east connector is covered only beyond the open ramp/apron.
- The sacred south doorway, ordinary room doors and Beko north continuation are visibly closed and solid. They are not invisible barriers into apparently open modeled rooms.
- Interior-source clipping removes/replaces matching old colliders rather than leaving a second invisible closure. Concave residual collision polygons are triangulated, preserving holes.
- Existing Golden Gate aperture, threshold, player controller, autostep/grounding and all exterior collisions are unchanged.
- Traversal is **not runtime-verified**. Manual checking is required, especially the oblique east threshold, covered connector headroom, loggia steps and old/new interior joins.

## Performance and future sector ownership

There are **13 new complete owners**: Courtyard; NorthWing; SouthShrineWing; WestWing; EastWing (including its portal and ramp); GoldenGateInteriorTransition; YamWestRange; YamEastRange; BekoChowk; BekoEastRange; BekoWestRange; BekoNorthBoundary; Passageways. They are grouped under `TalejuPrecinct` in the scene and are individually selectable in World Editor.

The new `WHOLE_ASSEMBLY` ownership hint routes them through the existing per-assembly renderer even when not edited. Boxes share the existing unit box geometry and are instanced by material **within an owner**; profiles/shapes/roofs merge by material **within that same owner**. No new courtyard piece joins the world-wide material batches. No React component is created per timber bar or ornament. The eleven pinnacles use modest 12-segment revolved profiles; reliefs use simple extrusions. This preserves building ownership at the cost of more batches than one global material merge.

No sector activation, distance mounting, world streaming or new visibility controller is introduced. All quality presets retain their existing behavior: VERY LOW simplification, LOW/MEDIUM budgets and HIGH HDR/PBR. Commits `51ad5c3` and `68230c1` are not undone. No NPC scheduling/throttling or character assets change. Draw calls, triangle totals, frame rate and memory were **not measured**; no performance equivalence claim is made without manual testing. Existing coarse facade pieces are removed inside the replacement zone, partially offsetting added detail, but no unexecuted count is presented as a measured saving.

World Editor uses the same world-data factory as runtime. New assemblies receive stable IDs and existing part partitioning. Saved transforms, hidden objects, manual JSON and editor functionality are not rewritten. Surviving old pieces keep their prior part frames. Future safe sector work can operate on complete owners, but must handle shared door/route dependencies and remaining old compound context; this phase does not implement such a system.

## Evidence table

| Feature | Sources | Evidence type | Confidence / limit | Implementation |
|---|---|---|---|---|
| Palace-integrated Taleju identity | S1, S2 | VERIFIED / TEXT_CONFIRMED | High for identity, not a coordinate survey | Court + south range shrine, no public tower |
| Main court size and outer width | S1 | MEASURED | High as published dimensions; drawing age acknowledged | 19.55 × 19.75; outer width 27.30 |
| World placement and yaw | S1, S5, S10, S11 | PLAN_DERIVED / APPROXIMATE | Moderate; old void and measured plan conflict | Golden Gate-relative correction layer |
| Indirect approach sequence | S1, S4–S7 | PLAN_DERIVED / TEXT_CONFIRMED | Moderate/high for order, lower for lengths | Entry court → Beko → east doorway |
| North loggia/window presence | S1, S3 | TEXT_CONFIRMED / PLAN_DERIVED | High for restoration mention; low for exact elevation | Provisional lounge and compound window |
| South shrine facade/roof | S1, S8 | PHOTO_CONFIRMED | High for visible arrangement; approximate scale | Closed red/gold facade, 11 roof crowns |
| East outer portal and apron | S6, S7 | PHOTO_CONFIRMED / PHOTO_INFERRED | High for vocabulary, approximate dimensions | Torana, jamb depth, ramp, lateral slots |
| East inner facade | S1, S7 | PLAN_DERIVED / PROVISIONAL | No full side elevation | Differentiated closed-room rhythm |
| West facade | S1 | PROVISIONAL | No complete side-identified photograph | Restrained unequal doors/windows |
| Range heights, pitch, overhang | S7, S8 | PHOTO_INFERRED / APPROXIMATE | No measured section | 6.10 m eave / 7.50 m ridge |
| Paving, edge courses, levels | S1, S7 | PHOTO_INFERRED / APPROXIMATE | Beko paving visible; Mul exact bond/drainage unknown | Brick floor, thin stone edges, raised galleries |
| Southwest plan square | S1 | PLAN_DERIVED / PROVISIONAL | Position/footprint inferred, identity unknown | Low unlabelled platform, no water |
| Separate royal bath court | S4, S5, S9 | TEXT_CONFIRMED | Qualitative relationship, uncalibrated footprint | Deferred behind visible closed boundary |
| Hidden sacred rooms/deity | S2, S14 | UNKNOWN / NOT MODELED | No legitimate detailed visual basis | Opaque closed sacred boundary |

No feature is classified HISTORIC_PHOTO merely because a report is old. The direct photographs used are dated 2013 and 2017; exact current condition can differ. VERIFIED does not apply to approximate context, wing heights or placement.

## Conflicts and decisions

1. **FROZEN_CONTEXT_CONFLICT:** old main OSM void is too narrow/irregular for S1's dimensioned court. Published dimensions win for the replacement architecture. Raw source traces remain unchanged; only the two coarse runtime context models are trimmed.
2. **Frozen exterior registration:** the precinct diagram is schematic and cannot georeference the measured court exactly behind the existing facade. Exterior origins/yaws are fixed. New connecting ranges/lengths are approximate, not evidence that the existing frontage is historically surveyed.
3. **Different cities:** Patan's Mul Cok and Sundari Cok dominate several search results and conservation PDFs. Their measured plans, golden door sculptural panels, shrines and restoration photos were rejected as Bhaktapur templates. The Kathmandu plan on S1 p8 is likewise excluded.
4. **Date metadata:** S1's URL says 2018; the actual title page says December 2008. Dossier/source registry use 2008 and preserve the original URL.
5. **Terminology/access:** broad “Taleju temple” captions can label an entrance, shrine facade or whole precinct. Blogs disagree over visitor restrictions and construction dates. Use academic identity, plan topology and directly observed architecture; do not claim an official current public access policy.
6. **First-floor sacred location vs visible lower facade door:** S1 locates the deity above ground level. A visible door is not proof of a ground-level sanctum. No internal sacred arrangement is inferred from it.
7. **Photographic coverage:** S8 shows the south shrine closely, not the entire court. Its ornament and gilding are not copied onto the other wings. North/window likeness and west elevation remain provisional.
8. **Unlabelled southwest feature:** cannot responsibly identify it as Naga Pokhari, altar or sacred enclosure. Its low platform height is an explicit rendering assumption, subject to correction.

## Source archive

All online sources accessed **2026-10-23**. Research images/PDFs are temporary references under `tmp/pdfs/taleju/`, outside `public/`; **none are staged or shipped**. No photograph is converted into an in-game texture. The source registry is also recorded in `src/data/reconstruction/taleju-evidence.ts`.

| Ref | Title, author / organization, date | URL / local reference | Supports / status |
|---|---|---|---|
| S1 | *The Patan Royal Palace Project: Restoration of Sundari Cok*, Niels Gutschow / KVPT, December 2008 | [PDF](https://danam.cats.uni-heidelberg.de/files/danam-cms/Gutschow_2018-The_Patan_Royal_Palace_Project_Restoration_of_Sundari_Cok.pdf) | Title page and comparative Bhaktapur plan p8 directly inspected; most other plates concern Patan |
| S2 | *Mesocosm*, Robert I. Levy, UC Press, 1990, chapter 8 Taleju section | [UC Press text](https://pub-ucpec2-prd.cdlib.org/ucpressebooks/view?anchor.id=0&brand=ucpress&chunk.id=d0e7982&doc.view=content&docId=ft6k4007rd&toc.depth=100) | Royal lineage goddess, inner courts, Golden Gate, historical restrictions |
| S3 | Kathmandu Valley updated report, Government of Nepal / Department of Archaeology, 1 February 2016 | [UNESCO-hosted report](https://whc.unesco.org/document/139969) | Bhaktapur section 3.1, Mul renovation; preceding Patan photographs excluded |
| S4 | *A Users' Guide to Bhaktapur (Khwopa)*, Bhaktapur Festival 2024 | [Guide PDF](https://infobhaktapur.com/wp-content/uploads/2024/12/walking-tour-final-_compressed.pdf) | Printed p5 indexed text; direct download restricted. Sequence corroboration only, not an inspected measured plan |
| S5 | *Bhaktapur Durbar Square*, Garima Bhandari / Altitude Himalaya, 18 August 2026 | [Article](https://www.altitudehimalaya.com/blog/bhaktapur-durbar-square), [diagram](https://cms.altitudehimalaya.com/media/Blog/Travel-Guides/bhaktapur-durbar-square/taleju-complex-map.png) | Diagram directly inspected. Secondary/unattributed underlying drawing, unscaled; no authoritative access or historical dating claim |
| S6 | *Bhaktapur Taleju Temple.JPG*, Deepayan Sarkar, 16 September 2013 | [Commons](https://commons.wikimedia.org/wiki/File:Bhaktapur_Taleju_Temple.JPG) | Beko-facing timber portal/torana, aperture, struts; CC BY-SA 3.0; research only |
| S7 | *Taleju temple bhaktapur gp.JPG*, **Ganesh Paudel**, 14 September 2013 | [Commons](https://commons.wikimedia.org/wiki/File:Taleju_temple_bhaktapur_gp.JPG) | Beko oblique view, lower/upper openings, brick paving, raised apron/ramp, tiled roofs; CC BY-SA 3.0; research only |
| S8 | *Rarest Pictures of inside Taleju Bhawani temple Bhaktapur.jpg*, Prakat Shrestha, 13 March 2017 | [Commons](https://commons.wikimedia.org/wiki/File:Rarest_Pictures_of_inside_Taleju_Bhawani_temple_Bhaktapur.jpg) | South red/gold shrine exterior, closed door, bands, standing figures, 11 pinnacles; CC BY-SA 4.0; research only |
| S9 | *Bhaktapur Durbar Square: One Open Museum of Nepal*, Prasant Prajapati / Bhaktapur.com, undated | [Article](https://www.bhaktapur.com/discover/bhaktapur-durbar-square-an-open-museum/) | Separate courts and Lunhiti; secondary corroboration, not coordinates |
| S10 | Bhaktapur Durbar Square map, existing Digital Himalaya project reference, attribution 2006 | `reference/bhaktapur/digital-himalaya/map.jpg`; [online copy](https://commons.wikimedia.org/wiki/File:Map_of_Bhaktapur_Durbar_Square.jpg) | Directly inspected schematic; palace/court labels and north-up topology |
| S11 | Royal palace relation 18962138, OSM contributors, project snapshot 8 April 2025 | [OSM relation](https://www.openstreetmap.org/relation/18962138); `src/data/reconstruction/urban-footprints.json` | Existing footprint/void source, not architectural elevation evidence |
| S12 | *Final report on conservation of 55 Windows Palace*, Ar. Ram Govinda Shrestha, Bhaktapur Heritage Section / Lund / SIDA, February 2006 | `reference/landmarks/55-window-palace/documents/documents/documents/conservation-final-report-2006.pdf` | Existing local report, adjacent palace alteration/restoration history; not Mul survey |
| S13 | *Restoration of the Mul Cok Golden Doorway Sculptural Ensemble*, KVPT, 2008 | [PDF](https://danam.cats.uni-heidelberg.de/files/danam-cms/2008.10.02_Mulcok_repousse-US_letter_size.pdf) | Main subject Patan; only comparative Bhaktapur chronology considered |
| S14 | *Preliminary Investigation into the Religious Profile of King Jitāmitramalla of Bhaktapur Through his Compositional and Scribal Works*, *Journal of Hindu Studies*, 2024 | [Oxford Academic](https://academic.oup.com/jhs/article/17/2/200/7637469) | Religious context and restricted knowledge; no inference of hidden deity appearance |
| S15 | NewahVeda photo repost, 7 December 2024 post; capture date / original creator unknown | [Post](https://x.com/NewahVeda/status/1865353754863682040) | Two south-facade/roof views inspected only as supplemental corroboration. Unestablished rights/provenance; not independent dating, not shipped, not the primary basis |

Additional UNESCO document [135017](https://whc.unesco.org/document/135017) was inspected during the search but its useful Mul restoration imagery concerned Patan and was excluded. Generic travel pages with conflicting restrictions, early construction dates, a supposed 1754 origin or unqualified 2015 survival were not used as primary evidence. No AI image, Pinterest image or generated architectural reference was used.

## Deferred work and manual review

Unknown/unmodeled: sacred interiors and internal access, exact western/northern elevation, faithful sandalwood carving, complete gallery construction, unseen roof materials, ritual icons, epigraphy, full drainage, the southwest feature's function, bath geometry, other palace courts, complete post-earthquake chronology. The modeled approach dimensions and court registration need manual comparison against future measured palace documentation.

Open `/explore?world=bhaktapur`; use existing fly mode or World Editor navigation. No new review system or camera behavior was added. The points below are **camera/eye coordinates**, not player collider spawn feet. Look-at targets specify orientation. These are also described by `talejuReviewPoints()` for reference; that helper does not automatically move the game camera.

| # | View | Eye `[X,Y,Z]` | Look-at `[X,Y,Z]` |
|---|---|---|---|
| 1 | Golden Gate exterior approach | `[-16.157,1.8,-9.959]` | `[-16.157,2.0,-16.959]` |
| 2 | Immediately inside Golden Gate, toward the turn | `[-16.157,1.8,-21.959]` | `[-6.157,2.0,-30.149]` |
| 3 | Courtyard center, south shrine | `[-33.300,1.8,-53.700]` | `[-33.981,2.8,-43.848]` |
| 4 | North range | `[-33.507,1.8,-50.707]` | `[-32.619,2.8,-63.552]` |
| 5 | South shrine / whole front | `[-33.024,1.8,-57.690]` | `[-33.981,2.8,-43.848]` |
| 6 | East range / court-side entrance | `[-37.290,1.8,-53.976]` | `[-23.548,2.8,-53.026]` |
| 7 | West range | `[-29.310,1.8,-53.424]` | `[-43.052,2.8,-54.374]` |
| 8 | Closed sacred exterior threshold | `[-33.679,1.8,-48.213]` | `[-33.981,2.8,-43.848]` |

Manual inspection should check the complete route in order, threshold clearance, ramp/steps, absence of old invisible closures, roof corners, distinct four facades, sacred closure, World Editor selection/overrides and all graphics modes. **Visual match and gameplay traversal remain unapproved until that inspection.**
