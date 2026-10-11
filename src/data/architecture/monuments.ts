import { mapCalibrations } from "../world/map-measurements.ts";
import { buildSpatialRegistry } from "../../lib/map-calibration.ts";
import { sources } from "../world/registry.ts";
import type { MapFeature } from "../../types/spatial.ts";

export const reconstructionTarget = "CONTEMPORARY_RECONSTRUCTED_BHAKTAPUR_DURBAR_SQUARE";
export const architecturalTypes = ["PALACE_FACADE","NEWAR_PAGODA","SHIKHARA_STONE","OCTAGONAL_MANDAP","SMALL_NEPALI_SHRINE","TERRACOTTA_SHRINE","COLUMN_MONUMENT","BELL_MONUMENT","CONTEXT_BUILDING","UNRESOLVED_PLATFORM"] as const;
export type ArchitecturalType = typeof architecturalTypes[number];
export const identitySources = {
  ntb: { reference:"https://ntb.gov.np/bhaktapur", scope:"Open palace square, carved-window palace, Golden Gate, stone Vatsala shikhara and Malla column; no metric geometry" },
  municipality: { reference:"https://www.bhaktapurmun.gov.np/en/content/ward-no-3", scope:"Official inventory of palace, Golden Gate, Vatsala, Chyasin and Yakshashwar; not footprint identification" },
  mission: { reference:"https://whc.unesco.org/document/187827", scope:"2020 mission report pp 99-102: repaired/reconstructed temple states; not proof of 2026 completion. Text inspected; PDF image access blocked" },
  crossMap: { reference:"https://commons.wikimedia.org/wiki/File:Map_of_Bhaktapur_Durbar_Square.jpg", scope:"Digital Himalaya labelled map, 2006, CC BY-SA 3.0. Visually inspected; relative-topology cross-reference ONLY, never a replacement metric map" },
  palacePhoto: { reference:"https://commons.wikimedia.org/wiki/File:Bhaktapur-Palast_der_55_Fenster-01-gje.jpg", scope:"Gerd Eichmann, 2013, CC BY-SA 4.0, identified palace photo metadata; original download unavailable" },
  localPhotos: { reference:"reference/landmarks/55-window-palace/photos/", scope:"User-supplied front-01 and oblique-01 visually inspected: continuous upper timber window zone, projecting frames, horizontal brick frontage and octagonal pavilion. Author/date/licence unresolved; research only, not shipped" },
  brief: { reference:"Phase 5B user brief", scope:"Architectural families and contemporary reconstruction target supplied by user; no dimensions or positions" },
} as const;
export interface MonumentIdentity {
  id:string; canonicalName:string|null; alternateName?:string; classification:"APPROXIMATE";
  sourceFootprintId:string|null; architectureType:ArchitecturalType;
  sourceReferences:(keyof typeof identitySources)[]; confidence:"MEDIUM"|"LOW"|"UNRESOLVED";
  reconstructionState:"IDENTIFIED"|"PROVISIONALLY_IDENTIFIED"|"UNRESOLVED";
  mappingRationale:string;
}
const candidate=(id:string,name:string,footprint:string,type:ArchitecturalType,rationale:string,confidence:"MEDIUM"|"LOW"="MEDIUM"):MonumentIdentity=>({
  id,canonicalName:name,sourceFootprintId:footprint,architectureType:type,classification:"APPROXIMATE",sourceReferences:["ntb","municipality","crossMap","brief"],confidence,reconstructionState:"PROVISIONALLY_IDENTIFIED",mappingRationale:rationale,
});
export const monumentIdentities:MonumentIdentity[]=[
  candidate("palace-complex","Royal palace frontage / Fifty-Five Windows wing","unesco-monument-footprint-001","PALACE_FACADE","Connected northern courtyard complex matches labelled royal palace. Eastern front is candidate Fifty-Five Windows wing; full polygon is NOT entirely that palace."),
  candidate("rameshwar","Rameshwar Temple","unesco-monument-footprint-002","SMALL_NEPALI_SHRINE","Western square footprint north of small southern shrine matches labelled Rameshwar. Open roofed-shrine interpretation remains approximate.","LOW"),
  candidate("badrinath","Badrinath shrine","unesco-monument-footprint-003","TERRACOTTA_SHRINE","Small western footprint south of Rameshwar matches labelled Badri shrine; no carvings or precise heights inferred.","LOW"),
  {id:"unresolved-central-symbol",canonicalName:null,sourceFootprintId:"unesco-monument-footprint-004",architectureType:"UNRESOLVED_PLATFORM",classification:"APPROXIMATE",sourceReferences:["crossMap"],confidence:"UNRESOLVED",reconstructionState:"UNRESOLVED",mappingRationale:"Small central diamond: possible shrine symbol; full extent and identity unresolved. Remove invented pagoda."},
  candidate("vatsala","Vatsala Durga Temple","unesco-monument-footprint-005","SHIKHARA_STONE","Central rectangle in front of eastern palace, north of Yaksheshwar; matches Vatsala Durga on labelled map. Distinct from similarly named eastern Vatsala shrines."),
  candidate("yaksheshwar","Yaksheshwar Mahadev / Pashupatinath Temple","unesco-monument-footprint-006","NEWAR_PAGODA","Southern central footprint matches labelled Pashupatinath relative to Vatsala and palace."),
  candidate("siddhi-lakshmi","Siddhi Lakshmi Temple","unesco-monument-footprint-007","SHIKHARA_STONE","Eastern footprint southeast of palace and east of central Vatsala matches labelled Siddhi Laxmi; high platform and guardians supplied by brief."),
  { ...candidate("silu-mahadev","Phasi Dega / Silu Mahadev","unesco-monument-footprint-008","UNRESOLVED_PLATFORM","Northeastern concentric plinth and diamond match labelled Fasidega. Only central symbol was traced. Current restored upper form not inspectable; retain neutral platform instead of guessing."), sourceReferences:["crossMap","mission","brief"] },
  {id:"unresolved-southern-sector",canonicalName:null,sourceFootprintId:"unesco-monument-footprint-009",architectureType:"UNRESOLVED_PLATFORM",classification:"APPROXIMATE",sourceReferences:["crossMap"],confidence:"UNRESOLVED",reconstructionState:"UNRESOLVED",mappingRationale:"Large southern-sector footprint lies beyond principal Durbar plaza toward Taumadhi. Remove the invented three-tier temple; no named identity assigned."},
  candidate("chyasilin","Chyasilin Mandap","supplement-chyasilin","OCTAGONAL_MANDAP","Small light octagonal/circular map mark east of Vatsala in front of palace, corresponding to labelled Chayasilin. New supplementary source-pixel anchor; not a Phase 4B traced monument."),
  candidate("malla-column","Bhupatindra Malla column","supplement-malla-column","COLUMN_MONUMENT","Candidate small square mark west of Vatsala in front of palace agrees with labelled column and official relative location. Anchor is approximate, not a surveyed pedestal."),
  {id:"golden-gate",canonicalName:"Golden Gate",sourceFootprintId:"unesco-monument-footprint-001",architectureType:"PALACE_FACADE",classification:"APPROXIMATE",sourceReferences:["ntb","municipality","crossMap","localPhotos"],confidence:"MEDIUM",reconstructionState:"PROVISIONALLY_IDENTIFIED",mappingRationale:"Candidate southern frontage seam west of Fifty-Five Windows wing; facade attachment within existing palace, not an independently traced footprint."},
  {id:"taleju-bell",canonicalName:"Taleju Bell",sourceFootprintId:null,architectureType:"BELL_MONUMENT",classification:"APPROXIMATE",sourceReferences:["ntb","brief"],confidence:"UNRESOLVED",reconstructionState:"UNRESOLVED",mappingRationale:"Bell identity/location distinctions insufficiently resolved; do not add guessed freestanding bell."},
];

