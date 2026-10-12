# Phase 7A: palace and central forecourt reconstruction

Implementation baseline: `6005820497284eaee8c06f526e291d206b995574`. The spatial dataset is frozen and human-approved. This phase models only the palace public edge and central landmarks. Architectural visual approval still requires the five human screenshots below. Automated checks cannot establish recognition.

## Research before geometry

Specifications were created in `src/data/reconstruction/architecture/specifications.ts` before the geometry builder. Research consisted of original owner photographs, local conservation PDFs, primary NHDP/DANAM and tourism documentation, and the provenance-backed photographs already inspected in Phases 6B/6C, inspected again for architectural form. No AI images, generic search thumbnails or photographic textures are used.

| Landmark | References and architectural observations |
|---|---|
| Palace / 55-window section | All five owner photos (`front-01`, `front-02`, `oblique-01`, `oblique-02`, `west-side-01`) inspected. Dense projecting upper timber gallery, alternating large/small peaked middle windows, low doors/slit openings, deep cornices and broad tiled eaves. Ram Govinda Shrestha, 2006 conservation report, 23 pages, reports historical projecting joists of about 45 cm and traditional brick/timber/roofing materials; this is not a present-day measured projection. Pages 6 and 15 rendered and inspected. The file named conservation-paper-1999.pdf is actually Ananda P. Shrestha's 2000 Protest Poetry article (all nine pages rendered/inspected), and is excluded as mislabelled. |
| National Art Gallery | Maesi64, 11 April 2014, CC0, [file-page reference](https://commons.wikimedia.org/wiki/File:National_Art_Gallery_%E2%80%93_Bhaktapur_%E2%80%93_01.jpg): 960 px attributed image inspected; sparse red-brick/timber section, pale eastern arcade, shutters, stone entry guardians and continuous roof. Historical date is explicit; no lost tower reconstructed. 2021 central and 2024 Gate photographs corroborate the adjacent palace/forecourt setting, not a full surveyed gallery elevation. |
| Golden Gate | [Goutam1962, 4 December 2024](https://commons.wikimedia.org/wiki/File:Bhaktapur_Durbar_Square_041224_221.jpg), CC BY-SA 4.0, plus Saroj Kumar Dhakal's 2013 context view and [Nepal Tourism Board](https://ntb.gov.np/en/bhaktapur). Nested relief jambs, lobed torana, central figure, winged crown, swept gilded canopy, low surrounding brick frontage. No millimetre ornament claim. |
| Chyasilin | [Goutam1962, 4 December 2024](https://commons.wikimedia.org/wiki/File:Bhaktapur_Durbar_Square_041224_23.jpg), CC BY-SA 4.0; opposing 2021 central views; owner palace views. Eight-sided platform, open lower posts and carved bay frames, deep lower eaves, much smaller upper floor and roof, railings and struts. It is not a closed pagoda sanctum. |
| Vatsala | [NHDP/DANAM](https://danam.cats.uni-heidelberg.de/aea67ec1-6cb8-4171-997f-1d6791011183/vatsal%C4%81-mandira-bhaktapur/), original Phase 6 Ancient Nepal dimensional evidence and both 2021 restored-temple views. NHDP identifies twelve outer columns, three-level plinth, stone construction, lowest-plinth bell arch and renovation in 2020. The historical 1973 NHDP image is not used to claim current superstructure presence. |
| Malla | 2024 Gate/column close view, 2016 Suraj Belbase column/pavilion view, opposing 2021 photographs, municipality and tourism inventory. Slender shaft, lotus capital, seated crowned royal figure with prayer hands and parasol. Simplified sculpture, no portrait likeness. |
| Large bell | Shadow Ayush, 19 September 2018, CC BY-SA 4.0; opposing 2021 views; Phase 6C municipality/local/UNESCO evidence. Four massive stone piers, raised platform, timber head beam, shallow tile roof, large suspended bell. |
| Vatsala bell | NHDP plinth/lintel description plus opposing restored-temple 2021 photographs. Small bronze bell in ornate stone columns/lobed lintel, no roofed pavilion. Barking-dog naming remains ambiguous; IDs/forms remain separate. |

Opposing 2021 photographs are Rajesh Dhungana, 20 August 2021, CC BY-SA 4.0: [central view](https://commons.wikimedia.org/wiki/File:Vatsala_Bhagwati_%26_Pasupati_Temple_Bhaktapur_Durbar_Square_Bhaktapur_Nepal_Rajesh_Dhungana_(2).jpg) and [reverse view](https://commons.wikimedia.org/wiki/File:Vatsala_Bhagwati_Bhaktapur_Durbar_Square_Bhaktapur_Nepal_Rajesh_Dhungana_(4).jpg). Same-session views are not independent survey controls. Complete inherited source metadata remain in the Phase 6C source registry and verification document.

Unavailable/restricted evidence: targeted DoA/CHIMS/NHDP searches did not produce reusable measured palace, Gate or Chyasilin plans. No restricted drawings were acquired. Gallery original-image download returned HTTP 429; the attributed file-page image was sufficient for section morphology, not measurements. The alleged 1999 conservation scan is an unrelated 2000 poetry article, excluded from architectural evidence. Owner photo authors, dates and licences remain unresolved; files are research references and are not shipped or converted into textures.

## Frozen data and model binding

Scale 1, rigid rotation −1.3454844413782245°, origin 27.67205 / 85.42856 and all Phase 6C anchors/footprints are unchanged. Model origins use `forecourtFittedObjects()` by explicit identity ID. No UNESCO footprint-index identities or Phase 5B positions enter the new renderer. Spatial uncertainty is provenance, never random displacement.

| Model anchor | X east / Z south, nominal metres |
|---|---|
| Gallery frontage | −41.491195 / −9.352577 |
| 55-window frontage | 2.019705 / −5.591761 |
| Gateway connecting frontage | −16.144732 / −7.304788 |
| Golden Gate | −16.156550 / −7.807960 |
| Chyasilin | 0.385648 / −0.141293 |
| Vatsala | −10.012565 / 7.277098 |
| Malla | −16.370176 / 4.531584 |
| Large bell | −14.082263 / 5.484747 |
| Vatsala bell | −13.993626 / 9.258541 |

Digits preserve data identity; they do not imply measurement precision. Local rear closures, eave projections, podiums and stairs are new architectural assumptions around these anchors, not edits to source geometry. The existing west-return line controls the palace corner continuation. Palace front walls extend northward from the frozen public edge; full interiors/courtyards are not claimed.

## Working architectural specifications

Every specification stores identity, anchor ID, family, materials, height/base dimensions, storeys, roof count/type/pitch/overhang, bay count, openings/bands, distinctive features, sources, basis, confidence and accuracy. Unknown measurements remain null. Evidence enums are DOCUMENTED_DIMENSION, PLAN_DERIVED, PHOTO_PROPORTION, ARCHITECTURAL_INFERENCE and UNRESOLVED. No unmeasured dimension is VERIFIED.

| Landmark | Working geometry | Accuracy / caveat |
|---|---|---|
| Royal edge | Gallery 42.80 m + Gate interval 8.07 m + 55-window section 28.44 m, each following its original edge, not one straight repeated facade | Lengths conditional PLAN_DERIVED; not surveyed building lengths |
| 55-window facade | 3 visible levels; 10.30 m total visual height; 5 m shallow rear closure; 25 dense upper modules on main face and 9 on west return; 11 alternating middle openings and 9 ground groups | PHOTO_PROPORTION / ARCHITECTURAL_INFERENCE. 34 rendered modules are not a count of the actual 55 windows. Grouping and corner continuation take priority over arithmetic name matching |
| Gallery | 3-level red section, contrasting pale eastern two-level arcade; 9.60 m height; 5 m closure; five pale arched bays and sparse staggered timber openings | Historic reference qualified; internal depth and detailed sculptures inferred |
| Golden Gate | ~3.1 m ornamental width, ~1.56 × 2.95 m walk-through opening; 6.65 m total crown/canopy extent; low surrounding brick connector | Lobed extruded torana, inset bronze relief, central deity/winged silhouette, stepped jamb bosses and swept metallic canopy. Simplified iconography, not archaeological sculpture |
| Chyasilin | ~5.03 m schematic base reference; rendered platform radius up to 2.7 m; 16 posts over two levels; ~9.27 m total; lower eave diameter 7.7 m, upper 3.9 m | Octagonal model with open centre, layered railings, carved/lattice frames and struts. Overhangs are local architectural extents, not an enlarged frozen footprint |
| Vatsala | 6.34 × 6.59 m working base, stepped plinth, west access stair, south sanctum opening, twelve columns, shoulder cornices, four-sided convex-taper shikhara, subsidiary spires, niches and ringed pinnacle | Working total 15.95 m = 12.85 + 0.60 + 2.50. The additive interpretation and 2.50 m midpoint plinth are explicit rendering assumptions; original 2.25 / 2.75 discrepancy is retained |
| Malla | 1.25 m pedestal; slender shaft, lotus capital, simplified seated figure, prayer hands, parasol; ~8.9 m highest extent | PHOTO_PROPORTION; exact footing and figure dimensions unresolved; anchor and 4 m provenance unchanged |
| Large bell | 2.8 × 2.6 m stepped platform; four stone piers, timber head beam, single 4 × 3.45 m eave roof; hollow lathed bronze bell, suspension/clapper; 6.25 m roof extent | PHOTO_PROPORTION; anchor and 6 m uncertainty retained |
| Vatsala bell | Small platform association, two carved support profiles and shaped stone lintel/crown; 1.65 m arch reference, ~4.13 m highest simplified crown extent | PHOTO_PROPORTION; exact attachment unresolved; anchor and 5 m uncertainty retained |

The silhouette pass preceded repeated detail. Browser checks then refined review framing, Vatsala's taper/pinnacle continuity, open pavilion frames, stone segmentation and the stair landing. No lost pre-1934 tower, earthquake destruction, NPC, crowd, audio, AI guide, market scene or monument interaction UI is added.

## Materials, ground, collision and performance

Shared restrained red brick, dark brown timber, pale grey stone, muted tile/paving, aged gilding/bronze, pale gallery plaster and neutral context. Deterministic generated brick/tile/paving plus stone wear and timber grain. Box-instance UVs tile in metres to avoid stretching one brick tile across the facade. No photographic texture or fantasy glow. Neutral daylight, restrained shadows and distant fog only; no cinematic grading/post-processing.

A single continuous paved plane and ground collider cover the frozen primary/connected open spaces without category seams. Its 340 m safety extent is not a claimed heritage boundary. Six non-7A monuments are low neutral masses at their frozen anchors: Yaksheshwar, Siddhi Lakshmi, Silu, Rameshwar, Badrinath and provisional Gopinath. Old Phase 5B models, data and tests are retained in source; normal gameplay does not render them.

Simple cuboids supply collision for palace masonry, open Gate sides/header, Vatsala stepped base/sanctum/posts/access stair/landing, Chyasilin compound platform/posts/stairs/roof underside, column pedestal/shaft and bell supports/platforms. No decorative trimesh collider. Roof underside colliders are conservative and may retract the camera slightly early at eaves.

Repeated boxes are instanced by shared material; radial profiles, relief shapes and roof meshes are merged by material. No LOD is required for this scope. Runtime metrics and final validation are recorded in the completion report. Five procedural maps contain about 0.875 MiB of RGBA source texels, approximately 1.17 MiB with mipmaps; this estimate excludes shadow buffers/driver allocations and is not measured GPU residency.

## Manual visual review: five screenshots

Run `npm run dev`, then use these development-only routes. Links are also in the development header. Review camera uses a 6 m boom, 2.5 m target and 55° field of view to frame architecture; normal player camera remains unchanged. Walking, running, jumping and camera collision remain active.

1. `/explore?world=bhaktapur&review=central` — initial southeast central view; take the first screenshot without substantial movement.
2. `/explore?world=bhaktapur&review=palace` — near-straight frontage view; show Gallery, Golden Gate and 55-window band. A small lateral adjustment can reveal areas occluded by the monuments.
3. `/explore?world=bhaktapur&review=composition` — western composition view; Gate/palace behind the column, roofed bell, stone temple and smaller arch. Turn/step slightly to include the pavilion if hidden behind Vatsala.
4. `/explore?world=bhaktapur&review=close` — southeast player-scale Vatsala/Chyasilin view.
5. `/explore?world=bhaktapur&review=wide` — distant skyline/composition view.

Click canvas; WASD walk, Shift run, Space jump; mouse look, Escape release. If mouse capture is unavailable, drag to look. For development anchor/evidence labels append `&architectureDebug=1`; leave it off for the five visual screenshots. Production ignores review and debug queries.

## Limitations and acceptance

This is a reference-informed approximate reconstruction, not a scanned or measured replica. Exact carving, sculptural likeness, interior plans, surveyed palace height/depth, current gallery elevation details, bell outlines and smaller-arch terrace attachment remain unresolved. Historical references are dated explicitly. Small model contacts/overhangs in the tightly spaced bell/temple cluster may require further architectural review; anchors must stay frozen. Neutral surroundings intentionally do not present a complete reconstructed square.

Human visual approval is pending. Review whether the upper palace gallery, contrasting gallery section, Gate crown, stone shikhara and open octagonal pavilion are recognizable at player scale. Passing engineering tests is not visual acceptance. Phase 7A stops here and does not reconstruct other monuments.

## Engineering validation result

Lint PASS; typecheck PASS; all 85 tests PASS (previous 75 retained plus ten new architecture/physics tests); production build PASS. Development: all five review routes rendered without browser/console/shader errors; architecture labels appeared only when requested. Production: walk/run/jump/landing and camera control passed, engineering world remained valid, no idle React commit loop or page errors, four development-only routes returned 404, and review/debug queries retained normal spawn [30,35] without labels.

Browser test-only instrumentation relocated the player body to exercise actual rendered-world physics, without adding runtime teleport controls. Vatsala reached body Y 3.99 m (3.1 m platform plus capsule); the sanctum blocked entry. Chyasilin reached Y 1.79 m and passed within 0.044 m of its open centre. Palace camera sweep retracted to about 0.278 m near the wall. Unit integration tests additionally used all generated colliders together, not isolated landmark fixtures.

Sampled production render.info metrics (shadow work included, view-dependent): 30–37 draw calls; 67,282–69,642 triangles; 11 geometries and 8 renderer texture allocations. Generated static architecture has 2,073 visible instanced boxes, 73 radial profiles and 88 relief shapes, plus roof meshes merged by material; 126 simple architecture collider boxes. Texture counts are allocations, not measured GPU bytes. No frame-rate guarantee is inferred from headless software rendering.

Created: specifications.ts, central-model.ts, central-environment.tsx, review-spawn.ts, central-architecture.test.mjs and this document. Modified: Bhaktapur world integration, world/canvas/experience/explore plumbing for review/debug, player camera optional review framing, and neutral daylight. Frozen reconstruction data, original Phase 5B files and owner reference assets were not modified.
