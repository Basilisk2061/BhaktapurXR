# Spatial re-audit: Phase 9A.2

Status: **completed working audit; approximate reconstruction; MANUAL VISUAL APPROVAL REQUIRED**. Baseline 31dd7bcdad4e3720eeebf9d0ed50b985f108bce5. No global scale/origin/rotation change. Original Phase 6C/source geometry stays byte-equivalent; explicit render-placement corrections are separate. A freeze protected against casual adjustment, not stronger contradictory evidence. Nothing inferred here is VERIFIED.

## KHAUMA_GATE_VIEW_AXIS

Baseline centre (-123.447, -20.895), yaw -0.0235; opening axis approximately 181.35 degrees. Tagged contributor gate centre WGS84 27.6723594, 85.4273281, local (-121.537, -34.286); 13.53 m north/east. Inward mapped segment bearing 97.93 degrees, working wall yaw -1.7092. **FROZEN_CONFLICT corrected, SOURCE_DERIVED / RECONSTRUCTED_APPROXIMATE**. This is a working azimuth inferred from connected street topology and cross-checked aerial/photo composition, not a surveyed gate normal.

Both user PNGs were inspected: through view frames a pale central shikhara consistent with Vatsala, western pagoda eaves and low brick/timber edges; other view frames urban frontage. Exact capture direction is assessed from visible architecture, not inferred from filename. No EXIF GPS/heading/date; no coordinates or distances extracted from these images. They remain local research references, ignored by Git; licence/author unestablished. The 2018 Commons GPS remains CAMERA_LOCATION, never gate centre. Companions are same-session evidence, not independent metric controls.

Independent mapping: OSM node 990795854 (city_gate / White Gate), Khauma road 179097847, public pedestrian path 85465819, Digital Himalaya plan, UNESCO zone map and multiple gate photos. Esri World Imagery zoom17-19 tiles were inspected with source/control overlays in temporary browser output. Credit: Esri, Vantor, Earthstar Geographics and GIS User Community. Capture epoch unresolved; visible post-quake/restoration state makes it unsuitable as present-day architectural form evidence. Used for persistent foundations/building lines/topology only, not survey positions or current roof appearance. No satellite pixels redistributed.

The old gate point was an untraced Phase 9 map interpretation beside the House of Malla label. Its old north/south opening and northwest duplicate pagoda obscured the real eastward entrance. No evidence supports rotating or reflecting the entire world. The through-gate review looks toward the independently positioned Vatsala ensemble at a modest oblique angle to the approximate gate normal; camera framing changes do not move monuments.

## All 17 monument records

Coordinates are local metres, yaw radians in the renderer, not measured compass bearings. Polygon centres are explicitly adopted *approximate extent centres*, not point observations of sancta. Palace controls use actual public-facing edge at retained X, not whole-wing centroid. Keep provisional identities provisional.

