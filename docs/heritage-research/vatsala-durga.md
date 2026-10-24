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

Phase 10B.1: visitor-first rewrite; restoration is a separate, secondary chapter. Existing evidence states, photos, zones and conflicts are preserved.

### Overview

Vatsala Durga is a Hindu temple dedicated to Durga in the royal forecourt. Its stone shikhara rises from a substantial stepped base, setting it apart from the brick-and-timber temples with spreading tiled roofs. The main stair, guardian sculptures and richly divided lower level are important parts of its identity, not simply a pedestal beneath the tower. It belongs to the religious setting of the palace square, but it is a separate shrine from the nearby two-roof Yaksheshwar temple and from other temples bearing the Vatsala name.

Claim ID: `vatsala-durga:overview`. Source IDs: `doa19`, `photo:vatsala-durga`. Locator: Section 1.15 pp32-33, dedication/form; licensed forecourt photo.

### History

Sources disagree about the temple's beginnings. The Department of Archaeology records construction under Jitamitra Malla in 1696, followed by rebuilding under Bhupatindra Malla around the turn of the eighteenth century. A local account instead associates an earlier phase with Jagat Prakash Malla in 1672 and Jitamitra Malla in 1674. These competing accounts are retained rather than combined into a false single chronology.

What is clear is the temple's Durga dedication and its place among the Malla-period shrines of the palace forecourt. Its history should begin with that religious and royal setting, even though the building visible today also carries the story of more recent reconstruction.

Claim ID: `vatsala-durga:history`. Source IDs: `doa19`, `local-vatsala`. Locator: DoA 1696/Jitamitra and Bhupatindra account versus local 1672/1674 chronology.

### Architecture

The temple is described by DoA as a sandstone shikhara on a three-stage plinth. Its stair approach leads toward a strongly articulated entrance. Guardians, columns, projecting mouldings and recessed areas establish a sequence of light and shadow before the eye reaches the main tower.

Above, the tapering shikhara is broken into architectural zones, with secondary projections, niches and an ornamental crown. The stone surface gives the temple a different weight and texture from the broad-roofed timber temples nearby.

Claim ID: `vatsala-durga:architecture`. Source IDs: `doa19`, `photo:vatsala-durga`. Locator: Sandstone, three-stage plinth; visible stairs, guardians and tower articulation.

### Significance

The dedication to Durga is central to the shrine's identity. Its position in the palace forecourt brings that religious role into close relationship with the former royal complex. For visitors, the contrast between its stone tower and the surrounding roofed temples also reveals the range of architectural traditions represented within one square.

Claim ID: `vatsala-durga:significance`. Source IDs: `doa19`. Locator: Durga dedication and palace-square monument context; architectural comparison is visible form.

### Damage & restoration

The temple collapsed in the 2015 earthquake. DoA, UNESCO and Durham University investigated the foundations, and municipal reconstruction proceeded on the retained base. Work was ongoing in the 2019 report. The included 2026 photograph shows the rebuilt temple standing; it does not establish an exact completion date.

Claim ID: `vatsala-durga:restoration`. Source IDs: `doa19`, `photo:vatsala-durga`. Locator: Section 1.15 foundation investigation/reconstruction progress; dated 2026 photograph.

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


## Heritage book revision - 24 October 2026

This revision supersedes older prose where noted. Original image credits/licenses, model bindings and interaction zones are unchanged. The opening now prioritizes the monument story; uncertainty remains explicit in facts, patronage and sources.

### quickFacts

- Dedication: Vatsala Devi, a form of Durga [doa19]
- First phase: 1696 under Jitamitra Malla, according to DoA [doa19, getty-vatsala]
- Later patron: Bhupatindra Malla [doa19, nhdp-vatsala]
- Form: Sandstone shikhara on a three-stage base [doa19]
- Recent rebuilding: Municipal completion in 2020, according to NHDP [nhdp-vatsala]

Claim ID: `vatsala-durga:book:quickFacts`. Source IDs: doa19, nhdp-vatsala, getty-vatsala, local-vatsala. Locator: DoA 2019 section 1.15 pp32-33; Getty CONA creation display; NHDP selected-monument paragraphs 1-3. Other Vatsala shrines are not conflated.

### timeline

- 1696: Original construction under Jitamitra in DoA/Getty accounts. [doa19, getty-vatsala]
- Late 17th / early 18th century: Bhupatindra reconstruction; NHDP gives 1699. [doa19, nhdp-vatsala]
- 2015: Upper temple collapsed in the earthquake. [doa19]
- 2020: Municipal reconstruction completed, according to NHDP. [nhdp-vatsala]

Claim ID: `vatsala-durga:book:timeline`. Source IDs: doa19, nhdp-vatsala, getty-vatsala, local-vatsala. Locator: DoA 2019 section 1.15 pp32-33; Getty CONA creation display; NHDP selected-monument paragraphs 1-3. Other Vatsala shrines are not conflated.

### story

Vatsala Durga is a Hindu temple dedicated to Durga in the royal forecourt. Its stone shikhara rises from a substantial stepped base, setting it apart from the brick-and-timber temples with spreading tiled roofs. The main stair, guardian sculptures and richly divided lower level are important parts of its identity, not simply a pedestal beneath the tower. It belongs to the religious setting of the palace square, but it is a separate shrine from the nearby two-roof Yaksheshwar temple and from other temples bearing the Vatsala name.

Sources disagree about the temple's beginnings. The Department of Archaeology records construction under Jitamitra Malla in 1696, followed by rebuilding under Bhupatindra Malla around the turn of the eighteenth century. A local account instead associates an earlier phase with Jagat Prakash Malla in 1672 and Jitamitra Malla in 1674. These competing accounts are retained rather than combined into a false single chronology.

