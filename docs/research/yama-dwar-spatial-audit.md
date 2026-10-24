# Yama Dwar spatial integration audit

## Before correction - c43ae92

Bounds below are generated world-space AABBs, not surveyed building bounds. Gate-local x is lateral; negative z is into the palace. Coordinates are metres. Source data and editor JSON remain unchanged. The current turn contains no new gameplay screenshot: attribution below is proved from generated pieces, not a claim to have inspected unavailable screenshot pixels.

| Owner | Origin / yaw | World AABB min -> max | Nearby colliders | Source / purpose |
|---|---|---|---:|---|
| `fifty-five-frontage` | [2.0197052457578195, -14.218166102530466] / -0.109653194 | [-13.1175, 0, -24.4989] -> [17.7041, 10.3, -11.4515] | 3 | central-model.ts / palace(false): public palace facade plus procedural west-return mass and roof |
| `gallery-frontage` | [-41.491195052570205, -19.02749654092371] / -0.088472788 | [-63.7967, 0, -26.9743] -> [-18.7598, 9.6, -15.904] | 5 | palace-frontage-models.ts / gallery(): established public facade plus full-depth pale-wing proxy |
| `golden-gate` | [-16.156550051310745, -16.95862251971981] / -0.038935676 | [-21.036, -0.005, -20.6947] -> [-11.172, 8.25, -14.9111] | 12 | palace-frontage-models.ts / golden(): public gate plus coarse rear roof/backing |
| `context:9c:18962138` | [-32.99125078160133, -52.415108603625974] / 0.000000000 | [-64.6011, 0, -71.6381] -> [-1.3738, 8.95, -33.2305] | 4 | square-completion.ts: coarse deeper palace ranges |
| `context:9c:1159393576` | [-60.645101241801655, -27.105398595692478] / 0.000000000 | [-66.7096, 0, -34.388] -> [-0.1213, 7.48, -20.4697] | 48 | square-completion.ts: coarse enclosing palace/context footprint |
| `taleju:YamWestRange` | [-18.6459406593852, -24.98660853119434] / 1.531860650 | [-21.4662, 0.08, -32.0095] -> [-17.6269, 10, -20.5306] | 2 | taleju/entrance-court.ts / left(): new plaster elevation |
| `taleju:YamEastRange` | [-12.750412255794599, -24.756946077892835] / -1.609732003 | [-14.345, 0.08, -31.5735] -> [-9.8329, 10, -20.2321] | 4 | taleju/entrance-court.ts / right(): new timber/brick elevation |
| `taleju:YamForwardRange` | [-15.531768493545169, -29.143537291891015] / -0.038935676 | [-21.0244, 0.08, -32.0095] -> [-9.8329, 10, -26.9708] | 13 | taleju/entrance-court.ts / forward(): new onward range |

### Exact intruding source pieces

The previous 5.90 m width was explicitly selected to clear `gallery-frontage` -> `palace-main-roof-pale-wing`, a 17.763 x 7 m procedural roof. Its gate-local x extent reaches -2.977 m; the plaster-range eave began at -2.05 m. Treating this entire roof footprint as frozen forced the west wall to x=-2.80. Its generated depth is PHOTO_INFERRED, not a measured inner-court boundary. Public face positions remain authoritative for this task; hidden depth does not.

`gallery-frontage/palace-masonry-pale-wing` occupies gate-local x [-20.2665,-3.7758], z [-5.8207,-0.0215], y [.425,7.305]. Enlarging the courtyard without cutting this body would reveal a solid side intrusion. Its corresponding foundation and rear roof must be cut together.

`fifty-five-frontage/palace-west-return` occupies x [4.0861,7.0757], z [-7.1053,1.2714], y [.425,8.475]; its `palace-return-roof` reaches x=3.1316. This is the independently identified right intrusion; the main public facade is not being relocated.

`golden-gate/gateway-rear-tile-roof` reaches z=-3.55. The adjoining pale slabs stop at z=-.625 and upper backing at -.73; these are gate-side public shells, not a licence to extend pale slabs through the court. Gate aperture x [-.82,.82], clear opening approximately y [.11,3.1], follows existing geometry (not surveyed).

