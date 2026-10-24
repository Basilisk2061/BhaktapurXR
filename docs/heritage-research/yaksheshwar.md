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

Phase 10B.1: visitor-first rewrite; restoration is a separate, secondary chapter. Existing evidence states, photos, zones and conflicts are preserved.

### Overview

Yaksheshwar is a two-roof Hindu temple dedicated to Shiva, also known locally as Pashupatinath of Bhaktapur. It stands south of Vatsala in the central square. The broad tiled roofs, brick body and carved timber work make it easy to distinguish from the neighboring stone shikhara. The shared Pashupatinath name should not lead visitors to borrow the history of the much larger Kathmandu temple complex. This is Bhaktapur's own shrine, with its own position in the religious and architectural life of Durbar Square.

Claim ID: `yaksheshwar:overview`. Source IDs: `doa22`, `local-yak`, `photo:yaksheshwar`. Locator: DoA project 23 p65; local Bhaktapur Shiva/Pashupatinath identity and location; photograph.

### History

The Department of Archaeology identifies Yakshyashwor as a fifteenth-century temple. A local account associates it with Yaksha Malla and gives 1475, but that exact year has not been independently established here. The broader fifteenth-century date is therefore preferred, with royal patronage presented as an attributed local account.

Its Shiva dedication explains the Pashupatinath name. The temple belongs to a square containing several different shrines and architectural types; sharing a deity or a familiar sacred name does not make those monuments interchangeable. Its older history is considered separately from the conservation work undertaken after 2015.

Claim ID: `yaksheshwar:history`. Source IDs: `doa22`, `local-yak`. Locator: DoA 15th century; locally attributed Yaksha/1475 chronology not independently confirmed.

### Architecture

Two spreading tiled roofs shelter a brick temple enriched with carved timber. The broad lower eaves and smaller upper roof give the building a layered profile. Doorways, carved entrance work and roof struts establish much of its visual character.

Local documentation discusses Shaiva imagery in the carved timber. These details connect the shrine's religious identity with its architecture, while the large overhangs provide a strong contrast to the exposed stone tower of Vatsala nearby.

Claim ID: `yaksheshwar:architecture`. Source IDs: `local-yak`, `photo:yaksheshwar`. Locator: Two roofs, brick/timber, carved struts and Shaiva imagery.

### Significance

The shrine represents worship of Shiva within Bhaktapur's own palace-square setting. Its alternate Pashupatinath name expresses that dedication, while its brick-and-timber form demonstrates another architectural approach beside the square's stone temples. Its identity should remain distinct from both neighboring monuments and the Kathmandu Pashupatinath complex.

Claim ID: `yaksheshwar:significance`. Source IDs: `local-yak`, `doa22`. Locator: Bhaktapur-specific Shiva shrine; no Kathmandu history transferred.

### Damage & restoration

The 2015 earthquake partially damaged the temple. DoA's 2022 report describes conservation without wholesale dismantling, with work still ongoing at that time. The report does not establish a later completion date.

Claim ID: `yaksheshwar:restoration`. Source IDs: `doa22`. Locator: Project 23 p65: partial damage and conservation progress in 2022.

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


## Heritage book revision - 24 October 2026

This revision supersedes older prose where noted. Original image credits/licenses, model bindings and interaction zones are unchanged. The opening now prioritizes the monument story; uncertainty remains explicit in facts, patronage and sources.

### quickFacts

- Period: 15th century, according to DoA [doa22]
- Dedication: Shiva; locally Pashupatinath [local-yak, doa22]
- Royal association: Yaksha Malla in NTB and local accounts [ntb-cultural, local-yak]
- Form: Two-roof brick-and-timber temple [photo:yaksheshwar, local-yak]

Claim ID: `yaksheshwar:book:quickFacts`. Source IDs: doa22, ntb-cultural, cambridge, local-yak, photo:yaksheshwar. Locator: DoA 2022 project 23 p65; NTB Cultural Treasures Bhaktapur passage; Cambridge 2022 Pashupatinath caption; local exact-year attribution.

### timeline

- 15th century: Period in DoA; royal association with Yaksha Malla in NTB. [doa22, ntb-cultural]
- 2015: Temple partially damaged by earthquake. [doa22]
- 2022: DoA and Cambridge document conservation activity. [doa22, cambridge]

Claim ID: `yaksheshwar:book:timeline`. Source IDs: doa22, ntb-cultural, cambridge, local-yak, photo:yaksheshwar. Locator: DoA 2022 project 23 p65; NTB Cultural Treasures Bhaktapur passage; Cambridge 2022 Pashupatinath caption; local exact-year attribution.

### story

Yaksheshwar is a two-roof Hindu temple dedicated to Shiva, also known locally as Pashupatinath of Bhaktapur. It stands south of Vatsala in the central square. The broad tiled roofs, brick body and carved timber work make it easy to distinguish from the neighboring stone shikhara. The shared Pashupatinath name should not lead visitors to borrow the history of the much larger Kathmandu temple complex. This is Bhaktapur's own shrine, with its own position in the religious and architectural life of Durbar Square.

The Department of Archaeology identifies Yakshyashwor as a fifteenth-century temple. A local account associates it with Yaksha Malla and gives 1475, but that exact year has not been independently established here. The broader fifteenth-century date is therefore preferred, with royal patronage presented as an attributed local account.

Its Shiva dedication explains the Pashupatinath name. The temple belongs to a square containing several different shrines and architectural types; sharing a deity or a familiar sacred name does not make those monuments interchangeable. Its older history is considered separately from the conservation work undertaken after 2015.