// Supplementary symbol outlines stay separate from the immutable Phase 4B traces.
// Anchor/extent choices are APPROXIMATE, not survey footprints.
export const supplementalMapFeatures:MapFeature[]=[
  { id:"supplement-chyasilin",kind:"building-footprint",name:"Candidate Chyasilin symbol",calibrationId:mapCalibrations[0].id,sourceIds:["unesco-bhaktapur-monument-zone-2006"],vertices:Array.from({length:8},(_,i)=>[1090+8*Math.cos(Math.PI/8+i*Math.PI/4),1323+8*Math.sin(Math.PI/8+i*Math.PI/4)]),accuracy:"APPROXIMATE",measurementMethod:"Supplementary symbol centre [1090,1323], 8 px radial interpretation from local UNESCO raster; labelled-map topology cross-check",uncertaintyNote:"Symbol not survey footprint; centre/extent and identity require human review; not part of original 17 traces"},
  { id:"supplement-malla-column",kind:"building-footprint",name:"Candidate column pedestal",calibrationId:mapCalibrations[0].id,sourceIds:["unesco-bhaktapur-monument-zone-2006"],vertices:[[1035,1333],[1040,1333],[1040,1338],[1035,1338]],accuracy:"APPROXIMATE",measurementMethod:"Candidate small mapped pedestal west of central Vatsala; labelled-map/official relative-location cross-check",uncertaintyNote:"Manual candidate anchor several metres uncertain; statue sculpture and exact dimensions unknown"},
];
export const supplementalSpatialFeatures=buildSpatialRegistry(supplementalMapFeatures,mapCalibrations,sources);

export const landmarkProportions={
  classification:"APPROXIMATE",method:"PHOTO-INFERRED APPROXIMATE PROPORTION for palace only; other forms are brief-informed assumptions, not measured dimensions",
  palace:{storeyHeight:2.9,upperWindowSpacing:1.15,upperWindowHeight:1.7,lowerWindowSpacing:3.1},
  vatsala:{platformSteps:6,spireHeightToWidth:1.5,bodyHeight:2.7},
  siddhi:{platformSteps:18,spireHeightToWidth:1.45,bodyHeight:2.8,guardianPairs:5},
  yaksheshwar:{tiers:2,bodyHeight:3.1,roofRiseRatio:.19,tierGap:1.2},
  mandap:{platformSteps:3,lowerPostsHeight:2.3,upperPostsHeight:2.0,roofRise:1.0},
  column:{shaftHeight:6.0,shaftRadius:.24,statueHeight:1.0},
} as const;
