# Development world editor V2

Run `npm run dev`, then open http://localhost:3000/explore?world=bhaktapur&editor=1.
Phase 9B is paused. Normal exploration has no editor camera, listeners, selection raycaster, panel or shortcuts. Production ignores `editor=1`; the write/read editor API returns 404.

## Controls

| Input | Action |
| --- | --- |
| Hold RMB + mouse | Free camera look; release restores cursor |
| RMB + WASD | Fly forward/back/left/right relative to camera |
| RMB + Q / E | Down / up along world Y |
| RMB + Shift | Temporary 4x boost |
| RMB + wheel | Change speed between 0.5x / 1x / 2x / 4x |
| Speed selector | Choose speed without holding RMB (base 6 m/s at 1x) |
| Left click | Select architecture |
| Alt + left click | Cycle overlapping registered candidates |
| 1 / 2 | Assembly / Part selection |
| W / E / R, without RMB | Translate / rotate / scale gizmo |
| F | Frame selected assembly or part |
| P | Select parent assembly |
| L | World / local gizmo axes |
| Ctrl+Z | Undo |
| Ctrl+Y / Ctrl+Shift+Z | Redo |

RMB starts navigation directly: pointer lock is requested on the press, with pointer-capture drag fallback if unavailable. There is no preliminary capture click. Context menus are suppressed only in the editor viewport. Escape, release, pointer cancellation and window blur stop navigation. Camera motion is smoothed; pitch is bounded. During gizmo dragging the free camera cannot start or move. UI clicks never navigate or select viewport geometry; text fields retain native keyboard behavior.

## Selection and parts

**33 assemblies / 124 architectural parts** are registered. All start **LOCKED**, including saved overrides. Each part has its own lock: a part can be deliberately unlocked under a locked parent. The inspector shows LOCKED/UNLOCKED, inherited evidence status, source values, current numeric values and collider ownership. VERIFIED entries warn about verified placement; a visual override never upgrades evidence confidence.

Assembly mode selects a whole registered monument/frontage. Part mode selects role groups from the procedural architecture, using instance/triangle ownership metadata without exposing individual windows, struts or raw meshes. Search the categorized assembly list, then click the **Selection hierarchy** to reach any part behind other geometry. Click **Select parent** or P to return to the assembly. Alt-click cycles nearest-to-farthest unique architectural candidates; the candidates can also be chosen from the panel.

Golden Gate has four independently editable parts:

- **Gate frame / main decorative architecture**: relief jambs, frames, lintel, torana and deity reliefs; owns the two jamb colliders.
- **Palace wall / gate masonry behind frame**: side masonry, upper masonry and rear tiled roof; owns three structural colliders.
- **Golden Gate swept canopy**: canopy, upturns and ridge figures; decorative, no original collider.
- **Summit / upper ornament**: winged Garuda; decorative, no original collider.

Palace facade, window/gallery band, roof, return and pale gallery arcade use existing role/orientation boundaries. Vatsala separates plinth, access stairs, lower body, shikhara and summit. Chyasilin separates platform, stairs, columns, lower/upper pavilion, roofs and finial. Other monuments and evidence-backed edges group their actual platform/stair, body, facade, roof and ornament roles. Unmatched polygon-wall colliders stay with their structural body; pagoda collision-only roof decks follow their roof part. Distant footprint-only massing, ground, player, camera, lighting and helpers are not editable.

## Transform, visibility and history

Numeric assembly values are absolute **WORLD** transforms. Numeric part values are **LOCAL TO PARENT**, even when gizmo axes are set to World. Rotation fields use XYZ Euler degrees; copied/saved JSON uses radians. L changes gizmo axes, not numeric storage. Scale gizmos use local axes as in standard Three TransformControls; centre handles and the uniform numeric checkbox scale all axes. Scale must be positive (0.01-20). The gizmo maintains approximately constant screen size.

Numeric fields preview immediately; Enter/blur finishes one operation. Optional snapping: translation OFF/0.05/0.10/0.25/0.50/1 m, rotation OFF/1/5/15 degrees, both initially OFF. History retains 50 completed operations for both assemblies and parts; an entire drag is one operation. Undoing a relocked object requires unlocking it.

