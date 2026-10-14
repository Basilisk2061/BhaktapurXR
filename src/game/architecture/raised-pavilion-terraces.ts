import polygonClipping from "polygon-clipping";
import type {MultiPolygon,Polygon} from "polygon-clipping";
import type {CentralModel} from "./central-model.ts";
import {rectangle} from "./urban-model.ts";
import {contextColliders} from "./urban-occupancy.ts";
import {partitionArchitecturalParts} from "../../features/world-editor/parts.ts";

export const terraceVerticalChanges:Record<string,number>={"gopinath-krishna":.4,rameshwar:1.5,"entrance:khauma-raised-veranda":1.87};
const obsolete=(id:string,role:string)=>id==="gopinath-krishna"?/^west-pagoda-(stepped-plinth|front-access)$/.test(role):id==="rameshwar"?/^rameshwar-(brick-platform|stone-platform-cap|inferred-platform-access)$/.test(role):/^veranda-platform/.test(role);
const signature=(p:{position:number[],size:number[],yaw:number})=>JSON.stringify([p.position,p.size,p.yaw]);
export function integrateRaisedPavilion(model:CentralModel):CentralModel{
 const lift=terraceVerticalChanges[model.id];if(lift===undefined)return model;
 const m=structuredClone(model),removed=new Set(m.boxes.filter(b=>obsolete(m.id,b.role)).map(signature));
 Object.assign(m,{editorPartSources:Object.fromEntries(partitionArchitecturalParts(model).map(p=>[p.id,p.source]))});
 m.boxes=m.boxes.filter(b=>!obsolete(m.id,b.role));m.colliders=m.colliders.filter(c=>!removed.has(signature(c)));
 for(const p of [...m.boxes,...m.profiles,...m.shapes,...m.roofs,...m.colliders])p.position[1]+=lift;
 return m;
}
/** Photograph supports linked levels, not surveyed dimensions. No source trace or X/Z anchor changes. */
export function buildRaisedPavilionTerraces(context:CentralModel[],pagoda:CentralModel):CentralModel{
 const m:CentralModel={id:"terrace:khauma-pavilion",anchorId:"PHOTO_INFORMED_PAVILION_TERRACES",origin:[-108,-20],yaw:0,accuracy:"APPROXIMATE",neutral:false,boxes:[],profiles:[],shapes:[],roofs:[],colliders:[],volumes:[]};
 const collide=(rings:Polygon,height:number,base:number,material:"brick"|"stone",role:string)=>{for(const c of contextColliders(rings,height)){c.position[1]+=base;m.colliders.push(c);m.boxes.push({...c,position:[...c.position],size:[...c.size],material,role:role+"-collision"});}};
 const main:Polygon=[[[-127,-30],[-105,-30],[-103,-27],[-91,-23],[-89,-18],[-90,-8],[-104,-7],[-107,-15],[-127,-17],[-127,-30]]];
 const secondary:Polygon=[[[-126,-28],[-104,-28],[-103.5,-25],[-103.5,-19],[-126,-18.5],[-126,-28]]];
 const pagodaRing:Polygon=[rectangle(pagoda.origin,10,9,pagoda.yaw)];
 // Retain unrelated context: terrace masonry stops at its occupied footprint.
 const exclusions:Polygon[]=context.filter(c=>c.id!=="entrance:khauma-raised-veranda").flatMap(c=>[...(c.volumes??[]).filter(v=>v.baseY<2.1).map(v=>v.rings),...c.colliders.filter(b=>b.position[1]-b.size[1]/2<2.1).map(b=>[rectangle([b.position[0],b.position[2]],b.size[0],b.size[2],b.yaw)])]);
 const cut=(rings:Polygon):MultiPolygon=>exclusions.length?polygonClipping.difference(rings,...exclusions):[rings];
 const mainRings=cut(main),secondaryRings=cut(secondary),pagodaRings=cut(pagodaRing);
 const mainStairs:Polygon[]=[],secondaryStairs:Polygon[]=[],pagodaStairs:Polygon[]=[];
 const step=(ring:Polygon,base:number,height:number,role:string)=>{for(const rings of cut(ring)){m.volumes!.push({rings,baseY:base,height,material:"brick",role});collide(rings,height,base,"brick",role);}};
 for(let i=0;i<5;i++){const ring:Polygon=[rectangle([-109,-31.8+(i+.5)*.36],4.5,.36,0)];mainStairs.push(ring);step(ring,0,(i+1)*.18,"terrace-access-main");}
 for(let i=0;i<7;i++){const ring:Polygon=[rectangle([-109,-30.24+(i+.5)*.32],4,.32,0)];secondaryStairs.push(ring);step(ring,.9,(i+1)*1.2/7,"terrace-access-secondary");}
 for(let i=0;i<5;i++){const z=5.75-i*.35,x=pagoda.origin[0]+Math.sin(pagoda.yaw)*z,wz=pagoda.origin[1]+Math.cos(pagoda.yaw)*z,ring:Polygon=[rectangle([x,wz],3.6,.35,pagoda.yaw)];pagodaStairs.push(ring);step(ring,.9,(i+1)*.18,"terrace-access-pagoda");}
 const add=(pieces:MultiPolygon,base:number,height:number,material:"brick"|"stone",role:string)=>{for(const rings of pieces){m.volumes!.push({rings,baseY:base,height,material,role});collide(rings,height,base,material,role);}};
 const mainSolid=polygonClipping.difference(mainRings,...mainStairs),upperSolid=polygonClipping.difference(secondaryRings,...secondaryStairs),pagodaSolid=polygonClipping.difference(pagodaRings,...pagodaStairs);
 const lowerStone=polygonClipping.intersection(mainSolid,[rectangle([-117,-29.8],19,.4,0)]);
 add(mainSolid,0,.78,"brick","terrace-main");add(polygonClipping.difference(mainSolid,lowerStone),.78,.12,"brick","terrace-main");add(lowerStone,.78,.12,"stone","terrace-stone-main-coping");
 add(upperSolid,.9,1,"brick","terrace-secondary");
 const slab=polygonClipping.intersection(upperSolid,polygonClipping.union([rectangle([-108.55344866743314,-23.32638554145715],6.2,6.2,0)],[rectangle([-119,-23.5],14,9,0)],[rectangle([-115,-27.8],22,.4,0)]));
 add(polygonClipping.difference(upperSolid,slab),1.9,.2,"brick","terrace-secondary");add(slab,1.9,.2,"stone","terrace-stone-upper-slabs");
 add(pagodaSolid,.9,.74,"brick","terrace-pagoda");
 const pagodaCoping=polygonClipping.intersection(pagodaSolid,[rectangle([pagoda.origin[0]+Math.sin(pagoda.yaw)*4.3,pagoda.origin[1]+Math.cos(pagoda.yaw)*4.3],10,.4,pagoda.yaw)]);
 add(polygonClipping.difference(pagodaSolid,pagodaCoping),1.64,.16,"brick","terrace-pagoda");add(pagodaCoping,1.64,.16,"stone","terrace-stone-pagoda-coping");
 return m;
}
