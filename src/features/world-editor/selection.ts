import type {Intersection,Object3D} from "three";
import {resolveEditableParent} from "./transforms.ts";
import type {EditableAssembly} from "./registry.ts";
export function selectionCandidates(hits:Intersection[],entries:EditableAssembly[],mode:"assembly"|"part"){
 const ids=new Set(entries.map(e=>e.id)),byId=new Map(entries.map(e=>[e.id,e])),result:string[]=[];
 for(const hit of hits){let visible=true;for(let o:Object3D|null=hit.object;o;o=o.parent)if(!o.visible){visible=false;break;}if(!visible)continue;
  let id=resolveEditableParent(hit.object,ids);if(mode==="part"){
   const partIds=hit.object.userData.partIds as string[]|undefined,ranges=(hit.object as import("three").Mesh).geometry?.userData.partRanges as {end:number;id:string}[]|undefined;
   id=hit.instanceId!==undefined?partIds?.[hit.instanceId]??id:hit.faceIndex!==undefined&&hit.faceIndex!==null?ranges?.find(r=>hit.faceIndex!<r.end)?.id??id:id;
  }else if(id)id=byId.get(id)?.parentId??id;
  if(id&&ids.has(id)&&!result.includes(id))result.push(id);
 }
 return result;
}
