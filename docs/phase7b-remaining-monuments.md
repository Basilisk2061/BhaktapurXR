# Phase 7B - remaining major monuments

Engineering implementation complete; human architectural review remains required. Baseline: `1ac611e15d1f3692e2b2c3aeee0084477b15f9d9`. No urban-enclosure phase started.

## Frozen-data confirmation

Phase 6 scale, WGS84 origin, rigid rotation/translation, source footprints, original UNESCO tracing, open spaces and uncertainty metadata are unchanged. All nine accepted central model outputs (including palace return, materials, Vatsala, Gate, Chyasilin, Malla and bells) remain identical. The central generator/specifications/proportion data and five original review presets are unchanged. Existing 92 tests are preserved unchanged.

Normal gameplay calls `buildPhase7Models()`: it removes each replaced ID from the legacy baseline composition and inserts exactly one new assembly at the same anchor. `buildCentralModels()` remains a historical comparison API, including its old six neutral blocks; it is never rendered alongside the replacements. No footprint-index assignment, second renderer or duplicate collider is active.

Fitted coordinate decimals identify the accepted data exactly; they do not indicate surveyed precision. Local model extents, projections, stairs and front directions are rendering assumptions. Nothing was re-registered or moved for aesthetics.

## Evidence method and accuracy

Each of the six specifications separates identity, spatial, present-day, architectural and excluded historical sources. No measured metre dimensions were recovered for these six monuments; `dimensions.documented` is empty for every target. Roof/post counts and visible morphology are recorded as features. The original source footprints are SOURCE_DERIVED schematic linework; positions remain APPROXIMATE. Badrinath has a point only and retains a null source footprint. All elevations and locally rendered extents are APPROXIMATE; appearance, guardians and surface articulation are PHOTO_INFERRED. No new VERIFIED claims.

Photographs supply conservative ratio ranges, never pixel-to-metre measurements. Working ratios below are model ratios selected within broad visual ranges, not calibrated photogrammetric estimates. Perspective, image selection and uncertain footprint meanings remain limitations. Images were inspected at attributed file-page resolutions; original Commons downloads were rate-limited. Research downloads remain temporary and are not redistributed as textures.

UNESCO 2022 project text and the latest indexed monument-status table were inspected. The latter records completed work for Silu, Siddhi, Rameshwor and Dwarika/Gopinath; its full PDF could not be downloaded and reporting year is not established here. This is evidence of reported restoration completion, not a 2026 field inspection. The 2022 Badrinath description contains a historical-year typo (1034), which is not adopted. NTB's [World Heritage Sites booklet](https://trade.ntb.gov.np/wp-content/uploads/2023/04/world-heritage-sites-booklet.pdf) supports the western Chardham inventory only, not dimensions or exact binding.

## Monument specifications

### Siddhi Lakshmi Temple

Identity: `siddhi-lakshmi`. Alternate names: Siddhi Laxmi, Lohan Dega. State: **RECONSTRUCTED_APPROXIMATE**, confidence **MEDIUM**. Family: `TIERED_STONE_SHIKHARA_GUARDIAN_STAIR`.

Exact frozen anchor (X, Z): `[19.59568972671957, 0.5402746051844391]`. Source footprint ID: `siddhi-lakshmi`; role `PLAN_OUTLINE`. Original geometry/metadata are unchanged; the model is not an as-built replacement footprint.

Architecture: Five pale terraces; Axial guardian stair; Rectilinear staged stone tower with projecting niches; Small secondary spires and metal summit.

Known measured dimensions: none. Working local base 7 x 7.4 m; total height 13.8 m; plinth 3.6 m; central body width 2.5 m; stair width 1.5 m. All these metre values are **rendering assumptions**, not documented measurements.

| PHOTO_PROPORTION | Working model ratio | Conservative visual range | View limitation |
|---|---:|---|---|
| height / base width | 1.97 | 1.6-2.2 | Wide frontal versus close upward view; foreground enlargement makes a narrow ratio range unjustified |
| plinth / total height | 0.26 | 0.22-0.34 | Five visible set-back terraces; not fifteen pixel steps converted to metres |
| stair / base width | 0.21 | 0.16-0.27 | Narrow axial stair with paired guardians outside stair corridor |

Orientation: working yaw `-0.135` radians, **APPROXIMATE**. South/plaza approach from palace-at-left frontal views; shallow plan-axis alignment, approximate. Frozen bearing `97.74479247944413` remains unchanged. Exact entrance azimuth not surveyed; frozen rotation metadata untouched. Working local geometry orientation is not a new geographic registration.

Present-day evidence: Underlying maintained/restored architecture, not temporary scaffolding or quake ruins. Dated photographs establish appearance as of their capture, not a 2026 field inspection.

Sources and roles:

