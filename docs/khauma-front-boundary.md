# Khauma square-facing enclosure correction

PHOTO_INFERRED relationships, APPROXIMATE coordinates/dimensions. Owner clarification supersedes the previous nearest-18962138-compound endpoint. Existing buildings, saved overrides and main gate are unchanged.

## Identification and placement

- Guardian: edge:khauma-north-flank:1158762014. Existing source/part frames and saved transform remain intact; one source-space translation is applied to all geometry and colliders, accounting for the saved assembly transform.
- Museum: gallery-frontage, identified as National Art Gallery in reconstruction metadata. The existing museum-entrance-door-wall-flank represents its broad western brick wing. Target is its west-side mid-depth, not the foreground tower or a nearest collider.
- House: context:9c:1159393574. Actual clipped X/Z bounds [-83.885,-35.318] to [-81.886,-31.482].
- Tower: context:9c:1159393573. Actual bounds [-80.564,-33.444] to [-71.705,-28.967].
- Museum western flank bounds [-62.806,-25.899] to [-40.835,-19.008]; body dimensions 21.615 x 8.05 x 5 m.

## World-space coordinate calculation

Calculated from the procedural model data and current saved transforms, without rendering the application. Values rounded to millimetres for reproducibility, not surveyed precision. Points below are X/Z, with ground Y=0.

- Frozen gate centre: [-121.53684759946469,-34.285908249582874].
- Gate-left/start edge: [-121.235,-39.828], derived from the frozen XYZ rotation and 11.1 m working gate width.
- Square-facing unit axis: [-0.054445,0.998517]. Boundary tangent: [0.998517,0.054445].
- Previous guardian portal centre: [-100.829,-44.560]. New: [-101.147,-38.732]. Normal translation approximately 5.837 m; resulting portal normal offset from gate-left line approximately zero.
- A: [-94.505,-38.411] -> [-91.509,-38.248], 3.000 m, direction [0.998517,0.054445].
- B: [-91.509,-38.248] -> [-91.839,-32.198], 6.059 m, square-facing direction [-0.054445,0.998517].
- C: [-91.839,-32.198] -> [-62.466,-23.398], 30.663 m, direction approximately [0.958,0.287].
- C centreline lies at least 1.743 m squareward of the house footprint and 0.778 m squareward of the tower footprint, measured normal to C. Its .45 m body/.58 m cap remain in front with positive clearance.
- Endpoint is 50% through the museum west side's depth, embedded .12 m inward. No building was moved or scaled.

The gate-edge-to-guardian-left-wall span along the boundary is 13.469 m; this is NOT all empty passage, because the retained low building occupies the intervening side. Its plinth reaches tangent distance approximately 12.25 m, leaving roughly 1.2 m ground-level separation before the guardian wall; eaves overhang above that separation. These are working clearances, not a field measurement or gameplay traversal result.

## Geometry and limitations

The old two-segment rear route and colliders are replaced by A/B/C with closed corner joints. Existing guardian returns/rear closure move coherently with the portal. No new wall crosses the main gate approach or guardian opening. Shed removal and the low range are retained.

Wall body 2.65 m high / .45 m thick; aged brick, simple cap and foot. Exact alignment, passage width, wall profile, coordinates and hidden geometry remain approximate. Manual visual/gameplay approval is required. No tests, typecheck, build, server or browser were run.
