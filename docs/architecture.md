# Phase 5B recognizable landmark reconstruction

The contemporary reconstructed Bhaktapur Durbar Square is the target. Phase 5B continues the interrupted identity-registry work; it does not rebuild the spatial foundation. All original 17 UNESCO records, source files, calibration, courtyard holes and unknown factual heights remain unchanged. Fourteen source architectural entries remain linked to their exact original SpatialFeature objects. Two supplementary candidate symbol anchors are separate data, not replacements for source traces.

## Evidence and confidence

`src/data/architecture/monuments.ts` records canonical names, architecture families, references, confidence, mapping rationale and reconstruction state. Every candidate binding remains PROVISIONALLY_IDENTIFIED and APPROXIMATE. None is survey-confirmed or promoted to VERIFIED. Official monument facts do not establish footprint identity, dimensions or a completed 2026 restoration.

The calibrated local UNESCO map remains the sole metric foundation. [Nepal Tourism Board](https://ntb.gov.np/bhaktapur) supports the open palace square, carved-window palace, Golden Gate, stone Vatsala shikhara and Malla column. [Bhaktapur Municipality](https://www.bhaktapurmun.gov.np/en/content/ward-no-3) provides an official monument inventory. The [UNESCO 2020 mission report](https://whc.unesco.org/document/187827) supplies reconstruction history, not present-day completion evidence; indexed text was inspected, PDF images could not be retrieved. The [Digital Himalaya labelled map](https://commons.wikimedia.org/wiki/File:Map_of_Bhaktapur_Durbar_Square.jpg), dated 2006 and CC BY-SA 3.0, was visually inspected only for relative topology. It does not replace the calibrated UNESCO map.

Two user-supplied palace photographs (front-01 and oblique-01) were visually inspected for continuous upper timber windows, projecting frames and horizontal proportions. Their photographer, date and licence remain unknown. They are research only; not shipped as textures or copied into production. The identified 2013 Gerd Eichmann palace photo has CC BY-SA 4.0 metadata, but its original download was unavailable. No visual claims are attributed to that inaccessible image. No AI imagery or travel-blog geometry is used.

## Phase 5 audit and bindings

Kept: polygon/void geometry, procedural materials, shared box instancing, static merging, façade and roof helpers, stairs/plinth vocabulary, simplified Rapier compounds, controller, camera, daylight, quality settings, routing and source review.
Reconfigured: palace frontage/window rhythm; Yaksheshwar two-tier configuration; reddish weathered pavers; separate lower perimeter context; visual-detail shadows.
Replaced: footprint-index architecture assignment with the identity registry and family builders; Vatsala/Siddhi generic timber roofs with stone shikhara; western generic pagodas with distinct small shrines; supplemented missing pavilion/column symbols.
Removed: invented upper temples on footprints 004, 008 and 009; generic three-tier southern temple; context positions that crowded the main square. No unsupported bell/spout is added.

| Candidate identity | Source footprint suffix/anchor | Family | Confidence/state |
|---|---|---|---|
| Royal palace frontage / Fifty-Five Windows wing | 001 | PALACE_FACADE | MEDIUM / provisional |
| Golden Gate (attached façade, not separate mass) | 001 | PALACE_FACADE | MEDIUM / provisional |
| Rameshwar | 002 | SMALL_NEPALI_SHRINE | LOW / provisional |
| Badrinath | 003 | TERRACOTTA_SHRINE | LOW / provisional |
| Vatsala Durga | 005 | SHIKHARA_STONE | MEDIUM / provisional |
| Yaksheshwar / Pashupatinath | 006 | NEWAR_PAGODA | MEDIUM / provisional |
| Siddhi Lakshmi | 007 | SHIKHARA_STONE | MEDIUM / provisional |
| Phasi Dega / Silu Mahadev | 008 | UNRESOLVED_PLATFORM | MEDIUM / provisional identity; upper form unresolved |
| Chyasilin Mandap | supplement-chyasilin | OCTAGONAL_MANDAP | MEDIUM / provisional |
| Bhupatindra Malla column | supplement-malla-column | COLUMN_MONUMENT | MEDIUM / provisional |

Footprints 004 and 009 remain unnamed and UNRESOLVED. Taleju Bell has no spatial binding and remains UNRESOLVED. Silu's trace is a central symbol, not its full surrounding plinth: a low neutral symbol platform is retained rather than inventing its restored architecture. Golden Spout and smaller untraced monuments are unresolved/omitted. Full palace polygon 001 is a connected royal complex, not entirely the Fifty-Five Windows Palace.

## Architectural families and proportions

`landmark-families.ts` produces distinct static models. Palace retains the original long polygon/courtyard voids, adds a deep continuous upper timber-window zone on southern frontage edges, simplified repeated recessed frames/sills/lattice, and restrained metallic Golden Gate tiers at a provisional entrance seam. Windows evoke carved rhythm, not 55 individually measured carvings. Gate openings remain closed collision representations; no unsupported sculptural relief is invented.

Vatsala has six approximate platform risers, a square stone sanctum, bands/pilasters, central tapering ribbed shikhara and smaller surrounding spires. Siddhi has eighteen risers, a higher platform, central stair and five pairs of abstract stone guardian silhouettes. These are composition cues, not replicas of particular animals/deities. Both have no pagoda hip roofs. Simplified body/spire compounds support collision/camera obstruction.

Chyasilin uses an eight-sided source-symbol interpretation, three-step base, eight timber posts per storey, open lower space, upper octagonal floor and two eight-sided roofs. Its anchor is separately calibrated from source-pixel centre [1090,1323] and an approximate eight-pixel radius. Column uses a candidate pedestal west of Vatsala, slender six-metre approximate shaft and abstract seated-statue silhouette. No NPC is introduced.

Yaksheshwar uses two broad terracotta hip roofs, restrained pitch (0.19), timber bands/opening representations and smaller upper body. Western Rameshwar is an open roofed shrine with central altar; Badrinath a small terracotta vertical shrine. Their low-confidence forms are not historical validation. Remaining source ordinary buildings retain the Phase 5 vocabulary. Ten separate two-storey placeholder context masses frame outer edges with gaps; their placement is invented, not surveyed.

Palace storey/window proportions are PHOTO-INFERRED APPROXIMATE from local images (storey assumption 2.9 m, repeated upper window spacing 1.15 m and height 1.7 m); other temple/pavilion heights, ratios, platforms, guardian counts and access directions are brief-informed APPROXIMATE development assumptions. None enters factual `heightMetres`, which remains null. Player is the existing 1.75 m scale reference.

## Rendering, collision and development review

Generated brick/roof/paving tiles remain deterministic 256 px textures with mipmaps and two-metre UV repeat. Paving now reads reddish brown. Seven shared material resources include restrained rough metallic gold. Static volumes merge by material, radial profiles merge by material and hip roofs share one merged geometry. All detail boxes share one instanced unit box; geometry is built once, disposed on unmount and never rebuilt per frame. No new frame-driven React state is introduced. Daylight/controller/camera algorithms remain unchanged.

Decorative meshes are not used as physics geometry. Fixed cuboids model bodies, plinths, stairs and timber posts. Original courtyard holes stay open; pavilion lower centre is open. Roof slopes and exact sculpture collisions remain approximate. No Blender, NPCs, guide AI, audio or monument interaction panels are introduced.

Development `/reconstruction` retains the 17 original projected traces and adds an optional dashed supplementary-anchor layer plus expandable identity audit. Original paths and supplemental paths have distinct attributes. Production source review and raster API still return 404; ordinary exploration does not fetch research images.

## Validation and visual approval

All earlier tests are retained. Additional tests cover unique identity IDs, valid families/references, provisional accuracy, unnamed unresolved footprints, contemporary target, distinct silhouettes/open pavilion, deterministic finite profile geometry, separate supplemental data, spawn and a frozen original trace-file SHA256. Engineering and runtime results are recorded in `docs/phase-5b-validation.md`.

MANUAL TEST REQUIRED: YES. Human visual approval remains pending. Review visitor spawn, central plaza, palace frontage, principal monument cluster and wide overview against real references. Judge recognition, gate location, platform/stair composition, pavilion, open-space scale, enclosure, camera/collision and performance. Engineering success does not constitute historical or visual acceptance. Do not proceed to Phase 6 before that review.

Known limitations: provisional identity/location crosswalk, ambiguous raster symbols, incomplete modern-state evidence and urban fabric, schematic carved windows/guardians/statue, unverified roof junctions and heights, closed façade entrances, unresolved Silu/bell/spout/southern sector, distant placeholder context, and 1800 m placeholder paving support (not measured plaza extent).