- **SPATIAL**: [Map of Bhaktapur Durbar Square](https://commons.wikimedia.org/wiki/File:Map_of_Bhaktapur_Durbar_Square.jpg). Metadata dated 21 November 2006; pre-2015, not certified contemporary survey - Schematic labelled plan without printed scale. Symbol outlines are not necessarily building footprints. Uniform constraint calibration is approximate. Derived tracing data retains attribution/share-alike.
- **IDENTITY**: [Brief Introduction / main square inventory](https://bhaktapurmun.gov.np/en/node/4). Undated current official inventory, checked 2026-10-11 - Palace, gate, gallery, Vatsala, Siddhilaxmi, mandap, column, bell, Pashupatinath, Silu and Chardham inventory. No coordinates, orientations or modern survey dimensions.
- **ARCHITECTURE**: [Restored Siddhi frontal view (misnamed Nyatapola)](https://commons.wikimedia.org/wiki/File:Nyatapola_Temple.jpg). 26 September 2022 EXIF - 500 px file-page preview inspected: stone tower, axial stair and guardian pairs. Filename/depicts tags contradict actual image; image is Siddhi, not five-roof Nyatapola. GPS is camera, never a control.
- **ARCHITECTURE**: [Siddhi wide frontal view](https://commons.wikimedia.org/wiki/File:Siddha_Laxmi_Temple_Bhaktapur_Durbar_Square_Bhaktapur_Nepal_Rajesh_Dhungana_(1).jpg). 20 August 2021 x 960 px preview inspected: five set-back terraces, slender tiered tower, guardians; Silu scaffold behind excluded. Same author/session as existing contextual images is not independent metric control.
- **ARCHITECTURE**: [Siddhi Laxmi](https://www.bhaktapur.com/discover/siddhi-laxmi-temple/). Undated; accessed 2026-10-11 - Supporting local heritage documentation; coordinate acquisition/accuracy unknown. Contradictory Siddhi/palace points excluded; Silu restoration wording stale. Names do not establish measured footprints.
- **PRESENT_DAY**: [Kathmandu Valley SOC 2022, projects 1–5](https://whc.unesco.org/document/191662). 2022; PDF pp43–47 - Full browser text inspected. Siddhi preserves foundation/plinth and reuses stones; Rameshwor four stone pillars; Badrinath restored brick/stone/wood shikhara; Gopinath repaired masonry/timber. Badrinath text has historical-year typo '1034'; not adopted as a date. No measured dimensions obtained.
- **PRESENT_DAY**: [Bhaktapur protected monument zone restoration status](https://whc.unesco.org/document/223752). Latest indexed status table; reporting year not established - Indexed p28 table inspected: Shilu, Siddhilaxmi, Dwarika (Gopinath), Rameshwor completed. Full PDF exceeds browser tool limit and direct download blocked; not an as-built survey.

Intentionally simplified: Ornament represented by restrained cornices, recesses and repeated primitives; Interiors and sculptural carving not reconstructed; Guardians are approximate low-poly silhouettes without per-limb collision.

Unresolved features:

- Guardian identities/ordering simplified from visible forms; not sculptural fidelity
- Precise tower profiles, relief panels and carved stone measurements unknown

### Yaksheshwar / Pashupatinath Temple

Identity: `yaksheshwar`. Alternate names: Yachheswor Mahadev, Yaksheswor. State: **RECONSTRUCTED_APPROXIMATE**, confidence **MEDIUM**. Family: `TWO_ROOF_BRICK_TIMBER_PASHUPATINATH`.

Exact frozen anchor (X, Z): `[-8.076964163653827, 28.061882067991192]`. Source footprint ID: `yaksheshwar`; role `PLAN_OUTLINE`. Original geometry/metadata are unchanged; the model is not an as-built replacement footprint.

Architecture: Two very broad tile roofs; Brick sanctum and timber door rhythm; Separate upper brick chamber; Repeated diagonal struts.

Known measured dimensions: none. Working local base 8 x 8 m; total height 12.3 m; plinth 0.9 m; central body width 5.8 m; stair width 2.1 m. All these metre values are **rendering assumptions**, not documented measurements.

| PHOTO_PROPORTION | Working model ratio | Conservative visual range | View limitation |
|---|---:|---|---|
| lower roof / body width | 2.03 | 1.8-2.2 | Oblique and contextual views show strong broad eave projection |
| upper / lower roof width | 0.61 | 0.55-0.7 | Upper roof clearly smaller, two principal tile roofs |
| height / lower roof width | 1.04 | 0.9-1.25 | Wide roofs dominate silhouette; finial included |

Orientation: working yaw `-0.138` radians, **APPROXIMATE**. Frozen outline axis used only for square wall axes. Approximate openings on four faces, no claim of verified principal entrance. Frozen bearing `97.92711733582206` remains unchanged. Exact entrance azimuth not surveyed; frozen rotation metadata untouched. Working local geometry orientation is not a new geographic registration.

Present-day evidence: Underlying maintained/restored architecture, not temporary scaffolding or quake ruins. Dated photographs establish appearance as of their capture, not a 2026 field inspection.

Sources and roles:

- **SPATIAL**: [Map of Bhaktapur Durbar Square](https://commons.wikimedia.org/wiki/File:Map_of_Bhaktapur_Durbar_Square.jpg). Metadata dated 21 November 2006; pre-2015, not certified contemporary survey (Source limitations documented at first occurrence above.)
- **IDENTITY**: [Brief Introduction / main square inventory](https://bhaktapurmun.gov.np/en/node/4). Undated current official inventory, checked 2026-10-11 (Source limitations documented at first occurrence above.)
- **ARCHITECTURE**: [Yaksheswor / Pashupatinath oblique view](https://commons.wikimedia.org/wiki/File:15th_Century_Yaksheswor_Temple_also_called_Pashupatinath_of_Bhaktapur_01.jpg). 9 September 2016 x 960 px preview inspected: two tiled roofs, lower broad eaves, brick body, timber doors/struts and shallow platform. Earlier post-quake view qualified against 2021 pair/reverse photographs; no ruin/scaffold geometry adopted.
- **ARCHITECTURE**: [Vatsala and Pashupati, 20 August 2021](https://commons.wikimedia.org/wiki/File:Vatsala_Bhagwati_%26_Pasupati_Temple_Bhaktapur_Durbar_Square_Bhaktapur_Nepal_Rajesh_Dhungana_(2).jpg). 2021 - Visually inspected: column, covered four-pillar large bell, Vatsala, smaller bell arch, Chyasilin, palace and southern pagoda. Camera metadata shared across photographer files; no metric extraction.
- **ARCHITECTURE**: [Vatsala Bhagwati, reverse view, 20 August 2021](https://commons.wikimedia.org/wiki/File:Vatsala_Bhagwati_Bhaktapur_Durbar_Square_Bhaktapur_Nepal_Rajesh_Dhungana_(4).jpg). 2021 - Visually inspected opposite view confirms distinct bell structures, pavilion/palace adjacency, open paving. Two views share author/session: not independent GPS measurements.
- **ARCHITECTURE**: [Yaksheshwar / Pashupatinath](https://www.bhaktapur.com/discover/pashupatinath-temple-yakshyeshwor/). Undated; accessed 2026-10-11 - Supporting local heritage documentation; coordinate acquisition/accuracy unknown. Contradictory Siddhi/palace points excluded; Silu restoration wording stale. Names do not establish measured footprints.
- **PRESENT_DAY**: [Kathmandu Valley SOC 2022, projects 1–5](https://whc.unesco.org/document/191662). 2022; PDF pp43–47 (Source limitations documented at first occurrence above.)

Intentionally simplified: Ornament represented by restrained cornices, recesses and repeated primitives; Interiors and sculptural carving not reconstructed; Guardians are approximate low-poly silhouettes without per-limb collision.

Unresolved features:

- 2022/2024 reports show ongoing maintenance; scaffold omitted, latest completion not claimed
- Exact four-face portal carving and internal chamber plan unresolved

### Silu Mahadev / Phasi Dega

Identity: `silu-mahadev`. Alternate names: Shilu Mahadev, Fasi Dega, Fasidega. State: **RECONSTRUCTED_APPROXIMATE**, confidence **MEDIUM**. Family: `RESTORED_BRICK_SHIKHARA_CORNER_PORCHES`.

Exact frozen anchor (X, Z): `[39.00695926997426, -33.080419841077706]`. Source footprint ID: `silu-mahadev`; role `PLAN_OUTLINE`. Original geometry/metadata are unchanged; the model is not an as-built replacement footprint.

Architecture: Restored tall convex ribbed brick tower; Six broad receding brick terraces; Four projecting corner porch shrine towers; Paired elephants, seated lions and upper animals; Gilded ringed summit.

Known measured dimensions: none. Working local base 18 x 18 m; total height 26 m; plinth 6 m; central body width 4.8 m; stair width 2.4 m. All these metre values are **rendering assumptions**, not documented measurements.

| PHOTO_PROPORTION | Working model ratio | Conservative visual range | View limitation |
|---|---:|---|---|
| height / base width | 1.44 | 1.2-1.8 | Completed oblique/frontal views, wide stair platform; perspective means no exact metre derivation |
| tower width / base width | 0.32 | 0.28-0.42 | Tall central tower behind strongly projecting corner shrine towers |
| plinth / total height | 0.23 | 0.18-0.3 | Broad receding brick terraces, paired elephants/lions above lower approach |

Orientation: working yaw `-1.4967963267948965` radians, **APPROXIMATE**. Working west/plaza stair descent, approximate cross-check of visible approach and square context. Old footprint edge only supplies shallow axial alignment. Frozen bearing `85.75593875934004` remains unchanged. Exact entrance azimuth not surveyed; frozen rotation metadata untouched. Working local geometry orientation is not a new geographic registration.

Present-day evidence: Underlying maintained/restored architecture, not temporary scaffolding or quake ruins. Dated photographs establish appearance as of their capture, not a 2026 field inspection.

Sources and roles:

- **SPATIAL**: [Map of Bhaktapur Durbar Square](https://commons.wikimedia.org/wiki/File:Map_of_Bhaktapur_Durbar_Square.jpg). Metadata dated 21 November 2006; pre-2015, not certified contemporary survey (Source limitations documented at first occurrence above.)
- **IDENTITY**: [Brief Introduction / main square inventory](https://bhaktapurmun.gov.np/en/node/4). Undated current official inventory, checked 2026-10-11 (Source limitations documented at first occurrence above.)
- **ARCHITECTURE**: [Completed Silu oblique photograph](https://commons.wikimedia.org/wiki/File:Silu_Mahadev_Temple.jpg). 5 October 2025 EXIF; uploaded September 2026 x 960 px preview inspected: tall ribbed taper, gold summit, prominent corner shrine towers, stone columns, west/plaza approach and paired guardians. No description supplied; identity corroborated by 2024/2022 views and UNESCO, never filename alone.
- **ARCHITECTURE**: [Restored Silu stair and tower](https://commons.wikimedia.org/wiki/File:Bhaktapur_Durbar_Square_Nepal_2024_13.jpg). 4 December 2024 EXIF - 330 px attributed preview inspected: completed tall brick shikhara, open corner porches, broad stepped brick plinth, elephants/lions/upper guardians. Camera perspective not metres.
- **ARCHITECTURE**: [Restored Silu, 26 September 2022](https://commons.wikimedia.org/wiki/File:Bhaktapur_Durbar_Square_8.jpg). 2022 - Visually inspected restored red shikhara and stepped platform with guardians/paving. Curated gallery identifies Silu; generic depicts metadata unreliable. No dimensions extracted.
- **ARCHITECTURE**: [Phasi Dega pre-1934 form reconstruction](https://whc.unesco.org/document/171737). 2019 restoration process - Historical restoration intention only, cross-checked against completed tower photographs; obsolete post-1934 dome excluded.
- **PRESENT_DAY**: [Kathmandu Valley SOC 2022, projects 1–5](https://whc.unesco.org/document/191662). 2022; PDF pp43–47 (Source limitations documented at first occurrence above.)
- **PRESENT_DAY**: [Bhaktapur protected monument zone restoration status](https://whc.unesco.org/document/223752). Latest indexed status table; reporting year not established (Source limitations documented at first occurrence above.)

Intentionally simplified: Ornament represented by restrained cornices, recesses and repeated primitives; Interiors and sculptural carving not reconstructed; Guardians are approximate low-poly silhouettes without per-limb collision.

Unresolved features:

- Precise access bearing and original plinth elevations remain unresolved
- Corner shrine interiors and sculpture details unknown
- No obsolete post-1934 dome or construction scaffold

### Rameshwar Temple

Identity: `rameshwar`. Alternate names: Rameshwor, Rameshwar Mahadev. State: **RECONSTRUCTED_APPROXIMATE**, confidence **LOW**. Family: `OPEN_FOUR_STONE_PILLAR_LOTUS_CANOPY`.

Exact frozen anchor (X, Z): `[-108.79091736770269, -15.827078835269687]`. Source footprint ID: `rameshwar`; role `PLAN_OUTLINE`. Original geometry/metadata are unchanged; the model is not an as-built replacement footprint.

Architecture: Four carved stone posts, no enclosing room; Low domed lotus canopy over square layered brick/stone head; Exposed lingam/Jalhari; Shallow stone-capped brick platform.

Known measured dimensions: none. Working local base 4.8 x 4.8 m; total height 4.9 m; plinth 0.6 m; central body width 2.6 m; stair width 1.3 m. All these metre values are **rendering assumptions**, not documented measurements.

| PHOTO_PROPORTION | Working model ratio | Conservative visual range | View limitation |
|---|---:|---|---|
| height / platform width | 1.02 | 0.8-1.3 | Two low-angle photographs; broad range, no perspective pixel measurements |
| canopy / post-centre span | 1.42 | 1.25-1.65 | Square layered entablature and low lotus/dome top on four open posts |

Orientation: working yaw `0` radians, **APPROXIMATE**. Four-sided open pavilion has no observed door-facing claim. Square canopy aligned locally as rendering assumption. Frozen bearing `None` remains unchanged. Exact entrance azimuth not surveyed; frozen rotation metadata untouched. Working local geometry orientation is not a new geographic registration.

Present-day evidence: Underlying maintained/restored architecture, not temporary scaffolding or quake ruins. Dated photographs establish appearance as of their capture, not a 2026 field inspection.

Sources and roles:

- **SPATIAL**: [Map of Bhaktapur Durbar Square](https://commons.wikimedia.org/wiki/File:Map_of_Bhaktapur_Durbar_Square.jpg). Metadata dated 21 November 2006; pre-2015, not certified contemporary survey (Source limitations documented at first occurrence above.)
- **IDENTITY**: [Brief Introduction / main square inventory](https://bhaktapurmun.gov.np/en/node/4). Undated current official inventory, checked 2026-10-11 (Source limitations documented at first occurrence above.)
- **ARCHITECTURE**: [Rameshwor four-pillar pavilion, two views](https://naya.com.np/collection/c1705466706sktwr). Capture dates unresolved; attachment upload keys May 2024 are NOT capture dates - Both linked photographs inspected: four carved stone posts, square layered entablature, low domed lotus canopy, exposed lingam on raised brick/stone base. Scaffolding/loose restoration stones excluded; underlying form agrees with UNESCO. Photos not redistributed.
- **PRESENT_DAY**: [Kathmandu Valley SOC 2022, projects 1–5](https://whc.unesco.org/document/191662). 2022; PDF pp43–47 (Source limitations documented at first occurrence above.)
- **PRESENT_DAY**: [Bhaktapur protected monument zone restoration status](https://whc.unesco.org/document/223752). Latest indexed status table; reporting year not established (Source limitations documented at first occurrence above.)
- **HISTORICAL_EXCLUDED**: [Excluded Rameshwor filename depicting Kedarnath](https://commons.wikimedia.org/wiki/File:Rameshwor_Temple_Bhaktapur_Durbar_Square_Bhaktapur_Nepal_Rajesh_Dhungana_(2).jpg). 20 August 2021 - EXCLUDED identity conflict: filename calls Rameshwor but category/visible brick shikhara agree with Kedarnath; incompatible with UNESCO four-post Rameshwor. No geometry derived from this filename.

Intentionally simplified: Ornament represented by restrained cornices, recesses and repeated primitives; Interiors and sculptural carving not reconstructed; Guardians are approximate low-poly silhouettes without per-limb collision.

Unresolved features:

- Irregular frozen plan polygon too large/ambiguous to equal pavilion footprint; kept unchanged
- Capture dates and exact canopy profile unresolved
- Working four-side platform access is inferred, not a surveyed stair inventory

### Badrinath Temple

Identity: `badrinath`. Alternate names: Badri Narayan, Badrinarayan. State: **RECONSTRUCTED_APPROXIMATE**, confidence **LOW**. Family: `RESTORED_BRICK_SHIKHARA_FRONT_PORTICO`.

Exact frozen anchor (X, Z): `[-108.14847842511578, -1.8714287134175511]`. Source footprint ID: `None`; role `NONE`. Original geometry/metadata are unchanged; the model is not an as-built replacement footprint.

Architecture: Restored slender brick shikhara; Single stone-column front portico; Small front subsidiary tower; Lion pair on shallow base.

Known measured dimensions: none. Working local base 5.4 x 6 m; total height 12.2 m; plinth 1.1 m; central body width 2.8 m; stair width 1.6 m. All these metre values are **rendering assumptions**, not documented measurements.

| PHOTO_PROPORTION | Working model ratio | Conservative visual range | View limitation |
|---|---:|---|---|
| height / base width | 2.26 | 1.9-2.6 | Dedicated 2021 restored photograph cross-checked with western group; former 2013 roof excluded |
| tower / base width | 0.52 | 0.45-0.62 | Slender brick shaft behind single projecting front portico and small front shrine tower |

Orientation: working yaw `1.5707963267948966` radians, **APPROXIMATE**. Working portico toward main plaza/east inferred from western group context, not compass measurement. Frozen bearing `None` remains unchanged. Exact entrance azimuth not surveyed; frozen rotation metadata untouched. Working local geometry orientation is not a new geographic registration.

Present-day evidence: Underlying maintained/restored architecture, not temporary scaffolding or quake ruins. Dated photographs establish appearance as of their capture, not a 2026 field inspection.

Sources and roles:

- **SPATIAL**: [Map of Bhaktapur Durbar Square](https://commons.wikimedia.org/wiki/File:Map_of_Bhaktapur_Durbar_Square.jpg). Metadata dated 21 November 2006; pre-2015, not certified contemporary survey (Source limitations documented at first occurrence above.)
- **IDENTITY**: [Brief Introduction / main square inventory](https://bhaktapurmun.gov.np/en/node/4). Undated current official inventory, checked 2026-10-11 (Source limitations documented at first occurrence above.)
- **ARCHITECTURE**: [Badrinath reconstructed shikhara photographic gallery](https://www.orientalarchitecture.com/sid/1610/nepal/bhaktapur/badrinath-temple). Gallery credit January, September and November 2021; individual frame month unresolved - Current full gallery and main photograph inspected: brick tower, one front portico with retained carved stone columns, small front subsidiary tower, lion pair and shallow stepped base. Names disagree among Hutt/Slusser/Korn; follow UNESCO/accepted Badrinath identity, correspondence remains approximate. Research-only copyright photographs.
- **ARCHITECTURE**: [Krishna Temple / western group, 20 August 2021](https://commons.wikimedia.org/wiki/File:Krishna_Temple_Bhaktapur_durbar_Square_Bhaktapur_Nepal_Rajesh_Dhungana.jpg). 2021 - Visually inspected: two-tier pagoda between terracotta forms. Correspondence to plan-labelled Krishna supports provisional Gopinath binding; Kedarnath exact icon remains unresolved. Shared photographer GPS not object geometry.
- **PRESENT_DAY**: [Kathmandu Valley SOC 2022, projects 1–5](https://whc.unesco.org/document/191662). 2022; PDF pp43–47 (Source limitations documented at first occurrence above.)
- **HISTORICAL_EXCLUDED**: [Badrinath miniature tiled-roof predecessor](https://commons.wikimedia.org/wiki/File:Badri_nath_temple_Bhaktapur_(1).JPG). 13 September 2013 - Two views (also file (3)) inspected, EXCLUDED from current upper geometry: small brick room and tiled porch roof represent former post-1934 form; UNESCO/2021 restored tower supersedes it.

Intentionally simplified: Ornament represented by restrained cornices, recesses and repeated primitives; Interiors and sculptural carving not reconstructed; Guardians are approximate low-poly silhouettes without per-limb collision.

Unresolved features:

- Frozen anchor has no source footprint: new local model extent remains rendering assumption
- Badrinath/Kedarnath names conflict in old sources; UNESCO/accepted identity followed without rebinding
- Exact portico bearing, dimensions and rear openings unresolved

### Dwarika Temple / Gopinath

Identity: `gopinath-krishna`. Alternate names: Gopinath Krishna, Dwarikanath, Plan-labelled Krishna. State: **PROVISIONALLY_IDENTIFIED**, confidence **LOW**. Family: `PROVISIONAL_TWO_ROOF_KRISHNA_PAGODA`.

Exact frozen anchor (X, Z): `[-94.70253638496608, -5.459665059326316]`. Source footprint ID: `gopinath-krishna`; role `PLAN_OUTLINE`. Original geometry/metadata are unchanged; the model is not an as-built replacement footprint.

Architecture: Two roofs with particularly shallow wide lower eaves; Timber triple portal rhythm; Small upper brick/timber chamber; Low stepped brick podium.

Known measured dimensions: none. Working local base 8.4 x 7.4 m; total height 11.6 m; plinth 1.4 m; central body width 6 m; stair width 2.4 m. All these metre values are **rendering assumptions**, not documented measurements.

| PHOTO_PROPORTION | Working model ratio | Conservative visual range | View limitation |
|---|---:|---|---|
| lower roof / body width | 1.93 | 1.7-2.1 | Broad shallow lower roof and dense timber front; shared session, not independent metric control |
| upper / lower roof width | 0.50 | 0.46-0.58 | Smaller square upper chamber, distinctly narrower roof than Yaksheshwar |
| height / lower roof width | 1.00 | 0.85-1.2 | Low front view and foreground exaggeration; current two-roof silhouette |

Orientation: working yaw `1.4927963267948965` radians, **APPROXIMATE**. Working main opening toward east/plaza, shallow frozen axis alignment. Principal entrance bearing remains unresolved. Frozen bearing `None` remains unchanged. Exact entrance azimuth not surveyed; frozen rotation metadata untouched. Working local geometry orientation is not a new geographic registration.

Present-day evidence: Underlying maintained/restored architecture, not temporary scaffolding or quake ruins. Dated photographs establish appearance as of their capture, not a 2026 field inspection.

Sources and roles:

- **SPATIAL**: [Map of Bhaktapur Durbar Square](https://commons.wikimedia.org/wiki/File:Map_of_Bhaktapur_Durbar_Square.jpg). Metadata dated 21 November 2006; pre-2015, not certified contemporary survey (Source limitations documented at first occurrence above.)
- **IDENTITY**: [Brief Introduction / main square inventory](https://bhaktapurmun.gov.np/en/node/4). Undated current official inventory, checked 2026-10-11 (Source limitations documented at first occurrence above.)
- **ARCHITECTURE**: [Krishna Temple / western group, 20 August 2021](https://commons.wikimedia.org/wiki/File:Krishna_Temple_Bhaktapur_durbar_Square_Bhaktapur_Nepal_Rajesh_Dhungana.jpg). 2021 (Source limitations documented at first occurrence above.)
- **ARCHITECTURE**: [Curated Bhaktapur Durbar Square gallery](https://commons.wikimedia.org/wiki/Bhaktapur_Durbar_Square). Undated; accessed 2026-10-11 - Curated caption names terracotta Kedarnath and Badrinath beside Nepalese-style Gopinath. Perspective left/right is not cardinal direction. Silu post-restoration image identified here.
- **ARCHITECTURE**: [Ward No. 3 heritage inventory](https://bhaktapurmun.gov.np/en/content/ward-no-3). Published 25 May 2022 - Lists Krishna, Kedarnath, Jagannath, Badrinath and Rameshwar separately. Ward-wide inventory does not resolve exact Krishna/Gopinath footprint correspondence or orientations.
- **PRESENT_DAY**: [Kathmandu Valley SOC 2022, projects 1–5](https://whc.unesco.org/document/191662). 2022; PDF pp43–47 (Source limitations documented at first occurrence above.)
- **PRESENT_DAY**: [Bhaktapur protected monument zone restoration status](https://whc.unesco.org/document/223752). Latest indexed status table; reporting year not established (Source limitations documented at first occurrence above.)

Intentionally simplified: Ornament represented by restrained cornices, recesses and repeated primitives; Interiors and sculptural carving not reconstructed; Guardians are approximate low-poly silhouettes without per-limb collision.

Unresolved features:

- PROVISIONALLY_IDENTIFIED: plan Krishna-to-Gopinath/Dwarika binding is reasonable, not survey-confirmed
- Jagannath/Radhakrishna/Dwarika alternative traditions not used to assign additional footprints
- Exact façade facing and rear geometry remain unresolved

## Assembly and silhouette review

Independent assemblies implement Siddhi, Yaksheshwar, Silu, Rameshwar, Badrinath and provisional Gopinath. Shared helpers generate only individual solids, posts, roofs, openings, steps and guardian silhouettes; no generic temple family is resized to assign identity.

Siddhi has five high stone terraces, a 15-step working stair, human/child/dog and differentiated horse/rhino/human-faced/camel silhouettes, rectilinear set-back tower courses, projecting niches and small subsidiary spires. Figure ordering and sculptural likeness are approximate. Its stepped silhouette differs from Vatsala's continuous shouldered tower and colonnade.

Yaksheshwar has two roofs with broad lower eaves, separate upper chamber, brick body and repeated thin timber struts. Gopinath has its own shallow lower roof, smaller upper roof and triple front timber opening rhythm. No erotic carving, hanging festival decoration, vegetation or temporary scaffolding is modeled.

Silu follows completed 2024/2025 photographs: broad brick terraces, axial working west approach, paired elephant/lion/upper quadruped silhouettes, open corner porches with shrine towers, tall convex brick shaft and gilded summit. Upper guardian quadrupeds are approximate stand-ins, not a species identification. The old post-1934 replacement dome is excluded. Rameshwar's low lotus/domed canopy is a different, independently supported monument form and must not be confused with that excluded Silu dome.

Badrinath follows the restored tower photographed in 2021, with one projecting portico and retained stone columns. Its 2013 miniature tiled-roof photographs were inspected and excluded from current upper geometry. Rameshwar filename/category contradictions were identified before modeling; four pillars from UNESCO and two visually checked pavilion views govern its open structure instead.

Flat-material checks (`silhouette=1`, development only) inspected all eight review views before final roof upturns. Corrections reduced overthick struts, attached Siddhi niches to its taper, adjusted local landings and changed only the three new review viewpoints to separate overlapping silhouettes. Final regular-material screenshots were inspected at CENTRAL, PALACE, COMPOSITION, CLOSE, WIDE, EAST, WEST and 7B-WIDE. The new western view separates the three monuments; the wide view exposes Silu beside Siddhi instead of hiding it behind Yaksheshwar. User acceptance of architectural resemblance is still pending.

## Placeholders and additional monuments

Replaced six active neutral masses: `siddhi-lakshmi`, `yaksheshwar`, `silu-mahadev`, `rameshwar`, `badrinath`, `gopinath-krishna`. No intentionally neutral monument remains in the active composition. Gopinath has a photo-supported model but its binding remains PROVISIONALLY_IDENTIFIED. The pipeline explicitly supports an UNRESOLVED specification by retaining one low neutral block without invented upper architecture; an automated test exercises this branch.

Adjacent Kedarnath, the small eastern Vatsala/Annapurna correspondence, Jagannath naming alternatives and minor Narayan shrines were evaluated. Their distinct presence can help future composition, but no additional unambiguous accepted anchor/footprint binding is established in this frozen set. They remain unmodeled instead of being assigned to spare footprints. No generic perimeter houses, lost towers or other-square temples were added. The safety ground and open-space geometry remain unchanged, so missing urban enclosure still causes substantial empty foreground.

## Collision and gameplay

All bodies, plinth flanks, stairs, posts and conservative roof undersides use compound cuboids. Siddhi/Silu terrace meshes and collider solids include the same central stair slot, avoiding a hidden terrace wall across access. Landing overlap was corrected after actual Rapier tests found premature blocking. Stair rise stays within the existing 0.25 m autostep setting. Guardian limbs have no collider; no decorative trimesh is used. Sanctum interiors are blocked; open Rameshwar spaces are traversable around four structural posts and lingam.

Final composition: 15 identity models, 279 architecture cuboids plus the unchanged ground collider. Exact duplicate cuboids and model IDs are rejected by tests. Bodies/major posts block entry, while Gate passage and Chyasilin's open centre remain traversable.

Development-browser physics at the final composition climbed every target platform and retained Vatsala traversal, Chyasilin crossing, Gate passage and palace camera retraction. Walking/running, jump apex, held-Space rejection, landing, orbit and engineering-world jump passed. Headless Chrome uses software WebGL; physics/console checks do not constitute a human visual acceptance or a hardware frame-rate guarantee.

## Performance

2,693 visible box instances batched by shared material; 142 profiles, 136 relief/guardian extrusions and 10 roofs merged by material. Eleven existing material definitions; one extra neutral review material only in development. Brick tower UVs tile in metre units only for the new Silu/Badrinath profiles; central UV behavior is unchanged. Resources are disposed on unmount.

Five deterministic 128/256 px maps are reused unchanged; no added image textures. RGBA source texels approximately 0.875 MiB, approximately 1.17 MiB with mipmaps, excluding shadows/driver storage. Renderer allocation count is eight textures (including render/shadow resources), eleven geometries. Material batches are coarse; identical counts between distant views do not imply individual-monument frustum culling.

Final normal-material development metrics at 1600 x 1000, default shadows, architectureDebug OFF, after settling:

| View | Approximate draw calls | Submitted triangles (including shadow work) | Texture allocations |
|---|---:|---:|---:|
| central | 35 | 103,562 | 8 |
| wide | 35 | 103,562 | 8 |
| 7b-wide | 35 | 103,562 | 8 |

These are sampled renderer.info counters, not unique visible mesh triangles or measured GPU residency. The increase buys six distinct monuments while retaining material batching.

## Validation

- `npm run lint`: PASS, no warnings.
- `npm run typecheck`: PASS.
- `npm test`: PASS, 123 tests = all original 92 + 31 additional tests.
- `npm run build`: PASS, optimized production build.
- Development: all eight review routes and flat/regular material checks; walking/running/jump/landing, all six new stairs, Vatsala stairs, Chyasilin traversal, Gate passage, major body collision, camera obstruction and engineering world PASS.
- Production: normal public entry, movement/jump/landing and engineering world PASS; development reference routes return 404. `review=west&architectureDebug=1&silhouette=1` retains normal spawn and no labels/flat material.
- Browser page errors, hydration errors, missing-key/asset errors: none. Idle React commit count remains stable; no update loop.

## Manual visual review required

**MANUAL TEST REQUIRED: YES.** Engineering completion is not human architectural approval. With `architectureDebug` OFF and `silhouette` OFF, capture exactly:

1. `/explore?world=bhaktapur&review=central`
2. `/explore?world=bhaktapur&review=east`
3. `/explore?world=bhaktapur&review=west`
4. `/explore?world=bhaktapur&review=composition`
5. `/explore?world=bhaktapur&review=7b-wide`

EAST: pale stepped Siddhi Lakshmi on the left, restored brick Silu Mahadev on the right, with palace/eastern-square relationship. WEST: provisional two-roof Gopinath on the left, restored Badrinath tower centrally, open four-pillar Rameshwar on the right. These are development-only review presets; normal gameplay remains unchanged.

## Known limitations

All six dimensions and entrance azimuths remain approximate. Source plan footprints may mix roof, platform and schematic extents. The frozen Rameshwar polygon is much larger than the observed pavilion; a smaller local assembly is used without changing the source. Badrinath has no traced footprint; its modeled base is explicitly assumed. Gopinath's binding and alternative names remain provisional. No survey, laser scan or reusable measured drawings were obtained. Restoration status sources and dated photographs have different temporal coverage. Rear openings, fine relief, guardian anatomy, stone damage and interiors are simplified. Current performance results are software-renderer counters. Enclosure/adjacent unresolved monuments remain for later work; no next phase was started. Existing untracked owner reference material is preserved and excluded from the commit.
