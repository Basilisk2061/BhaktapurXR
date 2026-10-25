import {currentOverrides} from "../../features/world-editor/saved-overrides.ts";
import polygonClipping from "polygon-clipping";
import type {MultiPolygon,Polygon} from "polygon-clipping";
import type {CentralModel} from "./central-model.ts";
import {rectangle} from "./urban-model.ts";
import {walkableFloorColliders} from "./walkable-floor-colliders.ts";
import {partitionArchitecturalParts} from "../../features/world-editor/parts.ts";

export const terraceVerticalChanges:Record<string,number>={rameshwar:1.5,"entrance:khauma-raised-veranda":1.87};
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
/** Independent photo-informed platforms. Existing architecture and vertical integration stay unchanged. */
export function buildRaisedPavilionTerraces(context:CentralModel[],pagoda:CentralModel):CentralModel{
 const m:CentralModel={id:"terrace:khauma-pavilion",anchorId:"PHOTO_INFORMED_INDEPENDENT_PLATFORMS",origin:[-108,-20],yaw:0,accuracy:"APPROXIMATE",neutral:false,boxes:[],profiles:[],shapes:[],roofs:[],colliders:[],volumes:[]};
 const exclusions:Polygon[]=context.filter(c=>c.id!=="entrance:khauma-raised-veranda").flatMap(c=>[...(c.volumes??[]).filter(v=>v.baseY<2.1).map(v=>v.rings),...c.colliders.filter(b=>b.position[1]-b.size[1]/2<2.1).map(b=>[rectangle([b.position[0],b.position[2]],b.size[0],b.size[2],b.yaw)])]);
 const cut=(rings:Polygon):MultiPolygon=>exclusions.length?polygonClipping.difference(rings,...exclusions):[rings];
 const add=(pieces:MultiPolygon,base:number,height:number,material:"brick"|"stone",role:string)=>{for(const rings of pieces){m.volumes!.push({rings,baseY:base,height,material,role});for(const c of walkableFloorColliders(rings,height)){c.position[1]+=base;m.colliders.push(c);m.boxes.push({...c,position:[...c.position],size:[...c.size],material,role:role+"-collision"});}}};
 const localPagoda=(z:number):[number,number]=>[pagoda.origin[0]+Math.sin(pagoda.yaw)*z,pagoda.origin[1]+Math.cos(pagoda.yaw)*z];
 // Gopinath: two substantial masonry terraces and a final temple-floor course.
 // Stair slot is removed from every layer, so no hidden tall collider crosses the treads.
 const stairSlot:Polygon=[rectangle(localPagoda(6.25),2.5,3.6,pagoda.yaw)];
 const pagodaLayer=(w:number,d:number,base:number,height:number,role:string)=>
  add(polygonClipping.difference(cut([rectangle(pagoda.origin,w,d,pagoda.yaw)]),stairSlot),base,height,"brick",role);
 pagodaLayer(14.2,12.2,0,.52,"pagoda-platform-lower-masonry");
 pagodaLayer(14.4,12.4,.52,.12,"pagoda-platform-lower-projecting-course");
 pagodaLayer(12.8,10.8,.64,.72,"pagoda-platform-upper-masonry");
 pagodaLayer(13,11,1.36,.14,"pagoda-platform-upper-projecting-course");
 pagodaLayer(11.8,9.8,1.5,.2,"pagoda-platform-temple-floor");
 pagodaLayer(12,10,1.7,.1,"pagoda-platform-floor-coping");
 for(let i=0;i<10;i++){
  const tread:Polygon=[rectangle(localPagoda(7.87-i*.36),2.5,.36,pagoda.yaw)];
  add(cut(tread),0,(i+1)*.18,"brick","pagoda-platform-access");
 }
 // A single masonry block and structural cap; no front stair or shared terrace.
 const pavilion:[number,number]=[-108.55344866743314,-23.32638554145715];
 add(cut([rectangle(pavilion,5.9,5.9,0)]),0,1.9,"brick","pavilion-platform");
 add(cut([rectangle(pavilion,6.2,6.2,0)]),1.9,.2,"stone","pavilion-stone-cap");
 // Site only the new platform to the current edited veranda position; do not alter/bake its override.
 const source=context.find(c=>c.id==="entrance:khauma-raised-veranda")!;
 const edited=currentOverrides()[source.id];
 const veranda:[number,number]=edited?[edited.position[0],edited.position[2]]:[...source.origin];
 const verandaAccess:Polygon[]=[];
 for(let i=0;i<6;i++){const ring:Polygon=[rectangle([veranda[0],veranda[1]-6.7+(i+.5)*.32],2.5,.32,0)];verandaAccess.push(ring);add(cut(ring),0,(i+1)*.15,"brick","veranda-platform-access");}
 const verandaLow=polygonClipping.union([rectangle(veranda,10,9.6,0)],[rectangle([veranda[0],veranda[1]-4.65],2.5,.3,0)]);
 add(polygonClipping.difference(verandaLow,...exclusions,...verandaAccess),0,.9,"brick","veranda-platform");
 const verandaUpperAccess:Polygon[]=[];
 for(let i=0;i<7;i++){const ring:Polygon=[rectangle([veranda[0],veranda[1]-4.8+(i+.5)*.32],2.5,.32,0)];verandaUpperAccess.push(ring);add(cut(ring),.9,(i+1)*1.2/7,"brick","veranda-platform-access");}
 const verandaUpper=polygonClipping.difference(cut([rectangle(veranda,9.5,8.7,0)]),...verandaUpperAccess);
 add(verandaUpper,.9,1,"brick","veranda-platform");add(verandaUpper,1.9,.2,"stone","veranda-platform-coping");
 return m;
}