| Monument / entity | Protected baseline X,Z | Rendered X,Z | Yaw baseline -> rendered | Finding / confidence |
|---|---|---|---|---|
| Khauma Gate / khauma-gate | -123.447, -20.895 | -121.537, -34.286 | -0.0235 -> -1.7092 | FROZEN_CONFLICT corrected / APPROXIMATE / MEDIUM |
| Rameshwar / rameshwar | -108.791, -15.827 | -108.553, -23.326 | 0.0000 -> 0.0000 | FROZEN_CONFLICT corrected / APPROXIMATE / LOW |
| Badrinath / badrinath | -108.148, -1.871 | -116.249, -8.810 | 1.5708 -> 1.5708 | FROZEN_CONFLICT corrected / APPROXIMATE / LOW |
| Kedarnath / kedarnath | -68.665, 7.270 | -73.086, 1.230 | 1.5708 -> 1.5708 | FROZEN_CONFLICT corrected / APPROXIMATE / LOW |
| Gopinath / Dwarika / gopinath-krishna | -94.703, -5.460 | -97.272, -14.605 | 1.4928 -> 1.4928 | FROZEN_CONFLICT corrected / APPROXIMATE / LOW |
| Jagannath / jagannath | -132.666, -38.299 | not rendered; unresolved | current orientation unresolved | REJECTED_DUPLICATE / LOW |
| Silu Mahadev / Phasi Dega / silu-mahadev | 39.007, -33.080 | 36.381, -39.589 | -1.4968 -> -1.4968 | FROZEN_CONFLICT corrected / APPROXIMATE / MEDIUM |
| Siddhi Lakshmi / siddhi-lakshmi | 19.596, 0.540 | 13.038, -6.078 | -0.1350 -> -0.1350 | FROZEN_CONFLICT corrected / APPROXIMATE / MEDIUM |
| Yaksheshwar / Pashupatinath / yaksheshwar | -8.077, 28.062 | -11.928, 19.708 | -0.1380 -> -0.1380 | FROZEN_CONFLICT corrected / APPROXIMATE / LOW |
| Chyasilin Mandap / chyasilin | 0.386, -0.141 | -4.945, -5.025 | 0.0000 -> 0.0000 | FROZEN_CONFLICT corrected / APPROXIMATE / MEDIUM |
| Vatsala Durga / vatsala-durga | -10.013, 7.277 | -10.013, 7.277 | 0.0000 -> 0.0000 | QUALITATIVE_ONLY / MEDIUM |
| Malla column / malla-column | -16.370, 4.532 | -16.370, 4.532 | 0.0000 -> 0.0000 | QUALITATIVE_ONLY / MEDIUM |
| Large / Taleju bell / large-bell | -14.082, 5.485 | -14.082, 5.485 | 0.0000 -> 0.0000 | QUALITATIVE_ONLY / LOW |
| Vatsala bell / vatsala-bell | -13.994, 9.259 | -13.994, 9.259 | 0.0000 -> 0.0000 | QUALITATIVE_ONLY / LOW |
| Royal Palace / 55 Window Palace public frontage / fifty-five-frontage | 2.020, -5.592 | 2.020, -14.218 | -0.1097 -> -0.1097 | FROZEN_CONFLICT corrected / APPROXIMATE / LOW |
| Golden Gate / golden-gate | -16.157, -7.808 | -16.157, -16.959 | -0.0389 -> -0.0389 | FROZEN_CONFLICT corrected / APPROXIMATE / MEDIUM |
| Art Gallery / gallery-frontage | -41.491, -9.353 | -41.491, -19.027 | -0.0885 -> -0.0885 | FROZEN_CONFLICT corrected / APPROXIMATE / LOW |

An additional empty gate-frontage interval follows its two corrected palace edges; all 13 corrections are enumerated in the [machine-readable ledger](../src/data/reconstruction/khauma-spatial-audit.ts). Existing dimensions, geometry, floor counts and non-gate facade orientations were preserved. Original sources/controls are not rewritten. Effective world positions differ from the previously frozen nominal positions by an explicit auditable layer. Architectural entrance bearings remain approximate; no automatic global fit or metric extraction from photo perspective.

### Why changes were justified before reconstruction

- rameshwar: Named mapped polygon cross-checked against unique plan/group shape, aerial building position and photographic neighbouring order; no per-image metric extraction. Source: 211080701.
- badrinath: Named mapped polygon cross-checked against unique plan/group shape, aerial building position and photographic neighbouring order; no per-image metric extraction. Source: 211080702.
- kedarnath: Named mapped polygon cross-checked against unique plan/group shape, aerial building position and photographic neighbouring order; no per-image metric extraction. Source: 211080703.
- gopinath-krishna: Named mapped polygon cross-checked against unique plan/group shape, aerial building position and photographic neighbouring order; no per-image metric extraction. Source: 197122572.
- chyasilin: Mapped octagon and aerial pavilion roof agree; original Wikidata/Wikivoyage point was low precision, not a measured footprint. Source: 495632745.
- siddhi-lakshmi: Distinct stone foundation polygon/aerial position and UNESCO original-plinth retention outweigh schematic centre; old centre intrudes into neighbouring wing/path. Source: 211082584.
- silu-mahadev: Named mapped polygon cross-checked against unique plan/group shape, aerial building position and photographic neighbouring order; no per-image metric extraction. Source: 185750794.
- yaksheshwar: Distinct southern two-roof shape cross-bound to mapped outline by plan/aerial and opposing photos; web POI conflicts. Preserve complete assembly, only source-supported registration changes. Source: 1159652820.
- gallery-frontage: Compare public facade to south-facing mapped wing edge at same X, not whole-wing centroid; aerial frontage and street clearance corroborate northward correction. Source: 1159393576-public-south-edge.
- fifty-five-frontage: Scope-matched public edge and aerial facade; old shallow facade lies in mapped public pedestrian approach. Preserve facade dimensions/X/orientation. Source: 1159393576-public-south-edge.
- golden-gate: Retain portal between corrected gallery and palace frontage; translate by average adjacent edge correction, not photo pixels or a generic palace POI. Source: palace-public-edge-interval.
- gate-frontage: Associated public-edge interval follows explicitly corrected neighbouring facades. Source: palace-public-edge-interval.
- khauma-gate: Tagged gate junction, connected approach/path, aerial building lines and supplied through-gate composition contradict old nominal point and north-south axis. Source: 990795854 / 85465819.