The forward interference is `context:9c:1159393576`, especially `9c-occupied-context-brick-body` and `9c-connected-terracotta-roof` across gate-local z -8.89..-16.81. `context:9c:18962138` starts around z=-16.45; retain the existing Mul/Beko cutouts and extend only the entrance cutout.

The new range bodies themselves are also substantial: west 2.2 m deep, east 2.2 m deep, forward 2.2 m deep, plus corner rooms. Their footprints must be reserved as well as the open court. Intentional structural joins are distinct from old/new duplicate surfaces.

### Ownership, materials, collision and editor

All items above belong to their named CentralModel owners. Source generators supply absolute piece coordinates with each owner's origin/yaw as its editing basis. Palace body: agedBrick; gallery skins: plaster; foundations: stone; roof: roof; gallery/eaves: carvedTimber. New elevations: plaster / agedBrick / carvedTimber, not an unidentified manual primitive. Full per-piece AABBs and collider indices were calculated before editing in local scratch `tmp/yama-before.json`.

Both persisted editor transform files were inspected. There are no palace/gate/Taleju overrides or created primitives in this region; the saved scene has 21 transforms, three created objects, no hidden objects. Browser local storage was not read. Preserve all saved overrides and original part-source bases even when clipping changes a part's bounds. No transform precedence change.

### Photographic scale (inference, not photogrammetry)

Sources reused: supplied 2022 forward video frame; Backpack and Snorkel Yama Dwar forward photograph; Ganesh Paudel reverse photograph (2013-09-14, Commons); Peter Theill timber-gallery photographs. All are already recorded in taleju-chowk.md.

Forward image: facade spans approximately 210-225 pixels, doorway approximately 25-32 pixels, giving roughly 7-9 doorway widths. A plausible 1.25-1.50 m historic opening suggests about 8.5-12 m; occlusion and lens perspective preclude exact scaling. People are nearer the camera than the facade: applying 1.6-1.75 m stature without correcting depth underestimates the facade. Tall shutters and the upper gallery confirm several distinct bays rather than a 5.9 m corridor. Reverse image shows a much broader enclosing brick wall than the gate aperture; it also establishes the offset gate and unequal plaster/timber sides. These checks support minimum 8.5 m, likely 9.5-10.5 m, upper plausible 11.5 m. Select 10.0 m.

Threshold-to-forward range is less constrained: perspective/lens uncertainty supports approximately 13-17 m. Select 14.0 m to the inner facade, with the south ranges starting 1.6 m behind the gate. Clear court depth 12.4 m; this is not Mul's measured dimension. Selected left/right gate-local x -6/+4 preserves the gate's asymmetric relationship seen in reverse. Exact offset, heights, bay spacing and unseen rear rooms remain APPROXIMATE.

### Photo inventory before implementation

Forward: raised brick termination, closed left door, central onward door and ramp, deep lintel/brackets, upright focal window, two small subordinate lattices with supports, tall left shutter, plaster courses, muted red rosette band, upper timber-framed light/red panels and small shutters, tiled eave. Major forms confirmed; exact count/spacing partly occluded and inferred.

Left: unequal closed lower panels with pilasters/arched tops, continuous stepped bands, several tall louvred shutters, sill/capital details, exposed aged brick base, bracketed timber eave, roof return. Right: unequal lower door/window, three principal middle window groups, deep carved bands, projecting arched/latticed gallery with substantial piers, brackets/struts, dark underside and tiled roof. Do not mirror the sides or invent sacred figures.

## Implemented correction

### Exterior shell / interior boundary

`entrance-integration.ts` reserves a gate-oriented rectangle x [-8.68,6.68], z [-16.68,-1.50]. Its world corners are [-24.180688,-33.963857], [-8.832330,-33.365956], [-9.423224,-18.197461], [-24.771583,-18.795362]. Only the three audited palace owners are eligible. The z >= -1.50 public-facing region is protected, including the original rear roof ridge at z=-1.35. Nothing is relocated. Original gate origin/yaw and every exterior owner origin/yaw are retained exactly.

