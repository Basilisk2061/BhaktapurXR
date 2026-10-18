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

### Overview

The National Art Gallery occupies part of Bhaktapur's former royal palace. It is distinct from the Fifty-Five Window Palace farther east along the frontage.

Claim ID: `gallery-frontage:overview`. Source IDs: `ntb-museum`, `cambridge`. Locator: NTB National Art Gallery entry; Cambridge museum entrance and palace photographs.

### History

NTB dates the museum's establishment to 1960 under the Department of Archaeology. The palace wing is older: local accounts associate its lion entrance with Simhadhwaka Durbar. The Department of Archaeology's 2022 report documents conservation of the western gallery wing after the 2015 earthquake, using lime-based masonry work and Sal timber.

Claim ID: `gallery-frontage:history`. Source IDs: `ntb-museum`, `local-museum`, `doa22`. Locator: NTB gallery entry; local museum building identity; DoA 2022 project 6, PDF p48.

### Architecture

The brick entrance has carved timber openings and prominent guardian sculpture. The adjoining white, Rana-period remodelled frontage is architecturally distinct. The local name of the lion-gate palace must not be applied indiscriminately to every section of the modern museum complex.

Claim ID: `gallery-frontage:architecture`. Source IDs: `cambridge`, `local-museum`. Locator: Cambridge lion entrance and white wing discussion; local Simhadhwaka building account.

### Significance

The museum preserves painting, manuscripts and stone sculpture associated with Hindu and Buddhist traditions. NTB highlights paubha painting among its collections. The historical palace building and the museum institution therefore have different chronologies.

Claim ID: `gallery-frontage:significance`. Source IDs: `ntb-museum`. Locator: National Art Gallery collection and establishment entry.

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