What is clear is the temple's Durga dedication and its place among the Malla-period shrines of the palace forecourt. Its history should begin with that religious and royal setting, even though the building visible today also carries the story of more recent reconstruction.

Claim ID: `vatsala-durga:book:story`. Source IDs: doa19, nhdp-vatsala, getty-vatsala, local-vatsala. Locator: DoA 2019 section 1.15 pp32-33; Getty CONA creation display; NHDP selected-monument paragraphs 1-3. Other Vatsala shrines are not conflated.

### purpose

This was a goddess shrine within the religious landscape of the royal forecourt. A shikhara is a tapering temple tower; here stone construction gives that upright form a different character from the surrounding tiled roofs. The temple's proximity to the palace matters, but it does not make it the palace entrance or the same shrine as Taleju.

The nearby bell assemblies also require care. The large independent royal bell has its own Taleju-related history. A smaller bell belongs to the temple-side composition. Their stories and dates should not migrate between objects simply because both appear in a view of Vatsala.

Claim ID: `vatsala-durga:book:purpose`. Source IDs: doa19, nhdp-vatsala, getty-vatsala, local-vatsala. Locator: DoA 2019 section 1.15 pp32-33; Getty CONA creation display; NHDP selected-monument paragraphs 1-3. Other Vatsala shrines are not conflated.

### patron

Jitamitra Malla is the original patron named by DoA for the 1696 phase; Bhupatindra Malla is credited with later reconstruction. Getty follows this sequence. NHDP dates the Bhupatindra temple to 1699. These statements give a more useful layered history than assigning every surviving stone to one undifferentiated campaign.

Recent reconstruction was undertaken by Bhaktapur Municipality in coordination with heritage authorities. Modern responsibility for recovery is distinct from royal founding patronage and from the organizations investigating the foundations after the earthquake.

Claim ID: `vatsala-durga:book:patron`. Source IDs: doa19, nhdp-vatsala, getty-vatsala, local-vatsala. Locator: DoA 2019 section 1.15 pp32-33; Getty CONA creation display; NHDP selected-monument paragraphs 1-3. Other Vatsala shrines are not conflated.

### culturalRole

The dedication to Vatsala Devi places the monument within Bhaktapur's goddess traditions. The university heritage account describes Vatsala as a tantric manifestation of Parvati and records a stone vessel-form representation in the sanctum. That concerns the real shrine's identity, not a publicly modeled interior.

Sensitive or sensational stories are not needed to understand the building. Its dedication, patronage, carved stone architecture and repeated reconstruction already provide a substantial history. A visitor can begin with the stair, lower columns and guardian setting before following the tower to its crown.

Claim ID: `vatsala-durga:book:culturalRole`. Source IDs: doa19, nhdp-vatsala, getty-vatsala, local-vatsala. Locator: DoA 2019 section 1.15 pp32-33; Getty CONA creation display; NHDP selected-monument paragraphs 1-3. Other Vatsala shrines are not conflated.

### whatToNotice

- The broad stepped base and main stair.
- The lower columns, recessed entrance and guardian silhouettes.
- Layered stone mouldings and secondary tower forms.
- The tapering shikhara and ornamental crown.

Claim ID: `vatsala-durga:book:whatToNotice`. Source IDs: doa19, nhdp-vatsala, getty-vatsala, local-vatsala. Locator: DoA 2019 section 1.15 pp32-33; Getty CONA creation display; NHDP selected-monument paragraphs 1-3. Other Vatsala shrines are not conflated.

### restoration

The upper temple collapsed in 2015. DoA, UNESCO and Durham University investigated the surviving foundation before municipal reconstruction. The 2019 report recorded work in progress. NHDP reports municipal completion in 2020. The dated photograph in this guide records a later standing condition, not the completion day.

Claim ID: `vatsala-durga:book:restoration`. Source IDs: doa19, nhdp-vatsala, getty-vatsala, local-vatsala. Locator: DoA 2019 section 1.15 pp32-33; Getty CONA creation display; NHDP selected-monument paragraphs 1-3. Other Vatsala shrines are not conflated.

### Conflicts / decisions

- DoA 1696/Jitamitra then Bhupatindra versus local 1672/Jagat Prakash and 1674/Jitamitra. No single uncontested original date claimed.
- DoA 1696 Jitamitra/later Bhupatindra sequence and NHDP Bhupatindra/1699 attribution concern layered phases; local 1672/1674 claims are not silently merged.

### Sources reviewed

- `doa19`: Department of Archaeology, Nepal / UNESCO, [State of Conservation Report 2019: Kathmandu Valley](https://whc.unesco.org/document/171737). Monument-specific restoration entries; PDF page numbers are one-based. Access/review 2026-10-24.
- `nhdp-vatsala`: NHDP / Heidelberg University, [Vatsala Mandira, Bhaktapur](https://www.fid4sa.de/themen/selected-monuments/vatsala-mandira-bhaktapur). Bhupatindra/1699 attribution, twelve columns, three-level base; municipal rebuilding completed in 2020. Access/review 2026-10-24.
- `getty-vatsala`: Getty Research Institute, [Vatsala Durga temple, CONA 700008635](https://www.getty.edu/cona/CONAFullSubject.aspx?subid=700008635). 1696 Jitamitra patronage, early eighteenth-century rebuilding. Old ongoing-reconstruction status is not current-condition evidence. Access/review 2026-10-24.
- `local-vatsala`: Bhaktapur.com, [Vatsala Durga Temple](https://www.bhaktapur.com/discover/vatsala-durga-temple/). Secondary chronology conflicts with DoA; not silently reconciled. Access/review 2026-10-24.

No present-day access schedule, unnamed founding patron or precise historic date is inferred from a photograph. Search-index-only and blocked retrievals are identified in the source records.
