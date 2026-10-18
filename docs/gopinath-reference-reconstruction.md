# Gopinath reference reconstruction

## Sources and identity

- Government of Nepal, Department of Archaeology, Kathmandu Valley SOC 2019, section 1.13, PDF p.32: https://whc.unesco.org/document/171737#page=32 . Explicitly identifies the western Bhaktapur Gopi Nath as two-roofed Nepali style, also Dwarika/Krishna, and describes replacement of deteriorated ground-floor timber with Sal wood and conservation of the sanctum. These identity/form/conservation facts are VERIFIED; no metric dimensions are provided there.
- Local monument account https://www.bhaktapur.com/discover/radhakrishna-temple/ corroborates the Radhakrishna/Gopinath/Dwarikanath naming, carved timber openings/struts and separate front column. Its deity account differs from DoA, so no detailed iconographic identities are modelled.
- Primary visual evidence: the user's clear frontal and oblique photographs in the conversation. No images copied/generated/committed. Roof dominance, inset carved timber frontage, masonry shoulders, raised terraces, upper tier and deep structural eaves are PHOTO_INFERRED.
- Excluded: MDPI Heritage 7(6),151 and associated Gopinath damage studies: explicitly Hanuman Dhoka, Kathmandu, not this Bhaktapur monument. Conservation drawings mentioned for Kathmandu cannot substantiate dimensions here.
- The rendered object remains `gopinath-krishna`. Monument naming is corroborated, but its mapped footprint binding remains PROVISIONALLY_IDENTIFIED. No Phase 6C or correction-layer transform changed.

## Audit and replacement

Previous `entrancePagoda` assembled a large sanctuary cuboid with dark surface panels, generic hip roofs, short rafter stubs, and approximate platform layers. Dark rectangles were not sufficiently recessed architectural bays; the common roof helper did not reproduce the photographed eave profile. Old arrays were already replaced on construction; this pass removes the old implementation entirely and delegates only this ID to `buildReferenceGopinath`.

The new assembly separates sanctuary mass from projecting front shoulders, actual facade setback, four-deep jamb/lintel layers, panel rails, pointed timber crests, structural members and wrapping cornices. Upper bays sit outside a smaller backing core and between masonry corner piers, apron and head. Blind rear/side panels are approximate, not claims of surveyed doors. No interior or deity sculpture is invented.

A dedicated low-resolution swept hip shell is selected by the two Gopinath tile-shell role IDs only. Other roof geometry takes its original path. The tile shell, dark sloping soffit, two fascia courses, rafter ends, 28 main / 20 upper substantial struts, and ridge caps are separate architectural layers. Existing tiled-roof and timber materials are reused without new textures/shaders/dependencies. The front freestanding stone column visible in the photographs is not mistaken for temple structure or newly duplicated.

## Approximate scale derivation

No reliable measured dimensions were located for the Bhaktapur temple. These are human-scale working estimates, not photogrammetry. The supplied frontal photo suggests lower roof / shrine width about 1.8, upper / lower roof width about 0.5, platform / shrine width about 1.55, and total height / main span about 0.88. Perspective, the separate column and seated people prevent precise metre extraction. A 2.4 m high, 1.35 m wide entrance and ten 0.18 m rises provide the human-scale constraints; no player scale or object scale is changed.

| Layer | Working dimensions (metres) |
| --- | --- |
| Lower shrine | 9.2 x 7.6 x 3.8; floor 1.8 |
| Gallery | 1.3 high; approximately 0.6 setback |
| Main roof | 16.8 x 15.2; eave 7.3; rise 2.55; nominal pitch about 19 degrees |
| Upper storey | 4.8 x 4.2 x 3.1; bottom 8.65 |
| Upper roof | 8.6 x 7.8; eave 12; rise 1.65; nominal pitch about 23 degrees |
| Finial | 1.05 high; approximately 0.92 maximum diameter; top 14.7 |
| Plinth | maximum 14.4 x 12.4 x 1.8; unequal major terraces and projecting courses |
| Stairs | 2.5 wide; ten rises of 0.18; tread 0.36 |

Roof profile easing changes local slope: pitch figures are nominal rise/half-depth approximations. Dimensions are APPROXIMATE. Growth is distributed across masonry, roof span and height, gallery, base and upper tier rather than uniform scaling. The doorway remains human-sized.

## Collision, scope and limits

Only lower sanctuary/shoulder/head collision and regenerated platform/tread collision remain. Roofs, upper ornament, frames and struts do not add invisible collision decks. The central stair slot is subtracted from every terrace layer; the last tread meets the landing. Existing context clipping is retained. White-pavilion and veranda platform code is unchanged.

All outer transforms, source editor part frames and saved override files are preserved. Khauma, guardians, enclosure, gap, museum, white pavilion, other monuments, road, gameplay, audio, mobile controls, homepage, LAN and full-world rendering are untouched. No world streaming.

Fine carving, hidden construction, exact metric dimensions, sculptural iconography and expanded roof clearance relative to manually positioned neighbours remain unresolved/manual-review items. No neighbour is moved to compensate. This is a source-informed approximation awaiting visual approval, not a verified as-built model.

Geometry stays at hundreds of box/relief modules and two small roof shells (38 triangles each), using the existing merged/shared-material architecture pipeline. No performance measurements or visual checks were run.

Testing/build/typecheck/application/browser/screenshots: NOT RUN, by user instruction. Code-level inspection only.
