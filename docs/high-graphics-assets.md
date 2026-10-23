# HIGH graphics: real sky and surface detail

## External asset ledger

All assets below are locally hosted, unmodified source downloads under Poly Haven's
[CC0 license](https://polyhaven.com/license). No generated images or runtime hotlinks.

### Kloppenheim 05 (Pure Sky)

- Source: Poly Haven, https://polyhaven.com/a/kloppenheim_05_puresky
- Creators: Greg Zaal (original photography), Jarod Guest (sky edits).
- License: CC0 1.0, https://creativecommons.org/publicdomain/zero/1.0/
- Original resolution: available up to 24K; only the 2K version was downloaded.
- Shipped resolution: 2048 × 1024, Radiance HDR.
- Local file: `public/assets/environment/kloppenheim_05_puresky_2k.hdr`
- Download: https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/kloppenheim_05_puresky_2k.hdr
- Size: 3,966,045 bytes.
- Purpose: real blue sky, scattered clouds, visible sun, environment light/reflections on HIGH.
- Selection: compared with https://polyhaven.com/a/kloppenheim_03_puresky.
  05's high-contrast midday capture better fits clear sunny daylight than 03's softer,
  medium-contrast description. Pure-sky editing avoids importing foreign scenery.

### Weathered Brown Planks

- Source: Poly Haven, https://polyhaven.com/a/weathered_brown_planks
- Creators: Dimitrios Savva (photography), Rico Cilliers (processing).
- License: CC0 1.0, https://creativecommons.org/publicdomain/zero/1.0/
- Original resolution: available up to 16K; only 1K maps were downloaded.
- Shipped resolution: 1024 × 1024 per map, JPEG, linear data interpretation.
- Purpose: restrained grain, dry roughness and shallow ambient occlusion on tagged generic
  timber surfaces only. Existing timber color/albedo and carved geometry remain authoritative.
  Normal strength is 0.22; AO strength is 0.18. This is generic surface approximation,
  not a photographic reconstruction of an individual historical carving.

| Map | Local file | Bytes | Original download |
| --- | --- | ---: | --- |
| OpenGL normal | `public/assets/materials/weathered-brown-planks/normal-1k.jpg` | 223,250 | https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/weathered_brown_planks/weathered_brown_planks_nor_gl_1k.jpg |
| Roughness | `public/assets/materials/weathered-brown-planks/roughness-1k.jpg` | 234,672 | https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/weathered_brown_planks/weathered_brown_planks_rough_1k.jpg |
| AO | `public/assets/materials/weathered-brown-planks/ao-1k.jpg` | 137,846 | https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/weathered_brown_planks/weathered_brown_planks_ao_1k.jpg |

No downloaded albedo, displacement or metalness maps. Red Brick 03 was considered but
its industrial character is unsuitable; existing Newar masonry patterns were retained.

## Existing architecture texture audit (code inspection)

| Surface | Before this phase | HIGH presentation |
| --- | --- | --- |
| Khauma Gate | Generated 256px gate-brick color reused as bump; scalar/procedural roughness | Original color/pattern; bump ×1.35; controlled daylight and 8× anisotropy |
| Brick buildings / palace brick | Generated 256px brick color/bump; procedural age/roughness | Original masonry; bump ×1.35; environment fill and directional shadows |
| Generic timber / palace timber | Generated 256px grain color/bump; scalar/procedural roughness | Existing albedo; sourced normal, roughness and AO maps |
| Roof tiles | Generated 256px color/bump; scalar/procedural roughness | Existing maps; bump ×1.15; 8× anisotropy |
| Road / plaza | Generated stone or paving color/bump; scalar/procedural roughness | Existing ground patterns; bump ×1.35 for road stone, ×1.15 for paving; 8× anisotropy |
| Stone monuments | Generated stone color reused as bump, including separate 128px ensemble stone; scalar/procedural roughness | Existing stone maps/colors; tagged stone bump ×1.35; untagged ensemble stone unchanged |

These architecture factories had no dedicated normal, roughness, AO or displacement
maps before this phase. Specialized decorative shaders and photographic signage remain
unchanged. Character assets are outside this audit and are not assigned these maps.
No true displacement or new reconstruction geometry is used.

## Lighting, switching and budget

- HDR solar centroid measured from the downloaded radiance data:
  `(0.2160195357, 0.9637624643, 0.1565166846)`, elevation approximately 74.53°.
  Yaw-only rotation preserves a level photographic horizon and the previous light azimuth.
  HIGH's directional light and small depth-occluded halo use this same rotated direction.
  The HDR supplies the only sun disc. There is no fullscreen bloom.
- Background intensity 0.65; environment intensity 0.18; direct sun 3.25;
  hemisphere 0.28; ambient 0.02; AgX exposure 0.98. Fog stays 110–360m with
  the existing HIGH blue horizon color. These values need manual visual approval.
- Environment and material loaders have local Suspense boundaries and mount only on HIGH.
  No asset preload, no downloads on initial LOW/MEDIUM, no world/physics remount.
  Loader caches retain assets after first use for fast reselection. On downgrade,
  environment/background and original material maps, normal scale, AO and roughness restore.
- 4,561,813 new asset bytes total (approximately 4.35 MiB).
  Compressed download size is not GPU memory size; HDR decoding, automatic PMREM and
  mipmapped textures allocate additional GPU memory on HIGH.
- Shared maps, hardware-capped 8× anisotropy, existing 4096 shadow map and FXAA.
  Desktop DPR cap 2; mobile HIGH cap 1.5. No additional fullscreen passes,
  volumetrics, SSAO, SSR, GI, DOF, motion blur or world streaming.
- Testing/build/typecheck/browser review were not run at the user's request.
