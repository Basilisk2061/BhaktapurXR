# Present-day spatial verification — Phase 6B

Status: SPATIAL REVIEW REQUIRED. Evidence checked 2026-10-11; latest inspected dated images are 2021–2024, not a 2026 field survey. No final 3D architecture or gameplay integration. Original Phase 6A dataset, source pixels, Digital Himalaya JPEG, UNESCO traces and calibration remain unchanged.

## Geographic frame and fit decision

Approximate WGS84 origin: 27.672050 N, 85.428560 E (Chyasilin Wikidata P625). X east, Z south. `geographic-frame.ts` uses fixed-origin WGS84 ellipsoid meridional and prime-vertical radii to convert degree offsets to metres. This local equirectangular approximation is suitable for the approximately 200 m site; it ignores altitude/geoid, curvature variation and survey datum ties. Its numerical precision is not positional accuracy. Inverse conversion is provided.

Equal-weight least-squares translation, rigid rotation/translation and uniform similarity are tested using five low-precision object-location candidates. No shear, anisotropic scale, individual GPS snapping or perspective-derived metric corrections. Four controls come from Bhaktapur.com; the fifth is Wikidata imported from Italian Wikivoyage. These are TWO publication lineages, not five independent measurements. Photo/topological evidence is independent of those coordinates but does not establish metre accuracy. A nominal 10 m screening allowance is an analyst assumption, not published uncertainty or a confidence interval.

RIGID is adopted. It preserves the published approximately 190 m constraint and internal plan distances. SIMILARITY remains a review sensitivity option: lowering residuals by increasing length to approximately 219.5 m is insufficient evidence to override archaeological scale. Geospatial class remains LOW_PRECISION even for small residuals. Ordinary coordinates never become VERIFIED. A fitted object's geographicPosition is a DERIVED plan point, not an observed coordinate; its evidence says so explicitly. Anchor observations remain separate.

Absolute documented Vatsala facing 180° / west stair descent 270° stay unchanged. Plan frontage/outline bearings rotate with the common frame; unresolved facing remains null. A plan axis is never silently promoted to an entrance bearing. Malla's north-facing statement is recorded as relationship evidence without inventing an exact measured orientation.

### Fit comparison

| Model | Scale | Rotation | RMS | Mean | Max |
|---|---:|---:|---:|---:|---:|
| TRANSLATION | 1.000000 | 0.0000° | 5.24 m | 4.30 m | 8.63 m |
| RIGID | 1.000000 | -1.3455° | 5.19 m | 4.27 m | 8.49 m |
| SIMILARITY | 1.155059 | -1.3455° | 2.87 m | 2.06 m | 4.53 m |

### Anchor ledger (adopted rigid frame)

