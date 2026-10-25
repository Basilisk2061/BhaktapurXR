import {currentOverrides} from "../../features/world-editor/saved-overrides.ts";
import type {CentralModel} from "./central-model.ts";

// Source ownership: square-edge-models' neutral 3.2m OSM footprint extrusion,
// or inside-square-models' explicitly unresolved footprint-only conversion.
// Never infer placeholder status from colour or a context:/distant: ID prefix.
const coarseRoles=new Set(["footprint-only-distant-massing","unresolved-footprint-only-context"]);
const editedIds=new Set(Object.keys(currentOverrides()));
export function obsoletePlaceholderMassing(model:CentralModel):boolean{
 // Preserve both parent edits and independently edited architectural parts.
 if([...editedIds].some(id=>id===model.id||id.startsWith(model.id+"/")))return false;
 return model.neutral&&(model.accuracy==="PLACEHOLDER"||model.accuracy==="FOOTPRINT_ONLY_CONTEXT")
  &&!!model.volumes?.length&&model.volumes.every(v=>coarseRoles.has(v.role))
  &&model.boxes.length===0&&model.profiles.length===0&&model.shapes.length===0
  &&model.roofs.length===0&&!(model.polygonRoofs?.length);
}