Claim ID: `yaksheshwar:book:story`. Source IDs: doa22, ntb-cultural, cambridge, local-yak, photo:yaksheshwar. Locator: DoA 2022 project 23 p65; NTB Cultural Treasures Bhaktapur passage; Cambridge 2022 Pashupatinath caption; local exact-year attribution.

### purpose

The shrine is dedicated to Shiva. Pashupatinath expresses that association, while Yaksheshwar preserves the Bhaktapur temple's locally recognized identity. A shared deity and name connect religious traditions, but do not transfer Kathmandu's much larger temple complex to this square.

The source material does not establish a complete original commissioning narrative or a present ritual timetable. The visitor can begin instead with the documented dedication, fifteenth-century period and distinctive two-roof architecture.

Claim ID: `yaksheshwar:book:purpose`. Source IDs: doa22, ntb-cultural, cambridge, local-yak, photo:yaksheshwar. Locator: DoA 2022 project 23 p65; NTB Cultural Treasures Bhaktapur passage; Cambridge 2022 Pashupatinath caption; local exact-year attribution.

### patron

NTB's Cultural Treasures publication credits Yaksha Malla with the fifteenth-century Yaksheswara Mahadev temple. This strengthens the royal association beyond the local account alone. The precise year 1475 remains a locally reported date, not independently confirmed by the official conservation report.

Recent work is recorded by the Department of Archaeology. The institution conserving a damaged shrine and the king associated with its founding belong to different parts of the history.

Claim ID: `yaksheshwar:book:patron`. Source IDs: doa22, ntb-cultural, cambridge, local-yak, photo:yaksheshwar. Locator: DoA 2022 project 23 p65; NTB Cultural Treasures Bhaktapur passage; Cambridge 2022 Pashupatinath caption; local exact-year attribution.

### culturalRole

Local documentation connects Shaiva imagery with the carved timber. Tundal is a term used for the roof-supporting struts of Newar architecture: these can combine structural work with carved imagery. The broad overhangs above them shelter a very different temple profile from Vatsala's exposed stone shikhara.

Cambridge's 2022 photograph records reconstruction at the Pashupatinath temple. That dated observation supports the conservation history, but not an exact later completion date. The story of repair should not erase the older dedication or be substituted for a founding date.

Claim ID: `yaksheshwar:book:culturalRole`. Source IDs: doa22, ntb-cultural, cambridge, local-yak, photo:yaksheshwar. Locator: DoA 2022 project 23 p65; NTB Cultural Treasures Bhaktapur passage; Cambridge 2022 Pashupatinath caption; local exact-year attribution.

### whatToNotice

- The broad lower tiled roof and smaller upper roof.
- Deep eaves and supporting carved struts.
- The central timber entrance.
- The brick base and body beneath the roof planes.

Claim ID: `yaksheshwar:book:whatToNotice`. Source IDs: doa22, ntb-cultural, cambridge, local-yak, photo:yaksheshwar. Locator: DoA 2022 project 23 p65; NTB Cultural Treasures Bhaktapur passage; Cambridge 2022 Pashupatinath caption; local exact-year attribution.

### restoration

The 2015 earthquake partially damaged the temple. DoA's 2022 report describes conservation without wholesale dismantling, with work still ongoing at that time. The report does not establish a later completion date.

Claim ID: `yaksheshwar:book:restoration`. Source IDs: doa22, ntb-cultural, cambridge, local-yak, photo:yaksheshwar. Locator: DoA 2022 project 23 p65; NTB Cultural Treasures Bhaktapur passage; Cambridge 2022 Pashupatinath caption; local exact-year attribution.

### Conflicts / decisions



### Sources reviewed

- `doa22`: Department of Archaeology, Nepal / UNESCO, [State of Conservation Report 2022: Kathmandu Valley](https://whc.unesco.org/document/191662). Monument-specific conservation project reports; PDF page numbers are one-based. Access/review 2026-10-24.
- `ntb-cultural`: Nepal Tourism Board, [Cultural Treasures of Nepal](https://trade.ntb.gov.np/wp-content/uploads/2023/04/cultural-treasures-of-nepal-inside.pdf). Search-index corroboration only: direct PDF retrieval failed. Not the sole source for published claims. Access/review 2026-10-24.
- `cambridge`: University of Cambridge Museums, [Continuity and change in the Durbar Square at Bhaktapur, Nepal](https://museums.cam.ac.uk/story/continuity-and-change-in-the-durbar-square-at-bhaktapur-nepal/). Institutional interpretation and identified photographs. Access/review 2026-10-24.
- `local-yak`: Bhaktapur.com, [Pashupatinath Temple](https://www.bhaktapur.com/discover/pashupatinath-temple/). Bhaktapur monument, not the Kathmandu temple complex. Access/review 2026-10-24.
- `photo:yaksheshwar`: Wikimedia Commons / Suraj Belbase, [Two-roof Yaksheshwar / Pashupatinath temple; this post-earthquake photograph also shows Vatsala ruins.](https://commons.wikimedia.org/wiki/File:15th_Century_Yaksheswor_Temple_also_called_Pashupatinath_of_Bhaktapur_01.jpg). Photographic form evidence only; not authority for construction dates or patronage. Access/review 2026-10-24.

No present-day access schedule, unnamed founding patron or precise historic date is inferred from a photograph. Search-index-only and blocked retrievals are identified in the source records.
