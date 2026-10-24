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

Phase 10B.1: visitor-first rewrite; restoration is a separate, secondary chapter. Existing evidence states, photos, zones and conflicts are preserved.

### Overview

The Golden Gate is the ceremonial entrance in Bhaktapur's royal palace frontage. Its gilded surface marks the passage from the public square toward the palace courtyards and the sanctuary of Taleju, a goddess closely associated with the royal court. Also known as Sun Dokha, it belongs to a different part of the city's history from Khauma Gate, the western entrance to the square. Look closely at the contrast between the red brick surround and the crowded metalwork: this is a gateway whose religious imagery is as important as its practical role as an entrance.

Claim ID: `golden-gate:overview`. Source IDs: `cambridge`. Locator: Golden Gate / Sun Dokha and palace courtyard relationship.

### History

Cambridge Museums describes a royal project begun under Bhupatindra Malla and completed by Ranjit Malla in 1754. A Nepal Tourism Board publication instead gives 1753, so the precise completion year remains disputed. Both place the gate within the later Malla palace tradition.

Its position joins the palace of fifty-five windows to the inner royal courts and Taleju precinct. The entrance therefore brings together two aspects of the court: royal residence and religious devotion. It should be read as a threshold within the palace complex, rather than as the main gateway of Bhaktapur's old city.

Claim ID: `golden-gate:history`. Source IDs: `cambridge`, `ntb-cultural`. Locator: Cambridge patronage and 1754 completion; NTB indexed 1753 discrepancy.

### Architecture

The gate's ornament is worked in gilded copper against red brick. The arched ornamental frame, or torana, carries Garuda and a four-headed, ten-armed figure of Taleju. Metal inscriptions in Newar flank the opening.

These details reward a slower look: the entrance is organized around a relatively small opening, while its metal figures and framing give that threshold an exceptionally rich presence. The surrounding brickwork makes the gilded relief easier to distinguish.

Claim ID: `golden-gate:architecture`. Source IDs: `cambridge`. Locator: Metal inscriptions and gilded copper torana iconography.

### Significance

The Golden Gate makes the connection between Malla kingship and devotion to Taleju visible in the public square. It is also an example of the metalworking skill supported by the court. Cambridge's account places the gate within Bhaktapur's living religious landscape, where architectural heritage continues to be understood through worship as well as craftsmanship.

Claim ID: `golden-gate:significance`. Source IDs: `cambridge`. Locator: Living heritage section and royal Taleju relationship.

### Damage & restoration

An independently established restoration chronology for this exact portal is not available in the sources used here.

Claim ID: `golden-gate:restoration`. Source IDs: `cambridge`. Locator: Research limitation: consulted gate account does not establish a restoration chronology.

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


## Heritage book revision - 24 October 2026

This revision supersedes older prose where noted. Original image credits/licenses, model bindings and interaction zones are unchanged. The opening now prioritizes the monument story; uncertainty remains explicit in facts, patronage and sources.

### quickFacts

- Built: Mid-18th century; 1753/1754 chronologies differ [cambridge, ntb-world, slusser82]
- Patron: Completed under Ranjit Malla [cambridge, ntb-world]
- Purpose: Ceremonial palace and Taleju entrance [cambridge]
- Materials: Gilded copper and brick masonry [cambridge]

Claim ID: `golden-gate:book:quickFacts`. Source IDs: cambridge, ntb-world, ntb-cultural, slusser82. Locator: Cambridge Golden Gate paragraphs; NTB World Heritage booklet p8; Slusser volume I p207 indexed excerpt.

### timeline

- 1753 / 1754: Different sources date consecration/completion to these adjacent years. [slusser82, cambridge, ntb-world]

Claim ID: `golden-gate:book:timeline`. Source IDs: cambridge, ntb-world, ntb-cultural, slusser82. Locator: Cambridge Golden Gate paragraphs; NTB World Heritage booklet p8; Slusser volume I p207 indexed excerpt.

### story

The Golden Gate is the ceremonial entrance in Bhaktapur's royal palace frontage. Its gilded surface marks the passage from the public square toward the palace courtyards and the sanctuary of Taleju, a goddess closely associated with the royal court. Also known as Sun Dokha, it belongs to a different part of the city's history from Khauma Gate, the western entrance to the square. Look closely at the contrast between the red brick surround and the crowded metalwork: this is a gateway whose religious imagery is as important as its practical role as an entrance.

Cambridge Museums describes a royal project begun under Bhupatindra Malla and completed by Ranjit Malla in 1754. A Nepal Tourism Board publication instead gives 1753, so the precise completion year remains disputed. Both place the gate within the later Malla palace tradition.

Its position joins the palace of fifty-five windows to the inner royal courts and Taleju precinct. The entrance therefore brings together two aspects of the court: royal residence and religious devotion. It should be read as a threshold within the palace complex, rather than as the main gateway of Bhaktapur's old city.

Claim ID: `golden-gate:book:story`. Source IDs: cambridge, ntb-world, ntb-cultural, slusser82. Locator: Cambridge Golden Gate paragraphs; NTB World Heritage booklet p8; Slusser volume I p207 indexed excerpt.

