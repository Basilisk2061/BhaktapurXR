# Yaksheshwar Temple

Game ID: `yaksheshwar`. Real-world identity: Yaksheshwar Temple.
Historical identity: source-supported; rendered binding: PHOTO_INFERRED. Research reviewed 2026-10-18; ready with stated limits.

## Object mapping and interaction

- Source component(s), under `src/game/architecture/`: remaining-models.ts / buildYaksheshwar.
- Nominal source/visual frame (X,Z,yaw radians, rounded where indicated): `[-11.928, 19.708, -0.138]`. These are existing working values, not new coordinates.
- Current saved parent override observed read-only: `null`.
- Exact runtime frame: `buildCompletedSquareModels()` final origin/yaw, then caller-provided saved parent transform. Full XYZ Euler and scale are respected, including the frozen Khauma transform.
- Local interaction X,Z offset: `[0,6.6]`; Y = half player height. Radius: 4.5 m.
- Offset is outside the modeled entrance/stair/footing; manual traversal confirmation remains required.
- Reconstruction: placement APPROXIMATE; architecture PHOTO_INFERRED; dimensions APPROXIMATE. No source or editor coordinates changed.

## Historical content and claim traceability

### Overview

This two-roof Shiva temple stands south of Vatsala in the central square. DoA identifies Yakshyashwor as a 15th-century monument; local documentation also calls it Pashupatinath. It is not the similarly named Kathmandu temple complex.

Claim ID: `yaksheshwar:overview`. Source IDs: `doa22`, `local-yak`. Locator: DoA 2022 project 23, PDF p65; local Bhaktapur Pashupatinath location and identity.

### History

The 2022 DoA report records partial damage in the 2015 earthquake and conservation without wholesale dismantling, still under way at the time of reporting. Local accounts associate the temple with Yaksha Malla, but their precise 1475 date is not treated as independently established.

Claim ID: `yaksheshwar:history`. Source IDs: `doa22`, `local-yak`. Locator: Project 23, p65; local patronage account.

### Architecture

Two spreading tiled roofs shelter a brick and carved-timber temple. Carved struts and entrance work are important parts of its Shaiva imagery. The included post-earthquake photograph locates it beside the then-damaged Vatsala site.

Claim ID: `yaksheshwar:architecture`. Source IDs: `local-yak`, `photo:yaksheshwar`. Locator: Local architectural description; identified two-roof temple photograph.

### Significance

The Shiva/Pashupati dedication belongs to Bhaktapur's own religious landscape. Shared divine names do not make its history interchangeable with Kathmandu's Pashupatinath.

Claim ID: `yaksheshwar:significance`. Source IDs: `local-yak`, `doa22`. Locator: Bhaktapur-specific monument accounts.

## Conflicts

- No material conflict established in the consulted sources; this does not prove universal agreement.

## Unknown / unresolved

- Precise original year and independently corroborated patronage remain unresolved.
- Exact completion date of post-2015 conservation not established by the 2022 progress report.

## Model discrepancies (not corrected)

Repeated strut and portal geometry simplifies actual carving. Source builders provide openings on four faces without a surveyed principal entrance bearing.

## Sources

- `doa22`: [State of Conservation Report 2022: Kathmandu Valley](https://whc.unesco.org/document/191662), Department of Archaeology, Nepal / UNESCO. Monument-specific conservation project reports; PDF page numbers are one-based.
- `local-yak`: [Pashupatinath Temple](https://www.bhaktapur.com/discover/pashupatinath-temple/), Bhaktapur.com. Bhaktapur monument, not the Kathmandu temple complex.
- `photo:yaksheshwar`: [Two-roof Yaksheshwar / Pashupatinath temple; this post-earthquake photograph also shows Vatsala ruins.](https://commons.wikimedia.org/wiki/File:15th_Century_Yaksheswor_Temple_also_called_Pashupatinath_of_Bhaktapur_01.jpg), Wikimedia Commons / Suraj Belbase. Photographic form evidence only; not authority for construction dates or patronage.

## Real photographs

1 gallery entries. Photograph captions are not independent historical authorities.

- Local: `public/heritage/yaksheshwar/reference.jpg`; Two-roof Yaksheshwar / Pashupatinath temple; this post-earthquake photograph also shows Vatsala ruins.
  Creator: Suraj Belbase. [File page](https://commons.wikimedia.org/wiki/File:15th_Century_Yaksheswor_Temple_also_called_Pashupatinath_of_Bhaktapur_01.jpg). [License: CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0). Attribution required: true.
  Source date: 2016-09-09 01:51:45. [Original](https://upload.wikimedia.org/wikipedia/commons/b/bc/15th_Century_Yaksheswor_Temple_also_called_Pashupatinath_of_Bhaktapur_01.jpg). Commons web-sized rendition; no architectural or visual alterations.
