# Development world editor

Start `npm run dev` and open http://localhost:3000/explore?world=bhaktapur&editor=1.
Normal mode has no editor UI; production ignores `editor=1` and returns 404 from the editor API. Phase 9B remains paused.

## Controls

- Click architecture or search the collapsible categorized list. Child meshes select the assembly, highlighted by a yellow bounding box. Player, ground, cameras, lights, debug helpers and distant footprint-only masses are excluded.
- All **33 assemblies default locked**, including persisted overrides. Select **Unlock object** deliberately before changing one. The panel shows the source transform and evidence classification, with a VERIFIED placement warning where applicable. Editing never upgrades evidence confidence.
- **W** translate, **E** rotate, **R** scale. Gizmos support XYZ, planar translation and centre/uniform scaling. **L** switches world/local space; scaling uses local axes, as in standard Three TransformControls. The uniform checkbox applies to numeric scale fields. Positive scale 0.01-20 only; negative/mirrored scale is unsupported.
- Drag to orbit, right-drag to pan, scroll to zoom. **F / Focus selected** frames the assembly without changing the normal player spawn. During gizmo dragging orbit is disabled. Inspection does not mount a player, so movement and camera input cannot fight the gizmo.
- Numeric XYZ position is in metres; rotation is XYZ Euler in degrees; scale is unitless. Changes preview immediately. Enter or leaving the field completes one undo operation. Numeric inputs and gizmos honor translation OFF/0.05/0.10/0.25/0.50/1 m and rotation OFF/1/5/15 degrees. Both default OFF. Text fields retain native keyboard behavior.
- **Ctrl+Z** undo; **Ctrl+Y / Ctrl+Shift+Z** redo. History retains 50 completed operations; a drag is one operation. Unlock an operation's object before undoing it. History and locks are session-local.
- **Reset object** restores source values, is undoable, and needs no dialog. Reset then **Save** removes a persisted override.
- **Copy transform** copies JSON with rotation in radians; a read-only field also displays the JSON for manual copying.
- **Hide selected / Show all** are editor-only and never persisted. Hidden assemblies lose their editor colliders too; normal gameplay visibility is unaffected.
- **Walk collision check** starts the unchanged player controller near the inspection camera's horizontal position: WASD, Shift, Space jump/double-Space fly, Ctrl descend while flying, Escape releases mouse. Editing is paused. Return to editor to continue. This temporary inspection spawn never changes the normal gameplay spawn.

## Save and provenance

**Save** posts only `{id, transform: {position, rotation, scale}}` to
`POST /api/dev/world-editor/transforms`. Success displays a Saved checkmark. Reload restores the same transform in editor and normal Bhaktapur exploration. Save each object separately; unsaved edits remain in the current browser session.

The route writes only `src/features/bhaktapur/data/manual-transform-overrides.json`.
Registered IDs, finite bounded numbers and exact request keys are required; paths and extra keys are rejected. Writes are serialized to preserve other entries. The development API permits loopback hosts and matching origins, requires JSON plus an editor header, and rejects payloads over 32 KiB. Production may render committed overrides from this fixed file, but cannot edit it. There is no general filesystem endpoint.

Source models, anchors, evidence ledgers and original coordinates stay untouched.
The source parent transform is `S = T(originX,0,originZ) * Rxyz(0,sourceYaw,0) * Scale(1,1,1)`.
Saved values are an **absolute replacement parent transform** `C = T(position) * Rxyz(rotation) * Scale(scale)`, not offsets added to coordinates.
Source builders emit world-space pieces. Visuals are converted to local space with `inverse(S)` then rendered through `C`; equivalently every original world point uses `C * inverse(S)`. Without an override, `C=S`, preserving source geometry.

Colliders belong to the same logical assembly. Unchanged assemblies retain original cuboids. Edited colliders use eight-corner convex hulls through that same `C * inverse(S)` matrix, including full XYZ rotation, nonuniform scaling and resulting shear. Original batched colliders for the edited assembly are excluded, and reload uses the same path.

Golden Gate's masonry frontage belongs to **Golden Gate / Lun Dhwaka**. The empty source `gate-frontage` interval is not a duplicate selectable object. Attached palace returns remain in their facade assemblies. Distant context stays batched and uneditable.

## Golden Gate manual test

Search **golden**, select, unlock and focus Golden Gate. Make a small translation/rotation, save, refresh and confirm the values. Use Walk collision check to inspect the opening and masonry. Reset+Save if this was only a test. This task ships an empty override file: no monument was automatically aligned.

## Performance and limitations

With an empty override file normal gameplay retains its original global instancing/merged geometry. Editor mode splits 33 assemblies into per-material batches, sharing existing materials, maps and box geometry. Transforms do not regenerate architecture. Persisted normal-mode overrides split only changed assemblies. Transformed hulls rebuild when that assembly changes. No per-window React components or new materials, lights or downloaded assets are introduced.

A matched-camera development check measured **36 normal / 235 editor draw calls** and **162,550 / 140,565 submitted triangles**. Batch-level frustum culling differs; no architectural geometry was removed. These view-dependent counters are not an FPS benchmark.

This edits parent alignment, not individual meshes, roofs or windows. Large edits can overlap architecture or block streets; no automatic spatial repair is attempted. Saves are local repository writes, not multiuser collaboration or crash-atomic storage. Reload discards unsaved edits and history. Manual testing is required before Phase 9B resumes.
