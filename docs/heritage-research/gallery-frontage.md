# National Art Gallery

Game ID: `gallery-frontage`. Real-world identity: National Art Gallery.
Historical identity: source-supported; rendered binding: PHOTO_INFERRED. Research reviewed 2026-10-18; ready with stated limits.

## Object mapping and interaction

- Source component(s), under `src/game/architecture/`: palace-frontage-models.ts / gallery; museum-entrance.ts / refineMuseumEntrance.
- Nominal source/visual frame (X,Z,yaw radians, rounded where indicated): `[-41.491, -19.027, -0.088473]`. These are existing working values, not new coordinates.
- Current saved parent override observed read-only: `null`.
- Exact runtime frame: `buildCompletedSquareModels()` final origin/yaw, then caller-provided saved parent transform. Full XYZ Euler and scale are respected, including the frozen Khauma transform.
- Local interaction X,Z offset: `[0,4.5]`; Y = half player height. Radius: 4.5 m.
- Gallery offset X is additionally resolved from the existing museum entrance center (`foundation width * .12 - 4.1`), rather than the whole frontage center.
- Reconstruction: placement APPROXIMATE; architecture PHOTO_INFERRED; dimensions APPROXIMATE. No source or editor coordinates changed.

## Historical content and claim traceability

Phase 10B.1: visitor-first rewrite; restoration is a separate, secondary chapter. Existing evidence states, photos, zones and conflicts are preserved.

### Overview

The National Art Gallery is a museum housed in part of Bhaktapur's former royal palace. Its entrance is recognizable by the guardian sculptures and carved timber work in the brick frontage. The museum preserves paintings, manuscripts and stone sculpture, making this a place to encounter objects as well as architecture. The institution and its building have different histories: the gallery opened in 1960, while the palace structure is older. The neighboring white wing and the Fifty-Five Window Palace should not be folded into one undifferentiated building story.

Claim ID: `gallery-frontage:overview`. Source IDs: `ntb-museum`, `cambridge`. Locator: NTB gallery establishment/collections; Cambridge entrance identification.

### History

Nepal Tourism Board dates the establishment of the gallery to 1960 under the Department of Archaeology. Its collections include paubha paintings and works associated with both Hindu and Buddhist traditions. The palace was thus given a new public role as a place for preserving and presenting art.

Local accounts connect the lion entrance with the name Simhadhwaka Durbar. Cambridge Museums distinguishes this entrance from the adjoining palace wing remodelled during Rana rule. These different architectural phases are part of the frontage's history; a date associated with one section should not be applied to the whole museum complex.

Claim ID: `gallery-frontage:history`. Source IDs: `ntb-museum`, `local-museum`, `cambridge`. Locator: 1960 museum establishment; local Simhadhwaka name; Cambridge Rana-remodelled wing.

### Architecture

Brick masonry and carved timber openings frame a prominent sculptural entrance. Cambridge identifies the guardian figures as Hanumanta-Bhairava and NarSimha, alongside stone lions.

The adjacent white facade reflects another period of the palace's development. Reading the two together reveals a complex that changed over time rather than a palace built all at once in one uniform style.

Claim ID: `gallery-frontage:architecture`. Source IDs: `cambridge`. Locator: Guardian entrance identities and distinct white palace wing.

### Significance

The gallery connects Bhaktapur's royal architectural history with the preservation of its artistic traditions. Paubha painting, manuscripts and stone sculpture allow visitors to consider religious art across media and across Hindu and Buddhist collections. The historic palace is both the setting for this work and an important object of heritage in its own right.

Claim ID: `gallery-frontage:significance`. Source IDs: `ntb-museum`. Locator: Paubha, manuscripts and Hindu/Buddhist stone sculpture collections.

### Damage & restoration

The Department of Archaeology's 2022 report records conservation of the western gallery wing following the 2015 earthquake, including lime-based masonry work and Sal timber. It is a restoration account for the palace fabric, not the founding date of the museum.

Claim ID: `gallery-frontage:restoration`. Source IDs: `doa22`. Locator: Project 6, PDF p48.

## Conflicts

- Local 1698 palace attribution is not treated as the date of the whole mixed frontage or of the museum institution.
- NTB collection text contains inconsistent inscription chronology; that dating is excluded.

## Unknown / unresolved

- Precise construction phases of every white and brick facade section remain unverified.

## Model discrepancies (not corrected)

Museum sculptures are procedural approximations, not an authenticated iconographic inventory. Mixed white/brick facade phases cannot share one construction date.

## Sources

- `ntb-museum`: [Museums in Bhaktapur](https://ntb.gov.np/en/museums-in-bhaktapur), Nepal Tourism Board. Institutional establishment and collection information; internally inconsistent inscription chronology excluded.
- `cambridge`: [Continuity and change in the Durbar Square at Bhaktapur, Nepal](https://museums.cam.ac.uk/story/continuity-and-change-in-the-durbar-square-at-bhaktapur-nepal/), University of Cambridge Museums. Institutional interpretation and identified photographs.
- `local-museum`: [The National Art Museum](https://www.bhaktapur.com/discover/the-national-art-museum/), Bhaktapur.com. Secondary local building-name evidence, distinguished from museum founding date.
- `doa22`: [State of Conservation Report 2022: Kathmandu Valley](https://whc.unesco.org/document/191662), Department of Archaeology, Nepal / UNESCO. Monument-specific conservation project reports; PDF page numbers are one-based.
- `photo:gallery-frontage`: [Guardian sculptures at the National Art Gallery entrance.](https://commons.wikimedia.org/wiki/File:National_Art_Gallery_%E2%80%93_Bhaktapur_%E2%80%93_04.jpg), Wikimedia Commons / Maesi64. Photographic form evidence only; not authority for construction dates or patronage.
- `photo:gallery-frontage-wide`: [National Art Gallery frontage and adjoining white wing, photographed in 2014.](https://commons.wikimedia.org/wiki/File:National_Art_Gallery_%E2%80%93_Bhaktapur_%E2%80%93_01.jpg), Wikimedia Commons / Maesi64. Photographic form evidence only; not authority for construction dates or patronage.

## Real photographs

2 gallery entries. Photograph captions are not independent historical authorities.

- Local: `public/heritage/gallery-frontage/reference.jpg`; Guardian sculptures at the National Art Gallery entrance.
  Creator: Maesi64. [File page](https://commons.wikimedia.org/wiki/File:National_Art_Gallery_%E2%80%93_Bhaktapur_%E2%80%93_04.jpg). [License: CC0](http://creativecommons.org/publicdomain/zero/1.0/deed.en). Attribution required: false.
  Source date: 2014-04-11. [Original](https://upload.wikimedia.org/wikipedia/commons/c/c6/National_Art_Gallery_%E2%80%93_Bhaktapur_%E2%80%93_04.jpg). Commons web-sized rendition; no architectural or visual alterations.
- Local: `public/heritage/gallery-frontage-wide/reference.jpg`; National Art Gallery frontage and adjoining white wing, photographed in 2014.
  Creator: Maesi64. [File page](https://commons.wikimedia.org/wiki/File:National_Art_Gallery_%E2%80%93_Bhaktapur_%E2%80%93_01.jpg). [License: CC0](http://creativecommons.org/publicdomain/zero/1.0/deed.en). Attribution required: not specified.
  Source date: 2014-04-11. [Original](https://upload.wikimedia.org/wikipedia/commons/c/ca/National_Art_Gallery_%E2%80%93_Bhaktapur_%E2%80%93_01.jpg). Commons web-sized rendition; no architectural or visual alterations.
