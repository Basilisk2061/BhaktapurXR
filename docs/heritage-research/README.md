# Phase 10B heritage register

Reviewed 18 October 2026. Code/source inspection and historical research only; **no tests, typecheck, build, server, browser review, screenshots or benchmarks were run**. User manual testing remains required.

## Published records

Twelve records replace the single development sample. Eleven rendered bindings are PHOTO_INFERRED; Gopinath remains PROVISIONAL. Supported historical identity is deliberately distinguished from surveyed model accuracy: no placement or dimension has been upgraded to VERIFIED.

Each linked dossier contains the requested identity, source component, existing nominal world frame, saved parent override observed read-only, interaction offset/radius, history, architecture, significance, claim-to-source mapping, conflicts, unknowns, model discrepancies and individual photo credits/license/local paths.

| Record and game ID | Historical findings | Images / radius |
|---|---|---|
| [Golden Gate](golden-gate.md), `golden-gate` | Palace/Taleju portal; Ranjit Malla completion attributed 1754 by Cambridge, 1753 in an NTB booklet; gilded metalwork and torana. | 2 / 4.5 m |
| [Fifty-Five Window Palace](fifty-five-frontage.md), `fifty-five-frontage` | Specific conservation report: 1702-1722, Bhupatindra; earlier-site chronology differs. Carved window gallery, murals, 1934 damage and salvage/rebuilding. | 1 / 4.5 m |
| [National Art Gallery](gallery-frontage.md), `gallery-frontage` | Museum established 1960; older royal palace wing, guardian entrance and distinct adjoining white frontage; 2015 damage/conservation. | 2 / 4.5 m |
| [Gopinath / Dwarika](gopinath-krishna.md), `gopinath-krishna` | Krishna identity and two roofs supported by DoA; Radhakrishna secondary name; conflicting companion deity lists; 2015 repairs. Mapped binding remains provisional. | 1 / 4.5 m |
| [Vatsala Durga](vatsala-durga.md), `vatsala-durga` | Sandstone shikhara; conflicting 1696 versus 1672/1674 accounts; 2015 collapse and foundation-led reconstruction. | 1 / 4.5 m |
| [Taleju / Large Bell](large-bell.md), `large-bell` | Ranjit Malla / 1737 attributed by NTB and local account; worship of Taleju. Separate from the unresolved small bell. | 1 / 3.5 m |
| [Bhupatindra Malla Column](malla-column.md), `malla-column` | Prayerful seated ruler, lotus capital and parasol; exact installation year withheld; local interpretation explicitly identified. | 1 / 3 m |
| [Chyasilin Mandap](chyasilin.md), `chyasilin` | Octagonal royal viewing pavilion; 1934 loss; modern reconstruction proposed 1987, 1990 dated work, steel reinforcement and 2015 survival. | 2 / 4.5 m |
| [Khauma Gate](khauma-gate.md), `khauma-gate` | Western city-entry gate; DoA documents 2015 damage and traditional restoration. Original date/patron unknown. | 1 / 4.5 m |
| [Yaksheshwar / Pashupatinath](yaksheshwar.md), `yaksheshwar` | Southern two-roof Shiva temple; DoA 15th century, partial 2015 damage and conservation still ongoing in 2022. | 1 / 4.5 m |
| [Siddhi Lakshmi](siddhi-lakshmi.md), `siddhi-lakshmi` | 17th-century stone shikhara, elevated guardian stairs; damaged rather than collapsed in 2015, reused stones and retained base. | 1 / 4.5 m |
| [Silu Mahadev / Fasi Dega](silu-mahadev.md), `silu-mahadev` | Stepped Shiva site, 1934 damage, subsequent dome replacement, 2015 loss and recovery of pre-1934 form. Original patron/date unknown. | 1 / 4.5 m |

## Identity audit

The [pre-content inventory](inventory.md) was created before replacing the sample. It records scene-source relationships, source coordinates and saved overrides. It is a captured preliminary inventory, not a replacement for final rendered correction layers.

The unspecified 'other temple near Golden Gate' has three distinct candidates: Vatsala Durga in the forecourt, Yaksheshwar/Pashupatinath to its south, and the small red corner shrine immediately east of the gate. The first two have separate records. The corner shrine remains UNRESOLVED; proximity is insufficient to name it Ganesh or Taleju.

[Unresolved research](unresolved.md) records Rameshwar, Badrinath, substituted Kedarnath, the small bell, eastern small shikhara, Yetachapari/Tawa correspondence, inner Taleju, removed Jagannath, Nyatapola naming and excluded research. No invented identities or extra architecture were added. No generic context buildings received records.

## Sources and traceability

