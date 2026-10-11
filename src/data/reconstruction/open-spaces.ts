import {mainPlazaPixels,currentObjects} from "./bhaktapur-current.ts";
import {planToMetres} from "./calibration.ts";
import type {Point,AccuracyClass} from "./types.ts";
export const openSpaceCategories=["PRIMARY_PLAZA","SECONDARY_PLAZA","CONNECTING_OPEN_SPACE","PALACE_FORECOURT","MONUMENT_PLATFORM","STREET_CONNECTION"] as const;
export interface OpenSpace {id:string;category:typeof openSpaceCategories[number];polygon:Point[];accuracyClass:AccuracyClass;sourceReferences:string[];notes:string}
const space=(id:string,category:OpenSpace["category"],pixels:Point[],notes:string,refs=["dh-plan","central-pair-2021","central-reverse-2021"]):OpenSpace=>({id,category,polygon:pixels.map(planToMetres),accuracyClass:"APPROXIMATE",sourceReferences:refs,notes});
export const openSpaces:OpenSpace[]=[
 space("primary","PRIMARY_PLAZA",mainPlazaPixels,"Original Phase 6A analyst review envelope unchanged. Not full square, legal boundary or all walkable land."),
 space("southern","SECONDARY_PLAZA",[[725,433],[811,433],[829,493],[793,518],[725,502],[714,462]],"Approximate southern paving envelope around Yaksheshwar. Contains monument areas; no net walkable-area claim."),
 space("eastern-link","CONNECTING_OPEN_SPACE",[[916,270],[1020,270],[1032,294],[1016,340],[914,341]],"Approximate connection from primary strip toward Silu's southern platform edge; widths/limits require manual review.",["dh-plan","local-silu","silu-photo-2022"]),
 space("forecourt","PALACE_FORECOURT",[[555,308],[724,326],[868,343],[866,355],[753,351],[553,321]],"Overlaps primary plaza: frontage-adjacent public space, not a separately additive area."),
 ...["vatsala-durga","siddhi-lakshmi","silu-mahadev"].map(id=>({id:`platform-${id}`,category:"MONUMENT_PLATFORM" as const,polygon:currentObjects.find(o=>o.id===id)!.footprint!,accuracyClass:"SOURCE_DERIVED" as const,sourceReferences:["dh-plan",id==="siddhi-lakshmi"?"unesco-restoration":id==="silu-mahadev"?"silu-photo-2022":"nhdp-vatsala"],notes:"Existing schematic platform/outline extent; current as-built boundary approximate. Not new measured geometry."})),
 space("southern-street","STREET_CONNECTION",[[806,433],[816,433],[825,455],[815,458]],"Approximate southern connection corridor indicated by schematic; access width/legal walkability unverified."),
];
export const openSpacePolicy="Categories overlap and may contain monument/platform areas; do not sum their areas or treat filled shapes as collision/walkability data. No monument moved to fit an envelope. All added limits are analyst interpretations awaiting human approval.";
