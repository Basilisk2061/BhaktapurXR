# Phase 10B pre-content inventory

Captured before editing heritage content. Source frames below come from the existing spatial audit; later render corrections and saved parent overrides take precedence. Geometry, correction layers and saved state will not be modified.

## Scene candidates

| Game object | Source-audit mapping / coordinates / relationship | Current parent override | Research disposition |
|---|---|---|---|
| khauma-gate | Old Town Entrance Gate / Khauma-area west gate; NW of Rameshwor; west of Krishna and Gallery; -121.537, -34.286; -1.709170; 1,1,1 | {"position": [-121.53684759946469, 0, -34.285908249582874], "rotation": [3.141592653589793, -1.5163246617599573, 3.141592653589793], "scale": [1, 1, 1]} | Investigate separately; no record until identity/source audit |
| rameshwar | Rameshwor Temple; Just inside entrance, north of Badri, west of Krishna; -108.553, -23.326; 0.000000; 1,1,1 | "none" | PROVISIONAL/UNRESOLVED: inspect later replacements or name binding before activation |
| badrinath | Badri Temple; SW of Krishna; south of entrance; -116.249, -8.810; 1.570796; 1,1,1 | "none" | PROVISIONAL/UNRESOLVED: inspect later replacements or name binding before activation |
| gopinath-krishna | Krishna Temple / Gopinath-Dwarika; East of Badri; north-west of Shiva; -97.272, -14.605; 1.492796; 1,1,1 | "none" | Investigate separately; no record until identity/source audit |
| kedarnath | Shiva Temple (western central plan symbol); SE of Krishna; west of central forecourt; -73.086, 1.230; 1.570796; 1,1,1 | {"position": [-73.08588091683511, 0, 1.2300374321516927], "rotation": [0, 1.4436730516363887, 0], "scale": [1, 1, 1]} | PROVISIONAL/UNRESOLVED: inspect later replacements or name binding before activation |
| gallery-frontage | National Art Gallery / adjoining Rana palace wing; North edge, west of Golden Gate; -41.491, -19.027; -0.088473; 1,1,1 | "none" | Investigate separately; no record until identity/source audit |
| golden-gate | Golden Gate / Lu Dhwaka; Royal frontage, between Gallery wing and 55 Palace; -16.157, -16.959; -0.038936; 1,1,1 | "none" | Investigate separately; no record until identity/source audit |
| fifty-five-frontage | 55 Windows Palace; East of Golden Gate; north of Chyasilin; 2.020, -14.218; -0.109653; 1,1,1 | "none" | Investigate separately; no record until identity/source audit |
| malla-column | King Bhupatindra Malla's Column; South of palace Gate; NW of Vatsala Durga; -16.370, 4.532; 0.000000; 1,1,1 | {"position": [-20.161491059802476, 0, 0.6762123926027863], "rotation": [0, 0, 0], "scale": [1, 1, 1]} | Investigate separately; no record until identity/source audit |
| chyasilin | Chyasalin Mandap; South of 55 Palace; NE of Vatsala Durga; -4.945, -5.025; 0.000000; 1,1,1 | "none" | Investigate separately; no record until identity/source audit |
| vatsala-durga | Vatsala Durga Temple; SE of column; SW of Mandap; north of Pashupati; -10.013, 7.277; 0.000000; 1,1,1 | "none" | Investigate separately; no record until identity/source audit |
| yaksheshwar | Pashupatinath Temple; South of Vatsala Durga; -11.928, 19.708; -0.138000; 1,1,1 | "none" | Investigate separately; no record until identity/source audit |
| siddhi-lakshmi | Siddhi Laxmi Temple; East of Chyasilin; 13.038, -6.078; -0.135000; 1,1,1 | "none" | Investigate separately; no record until identity/source audit |
| silu-mahadev | Fasidega Temple / Phasi Dega; NE of palace public frontage; west of eastward exits; 36.381, -39.589; -1.496796; 1,1,1 | "none" | PROVISIONAL/UNRESOLVED: inspect later replacements or name binding before activation |
| vatsala-bell | Vatsala-associated bell; Near west side of Vatsala Durga; -13.994, 9.259; 0.000000; 1,1,1 | "none" | PROVISIONAL/UNRESOLVED: inspect later replacements or name binding before activation |
| large-bell | Large/Taleju bell; Between column and Vatsala temple; -14.082, 5.485; 0.000000; 1,1,1 | "none" | Investigate separately; no record until identity/source audit |
| palace-corner-shrine-unresolved | Small red shrine next to Golden Gate; Immediately east of Gate, against palace frontage; -11.847, -14.085; -0.109653; 1,1,1 | "none" | PROVISIONAL/UNRESOLVED: inspect later replacements or name binding before activation |
| edge:yetachapari:1160027594 | Southern inn / Yetachapari (provisional); Southern edge west of Pashupati, above Potters exit; -43.962, 13.974; 0.000000; 1,1,1 | "none" | Investigate separately; no record until identity/source audit |

## Active source chain

`buildCompletedSquareModels` -> `buildPalaceFrontageModels` -> `buildInsideSquareModels` -> `buildSpatiallyAuditedModels`. Gopinath uses dedicated reference model. The central stone ensemble applies later bell/column transforms. The normal main pass replaces `rameshwar` and reconfigures `kedarnath`; IDs alone cannot establish their real identity.

Major temple near Golden Gate: candidate A is stone Vatsala Durga in the forecourt; candidate B is southern two-roof Yaksheshwar/Pashupatinath; candidate C is a small red corner shrine immediately east of the Gate. C remains explicitly identity-unresolved in source. Investigate A and B separately, never silently label C or confuse the unmodelled inner Taleju temple with an external pagoda.

Other candidates: eastern small shikhara, Yetachapari/sattal, inner Taleju/palace courtyards. Existing context correspondence alone is insufficient for factual records. Nyatapola belongs to Taumadhi, not this scene.