| Anchor | WGS84 lat, lon | Role / status | Residual | Fit | Provenance |
|---|---|---|---:|---|---|
| chyasilin-object | 27.67205000, 85.42856000 | OBJECT_LOCATION / LOW_PRECISION | 0.41 m | YES | Wikidata Q82280564 P625: 27°40′19.380″ / 85°25′42.816″; imported from Italian Wikivoyage. Commons/category is same lineage, not independent confirmation |
| vatsala-local | 27.67196000, 85.42839900 | OBJECT_LOCATION / LOW_PRECISION | 6.46 m | YES | Bhaktapur.com monument page explicitly displays location; acquisition method/date/accuracy not published |
| silu-local | 27.67240200, 85.42901700 | OBJECT_LOCATION / LOW_PRECISION | 8.49 m | YES | Bhaktapur.com location and northeast-of-palace text. Restoration narrative stale, so use location only with 2022/current evidence |
| yaksheshwar-local | 27.67176100, 85.42846400 | OBJECT_LOCATION / LOW_PRECISION | 4.20 m | YES | Bhaktapur.com publishes a distinct southern location, not the duplicated Vatsala point |
| malla-local | 27.67201700, 85.42841000 | OBJECT_LOCATION / LOW_PRECISION | 1.80 m | YES | Bhaktapur.com monument-location field; differs from brief inventory-derived candidate |
| siddhi-osm | 27.67210485, 85.42869215 | OBJECT_LOCATION / LOW_PRECISION | 9.32 m | NO | Mean of four distinct vertices, OSM way 211082584 v2; geometry dated April 2023, check_date July 2023, source tag planetware.com. Contributor geometry, not survey |
| siddhi-local | 27.67210000, 85.42810000 | OBJECT_LOCATION / OUTLIER | 65.26 m | NO | Local monument page coordinate is far west of plan/OSM/UNESCO southeast-of-palace relationship |
| siddhi-brief | 27.67201000, 85.42853000 | UNVERIFIED_CANDIDATE / UNRESOLVED | 22.89 m | NO | User brief reports inventory-derived candidate; exact independent listing not recovered. Do not present as sourced survey |
| malla-brief | 27.67208000, 85.42841000 | UNVERIFIED_CANDIDATE / UNRESOLVED | 8.01 m | NO | Inventory-derived candidate supplied in brief; independent exact record not recovered |
| palace-object | 27.67215800, 85.42855700 | OBJECT_LOCATION / LOW_PRECISION | 6.78 m | NO | Commons category labels OBJECT location, linked Wikidata Q13182983. Building-area point is not public-frontage midpoint |
| palace-local | 27.67236400, 85.42828100 | OBJECT_LOCATION / OUTLIER | 41.54 m | NO | Local palace location lies west/north of facade/Commons correspondence; no current measured acquisition provenance |
| chyasilin-camera | 27.67204600, 85.42856700 | CAMERA_LOCATION / CAMERA_POSITION_ONLY | N/A | NO | Shadow Ayush photo 19 September 2018 explicitly CAMERA location / point of view |
| siddhi-camera | 27.67208500, 85.42880200 | CAMERA_LOCATION / CAMERA_POSITION_ONLY | N/A | NO | Janak Bhatta photo 26 September 2022; misleading filename Nyatapola Temple.jpg, description/category Siddhi; explicit CAMERA location |
| palace-photo-point | 27.67194400, 85.42833300 | OBJECT_LOCATION / OUTLIER | 29.95 m | NO | Uzzool 2015 photo labels OBJECT location, but whole-second rounding and incompatible facade location; do not relabel as camera without evidence |
| vatsala-duplicate-report | 27.67196000, 85.42840000 | UNVERIFIED_CANDIDATE / DUPLICATED_SUSPECT | 6.37 m | NO | Reported duplicated inventory coordinate in brief; current listing did not independently expose exact pair |
| yaksheshwar-duplicate-report | 27.67196000, 85.42840000 | UNVERIFIED_CANDIDATE / DUPLICATED_SUSPECT | 19.66 m | NO | Same reported pair as Vatsala despite distinct temples. Retain reported provenance; exclude from fit |


## Reported candidates

The brief supplies Chyasilin 27.67205/85.42857, Vatsala 27.67196/85.42840, Siddhi 27.67201/85.42853, Malla 27.67208/85.42841 and Silu 27.67240/85.42902. Independently recovered records, including small coordinate differences, are preserved verbatim in the ledger. Exact inventory-derived Siddhi/Malla candidates were not independently recovered in the current listing; they remain UNRESOLVED. The reported identical Vatsala/Yak pair is stored as reported, DUPLICATED_SUSPECT, not falsely represented as independently verified published data. The independently inspected local Yak page provides a distinct southern point.

Duplicate detection groups coordinates rounded to six decimal places (approximately decimetre screening here). Camera and unverified-role points cannot become controls. Duplicate object-control coordinates, outliers, unresolved records and unassessed records are excluded even if an eligibility flag is accidentally enabled. Rejected coordinates remain visible for review rather than being deleted. Rejection is manual evidence assessment, not a universal statistical outlier estimator. Camera residuals are N/A because they are not centre observations.

### Conflicting coordinates

- Local Siddhi point is far west, contradicting plan, UNESCO southeast-of-palace text and OSM contributor outline. GEOSPATIAL_OUTLIER (`OUTLIER` status); excluded.
- Local palace point is northwest of the intended facade, while Commons category represents the building area, not its public frontage midpoint. Local point and incompatible 2015 whole-second photo object point are excluded. Commons area point is held out for contextual sanity only; its residual is an area/facade scope comparison, not a measured facade error.
- Siddhi OSM way 211082584 v2: four unique vertices, April 2023 geometry / July check_date, source tag planetware.com. Arithmetic centre 27.67210485/85.42869215 is held out. OSM is contributor mapping, not measured restoration geometry; no OSM dimensions adopted. Attribution: © OpenStreetMap contributors, ODbL, https://www.openstreetmap.org/copyright. Raw polygon is not bundled.
- `Nyatapola_Temple.jpg` has Siddhi description/category but conflicting filename/depicts metadata. Its explicit CAMERA coordinate is stored only as camera evidence and excluded. It cannot introduce Nyatapola into the main square.
- Chyasilin photo explicitly records CAMERA position. Never fit to it despite proximity to the object coordinate.
- Multiple Rajesh Dhungana 2021 photographs share camera GPS 27.671000/85.429800. These are not independent object measurements and are not controls. File names and gallery captions must be cross-checked visually.

## Photographic relationships

