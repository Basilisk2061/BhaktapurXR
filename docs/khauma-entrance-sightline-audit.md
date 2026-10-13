# Khauma entrance sightline audit - Phase 9A.4

Pre-edit audit of clean base `994692fbc4c25b5d948828993a60cbb686508c42`. Gate is manually approved and frozen. No geometry changed before this inventory was recorded. Primary audit: first 40-60m inward; distant forecourt entries record visibility only.

## Exact problem identification

- Three.js ray intersection in the retained outside camera at NDC (0.07,-0.23) hits **gallery-frontage / palace-masonry**, world (-62.618,4.530,-23.045), ~79.02m from the camera / ~60m inward from gate. At (0.07,-0.16) the same bare end wall is hit. This is the west end of the existing museum, not generic OSM massing.
- Ray at (0.62,-0.11) hits **entrance:khauma-masonry-return / photo-pale-upper-return-face**, world (-121.431,3.258,-27.401). It is the Phase 9A.3 isolated pale panel, not a documented sign.
- Secondary left blocker: **edge:palace-west-approach-low-wing:1159393573**; a source lot was prematurely given a one-floor hipped building on regional evidence. Identity and elevation remain unresolved.

## Object-by-object baseline inventory

Positions are local X,Z metres, rounded here; exact coordinates/yaws, source lists and baseline ray-sampling results are in `src/data/reconstruction/khauma-sightline.ts`. Counts indicate modeled visibility across the two photo poses; they do not prove recognition in a photograph. Include occluded western and protected central entities to expose the full sequence.

