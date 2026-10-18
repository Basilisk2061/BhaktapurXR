# Golden Gate

Game ID: `golden-gate`. Real-world identity: Golden Gate.
Historical identity: source-supported; rendered binding: PHOTO_INFERRED. Research reviewed 2026-10-18; ready with stated limits.

## Object mapping and interaction

- Source component(s), under `src/game/architecture/`: palace-frontage-models.ts / golden; inside-square-models.ts.
- Nominal source/visual frame (X,Z,yaw radians, rounded where indicated): `[-16.157, -16.959, -0.038936]`. These are existing working values, not new coordinates.
- Current saved parent override observed read-only: `null`.
- Exact runtime frame: `buildCompletedSquareModels()` final origin/yaw, then caller-provided saved parent transform. Full XYZ Euler and scale are respected, including the frozen Khauma transform.
- Local interaction X,Z offset: `[0,5.5]`; Y = half player height. Radius: 4.5 m.
- Offset is outside the modeled entrance/stair/footing; manual traversal confirmation remains required.
- Reconstruction: placement APPROXIMATE; architecture PHOTO_INFERRED; dimensions APPROXIMATE. No source or editor coordinates changed.

## Historical content and claim traceability

### Overview

The gilded entrance in the royal palace frontage leads toward the palace courtyards and the Taleju sanctuary. It is distinct from Khauma, the western entrance to the square.

Claim ID: `golden-gate:overview`. Source IDs: `cambridge`. Locator: Golden Gate / Sun Dokha discussion and palace frontage photographs.

### History

Cambridge Museums describes the gate as begun under Bhupatindra Malla and completed under Ranjit Malla in 1754. Tourism Board publications differ between 1753 and 1754; the completion year is therefore not treated as uncontested.

Claim ID: `golden-gate:history`. Source IDs: `cambridge`, `ntb-cultural`. Locator: Cambridge Golden Gate discussion; NTB Cultural Treasures Golden Gate entry (indexed text).

### Architecture

Gilded copper ornament contrasts with the surrounding red brick. The torana includes Garuda and a multi-headed, multi-armed representation of Taleju; inscriptions flank the portal. The metalwork frames a ceremonial threshold rather than a freestanding city gate.

Claim ID: `golden-gate:architecture`. Source IDs: `cambridge`. Locator: Golden Gate iconography and inscriptions discussion.

### Significance

The gate expresses the relationship between Malla kingship, the royal palace and Taleju. Its religious setting should not be confused with unrestricted public access to every inner court.

Claim ID: `golden-gate:significance`. Source IDs: `cambridge`. Locator: Royal palace and Taleju context.

## Conflicts

- Cambridge gives completion in 1754; NTB Cultural Treasures indexed text gives 1753. NTB World Heritage booklet indexed text also gives 1754. The discrepancy is retained.

## Unknown / unresolved

- Exact Lu Dhowka spelling/transliteration not established by the consulted institutional text; not published as an authenticated local name.
- No independently established conservation chronology for this exact portal.

## Model discrepancies (not corrected)

Metal figures and torana are schematic; inscriptions are not epigraphic reproductions. No change made.

## Sources

- `cambridge`: [Continuity and change in the Durbar Square at Bhaktapur, Nepal](https://museums.cam.ac.uk/story/continuity-and-change-in-the-durbar-square-at-bhaktapur-nepal/), University of Cambridge Museums. Institutional interpretation and identified photographs.
- `ntb-cultural`: [Cultural Treasures of Nepal](https://trade.ntb.gov.np/wp-content/uploads/2023/04/cultural-treasures-of-nepal-inside.pdf), Nepal Tourism Board. Search-index corroboration only: direct PDF retrieval failed. Not the sole source for published claims.
- `photo:golden-gate`: [Gilded portal and torana of the Golden Gate.](https://commons.wikimedia.org/wiki/File:Golden_Gate_at_Bhaktapur_Durbar_Square.jpg), Wikimedia Commons / Manoguru. Photographic form evidence only; not authority for construction dates or patronage.
- `photo:golden-gate-wide`: [Golden Gate within the palace frontage, photographed in 2014.](https://commons.wikimedia.org/wiki/File:Golden_gate_%E2%80%93_Bhaktapur_%E2%80%93_01.jpg), Wikimedia Commons / Maesi64. Photographic form evidence only; not authority for construction dates or patronage.

## Real photographs

2 gallery entries. Photograph captions are not independent historical authorities.

- Local: `public/heritage/golden-gate/reference.jpg`; Gilded portal and torana of the Golden Gate.
  Creator: Manoguru. [File page](https://commons.wikimedia.org/wiki/File:Golden_Gate_at_Bhaktapur_Durbar_Square.jpg). [License: CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0). Attribution required: true.
  Source date: 2013-09-30 16:45:31. [Original](https://upload.wikimedia.org/wikipedia/commons/c/c7/Golden_Gate_at_Bhaktapur_Durbar_Square.jpg). Commons web-sized rendition; no architectural or visual alterations.
- Local: `public/heritage/golden-gate-wide/reference.jpg`; Golden Gate within the palace frontage, photographed in 2014.
  Creator: Maesi64. [File page](https://commons.wikimedia.org/wiki/File:Golden_gate_%E2%80%93_Bhaktapur_%E2%80%93_01.jpg). [License: CC0](http://creativecommons.org/publicdomain/zero/1.0/deed.en). Attribution required: not specified.
  Source date: 2014-04-11. [Original](https://upload.wikimedia.org/wikipedia/commons/3/3b/Golden_gate_%E2%80%93_Bhaktapur_%E2%80%93_01.jpg). Commons web-sized rendition; no architectural or visual alterations.
