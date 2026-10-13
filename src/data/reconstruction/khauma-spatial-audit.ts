import {geographicToLocal,localToGeographic} from "./geographic-frame.ts";
import {bearing} from "./calibration.ts";
import snapshot from "./urban-footprints.json" with {type:"json"};
import {landmarkSpecifications} from "./architecture/specifications.ts";
import {remainingSpecificationById} from "./architecture/remaining-specifications.ts";
import {westSpecificationById} from "./architecture/west-specifications.ts";
import type {Point} from "./types.ts";

// Audit observations are separate from the protected scene. Nothing here updates a transform.
export const spatialAuditSources={
 gateNode:{url:"https://www.openstreetmap.org/node/990795854",version:7,date:"2023-04-04",role:"OBJECT_LOCATION",accuracy:"SOURCE_DERIVED",basis:"White Gate, historic=city_gate, barrier=sally_port; retained original API extract"},
 gateRoad:{url:"https://www.openstreetmap.org/way/179097847",version:15,date:"2025-02-04",role:"STREET_CENTERLINE",basis:"Khauma road ends at city-gate node; adjacent segment approaches from west/northwest"},
 squarePath:{url:"https://www.openstreetmap.org/way/85465819",version:11,date:"2026-10-03",role:"STREET_CENTERLINE",basis:"Pedestrian path begins at gate and turns southeast/east toward palace; not a measured opening azimuth"},
 plan:{url:"https://commons.wikimedia.org/wiki/File:Map_of_Bhaktapur_Durbar_Square.jpg",date:"2006",basis:"Digital Himalaya schematic, compass north up, western shrines then palace along eastward public square; labels are not object centres"},
 zone:{url:"https://whc.unesco.org/en/documents/103370/",date:"2006",basis:"UNESCO north arrow / urban and palace topology; not labelled modern gate survey"},
 gatePhoto:{url:"https://commons.wikimedia.org/wiki/File:Old_Town_Entrance_Gate,_Bhaktapur_Durbar_Square.jpg",date:"2018-09-19",role:"CAMERA_LOCATION",camera:{latitude:27.672301,longitude:85.427366},basis:"Shadow Ayush; gate photo plus reverse/oblique companion inspected. GPS describes camera, never gate centre; no reliable heading"},
 gateOther:{url:"https://commons.wikimedia.org/wiki/File:Old_Town_Entrance_Gate,_Bhaktapur_Durbar_Square1.jpg",date:"2018-09-19",basis:"Same photographer/session, not independent GPS control; through-opening urban facade and low timber flanks"},
 gateWestern:{url:"https://commons.wikimedia.org/wiki/File:Western_gateway_to_the_Bhaktpur_Durbar_Square.jpg",date:"2018-03-10",basis:"Youbesh.dhdl; independent oblique public-side composition with low flanking structures, no surveyed direction"},
 conservation:{url:"https://www.nara.accu.or.jp/img/dissemination/29th.pdf",date:"2022",basis:"Suresh Suras Shrestha, ACCU correspondent report, printed p41 fig4 identifies Khauma Gate; no coordinate/azimuth supplied"},
 visitorSequence:{url:"https://www.bhaktapur.com/discover/bhaktapur-durbar-square-an-open-museum/",basis:"Local documented western shrine group, Kedarnath transition, Yetachapari and central square; conflicting Char Dham naming kept explicit"},
 ntb:{url:"https://trade.ntb.gov.np/wp-content/uploads/2023/04/world-heritage-sites-booklet.pdf",basis:"NTB western pilgrimage group and Golden Gate access to Taleju/royal bath; does not prove exposed five-storey Taleju"},
 userGatePhotos:{url:null,role:"VISUAL_REFERENCE_ONLY",paths:["reference/khauma-gate/khauma-gate-outside.png","reference/khauma-gate/khauma-gate-through.png"],redistribution:"UNESTABLISHED / DO_NOT_COMMIT",captureDate:null,basis:"Both user PNGs inspected. Through view shows pale central shikhara beyond western pagoda eaves; other view frames low brick/timber fabric. Opposing compositions do not establish identical photographic direction from filenames. No EXIF GPS/heading; no metric extraction"},
 aerial:{url:"https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",role:"GEOGRAPHIC_TOPOLOGY_ONLY",captureDate:null,credit:"Esri, Vantor, Earthstar Geographics, GIS User Community",basis:"Zoom 17-19 tiles inspected in temporary browser overlay: gate junction and north/south building lines agree with contributor gate point. Historical/unconfirmed imagery epoch; not current architectural appearance or survey precision. Zoom20 is unavailable; export failure superseded by usable tiles"},
 gopinathIdentity:{url:"https://www.bhaktapur.com/discover/radhakrishna-temple/",basis:"Local text identifies first pagoda entering from western gate as Radhakrishna/Gopinath/Dwarikanath; compared carved portal/plinth/Garuda and gate relationship in 2021 Krishna photo against misnamed 2026 Jagannath photo"},
 jagannathIdentity:{url:"https://www.bhaktapur.com/discover/jagannath-temple/",basis:"Local description distinguishes ordinary one-storey shrine from the two-roof Gopinath; web coordinate is generic/outlier, not a relocation control. Exact present Jagannath footprint remains unresolved"},
};
const path=snapshot.streets.find(s=>s.id==="85465819")!;
const local=(p:number[]):Point=>geographicToLocal({latitude:p[0],longitude:p[1]});
const mappedGate=local(path.coordinates[0]),next=local(path.coordinates[1]);
const dx=next[0]-mappedGate[0],dz=next[1]-mappedGate[1],distance=Math.hypot(dx,dz);
export const gateAxisDirection:Point=[dx/distance,dz/distance];
const sourceCentre=(id:string):Point=>{const ring=snapshot.features.find(f=>f.id===id)!.rings[0].slice(0,-1);return local(ring.reduce((a,p)=>[a[0]+p[0]/ring.length,a[1]+p[1]/ring.length],[0,0]));};
const templeControls:Record<string,string>={"rameshwar":"211080701","badrinath":"211080702","kedarnath":"211080703","gopinath-krishna":"197122572","chyasilin":"495632745","siddhi-lakshmi":"211082584","silu-mahadev":"185750794","yaksheshwar":"1159652820"};
const wing=snapshot.features.find(f=>f.id==="1159393576")!.rings[0].map(local);
function publicEdgeZ(x:number){const hits:number[]=[];for(let i=0;i<wing.length-1;i++){const a=wing[i],b=wing[i+1];if(x>=Math.min(a[0],b[0])&&x<=Math.max(a[0],b[0])&&Math.abs(b[0]-a[0])>1e-8)hits.push(a[1]+(b[1]-a[1])*(x-a[0])/(b[0]-a[0]));}return Math.max(...hits);}
const galleryPoint:Point=[-41.491195052570205,publicEdgeZ(-41.491195052570205)],palacePoint:Point=[2.0197052457578195,publicEdgeZ(2.0197052457578195)];
const gateShift=((galleryPoint[1]+9.352576693681785)+(palacePoint[1]+5.591761196531143))/2;
export const spatialCorrections:Record<string,{coordinate:Point;yaw:number|null;sourceId:string;classification:string;reason:string}>={
 ...Object.fromEntries(Object.entries(templeControls).map(([id,sourceId])=>[id,{coordinate:sourceCentre(sourceId),yaw:null,sourceId,classification:"FROZEN_CONFLICT / RECONSTRUCTED_APPROXIMATE",reason:id==="yaksheshwar"?"Distinct southern two-roof shape cross-bound to mapped outline by plan/aerial and opposing photos; web POI conflicts. Preserve complete assembly, only source-supported registration changes":id==="chyasilin"?"Mapped octagon and aerial pavilion roof agree; original Wikidata/Wikivoyage point was low precision, not a measured footprint":id==="siddhi-lakshmi"?"Distinct stone foundation polygon/aerial position and UNESCO original-plinth retention outweigh schematic centre; old centre intrudes into neighbouring wing/path":"Named mapped polygon cross-checked against unique plan/group shape, aerial building position and photographic neighbouring order; no per-image metric extraction"}])),
 "gallery-frontage":{coordinate:galleryPoint,yaw:null,sourceId:"1159393576-public-south-edge",classification:"FROZEN_CONFLICT / RECONSTRUCTED_APPROXIMATE",reason:"Compare public facade to south-facing mapped wing edge at same X, not whole-wing centroid; aerial frontage and street clearance corroborate northward correction"},
 "fifty-five-frontage":{coordinate:palacePoint,yaw:null,sourceId:"1159393576-public-south-edge",classification:"FROZEN_CONFLICT / RECONSTRUCTED_APPROXIMATE",reason:"Scope-matched public edge and aerial facade; old shallow facade lies in mapped public pedestrian approach. Preserve facade dimensions/X/orientation"},
 "golden-gate":{coordinate:[-16.156550051310745,-7.807960143099187+gateShift],yaw:null,sourceId:"palace-public-edge-interval",classification:"FROZEN_CONFLICT / RECONSTRUCTED_APPROXIMATE",reason:"Retain portal between corrected gallery and palace frontage; translate by average adjacent edge correction, not photo pixels or a generic palace POI"},
 "gate-frontage":{coordinate:[-16.144731812101682,-7.30478765584305+gateShift],yaw:null,sourceId:"palace-public-edge-interval",classification:"FROZEN_CONFLICT / RECONSTRUCTED_APPROXIMATE",reason:"Associated public-edge interval follows explicitly corrected neighbouring facades"},
 "khauma-gate":{coordinate:mappedGate,yaw:Math.atan2(-gateAxisDirection[0],-gateAxisDirection[1]),sourceId:"990795854 / 85465819",classification:"FROZEN_CONFLICT / RECONSTRUCTED_APPROXIMATE",reason:"Tagged gate junction, connected approach/path, aerial building lines and supplied through-gate composition contradict old nominal point and north-south axis"},
};