Bodies/foundations are polygon-differenced and closed at the cut. Retained box surfaces use their original local UV phase/metre scale. Roofs, ornaments and other shaped geometry are cut as actual triangles with interpolated UVs: the old exterior roof slopes are not regenerated from a smaller footprint. Roles/yaws and the original editor part-source frames remain attached. Matching colliders are cut into convex triangular prisms. Hidden signature boxes retain their collider-to-part association. No old collider is left across the interior void. The two legacy context sources retain their existing Mul/Beko masks, with the larger entrance envelope derived from the new court.

This establishes the architectural rule: the public exterior visual shell and an evidence-supported palace interior must not be forced to share a full-depth procedural proxy.

### After bounds

| Owner | World AABB min -> max | Action |
|---|---|---|
| `fifty-five-frontage` | [-13.1175, 0, -24.1057] -> [17.7041, 10.3, -11.4515] | Preserve public facade and near return; clip concealed rear return/body/roof |
| `gallery-frontage` | [-63.7967, 0, -26.9743] -> [-19.2949, 9.6, -15.904] | Preserve square-facing elevation; clip hidden pale-wing body, foundation, roof/end ornament |
| `golden-gate` | [-21.036, -0.005, -18.6463] -> [-11.2518, 8.25, -14.9111] | Retain public gate/canopy and roof ridge; cut only roof behind protected region |
| `context:9c:18962138` | [-64.6011, 0, -71.6381] -> [-1.3738, 8.95, -33.6958] | Retain Mul replacement and adjust entrance/connector void only |
| `context:9c:1159393576` | [-66.7096, 0, -34.388] -> [-0.1213, 7.48, -20.9088] | Remove source masses/trim/roof and collider portions in reconstructed envelope |

### Geometry calculations, not application testing

Open-court query uses an inset rectangle 9.8 x 12.2 m inside the selected 10 x 12.4 m court. Roofs are queried as their actual triangles, box/volume footprints as polygons, convex-prism colliders as their hull footprint; broad owner AABBs alone would falsely flag retained outside pieces. Raw pre-Taleju source-factory data and integrated data are distinguished below. Projected surface sums are diagnostic and are not floor area or measured survey quantities.

| Source owner | Raw colliders intersecting open court | Raw colliders touching full entrance envelope | Integrated colliders in either query |
|---|---:|---:|---:|
| golden-gate | 0 | 0 | 0 |
| gallery-frontage | 2 | 2 | 0 |
| fifty-five-frontage | 0 | 3 | 0 |
| context:9c:1159393576 | 30 | 34 | 0 |
| context:9c:18962138 | 0 | 3 | 0 |

Thus 42 raw-source colliders touch the reserved range/court envelope; they are clipped/removed, with outside fragments retained. The raw sources include context already masked by the preceding Taleju phase: this is not a claim that all 42 were newly introduced blockers in c43ae92. Source roof/surface projected intersections inside the open court are zero after integration for all five owners. Manual gameplay/render inspection remains explicitly unperformed. These calculations cannot certify every visible pixel or browser-local override.

### Final architectural inventory