| Internal ID / part | Claimed identity | Baseline X,Z | Identity / position evidence | Supplied through-photo assessment | Confidence | Decision |
|---|---|---|---|---|---|---|
| khauma-gate | Khauma Gate | -121.537, -34.286 | Manually approved Phase 9A.3 gate; Retained corrected node 990795854 / road topology | Foreground arch; approved frozen architecture | RECONSTRUCTED_APPROXIMATE | KEEP |
| gallery-frontage | National Art Gallery / western palace wing | -41.491, -19.027 | UNESCO 2018 p21 / 2022 p48 identify western palace museum; 2014 photograph shows western return openings and bands; Named regional correspondence, contributor wing 1159393576 supports occupancy; working end at (-62.62,-23.04) | Left-hand palace corner is a candidate; supplied outside background has timber openings, not a featureless wall | PHOTO_INFERRED | CORRECT |
| entrance:khauma-masonry-return/photo-pale-upper-return-face | Unsupported isolated pale panel | -121.450, -27.004 | No sign/structure identity established; supplied plastered wall is not evidence for this isolated rectangle; Phase 9A.3 gate-relative inferred placement, no traced footprint | White upper wall exists in photo but this floating rectangular proxy is not supported | UNRESOLVED | REMOVE |
| entrance:khauma-masonry-return/photo-adjoining-masonry-return | Unsupported tall masonry return | -121.193, -26.969 | Anonymous return assumed from image crop; Unsourced 4.1m body at gate-relative offset; no lot/elevation match | No distinct tall standalone body proven at this offset | UNRESOLVED | REMOVE |
| entrance:khauma-masonry-return/photo-inside-brick-sitting-wall | Low gate-side sitting wall | -121.916, -27.069 | Photographed low masonry edge, identity unknown; Gate-relative short extent remains approximate | Low brick edge immediately right of arch supported | PHOTO_INFERRED | KEEP |
| edge:palace-west-approach-low-wing:1159393573 | Unresolved footprint; former Police-side low wing | -76.134, -31.205 | Plan Police icon identifies area, not this lot or its roof/storeys; OSM footprint 1159393573 retained as evidence; inside approach at ~45m | No independent per-lot match to the guessed single-floor hipped building | UNRESOLVED | REMOVE |
| edge:khauma-north-flank:1158762014 | Anonymous low gate flank | -115.405, -41.605 | Supplied outside and reverse gate photograph show low brick/timber/tile edge; Contributor outline 1158762014; approximate regional photo correspondence | Low flank / eaves at image edge; exact rear elevation unresolved | PHOTO_INFERRED | KEEP |
| edge:khauma-south-flank:1159661606 | Anonymous outer approach flank | -132.833, -20.600 | Photographic low approach edge; no shop or heritage identity assigned; Contributor outline 1159661606; correspondence provisional | Mostly outside close through crop | PHOTO_INFERRED | KEEP |
| rameshwar | Rameshwar four-stone-pillar pavilion | -108.553, -23.326 | UNESCO conservation text and independent western cluster photographs; misleading shikhara filenames rejected; Mapped extent 211080701, plan and aerial order; retained Phase 9A.2 centre/yaw | Gopinath roof candidate at right; Rameshwar partially visible in model; no secure separate identification of every shrine in supplied crop | RECONSTRUCTED_APPROXIMATE | KEEP |
| badrinath | Badrinath brick shikhara | -116.249, -8.810 | UNESCO conservation text and independent western cluster photographs; misleading shikhara filenames rejected; Mapped extent 211080702, plan and aerial order; retained Phase 9A.2 centre/yaw | Gopinath roof candidate at right; Rameshwar partially visible in model; no secure separate identification of every shrine in supplied crop | RECONSTRUCTED_APPROXIMATE | KEEP |
| gopinath-krishna | Gopinath / Dwarika / plan Krishna (provisional) | -97.272, -14.605 | UNESCO conservation text and independent western cluster photographs; misleading shikhara filenames rejected; Mapped extent 197122572, plan and aerial order; retained Phase 9A.2 centre/yaw | Gopinath roof candidate at right; Rameshwar partially visible in model; no secure separate identification of every shrine in supplied crop | PROVISIONALLY_IDENTIFIED | KEEP |
| kedarnath | Kedarnath (provisional) | -73.086, 1.230 | UNESCO conservation text and independent western cluster photographs; misleading shikhara filenames rejected; Mapped extent 211080703, plan and aerial order; retained Phase 9A.2 centre/yaw | Gopinath roof candidate at right; Rameshwar partially visible in model; no secure separate identification of every shrine in supplied crop | PROVISIONALLY_IDENTIFIED | KEEP |
| edge:yetachapari:1160027594 | Yetachapari (provisional lot binding) | -43.962, 13.974 | Documented current two-floor southern inn / independent wide photographs; OSM 1160027594 candidate south of western-to-central route | Distant low southern roof, not securely separable in close crop | PROVISIONALLY_IDENTIFIED | KEEP |
| vatsala-durga | Vatsala Durga | -10.013, 7.277 | Established named monument / Phase 7-9 evidence registry; Protected current corrected placement; outside 60m primary audit | Vatsala pale shikhara candidate; others partly occluded or not individually resolved; sample visibility is not image identification | RECONSTRUCTED_APPROXIMATE | KEEP |
| chyasilin | Chyasilin Mandap | -4.945, -5.025 | Established named monument / Phase 7-9 evidence registry; Protected current corrected placement; outside 60m primary audit | Vatsala pale shikhara candidate; others partly occluded or not individually resolved; sample visibility is not image identification | RECONSTRUCTED_APPROXIMATE | KEEP |
| fifty-five-frontage | 55 Window Palace | 2.020, -14.218 | Established named monument / Phase 7-9 evidence registry; Protected current corrected placement; outside 60m primary audit | Vatsala pale shikhara candidate; others partly occluded or not individually resolved; sample visibility is not image identification | RECONSTRUCTED_APPROXIMATE | KEEP |
| golden-gate | Golden Gate | -16.157, -16.959 | Established named monument / Phase 7-9 evidence registry; Protected current corrected placement; outside 60m primary audit | Vatsala pale shikhara candidate; others partly occluded or not individually resolved; sample visibility is not image identification | RECONSTRUCTED_APPROXIMATE | KEEP |
| malla-column | Bhupatindra Malla column | -16.370, 4.532 | Established named monument / Phase 7-9 evidence registry; Protected current corrected placement; outside 60m primary audit | Vatsala pale shikhara candidate; others partly occluded or not individually resolved; sample visibility is not image identification | RECONSTRUCTED_APPROXIMATE | KEEP |
| large-bell | Large / Taleju bell | -14.082, 5.485 | Established named monument / Phase 7-9 evidence registry; Protected current corrected placement; outside 60m primary audit | Vatsala pale shikhara candidate; others partly occluded or not individually resolved; sample visibility is not image identification | RECONSTRUCTED_APPROXIMATE | KEEP |
| vatsala-bell | Vatsala-associated bell | -13.994, 9.259 | Established named monument / Phase 7-9 evidence registry; Protected current corrected placement; outside 60m primary audit | Vatsala pale shikhara candidate; others partly occluded or not individually resolved; sample visibility is not image identification | RECONSTRUCTED_APPROXIMATE | KEEP |
| yaksheshwar | Yaksheshwar / Pashupatinath | -11.928, 19.708 | Established named monument / Phase 7-9 evidence registry; Protected current corrected placement; outside 60m primary audit | Vatsala pale shikhara candidate; others partly occluded or not individually resolved; sample visibility is not image identification | RECONSTRUCTED_APPROXIMATE | KEEP |
| siddhi-lakshmi | Siddhi Lakshmi | 13.038, -6.078 | Established named monument / Phase 7-9 evidence registry; Protected current corrected placement; outside 60m primary audit | Vatsala pale shikhara candidate; others partly occluded or not individually resolved; sample visibility is not image identification | RECONSTRUCTED_APPROXIMATE | KEEP |
| edge:western-cluster-east-link:211076664 | Anonymous western street frontage | -84.945, 3.518 | Existing regional photographed frontage interpretation; exact lot identity unresolved; Contributor outline retained; no correction in this phase | Partial/background slivers, no individual identification claimed | PHOTO_INFERRED | KEEP |
| edge:central-southeast-edge:1160157267 | Anonymous central southeast frontage | 3.981, 14.229 | Existing regional photographed frontage interpretation; exact lot identity unresolved; Contributor outline retained; no correction in this phase | Partial/background slivers, no individual identification claimed | PHOTO_INFERRED | KEEP |
| edge:tadhuchhen-public-edge:1160157268 | Eastern frontage / Tadhuchhen-side wing correspondence | 32.241, 5.746 | Existing regional photographed frontage interpretation; exact lot identity unresolved; Contributor outline retained; no correction in this phase | Partial/background slivers, no individual identification claimed | PHOTO_INFERRED | KEEP |
| distant:way:1159393579 | Unidentified distant royal-side footprint mass | 12.076, -28.878 | No heritage/elevation identity claimed; OSM footprint only; 3.2m is massing assumption | Tiny modeled outside-view sliver; not independently identifiable in supplied image | FOOTPRINT_ONLY_CONTEXT | KEEP |
| jagannath | True Jagannath | none | Previous duplicate Gopinath rejected; true shrine not independently bound; No accepted modern coordinate/form | Not rendered; do not fabricate replacement | UNRESOLVED | UNRESOLVED |