Inspected research copies remained in OS temporary storage; no research photograph was added to the repository. URLs, authors and CC BY-SA 4.0 licences are registered in `present-day-sources.ts`. The two central photographs have the same photographer/session but opposite viewpoints; they independently expose occluded relationships, not independent GPS acquisition. No perspective photograph was converted into exact metres.

| Relationship | Finding | Evidence / limit |
|---|---|---|
| Palace–Chyasilin | Pavilion immediately before/south of eastern palace facade; labelled plan octagon corroborated | Two central 2021 views; 2024 close-up confirms pavilion presence only |
| Palace–Vatsala | Stone temple in forecourt southeast of gate | Plan, central views, NHDP south-facing record; stair descent separate |
| Palace–Malla | Column before gate, west of Vatsala | Central views, local north-facing statue description; bearing not surveyed |
| Chyasilin–Vatsala / Malla | Chyasilin northeast of Vatsala, column west/southwest of pavilion | Plan and opposing central views; no octagonal front invented |
| Chyasilin–Yaksheshwar | Pagoda south/southwest of pavilion | Plan, photographs, distinct local coordinate |
| Vatsala–Yaksheshwar | Pagoda south, with open paving between | Photographs and schematic; duplicated listing rejected |
| Siddhi–palace | Southeast of 55-window section, east of pavilion | Plan, UNESCO, held-out OSM context; photographs do not establish metres |
| Siddhi–nearby Vatsala/Annapurna | Nearby structure correspondence remains unresolved | Eastern plan icon, NHDP distinction, local Annapurna text; no forced identity |
| Silu–east end | Major eastern/northeastern platform, restored red shikhara | Plan/local text/geographic consistency and inspected 2022 image; no height adopted |
| Western cluster | Nepalese pagoda and terracotta shrines present | Curated Commons caption plus 2021 photo; Gopinath correspondence provisional, Kedarnath icon unresolved |

### Siddhi architectural records