### purpose

The doorway served the approach to the palace courts and Taleju sanctuary. Its architectural richness gives a relatively narrow passage the presence of a ceremonial entrance. Access, religious dedication and royal display belonged together here.

Taleju was associated with the authority and protection of the court. The gate made that relationship visible from the public forecourt, while the inner precinct retained its own boundaries. A reconstructed open passage in BhaktapurXR is not a statement that every real courtyard or sanctuary is freely accessible today.

Claim ID: `golden-gate:book:purpose`. Source IDs: cambridge, ntb-world, ntb-cultural, slusser82. Locator: Cambridge Golden Gate paragraphs; NTB World Heritage booklet p8; Slusser volume I p207 indexed excerpt.

### patron

Ranjit Malla is the completing patron named by the institutional accounts. Cambridge also credits Bhupatindra Malla with beginning the project. A patron commissioned and supported the work; he was not necessarily the person who hammered the copper or made the framing. The sources consulted do not securely identify a complete list of individual makers.

Slusser records a consecration in 1753, whereas Cambridge and NTB's World Heritage booklet give 1754. The adjacent years are retained as differing accounts, not silently corrected into one exact date.

Claim ID: `golden-gate:book:patron`. Source IDs: cambridge, ntb-world, ntb-cultural, slusser82. Locator: Cambridge Golden Gate paragraphs; NTB World Heritage booklet p8; Slusser volume I p207 indexed excerpt.

### culturalRole

The religious figures are part of the threshold's meaning. A torana is the ornamental frame above an entrance; here its gilded imagery gives the doorway an importance beyond its size. The inscriptions beside it also show that the gate was meant to be read as well as seen. Royal dedication was expressed through language, imagery and skilled metalwork.

The present guide describes the real portal's documented iconography. The digital relief is simplified and does not reproduce a scholarly transcription of the inscriptions or every carved figure.

Claim ID: `golden-gate:book:culturalRole`. Source IDs: cambridge, ntb-world, ntb-cultural, slusser82. Locator: Cambridge Golden Gate paragraphs; NTB World Heritage booklet p8; Slusser volume I p207 indexed excerpt.

### whatToNotice

- The small doorway within its broad ornamental surround.
- The gilded torana above the entrance.
- The contrast between metal relief and red brick.
- The projecting canopy and layered jambs.

Claim ID: `golden-gate:book:whatToNotice`. Source IDs: cambridge, ntb-world, ntb-cultural, slusser82. Locator: Cambridge Golden Gate paragraphs; NTB World Heritage booklet p8; Slusser volume I p207 indexed excerpt.

### restoration

An independently established restoration chronology for this exact portal is not available in the sources used here.

Claim ID: `golden-gate:book:restoration`. Source IDs: cambridge, ntb-world, ntb-cultural, slusser82. Locator: Cambridge Golden Gate paragraphs; NTB World Heritage booklet p8; Slusser volume I p207 indexed excerpt.

### Conflicts / decisions

- Cambridge gives completion in 1754; NTB Cultural Treasures indexed text gives 1753. NTB World Heritage booklet indexed text also gives 1754. The discrepancy is retained.

### Sources reviewed

- `cambridge`: University of Cambridge Museums, [Continuity and change in the Durbar Square at Bhaktapur, Nepal](https://museums.cam.ac.uk/story/continuity-and-change-in-the-durbar-square-at-bhaktapur-nepal/). Institutional interpretation and identified photographs. Access/review 2026-10-24.
- `ntb-world`: Nepal Tourism Board, [World Heritage Sites of Nepal: Bhaktapur Durbar Square](https://trade.ntb.gov.np/wp-content/uploads/2023/04/world-heritage-sites-booklet.pdf). Bhaktapur section, printed p8; general palace/site history is not the date of every surviving window. Access/review 2026-10-24.
- `ntb-cultural`: Nepal Tourism Board, [Cultural Treasures of Nepal](https://trade.ntb.gov.np/wp-content/uploads/2023/04/cultural-treasures-of-nepal-inside.pdf). Search-index corroboration only: direct PDF retrieval failed. Not the sole source for published claims. Access/review 2026-10-24.
- `slusser82`: Mary Shepherd Slusser / Princeton University Press, 1982, [Nepal Mandala, volume I: Courts of the Three Kingdoms](https://pahar.in/pahar/Books%20and%20Articles/Nepal/1982%20Nepal%20Mandala--Cultural%20Study%20of%20Kathmandu%20Valley%20vol%201%20Text%20by%20Slusser%20s.pdf). p207 indexed excerpt inspected; scan returned 403. Column commissioning explicitly undocumented; Ranjit tradition recorded. 1737 bell and 1753 gate consecration. Ambiguous Badrinath/Gopinath passage not used as this model's founding evidence. Access/review 2026-10-24.

No present-day access schedule, unnamed founding patron or precise historic date is inferred from a photograph. Search-index-only and blocked retrievals are identified in the source records.
