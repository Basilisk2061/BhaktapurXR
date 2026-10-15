import {Euler,Matrix4,Quaternion,Vector3} from "three";
import type {SolidBox} from "../../game/architecture/geometry.ts";
export type Triple=[number,number,number];
export interface ManualTransform {position:Triple;rotation:Triple;scale:Triple}
export type TransformOverrides=Record<string,ManualTransform>;
export function validateTransform(value:unknown):ManualTransform {
 if(!value||typeof value!=="object"||Array.isArray(value))throw new Error("Transform must be an object");
 const v=value as Record<string,unknown>;if(Object.keys(v).sort().join(",")!=="position,rotation,scale")throw new Error("Only position, rotation and scale are accepted");
 const vector=(key:string,limit:number,min?:number):Triple=>{const a=v[key];if(!Array.isArray(a)||a.length!==3||!a.every(n=>typeof n==="number"&&Number.isFinite(n)&&Math.abs(n)<=limit&&(min===undefined||n>=min)))throw new Error("Invalid "+key);return [...a] as Triple;};
 return {position:vector("position",2000),rotation:vector("rotation",Math.PI*16),scale:vector("scale",20,.01)};
}
export const sameTransform=(a:ManualTransform,b:ManualTransform)=>["position","rotation","scale"].every(k=>a[k as keyof ManualTransform].every((v,i)=>Math.abs(v-b[k as keyof ManualTransform][i])<1e-10));
export const copyTransform=(t:ManualTransform):ManualTransform=>({position:[...t.position],rotation:[...t.rotation],scale:[...t.scale]});
export function transformMatrix(t:ManualTransform){return new Matrix4().compose(new Vector3(...t.position),new Quaternion().setFromEuler(new Euler(...t.rotation,"XYZ")),new Vector3(...t.scale));}
export const overrideMatrix=(source:ManualTransform,current:ManualTransform)=>transformMatrix(current).multiply(transformMatrix(source).invert());
/** Exact affine collider, including shear from nonuniform scaling of rotated compound pieces.
 * Hull vertices are relative to a transformed centre, avoiding distant-world hull precision loss. */
export function transformedCollider(box:SolidBox,source:ManualTransform,current:ManualTransform){
 return affineCollider(box,overrideMatrix(source,current));
}
export function affineCollider(box:SolidBox,delta:Matrix4){
 const centre=new Vector3(...box.position).applyMatrix4(delta);
 if(box.vertices){const vertices:number[]=[];for(let i=0;i<box.vertices.length;i+=3)vertices.push(...new Vector3().fromArray(box.vertices,i).add(new Vector3(...box.position)).applyMatrix4(delta).sub(centre).toArray());return {position:centre.toArray() as Triple,vertices};}
 const piece=new Matrix4().compose(new Vector3(...box.position),new Quaternion().setFromAxisAngle(new Vector3(0,1,0),box.yaw),new Vector3(...box.size));const vertices:number[]=[];
 for(const x of [-.5,.5])for(const y of [-.5,.5])for(const z of [-.5,.5])vertices.push(...new Vector3(x,y,z).applyMatrix4(piece).applyMatrix4(delta).sub(centre).toArray());
 return {position:centre.toArray() as Triple,vertices};
}
export function resolveEditableParent(object:{userData?:Record<string,unknown>;parent?:unknown}|null,ids:ReadonlySet<string>):string|null {let cursor=object;while(cursor){const id=cursor.userData?.editableId;if(typeof id==="string"&&ids.has(id))return id;cursor=cursor.parent as typeof cursor;}return null;}
export function resolveEditor(value:unknown,development:boolean,world:string){return development&&world==="BHAKTAPUR"&&value==="1";}

export function partWorldDelta(assemblySource:ManualTransform,assembly:ManualTransform,partSource:ManualTransform,part:ManualTransform){return transformMatrix(assembly).multiply(transformMatrix(part)).multiply(transformMatrix(partSource).invert()).multiply(transformMatrix(assemblySource).invert());}