UNESCO 2022 state-of-conservation report, Project 5 (printed p47), documents recording/reuse of stones and original foundation/plinth retained. Earlier [2017 reporting](https://whc.unesco.org/document/156138) and [2019 reporting](https://whc.unesco.org/document/171737) describe architectural drawings prepared. Those references are research documentation, not downloadable measured-plan permission. Publicly accessible measured footprint/plinth dimensions were not located. Targeted NHDP search and CHIMS access did not expose a reusable dimensioned plan. No restricted drawings packaged; dimensions remain null. OSM roof/temple polygon must not replace original plinth dimensions. A 2019 restoration report uses a contradictory Silu compass direction; present plan/local/location evidence takes precedence over that isolated wording. No footprint relocation justified.

## Open-space corrections

The old green envelope remains PRIMARY_PLAZA, an analyst boundary. It is NOT everything belonging to Durbar Square or every unoccupied/walkable surface. Added categories:

- SECONDARY_PLAZA: approximate southern paving around Yaksheshwar.
- CONNECTING_OPEN_SPACE: approximate connection toward Silu's southern platform edge.
- PALACE_FORECOURT: frontage-adjacent strip overlapping primary plaza.
- MONUMENT_PLATFORM: existing Vatsala, Siddhi and Silu schematic outlines, current extent approximate.
- STREET_CONNECTION: approximate southern corridor indicated by the schematic.

Silu separation is primarily an incomplete open-space interpretation, not evidence of a bad monument anchor. Yaksheshwar similarly belongs to a southern open-space lobe outside the narrow primary strip. Neither monument was dragged into the original envelope. Added polygons are explicitly analyst interpretations, not traced modern paving limits, legal/access boundaries or collision geometry. Categories overlap and contain monument areas: do not sum their areas or call them net walkable area. Existing primary gross ~5,022 m² and partial net ~4,915 m² remain conditional and incomplete.

## Palace public edge

Keep the gallery (~42.80 m) and 55-window (~28.44 m) schematic frontages. Add the ~8.07 m gate interval between their endpoints, documenting continuity rather than a solid wall across the gateway; Golden Gate remains a point with null width/depth. Add a short approximate ~8.19 m visible west return at the 55-window corner. Owner front/oblique/west photographs confirm section order/corner but dates/authors/licences are unknown; central 2021 views independently confirm public context. Return endpoint/current as-built length and unshown palace wings remain uncertain. No palace depth, enclosed interior, unseen edge or window-count-derived length invented. These four segments describe evidenced visible frontage, not a claim to have surveyed every palace edge.

## Western shrines and bells

Gopinath: provisional match of plan-labelled Krishna outline to curated Nepalese-style pagoda group. Store APPROXIMATE binding with PROVISIONALLY_IDENTIFIED note, LOW confidence; not VERIFIED identity/footprint. Chardham inventory supports group membership but does not disambiguate Jagannath by itself.

Kedarnath: terracotta structure identified in curated photographic group; exact generic Shiva plan-icon correspondence remains unresolved/null. Badrinath: original labelled point retained; actual footprint and exact photographed correspondence still uncertain. Rameshwar: original labelled irregular outline retained; no new measured dimensions or entrance assigned.

Large Taleju bell: four-pillar covered support distinct from Vatsala's smaller ornate barking-bell arch, visible in two opposing photographs. Both added as PHOTO_INFERRED approximate review points relative to temple/column/gate, not source-pixel traces or triangulated measurements. No bell footprint, support dimensions or exact orientation assigned. Bell identities supported by local and official documentation; placement uncertainty is several metres. Other minor bell objects remain unassessed and are not invented.

## Presence and accuracy

Every original/new datum and remaining unresolved research item has an explicit presence audit. CONFIRMED_PRESENT means supported by latest inspected dated evidence, not visited in 2026. Frontage limits, gate, Rameshwar and Badrinath remain PRESENT_BUT_LOCATION_UNCERTAIN. Kedarnath/Golden Spout remain location-uncertain; eastern Vatsala IDENTITY_UNCERTAIN. Lamupati and Hari Shankar upper structure are conservatively HISTORICAL_ONLY/excluded pending evidence of current reconstruction. Nyatapola and Taumadhi Bhairavnath remain outside the target.

VERIFIED: no new geometry or ordinary GPS promoted. SOURCE_DERIVED: retained schematic linework/historical dimension claims, not surveyed current metres. PHOTO_INFERRED: bell placements and relative photographic relationships. APPROXIMATE: geographic frame, all metric positions, new open limits, Gopinath correspondence and return segment. UNRESOLVED: dimensions, uncertain entrances, Kedarnath footprint, eastern shrine identity and Golden Spout placement. No PLACEHOLDER architecture added. Source evidence and fitted positions are separate; original Phase 6A values remain available.

## Review route and manual screenshots

Run `npm run dev`, then http://localhost:3000/reconstruction-current (use the actual printed port if occupied). Development-only route and fixed-source image endpoint remain 404 in production. Controls: current reconstruction, source plan/opacity, old UNESCO/old scale comparison, geographic fit comparison, anchors/residuals, relationship lines, open categories, labels, 10 m grid and datum selection. Orange low-precision, green consistent, red outlier, hollow grey camera, magenta duplicate and purple unresolved statuses are distinct; none is a survey label. Ledger lists every candidate and its provenance/use/residual.

Capture these six screenshots at approximately 1600×1000 or larger:

1. Whole map, RIGID adopted, current/labels/grid on, other overlays off.
2. Geospatial anchors on, source plan ~0.25, labels on; include fit summary and full residual ledger (additional scrolling capture if needed). Compare SIMILARITY separately; do not approve that scale solely from low residuals.
3. Open-space categories on, anchors/source/old off; include category legend and Silu/Yak platforms.
4. Relationship lines on, Golden Gate or 55-window frontage selected; include palace segments, Chyasilin, Vatsala, Malla and bells.
5. Silu selected with open categories/source on; show eastern connecting space and selected uncertainty panel.
6. Gopinath selected, source plan on and old/anchors off; show western group and unresolved Kedarnath/Badrinath notes.

Review spatial correspondence, boundaries, identity uncertainty, section order and orientation. Architecture beauty is out of scope. No 3D reconstruction starts before human spatial approval.

## Validation

Lint and typecheck passed; all 66 tests passed (56 retained, 10 new); production build passed. Development headless Chrome rendered 17 review objects, 16 anchors, 14 centre residuals (zero camera residuals), eight categorized open regions and 11 resolved relationship lines. All controls, fit comparisons, source JPEG HTTP 200 and 15 unchanged old comparison outlines passed, with no page/console errors. Screenshots were visually inspected. Production visitor entry, Bhaktapur walking/running/jump/landing/camera and engineering entry/jump passed; no idle React commit loop or page errors. Both review routes and both development image endpoints returned 404 in production. Phase 5B rendering remained 25–29 draw calls / 271,510–272,066 triangles across sampled views; 11 geometries and six textures. Temporary review clone was removed and own servers stopped; user reference collection untouched.

Automated tests cannot establish present-day survey correctness. Known limits: schematic 2006 plan, shared web-coordinate provenance, no contemporary orthophoto/usable raw scan, incomplete public edge/paving limits, photo-estimated bells, several unresolved identities and entrances, no measured current heights/depths, ambiguous plinth datum and no 2026 field inspection. All user reference files remain untouched and untracked. Stop after Phase 6B.
