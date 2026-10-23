import {exteriorNames} from "../../game/architecture/khauma-exterior.ts";
import {buildTalejuWorldData} from "../../game/architecture/taleju/precinct.ts";
import {partitionArchitecturalParts} from "./parts.ts";

import {westSpecificationById} from "../../data/reconstruction/architecture/west-specifications.ts";
import {remainingSpecificationById} from "../../data/reconstruction/architecture/remaining-specifications.ts";
import {specificationById} from "../../data/reconstruction/architecture/specifications.ts";
import type {ManualTransform} from "./transforms.ts";
export interface EditableAssembly {id:string;name:string;category:string;classification:string;source:ManualTransform;defaultLocked:boolean;parentId?:string;colliderCount?:number}
export const editorCategories=["GATES","PALACE","TEMPLES","SHRINES","COLUMNS/BELLS","SQUARE EDGES","CONTEXT"];
let cached:EditableAssembly[]|null=null;
export function getEditableRegistry():EditableAssembly[]{if(cached)return cached;const {models:monuments,urban}=buildTalejuWorldData();cached=[...monuments,...urban.models].filter(m=>!m.id.startsWith("distant:")&&!m.id.startsWith("ground:")&&m.id!=="entrance:khauma-road"&&(m.boxes.some(b=>!b.role.includes("collision"))||m.shapes.length||m.profiles.length||m.roofs.length||(m.volumes?.length??0))).map(m=>{
 const edge=urban.buildings.find(b=>b.id===m.id),west=westSpecificationById[m.id];
 const name=m.id.startsWith("taleju:")?"Taleju precinct / "+m.id.slice(7):m.id==="edge:khauma-north-flank:1158762014"?"Khauma school-side wall / lattice gate / guardians":m.id==="entrance:khauma-raised-veranda"?"Khauma raised plastered veranda (identity unresolved)":m.id==="east:small-shikhara-unresolved"?"Eastern small brick shikhara (identity unresolved)":m.id==="khauma-gate"?"Khauma / Old Town Entrance Gate (west square entrance)":west?.identity??remainingSpecificationById[m.id]?.canonicalName??specificationById[m.id]?.canonicalName??edge?.identity??(edge?.groupId.startsWith("9c-")?`Square-edge building ${edge.sourceId}`:null)??(m.id==="palace-corner-shrine-unresolved"?"Palace corner shrine (identity unresolved)":null)??(m.id==="entrance:khauma-masonry-return"?"Khauma low sitting wall":m.id);
 const category=m.id.startsWith("taleju:")?"PALACE":m.id.startsWith("entrance:KhaumaExterior_")?"CONTEXT":edge?.groupId==="9c-palace-depth"?"PALACE":m.id.includes("gate")?"GATES":/frontage/.test(m.id)&&!edge?"PALACE":/bell|column/.test(m.id)?"COLUMNS/BELLS":m.id==="palace-corner-shrine-unresolved"||m.id==="rameshwar"||m.id==="chyasilin"?"SHRINES":m.id.startsWith("entrance:")||m.id.startsWith("edge:khauma")||m.id.startsWith("edge:western-approach")?"CONTEXT":edge?"SQUARE EDGES":"TEMPLES";
 const classification=m.accuracy==="FOOTPRINT_ONLY_CONTEXT"?m.accuracy:m.id.startsWith("context:9c:")?m.accuracy:west?.state==="PROVISIONALLY_IDENTIFIED"||m.id.startsWith("edge:yetachapari:")?"PROVISIONALLY_IDENTIFIED":edge?.classification==="FOOTPRINT_ONLY_CONTEXT"?"FOOTPRINT_ONLY_CONTEXT":edge?.classification==="PHOTO_DERIVED_CONTEXT"||m.id.startsWith("entrance:")?"PHOTO_INFERRED":m.accuracy;
 return {id:m.id,name:m.id.startsWith("entrance:KhaumaExterior_")?exteriorNames[m.id.split("_")[1] as keyof typeof exteriorNames]:name,category,classification,source:{position:[m.origin[0],0,m.origin[1]],rotation:[0,m.yaw,0],scale:[1,1,1]},defaultLocked:true};
 });return cached;}

let partsCache:EditableAssembly[]|null=null;
export function getEditableParts():EditableAssembly[]{if(partsCache)return partsCache;const {models,urban}=buildTalejuWorldData(),all=[...models,...urban.models];partsCache=getEditableRegistry().flatMap(parent=>partitionArchitecturalParts(all.find(m=>m.id===parent.id)!).map(p=>({id:p.id,name:p.name,category:parent.category,classification:parent.classification,source:p.source,defaultLocked:true,parentId:parent.id,colliderCount:p.colliderCount})));return partsCache;}
export const getEditableEntries=()=>[...getEditableRegistry(),...getEditableParts()];
