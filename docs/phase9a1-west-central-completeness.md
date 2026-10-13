# Phase 9A.1: west-to-central built environment

Historical implementation record. Superseded by Phase 9A.2: the 444 contributor footprints below did not establish reconstructed buildings. See [the square-edge correction](phase9a2-square-edge.md).

Baseline: `33e5f95d93d5d313dea7c1efe7da73f86c73b98e`. Manual visual approval remains required.

## Evidence and occupancy

The machine-readable [occupancy audit](../src/data/reconstruction/urban-occupancy-audit.ts) records nine regions, evidence URLs, actions and unresolved questions. Reused the Phase 6 geographic frame, UNESCO 2006 zone map, Digital Himalaya plan, municipal inventory and Nepal Tourism Board documentation. Cross-checked UNESCO 2018 conservation report (printed pp21-25), Commons December 2024 west/east photographs, the panorama uploaded in 2023 (capture date unresolved), February 2026 central photograph, the 2018 gate photo, the 2016 Yaksheshwar photograph and local Yetachapari documentation. Photograph GPS/heading describe cameras, not monument anchors.

Added original contributor footprints downloaded from OpenStreetMap on 2026-10-13. The source snapshot retains 479 building records, 21 streets, WGS84 rings, individual revisions/timestamps, retrieval bounds and raw-response SHA256. It is contributor mapping, not an authoritative survey. Rendered 444 mapped occupancies inside the limited existing ground extent; excluded 35 duplicate heritage/conflicting/out-of-extent records. These are source polygons, not 444 independently researched named reconstructions.

Identified royal palace courtyard wings (relation 18962138 and way 1159393576), retaining three open courtyard holes. Current two-storey Yetachapari opposite the museum is a **provisional** correspondence to way 1160027594: open lower bays, mapped rear/returns, upper gallery, continuous roof and shallow access treads. Do not confuse it with the lost full historical Lamupati. Taba/Balakhu names remain unresolved, while mapped occupancy is still represented.

Outside Khauma and along western, northern and southern street blocks, actual irregular footprints replace 65 legacy frontage/backdrop models, including the old approximate arcade. Removed all rectangular pale development ground overlays. Confirmed public square, entrance approaches, streets and mapped courts remain open on existing brick ground. No anonymous perimeter wall or random house rows remain in this implementation.

## Accuracy and conflicts

Unadapted footprint topology: **SOURCE_DERIVED**. District brick/timber/tile vocabulary: **PHOTO_INFERRED**. Storeys, roof slopes, private facade rhythms and individual heights: **APPROXIMATE / RECONSTRUCTED_APPROXIMATE**, not VERIFIED. One/two-storey gate flanks follow the existing photo; the district default is two/three storeys. Distant buildings have reduced detail, not invented identities.

Contributor geometry disagrees by several metres with some frozen heritage positions. All Phase 6C coordinates, all monument anchors/yaws, existing palace facades, five exits and review/player spawns are retained. Rendering clips conflicting context against these clearances; 38 records report adaptations. Way 1159393576 also has an explicitly approximate rear-wing registration closure behind the fixed palace facade (about 300 m2 before clearance clipping). Source coordinates remain untouched; original and adapted geometry are separate. This is not a claim of survey registration or a source-confirmed extension.

No development placeholder models remain within the reconstructed mapped area. Remaining limitations: limited source extent still ends beyond the corridor; private roofs/heights/rear facades are coarse and approximate; detailed court interiors, Taleju sanctum, carvings and furnishings are not invented. Source completeness cannot be guaranteed.

## Monument completeness

Yaksheshwar rebuilt as a complete two-roof temple: low stepped plinth and entry, enclosed lower shrine, four timber portal elevations, cornices, upper chamber extending into the lower roof, pyramidal hip roofs, continuous sloping timber soffits, edge rims, 56 attached struts and summit. Exact dimensions/carvings and repeated rear openings remain approximate. The old long-ridge roof assembly and incomplete wall/roof seams caused the unfinished appearance.

Gopinath and Jagannath receive hip roofs, continuous soffits/rims and enclosed upper-body connections. Other Phase 7/9 monuments retain their assemblies, including four-pillar Rameshwar and separately identified Kedarnath. Reviewed both western and central monuments from aerial views, plus Yaksheshwar ground, side and rear views.

## Performance and validation

Shared material batches and instanced facade/strut boxes; no per-window React components. Adaptive polygon roof triangulation preserves courtyard openings. Single inset cuboid colliders where safely contained by rectangular footprints, compound colliders otherwise: 2,040 context colliders (reduced from 4,522), 2,514 instanced context details. Static polygon boolean generation; no per-frame footprint operations.

Chrome/SwiftShader development smoke across ten review views: 27-33 draw calls, 219,930-223,494 submitted triangles (including shadow passes), 11 allocated geometries, 8 textures. Triangle work increased about 42% over the previous reported 157,050 maximum; no hardware frame-rate claim. Lint, typecheck, 123 relevant reconstruction/world/player tests and production build pass. Rapier tests traverse all five complete exit corridors. Browser checks verify gate traversal, pier collision and movement through each exit, with no browser errors.

New development routes: `west-urban-aerial`, `west-street`, `west-cluster-wide`, `yaksheshwar-complete`, `west-central-aerial`. Existing five Phase 9A routes retained. Base: `/explore?world=bhaktapur&review=...`. Fly/aerial views intentionally expose roofs, rear fabric and court openings. **Manual visual test required.**
