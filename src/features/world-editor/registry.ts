import {buildSpatiallyAuditedModels} from "../../game/architecture/spatially-audited-models.ts";
import {buildSquareEdge} from "../../game/architecture/square-edge-models.ts";
import {westSpecificationById} from "../../data/reconstruction/architecture/west-specifications.ts";
import {remainingSpecificationById} from "../../data/reconstruction/architecture/remaining-specifications.ts";
import {specificationById} from "../../data/reconstruction/architecture/specifications.ts";
import type {ManualTransform} from "./transforms.ts";
export interface EditableAssembly {id:string;name:string;category:string;classification:string;source:ManualTransform;defaultLocked:boolean}
export const editorCategories=["GATES","PALACE","TEMPLES","SHRINES","COLUMNS/BELLS","SQUARE EDGES","CONTEXT"];
let cached:EditableAssembly[]|null=null;
export function getEditableRegistry():EditableAssembly[]{if(cached)return cached;const monuments=buildSpatiallyAuditedModels(),urban=buildSquareEdge(monuments);cached=[...monuments,...urban.models].filter(m=>!m.id.startsWith("distant:")&&m.id!=="entrance:khauma-road"&&(m.boxes.some(b=>!b.role.includes("collision"))||m.shapes.length||m.profiles.length||m.roofs.length||(m.volumes?.length??0))).map(m=>{
 const edge=urban.buildings.find(b=>b.id===m.id),west=westSpecificationById[m.id];
 const name=west?.identity??remainingSpecificationById[m.id]?.canonicalName??specificationById[m.id]?.canonicalName??edge?.identity??(m.id==="entrance:khauma-masonry-return"?"Khauma low sitting wall":m.id);
 const category=m.id.includes("gate")?"GATES":/frontage/.test(m.id)&&!edge?"PALACE":/bell|column/.test(m.id)?"COLUMNS/BELLS":m.id==="rameshwar"||m.id==="chyasilin"?"SHRINES":m.id.startsWith("entrance:")||m.id.startsWith("edge:khauma")||m.id.startsWith("edge:western-approach")?"CONTEXT":edge?"SQUARE EDGES":"TEMPLES";
 const classification=west?.state==="PROVISIONALLY_IDENTIFIED"||m.id.startsWith("edge:yetachapari:")?"PROVISIONALLY_IDENTIFIED":edge?.classification==="PHOTO_DERIVED_CONTEXT"||m.id.startsWith("entrance:")?"PHOTO_INFERRED":m.accuracy;
 return {id:m.id,name,category,classification,source:{position:[m.origin[0],0,m.origin[1]],rotation:[0,m.yaw,0],scale:[1,1,1]},defaultLocked:true};
 });return cached;}