Cross-evidence includes the actual octagonal pavilion, maintained original Siddhi foundation (UNESCO), restored Silu platform, separate south-facing two-roof Yaksheshwar, named western group footprints and independent photo ordering. Old low-precision Wikidata/local POIs/schematic icons do not trump these extents; contributor outlines themselves are still not survey verification. Aerial orthorectification/parallax and source epoch remain limitations. Bell/column locations are too uncertain to rebind and stay at their baseline points. Vatsala's nominal point agrees with the visible plinth substantially better and stays unchanged. Exact named-building GPS acquisition provenance remains unresolved.

## Visitor sequence / identity

Khauma street from west/northwest -> gate toward east/southeast -> western shrine apron, with four-pillar Rameshwar and the Gopinath/Dwarika pagoda -> Kedarnath/inn transition -> Art Gallery and palace/Golden Gate -> central Malla column, distinct bells, Vatsala and Chyasilin -> eastern Siddhi/Silu zone; Yaksheshwar lies on the southern side. The route bends: not every landmark is visible simultaneously through the arch. Northern built edge is generally left and southern shrine edge right when entering. Immediate named flank identity and exact photo-camera pose remain approximate.

The 2026 photo captioned Jagannath duplicates Gopinath's portal/plinth/Garuda and roof details, with the gate behind it. The previous inference that it was a separate northwest/exterior pagoda was wrong. Local accounts distinguish the ordinary Jagannath shrine; its exact modern footprint/form is not independently established. **Unsupported jagannath model suppressed; no replacement invented. Gopinath/Dwarika preserved and still provisionally bound.**

Tallest model is **silu-mahadev / Silu Mahadev (Phasi Dega)**, a 26 m rendering-assumption brick shikhara, placed on the cross-checked northeastern platform. Other >=10 m models: Vatsala 15.95, Kedarnath 15.25, Siddhi 13.8, Yaksheshwar 12.3, Badrinath 12.2, Gopinath 11.6 and palace facade 10.3 m. None is a five-roof Nyatapola. Siddhi's five stone terraces are not five pagoda storeys.

**Nyatapola is absent from the rendered Durbar scene**. Raw OSM way 85470341 is in Taumadhi and excluded as a temple, not turned into ordinary context. Misnamed Nyatapola source photograph from the old ledger depicts Siddhi, not a Nyatapola model. Taleju: Golden Gate and large/Taleju bell represented; distant relation18962138 court-ring context retains holes. The source wing1159393576 supports corrected public-edge placement, not a new exposed Taleju volume. No exposed five-storey Taleju or sanctum is instantiated.

## Sources

- gateNode: https://www.openstreetmap.org/node/990795854
- gateRoad: https://www.openstreetmap.org/way/179097847
- squarePath: https://www.openstreetmap.org/way/85465819
- plan: https://commons.wikimedia.org/wiki/File:Map_of_Bhaktapur_Durbar_Square.jpg
- zone: https://whc.unesco.org/en/documents/103370/
- gatePhoto: https://commons.wikimedia.org/wiki/File:Old_Town_Entrance_Gate,_Bhaktapur_Durbar_Square.jpg
- gateOther: https://commons.wikimedia.org/wiki/File:Old_Town_Entrance_Gate,_Bhaktapur_Durbar_Square1.jpg
- gateWestern: https://commons.wikimedia.org/wiki/File:Western_gateway_to_the_Bhaktpur_Durbar_Square.jpg
- conservation: https://www.nara.accu.or.jp/img/dissemination/29th.pdf
- visitorSequence: https://www.bhaktapur.com/discover/bhaktapur-durbar-square-an-open-museum/
- ntb: https://trade.ntb.gov.np/wp-content/uploads/2023/04/world-heritage-sites-booklet.pdf
- aerial: https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer
- gopinathIdentity: https://www.bhaktapur.com/discover/radhakrishna-temple/
- jagannathIdentity: https://www.bhaktapur.com/discover/jagannath-temple/

Also reused existing urbanOccupancySources, architecture/forecourt identity ledgers, municipal ward3 inventory, UNESCO 2018 printed pp21-25 and current Commons December2024 / February2026 photographs. Photographic sources establish contemporary form, not metres. Historical aerial forms are excluded from rebuilt architecture.

## Validation

Original model/source hashes remain regression-tested. 131 relevant tests, lint, typecheck and production build pass. Rapier traverses all five full exits, the gate opening and all mapped public gate-to-central path segments; piers block. Browser movement/exit/gate checks pass with no console/page errors. Review routes expose the entrance, edges and 34 m aerial view; final human approval remains required.