export const KHAUMA_GATE_VIEW_AXIS={
 id:"KHAUMA_GATE_VIEW_AXIS",status:"FROZEN_CONFLICT_CORRECTED",auditPass:true,
 baselineCentre:[-123.4470690087212,-20.894931416111135] as Point,baselineYaw:-.0235,
 baselineOpeningAxisBearingDegrees:bearing([0,0],[Math.sin(-.0235),Math.cos(-.0235)]),
 proposedCentre:mappedGate,proposedGeographic:localToGeographic(mappedGate),
 proposedInboundBearingDegrees:bearing(mappedGate,next),proposedYaw:Math.atan2(-gateAxisDirection[0],-gateAxisDirection[1]),
 displacementMetres:Math.hypot(mappedGate[0]+123.4470690087212,mappedGate[1]+20.894931416111135),
 confidence:"MEDIUM",accuracy:"SOURCE_DERIVED / APPROXIMATE",correctionApplied:true,
 basis:"Tagged city gate + connected Khauma/pedestrian topology contradict south-facing baseline. Axis uses first mapped street segment, not measured gate wall normal. Cross-checked against user through-gate composition and aerial junction. Working correction only; exact wall bearing remains approximate.",
 sightline:"East/southeast into western shrine apron, then bends east toward gallery/palace; not a straight north-south corridor or guaranteed Golden Gate axial vista",
 insideEdges:{left:"North-side palace/low frontage direction; exact immediate edge identity unresolved",right:"South-side western shrine/frontage direction; four-pillar Rameshwar and Badrinath lie southeast of mapped gate"},
 visibleThroughOpening:"User through view: pale central shikhara consistent with Vatsala, western pagoda eaves framing it, low brick/timber edges. Qualitative identification, not triangulated object centres",
 sources:["gateNode","gateRoad","squarePath","plan","zone","gatePhoto","gateOther","gateWestern","conservation","userGatePhotos","aerial"],
 blockers:["Exact wall azimuth not independently surveyed", "Individual square-facing facade registration remains uncertain; no permission to treat approximate corrections as VERIFIED"],
};
export const sourceBackedGateSequence=[
 {order:0,group:"Khauma street from west/northwest",basis:"gateRoad + gateNode",confidence:"MEDIUM"},
 {order:1,group:"Khauma gate crossing toward east/southeast",basis:"gateNode + squarePath; provisional wall-normal interpretation",confidence:"MEDIUM"},
 {order:2,group:"Western Char Dham / Krishna shrine apron",basis:"plan + visitorSequence + ntb; four-pillar Rameshwar south/east of gate; Gopinath beyond",confidence:"MEDIUM"},
 {order:3,group:"Kedarnath / southern inn transition",basis:"plan Shiva icon working identity + visitorSequence; exact binding remains provisional",confidence:"LOW"},
 {order:4,group:"Art Gallery / palace edge and central forecourt",basis:"plan + zone; Golden Gate, Malla column, distinct bells, Vatsala and Chyasilin",confidence:"MEDIUM"},
 {order:5,group:"Eastern Siddhi / Silu zone; Yaksheshwar on southern side",basis:"plan + retained opposing central photographs; not a straight sequence through one arch",confidence:"MEDIUM"},
];
export const sceneIdentityAudit={
 tallest:{id:"silu-mahadev",identity:"Silu Mahadev / Phasi Dega",architecture:"Restored brick shikhara, not a five-roof pagoda",approximateHeight:26},
 otherTall:[{id:"vatsala-durga",identity:"Vatsala Durga",approximateHeight:15.95,form:"STONE_SHIKHARA"},{id:"kedarnath",identity:"Kedarnath (provisional)",approximateHeight:15.25,form:"BRICK_SHIKHARA"},{id:"siddhi-lakshmi",identity:"Siddhi Lakshmi",approximateHeight:13.8,form:"STONE_SHIKHARA",distinction:"Five stone plinth terraces do not make this Nyatapola"},{id:"yaksheshwar",identity:"Yaksheshwar / Pashupatinath",approximateHeight:12.3,form:"TWO_ROOF_PAGODA"},{id:"badrinath",identity:"Badrinath",approximateHeight:12.2,form:"BRICK_SHIKHARA"},{id:"gopinath-krishna",identity:"Gopinath / Dwarika (provisional)",approximateHeight:11.6,form:"TWO_ROOF_PAGODA"},{id:"fifty-five-frontage",identity:"55 Window Palace",approximateHeight:10.3,form:"THREE_STOREY_PALACE_FRONTAGE"}],
 rejectedEntity:{id:"jagannath",previousIntendedIdentity:"Jagannath",reason:"Unsupported second Gopinath-like pagoda northwest of gate; photographic identity/side-of-gate inference rejected",trueJagannathLocation:"UNRESOLVED",rendered:false},
 nyatapola:{rendered:false,sourceWay:"85470341",sourceCoordinate:{latitude:27.671409725,longitude:85.4293725},zone:"Taumadhi Square",basis:"Source extract contains named polygon, but all building=temple features are excluded from context rendering and no Nyatapola heritage model exists"},
 taleju:{standaloneTempleRendered:false,represented:["golden-gate","large-bell","distant:relation:18962138"],basis:"Gate, Taleju-associated large bell and distant footprint-only royal courtyard ring; no measured Taleju sanctum or exposed five-storey shrine instantiated"},
};
export type AuditStatus="FROZEN_CONFLICT"|"SOURCE_DISAGREEMENT"|"QUALITATIVE_ONLY"|"UNRESOLVED";
const records:[string,string,Point,number,string|null,AuditStatus,string,string,string][]=[
 ["khauma-gate","Khauma Gate",[-123.4470690087212,-20.894931416111135],-.0235,null,"FROZEN_CONFLICT","MEDIUM","Mapped gate is ~14 m north; current opening axis contradicts eastward street approach","Gate precedes western apron; prior working map point was not a traced gate"],
 ["rameshwar","Rameshwar",[-108.79091736770269,-15.827078835269687],0,"211080701","SOURCE_DISAGREEMENT","LOW","Southeast/right of mapped gate","North of Badrinath; two OSM Rameshwar polygons conflict, UNESCO four-pillar identity retained"],
 ["badrinath","Badrinath",[-108.14847842511578,-1.8714287134175511],Math.PI/2,"211080702","SOURCE_DISAGREEMENT","LOW","Southeast of gate within western group","South of Rameshwar, west of Gopinath; centre/portico not measured"],
 ["kedarnath","Kedarnath",[-68.6646596349556,7.270198373397392],Math.PI/2,"211080703","SOURCE_DISAGREEMENT","LOW","Further southeast along western-to-central transition","East of Gopinath; separate shikhara, identity not inferred from misleading Rameshwor filename"],
 ["gopinath-krishna","Gopinath / Dwarika",[-94.70253638496608,-5.459665059326316],Math.PI/2-.078,"197122572","SOURCE_DISAGREEMENT","LOW","Southeast of gate beyond first shrines","East of Badrinath; plan Krishna binding remains PROVISIONALLY_IDENTIFIED"],
 ["jagannath","Jagannath",[-132.6662259080212,-38.29914928391714],Math.PI/2,null,"UNRESOLVED","LOW","Rejected northwest duplicate; true position unresolved","Misnamed source depicts Gopinath assembly; no guessed Jagannath footprint substituted"],
 ["silu-mahadev","Silu Mahadev / Phasi Dega",[39.00695926997426,-33.080419841077706],-Math.PI/2+.074,"185750794","SOURCE_DISAGREEMENT","MEDIUM","Far eastern/northeastern end, not first structure after gate","Northeast of palace/Siddhi; 26 m is rendering assumption, not survey height"],
 ["siddhi-lakshmi","Siddhi Lakshmi",[19.59568972671957,.5402746051844391],-.135,"211082584","SOURCE_DISAGREEMENT","MEDIUM","Eastern zone beyond central ensemble","Southeast of palace/east of Chyasilin; mapped point ~9 m northwest, previously held out"],
 ["yaksheshwar","Yaksheshwar / Pashupatinath",[-8.076964163653827,28.061882067991192],-.138,"1159652820","SOURCE_DISAGREEMENT","LOW","Southern central side beyond west corridor","South of Vatsala; anonymous OSM outline is a candidate only and disagrees with local POI"],
 ["chyasilin","Chyasilin Mandap",[.38564761185890006,-.1412931212959092],0,"495632745","SOURCE_DISAGREEMENT","MEDIUM","Central zone east of gate","East/northeast of Vatsala; OSM octagon ~7 m northwest of fitted Wikidata-origin position"],
 ["vatsala-durga","Vatsala Durga",[-10.012564711790674,7.277097845494605],0,"1160157266","QUALITATIVE_ONLY","MEDIUM","Central forecourt east/southeast of gate","South of palace, west of Chyasilin, north of Yak; nearby anonymous OSM polygon agrees but identity unconfirmed"],
 ["malla-column","Malla column",[-16.370175677944573,4.531584033885247],0,null,"QUALITATIVE_ONLY","MEDIUM","Central forecourt","Broadly opposite Golden Gate, west of Vatsala; web points cannot separate bell/column precisely"],
 ["large-bell","Large / Taleju bell",[-14.082263006873802,5.484746931956687],0,null,"QUALITATIVE_ONLY","LOW","Central forecourt","Adjacent column and northwest of Vatsala; distinct from small arch"],
 ["vatsala-bell","Vatsala bell",[-13.993626212805736,9.258540586377714],0,null,"QUALITATIVE_ONLY","LOW","Central forecourt","Near Vatsala west/southwest terrace; point inferred, not traced"],
 ["fifty-five-frontage","Royal Palace / 55 Window Palace public frontage",[2.0197052457578195,-5.591761196531143],-.1097,"1159393576","SOURCE_DISAGREEMENT","LOW","Northern edge of central square, after western group","Palace north of central monuments; OSM is whole wing not frontage midpoint, comparison must be scope-matched"],
 ["golden-gate","Golden Gate",[-16.156550051310745,-7.807960143099187],-.0389,null,"QUALITATIVE_ONLY","MEDIUM","Central palace edge, not Khauma entrance","Between Gallery and 55-window facade; broadly north of Malla; exact opening geography unresolved"],
 ["gallery-frontage","Art Gallery",[-41.491195052570205,-9.352576693681785],-.0885,"1159393576","SOURCE_DISAGREEMENT","LOW","Northern central edge after west-to-central approach","West of Golden Gate; frozen facade south of mapped wing edge, prior approximate closure is not independent evidence"],
];
export const monumentPositionAudit=records.map(([id,name,currentCoordinate,currentYaw,sourceWay,status,confidence,gateRelationship,neighbourRelationship])=>{
 const source=sourceWay?snapshot.features.find(f=>f.id===sourceWay):null;
 const ring=source?.rings[0].slice(0,-1),sourcePoint=ring?local(ring.reduce((s,p)=>[s[0]+p[0]/ring.length,s[1]+p[1]/ring.length],[0,0])):null;
 const candidateOnly=["yaksheshwar","vatsala-durga"].includes(id),wholeWing=["fifty-five-frontage","gallery-frontage"].includes(id);
 const baselineCoordinate=currentCoordinate,baselineYaw=currentYaw;
 const correction=spatialCorrections[id],effectiveCoordinate=correction?.coordinate??currentCoordinate,effectiveYaw=correction?.yaw??currentYaw;
 return {id,name,baselineCoordinate,baselineYaw,currentCoordinate:id==="jagannath"?null:effectiveCoordinate,currentGeographic:id==="jagannath"?null:localToGeographic(effectiveCoordinate),currentYaw:id==="jagannath"?null:effectiveYaw,rendered:id!=="jagannath",orientationClassification:"APPROXIMATE local assembly yaw, not surveyed facade bearing",status:correction?"FROZEN_CONFLICT":status,confidence,
  survivesAudit:correction?"CORRECTED_APPROXIMATE":id==="jagannath"?"REJECTED_DUPLICATE":status==="QUALITATIVE_ONLY"?"QUALITATIVE_RELATIONSHIPS_ONLY":"RETAINED_WITH_SOURCE_DISAGREEMENT",gateRelationship,neighbourRelationship,
  relationToGateMetres:id==="jagannath"?null:{east:effectiveCoordinate[0]-mappedGate[0],south:effectiveCoordinate[1]-mappedGate[1]},
  evidenceSources:["plan","zone",...(landmarkSpecifications.find(s=>s.id===id)?.referenceSources??[]),...(remainingSpecificationById[id]?.evidenceSources.map(s=>s.id)??[]),...(westSpecificationById[id]?.positionSource.sourceIds??[]),...(correction?["aerial","userGatePhotos"]:[]),...(source?[`https://www.openstreetmap.org/${source.kind}/${source.id}`]:[]),...(id==="khauma-gate"?["gateNode","gateRoad","squarePath"]:[])],
  sourceComparison:source?{way:source.id,point:sourcePoint,role:wholeWing?"WHOLE_WING_CENTROID_NOT_FACADE":candidateOnly?"UNIDENTIFIED_CANDIDATE":"CONTRIBUTOR_POLYGON_CENTRE",baselineOffsetMetres:wholeWing?null:Math.hypot(currentCoordinate[0]-sourcePoint![0],currentCoordinate[1]-sourcePoint![1]),surveyConfirmed:false}:null,
  proposedCorrection:correction?{...correction,applied:true}:null,
  correctionApplied:!!correction,decision:correction?correction.reason:id==="jagannath"?"Suppress unsupported duplicated pagoda, preserve rejected source record; true Jagannath unresolved":"Retain protected scene; record discrepancy, do not snap uncertain points or rotate world to fit a photograph"};
});
export const spatialAuditDecision={status:"GATE_CORRECTED_MAJOR_RELATIONSHIPS_REVIEWED",buildingWorkAllowed:true,globalTransformChanged:false,monumentsMoved:Object.keys(spatialCorrections),suppressedEntities:["jagannath"],basis:"Coordinate math remains X east / Z south; plan north and source topology do not demonstrate a global 90-degree rotation/reflection. Scope-matched mapped extents plus aerial/photographic topology support explicit approximate per-object corrections, never a global visual adjustment. Column/bell positions remain unresolved. Original source controls remain unchanged."};
