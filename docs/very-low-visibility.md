# VERY LOW and safe visibility audit

## Decision: SAFE SECTOR ACTIVATION DEFERRED

`CentralHeritageEnvironment` merges unedited models across the entire world by material:
one brick instance batch can own walls from many buildings, while a separate merged
roof/profile batch owns their roofs. Edited assemblies are separately grouped, including
part overrides that can extend beyond source bounds. These are not coherent sector
ownership boundaries. Hiding existing batches by distance would repeat the broken-building
failure. Repartitioning every batch and every edited child into independently bounded,
whole-building sectors is deliberately deferred until it can be validated visually.

No sector manager, distance-based architecture hiding, mount/unmount streaming or physics
unloading was added. All editable architecture stays available in World Editor. Sky,
ground, collisions and heritage managers remain active. No occlusion queries or CPU
raycast occlusion were introduced: they add complexity without addressing ownership.

## Rendering audit and changes

- Architecture already used Three's default frustum culling. The explicit
  `frustumCulled={false}` cases are camera-relative sky/halo draws and are intentional.
- Instanced bounds now explicitly include bounding boxes as well as bounding spheres.
  Merged architectural geometry computes both once after its final baked transform.
  Culling uses full geometry bounds, not the object origin or landmark center.
- Identity-transform batch meshes disable local `matrixAutoUpdate`. Editable parent
  groups retain automatic transforms; animated characters are not frozen.
- Existing shared box geometry, material merging and shadow/detail instancing remain.
  No landmark instancing, detail deletion or additional batching split is introduced.
- Medium/High shadow coverage remains tracked at 10 Hz, 42/48m half extent, with
  existing caster filtering and 2048/4096 maps. VERY LOW and LOW disable shadow rendering.
  Switching presets disposes the old directional shadow map; VERY LOW does not allocate one.
- Frustum culling reduces render work, not geometry/texture residency. Whole-world merged
  bounds remain broad; this phase makes no measured draw-call or FPS claim.

## VERY LOW

- Deterministic CSS-viewport pixel budget: 500k desktop / 280k mobile, clamped to
  DPR 0.55–0.75 desktop / 0.50–0.70 mobile. No FPS-driven adaptation. CSS UI stays sharp.
- One directional light, one hemisphere light, a tiny gradient sky draw; no ambient
  light, HDR, environment, flare, post-processing or dynamic shadows.
- Albedo retained; normal, bump, roughness, AO, metallic and reflection maps disabled.
  Anisotropy 1. Meaningful transparency is not blindly converted to opaque materials.
- Fog remains 110–360m. No architecture distance cutoff needs to be concealed.
- Four preset choices, same persistence key. Saved preference always wins.
  Memory, CPU, coarse-pointer/mobile and screen-density hints select conservatively;
  HIGH is never automatic. Missing hints are handled without assuming deviceMemory exists.

## Character texture views and memory

The three `*-very-low.gltf` files are texture-only views of existing source GLBs.
They reference the original GLB as an external raw buffer, adding the original BIN
chunk's byte offset to each bufferView. Mesh/accessor/skin/animation data is unchanged.
No second geometry binary is shipped. Only a 512px version of each existing 2048px
base-color image is referenced; normal and metallic-roughness texture references are
removed from these views. Originals remain unchanged for LOW/MEDIUM/HIGH.

Derived JPEGs use Pillow Lanczos downsampling, quality 85, from the existing base-color
files, preserving content. Each view uses matte, nonmetallic material scalars.

| Source / usage | Original bytes | Dimensions | Loading |
| --- | ---: | --- | --- |
| Female GLB | 9,145,760 | geometry, one skin | Shared by two NPCs when population starts |
| Old-man GLB | 8,021,980 | geometry, one skin | Shared by two NPCs when population starts |
| Player GLB | 6,014,764 | geometry, one skin | Player; also shared as NPC animation source |
| Female base color | 1,371,865 | 2048² | Non-VERY-LOW character load |
| Old-man base color | 1,081,937 | 2048² | Non-VERY-LOW character load |
| Player base color | 827,511 | 2048² | Non-VERY-LOW character load |
| Female normal | 1,428,785 | 1024² | Non-VERY-LOW character load |
| Old-man normal | 1,084,953 | 1024² | Non-VERY-LOW character load |
| Player normal | 891,822 | 1024² | Non-VERY-LOW character load |
| Character metallic-roughness maps | 3 × 1024² | 1024² each | Non-VERY-LOW character load |
| Kloppenheim HDR | 3,966,045 | 2048 × 1024 | HIGH only |
| HIGH timber maps | 595,768 combined | 3 × 1024² | HIGH only |
| Silu heritage photograph | 1,067,841 | 1280 × 2777 | Heritage image UI, not a world texture |

New albedos: player 53,886 bytes; female 87,215; old man 65,447. Their three glTF JSON
views total 345,741 bytes. Initial VERY LOW character texture residency avoids approximately
69 MiB of RGBA base-level images compared with the full three-character texture set,
before mipmaps/driver formats. This is a dimensional estimate, not a memory benchmark.
Existing architecture maps are only 128/256px and are not pointlessly duplicated.

All same-character actors share useGLTF geometry/material/texture resources and cached
animation clips. SkeletonUtils clones each actor's bones; each actor retains its own
AnimationMixer. Different skeleton instances are never merged. Player/NPC animation
source requests use the same preset-dependent URL.

Limitations: original geometry buffers remain resident. Switching between texture views
can leave both parsed assets in loader caches; visiting HIGH can retain cached HDR/PBR
resources. No forced cache eviction or unsafe disposal is attempted. Initial VERY LOW
does not fetch HIGH assets or the full character image set.

## NPC/audio execution

- NPC route/state/physics logic and all four definitions are retained on every preset.
- LOW/VERY LOW check complete actor bounds at 5 Hz. Within 30m of the player,
  presentation is always visible/full rate. Outside this ring, frustum-visible NPCs use
  15/10 Hz animation respectively below 65m, and 5 Hz beyond it. Offscreen distant
  visual groups hide as a whole and pause mixers; colliders and logical state stay active.
- No distance-only culling of in-view NPCs. Medium/High and the player retain their
  original full-rate animation timing. NPC controller lifetime is independent of visual assets.
- Audio caches actor/head lookups at 2 Hz. On VERY LOW only, head transforms beyond
  18m update at 4 Hz. Nearby positional voices, listener updates, vocal scheduling,
  reactions, footsteps, landing events and ambience retain their existing execution/content.
- Math objects are reused; no frame-by-frame React state is added. World material
  discovery remains 1 Hz. Audio array allocations remain small and are not claimed eliminated.

No test, typecheck, build, runtime review or benchmark was run, as requested.