- Court: width 10.0 m, gate-local x [-6,+4]; side ranges z [-1.6,-14], clear depth 12.4 m. Threshold-to-forward face 14.0 m (previous 12.2); previous clear depth 8.55 m. Eave/ridge 8.9/10 m. Nominal sky aperture about 8.5 m wide x 11.75 m long, versus the former narrow 4.4 m width. No camera or global lighting change.
- Forward: 10 m facade; 14 upper timber/pale/red modules and 11 frieze motifs (counts inferred), one tall focal shutter, two subordinate lattices/bracket shelves, tall left shutter, closed left door, actual onward opening, nested reveals, deep lintel with 13 bracket forms, continuous plaster courses, raised threshold/ramp, corner pilasters, ceiling returns and mitered roof. The lower route remains clear; the upper wall starts exactly where the lower wall ends, avoiding coplanar overlap.
- Left: 12.4 m elevation; five unequal lower blind panels with arches/pilasters, five larger wall piers/capitals, four unequal tall louvred shutters and projecting sills, three plaster courses, brick foot/cap, timber eave band/struts, tiled roof. These counts interpolate obscured spans and are not a verified census.
- Right: 12.4 m elevation; separate lower closed door and low lattice; three unequal mid-level window groups with projecting heads; eight arched upper lattice modules, diagonal lattice strips, nested pier panels/capitals, nine strong gallery posts with projecting feet/caps, layered cornices and relief bands, brackets and tiled roof with dark soffit. Major gallery components project approximately .7-1.1 m beyond the brick face, with the eave .75 m out. Figurative carving remains simplified/omitted rather than inventing sacred subjects.
- Reverse: separate `taleju:YamGateInteriorFace` at gate-local z=-1.54, a 4 cm shadow separation from retained proxy cut faces. Aged brick wall, offset opening exactly aligned to the existing 1.64 m gate aperture, timber reveals/lintel, brick foot/coping, thin roof-end infill and short side returns. Closed visual assembly around a real passable opening. The public golden canopy and its original coordinates are unchanged.
- Corners: north roofs retain shared diagonal miter boundaries; thin corner ceilings replace the former duplicate heavy plates. Plaster corner piers resolve the elevation turns. Body/plate and lower/upper wall boundaries meet without duplicate coplanar strips. The east lower corner stays open for the onward turn. Source roofs no longer enter the reserved envelope.
- Metal feature: previously about 1.89 m above its base plane, max radius .69 m (top world 1.97). Now about 1.48 m above its base, max radius .47 m (top world 1.56); three restrained rounded upper stages, muted bronze/gilded coloration. Gate-local center approximately [3.11,-12.20], on the right near the forward range. Identity and exact dimensions remain UNKNOWN/APPROXIMATE; no ritual claim or bell clapper.
- Paving: approximately 199 shallow, instanced warm brown-grey stone flags with staggered courses, existing generated stone map, brick edges and one continuous court collider. Darker owner-local stone tint replaces the clean pale surface; no new texture. Cut source stone foundations/threshold strips no longer cross the court. New ranges terminate in aged brick feet and the photographed raised threshold, not a white continuous foundation.

### Materials, ownership and preservation

Only the five entrance owners receive local tint overrides: warm aged plaster #c5b59a, stone #97836b, aged brick #9b7960, aged timber #49362a / #71553c, muted red #8d4b3e, restrained bronze/gilding. The renderer clones only used materials, shares all existing maps and shader hooks, and disposes clones without disposing shared textures. Global palettes, lighting, quality settings and shadow-budget rules are unchanged. The court remains fully mounted in VERY LOW; no distance streaming is added.

Boxes are instanced and shaped details merged within each owner. New entrance inventory: ground 204 boxes; left 163 boxes / 2 roof surfaces / 5 shapes; right 263 boxes / 4 surfaces/profiles / 455 shapes; forward 214 boxes / 3 surfaces / 50 shapes; reverse 11 boxes / 1 shape. Five entrance owners, 15 precinct owners overall. No per-window React tree, downloaded maps, new dependencies, measured FPS or GPU claims.

Mul court 19.55 x 19.75, center/yaw, all four wings and south shrine are unchanged. Only the entrance-to-Beko connection moves its south end to the new forward passage; Beko range lengths accommodate that end while the north end and Mul approach remain fixed. Existing street/exterior geometry, manual JSON, graphics presets, player, NPCs, audio and camera code are untouched.

### Evidence and remaining limits

Confirmed major forms now represented: asymmetric plaster left/forward versus timber-rich brick right; lower blind arches/pilasters; tall shutters; focal forward window and paired small windows; closed left door; onward door/ramp; upper red/pale band; arched gallery, projecting piers, brackets, struts and roof underside; exposed brick termination; reverse brick gate wall and offset aperture; paving and restrained stacked metal silhouette. Previously these were either squeezed, partly obscured by source proxies or too shallow/underspecified.

PHOTO_INFERRED / APPROXIMATE: selected width/depth/offset, elevation heights, obscured bay count/spacing, fine moulding profiles, concealed room depth, roof-end closure, exact reverse wall proportions, paving census, artifact dimensions and hidden connector. UNKNOWN: complete carvings and deity subjects, unreadable emblems/inscriptions, metal object's identity/function, exact historic alterations and concealed rooms. No AI imagery or sacred interior invented. Manual visual approval is required; no claim of visual completion is made.

Testing: **Not run - user requested manual testing only.** No dev server, build, typecheck, automated tests, browser, screenshots, Playwright or benchmarks. Only source/git inspection and the explicitly permitted geometry calculations were performed.