| distant:relation:18962138 | Royal compound footprint ring; no modeled Taleju shrine | -32.991, -52.415 | OSM relation / plan courtyard only; 3.2m height assumption | Not individually identified; west-sequence / aerial background only | FOOTPRINT_ONLY_CONTEXT | KEEP |

## Evidence and correction plan

**Gallery:** the Digital Himalaya plan, contributor wing 1159393576 and inspected aerial all support occupied palace space at the end-wall location. UNESCO 2018 printed p21 identifies the museum as the western palace end; UNESCO 2022 p48 records western-wing restoration. Therefore deleting/moving the gallery to force a central vista is wrong. The inspected 2014 west-oblique gallery photograph visibly has western-return timber openings, continuing horizontal bands and timber eave supports. The current model only details the south-facing facade, leaving its western face blank. Correct that omission only. Historical source qualified; exact modern openings and dimensions remain PHOTO_INFERRED; no lost tower rebuilt. Existing 2024 wide photographs corroborate the palace/temple relationship, but do not metrically calibrate the return.

**White/tall return:** a weathered upper wall exists in the supplied through photo, but neither image binds the isolated 3.3m rectangle or the guessed 4.1m freestanding return to a surveyed lot. Remove the panel and its tall supporting body. Keep only the directly observed low brick sitting edge. Do not replace the white rectangle with another invented facade.

**1159393573:** OSM and aerial establish footprint occupancy near the approach; the schematic Police icon establishes an area, not this exact lot, its storeys or a hip roof. Remove the detailed low building and retain its unmodified raw footprint as UNRESOLVED evidence; do not relocate or invent a replacement. An unbuilt source lot is not an assertion that the real location is empty.

**Western sequence:** mapped public route 85465819 runs into an offset western apron, then bends toward gallery/central square. Rameshwar remains the UNESCO four-pillar pavilion. Provisional Gopinath/Dwarika, Badrinath, provisional Kedarnath and southern Yetachapari retain their anchors and yaws. The real photo shows partly occluded roofs, not every temple on one line. No evidence justifies moving the approved central ensemble.

**Orientation cautions:** the 2021 Krishna photograph has a contributor camera point 27.671,85.4298 and heading 65 degrees, which contradict a view of the mapped western cluster. These are not trustworthy surveyed camera controls; only photographic form/relative order is used. The local Kedarnath guide describes a western/front pedestal, but that alone cannot justify flipping a provisional model against the retained independent western panorama. Record uncertainty rather than another speculative rotation.

**Distant context:** ray sampling finds only a tiny background sliver of 1159393579 in the outside crop. No major false silhouette from these masses was detected within the retained critical arch crops; preserve them, not a whole-city rebuild.

## Reused sources

