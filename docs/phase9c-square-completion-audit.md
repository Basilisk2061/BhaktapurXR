# Phase 9C square completion audit

Baseline: `6c06fd4458bb23353da09e27735f5afe1bbef084`, the latest approved, amended Phase 9B.2. The older hash in the brief is not restored.

## Region and before inventory

Main-square completion envelope in the existing local frame: x -148..78m, z -80..49m. This covers the western approach/House-of-Malla relationship, Royal Palace depth, all central monuments, southern urban edge and eastern main-square edge. It stops before Khwopa/guest-house precinct. The rectangle is an explicit implementation envelope, not a surveyed heritage boundary. Every mass intersecting it is processed, including lots whose centroids are outside it.

**PHASE 9C RAW PLACEHOLDERS BEFORE = 79.** Counted before geometry implementation by intersecting all neutral volume footprints with the envelope. Preliminary centroid-only count was 65 and is not the acceptance inventory. Six immediate unresolved lots and 73 distant-source masses intersect. Final inventory and treatment for every ID are recorded below.

## Source decisions before implementation

- Directly inspected local labelled map, inward/outward Khauma PNGs and current cached 2025 Silu/2021 Siddhi photographs. Reuse previously inspected owner video frames and palace/museum photographs. The supplied `reference/palace/...` alias and `inside-square-google-reference.png` are absent; existing Khauma-folder palace photograph remains the usable original. No user media is committed.
- Palace envelope relation `18962138` has three mapped court holes. Retain them as exterior voids and build surrounding roof/wall ranges; PLAN_INFERRED geometry, no inaccessible interior or exposed Taleju tower.
- [NHDP Layku Phalca](https://danam.cats.uni-heidelberg.de/4259eb80-deb6-402a-8413-0c2771c98893/l%C4%81yk%C5%AB-phalc%C4%81-bhaktapur/) describes an L-shaped, two-storey arcade in front of Phasi Dega. It is distinct from southern Yetachapari. Lot binding remains provisional; only supported exterior character is used.
- [UNESCO/DOA 2018](https://whc.unesco.org/document/165534) describes eastern Yantra Vatsala as a single-storey Nepalese-style temple. The source snapshot's `211082585` is labelled Vatsala Shikhara. These are not blindly equated. A small brick shikhara is visible in the re-inspected 2025 Silu photograph, but any candidate binding stays provisional/unresolved.
- Existing calibrated monuments, Rameshwar four-post pavilion, improved museum, Golden Gate, 55 Palace, Chyasilin, central Vatsala, column/bells and restored Silu/Yaksheshwar remain. No anchor changes are proposed.
- Occupied ordinary lots get restrained contextual architecture using existing photographic Newar vocabulary, with footprint location separate from PHOTO_INFERRED appearance and RECONSTRUCTED_APPROXIMATE dimensions. No approximate context is VERIFIED.
- Protect all five established exits, mapped street segments, approved monument envelopes and palace court voids before generating architecture/colliders. Absorbed overlapping source lots are recorded rather than duplicated.

## Zones / planned actions

| Zone | Before | Identity / evidence | Action |
|---|---|---|---|
| A Khauma | Approved gate; incomplete context | Gate identified; context approximate | Retain gate; contextualize occupied approach lots |
| B Western cluster | Approved shrines; six grey lots / missing edges | Gopinath/Kedarnath provisional; ordinary lots unresolved | Retain shrines; complete brick/timber/tile edges |
| C Museum approach | Approved detailed museum; incomplete adjoining fabric | Identified frontage; context inferred | Preserve all approved museum geometry; integrate surroundings |
| D Royal frontage | Approved connected architecture | Identified; photo proportions approximate | Retain Gate/55 Palace/shrine junction |
| E Central monuments | Mostly complete, open plaza | Established approximate anchors | Retain monument field and real open space; integrate transitions |
| F Southern edge | Yetachapari partial context / omitted lots | Inn binding provisional; ordinary lots unresolved | Complete occupied edges, lanes and thresholds |
| G Eastern square | Siddhi/Silu retained; absent minor/context architecture | Minor binding unresolved; context/photo inference | Complete square-facing and street architecture; preserve Tachupal route |
| H Palace depth | One grey envelope, three court holes | PLAN_INFERRED palace exterior | Roofed connecting ranges and court-edge walls |
| I Context | Neutral source masses / omissions | Footprints only; appearance regionally inferred | Contextualize every occupied in-scope lot; retain only outside grey masses |

Implementation and validation complete; manual visual approval remains required. The before inventory above was recorded before geometry work.

## Implemented inventory

**PHASE 9C RAW PLACEHOLDERS AFTER = 0.** All 79 intersecting existing raw masses were contextualized. 37 previously omitted occupied footprints were also constructed: 116 completed source footprints total. One previously omitted footprint, 1159661617, is kept clear because protected street/existing-architecture masks consume its usable area; it was not an existing raw placeholder. No raw placeholder was claimed removed as independently proved vacant land.

All established monument/approved museum transforms and geometry retained. Added only one small eastern brick shikhara interpretation, identity unresolved and source binding PROVISIONALLY_IDENTIFIED. General contextual elevations/storeys remain RECONSTRUCTED_APPROXIMATE; no new VERIFIED claims.

| Structure / assembly | Zone | Identity | Before | Evidence | Action | After |
|---|---|---|---|---|---|---|
| gate-frontage | D | identified | correct / accepted approximation | RECONSTRUCTED_APPROXIMATE | retained | complete enough for Phase 9C; exact details unresolved |
| fifty-five-frontage | D | identified | correct / accepted approximation | RECONSTRUCTED_APPROXIMATE | retained | complete enough for Phase 9C; exact details unresolved |
| gallery-frontage | C | identified | correct / accepted approximation | RECONSTRUCTED_APPROXIMATE | retained | complete enough for Phase 9C; exact details unresolved |
| golden-gate | D | identified | correct / accepted approximation | RECONSTRUCTED_APPROXIMATE | retained | complete enough for Phase 9C; exact details unresolved |
| chyasilin | E | identified | correct / accepted approximation | RECONSTRUCTED_APPROXIMATE | retained | complete enough for Phase 9C; exact details unresolved |
| vatsala-durga | E | identified | correct / accepted approximation | PHOTO_INFERRED | retained | complete enough for Phase 9C; exact details unresolved |
| malla-column | E | identified | correct / accepted approximation | PHOTO_INFERRED | retained | complete enough for Phase 9C; exact details unresolved |
| large-bell | E | identified | correct / accepted approximation | PHOTO_INFERRED | retained | complete enough for Phase 9C; exact details unresolved |
| vatsala-bell | E | identified | correct / accepted approximation | PHOTO_INFERRED | retained | complete enough for Phase 9C; exact details unresolved |
| siddhi-lakshmi | G | identified | correct / accepted approximation | RECONSTRUCTED_APPROXIMATE | retained | complete enough for Phase 9C; exact details unresolved |
| yaksheshwar | F | identified | correct / accepted approximation | RECONSTRUCTED_APPROXIMATE | retained | complete enough for Phase 9C; exact details unresolved |
| silu-mahadev | G | identified | correct / accepted approximation | RECONSTRUCTED_APPROXIMATE | retained | complete enough for Phase 9C; exact details unresolved |
| rameshwar | B | identified | correct / accepted approximation | RECONSTRUCTED_APPROXIMATE | retained | complete enough for Phase 9C; exact details unresolved |
| gopinath-krishna | B | provisional | correct / accepted approximation | RECONSTRUCTED_APPROXIMATE | retained | complete enough for Phase 9C; exact details unresolved |
| badrinath | B | provisional | correct / accepted approximation | RECONSTRUCTED_APPROXIMATE | retained | complete enough for Phase 9C; exact details unresolved |
| khauma-gate | A | identified | correct / accepted approximation | RECONSTRUCTED_APPROXIMATE | retained | complete enough for Phase 9C; exact details unresolved |
| kedarnath | B | provisional | correct / accepted approximation | RECONSTRUCTED_APPROXIMATE | retained | complete enough for Phase 9C; exact details unresolved |
| palace-corner-shrine-unresolved | D | unresolved | correct / accepted approximation | PHOTO_INFERRED | retained | complete enough for Phase 9C; exact details unresolved |
| east:small-shikhara-unresolved | G | unresolved | missing | PROVISIONALLY_IDENTIFIED | reconstructed photo form; provisional binding | complete enough for Phase 9C; exact details unresolved |
| edge:khauma-north-flank:1158762014 | I | provisional regional correspondence | partially correct | PHOTO_INFERRED | retained; exposed returns refined | complete enough for Phase 9C |
| edge:khauma-south-flank:1159661606 | I | provisional regional correspondence | partially correct | PHOTO_INFERRED | retained; exposed returns refined | complete enough for Phase 9C |
| edge:western-approach-low-roofs:1159661608 | I | provisional regional correspondence | partially correct | PHOTO_INFERRED | retained; exposed returns refined | complete enough for Phase 9C |
| edge:western-approach-low-roofs:1159672142 | I | provisional regional correspondence | partially correct | PHOTO_INFERRED | retained; exposed returns refined | complete enough for Phase 9C |
| edge:western-approach-low-roofs:1159672143 | I | provisional regional correspondence | partially correct | PHOTO_INFERRED | retained; exposed returns refined | complete enough for Phase 9C |
| edge:yetachapari:1160027594 | I | provisional regional correspondence | partially correct | PHOTO_INFERRED | retained; exposed returns refined | complete enough for Phase 9C |
| edge:central-southeast-edge:1160157267 | I | provisional regional correspondence | partially correct | PHOTO_INFERRED | retained; exposed returns refined | complete enough for Phase 9C |
| edge:central-southeast-edge:1160157271 | I | provisional regional correspondence | partially correct | PHOTO_INFERRED | retained; exposed returns refined | complete enough for Phase 9C |
| edge:tadhuchhen-public-edge:1160157268 | I | provisional regional correspondence | partially correct | PHOTO_INFERRED | retained; exposed returns refined | complete enough for Phase 9C |
| edge:eastern-street-return:1160157278 | I | provisional regional correspondence | partially correct | PHOTO_INFERRED | retained; exposed returns refined | complete enough for Phase 9C |
| context:9c:18962138 / source 18962138 | H | identified palace envelope / court labels provisional | placeholder | PLAN_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1159393578 / source 1159393578 | H | provisional covered-range correspondence | missing | PROVISIONALLY_IDENTIFIED; dimensions approximate | reconstructed covered range (provisional) | complete enough for Phase 9C |
| context:9c:1139641234 / source 1139641234 | H | unresolved ordinary lot | placeholder | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1139641235 / source 1139641235 | H | unresolved ordinary lot | placeholder | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1139641236 / source 1139641236 | H | unresolved ordinary lot | placeholder | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1139641237 / source 1139641237 | H | unresolved ordinary lot | placeholder | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1158754512 / source 1158754512 | H | unresolved ordinary lot | placeholder | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1158754515 / source 1158754515 | H | unresolved ordinary lot | placeholder | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1158754523 / source 1158754523 | H | unresolved ordinary lot | placeholder | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1158754533 / source 1158754533 | H | unresolved ordinary lot | placeholder | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1158756548 / source 1158756548 | H | unresolved ordinary lot | placeholder | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1158756549 / source 1158756549 | H | unresolved ordinary lot | placeholder | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1158756550 / source 1158756550 | H | unresolved ordinary lot | placeholder | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1158756551 / source 1158756551 | H | unresolved ordinary lot | placeholder | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1158762006 / source 1158762006 | H | unresolved ordinary lot | placeholder | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1158762007 / source 1158762007 | H | unresolved ordinary lot | placeholder | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1158762008 / source 1158762008 | H | unresolved ordinary lot | placeholder | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1158762009 / source 1158762009 | H | unresolved ordinary lot | placeholder | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1158762011 / source 1158762011 | H | unresolved ordinary lot | placeholder | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1158762012 / source 1158762012 | B | unresolved ordinary lot | missing | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1158762013 / source 1158762013 | B | unresolved ordinary lot | missing | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1158762015 / source 1158762015 | B | unresolved ordinary lot | placeholder | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1158762016 / source 1158762016 | H | unresolved ordinary lot | placeholder | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1159393573 / source 1159393573 | H | unresolved ordinary lot | missing | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1159393574 / source 1159393574 | B | unresolved ordinary lot | missing | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1159393575 / source 1159393575 | B | unresolved ordinary lot | placeholder | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1159393576 / source 1159393576 | I | unresolved ordinary lot | missing | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1159393577 / source 1159393577 | H | unresolved ordinary lot | placeholder | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1159393579 / source 1159393579 | H | unresolved ordinary lot | placeholder | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1159393581 / source 1159393581 | H | unresolved ordinary lot | placeholder | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1159393585 / source 1159393585 | A | unresolved ordinary lot | missing | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1159393586 / source 1159393586 | A | unresolved ordinary lot | placeholder | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1159633449 / source 1159633449 | A | unresolved ordinary lot | missing | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| edge:western-cluster-south:1159633450 / source 1159633450 | B | unresolved ordinary lot | placeholder | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| edge:western-cluster-south:1159633451 / source 1159633451 | B | unresolved ordinary lot | placeholder | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| edge:western-cluster-east-link:1159633452 / source 1159633452 | F | unresolved ordinary lot | placeholder | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1159633453 / source 1159633453 | B | unresolved ordinary lot | placeholder | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| edge:western-cluster-east-link:1159633454 / source 1159633454 | F | unresolved ordinary lot | placeholder | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1159633455 / source 1159633455 | B | unresolved ordinary lot | missing | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1159633456 / source 1159633456 | F | unresolved ordinary lot | placeholder | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1159633457 / source 1159633457 | F | unresolved ordinary lot | missing | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1159633458 / source 1159633458 | F | unresolved ordinary lot | placeholder | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1159633459 / source 1159633459 | F | unresolved ordinary lot | placeholder | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1159633460 / source 1159633460 | F | unresolved ordinary lot | placeholder | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1159633461 / source 1159633461 | B | unresolved ordinary lot | placeholder | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1159633462 / source 1159633462 | F | unresolved ordinary lot | placeholder | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1159633463 / source 1159633463 | B | unresolved ordinary lot | placeholder | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1159635294 / source 1159635294 | A | unresolved ordinary lot | placeholder | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1159635295 / source 1159635295 | B | unresolved ordinary lot | missing | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1159635296 / source 1159635296 | B | unresolved ordinary lot | missing | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1159635297 / source 1159635297 | B | unresolved ordinary lot | placeholder | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1159635298 / source 1159635298 | B | unresolved ordinary lot | placeholder | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1159635299 / source 1159635299 | B | unresolved ordinary lot | placeholder | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1159635300 / source 1159635300 | B | unresolved ordinary lot | placeholder | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1159635301 / source 1159635301 | B | unresolved ordinary lot | placeholder | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1159635302 / source 1159635302 | B | unresolved ordinary lot | placeholder | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1159635303 / source 1159635303 | B | unresolved ordinary lot | placeholder | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1159635304 / source 1159635304 | B | unresolved ordinary lot | placeholder | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1159635305 / source 1159635305 | A | unresolved ordinary lot | placeholder | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1159635306 / source 1159635306 | A | unresolved ordinary lot | placeholder | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1159635307 / source 1159635307 | A | unresolved ordinary lot | placeholder | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1159635308 / source 1159635308 | A | unresolved ordinary lot | placeholder | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1159635309 / source 1159635309 | A | unresolved ordinary lot | placeholder | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1159635310 / source 1159635310 | A | unresolved ordinary lot | placeholder | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1159635311 / source 1159635311 | A | unresolved ordinary lot | placeholder | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1159643799 / source 1159643799 | B | unresolved ordinary lot | placeholder | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1159643810 / source 1159643810 | A | unresolved ordinary lot | placeholder | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1159643811 / source 1159643811 | A | unresolved ordinary lot | placeholder | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1159643814 / source 1159643814 | A | unresolved ordinary lot | placeholder | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1159661607 / source 1159661607 | A | unresolved ordinary lot | missing | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1159661610 / source 1159661610 | A | unresolved ordinary lot | missing | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1159661614 / source 1159661614 | A | unresolved ordinary lot | missing | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1159661615 / source 1159661615 | A | unresolved ordinary lot | placeholder | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1159661617 / source 1159661617 | A | unresolved ordinary lot | missing | PLAN_INFERRED; dimensions approximate | removed / absorbed by protected existing architecture or source streets | complete enough for Phase 9C |
| context:9c:1159668537 / source 1159668537 | A | unresolved ordinary lot | placeholder | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1160000773 / source 1160000773 | A | unresolved ordinary lot | placeholder | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1160027591 / source 1160027591 | F | unresolved ordinary lot | placeholder | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1160027592 / source 1160027592 | F | unresolved ordinary lot | missing | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1160027593 / source 1160027593 | F | unresolved ordinary lot | missing | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| edge:yetachapari-west-return:1160027595 / source 1160027595 | F | unresolved ordinary lot | placeholder | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1160027596 / source 1160027596 | F | unresolved ordinary lot | missing | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1160027598 / source 1160027598 | F | unresolved ordinary lot | placeholder | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1160027599 / source 1160027599 | F | unresolved ordinary lot | placeholder | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1160027600 / source 1160027600 | F | unresolved ordinary lot | missing | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1160027607 / source 1160027607 | F | unresolved ordinary lot | missing | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1160027608 / source 1160027608 | F | unresolved ordinary lot | missing | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1160157269 / source 1160157269 | G | unresolved ordinary lot | missing | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1160157270 / source 1160157270 | F | unresolved ordinary lot | missing | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1160157272 / source 1160157272 | F | unresolved ordinary lot | missing | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1160157273 / source 1160157273 | F | unresolved ordinary lot | missing | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1160157274 / source 1160157274 | F | unresolved ordinary lot | missing | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1160157275 / source 1160157275 | F | unresolved ordinary lot | missing | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1160157276 / source 1160157276 | F | unresolved ordinary lot | placeholder | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1160157279 / source 1160157279 | G | unresolved ordinary lot | missing | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1160157280 / source 1160157280 | F | unresolved ordinary lot | placeholder | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1160157281 / source 1160157281 | F | unresolved ordinary lot | missing | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1160157284 / source 1160157284 | F | unresolved ordinary lot | placeholder | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1160157285 / source 1160157285 | F | unresolved ordinary lot | placeholder | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1160157290 / source 1160157290 | F | unresolved ordinary lot | placeholder | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1160175219 / source 1160175219 | F | unresolved ordinary lot | placeholder | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1160200890 / source 1160200890 | H | unresolved ordinary lot | missing | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1160200894 / source 1160200894 | H | unresolved ordinary lot | missing | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1160200896 / source 1160200896 | G | unresolved ordinary lot | missing | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1160200899 / source 1160200899 | G | unresolved ordinary lot | missing | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1160200900 / source 1160200900 | G | unresolved ordinary lot | missing | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1160234582 / source 1160234582 | F | unresolved ordinary lot | placeholder | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1160234584 / source 1160234584 | F | unresolved ordinary lot | placeholder | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1160234585 / source 1160234585 | F | unresolved ordinary lot | placeholder | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1160234586 / source 1160234586 | F | unresolved ordinary lot | placeholder | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1160234587 / source 1160234587 | F | unresolved ordinary lot | placeholder | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1160234588 / source 1160234588 | F | unresolved ordinary lot | placeholder | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1160234589 / source 1160234589 | F | unresolved ordinary lot | placeholder | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1160234596 / source 1160234596 | G | unresolved ordinary lot | missing | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:1160234597 / source 1160234597 | G | unresolved ordinary lot | missing | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:185746826 / source 185746826 | G | unresolved ordinary lot | missing | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| edge:western-cluster-east-link:211076664 / source 211076664 | B | unresolved ordinary lot | placeholder | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |
| context:9c:384140368 / source 384140368 | F | unresolved ordinary lot | placeholder | PHOTO_INFERRED; dimensions approximate | contextualized occupied footprint | complete enough for Phase 9C |

## Architectural result and limits

- Palace depth: mapped relation 18962138 becomes two-storey enclosing brick/timber ranges with tiled roofs. Three source court voids remain empty; no full interior reconstruction and no exposed Taleju. Remaining adjoining source lots supply exterior roof depth.
- Western/southern/eastern lots: source-polygon bodies, raised stone bases, varied two/three working floor bands, shutter/lattice suggestions, projecting sills, eaves, pitched roofs and exposed returns. Most are ordinary contextual architecture, not individually verified heritage facades.
- Eastern covered range 1159393578: source L-shaped footprint, open lower timber bays, upper gallery and tiled roof. Candidate Layku relationship stays provisional; no claim of reproducing the documented exact 49-bay census. Southern Yetachapari remains distinct and retained.
- Eastern minor shikhara: form follows the small brick tower visible in the current Silu photo; name/binding uncertain. Do not equate it with Yantra Vatsala merely from OSM tags. Other eastern Vatsala assignments and separate stone-lion-symbol binding remain unresolved; existing Siddhi/Silu guardian groups retained.
- Ground: approved heritage polygons/ground collider retained; low stone building bases/thresholds and thin brick lane transitions added. Grey road finish restricted to outer approaches. No random terrain, invisible plaza wall, NPC or interaction system.
- Roof optimization: 80 rectangular context roofs use simple hip meshes; irregular/courtyard envelopes retain polygon roofs with holes. Shared materials/maps, merged surfaces and instanced details retained. No new texture maps.
- Completion envelope is shown as a cyan outline only in the full-aerial development review. Outside neutral massing stays visible. Lots straddling the envelope are completed as whole source lots so buildings are not visibly cut in half.
- Outside scope: separate Khwopa/guest-house precinct, Taumadhi/Nyatapola, the rest of Bhaktapur, inaccessible palace interiors and exact deity/iconographic reconstruction. Distant neutral context remains outside the completion envelope.
- Exact private elevations, ownership, roof changes, named House-of-Malla binding and measured terrace limits remain unresolved. The context is an evidence-compatible regional interpretation, not a survey/as-built model.
- Re-inspected cached panorama2024 / central2026 photographs, the local owner video contact frames and palace oblique photo during implementation. These support brick/timber/tile character and roof depth, not individual lot dimensions.

## Operational spawn correction

The old temporary gameplay spawn [30,0.05,35], yaw 0.55, lies inside completed occupied lot 1160157270. Preserve that lot rather than drilling an invented void. The actual no-review Bhaktapur experience now starts 6m outside the frozen Khauma Gate along its approved axis: approximately [-127.4795,0.05,-35.1135], yaw -1.70917042. This is a gameplay-start change only; world frame, all monument assemblies, player/controller/camera/fly code and saved overrides remain untouched. Historical engineering spawn fixtures remain in their original dataset.

## Validation and rendering measurements

- Lint, typecheck and production build: PASS on the final implementation.
- All 202 tests: PASS. Five focused completion tests protect approved monument/museum geometry and transforms, old editor identities/local frames/override compatibility, zero in-boundary raw masses, deterministic generation, all five street exits and mapped approach/central/east/south routes with actual Rapier collisions.
- Browser: all 17 review routes inspected; the full-aerial diagnostic label initially produced a DOM/R3F error and was removed, leaving the cyan boundary line. Final routes have no console/page errors. Production scene loads; development editor and write endpoints are unavailable in production.
- World Editor V2 runtime: PASS. RMB navigation, focus, assembly/part selection, unlock, numeric transform, gizmo drag, undo/redo, isolation, reset, mocked save/reload and collider alignment. Saved JSON unchanged. 145 assemblies / 461 parts registered; all former identities/local source frames retained.
- Full-region walkthrough: PASS, 42 consecutive walking segments from Khauma through west, museum/palace, central, east, south and back to Khauma. Continuous 25m flight: PASS, 10 segments over all edges/centre. No intermediate walking teleports. Software-rendered traversal used QA pixel ratio 0.5 and cached shadows to accelerate steering; full-resolution visual reviews were checked separately. Normal default-spawn movement also passed.
- Visual judgment for the explicitly defined envelope: walk without obvious unfinished nearby architecture YES; 10-30m flight without raw grey in-boundary masses YES; coherent main-square enclosure YES. These are implementation checks, not the user's manual approval or an as-built accuracy certification.

| Full-resolution development view | Draw calls | Submitted triangles | Textures | Colliders |
|---|---:|---:|---:|---:|
| Central west, player height | 54 | 517,316 | 8 | 2,672 |
| Central low aerial, 25m | 59 | 602,548 | 9 | 2,672 |
| Full boundary aerial, 125m | 60 | 609,100 | 10 | 2,672 |

Counts include renderer shadow submissions and are camera/cache dependent. The full overview includes one cyan-line draw. Previous central review captured 51 calls / 249,648 submitted triangles / 8 textures / 2,316 colliders at the same central pose. Geometry has increased materially to complete 116 lots; shared materials/maps, merged batches and instancing keep gameplay draw calls low. No new texture allocations. The separate isolated baseline re-render timed out, so no matched multi-view timing or hardware FPS claim is made. Editor mode intentionally separates selectable geometry: the sampled editor view measured 1,179 calls / 503,666 submitted triangles / 9 textures, substantially more expensive than gameplay; editor navigation remained functional in the regression check.

## Review routes / manual approval

Inspect these first; full-aerial shows the entire envelope and outside context honestly:

- [Khauma entry](http://localhost:3000/explore?world=bhaktapur&review=9c-khauma-entry)
- [Western cluster](http://localhost:3000/explore?world=bhaktapur&review=9c-western-cluster)
- [Palace frontage](http://localhost:3000/explore?world=bhaktapur&review=9c-palace-frontage)
- [Central west](http://localhost:3000/explore?world=bhaktapur&review=9c-central-west)
- [Central east](http://localhost:3000/explore?world=bhaktapur&review=9c-central-east)
- [Southern edge](http://localhost:3000/explore?world=bhaktapur&review=9c-southern-edge)
- [Eastern square](http://localhost:3000/explore?world=bhaktapur&review=9c-eastern-square)
- [Full aerial boundary](http://localhost:3000/explore?world=bhaktapur&review=9c-full-aerial)

Additional existing-infrastructure review routes:

- [Museum approach](http://localhost:3000/explore?world=bhaktapur&review=9c-museum-approach)
- [Golden Gate](http://localhost:3000/explore?world=bhaktapur&review=9c-golden-gate)
- [Fasidega](http://localhost:3000/explore?world=bhaktapur&review=9c-fasidega)
- [Arcade](http://localhost:3000/explore?world=bhaktapur&review=9c-arcade)
- [Palace depth](http://localhost:3000/explore?world=bhaktapur&review=9c-palace-depth)
- [Western low aerial](http://localhost:3000/explore?world=bhaktapur&review=9c-aerial-west)
- [Central low aerial](http://localhost:3000/explore?world=bhaktapur&review=9c-aerial-central)
- [Eastern low aerial](http://localhost:3000/explore?world=bhaktapur&review=9c-aerial-east)
- [Return to Khauma](http://localhost:3000/explore?world=bhaktapur&review=9c-back-to-khauma)

Manual visual approval REQUIRED. No Phase 9D work or push.