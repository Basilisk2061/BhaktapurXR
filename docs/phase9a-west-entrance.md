# Phase 9A - west entrance and Char Dham

Continued the interrupted worktree. No frozen Phase 6C coordinates, scale, origin, rotation, existing monument anchors or five street-exit definitions changed. Player, fly controller, camera, lighting and Phase 8A material definitions are unchanged. New aerial review initializes existing fly mode only in development.

| Entity | Implementation | Evidence / confidence |
| --- | --- | --- |
| Khauma / West Gate | Pointed traversable arch, thick piers, curved crowned parapet, layered arch/crown trim, central lotus/kalasha and two side finials, recessed shoulders | PHOTO_INFERRED form; APPROXIMATE dimensions; LOW confidence working position, explicitly PROVISIONAL |
| Gopinath / Dwarika | Enclosed shrine, raised plinth, triple timber portals, broad lower/smaller upper roof, connected struts and upper chamber support plate | PHOTO_INFERRED; PROVISIONALLY_IDENTIFIED binding; LOW |
| Kedarnath | Brick shikhara, stepped base, axial door, paired frontal subsidiary towers, ribs, cornices and dark summit | PHOTO_INFERRED; PROVISIONALLY_IDENTIFIED spatial correspondence; LOW |
| Badrinath | Existing restored brick tower/stone porch, columns and lions retained; four-face rib and portal articulation added | RECONSTRUCTED_APPROXIMATE; LOW; frozen icon anchor retained |
| Rameshwar | Four-stone-pillar pavilion retained unchanged | UNESCO-supported form, reconstruction dimensions APPROXIMATE; MEDIUM |
| Jagannath | Two-roof brick/timber pagoda and stepped platform, only broad photographed form modeled | PHOTO_INFERRED; PROVISIONALLY_IDENTIFIED placement; LOW |

Identity decision: user confirmed UNESCO-supported Rameshwar pavilion; the misleadingly named shikhara photograph is used for provisional Kedarnath. Gopinath naming remains provisional. Gate photograph GPS 27.672301 N / 85.427366 E is CAMERA_LOCATION evidence, never a gate survey point. New gate/Kedarnath/Jagannath working positions and bearings require manual registration review. No reconstructed dimensions or decoration are VERIFIED.

Sources reused: Digital Himalaya schematic map (existing attribution/share-alike retained), municipality Ward 3 inventory, UNESCO SOC 2022 pp44-46, existing 2021 western-group and Badrinath photographs. Additional previews already inspected during the interrupted run:
- [Gate, Shadow Ayush, 2018, CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Old_Town_Entrance_Gate,_Bhaktapur_Durbar_Square.jpg)
- [Jagannath, Dolon Prova, 2026, CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Jagannath_Temple_by_Bhaktapur.jpg)
- [Kedarnath-category photograph with conflicting Rameshwor filename, Rajesh Dhungana, 2021, CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Rameshwor_Temple_Bhaktapur_Durbar_Square_Bhaktapur_Nepal_Rajesh_Dhungana_(2).jpg)

Incomplete corridor repair target: identified Yaksheshwar/Pashupatinath. Replaced disconnected/reversed struts with facade-to-eave connections; its walls, roof geometry, colliders and anchor remain identical. Gopinath was also structurally completed. Exact carved joints remain approximate.

Western fabric: removed 15 conflicting generic modules; 64 ordinary context modules retained. Fourteen retained western/northwestern context models explicitly PLACEHOLDER; distant ones lowered/narrowed into separated roof silhouettes. Two short gate-adjoining roof/wall edges are PHOTO_INFERRED / LOW, not identified sattal reconstructions. Removed affected western pale ground overlays without changing heritage paving, polygons or ground collision. No new generic housing rows.

Validation: lint, typecheck, 104 relevant tests, production build PASS. Browser gate crossing, pier blocking and all five review routes PASS; browser errors none. Aerial/fly render inspected. Sampled 28-36 draw calls, 153,262-157,050 submitted triangles including shadows, 12 geometries, 8 textures. Maximum submitted triangles ~4.6% above Phase 8A maximum; no added texture allocations. Hardware FPS not measured.

Review URLs (development only): `/explore?world=bhaktapur&review=west-gate-outside`, `west-gate-inside`, `west-char-dham`, `west-aerial`, `west-to-central` using the same prefix.

Manual visual review REQUIRED. Unresolved: exact new gate/Jagannath/Kedarnath locations and facing; Gopinath name binding; named adjoining sattals and modern building outlines; pale gate surface treatment; hidden rear elevations, carved ornament, guardian anatomy and measured dimensions. Distant unknown context remains placeholder; this is not a surveyed/as-built reconstruction.
