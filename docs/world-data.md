# Bhaktapur spatial foundation

`/explore` (or `?world=engineering`) retains the controller obstacle course.
`/explore?world=bhaktapur` loads broad neutral reference ground. Phase 4 adds
official source metadata and the calibration pipeline. **No measured map
boundaries, footprints or architectural landmarks have been entered.**

## Sources and evidence limits

The reusable registry in `src/data/world/sources.ts` records:

- `unesco-bhaktapur-monument-zone-2006`: [UNESCO document 103370](https://whc.unesco.org/en/documents/103370),
  dated 1 February 2006 and identified by UNESCO as ICOMOS Evaluation. This is
  the designated primary spatial reference, with its [one-page PDF](https://whc.unesco.org/document/103370).
- `unesco-kathmandu-valley-property`: [property context](https://whc.unesco.org/en/list/121).
- `unesco-kathmandu-valley-maps`: [component table and maps index](https://whc.unesco.org/en/list/121/maps/).
  This supports component 121bis-003, its published coordinate and areas.

The component coordinate N27 40 20.734 / E85 25 42.481 and published areas
3.61 ha / 10.71 ha are VERIFIED **published metadata only**. They do not
establish polygon vertices, a building position, or our geographic origin.
An area cannot be used to invent a square boundary.

- VERIFIED: trustworthy evidence supports the specific claim; human review is
  still necessary. Validation cannot establish truth.
- APPROXIMATE: evidence-informed geometry with an explicit method and
  uncertainty. Raster traces remain APPROXIMATE even from an official map.
- PLACEHOLDER: synthetic development representation with no heritage claim.

Sources contain supported claims, reference, notes and access date. Features
link reusable source IDs, calibration ID, measurement method and uncertainty.
No source currently supports exact building heights, facades or roof geometry.

## Current access limitation

Metadata and the maps table were inspected. Local PDF downloads returned HTTP
403; the available screenshot tool did not expose inspectable map pixels.
Consequently image dimensions, scale-bar endpoints, north-arrow endpoints and
all traced vertices are **pending**, not estimated. `calibrationStatus` records
this explicitly. No source imagery or 3D asset is stored in the repository.

## Repeatable calibration

One unit is one metre; +Y up; +X east; -Z north. Pixels start at the full-page
raster's top-left, X right and Y down. Choose the **centre of the full uncropped
page** `[width/2,height/2]` as the stable engineering anchor, mapped to local
`[0,0]`. This is an arbitrary reproducible anchor, not a named geographic
location. Geographic origin remains **UNRESOLVED**. The visible north arrow
expresses the target axis convention until map north is measured.

When the actual PDF becomes inspectable:

1. Render page index 0 without cropping or stretching (e.g. 300 DPI). Record
   raster width/height, SHA-256 of raster bytes, renderer/DPI in the method note,
   and source ID. Keep the raster outside the repo pending rights review.
2. Record the scale bar's actual labelled metre interval and endpoint pixels.
   Do not infer scale from display zoom, paper size or the published area.
3. Record north-arrow base/tip pixels and the page-centre origin. Inspect
   resolution/distortion; if uniform scaling/rotation is inappropriate, stop.
4. Enter a `MapCalibration` in `map-measurements.ts`. It must be APPROXIMATE and
   include measurement and uncertainty notes. No fabricated values.
5. Trace features in the same raster, retaining pixels in `MapFeature` records.
   Use neutral trace IDs unless the source identifies a named building. Close
   polygons implicitly: do not repeat the first vertex. Holes and overlapping
   rings are unsupported; defer them rather than forcing an incorrect shape.
   Validation rejects degenerate and self-intersecting polygons.
6. Run `npm run spatial:check`, all checks, and visually review against the map.
   `spatial-registry.ts` converts source pixels to local metres once.

Conversion in `map-calibration.ts`: normalized pixel north vector `n`; pixel
east `[-n.y,n.x]`; displacement from anchor `d`; scale
`m = labelledMetres / scaleBarPixelLength`:
`X = dot(d,east)*m`, `Z = -dot(d,n)*m`. No geographic conversion occurs.
Numeric output precision does not imply measurement precision.

## Rendering, scale and player

Spatial kinds cover core/buffer polygons, building footprints, open squares,
routes and anchors. Footprints render as neutral flat shapes with UNKNOWN
height; no building volume or obstacle is inferred. They are walkable references
without collision. Later evidence-backed massing can use simple explicit
collision separately, never uncertain decorative meshes.

The 400 m square ground is PLACEHOLDER / DEVELOPMENT ONLY, not the mapped square
or a boundary. Development foot-position spawn `[0,0.05,4]` is also PLACEHOLDER,
not a real entrance. Engineering retains its 32 m ground and `[0,0.05,7]` spawn.
The shared 1.75 m player, metre grid, movement, jump, camera and respawn remain
scale references. Jump has been manually accepted for this phase.

Default-off development flags:

- `NEXT_PUBLIC_DEBUG_SPATIAL`: boundary/footprint lines, local origin, north
  convention and measured calibration-anchor markers when available.
- `NEXT_PUBLIC_DEBUG_WORLD_DATA`: source counts, accuracy, coordinates, pending
  calibration status and feature uncertainty.
- Existing world/player flags: metre grid and live player coordinates.
- `NEXT_PUBLIC_WORLD_REFERENCE`: existing synthetic PLACEHOLDER reference box.

All are disabled in production. Empty registries draw no fake boundaries.
The Phase 3 model loader remains available for future researched assets, with
explicit bounds collision and missing-model fallback.

## Unresolved / next review

Obtain inspectable source pixels, calibrate scale/north, trace and review
boundaries/footprints, then assess which detailed asset has adequate sources and
usage rights. Geographic tie, elevations, heights and all detail remain
unresolved. No guessed temple geometry is permitted.

Human inspection required: load Bhaktapur, walk/jump and judge reference scale;
inspect north/origin/diagnostics; compare footprints with the source once real
measurements exist; check engineering and absence of invented architecture.
The current empty registry cannot validate real-world spatial relationships.