**Reset object** restores that entry's source, is undoable and needs no dialog. Resetting an assembly does not delete independent part overrides; reset parts individually. **Copy transform** copies radians-based JSON and also shows a read-only copy field.

**Hide selected**, **Isolate selected**, and **Show all** are temporary editor visibility. Isolation hides unrelated architecture, including distant masses; associated hidden colliders are omitted too. Ground remains available. Visibility is never saved. Selecting another hierarchy entry while isolated follows the new selection. Show all clears both hiding and isolation.

F frames the actual selected bounds, avoids underground placement and checks candidate camera positions against visible assembly bounds. **Walk collision check** remains optional: it starts the unchanged player near the camera's horizontal location, pauses editing, and uses WASD/Shift/jump/double-Space fly. It never changes the normal gameplay spawn. Return to editor for free-camera editing.

## Persistence and composition

Save each entry individually with **Save**; a Saved checkmark confirms the response. Reload rehydrates saved values while resetting locks and session history. Reset then Save removes only that entry.

The fixed file is `src/features/bhaktapur/data/manual-transform-overrides.json`.
The existing flat schema is retained for full backward compatibility:

```json
{
  "golden-gate": {"position": [-16, 0, -17], "rotation": [0, 0, 0], "scale": [1, 1, 1]},
  "golden-gate/gate-frame": {"position": [0.2, 2, 0.5], "rotation": [0, 0, 0], "scale": [1, 1, 1]}
}
```

These numbers illustrate the schema, not recommended reconstruction coordinates. Part IDs include their parent assembly. Existing assembly-only files remain valid; no migration or automatic placement correction is performed. Saved overrides also render with matching collision in normal exploration.

Let `S_A` be the original assembly transform, `C_A` its current absolute world transform, `S_P` the registered part pivot transform local to that assembly, and `C_P` the current absolute local part transform. Each transform uses `T * Rxyz * Scale`.

Original builders emit world-space geometry. A part's final world matrix applied to those original points is:
`C_A * C_P * inverse(S_P) * inverse(S_A)`.

An untouched part has `C_P=S_P`, giving `C_A * inverse(S_A)`; with no overrides `C_A=S_A`, giving the original source world geometry. Assembly and part edits inherit once, including rotated/nonuniformly scaled parents; part position values replace the registered local pivot, rather than being an extra world offset. Source models, coordinates and evidence files are never mutated.

Each original collider belongs to exactly one role group. Edited part colliders use eight-corner convex hulls through that identical composed matrix, preserving XYZ rotations, nonuniform scaling and shear. They replace their old source-position colliders. Decorative parts with zero original colliders remain non-colliding, explicitly identified in the inspector.

`POST /api/dev/world-editor/transforms` accepts only registered assembly/part IDs and finite bounded transforms. It writes only the fixed JSON file, accepts no paths or extra keys, serializes writes, restricts loopback/origin, requires the editor JSON header and limits payloads to 32 KiB. Production cannot write. Saves are local repository writes, not multiuser or crash-atomic storage.

## Verification and performance

Automated browser saves use mocked in-memory storage. Real route write/read/reset/security tests run in an isolated temporary repository fixture. The real override file remains unchanged; no reconstruction correction ships in this task.

Matched-camera development counters: **36 normal / 233 editor Assembly / 240 Golden Gate Part draw calls**; **162,550 / 140,416 / 140,416 submitted triangles**. The V1 matched editor measurement was 235 draw calls. Different batch-level culling explains submitted-triangle differences, not removed geometry. Editor uses eight existing textures; no materials/maps/lights are added. These are view-dependent counters, not an FPS benchmark.

Full part batches activate only for the inspected assembly, hidden/isolated parts or actually modified parts. Other assemblies remain material-batched. Native selection raycasting occurs only on editor left clicks. Normal scenes with no overrides keep the existing global batching; saved overrides split only affected assemblies/parts.

Manual check: navigate around Golden Gate with RMB, release, choose Part, click frame, unlock, adjust, Save and reload. Confirm exact local values and that masonry did not move. Use Walk collision check to inspect jambs and opening. Reset+Save temporary tests. Large manual edits can intentionally disconnect architecture, overlap neighbors or obstruct streets; the editor does not repair evidence or geometry automatically. No duplication/deletion or raw primitive editing is provided. Manual user testing is required before Phase 9B.
