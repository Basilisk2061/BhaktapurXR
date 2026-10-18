# Vatsala Durga Temple

Game ID: `vatsala-durga`. Real-world identity: Vatsala Durga Temple.
Historical identity: source-supported; rendered binding: PHOTO_INFERRED. Research reviewed 2026-10-18; ready with stated limits.

## Object mapping and interaction

- Source component(s), under `src/game/architecture/`: central-stone-ensemble.ts / temple; square-completion.ts / refineSelectedMonumentStone.
- Nominal source/visual frame (X,Z,yaw radians, rounded where indicated): `[-10.013, 7.277, 0]`. These are existing working values, not new coordinates.
- Current saved parent override observed read-only: `null`.
- Exact runtime frame: `buildCompletedSquareModels()` final origin/yaw, then caller-provided saved parent transform. Full XYZ Euler and scale are respected, including the frozen Khauma transform.
- Local interaction X,Z offset: `[-6.8,0]`; Y = half player height. Radius: 4.5 m.
- Offset is outside the modeled entrance/stair/footing; manual traversal confirmation remains required.
- Reconstruction: placement APPROXIMATE; architecture PHOTO_INFERRED; dimensions APPROXIMATE. No source or editor coordinates changed.

## Historical content and claim traceability

### Overview

Vatsala Durga is the stone shikhara temple in the central palace forecourt. Its Durga dedication and three-stage plinth are documented by the Department of Archaeology. It is distinct from the nearby two-roof Yaksheshwar temple and from other Vatsala-named shrines.

Claim ID: `vatsala-durga:overview`. Source IDs: `doa19`. Locator: DoA 2019 section 1.15, PDF pp32-33; compare separate Yantra Vatsala entry 1.12.

### History

DoA gives an initial construction under Jitamitra Malla in 1696 and rebuilding under Bhupatindra Malla around the turn of the 18th century. A local account instead gives 1672 and 1674. The 2015 earthquake destroyed the temple. Foundation investigations involved DoA, UNESCO and Durham University, followed by municipal reconstruction on the retained foundation. The 2019 report describes work still in progress.

Claim ID: `vatsala-durga:history`. Source IDs: `doa19`, `local-vatsala`. Locator: DoA section 1.15, pp32-33; local Vatsala chronology.

### Architecture

The sandstone temple combines a substantial stepped base, axial stairs, guardians and a deeply articulated lower level beneath a tapering shikhara. Secondary projections, niches, cornices and an ornamental crown break up the stone tower. The licensed 2026 photograph documents the standing rebuilt form rather than proving an exact completion date.

Claim ID: `vatsala-durga:architecture`. Source IDs: `doa19`, `photo:vatsala-durga`. Locator: DoA three-stage plinth and sandstone description; licensed 2026 forecourt photograph.

### Significance

Its dedication to Durga places the shrine within the palace square's religious ensemble. The reconstructed building also records the substantial conservation response to the 2015 earthquake.

Claim ID: `vatsala-durga:significance`. Source IDs: `doa19`. Locator: DoA dedication and post-earthquake reconstruction account.

## Conflicts

- DoA 1696/Jitamitra then Bhupatindra versus local 1672/Jagat Prakash and 1674/Jitamitra. No single uncontested original date claimed.

## Unknown / unresolved

- Exact modern reconstruction completion date not established here.
- The smaller adjacent bell is not assigned the Barking Bell story or a date without secure object binding.

## Model discrepancies (not corrected)

Stone courses, guardians, reliefs and proportions remain procedural interpretations. The real temple is sandstone; rendered material variation is not a fabric analysis.

## Sources

- `doa19`: [State of Conservation Report 2019: Kathmandu Valley](https://whc.unesco.org/document/171737), Department of Archaeology, Nepal / UNESCO. Monument-specific restoration entries; PDF page numbers are one-based.
- `local-vatsala`: [Vatsala Durga Temple](https://www.bhaktapur.com/discover/vatsala-durga-temple/), Bhaktapur.com. Secondary chronology conflicts with DoA; not silently reconciled.
- `photo:vatsala-durga`: [Vatsala Durga and its forecourt, photographed in 2026.](https://commons.wikimedia.org/wiki/File:Vatsala_Temple_by_Bhaktapur_(1).jpg), Wikimedia Commons / Dolon Prova. Photographic form evidence only; not authority for construction dates or patronage.

## Real photographs

1 gallery entries. Photograph captions are not independent historical authorities.

- Local: `public/heritage/vatsala-durga/reference.jpg`; Vatsala Durga and its forecourt, photographed in 2026.
  Creator: Dolon Prova. [File page](https://commons.wikimedia.org/wiki/File:Vatsala_Temple_by_Bhaktapur_(1).jpg). [License: CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0). Attribution required: true.
  Source date: 2026-03-28 06:51:13. [Original](https://upload.wikimedia.org/wikipedia/commons/4/41/Vatsala_Temple_by_Bhaktapur_%281%29.jpg). Commons web-sized rendition; no architectural or visual alterations.
