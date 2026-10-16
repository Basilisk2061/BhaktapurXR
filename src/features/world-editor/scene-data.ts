import {validateTransform,type ManualTransform,type TransformOverrides} from "./transforms.ts";
export const primitiveTypes=["Block","Cylinder","Plane","Sphere"] as const;
export type PrimitiveType=typeof primitiveTypes[number];
export const editorMaterials={agedBrick:"Brick",carvedTimber:"Dark timber",timber:"Aged timber",roof:"Roof tile",heritageStone:"Stone",heritageStoneShade:"Shaded stone",plaster:"Plaster",paving:"Paving"} as const;
export type EditorMaterial=keyof typeof editorMaterials;
export interface CreatedObject extends ManualTransform {id:string;primitiveType:PrimitiveType;materialId:EditorMaterial;colorOverride:string|null}
export interface SceneSnapshot {version:1;transforms:TransformOverrides;createdObjects:CreatedObject[];hiddenObjects:string[]}
export function validateScene(value:unknown,ids:Set<string>):SceneSnapshot{
 if(!value||typeof value!=="object"||Array.isArray(value))throw new Error("Invalid snapshot");const v=value as Record<string,unknown>;
 if(Object.keys(v).sort().join(',')!=="createdObjects,hiddenObjects,transforms,version"||v.version!==1||!v.transforms||typeof v.transforms!=="object"||Array.isArray(v.transforms)||!Array.isArray(v.createdObjects)||!Array.isArray(v.hiddenObjects)||v.createdObjects.length>500||v.hiddenObjects.length>5000)throw new Error("Invalid scene fields");
 const transforms:TransformOverrides={};for(const [id,t]of Object.entries(v.transforms)){if(!ids.has(id))throw new Error("Unregistered transform");transforms[id]=validateTransform(t);}
 const seen=new Set<string>();const createdObjects=v.createdObjects.map((raw:unknown)=>{if(!raw||typeof raw!=="object")throw new Error("Invalid object");const o=raw as CreatedObject;if(Object.keys(o).sort().join(',')!=="colorOverride,id,materialId,position,primitiveType,rotation,scale"||typeof o.id!=="string"||!primitiveTypes.includes(o.primitiveType)||!new RegExp(`^Editor_${o.primitiveType}_[0-9]{3,12}$`).test(o.id)||seen.has(o.id)||!Object.hasOwn(editorMaterials,o.materialId)||(o.colorOverride!==null&&!/^#[0-9a-f]{6}$/i.test(o.colorOverride)))throw new Error("Invalid primitive");seen.add(o.id);return {...validateTransform({position:o.position,rotation:o.rotation,scale:o.scale}),id:o.id,primitiveType:o.primitiveType,materialId:o.materialId,colorOverride:o.colorOverride};});
 const hiddenObjects=[...new Set(v.hiddenObjects as unknown[])];if(!hiddenObjects.every(id=>typeof id==="string"&&ids.has(id)))throw new Error("Unregistered hidden object");return {version:1,transforms,createdObjects,hiddenObjects:hiddenObjects as string[]};
}
