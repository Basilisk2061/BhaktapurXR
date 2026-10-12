import {buildUrbanEnclosure,rectangle,overlaps,streetRectangle,type GroundPatch} from "./urban-model.ts";
import {buildSittingArcade} from "./sitting-arcade.ts";
import {urbanStreetExits} from "../../data/reconstruction/urban-enclosure.ts";
// Render-only openness correction; no Phase 6 polygon, monument or street data changes.
export const openPlazaCorrection={minX:-75,maxX:65,minZ:-12,maxZ:46,classification:"CONTEXT_APPROXIMATE" as const};
export function buildPlazaEnclosure(){const base=buildUrbanEnclosure(),arcade=buildSittingArcade(),r=openPlazaCorrection,clear=rectangle([(r.minX+r.maxX)/2,(r.minZ+r.maxZ)/2],r.maxX-r.minX,r.maxZ-r.minZ,0),arcadeExtent=rectangle(arcade.origin,49,10,Math.PI),removed=base.buildings.filter(b=>overlaps(b.outline,clear)||overlaps(b.outline,arcadeExtent,1));const removedIds=new Set(removed.map(b=>b.id)),buildings=base.buildings.filter(b=>!removedIds.has(b.id)),groundPatches:GroundPatch[]=base.groundPatches.flatMap(p=>{const z=p.z-p.depth/2;if(z>=r.maxZ||z+p.depth<=r.minZ)return [p];const min=p.x-p.width/2,max=p.x+p.width/2;if(max<=r.minX||min>=r.maxX)return [p];const out:GroundPatch[]=[];if(min<r.minX)out.push({...p,x:(min+r.minX)/2,width:r.minX-min});if(max>r.maxX)out.push({...p,x:(r.maxX+max)/2,width:max-r.maxX});return out;});
 // Explicit clearance guard against accidentally closing accepted street connections.
 if(urbanStreetExits.some(e=>arcade.colliders.some(c=>overlaps(rectangle([c.position[0],c.position[2]],c.size[0],c.size[2],c.yaw),streetRectangle(e.from,e.to,e.width)))))throw new Error("Arcade blocks a preserved street exit");
 return {...base,buildings,models:[...base.models.filter(m=>!removedIds.has(m.id)),arcade],groundPatches,removedIds:[...removedIds],movedIds:[],arcade};
}
