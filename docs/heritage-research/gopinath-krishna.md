# Gopinath Temple

Game ID: `gopinath-krishna`. Real-world identity: Gopinath Temple.
Historical identity: source-supported; rendered binding: PROVISIONAL. Research reviewed 2026-10-18; ready with stated limits.

## Object mapping and interaction

- Source component(s), under `src/game/architecture/`: gopinath-model.ts; spatially-audited-models.ts.
- Nominal source/visual frame (X,Z,yaw radians, rounded where indicated): `[-97.272, -14.605, 1.492796]`. These are existing working values, not new coordinates.
- Current saved parent override observed read-only: `null`.
- Exact runtime frame: `buildCompletedSquareModels()` final origin/yaw, then caller-provided saved parent transform. Full XYZ Euler and scale are respected, including the frozen Khauma transform.
- Local interaction X,Z offset: `[0,8.2]`; Y = half player height. Radius: 4.5 m.
- Offset is outside the modeled entrance/stair/footing; manual traversal confirmation remains required.
- Reconstruction: placement APPROXIMATE; architecture PHOTO_INFERRED; dimensions APPROXIMATE. No source or editor coordinates changed.

## Historical content and claim traceability

Phase 10B.1: visitor-first rewrite; restoration is a separate, secondary chapter. Existing evidence states, photos, zones and conflicts are preserved.

### Overview

This two-roof Hindu temple belongs to the western entrance cluster of Durbar Square. The Department of Archaeology calls it Gopi Nath and also identifies it as Dwarika or Krishna Temple; Radhakrishna is another documented local name. These names point to its Krishna dedication rather than to several different buildings. The broad tiled roofs and carved timber entrance give it a markedly different character from the square's stone shikhara temples. Its original construction date and founding patron are not securely established by the sources used here.

Claim ID: `gopinath-krishna:overview`. Source IDs: `doa19`, `local-gopi`. Locator: DoA section 1.13 p32; local Radhakrishna name.

### History

The clearest historical identification comes from the Department of Archaeology's Bhaktapur monument entry. It describes a Krishna shrine in the western square and records Satyabhama, Krishna and Radha within the sanctum. A local account instead names Balram with Krishna and Radha. The disagreement concerns the accompanying figures, not the central Krishna dedication.

The temple also belongs to the square's continuing public life. Cambridge Museums documents a traditional dance performed in front of Gopinath Krishna Temple during Gai Jatra in 2022. That observation connects the building to a particular recorded celebration without establishing a fixed ritual timetable for the temple.

Claim ID: `gopinath-krishna:history`. Source IDs: `doa19`, `local-gopi`, `cambridge`. Locator: DoA sanctum figures; differing local deity list; Cambridge 2022 Gai Jatra photograph caption.

### Architecture

Two spreading roofs cover a brick and timber temple. The lower roof is broader, while the smaller upper roof preserves the same strong overhang. Carved timber openings and structural woodwork give the facade depth beneath the eaves.

The Department of Archaeology identifies it as a two-roof Nepalese temple. Its masonry and timber should be understood together: the brick body establishes the enclosure, while the roofs, entrance and supporting woodwork shape much of what a visitor sees.

Claim ID: `gopinath-krishna:architecture`. Source IDs: `doa19`, `photo:gopinath-krishna`. Locator: DoA two-roof form and identified licensed photograph.

### Significance

The Krishna dedication places the temple within the religious landscape of the western square. Its several documented names are part of that identity, although accounts do not agree on every subsidiary deity. The recorded Gai Jatra performance outside it also shows how a temple facade can form a setting for communal cultural activity.

Claim ID: `gopinath-krishna:significance`. Source IDs: `doa19`, `local-gopi`, `cambridge`. Locator: Krishna dedication and documented 2022 public performance.

### Damage & restoration

The 2015 earthquake damaged the sanctum walls. DoA records shoring, repair of masonry and replacement of deteriorated ground-floor Sal timber. Its 2022 account describes conservation without wholesale dismantling, completed in fiscal year 2076-77 BS.

Claim ID: `gopinath-krishna:restoration`. Source IDs: `doa19`, `doa22`. Locator: 2019 section 1.13 p32; 2022 project 2 p44.

## Conflicts

- DoA lists Satyabhama/Krishna/Radha; local account lists Balram/Krishna/Radha. Prefer the official report while retaining the disagreement.

## Unknown / unresolved

- Original construction date and patron UNKNOWN.
- Project footprint-to-identity binding remains PROVISIONAL, despite supported real-world name equivalences.

## Model discrepancies (not corrected)

Project binding remains PROVISIONALLY_IDENTIFIED despite support for the name equivalences. Rear carvings, roof dimensions and exact bearing remain estimated.

## Sources

