# Phase 7C.1 - open plaza and sitting arcade

Frozen heritage, frame, player/controller, camera and five street connections unchanged. No web research. All existing 130 tests preserved.

Removed 24 encroaching generic modules; 79 retained unchanged, none moved or added. Removal covers the opposite-palace row, eastern/southeastern intrusions and near approach flanks. Distant enclosure remains. The original brick ground is exposed across a broader render-only clear zone; pale context paving is clipped outside it without editing heritage polygons or the ground system.

One approximate southern sitting-edge assembly replaces the generic frontage: working 46 m length, 7 m platform depth, 0.54 m plinth, 17 heavy timber posts / 16 open lower bays, brick rear wall, upper window-gallery rhythm, repeated brackets and a continuous 10 m deep tiled roof. Existing materials and instance/merge batches reused. Dimensions are PHOTO_PROPORTION / ARCHITECTURAL_INFERENCE working assumptions, not survey or a verified named-building footprint.

Simple rear-wall, post, floor/platform collision. Three short step approaches allow entry; the covered walkway is traversable. West entrance, Old Town, Tachupal, Taumadhi and Potters connections remain clear.

Validation: lint, typecheck, 134 tests (130 retained + 4 minimal), build and short browser smoke PASS. Plaza movement, platform ascent, open-bay entry, rear-wall blocking and walking along the arcade PASS; browser errors none. Sampled plaza/plaza-wide: 36 calls, 150,078 submitted triangles including shadows; arcade: 31 calls, 147,378 triangles. Eight texture allocations unchanged. Headless counters are not hardware frame-rate guarantees.

Manual review only: `review=plaza`, `review=arcade`, `review=plaza-wide`, with architectureDebug and silhouette OFF. No next phase.
