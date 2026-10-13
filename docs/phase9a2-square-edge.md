# Phase 9A.2: evidence-backed square edge

Baseline: 31dd7bcdad4e3720eeebf9d0ed50b985f108bce5. Implementation complete; manual visual approval required. See [spatial audit](khauma-spatial-re-audit.md) for original/corrected coordinates, evidence conflicts and identity corrections. The original Phase 9A.1 claimed occupancy, not researched individual architecture; that distinction was insufficient. Its runtime renderer is replaced, not its immutable source archive.

## Architecture scope

All 444 old generic OSM architecture assemblies (guessed heights, tiled roofs and black window details) leave the active scene. Of those source records, **61 are removed/replaced in the immediate reconstruction**; **383 are retained only as FOOTPRINT_ONLY_CONTEXT**. That distant context is low neutral 3.2 m *massing assumption*, with no storey count, roof type, windows, doors or heritage identity. Its shapes lie outside defined public-edge reconstruction regions, including the southern Yaksheshwar buffer. It is not a reconstruction of 383 buildings.

The immediate edge uses **11 explicit photo/document-backed groups across 17 source lots**, including current Yetachapari. EVIDENCE_RECONSTRUCTED does not mean VERIFIED: footprint correspondence, rendering dimensions and omitted details remain separate uncertainty fields. PHOTO_DERIVED_CONTEXT has observed exterior vocabulary but approximate per-lot detail. FOOTPRINT_ONLY_CONTEXT never acquires a fake facade just because a polygon exists.

| Group | Class | Working storeys | Source lot IDs | Form evidence / scope |
|---|---|---|---|---|
| Khauma north low frontage | PHOTO_DERIVED_CONTEXT | 1 | 1158762014 | Low brick/timber eaves beside entrance; aerial/mapped northern building line; retain modest single floor, no invented tall urban block |
| Khauma south approach edge | PHOTO_DERIVED_CONTEXT | 1 | 1159661606 | Low roofed masonry/timber edge and raised sitting sill. Precise gate-to-wing join incomplete in photographic coverage |
| Short outer Khauma street continuation | PHOTO_DERIVED_CONTEXT | 1 | 1159661608, 1159672142, 1159672143 | Both photos show short low eave lines continuing the approach. No shops, signs or interiors reproduced |
| Street frontage behind western shrine group | PHOTO_DERIVED_CONTEXT | 2 | 1159633450, 1159633451 | 2021 frontal western group shows two-level brick/timber frontage between shrines; preserve source lot line, restrained shutters rather than fake black voids |
| Western-to-central southern building edge | PHOTO_DERIVED_CONTEXT | 2 | 211076664, 1159633454, 1159633452 | Continuous low brick/timber southern roofline in western and west-to-central views; known building line, no heritage identity assigned to ordinary frontage |
| Low wing west of Art Gallery | PHOTO_DERIVED_CONTEXT | 1 | 1159393573 | Schematic low west approach/Police-side edge, visible low tile eaves; do not fill adjoining confirmed court with tall houses |
| Current Yetachapari / southern inn (provisional footprint correspondence) | EVIDENCE_RECONSTRUCTED | 2 | 1160027594 | Two-storey long inn opposite museum: raised open lower timber bays, continuous upper timber window band, shallow long tile roof. Build present short form, never lost pre-1934 full Lamupati |
| Inn street return / Potters approach | PHOTO_DERIVED_CONTEXT | 2 | 1160027595 | Short two-floor brick/timber return beside southern lane; retain open Potters route and source setback |
| Central southeast timber/brick frontage | PHOTO_DERIVED_CONTEXT | 3 | 1160157267, 1160157271 | Central 2026 photograph shows layered timber upper frontage beside/behind southern pagoda; three working floor bands, no ordinary-building identity promoted |
| Eastern public edge / Tadhuchhen-side wing | PHOTO_DERIVED_CONTEXT | 2 | 1160157268 | Mapped long eastern/southeastern wing and photographed low roofline frame Siddhi approach. No full Bahal/interior heritage reconstruction claimed |
| Short eastern street frontage | PHOTO_DERIVED_CONTEXT | 2 | 1160157278 | Short brick/timber exit edge, not whole surrounding city; leaves existing eastern access clear |

Sources: reused Digital Himalaya plan, UNESCO maps/2018 conservation report, municipality/DOA/NTB documentation, Gopinath western-group photos, Commons 2024 west/east panoramas and February2026 central view, local Yetachapari documentation, supplied gate references and aerial building lines. The group registry stores photo/document sources separately from OSM footprint IDs. Heights/storeys, doors/windows/roof forms come from stated observed grouping, not OSM tags; exact facade rhythms and private lot correspondence remain architectural inference.

## Ground, streets and courts

Building edges now define open space; original plaza geometry/scale and paving are unchanged. Remove the former approximate palace-wing closure rather than extending OSM polygons to fit frozen facades. Explicit palace-public-edge correction resolves that registration conflict. Source paths/lanes are clipped clear from context together with heritage aprons, all five retained exits and corrected gate approach. Royal courtyard holes remain open in distant low ring massing, with no roof/fill across them. No invisible perimeter walls or giant masses to hide source boundaries.

## Yetachapari / monuments

Yetachapari: current short two-storey inn opposite museum, mapped working correspondence to way1160027594. Open lower timber posts and restrained arched heads, sitting ledge/access steps, upper timber/shutter gallery rhythm and long shallow tile roof. Do not reconstruct the lost full pre-1934 Lamupati. Exact bay count, carvings, floor elevations and named-footprint assignment remain approximate/provisional.

Yaksheshwar's complete assembly is preserved: both hip roofs/soffits, chambers, portals, plinth, stairs, 56 attached braces and finial. Only registration changes through the documented conflict layer. No new monument fabricated. Unsupported duplicate Jagannath is removed, true Jagannath remains unresolved. No Nyatapola or exposed Taleju tower added.

## Performance / limitations / validation

Shared merged material geometry and global instancing; 842 context detail instances and 1994 context colliders. Rectangular distant lots use inset cuboids where compatible; irregular/courtyard forms use compound colliders. No per-window React objects. Gate pale-brick finish shares the brick map but has a separate shader-cache identity, preserving all other brick materials. No photographic texture downloads or new lighting/postprocessing.

Seven final browser views: 33-38 draw calls, 166,164-169,512 submitted triangles including shadows, 13 allocated geometries, 8 textures. Peak triangle submissions are about 24% below Phase9A.1 (223,494); draw calls rise modestly from its 27-33 range. Software-rendered development measurements are not hardware FPS claims. Near rear elevations retain restrained inferred floor/eave bands rather than invented openings. Unresolved: exact Taba/Taha Pha and Balakhu correspondence; Jagannath; private rear facade/roof changes; archaeological interiors; precise entrance azimuths and aerial acquisition dates; surveyed monument/footprint centres. Distant context is deliberately visibly subordinate massing, not finished city architecture.

Validation: 131 relevant reconstruction/evidence/world/frozen/player tests, lint, typecheck and production build pass. Full Rapier traversal of all five exits and mapped gate-to-central segments, gate/pier collision and browser movement checks pass without console/page errors. Inspected seven views including 34 m fly height. Manual visual approval required.

Review base: http://localhost:3000/explore?world=bhaktapur&review=
- khauma-real-axis-outside
- khauma-real-axis-inside
- square-edge-west
- square-edge-central
- square-edge-aerial
- context-transition
- yaksheshwar-complete

Existing aerial and Phase9A routes retained; old gate route aliases now use corrected approach. Local reference PNGs ignored, not staged or committed; no licence permission presumed.