- Principal sources: Nepal Department of Archaeology's [2019](https://whc.unesco.org/document/171737) and [2022](https://whc.unesco.org/document/191662) reports hosted by UNESCO; monument-level entries and PDF page locators are recorded.
- [Cambridge Museums](https://museums.cam.ac.uk/story/continuity-and-change-in-the-durbar-square-at-bhaktapur-nepal/) supplies palace/gate interpretation and identified photographs.
- [Ram Govinda Shrestha's 2006 conservation report](https://www.lth.se/fileadmin/hdm/alumni/papers/cmhb2005/cmhb2005-27.pdf) supports palace fabric, windows, murals and earthquake history.
- Nepal Tourism Board supplies museum establishment/collections and palace context. Conflicting chronology and unavailable booklet retrieval are flagged.
- [The first-hand Chyasilin reconstruction account](https://www.asianart.com/articles/mandap/) is used for modern reconstruction and reinforcement.
- Local heritage accounts supplement naming, bell and column interpretation; they are identified as secondary sources and are not silently promoted to government evidence.

Runtime `records.json` preserves a stable claim ID for each published section, the exact statement, supporting source IDs and a source locator. `sources.json` is the source catalogue. Dossiers preserve disagreements and exclusions. Image source claims are limited to visible form and dated appearance; Commons descriptions are not used as historical authorities. This is a structured foundation for later retrieval, **not an AI system**. No AI/RAG was implemented and no embedding/vector dependency was added.

## Image license audit

Fourteen unique local photographs, fifteen gallery entries (the bell/whole-Chyasilin view is reused). Each was checked against Commons license/creator metadata before download and inspected for actual depicted form. Assets are web-sized Commons renditions, not originals or generated/retouched architecture. No Google screenshots, unlicensed owner references or research PDFs are redistributed.

Creators: Manoguru (CC BY-SA 3.0); Maesi64 (CC0); Rajesh Dhungana, Sushilagrg, Dolon Prova, Gerd Eichmann, Shadow Ayush, Suraj Belbase, Goutam1962 (CC BY-SA 4.0); Steve Edwards (CC BY-SA 2.0). See [image-manifest.json](image-manifest.json) and each dossier for exact file pages, original/download URLs, creator strings, dates, license URLs, attribution requirements and rendition notes. UI credits link to the license and file page. Share-alike licenses remain attached to the images; no blanket relicensing is claimed.

[Rejected image metadata](image-rejections.json) records a file labelled Chyasilin that actually shows a different three-tier pavilion, and an ambiguous Pashupatinath frontal candidate replaced by a securely identified oblique view. Rejected copies are not packaged. Photos from 2014-2016 are explicitly dated/contextualized; they are not presented as current earthquake-free views.

## Interaction and performance

Zones are local viewing offsets from the same final `buildCompletedSquareModels()` pipeline used by the renderer, followed by full saved parent Euler/scale overrides. Museum X follows the actual entrance calculation. Siddhi/Silu offsets lie beyond existing stair feet. Approximate radii remain 3-4.5 m; nearest-only arbitration is unchanged.

Frame extraction runs once lazily when heritage zones are first requested, retaining only source transforms and the museum doorway X. It temporarily runs the existing monument data builder; it creates no second rendered scene or GPU resource. No per-frame architecture build, additional draw calls or render passes were added. Photos are ordinary gallery images, not scene textures, and only the selected photograph is rendered. Runtime cost has not been benchmarked, per instruction.

Limitations: manual access/overlap checks remain required, especially the dense bell/column cluster. Zones follow parent transforms, not arbitrary later independent editor-part edits. No claim of measured accessibility or visual approval is made. Source positions, geometry, saved state, full-world rendering, movement, mobile controls, NPCs, audio, physics and homepage remain unchanged.

## Model discrepancies discovered, not fixed

See the 'Model discrepancies' section in every dossier. Important findings: unresolved corner shrine/small-bell naming; Gopinath's provisional footprint binding; large-bell two-pier modeled interpretation versus four-support wording in a local account; Chyasilin's modern reinforcement absent from the simplified exterior; historical stone/metal/guardian detail represented procedurally; palace/museum phases and murals not fully modeled; no exact original dates or metric dimensions can be recovered from these models. These findings are documentation, not authorization for geometry corrections.

Manual review: `/explore?world=bhaktapur`; approach each existing landmark, use the existing heritage interaction, review its sources/gallery, close it and confirm normal controls resume. No new review routes or systems were created.

## Phase 10B.1 visitor-first edition

All twelve player-facing records were rewritten to lead with identity, patronage where known, original purpose, historical use and architectural character. Earthquake and conservation information now occupies the separate `restoration` field, displayed after cultural/religious significance. Sparse founding evidence remains sparse; no invented dates or rulers were added. Existing conflicts and reconstruction classifications remain in place. Each dossier and runtime claim statement was updated to match the revised text, including restoration source locators.

The existing Cambridge Museums, first-hand Chyasilin, DoA 2019/2022 and palace conservation sources were revisited; NTB museum information was rechecked. No new source catalogue entries were required. The existing Cambridge source now also supports the documented Gai Jatra performance outside Gopinath in 2022. This is a specific observed event, not an invented recurring ceremony schedule. Local bell and column interpretations remain attributed.

The prompt now sits at 28vh from the bottom with a distinct E key, Explore History label and larger monument name; touch uses the same two-line tappable prompt. CSS provides a walnut-framed parchment book, a two-page desktop spread with a subtle gutter, and a single-page phone layout including short touch-landscape screens. Existing licensed photographs remain uncropped with visible attribution/license links. Interaction polling, nearest selection, zones, input/focus handling and Escape behavior are unchanged. No tests, typecheck, build, server or visual/browser testing were run, per user instruction. Manual approval is still required.
