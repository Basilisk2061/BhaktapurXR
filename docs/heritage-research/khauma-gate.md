# Khauma Gate

Game ID: `khauma-gate`. Real-world identity: Khauma Gate.
Historical identity: source-supported; rendered binding: PHOTO_INFERRED. Research reviewed 2026-10-18; ready with stated limits.

## Object mapping and interaction

- Source component(s), under `src/game/architecture/`: khauma-entrance-model.ts / buildKhaumaEntranceGate.
- Nominal source/visual frame (X,Z,yaw radians, rounded where indicated): `[-121.53684759946469, -34.285908249582874, -1.5163246617599573]`. These are existing working values, not new coordinates.
- Current saved parent override observed read-only: `{"position": [-121.53684759946469, 0, -34.285908249582874], "rotation": [3.141592653589793, -1.5163246617599573, 3.141592653589793], "scale": [1, 1, 1]}`.
- Exact runtime frame: `buildCompletedSquareModels()` final origin/yaw, then caller-provided saved parent transform. Full XYZ Euler and scale are respected, including the frozen Khauma transform.
- Local interaction X,Z offset: `[0,5]`; Y = half player height. Radius: 4.5 m.
- Offset is outside the modeled entrance/stair/footing; manual traversal confirmation remains required.
- Reconstruction: placement APPROXIMATE; architecture PHOTO_INFERRED; dimensions APPROXIMATE. No source or editor coordinates changed.

## Historical content and claim traceability

### Overview

Khauma is the principal western entrance gate to Bhaktapur Durbar Square. Its city-entry role is distinct from the gilded Golden Gate in the royal palace frontage.

Claim ID: `khauma-gate:overview`. Source IDs: `doa19`, `cambridge`. Locator: DoA 2019 section 1.14, p32; Cambridge entrance and royal frontage distinction.

### History

DoA records collapse of the southern portion and cracking of upper masonry in the 2015 earthquake. Damaged work was dismantled down to the foundations and restored using traditional techniques, including Sal posts and timber ties. The consulted report does not establish the gate's original date or patron.

Claim ID: `khauma-gate:history`. Source IDs: `doa19`. Locator: Section 1.14, PDF p32.

### Architecture

The entrance is a masonry gateway with a pointed central opening, articulated side masses and an ornamental curved crown. These visible forms are documented by the licensed photograph.

Claim ID: `khauma-gate:architecture`. Source IDs: `photo:khauma-gate`, `doa19`. Locator: Licensed western entrance photograph; DoA masonry and timber conservation account.

### Significance

The gateway marks the transition from the western streets into the heritage square. Its post-earthquake repair is documented independently of the more elaborate royal Golden Gate.

Claim ID: `khauma-gate:significance`. Source IDs: `doa19`. Locator: Khauma main-western-entrance and conservation entry.

## Conflicts

- No material conflict established in the consulted sources; this does not prove universal agreement.

## Unknown / unresolved

- Original date, founding patron and authenticated local spelling variants UNKNOWN.
- No current ticketing or ritual schedule asserted.

## Model discrepancies (not corrected)

Original date/patron are not known from the consulted conservation entry. Gate dimensions, ornament and alignment remain photograph-derived estimates.

## Sources

- `doa19`: [State of Conservation Report 2019: Kathmandu Valley](https://whc.unesco.org/document/171737), Department of Archaeology, Nepal / UNESCO. Monument-specific restoration entries; PDF page numbers are one-based.
- `cambridge`: [Continuity and change in the Durbar Square at Bhaktapur, Nepal](https://museums.cam.ac.uk/story/continuity-and-change-in-the-durbar-square-at-bhaktapur-nepal/), University of Cambridge Museums. Institutional interpretation and identified photographs.
- `photo:khauma-gate`: [Western entrance gate of Bhaktapur Durbar Square.](https://commons.wikimedia.org/wiki/File:Old_Town_Entrance_Gate,_Bhaktapur_Durbar_Square.jpg), Wikimedia Commons / Shadow Ayush. Photographic form evidence only; not authority for construction dates or patronage.

## Real photographs

1 gallery entries. Photograph captions are not independent historical authorities.

- Local: `public/heritage/khauma-gate/reference.jpg`; Western entrance gate of Bhaktapur Durbar Square.
  Creator: Shadow Ayush. [File page](https://commons.wikimedia.org/wiki/File:Old_Town_Entrance_Gate,_Bhaktapur_Durbar_Square.jpg). [License: CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0). Attribution required: true.
  Source date: 2018-09-19 15:11:58. [Original](https://upload.wikimedia.org/wikipedia/commons/6/69/Old_Town_Entrance_Gate%2C_Bhaktapur_Durbar_Square.jpg). Commons web-sized rendition; no architectural or visual alterations.
