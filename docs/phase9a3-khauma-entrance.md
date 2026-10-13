# Phase 9A.3: Khauma Gate entrance corridor

Base: f3e62d36d05f3d3df75aa2e1969bad98911ba85d. Narrow exterior reconstruction; manual visual approval remains required.

## Evidence and scope

Primary: the two local `reference/khauma-gate/khauma-gate-{outside,through}.png` photographs. They remain ignored, uncommitted research references with unknown capture metadata/license. Cross-checks: [independent Western gateway photograph](https://commons.wikimedia.org/wiki/File:Western_gateway_to_the_Bhaktpur_Durbar_Square.jpg), [Old Town Entrance Gate](https://commons.wikimedia.org/wiki/File:Old_Town_Entrance_Gate,_Bhaktapur_Durbar_Square.jpg), [DoA/UNESCO 2018 report, printed p24](https://whc.unesco.org/document/165534). The report records restoration in traditional form/materials, including Sal wood ties/posts; concealed structural systems are not modeled.

Reused Digital Himalaya/UNESCO plans, Phase 9A.2 mapped gate node, road and aerial audit. `src/data/reconstruction/khauma-entrance.ts` records identity (or unknown), source, footprint/facade/roof evidence and inference for each entrance group. EVIDENCE_RECONSTRUCTED describes source support, never surveyed dimensions. All new dimensions remain RECONSTRUCTED_APPROXIMATE / PHOTO_INFERRED.

## Changes

Gate: deep pointed brick vault; curved solid crown with stepped brick bands; distinct central lotus and two bulb-shaped side finials; recessed broad side panels, small blind pier panels, shallow arched niches, pilasters and reverse facade relief. Working opening 3.8m, spring 3.15m, apex 4.9m, wall depth 1.6m, finial top 9.65m: photo-proportion assumptions, not measurements. Scaled silhouette ratios follow the supplied outside photograph. Historic warm rose/tan brick uses one generated 256px tile with restrained joints/variation and radial arch-ring UVs. No near-white gate finish; no new downloaded textures.

Outside: additional timber opening rhythm on the existing north flank's approach-facing wall; mapped low tiled approach groups retained. Inside: short brick sitting wall/upper masonry return with the photographed pale upper finish; no invented shopfronts, roof, signs or interiors. A 3.2m grey road surface follows the retained inbound axis for 27m outside / 13m inside, transitioning to unchanged brick pedestrian/plaza paving. Length/width/transition are approximate; temporary yellow paint is omitted. Flat traversable ground collider unchanged.

Entrance-only radius 34m excludes three previously distant OSM masses (1158762012, 1159393585, 1159661610). No guessed architecture replaces them. 380 distant masses retained byte-identically. Every other existing square-edge group is byte-identical except the north gate flank facade detail. Gate placement/yaw, all other monument assemblies, correction ledger, source footprints and global transform remain unchanged. Yaksheshwar is preserved; Silu remains the tall shikhara; Jagannath remains unresolved; no Nyatapola or exposed Taleju added.

## Approximate photo cameras

| Review | Eye height | Gate distance | World yaw | Upward pitch | Vertical FOV |
|---|---:|---:|---:|---:|---:|
| khauma-photo-outside | 1.65m | 19m | -1.70917 rad | 0.12 rad | 40 degrees |
| khauma-photo-through | 1.65m | 7.5m | -2.01753 rad | 0.12 rad | 56 degrees |

These are assumed eye-level poses, not photogrammetric calibration. Source image area aspect ~1.50; use a browser canvas of similar aspect for closest framing (e.g. viewport about 1080 x 830). Fixed pose applies only on these development reviews before controls engage; clicking returns to normal review follow camera/FOV. Existing axis reviews remain unchanged.

Visual comparison: outside framing now follows gate normal/road rather than the more oblique Vatsala-directed diagnostic camera. Through framing uses an oblique square-facing view: nearer western roofs/pavilion partly occlude the distant Vatsala shikhara. Silhouette, arch ratios, brick tone, panel hierarchy, depth and road/enclosure were compared against both supplied images. Fine carving, true camera/lens, surface weathering, exact adjoining commercial facade, private returns and intermediate silhouettes remain approximate. No distant monument was moved to match pixels. This is an implementation comparison, not a user-approved visual PASS.

## Validation / performance

Lint, typecheck, production build and 36 focused gate/spatial/frozen tests pass. Actual Rapier checks cover the complete mapped public route from gate to central/east, five exits, gate crossing and pier blocking. Browser checks cover both photo and retained axis views, normal movement, gate crossing, pier blocking and all five exit movement starts, with no errors.

Final runtime counts recorded after validation: 37-39 submitted draw calls including shadows, 168,962-169,186 triangles, 11-13 resident geometries, 9 textures. Boxes remain material-batched instances, profiles/reliefs merged; one new 256px brick map, road reuses stone map. Context colliders: 1972. Software WebGL smoke is not a hardware FPS benchmark.

Manual approval required: compare `http://localhost:3000/explore?world=bhaktapur&review=khauma-photo-outside` and `http://localhost:3000/explore?world=bhaktapur&review=khauma-photo-through` with the corresponding local photos. Also retain `khauma-real-axis-outside` / `khauma-real-axis-inside` for free movement inspection. No whole-world freeze implied.