- plan: https://commons.wikimedia.org/wiki/File:Map_of_Bhaktapur_Durbar_Square.jpg
- unesco2018: https://whc.unesco.org/document/165534
- unesco2022: https://whc.unesco.org/document/191662
- gallery: https://commons.wikimedia.org/wiki/File:National_Art_Gallery_%E2%80%93_Bhaktapur_%E2%80%93_01.jpg
- western: https://commons.wikimedia.org/wiki/File:Krishna_Temple_Bhaktapur_durbar_Square_Bhaktapur_Nepal_Rajesh_Dhungana.jpg
- municipality: https://bhaktapurmun.gov.np/en/content/ward-no-3
- ntb: https://trade.ntb.gov.np/wp-content/uploads/2023/04/world-heritage-sites-booklet.pdf
- aerial: https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer
- panorama2024: https://commons.wikimedia.org/wiki/File:Bhaktapur_Durbar_Square_Nepal_2024_38.jpg
- Local user photographs: `reference/khauma-gate/khauma-gate-outside.png`, `reference/khauma-gate/khauma-gate-through.png` (ignored, research only, never committed).
- Existing Phase 9A.2 annotated aerials: Esri / Vantor / Earthstar / GIS community, imagery epoch unresolved; persistent topology only, not current elevation evidence.
- Local guide: https://www.bhaktapur.com/discover/kedarnath-temple/

The 2022 PDF text was reviewed; its direct PDF download/screenshot was unavailable (403/timeout), so no uninspected report image is used as facade evidence. The inspected 2014 Commons photo is the explicit visual basis.

## Freeze and review

All gate architecture, dimensions, material and opening; its coordinates/yaw; roadway; Phase 6C dataset; central monument coordinates; player/fly/camera/lighting/general materials remain protected. Baseline gate assembly SHA256: `a54e9155a52963dfab5a18fa3d0fb539dec3772b0f6016d4ef61141cabfb1459`; road assembly: `87dca4dc77c1b18734a17b10e92a74e8f8941dbe0bba5b0009226bbdd616c0a7`. Retained outside/through photo cameras are unchanged.

Add surgical source-backed western end detail, remove unsupported parts, expose uncertainty in the existing development debug mode. Add outside/through sightline aliases plus western sequence/aerial review. Manual approval is required before Phase 9B.

## Implemented result and validation

Removed `photo-pale-upper-return-face` and `photo-adjoining-masonry-return` (including the tall-wall collider). Retained the short sitting wall and cap. Suppressed the detailed model for 1159393573; its raw footprint is unchanged and separately listed as UNRESOLVED, not moved to a fabricated distant location. No new ordinary buildings generated. Sixteen photo/doc-supported source lots remain active; all 380 distant masses remain byte-identical. Neutral royal-compound massing is still visible in the broader sequence/aerial views and remains explicitly FOOTPRINT_ONLY_CONTEXT.

Gallery change is additive west-return openings, floor/eave bands and three timber eave supports. Every original gallery piece, body extent, roof, collider, anchor and yaw is intact; no central composition is shifted. Gate and road hashes still match the pre-edit inventory. Original photo-camera poses/FOVs are exact; new sightline views alias them. New west-sequence/aerial presets use existing review infrastructure. Add `&architectureDebug=1` for existing development labels, now including the western gallery return, unresolved footprint marker and low sitting edge.

| Controlled photo-camera comparison | Phase 9A.3 | Phase 9A.4 |
|---|---:|---:|
| Submitted draws including shadows | 37 | 37 |
| Submitted triangles including shadows | 168,962 | 169,114 |
| Resident geometries | 11 | 11 |
| Resident textures | 9 | 9 |
| Context colliders | 1,972 | 1,964 |

No new material/texture allocations. Existing material-batched instances and merged silhouettes reused. Counts come from software WebGL, not a hardware FPS benchmark.

Validation: lint, TypeScript typecheck, 52 focused spatial/world/gate/frozen tests, production build, six browser review views and movement/collision smoke. Actual Rapier suite covers gate crossing, collidable piers, every mapped gate-to-central/east segment and all five complete exits. Browser console/page errors absent. Final manual approval remains required; historical western-return detail, exact current openings, unknown side-lot elevations and camera matching are still approximate. No Phase 9B work.

Review URLs:
- http://localhost:3000/explore?world=bhaktapur&review=khauma-sightline-outside
- http://localhost:3000/explore?world=bhaktapur&review=khauma-sightline-through
- http://localhost:3000/explore?world=bhaktapur&review=khauma-west-sequence
- http://localhost:3000/explore?world=bhaktapur&review=khauma-west-aerial
- http://localhost:3000/explore?world=bhaktapur&review=khauma-photo-outside
- http://localhost:3000/explore?world=bhaktapur&review=khauma-photo-through