- `doa19`: [State of Conservation Report 2019: Kathmandu Valley](https://whc.unesco.org/document/171737), Department of Archaeology, Nepal / UNESCO. Monument-specific restoration entries; PDF page numbers are one-based.
- `local-gopi`: [Radhakrishna Temple](https://www.bhaktapur.com/discover/radhakrishna-temple/), Bhaktapur.com. Secondary local account; deity list differs from DoA.
- `doa22`: [State of Conservation Report 2022: Kathmandu Valley](https://whc.unesco.org/document/191662), Department of Archaeology, Nepal / UNESCO. Monument-specific conservation project reports; PDF page numbers are one-based.
- `photo:gopinath-krishna`: [Two-roof temple at the western entrance cluster, identified through the project plan and Department of Archaeology records as Gopinath / Dwarika.](https://commons.wikimedia.org/wiki/File:A_temple_at_the_Entrance_of_Bhaktapur_Durbar_Square.jpg), Wikimedia Commons / Sushilagrg. Photographic form evidence only; not authority for construction dates or patronage.
- `cambridge`: [Continuity and change in the Durbar Square at Bhaktapur, Nepal](https://museums.cam.ac.uk/story/continuity-and-change-in-the-durbar-square-at-bhaktapur-nepal/), University of Cambridge Museums. Institutional interpretation and identified photographs.

## Real photographs

1 gallery entries. Photograph captions are not independent historical authorities.

- Local: `public/heritage/gopinath-krishna/reference.jpg`; Two-roof temple at the western entrance cluster, identified through the project plan and Department of Archaeology records as Gopinath / Dwarika.
  Creator: Sushilagrg. [File page](https://commons.wikimedia.org/wiki/File:A_temple_at_the_Entrance_of_Bhaktapur_Durbar_Square.jpg). [License: CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0). Attribution required: true.
  Source date: 2016-04-28 15:20:31. [Original](https://upload.wikimedia.org/wikipedia/commons/5/50/A_temple_at_the_Entrance_of_Bhaktapur_Durbar_Square.jpg). Commons web-sized rendition; no architectural or visual alterations.


## Heritage book revision - 24 October 2026

This revision supersedes older prose where noted. Original image credits/licenses, model bindings and interaction zones are unchanged. The opening now prioritizes the monument story; uncertainty remains explicit in facts, patronage and sources.

### quickFacts

- Dedication: Krishna, a form of Vishnu [doa19]
- Official alternate names: Dwarika / Krishna Temple [doa19]
- Form: Two-roof Nepalese temple [doa19]
- Conservation: Completed in FY 2076-77 BS, according to DoA [doa22]
- Foundation / patron: Not securely established in the consulted monument reports [doa19, doa22]

Claim ID: `gopinath-krishna:book:quickFacts`. Source IDs: doa19, doa22, cambridge, local-gopi, doa-inventory. Locator: DoA 2019 section 1.13 p32; 2022 project 2 p44; Cambridge Gai Jatra 2022 and archival construction-material captions; later inventory indexed p28.

### timeline

- 2015: Earthquake damaged the sanctum walls. [doa19]
- FY 2076-77 BS: Conservation completed without wholesale dismantling. [doa22]
- 2022: Cambridge records Gai Jatra dancing before the temple. [cambridge]

Claim ID: `gopinath-krishna:book:timeline`. Source IDs: doa19, doa22, cambridge, local-gopi, doa-inventory. Locator: DoA 2019 section 1.13 p32; 2022 project 2 p44; Cambridge Gai Jatra 2022 and archival construction-material captions; later inventory indexed p28.

### story

This two-roof Hindu temple belongs to the western entrance cluster of Durbar Square. The Department of Archaeology calls it Gopi Nath and also identifies it as Dwarika or Krishna Temple; Radhakrishna is another documented local name. These names point to its Krishna dedication rather than to several different buildings. The broad tiled roofs and carved timber entrance give it a markedly different character from the square's stone shikhara temples.

The clearest historical identification comes from the Department of Archaeology's Bhaktapur monument entry. It describes a Krishna shrine in the western square and records Satyabhama, Krishna and Radha within the sanctum. A local account instead names Balram with Krishna and Radha. The disagreement concerns the accompanying figures, not the central Krishna dedication.

The temple also belongs to the square's continuing public life. Cambridge Museums documents a traditional dance performed in front of Gopinath Krishna Temple during Gai Jatra in 2022. That observation connects the building to a particular recorded celebration without establishing a fixed ritual timetable for the temple.

Claim ID: `gopinath-krishna:book:story`. Source IDs: doa19, doa22, cambridge, local-gopi, doa-inventory. Locator: DoA 2019 section 1.13 p32; 2022 project 2 p44; Cambridge Gai Jatra 2022 and archival construction-material captions; later inventory indexed p28.

### purpose

Its documented religious purpose is worship of Krishna. The official names Gopi Nath, Dwarika and Krishna Temple provide a firm identity even where a founding inscription has not been established. The local Radhakrishna name adds another layer of naming without requiring a separate building.

The space in front can host community activity. Cambridge's photograph records Gai Jatra dancing here in 2022. That is evidence of a particular public occasion, not proof of a fixed temple ritual timetable or of the original reason for choosing this site.

Claim ID: `gopinath-krishna:book:purpose`. Source IDs: doa19, doa22, cambridge, local-gopi, doa-inventory. Locator: DoA 2019 section 1.13 p32; 2022 project 2 p44; Cambridge Gai Jatra 2022 and archival construction-material captions; later inventory indexed p28.

### patron

The founding patron and exact year remain unconfirmed in the official monument reports consulted. Popular royal attributions should not replace that missing evidence.

The recent conservation agency is better documented: Bhaktapur's Monument Conservation and Palace Management office worked under the Department of Archaeology, with engineering and archaeological supervision. An institution responsible for modern repairs is not the shrine's original founder. The later official inventory also lists Dwarika/Gopinath as completed; it supplies no missing founding date.

Claim ID: `gopinath-krishna:book:patron`. Source IDs: doa19, doa22, cambridge, local-gopi, doa-inventory. Locator: DoA 2019 section 1.13 p32; 2022 project 2 p44; Cambridge Gai Jatra 2022 and archival construction-material captions; later inventory indexed p28.

### culturalRole

The DoA account makes the dedication more specific than a generic Hindu-temple label. It records Satyabhama, Krishna and Radha in the sanctum. A local account names Balram instead of Satyabhama; the difference is retained rather than hidden. No sanctum interior is invented in the game.

Cambridge's older photograph of building materials in front of the temple and its later festival image also show architecture within a working city. Maintenance and public gatherings are part of the site's recorded life, without explaining every episode in its earlier history.

Claim ID: `gopinath-krishna:book:culturalRole`. Source IDs: doa19, doa22, cambridge, local-gopi, doa-inventory. Locator: DoA 2019 section 1.13 p32; 2022 project 2 p44; Cambridge Gai Jatra 2022 and archival construction-material captions; later inventory indexed p28.

### whatToNotice

- The broad lower roof and smaller upper roof.
- The dark timber entrance beneath deep eaves.
- The raised brick base and central stair approach.
- The contrast with nearby narrow tower forms.

Claim ID: `gopinath-krishna:book:whatToNotice`. Source IDs: doa19, doa22, cambridge, local-gopi, doa-inventory. Locator: DoA 2019 section 1.13 p32; 2022 project 2 p44; Cambridge Gai Jatra 2022 and archival construction-material captions; later inventory indexed p28.

### restoration

The 2015 earthquake damaged the sanctum walls. DoA records shoring, repair of masonry and replacement of deteriorated ground-floor Sal timber. Its 2022 account describes conservation without wholesale dismantling, completed in fiscal year 2076-77 BS.

Claim ID: `gopinath-krishna:book:restoration`. Source IDs: doa19, doa22, cambridge, local-gopi, doa-inventory. Locator: DoA 2019 section 1.13 p32; 2022 project 2 p44; Cambridge Gai Jatra 2022 and archival construction-material captions; later inventory indexed p28.

### Conflicts / decisions

- DoA lists Satyabhama/Krishna/Radha; local account lists Balram/Krishna/Radha. Prefer the official report while retaining the disagreement.

### Sources reviewed

- `doa19`: Department of Archaeology, Nepal / UNESCO, [State of Conservation Report 2019: Kathmandu Valley](https://whc.unesco.org/document/171737). Monument-specific restoration entries; PDF page numbers are one-based. Access/review 2026-10-24.
- `doa22`: Department of Archaeology, Nepal / UNESCO, [State of Conservation Report 2022: Kathmandu Valley](https://whc.unesco.org/document/191662). Monument-specific conservation project reports; PDF page numbers are one-based. Access/review 2026-10-24.
- `cambridge`: University of Cambridge Museums, [Continuity and change in the Durbar Square at Bhaktapur, Nepal](https://museums.cam.ac.uk/story/continuity-and-change-in-the-durbar-square-at-bhaktapur-nepal/). Institutional interpretation and identified photographs. Access/review 2026-10-24.
- `local-gopi`: Bhaktapur.com, [Radhakrishna Temple](https://www.bhaktapur.com/discover/radhakrishna-temple/). Secondary local account; deity list differs from DoA. Access/review 2026-10-24.
- `doa-inventory`: Department of Archaeology / UNESCO World Heritage Centre, [Bhaktapur conservation inventory](https://whc.unesco.org/document/223752). Indexed inventory p28 inspected; full file exceeds retrieval limit. Silu/Fasi Dega marked completed, FY 2078/79 BS remark; Gopinath/Dwarika completed. Exact-day fields not reconciled or converted. Access/review 2026-10-24.

No present-day access schedule, unnamed founding patron or precise historic date is inferred from a photograph. Search-index-only and blocked retrievals are identified in the source records.
